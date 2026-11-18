
import { prisma } from "../config/prisma";

export async function obtenerCartas() {
  return prisma.carta.findMany({
    select: {
      id_carta: true,
      nombre: true,
      numero_coleccionista: true,
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
    orderBy: {
      nombre: "asc",
    },
  });
}

export async function obtenerCartaPorId(id: bigint) {
  return prisma.carta.findUnique({
    where: {
      id_carta: id,
    },
    include: {
      edicion: {
        include: {
          juego: true,
        },
      },
    },
  });
}


export async function crearCarta(datos: {
  nombre: string;
  id_edicion: bigint;
  numero_coleccionista?: string;
  rareza?: string;
  acabado?: string;
}) {
  return prisma.carta.create({
    data: {
      nombre: datos.nombre,
      id_edicion: datos.id_edicion,
      numero_coleccionista: datos.numero_coleccionista,
      rareza: datos.rareza,
      acabado: datos.acabado,
    },
  });
}


export async function actualizarCarta(
  id: bigint,
  datos: {
    nombre?: string;
    numero_coleccionista?: string;
    rareza?: string;
    acabado?: string;
  }
) {
  return prisma.carta.update({
    where: { id_carta: id },
    data: datos,
  });
}

export async function eliminarCarta(id: bigint) {
  return prisma.carta.delete({
    where: { id_carta: id },
  });
}
