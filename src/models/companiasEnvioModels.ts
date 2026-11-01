import { prisma } from '../config/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';

class CompaniasEnvioModel {
  static obtenerTodos() {
    return prisma.companiaEnvio.findMany({ orderBy: { id: 'asc' } });
  }

  static obtenerPorId(id: number) {
    return prisma.companiaEnvio.findUnique({ where: { id } });
  }

  // cantidad de envíos y total transportado por compañía
  static async obtenerEstadisticas() {
    const envios = await prisma.pedido.groupBy({
      by: ['id_compania_envio'],
      _count: { id: true },
      _sum: { total: true }
    });
    const companias = await prisma.companiaEnvio.findMany();

    return companias
      .map((c) => {
        const e = envios.find((x) => x.id_compania_envio === c.id);
        return {
          id: c.id,
          nombre: c.nombre,
          total_envios: e?._count.id ?? 0,
          total_facturado_transportado: Number(e?._sum.total ?? 0)
        };
      })
      .sort((a, b) => b.total_envios - a.total_envios);
  }

  static crear(datos: Prisma.CompaniaEnvioCreateInput) {
    return prisma.companiaEnvio.create({ data: datos });
  }

  static actualizar(id: number, datos: Prisma.CompaniaEnvioUpdateInput) {
    return prisma.companiaEnvio.update({ where: { id }, data: datos });
  }

  static eliminar(id: number) {
    return prisma.companiaEnvio.delete({ where: { id } });
  }
}

export default CompaniasEnvioModel;
