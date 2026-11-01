import express from 'express';
import clientesControllers from '../controllers/clientesControllers.js';
import { checkSchema } from 'express-validator';
import { clienteValidationSchema, clientePatchValidationSchema } from '../utils/clientesValidationSchema.js';
import { validaDatos } from '../middleware/validaDatos.js';

const router = express.Router();

router.get('/', clientesControllers.consultar);
router.post('/', checkSchema(clienteValidationSchema, ['body']), validaDatos, clientesControllers.ingresar);

// tiene que ir antes de /:id
router.get('/estadisticas/resumen', clientesControllers.estadisticas);
router.get('/:id/pedidos', clientesControllers.pedidos);

router.route('/:id')
  .get(clientesControllers.consultarDetalle)
  .put(checkSchema(clienteValidationSchema, ['body']), validaDatos, clientesControllers.actualizar)
  .patch(checkSchema(clientePatchValidationSchema, ['body']), validaDatos, clientesControllers.actualizarParcial)
  .delete(clientesControllers.eliminar);

export default router;
