import express from 'express';
import proveedoresControllers from '../controllers/proveedoresControllers.js';
import { checkSchema } from 'express-validator';
import { proveedorValidationSchema, proveedorPatchValidationSchema } from '../utils/proveedoresValidationSchema.js';
import { validaDatos } from '../middleware/validaDatos.js';

const router = express.Router();

router.get('/', proveedoresControllers.consultar);
router.post('/', checkSchema(proveedorValidationSchema, ['body']), validaDatos, proveedoresControllers.ingresar);

// tiene que ir antes de /:id
router.get('/estadisticas/resumen', proveedoresControllers.estadisticas);
router.get('/:id/productos', proveedoresControllers.productos);

router.route('/:id')
  .get(proveedoresControllers.consultarDetalle)
  .put(checkSchema(proveedorValidationSchema, ['body']), validaDatos, proveedoresControllers.actualizar)
  .patch(checkSchema(proveedorPatchValidationSchema, ['body']), validaDatos, proveedoresControllers.actualizarParcial)
  .delete(proveedoresControllers.eliminar);

export default router;
