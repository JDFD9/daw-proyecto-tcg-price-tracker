
import { obtenerSeguimientosUsuario } from "../repositories/seguimiento.repository";
import { prisma } from "../config/prisma";
import {
  buscarSeguimientoPorId,
  buscarSeguimientoUsuarioCarta,
  crearSeguimiento,
  eliminarSeguimientoPropio,
} from "../repositories/seguimiento.repository";
export async function listarSeguimientosUsuario(
  idUsuario: bigint
) {
  const seguimientos = await obtenerSeguimientosUsuario(idUsuario);

  return seguimientos.map((seguimiento) => ({
    id_seguimiento: seguimiento.id_seguimiento.toString(),
    id_usuario: seguimiento.id_usuario.toString(),
    id_carta: seguimiento.id_carta.toString(),
    fecha_alta: seguimiento.fecha_alta,
    notificaciones_activas: seguimiento.notificaciones_activas,
    carta: {
      ...seguimiento.carta,
      id_carta: seguimiento.carta.id_carta.toString(),
    },
  }));
}

export async function registrarSeguimiento(
  idUsuario: bigint,
  idCarta: bigint
) {
  const carta = await prisma.carta.findUnique({
    where: { id_carta: idCarta },
  });

  if (!carta) {
    return { estado: "carta_no_existe" as const };
  }

  const existente = await buscarSeguimientoUsuarioCarta(
    idUsuario,
    idCarta
  );

  if (existente) {
    return { estado: "duplicado" as const };
  }

  const seguimiento = await crearSeguimiento(
    idUsuario,
    idCarta
  );

  return {
    estado: "creado" as const,
    seguimiento: {
      ...seguimiento,
      id_seguimiento: seguimiento.id_seguimiento.toString(),
      id_usuario: seguimiento.id_usuario.toString(),
      id_carta: seguimiento.id_carta.toString(),
    },
  };
}

export async function borrarSeguimientoUsuario(
  idSeguimiento: bigint,
  idUsuario: bigint
) {
  const seguimiento = await buscarSeguimientoPorId(
    idSeguimiento
  );

  if (!seguimiento) {
    return "no_existe" as const;
  }

  if (seguimiento.id_usuario !== idUsuario) {
    return "prohibido" as const;
  }

  const resultado = await eliminarSeguimientoPropio(
    idSeguimiento,
    idUsuario
  );

  return resultado.count === 1
    ? "eliminado" as const
    : "no_existe" as const;
}