import { ErrorHttp } from '../middleware/errores.js';

export const leerId = (valor: unknown): number => {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) throw new ErrorHttp(400, 'El id debe ser un número entero positivo.');
  return id;
};

export const exigirCampos = (body: any, campos: string[]) => {
  const faltan = campos.filter((c) => body?.[c] === undefined || body[c] === null || body[c] === '');
  if (faltan.length) throw new ErrorHttp(400, `Faltan campos obligatorios: ${faltan.join(', ')}`);
};

export const tomarCampos = (body: any, campos: string[]) =>
  Object.fromEntries(campos.filter((c) => body?.[c] !== undefined).map((c) => [c, body[c]]));

// para el PATCH: solo los campos que vinieron
export const camposParciales = (body: any, campos: string[]) => {
  const datos = tomarCampos(body, campos);
  if (Object.keys(datos).length === 0) throw new ErrorHttp(400, 'No se enviaron campos para actualizar');
  return datos;
};
