import { prisma } from '../config/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';

class EmpleadosModel {
  static obtenerTodos(filtros: { cargo?: string }) {
    return prisma.empleado.findMany({
      where: filtros.cargo ? { cargo: { contains: filtros.cargo } } : {},
      orderBy: { id: 'asc' }
    });
  }

  static obtenerPorId(id: number) {
    return prisma.empleado.findUnique({ where: { id } });
  }

  // ventas de cada empleado
  static async obtenerEstadisticasVentas() {
    const ventas = await prisma.pedido.groupBy({
      by: ['id_empleado'],
      _count: { id: true },
      _sum: { total: true },
      _avg: { total: true }
    });
    const empleados = await prisma.empleado.findMany();

    return empleados
      .map((e) => {
        const v = ventas.find((x) => x.id_empleado === e.id);
        return {
          id: e.id,
          empleado: `${e.nombre} ${e.apellido}`,
          cargo: e.cargo,
          total_pedidos: v?._count.id ?? 0,
          total_facturado: Number(v?._sum.total ?? 0),
          promedio_por_pedido: Number(v?._avg.total?.toDecimalPlaces(2) ?? 0)
        };
      })
      .sort((a, b) => b.total_facturado - a.total_facturado);
  }

  static crear(datos: Prisma.EmpleadoCreateInput) {
    return prisma.empleado.create({ data: datos });
  }

  static actualizar(id: number, datos: Prisma.EmpleadoUpdateInput) {
    return prisma.empleado.update({ where: { id }, data: datos });
  }

  static eliminar(id: number) {
    return prisma.empleado.delete({ where: { id } });
  }
}

export default EmpleadosModel;
