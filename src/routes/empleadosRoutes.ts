import express from 'express';
import empleadosControllers from '../controllers/empleadosControllers.js';
import { checkSchema } from 'express-validator';
import { empleadoValidationSchema, empleadoPatchValidationSchema } from '../utils/empleadosValidationSchema.js';
import { validaDatos } from '../middleware/validaDatos.js';

const router = express.Router();

router.get('/', empleadosControllers.consultar);
router.post('/', checkSchema(empleadoValidationSchema, ['body']), validaDatos, empleadosControllers.ingresar);

// tiene que ir antes de /:id
router.get('/estadisticas/resumen', empleadosControllers.estadisticas);

router.route('/:id')
  .get(empleadosControllers.consultarDetalle)
  .put(checkSchema(empleadoValidationSchema, ['body']), validaDatos, empleadosControllers.actualizar)
  .patch(checkSchema(empleadoPatchValidationSchema, ['body']), validaDatos, empleadosControllers.actualizarParcial)
  .delete(empleadosControllers.eliminar);

export default router;
