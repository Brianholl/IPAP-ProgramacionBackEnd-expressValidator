import type { Schema } from 'express-validator';

// los items se revisan en el controlador
export const pedidoValidationSchema: Schema = {
  numero_factura: {
    notEmpty: { errorMessage: 'El número de factura no puede estar vacío' },
    isString: { errorMessage: 'El número de factura debe ser texto' },
    isLength: {
      options: { max: 25 },
      errorMessage: 'El número de factura puede tener hasta 25 caracteres'
    },
    trim: true
  },
  id_cliente: {
    notEmpty: { errorMessage: 'El id del cliente es obligatorio' },
    isInt: { options: { min: 1 }, errorMessage: 'El id del cliente debe ser un entero positivo' },
    toInt: true
  },
  id_empleado: {
    notEmpty: { errorMessage: 'El id del empleado es obligatorio' },
    isInt: { options: { min: 1 }, errorMessage: 'El id del empleado debe ser un entero positivo' },
    toInt: true
  },
  id_compania_envio: {
    notEmpty: { errorMessage: 'El id de la compañía de envío es obligatorio' },
    isInt: { options: { min: 1 }, errorMessage: 'El id de la compañía de envío debe ser un entero positivo' },
    toInt: true
  },
  estado: {
    optional: true,
    isIn: {
      options: [['Pendiente', 'Enviado', 'Entregado', 'Cancelado']],
      errorMessage: 'El estado debe ser Pendiente, Enviado, Entregado o Cancelado'
    }
  }
};

// PUT y PATCH: solo se cambia el estado o la compañía de envío
export const pedidoPatchValidationSchema: Schema = {
  estado: pedidoValidationSchema.estado!,
  id_compania_envio: { ...pedidoValidationSchema.id_compania_envio!, optional: true }
};

export const ajustePreciosValidationSchema: Schema = {
  id_categoria: {
    notEmpty: { errorMessage: 'El id de la categoría es obligatorio' },
    isInt: { options: { min: 1 }, errorMessage: 'El id de la categoría debe ser un entero positivo' },
    toInt: true
  },
  porcentaje: {
    notEmpty: { errorMessage: 'El porcentaje es obligatorio' },
    isFloat: {
      options: { gt: -100, max: 500 },
      errorMessage: 'El porcentaje debe ser un número entre -99 y 500'
    }
  }
};
