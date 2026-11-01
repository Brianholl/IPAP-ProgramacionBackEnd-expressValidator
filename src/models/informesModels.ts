import { prisma } from '../config/prisma.js';

// punto 3.4: informe con sql puro

interface FilaCategoria {
  categoria: string;
  pedidos: bigint;
  unidades: number;
  facturado: string;
  porcentaje: string;
}

interface FilaMes {
  mes: string;
  pedidos: bigint;
  facturado: string;
  ticket_promedio: string;
}

class InformesModel {
  static async ventas(desde: Date, hasta: Date) {
    // ventas por categoria
    const porCategoria = await prisma.$queryRaw<FilaCategoria[]>`
      SELECT c.nombre                         AS categoria,
             COUNT(DISTINCT pe.id)            AS pedidos,
             SUM(pd.cantidad)                 AS unidades,
             SUM(pd.subtotal)                 AS facturado,
             ROUND(SUM(pd.subtotal) * 100 / (
               SELECT SUM(pd2.subtotal)
               FROM pedidos_detalle pd2
               JOIN pedidos pe2 ON pe2.id = pd2.id_pedido
               WHERE pe2.estado <> 'Cancelado' AND pe2.fecha BETWEEN ${desde} AND ${hasta}
             ), 2)                            AS porcentaje
      FROM pedidos_detalle pd
      JOIN pedidos pe   ON pe.id = pd.id_pedido
      JOIN productos pr ON pr.id = pd.id_producto
      JOIN categorias c ON c.id = pr.id_categoria
      WHERE pe.estado <> 'Cancelado' AND pe.fecha BETWEEN ${desde} AND ${hasta}
      GROUP BY c.id, c.nombre
      ORDER BY facturado DESC`;

    // ventas por mes
    const porMes = await prisma.$queryRaw<FilaMes[]>`
      SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes,
             COUNT(*)                    AS pedidos,
             SUM(total)                  AS facturado,
             ROUND(AVG(total), 2)        AS ticket_promedio
      FROM pedidos
      WHERE estado <> 'Cancelado' AND fecha BETWEEN ${desde} AND ${hasta}
      GROUP BY mes
      ORDER BY mes`;

    // el COUNT viene como BigInt y el json no lo acepta
    return {
      por_categoria: porCategoria.map((f) => ({ ...f, pedidos: Number(f.pedidos), unidades: Number(f.unidades) })),
      por_mes: porMes.map((f) => ({ ...f, pedidos: Number(f.pedidos) }))
    };
  }
}

export default InformesModel;
