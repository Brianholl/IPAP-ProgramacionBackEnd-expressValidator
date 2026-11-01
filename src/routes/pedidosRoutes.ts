import express from 'express';
import pedidosControllers from '../controllers/pedidosControllers.js';
import { checkSchema } from 'express-validator';
import { pedidoValidationSchema, pedidoPatchValidationSchema } from '../utils/pedidosValidationSchema.js';
import { validaDatos } from '../middleware/validaDatos.js';

const router = express.Router();

router.get('/', pedidosControllers.consultar);
router.post('/', checkSchema(pedidoValidationSchema, ['body']), validaDatos, pedidosControllers.ingresar);

// tiene que ir antes de /:id
router.get('/estadisticas/resumen', pedidosControllers.estadisticas);

router.route('/:id')
  .get(pedidosControllers.consultarDetalle)
  .put(checkSchema(pedidoPatchValidationSchema, ['body']), validaDatos, pedidosControllers.actualizar)
  .patch(checkSchema(pedidoPatchValidationSchema, ['body']), validaDatos, pedidosControllers.actualizar)
  .delete(pedidosControllers.eliminar);

export default router;
