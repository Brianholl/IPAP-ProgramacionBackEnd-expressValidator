import type { Request, Response, NextFunction } from 'express';
import ClientesModel from '../models/clientesModels.js';
import { ErrorHttp } from '../middleware/errores.js';
import { leerId, exigirCampos, tomarCampos, camposParciales } from '../utils/validaciones.js';

const CAMPOS = ['nombre', 'cuit_dni', 'telefono', 'email', 'direccion', 'ciudad'];

class ClientesController {
  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await ClientesModel.obtenerTodos({ ciudad: req.query.ciudad as string, busqueda: req.query.busqueda as string }));
    } catch (err) {
      next(err);
    }
  }

  async estadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await ClientesModel.obtenerEstadisticas());
    } catch (err) {
      next(err);
    }
  }

  async consultarDetalle(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await ClientesModel.obtenerPorId(leerId(req.params.id));
      if (!dato) throw new ErrorHttp(404, 'Cliente no encontrado');
      res.status(200).json(dato);
    } catch (err) {
      next(err);
    }
  }

  async ingresar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, CAMPOS);
      const nuevo = await ClientesModel.crear(tomarCampos(req.body, CAMPOS) as any);
      res.status(201).json({ mensaje: 'Cliente creado con éxito', dato: nuevo });
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, CAMPOS);
      const dato = await ClientesModel.actualizar(leerId(req.params.id), tomarCampos(req.body, CAMPOS));
      res.status(200).json({ mensaje: 'Cliente actualizado con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async actualizarParcial(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await ClientesModel.actualizar(leerId(req.params.id), camposParciales(req.body, CAMPOS));
      res.status(200).json({ mensaje: 'Cliente actualizado con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await ClientesModel.eliminar(leerId(req.params.id));
      res.status(200).json({ mensaje: 'Cliente eliminado con éxito' });
    } catch (err) {
      next(err);
    }
  }

  // GET /clientes/:id/pedidos
  async pedidos(req: Request, res: Response, next: NextFunction) {
    try {
      const id = leerId(req.params.id);
      const cliente = await ClientesModel.obtenerPorId(id);
      if (!cliente) throw new ErrorHttp(404, 'Cliente no encontrado');
      const pedidos = await ClientesModel.obtenerPedidos(id);
      res.status(200).json({ cliente: cliente.nombre, total: pedidos.length, pedidos });
    } catch (err) {
      next(err);
    }
  }
}

export default new ClientesController();
