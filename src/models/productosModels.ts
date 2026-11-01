import { prisma } from '../config/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';

export interface FiltrosProductos {
  categoria?: string;
  proveedor?: string;
  precioMin?: string;
  precioMax?: string;
  enStock?: string;
}

const relaciones = {
  categoria: { select: { nombre: true } },
  proveedor: { select: { nombre_empresa: true } }
};

class ProductosModel {
  static obtenerTodos(filtros: FiltrosProductos) {
    const where: Prisma.ProductoWhereInput = {};

    // se puede buscar por id o por nombre
    if (filtros.categoria) {
      where.categoria = isNaN(Number(filtros.categoria))
        ? { nombre: { contains: filtros.categoria } }
        : { id: Number(filtros.categoria) };
    }
    if (filtros.proveedor) {
      where.proveedor = isNaN(Number(filtros.proveedor))
        ? { nombre_empresa: { contains: filtros.proveedor } }
        : { id: Number(filtros.proveedor) };
    }
    if (filtros.precioMin || filtros.precioMax) {
      where.precio = {
        ...(filtros.precioMin && { gte: filtros.precioMin }),
        ...(filtros.precioMax && { lte: filtros.precioMax })
      };
    }
    if (filtros.enStock === 'true') where.stock = { gt: 0 };

    return prisma.producto.findMany({ where, include: relaciones, orderBy: { id: 'asc' } });
  }

  static obtenerPorId(id: number) {
    return prisma.producto.findUnique({ where: { id }, include: relaciones });
  }

  static async obtenerEstadisticas() {
    const r = await prisma.producto.aggregate({
      _count: { id: true },
      _avg: { precio: true },
      _min: { precio: true },
      _max: { precio: true },
      _sum: { stock: true }
    });
    return {
      total_productos: r._count.id,
      precio_promedio: r._avg.precio?.toDecimalPlaces(2) ?? 0,
      precio_minimo: r._min.precio ?? 0,
      precio_maximo: r._max.precio ?? 0,
      stock_total: r._sum.stock ?? 0
    };
  }

  static crear(datos: Prisma.ProductoUncheckedCreateInput) {
    return prisma.producto.create({ data: datos, include: relaciones });
  }

  static actualizar(id: number, datos: Prisma.ProductoUncheckedUpdateInput) {
    return prisma.producto.update({ where: { id }, data: datos, include: relaciones });
  }

  static eliminar(id: number) {
    return prisma.producto.delete({ where: { id } });
  }

  // punto 3.1: $executeRaw devuelve cuantas filas cambio
  static ajustarPrecios(idCategoria: number, porcentaje: number) {
    return prisma.$executeRaw`
      UPDATE productos
      SET precio = ROUND(precio * (1 + ${porcentaje} / 100), 2)
      WHERE id_categoria = ${idCategoria}`;
  }
}

export default ProductosModel;
