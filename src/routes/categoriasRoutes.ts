import express from 'express';
import categoriasControllers from '../controllers/categoriasControllers.js';
import { checkSchema } from 'express-validator';
import { categoriaValidationSchema, categoriaPatchValidationSchema } from '../utils/categoriasValidationSchema.js';
import { validaDatos } from '../middleware/validaDatos.js';

const router = express.Router();

router.get('/', categoriasControllers.consultar);
router.post('/', checkSchema(categoriaValidationSchema, ['body']), validaDatos, categoriasControllers.ingresar);

// tiene que ir antes de /:id
router.get('/estadisticas/resumen', categoriasControllers.estadisticas);

router.route('/:id')
  .get(categoriasControllers.consultarDetalle)
  .put(checkSchema(categoriaValidationSchema, ['body']), validaDatos, categoriasControllers.actualizar)
  .patch(checkSchema(categoriaPatchValidationSchema, ['body']), validaDatos, categoriasControllers.actualizarParcial)
  .delete(categoriasControllers.eliminar);

export default router;
