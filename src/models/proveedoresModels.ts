import { prisma } from '../config/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';

class ProveedoresModel {
  static obtenerTodos(filtros: { nombre?: string }) {
    return prisma.proveedor.findMany({
      where: filtros.nombre ? { nombre_empresa: { contains: filtros.nombre } } : {},
      orderBy: { id: 'asc' }
    });
  }

  static obtenerPorId(id: number) {
    return prisma.proveedor.findUnique({ where: { id } });
  }

  static obtenerConProductos(id: number) {
    return prisma.proveedor.findUnique({
      where: { id },
      include: {
        productos: {
          orderBy: { nombre: 'asc' },
          include: { categoria: { select: { nombre: true } } }
        }
      }
    });
  }

  static async obtenerEstadisticas() {
    const proveedores = await prisma.proveedor.findMany({
      select: { id: true, nombre_empresa: true, _count: { select: { productos: true } } }
    });
    const precios = await prisma.producto.groupBy({ by: ['id_proveedor'], _avg: { precio: true } });

    return proveedores
      .map((p) => ({
        id: p.id,
        nombre_empresa: p.nombre_empresa,
        total_productos: p._count.productos,
        precio_promedio: precios.find((x) => x.id_proveedor === p.id)?._avg.precio?.toDecimalPlaces(2) ?? 0
      }))
      .sort((a, b) => b.total_productos - a.total_productos);
  }

  static crear(datos: Prisma.ProveedorCreateInput) {
    return prisma.proveedor.create({ data: datos });
  }

  static actualizar(id: number, datos: Prisma.ProveedorUpdateInput) {
    return prisma.proveedor.update({ where: { id }, data: datos });
  }

  static eliminar(id: number) {
    return prisma.proveedor.delete({ where: { id } });
  }
}

export default ProveedoresModel;
