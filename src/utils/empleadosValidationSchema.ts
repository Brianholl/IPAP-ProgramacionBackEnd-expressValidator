import type { Schema } from 'express-validator';
import { camposOpcionales } from './camposOpcionales.js';

export const empleadoValidationSchema: Schema = {
  nombre: {
    notEmpty: { errorMessage: 'El campo nombre no puede estar vacío' },
    isString: { errorMessage: 'El campo nombre debe ser texto' },
    isLength: {
      options: { max: 50 },
      errorMessage: 'El campo nombre puede tener hasta 50 caracteres'
    },
    trim: true
  },
  apellido: {
    notEmpty: { errorMessage: 'El campo apellido no puede estar vacío' },
    isString: { errorMessage: 'El campo apellido debe ser texto' },
    isLength: {
      options: { max: 50 },
      errorMessage: 'El campo apellido puede tener hasta 50 caracteres'
    },
    trim: true
  },
  dni: {
    notEmpty: { errorMessage: 'El campo DNI no puede estar vacío' },
    isString: { errorMessage: 'El campo DNI debe ser texto' },
    isLength: {
      options: { max: 20 },
      errorMessage: 'El campo DNI puede tener hasta 20 caracteres'
    },
    trim: true
  },
  cargo: {
    notEmpty: { errorMessage: 'El campo cargo no puede estar vacío' },
    isString: { errorMessage: 'El campo cargo debe ser texto' },
    isLength: {
      options: { max: 50 },
      errorMessage: 'El campo cargo puede tener hasta 50 caracteres'
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
  telefono: {
    notEmpty: { errorMessage: 'El campo teléfono no puede estar vacío' },
    isString: { errorMessage: 'El campo teléfono debe ser texto' },
    isLength: {
      options: { max: 30 },
      errorMessage: 'El campo teléfono puede tener hasta 30 caracteres'
    },
    trim: true
  },
  fecha_ingreso: {
    notEmpty: { errorMessage: 'El campo fecha de ingreso no puede estar vacío' },
    matches: {
      options: /^\d{4}-\d{2}-\d{2}$/,
      errorMessage: 'El campo fecha de ingreso debe tener formato AAAA-MM-DD'
    }
  }
};

export const empleadoPatchValidationSchema: Schema = camposOpcionales(empleadoValidationSchema);
