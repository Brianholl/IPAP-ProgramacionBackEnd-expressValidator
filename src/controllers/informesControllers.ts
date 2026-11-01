import type { Request, Response, NextFunction } from 'express';
import InformesModel from '../models/informesModels.js';
import { ErrorHttp } from '../middleware/errores.js';

const leerFecha = (valor: unknown, porDefecto: string) => {
  const fecha = new Date((valor as string) ?? porDefecto);
  if (isNaN(fecha.getTime())) throw new ErrorHttp(400, 'Las fechas van en formato AAAA-MM-DD');
  return fecha;
};

class InformesController {
  // GET /informes/ventas?desde=2024-01-01&hasta=2024-12-31
  async ventas(req: Request, res: Response, next: NextFunction) {
    try {
      const desde = leerFecha(req.query.desde, '2000-01-01');
      const hasta = leerFecha(req.query.hasta, '2100-01-01');
      hasta.setUTCHours(23, 59, 59);
      if (desde > hasta) throw new ErrorHttp(400, '"desde" no puede ser después de "hasta"');

      const datos = await InformesModel.ventas(desde, hasta);
      res.status(200).json({
        informe: 'Ventas por categoría y por mes',
        periodo: { desde: desde.toISOString().slice(0, 10), hasta: hasta.toISOString().slice(0, 10) },
        ...datos
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new InformesController();
