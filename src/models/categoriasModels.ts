import { prisma } from '../config/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';

class CategoriasModel {
  static obtenerTodos() {
    return prisma.categoria.findMany({ orderBy: { id: 'asc' } });
  }

  static obtenerPorId(id: number) {
    return prisma.categoria.findUnique({ where: { id } });
  }

  static async obtenerEstadisticas() {
    const stock = await prisma.producto.groupBy({
      by: ['id_categoria'],
      _count: { id: true },
      _sum: { stock: true },
      _avg: { precio: true }
    });
    const categorias = await prisma.categoria.findMany({ orderBy: { id: 'asc' } });

    return categorias.map((c) => {
      const fila = stock.find((s) => s.id_categoria === c.id);
      return {
        id: c.id,
        nombre: c.nombre,
        total_productos: fila?._count.id ?? 0,
        stock_total: fila?._sum.stock ?? 0,
        precio_promedio: fila?._avg.precio?.toDecimalPlaces(2) ?? 0
      };
    });
  }

  static crear(datos: Prisma.CategoriaCreateInput) {
    return prisma.categoria.create({ data: datos });
  }

  static actualizar(id: number, datos: Prisma.CategoriaUpdateInput) {
    return prisma.categoria.update({ where: { id }, data: datos });
  }

  static eliminar(id: number) {
    return prisma.categoria.delete({ where: { id } });
  }
}

export default CategoriasModel;
