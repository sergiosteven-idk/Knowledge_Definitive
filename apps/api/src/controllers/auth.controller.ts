import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { loginSchema, refreshSchema, registerSchema } from '../schemas/auth.schema.js';

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details: parsed.error.flatten() } });
  }
  const { miembro, accessToken, refreshToken } = await authService.register(
    parsed.data.nombre,
    parsed.data.apellido,
    parsed.data.email,
    parsed.data.password,
    parsed.data.tipoUsuario
  );
  res.status(201).json({
    usuario: {
      id: miembro.idUsuario,
      nombre: miembro.nombre,
      apellido: miembro.apellido,
      email: miembro.correo,
      tipoUsuario: miembro.tipoUsuario
    },
    accessToken,
    refreshToken
  });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos' } });
  }

  const { miembro, accessToken, refreshToken } = await authService.login(parsed.data.email, parsed.data.password);
  res.json({
    usuario: {
      id: miembro.idUsuario,
      nombre: miembro.nombre,
      apellido: miembro.apellido,
      email: miembro.correo,
      tipoUsuario: miembro.tipoUsuario
    },
    accessToken,
    refreshToken
  });
};

export const refresh = async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Token requerido' } });
  }
  const tokens = await authService.refresh(parsed.data.refreshToken);
  res.json(tokens);
};

export const logout = async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Token requerido' } });
  }
  await authService.logout(parsed.data.refreshToken);
  res.status(204).send();
};
