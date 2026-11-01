import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validaDatos = (req: Request, res: Response, next: NextFunction) => {
  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.status(400).json({ errors: resultado.array() });
  }

  next();
};
