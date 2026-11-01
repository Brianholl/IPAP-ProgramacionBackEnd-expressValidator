import type { Schema } from 'express-validator';
import { camposOpcionales } from './camposOpcionales.js';

export const productoValidationSchema: Schema = {
  nombre: {
    notEmpty: { errorMessage: 'El campo nombre no puede estar vacío' },
    isString: { errorMessage: 'El campo nombre debe ser texto' },
    isLength: {
      options: { max: 100 },
      errorMessage: 'El campo nombre puede tener hasta 100 caracteres'
    },
    trim: true
  },
  descripcion: {
    optional: true,
    isString: { errorMessage: 'El campo descripción debe ser texto' },
    trim: true
  },
  precio: {
    notEmpty: { errorMessage: 'El campo precio no puede estar vacío' },
    isFloat: {
      options: { gt: 0 },
      errorMessage: 'El campo precio debe ser un número mayor a 0'
    }
  },
  stock: {
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: 'El campo stock debe ser un entero mayor o igual a 0'
    },
    toInt: true
  },
  id_categoria: {
    notEmpty: { errorMessage: 'El campo id de la categoría no puede estar vacío' },
    isInt: {
      options: { min: 1 },
      errorMessage: 'El campo id de la categoría debe ser un entero positivo'
    },
    toInt: true
  },
  id_proveedor: {
    notEmpty: { errorMessage: 'El campo id del proveedor no puede estar vacío' },
    isInt: {
      options: { min: 1 },
      errorMessage: 'El campo id del proveedor debe ser un entero positivo'
    },
    toInt: true
  }
};

export const productoPatchValidationSchema: Schema = camposOpcionales(productoValidationSchema);
