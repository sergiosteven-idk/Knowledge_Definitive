import { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';

export const listRolesPermisos = async (_req: Request, res: Response) => {
  const data = await adminService.listRoles();
  res.json(data);
};

export const createRol = async (req: Request, res: Response) => {
  const rol = await adminService.createRol(req.body.nombre, req.body.descripcion);
  res.status(201).json(rol);
};

export const assignPermiso = async (req: Request, res: Response) => {
  const data = await adminService.assignPermiso(Number(req.params.rolId), req.body.permisoId);
  res.status(201).json(data);
};

export const assignRol = async (req: Request, res: Response) => {
  const data = await adminService.assignRol(req.body.usuarioId, req.body.rolId);
  res.status(201).json(data);
};
