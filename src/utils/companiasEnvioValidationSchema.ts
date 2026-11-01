import type { Schema } from 'express-validator';
import { camposOpcionales } from './camposOpcionales.js';

export const companiaEnvioValidationSchema: Schema = {
  nombre: {
    notEmpty: { errorMessage: 'El campo nombre no puede estar vacío' },
    isString: { errorMessage: 'El campo nombre debe ser texto' },
    isLength: {
      options: { max: 100 },
      errorMessage: 'El campo nombre puede tener hasta 100 caracteres'
    },
    trim: true
  },
  telefono: {
    notEmpty: { errorMessage: 'El campo teléfono no puede estar vacío' },
    isString: { errorMessage: 'El campo teléfono debe ser texto' },
    isLength: {
      options: { max: 30 },
      errorMessage: 'El campo teléfono puede tener hasta 30 caracteres'
    },
    trim: true
  },
  email: {
    notEmpty: { errorMessage: 'El campo email no puede estar vacío' },
    isEmail: { errorMessage: 'El formato del email no es válido' },
    isLength: {
      options: { max: 100 },
      errorMessage: 'El campo email puede tener hasta 100 caracteres'
    }
  }
};

export const companiaEnvioPatchValidationSchema: Schema = camposOpcionales(companiaEnvioValidationSchema);
