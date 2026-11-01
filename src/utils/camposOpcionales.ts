import type { Schema } from 'express-validator';

// para el PATCH: los mismos campos del esquema, pero opcionales
export const camposOpcionales = (schema: Schema): Schema => {
  const entradas = Object.entries(schema).map(([campo, reglas]) => {
    return [campo, { ...reglas, optional: true }];
  });

  return Object.fromEntries(entradas);
};
