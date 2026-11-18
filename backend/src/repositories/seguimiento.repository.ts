
import { prisma } from "../config/prisma";

export async function obtenerSeguimientosUsuario(
  idUsuario: bigint
) {
  return prisma.seguimiento.findMany({
    where: {
      id_usuario: idUsuario,
    },
    include: {
      carta: {
        select: {
          id_carta: true,
          nombre: true,
          rareza: true,
          acabado: true,
          edicion: {
            select: {
              nombre: true,
              juego: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      fecha_alta: "desc",
    },
  });
}

export async function buscarSeguimientoPorId(
  id: bigint
) {
  return prisma.seguimiento.findUnique({
    where: {
      id_seguimiento: id,
    },
  });
}

export async function buscarSeguimientoUsuarioCarta(
  idUsuario: bigint,
  idCarta: bigint
) {
  return prisma.seguimiento.findFirst({
    where: {
      id_usuario: idUsuario,
      id_carta: idCarta,
    },
  });
}

export async function crearSeguimiento(
  idUsuario: bigint,
  idCarta: bigint
) {
  return prisma.seguimiento.create({
    data: {
      id_usuario: idUsuario,
      id_carta: idCarta,
      notificaciones_activas: true,
    },
  });
}

export async function eliminarSeguimientoPropio(
  id: bigint,
  idUsuario: bigint
) {
  return prisma.seguimiento.deleteMany({
    where: {
      id_seguimiento: id,
      id_usuario: idUsuario,
    },
  });
}