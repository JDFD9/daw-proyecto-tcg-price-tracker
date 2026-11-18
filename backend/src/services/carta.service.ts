import { crearCarta } from "../repositories/carta.repository";
import { prisma } from "../config/prisma";
import {
  obtenerCartas,
  obtenerCartaPorId,
  actualizarCarta,
  eliminarCarta,
} from "../repositories/carta.repository";

export async function listarCartas() {
  const cartas = await obtenerCartas();

  return cartas.map((carta) => ({
    ...carta,
    id_carta: carta.id_carta.toString(),
  }));
}

export async function buscarCarta(id: bigint) {
  const carta = await obtenerCartaPorId(id);

  if (!carta) {
    return null;
  }

  return {
    ...carta,
    id_carta: carta.id_carta.toString(),
    id_edicion: carta.id_edicion.toString(),
    edicion: {
      ...carta.edicion,
      id_edicion: carta.edicion.id_edicion.toString(),
      id_juego: carta.edicion.id_juego.toString(),
      juego: {
        ...carta.edicion.juego,
        id_juego: carta.edicion.juego.id_juego.toString(),
      },
    },
  };
}

export async function registrarCarta(datos: {
  nombre: string;
  id_edicion: bigint;
  numero_coleccionista?: string;
  rareza?: string;
  acabado?: string;
}) {
  const edicion = await prisma.edicion.findUnique({
    where: { id_edicion: datos.id_edicion },
  });

  if (!edicion) {
    return null;
  }

  const carta = await crearCarta(datos);

  return {
    ...carta,
    id_carta: carta.id_carta.toString(),
    id_edicion: carta.id_edicion.toString(),
  };
}

export async function modificarCarta(
  id: bigint,
  datos: {
    nombre?: string;
    numero_coleccionista?: string;
    rareza?: string;
    acabado?: string;
  }
) {
  const existente = await obtenerCartaPorId(id);

  if (!existente) {
    return null;
  }

  const carta = await actualizarCarta(id, datos);

  return {
    ...carta,
    id_carta: carta.id_carta.toString(),
    id_edicion: carta.id_edicion.toString(),
  };
}

export async function borrarCarta(id: bigint) {
  const existente = await obtenerCartaPorId(id);

  if (!existente) {
    return false;
  }

  await eliminarCarta(id);
  return true;
}