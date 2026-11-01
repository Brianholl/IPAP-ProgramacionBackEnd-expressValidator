import type { Request, Response, NextFunction } from 'express';
import EmpleadosModel from '../models/empleadosModels.js';
import { ErrorHttp } from '../middleware/errores.js';
import { leerId, exigirCampos, tomarCampos, camposParciales } from '../utils/validaciones.js';

const CAMPOS = ['nombre', 'apellido', 'dni', 'cargo', 'email', 'telefono', 'fecha_ingreso'];

// prisma necesita la fecha como Date
const convertirFecha = (datos: any) => {
  if (datos.fecha_ingreso !== undefined) {
    const fecha = new Date(datos.fecha_ingreso);
    if (isNaN(fecha.getTime())) throw new ErrorHttp(400, 'fecha_ingreso no es una fecha válida (AAAA-MM-DD)');
    datos.fecha_ingreso = fecha;
  }
  return datos;
};

class EmpleadosController {
  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await EmpleadosModel.obtenerTodos({ cargo: req.query.cargo as string }));
    } catch (err) {
      next(err);
    }
  }

  async estadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await EmpleadosModel.obtenerEstadisticasVentas());
    } catch (err) {
      next(err);
    }
  }

  async consultarDetalle(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await EmpleadosModel.obtenerPorId(leerId(req.params.id));
      if (!dato) throw new ErrorHttp(404, 'Empleado no encontrado');
      res.status(200).json(dato);
    } catch (err) {
      next(err);
    }
  }

  async ingresar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, CAMPOS);
      const nuevo = await EmpleadosModel.crear(convertirFecha(tomarCampos(req.body, CAMPOS)));
      res.status(201).json({ mensaje: 'Empleado creado con éxito', dato: nuevo });
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, CAMPOS);
      const dato = await EmpleadosModel.actualizar(leerId(req.params.id), convertirFecha(tomarCampos(req.body, CAMPOS)));
      res.status(200).json({ mensaje: 'Empleado actualizado con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async actualizarParcial(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await EmpleadosModel.actualizar(leerId(req.params.id), convertirFecha(camposParciales(req.body, CAMPOS)));
      res.status(200).json({ mensaje: 'Empleado actualizado con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await EmpleadosModel.eliminar(leerId(req.params.id));
      res.status(200).json({ mensaje: 'Empleado eliminado con éxito' });
    } catch (err) {
      next(err);
    }
  }
}

export default new EmpleadosController();
