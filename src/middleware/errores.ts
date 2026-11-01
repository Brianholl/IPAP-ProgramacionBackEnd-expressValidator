import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client.js';

export class ErrorHttp extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const rutaNoEncontrada = (req: Request, res: Response) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// manejo de errores, no se muestra el error de la base
export const manejoErrores = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorHttp) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error('[Error]', err.code ?? '', err.message);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(400).json({ error: 'Ya existe un registro con esos datos únicos.' });
      case 'P2003':
        return res.status(400).json({ error: 'Error de integridad: el id relacionado no existe o el registro tiene datos asociados.' });
      case 'P2025':
        return res.status(404).json({ error: 'El registro no existe.' });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError || err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Los datos enviados no son válidos.' });
  }

  res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
};
