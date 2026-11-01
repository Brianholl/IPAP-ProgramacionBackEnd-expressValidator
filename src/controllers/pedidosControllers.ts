import type { Request, Response, NextFunction } from 'express';
import PedidosModel from '../models/pedidosModels.js';
import { ErrorHttp } from '../middleware/errores.js';
import { leerId, exigirCampos } from '../utils/validaciones.js';
import { EstadoPedido } from '../generated/prisma/enums.js';

const ESTADOS = Object.values(EstadoPedido);

const validarEstado = (estado: unknown) => {
  if (estado !== undefined && !ESTADOS.includes(estado as EstadoPedido)) {
    throw new ErrorHttp(400, `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}`);
  }
  return estado as EstadoPedido | undefined;
};

class PedidosController {
  // GET /pedidos
  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      const { estado, clienteId, empleadoId } = req.query;
      const pedidos = await PedidosModel.obtenerTodos({
        estado: validarEstado(estado),
        clienteId: clienteId ? leerId(clienteId) : undefined,
        empleadoId: empleadoId ? leerId(empleadoId) : undefined
      });
      res.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  }

  async estadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await PedidosModel.obtenerEstadisticas());
    } catch (err) {
      next(err);
    }
  }

  async consultarDetalle(req: Request, res: Response, next: NextFunction) {
    try {
      const pedido = await PedidosModel.obtenerPorId(leerId(req.params.id));
      if (!pedido) throw new ErrorHttp(404, 'Pedido no encontrado');
      res.status(200).json(pedido);
    } catch (err) {
      next(err);
    }
  }

  async ingresar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, ['numero_factura', 'id_cliente', 'id_empleado', 'id_compania_envio', 'items']);
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        throw new ErrorHttp(400, 'El pedido debe tener al menos un producto en "items"');
      }
      for (const item of items) {
        leerId(item?.id_producto);
        if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
          throw new ErrorHttp(400, 'Cada item necesita id_producto y una cantidad entera mayor a 0');
        }
      }

      const pedido = await PedidosModel.crear({
        numero_factura: req.body.numero_factura,
        id_cliente: leerId(req.body.id_cliente),
        id_empleado: leerId(req.body.id_empleado),
        id_compania_envio: leerId(req.body.id_compania_envio),
        estado: validarEstado(req.body.estado),
        items
      });
      res.status(201).json({ mensaje: 'Pedido registrado con éxito', pedido });
    } catch (err) {
      next(err);
    }
  }

  // PUT y PATCH /pedidos/:id (solo estado o compañía de envío)
  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { estado, id_compania_envio } = req.body ?? {};
      if (estado === undefined && id_compania_envio === undefined) {
        throw new ErrorHttp(400, 'Debe enviar estado o id_compania_envio');
      }
      const pedido = await PedidosModel.actualizar(leerId(req.params.id), {
        estado: validarEstado(estado),
        id_compania_envio: id_compania_envio === undefined ? undefined : leerId(id_compania_envio)
      });
      res.status(200).json({ mensaje: 'Pedido actualizado con éxito', pedido });
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await PedidosModel.eliminar(leerId(req.params.id));
      res.status(200).json({ mensaje: 'Pedido eliminado con éxito' });
    } catch (err) {
      next(err);
    }
  }
}

export default new PedidosController();
