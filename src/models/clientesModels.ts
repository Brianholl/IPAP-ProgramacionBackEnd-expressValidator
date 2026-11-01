import { prisma } from '../config/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';

class ClientesModel {
  static obtenerTodos(filtros: { ciudad?: string; busqueda?: string }) {
    const where: Prisma.ClienteWhereInput = {};
    if (filtros.ciudad) where.ciudad = { contains: filtros.ciudad };
    if (filtros.busqueda) {
      where.OR = [{ nombre: { contains: filtros.busqueda } }, { cuit_dni: { contains: filtros.busqueda } }];
    }
    return prisma.cliente.findMany({ where, orderBy: { id: 'asc' } });
  }

  static obtenerPorId(id: number) {
    return prisma.cliente.findUnique({ where: { id } });
  }

  static obtenerPedidos(idCliente: number) {
    return prisma.pedido.findMany({
      where: { id_cliente: idCliente },
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        numero_factura: true,
        fecha: true,
        estado: true,
        total: true,
        empleado: { select: { nombre: true, apellido: true } },
        compania_envio: { select: { nombre: true } }
      }
    });
  }

  static async obtenerEstadisticas() {
    const compras = await prisma.pedido.groupBy({
      by: ['id_cliente'],
      _count: { id: true },
      _sum: { total: true },
      _avg: { total: true }
    });
    const clientes = await prisma.cliente.findMany();

    return clientes
      .map((c) => {
        const x = compras.find((p) => p.id_cliente === c.id);
        return {
          id: c.id,
          nombre: c.nombre,
          cuit_dni: c.cuit_dni,
          ciudad: c.ciudad,
          total_pedidos: x?._count.id ?? 0,
          total_facturado: Number(x?._sum.total ?? 0),
          promedio_por_pedido: Number(x?._avg.total?.toDecimalPlaces(2) ?? 0)
        };
      })
      .sort((a, b) => b.total_facturado - a.total_facturado);
  }

  static crear(datos: Prisma.ClienteCreateInput) {
    return prisma.cliente.create({ data: datos });
  }

  static actualizar(id: number, datos: Prisma.ClienteUpdateInput) {
    return prisma.cliente.update({ where: { id }, data: datos });
  }

  static eliminar(id: number) {
    return prisma.cliente.delete({ where: { id } });
  }
}

export default ClientesModel;
