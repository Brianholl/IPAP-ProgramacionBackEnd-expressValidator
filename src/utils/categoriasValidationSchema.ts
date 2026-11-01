import type { Schema } from 'express-validator';
import { camposOpcionales } from './camposOpcionales.js';

export const categoriaValidationSchema: Schema = {
  nombre: {
    notEmpty: { errorMessage: 'El campo nombre no puede estar vacío' },
    isString: { errorMessage: 'El campo nombre debe ser texto' },
    isLength: {
      options: { max: 60 },
      errorMessage: 'El campo nombre puede tener hasta 60 caracteres'
    },
    trim: true
  },
  descripcion: {
    optional: true,
    isString: { errorMessage: 'El campo descripción debe ser texto' },
    isLength: {
      options: { max: 255 },
      errorMessage: 'El campo descripción puede tener hasta 255 caracteres'
    },
    trim: true
  }
};

export const categoriaPatchValidationSchema: Schema = camposOpcionales(categoriaValidationSchema);
