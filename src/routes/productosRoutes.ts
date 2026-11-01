import express from 'express';
import productosControllers from '../controllers/productosControllers.js';
import { checkSchema } from 'express-validator';
import { productoValidationSchema, productoPatchValidationSchema } from '../utils/productosValidationSchema.js';
import { ajustePreciosValidationSchema } from '../utils/pedidosValidationSchema.js';
import { validaDatos } from '../middleware/validaDatos.js';

const router = express.Router();

router.get('/', productosControllers.consultar);
router.post('/', checkSchema(productoValidationSchema, ['body']), validaDatos, productosControllers.ingresar);

// tiene que ir antes de /:id
router.get('/estadisticas/resumen', productosControllers.estadisticas);
router.patch('/ajuste-precios', checkSchema(ajustePreciosValidationSchema, ['body']), validaDatos, productosControllers.ajustarPrecios);

router.route('/:id')
  .get(productosControllers.consultarDetalle)
  .put(checkSchema(productoValidationSchema, ['body']), validaDatos, productosControllers.actualizar)
  .patch(checkSchema(productoPatchValidationSchema, ['body']), validaDatos, productosControllers.actualizarParcial)
  .delete(productosControllers.eliminar);

export default router;
