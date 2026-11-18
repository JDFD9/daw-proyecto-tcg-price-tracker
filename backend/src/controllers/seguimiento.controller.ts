
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/authGuard";
import { listarSeguimientosUsuario } from "../services/seguimiento.service";
import {
  registrarSeguimiento,
  borrarSeguimientoUsuario,
} from "../services/seguimiento.service";
export async function getMisSeguimientos(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.usuario) {
      res.status(401).type("application/problem+json").json({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Debes iniciar sesión.",
      });
      return;
    }

    const seguimientos = await listarSeguimientosUsuario(
      BigInt(req.usuario.id)
    );

    res.status(200).json(seguimientos);
  } catch (error) {
    next(error);
  }
}

export async function postSeguimiento(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.usuario) {
      res.status(401).type("application/problem+json").json({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Debes iniciar sesión.",
      });
      return;
    }

    const idCarta = req.body?.id_carta;

    if (!/^[1-9]\d*$/.test(String(idCarta ?? ""))) {
      res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "Debes indicar un ID de carta válido.",
      });
      return;
    }

    const resultado = await registrarSeguimiento(
      BigInt(req.usuario.id),
      BigInt(idCarta)
    );

    if (resultado.estado === "carta_no_existe") {
      res.status(404).type("application/problem+json").json({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "La carta indicada no existe.",
      });
      return;
    }

    if (resultado.estado === "duplicado") {
      res.status(409).type("application/problem+json").json({
        type: "about:blank",
        title: "Conflict",
        status: 409,
        detail: "Ya estás siguiendo esta carta.",
      });
      return;
    }

    res.status(201).json(resultado.seguimiento);
  } catch (error) {
    next(error);
  }
}

export async function deleteSeguimiento(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.usuario) {
      res.status(401).type("application/problem+json").json({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Debes iniciar sesión.",
      });
      return;
    }

    const id = String(req.params.id);

    if (!/^[1-9]\d*$/.test(id)) {
      res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "El ID del seguimiento no es válido.",
      });
      return;
    }

    const resultado = await borrarSeguimientoUsuario(
      BigInt(id),
      BigInt(req.usuario.id)
    );

    if (resultado === "no_existe") {
      res.status(404).type("application/problem+json").json({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "El seguimiento no existe.",
      });
      return;
    }

    if (resultado === "prohibido") {
      res.status(403).type("application/problem+json").json({
        type: "about:blank",
        title: "Forbidden",
        status: 403,
        detail: "No puedes eliminar seguimientos de otros usuarios.",
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}