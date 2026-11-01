import type { Request, Response, NextFunction } from 'express';
import CompaniasEnvioModel from '../models/companiasEnvioModels.js';
import { ErrorHttp } from '../middleware/errores.js';
import { leerId, exigirCampos, tomarCampos, camposParciales } from '../utils/validaciones.js';

const CAMPOS = ['nombre', 'telefono', 'email'];

class CompaniasEnvioController {
  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await CompaniasEnvioModel.obtenerTodos());
    } catch (err) {
      next(err);
    }
  }

  async estadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await CompaniasEnvioModel.obtenerEstadisticas());
    } catch (err) {
      next(err);
    }
  }

  async consultarDetalle(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await CompaniasEnvioModel.obtenerPorId(leerId(req.params.id));
      if (!dato) throw new ErrorHttp(404, 'Compañía de envío no encontrada');
      res.status(200).json(dato);
    } catch (err) {
      next(err);
    }
  }

  async ingresar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, CAMPOS);
      const nuevo = await CompaniasEnvioModel.crear(tomarCampos(req.body, CAMPOS) as any);
      res.status(201).json({ mensaje: 'Compañía de envío creada con éxito', dato: nuevo });
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, CAMPOS);
      const dato = await CompaniasEnvioModel.actualizar(leerId(req.params.id), tomarCampos(req.body, CAMPOS));
      res.status(200).json({ mensaje: 'Compañía de envío actualizada con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async actualizarParcial(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await CompaniasEnvioModel.actualizar(leerId(req.params.id), camposParciales(req.body, CAMPOS));
      res.status(200).json({ mensaje: 'Compañía de envío actualizada con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await CompaniasEnvioModel.eliminar(leerId(req.params.id));
      res.status(200).json({ mensaje: 'Compañía de envío eliminada con éxito' });
    } catch (err) {
      next(err);
    }
  }
}

export default new CompaniasEnvioController();
