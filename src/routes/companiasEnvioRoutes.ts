import express from 'express';
import companiasEnvioControllers from '../controllers/companiasEnvioControllers.js';
import { checkSchema } from 'express-validator';
import { companiaEnvioValidationSchema, companiaEnvioPatchValidationSchema } from '../utils/companiasEnvioValidationSchema.js';
import { validaDatos } from '../middleware/validaDatos.js';

const router = express.Router();

router.get('/', companiasEnvioControllers.consultar);
router.post('/', checkSchema(companiaEnvioValidationSchema, ['body']), validaDatos, companiasEnvioControllers.ingresar);

// tiene que ir antes de /:id
router.get('/estadisticas/resumen', companiasEnvioControllers.estadisticas);

router.route('/:id')
  .get(companiasEnvioControllers.consultarDetalle)
  .put(checkSchema(companiaEnvioValidationSchema, ['body']), validaDatos, companiasEnvioControllers.actualizar)
  .patch(checkSchema(companiaEnvioPatchValidationSchema, ['body']), validaDatos, companiasEnvioControllers.actualizarParcial)
  .delete(companiasEnvioControllers.eliminar);

export default router;
