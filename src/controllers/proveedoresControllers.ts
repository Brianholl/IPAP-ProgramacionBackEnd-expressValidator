import type { Request, Response, NextFunction } from 'express';
import ProveedoresModel from '../models/proveedoresModels.js';
import { ErrorHttp } from '../middleware/errores.js';
import { leerId, exigirCampos, tomarCampos, camposParciales } from '../utils/validaciones.js';

const CAMPOS = ['nombre_empresa', 'contacto', 'telefono', 'email', 'direccion', 'cuit'];

class ProveedoresController {
  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await ProveedoresModel.obtenerTodos({ nombre: req.query.nombre as string }));
    } catch (err) {
      next(err);
    }
  }

  async estadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await ProveedoresModel.obtenerEstadisticas());
    } catch (err) {
      next(err);
    }
  }

  async consultarDetalle(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await ProveedoresModel.obtenerPorId(leerId(req.params.id));
      if (!dato) throw new ErrorHttp(404, 'Proveedor no encontrado');
      res.status(200).json(dato);
    } catch (err) {
      next(err);
    }
  }

  async ingresar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, CAMPOS);
      const nuevo = await ProveedoresModel.crear(tomarCampos(req.body, CAMPOS) as any);
      res.status(201).json({ mensaje: 'Proveedor creado con éxito', dato: nuevo });
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, CAMPOS);
      const dato = await ProveedoresModel.actualizar(leerId(req.params.id), tomarCampos(req.body, CAMPOS));
      res.status(200).json({ mensaje: 'Proveedor actualizado con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async actualizarParcial(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await ProveedoresModel.actualizar(leerId(req.params.id), camposParciales(req.body, CAMPOS));
      res.status(200).json({ mensaje: 'Proveedor actualizado con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await ProveedoresModel.eliminar(leerId(req.params.id));
      res.status(200).json({ mensaje: 'Proveedor eliminado con éxito' });
    } catch (err) {
      next(err);
    }
  }

  // GET /proveedores/:id/productos
  async productos(req: Request, res: Response, next: NextFunction) {
    try {
      const proveedor = await ProveedoresModel.obtenerConProductos(leerId(req.params.id));
      if (!proveedor) throw new ErrorHttp(404, 'Proveedor no encontrado');
      res.status(200).json({ proveedor: proveedor.nombre_empresa, total: proveedor.productos.length, productos: proveedor.productos });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProveedoresController();
