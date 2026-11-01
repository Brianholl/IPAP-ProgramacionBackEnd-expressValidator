import { prisma } from '../config/prisma.js';
import { ErrorHttp } from '../middleware/errores.js';
import type { EstadoPedido, Prisma } from '../generated/prisma/client.js';

export interface NuevoPedido {
  numero_factura: string;
  id_cliente: number;
  id_empleado: number;
  id_compania_envio: number;
  estado?: EstadoPedido | undefined;
  items: { id_producto: number; cantidad: number }[];
}

const cabecera = {
  cliente: { select: { nombre: true, cuit_dni: true, direccion: true, ciudad: true } },
  empleado: { select: { nombre: true, apellido: true } },
  compania_envio: { select: { nombre: true } }
};

class PedidosModel {
  static obtenerTodos(filtros: { estado?: EstadoPedido | undefined; clienteId?: number | undefined; empleadoId?: number | undefined }) {
    const where: Prisma.PedidoWhereInput = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.clienteId) where.id_cliente = filtros.clienteId;
    if (filtros.empleadoId) where.id_empleado = filtros.empleadoId;

    return prisma.pedido.findMany({
      where,
      include: cabecera,
      orderBy: { fecha: 'desc' }
    });
  }

  static obtenerPorId(id: number) {
    return prisma.pedido.findUnique({
      where: { id },
      include: {
        ...cabecera,
        detalles: { include: { producto: { select: { nombre: true } } } }
      }
    });
  }

  static async obtenerEstadisticas() {
    const filas = await prisma.pedido.groupBy({
      by: ['estado'],
      _count: { id: true },
      _sum: { total: true },
      _avg: { total: true }
    });
    return filas.map((f) => ({
      estado: f.estado,
      cantidad_pedidos: f._count.id,
      total_facturado: f._sum.total ?? 0,
      promedio_venta: f._avg.total?.toDecimalPlaces(2) ?? 0
    }));
  }

  // transaccion: si algo falla no se guarda nada
  static crear(pedido: NuevoPedido) {
    return prisma.$transaction(async (tx) => {
      // si un producto viene repetido sumo las cantidades
      const cantidades = new Map<number, number>();
      for (const item of pedido.items) {
        cantidades.set(item.id_producto, (cantidades.get(item.id_producto) ?? 0) + item.cantidad);
      }

      const renglones: Prisma.PedidoDetalleUncheckedCreateWithoutPedidoInput[] = [];
      let total = 0;

      for (const [id_producto, cantidad] of cantidades) {
        const producto = await tx.producto.findUnique({ where: { id: id_producto } });
        if (!producto) throw new ErrorHttp(400, `El producto ${id_producto} no existe.`);
        if (producto.stock < cantidad) {
          throw new ErrorHttp(400, `Stock insuficiente de "${producto.nombre}" (hay ${producto.stock}).`);
        }

        const subtotal = producto.precio.mul(cantidad);
        total += subtotal.toNumber();
        renglones.push({ id_producto, cantidad, precio_unitario: producto.precio, subtotal });

        await tx.producto.update({ where: { id: id_producto }, data: { stock: { decrement: cantidad } } });
      }

      return tx.pedido.create({
        data: {
          numero_factura: pedido.numero_factura,
          ...(pedido.estado && { estado: pedido.estado }),
          total,
          id_cliente: pedido.id_cliente,
          id_empleado: pedido.id_empleado,
          id_compania_envio: pedido.id_compania_envio,
          detalles: { create: renglones }
        },
        include: { ...cabecera, detalles: true }
      });
    });
  }

  static actualizar(id: number, datos: { estado?: EstadoPedido | undefined; id_compania_envio?: number | undefined }) {
    const data: Prisma.PedidoUncheckedUpdateInput = {};
    if (datos.estado) data.estado = datos.estado;
    if (datos.id_compania_envio) data.id_compania_envio = datos.id_compania_envio;
    return prisma.pedido.update({ where: { id }, data, include: cabecera });
  }

  // el detalle se borra solo (cascade)
  static eliminar(id: number) {
    return prisma.pedido.delete({ where: { id } });
  }
}

export default PedidosModel;
