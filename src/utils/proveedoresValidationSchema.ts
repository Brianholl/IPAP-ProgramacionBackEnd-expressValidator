import type { Schema } from 'express-validator';
import { camposOpcionales } from './camposOpcionales.js';

export const proveedorValidationSchema: Schema = {
  nombre_empresa: {
    notEmpty: { errorMessage: 'El campo nombre de la empresa no puede estar vacío' },
    isString: { errorMessage: 'El campo nombre de la empresa debe ser texto' },
    isLength: {
      options: { max: 100 },
      errorMessage: 'El campo nombre de la empresa puede tener hasta 100 caracteres'
    },
    trim: true
  },
  contacto: {
    notEmpty: { errorMessage: 'El campo contacto no puede estar vacío' },
    isString: { errorMessage: 'El campo contacto debe ser texto' },
    isLength: {
      options: { max: 100 },
      errorMessage: 'El campo contacto puede tener hasta 100 caracteres'
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
  },
  direccion: {
    notEmpty: { errorMessage: 'El campo dirección no puede estar vacío' },
    isString: { errorMessage: 'El campo dirección debe ser texto' },
    isLength: {
      options: { max: 150 },
      errorMessage: 'El campo dirección puede tener hasta 150 caracteres'
    },
    trim: true
  },
  cuit: {
    notEmpty: { errorMessage: 'El campo CUIT no puede estar vacío' },
    isString: { errorMessage: 'El campo CUIT debe ser texto' },
    isLength: {
      options: { max: 20 },
      errorMessage: 'El campo CUIT puede tener hasta 20 caracteres'
    },
    trim: true
  }
};

export const proveedorPatchValidationSchema: Schema = camposOpcionales(proveedorValidationSchema);
