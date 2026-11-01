import type { Schema } from 'express-validator';
import { camposOpcionales } from './camposOpcionales.js';

export const clienteValidationSchema: Schema = {
  nombre: {
    notEmpty: { errorMessage: 'El campo nombre no puede estar vacío' },
    isString: { errorMessage: 'El campo nombre debe ser texto' },
    isLength: {
      options: { max: 100 },
      errorMessage: 'El campo nombre puede tener hasta 100 caracteres'
    },
    trim: true
  },
  cuit_dni: {
    notEmpty: { errorMessage: 'El campo CUIT/DNI no puede estar vacío' },
    isString: { errorMessage: 'El campo CUIT/DNI debe ser texto' },
    isLength: {
      options: { max: 20 },
      errorMessage: 'El campo CUIT/DNI puede tener hasta 20 caracteres'
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
  ciudad: {
    notEmpty: { errorMessage: 'El campo ciudad no puede estar vacío' },
    isString: { errorMessage: 'El campo ciudad debe ser texto' },
    isLength: {
      options: { max: 60 },
      errorMessage: 'El campo ciudad puede tener hasta 60 caracteres'
    },
    trim: true
  }
};

export const clientePatchValidationSchema: Schema = camposOpcionales(clienteValidationSchema);
