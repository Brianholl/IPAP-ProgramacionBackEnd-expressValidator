import type { Request, Response, NextFunction } from 'express';
import CategoriasModel from '../models/categoriasModels.js';
import { ErrorHttp } from '../middleware/errores.js';
import { leerId, exigirCampos, tomarCampos, camposParciales } from '../utils/validaciones.js';

const CAMPOS = ['nombre', 'descripcion'];

class CategoriasController {
  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await CategoriasModel.obtenerTodos());
    } catch (err) {
      next(err);
    }
  }

  async estadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await CategoriasModel.obtenerEstadisticas());
    } catch (err) {
      next(err);
    }
  }

  async consultarDetalle(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await CategoriasModel.obtenerPorId(leerId(req.params.id));
      if (!dato) throw new ErrorHttp(404, 'Categoría no encontrada');
      res.status(200).json(dato);
    } catch (err) {
      next(err);
    }
  }

  async ingresar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, ['nombre']);
      const nuevo = await CategoriasModel.crear(tomarCampos(req.body, CAMPOS) as any);
      res.status(201).json({ mensaje: 'Categoría creada con éxito', dato: nuevo });
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, ['nombre']);
      const dato = await CategoriasModel.actualizar(leerId(req.params.id), tomarCampos(req.body, CAMPOS));
      res.status(200).json({ mensaje: 'Categoría actualizada con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async actualizarParcial(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await CategoriasModel.actualizar(leerId(req.params.id), camposParciales(req.body, CAMPOS));
      res.status(200).json({ mensaje: 'Categoría actualizada con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoriasModel.eliminar(leerId(req.params.id));
      res.status(200).json({ mensaje: 'Categoría eliminada con éxito' });
    } catch (err) {
      next(err);
    }
  }
}

export default new CategoriasController();
