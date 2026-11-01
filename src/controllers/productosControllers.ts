import type { Request, Response, NextFunction } from 'express';
import ProductosModel, { type FiltrosProductos } from '../models/productosModels.js';
import { ErrorHttp } from '../middleware/errores.js';
import { leerId, exigirCampos, tomarCampos, camposParciales } from '../utils/validaciones.js';

const CAMPOS = ['nombre', 'descripcion', 'precio', 'stock', 'id_categoria', 'id_proveedor'];

const validarNumeros = (datos: any) => {
  if (datos.precio !== undefined && (isNaN(Number(datos.precio)) || Number(datos.precio) < 0)) {
    throw new ErrorHttp(400, 'El precio debe ser un número mayor o igual a 0');
  }
  if (datos.stock !== undefined && (!Number.isInteger(datos.stock) || datos.stock < 0)) {
    throw new ErrorHttp(400, 'El stock debe ser un entero mayor o igual a 0');
  }
  return datos;
};

class ProductosController {
  async consultar(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await ProductosModel.obtenerTodos(req.query as FiltrosProductos));
    } catch (err) {
      next(err);
    }
  }

  async estadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await ProductosModel.obtenerEstadisticas());
    } catch (err) {
      next(err);
    }
  }

  async consultarDetalle(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await ProductosModel.obtenerPorId(leerId(req.params.id));
      if (!dato) throw new ErrorHttp(404, 'Producto no encontrado');
      res.status(200).json(dato);
    } catch (err) {
      next(err);
    }
  }

  async ingresar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, ['nombre', 'precio', 'id_categoria', 'id_proveedor']);
      const nuevo = await ProductosModel.crear(validarNumeros(tomarCampos(req.body, CAMPOS)));
      res.status(201).json({ mensaje: 'Producto creado con éxito', dato: nuevo });
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      exigirCampos(req.body, ['nombre', 'precio', 'id_categoria', 'id_proveedor']);
      const dato = await ProductosModel.actualizar(leerId(req.params.id), validarNumeros(tomarCampos(req.body, CAMPOS)));
      res.status(200).json({ mensaje: 'Producto actualizado con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async actualizarParcial(req: Request, res: Response, next: NextFunction) {
    try {
      const dato = await ProductosModel.actualizar(leerId(req.params.id), validarNumeros(camposParciales(req.body, CAMPOS)));
      res.status(200).json({ mensaje: 'Producto actualizado con éxito', dato });
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductosModel.eliminar(leerId(req.params.id));
      res.status(200).json({ mensaje: 'Producto eliminado con éxito' });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /productos/ajuste-precios
  async ajustarPrecios(req: Request, res: Response, next: NextFunction) {
    try {
      const idCategoria = leerId(req.body?.id_categoria);
      const porcentaje = Number(req.body?.porcentaje);
      if (isNaN(porcentaje) || porcentaje <= -100 || porcentaje > 500) {
        throw new ErrorHttp(400, 'porcentaje debe ser un número entre -99 y 500');
      }
      const actualizados = await ProductosModel.ajustarPrecios(idCategoria, porcentaje);
      if (actualizados === 0) throw new ErrorHttp(404, 'La categoría no existe o no tiene productos');
      res.status(200).json({ mensaje: `Precios ajustados un ${porcentaje}%`, productos_actualizados: actualizados });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProductosController();
