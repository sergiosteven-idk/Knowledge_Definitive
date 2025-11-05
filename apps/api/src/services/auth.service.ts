import { TipoUsuario } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const ACCESS_COST = 12;
const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 15;

const generateTokens = async (userId: number, email: string) => {
  const accessToken = jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });
  const refreshToken = jwt.sign({ userId, email, type: 'refresh' }, env.JWT_SECRET, {
    expiresIn: env.REFRESH_EXPIRES
  });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      miembroId: userId,
      expiresAt
    }
  });

  return { accessToken, refreshToken };
};

export const authService = {
  async register(nombre: string, apellido: string, email: string, password: string, tipo?: string) {
    const hashed = await bcrypt.hash(password, ACCESS_COST);

    const miembro = await prisma.miembro.create({
      data: {
        nombre,
        apellido,
        correo: email,
        contrasena: hashed,
        tipoUsuario: (tipo as TipoUsuario | undefined) ?? 'estudiante',
        seguridad: { create: {} }
      }
    });

    const rolEstudiante = await prisma.rol.findUnique({ where: { nombreRol: 'estudiante' } });
    if (rolEstudiante) {
      await prisma.usuarioRol.create({ data: { idUsuario: miembro.idUsuario, idRol: rolEstudiante.idRol } });
    }

    const tokens = await generateTokens(miembro.idUsuario, miembro.correo);
    return { miembro, ...tokens };
  },

  async login(email: string, password: string) {
    const miembro = await prisma.miembro.findUnique({
      where: { correo: email },
      include: { seguridad: true }
    });
    if (!miembro) {
      throw Object.assign(new Error('Credenciales inválidas'), { status: 401, code: 'INVALID_CREDENTIALS' });
    }

    if (!miembro.seguridad) {
      miembro.seguridad = await prisma.miembroSeguridad.create({ data: { miembroId: miembro.idUsuario } });
    }

    if (miembro.seguridad.bloqueadoHasta && miembro.seguridad.bloqueadoHasta > new Date()) {
      throw Object.assign(new Error('Cuenta temporalmente bloqueada'), { status: 423, code: 'ACCOUNT_LOCKED' });
    }

    const match = await bcrypt.compare(password, miembro.contrasena);
    if (!match) {
      const intentos = miembro.seguridad.intentosFallidos + 1;
      const updates: any = { intentosFallidos: intentos };
      if (intentos >= MAX_INTENTOS) {
        updates.bloqueadoHasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60 * 1000);
        updates.intentosFallidos = 0;
      }
      await prisma.miembroSeguridad.update({ where: { miembroId: miembro.idUsuario }, data: updates });
      throw Object.assign(new Error('Credenciales inválidas'), { status: 401, code: 'INVALID_CREDENTIALS' });
    }

    await prisma.miembroSeguridad.update({
      where: { miembroId: miembro.idUsuario },
      data: { intentosFallidos: 0, bloqueadoHasta: null }
    });

    const tokens = await generateTokens(miembro.idUsuario, miembro.correo);
    return { miembro, ...tokens };
  },

  async refresh(refreshToken: string) {
    const tokenRecord = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw Object.assign(new Error('Token inválido'), { status: 401, code: 'INVALID_REFRESH' });
    }

    try {
      const payload = jwt.verify(refreshToken, env.JWT_SECRET) as { userId: number; email: string };
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      return generateTokens(payload.userId, payload.email);
    } catch (error) {
      logger.error('Error refrescando token', { error });
      await prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => null);
      throw Object.assign(new Error('Token inválido'), { status: 401, code: 'INVALID_REFRESH' });
    }
  },

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
};
