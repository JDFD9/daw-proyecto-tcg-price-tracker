
import type { Request, Response, NextFunction } from "express";
import { listarCartas, buscarCarta } from "../services/carta.service";
import { registrarCarta } from "../services/carta.service";
import {
  modificarCarta,
  borrarCarta,
} from "../services/carta.service";
export async function getCartas(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cartas = await listarCartas();
    res.status(200).json(cartas);
  } catch (error) {
    next(error);
  }
}

export async function getCartaPorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);

    if (!/^[1-9]\d*$/.test(id)) {
      res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "El ID de la carta debe ser un entero positivo.",
      });
      return;
    }

    const carta = await buscarCarta(BigInt(id));

    if (!carta) {
      res.status(404).type("application/problem+json").json({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "La carta solicitada no existe.",
      });
      return;
    }

    res.status(200).json(carta);
  } catch (error) {
    next(error);
  }
}

export async function postCarta(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      nombre,
      id_edicion,
      numero_coleccionista,
      rareza,
      acabado,
    } = req.body ?? {};

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      !/^[1-9]\d*$/.test(String(id_edicion ?? ""))
    ) {
      res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "Debes indicar un nombre y un ID de edición válido.",
      });
      return;
    }

    const camposOpcionales = [
      numero_coleccionista,
      rareza,
      acabado,
    ];

    if (
      camposOpcionales.some(
        (valor) => valor !== undefined &&
          typeof valor !== "string"
      )
    ) {
      res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "Los campos opcionales deben ser textos.",
      });
      return;
    }

    const carta = await registrarCarta({
      nombre: nombre.trim(),
      id_edicion: BigInt(id_edicion),
      numero_coleccionista,
      rareza,
      acabado,
    });

    if (!carta) {
      res.status(404).type("application/problem+json").json({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "La edición indicada no existe.",
      });
      return;
    }

    res.status(201).json(carta);
  } catch (error) {
    next(error);
  }
}

export async function putCarta(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);

    if (!/^[1-9]\d*$/.test(id)) {
      res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "El ID debe ser un entero positivo.",
      });
      return;
    }

    const datos = req.body ?? {};

    const campos = [
      "nombre",
      "numero_coleccionista",
      "rareza",
      "acabado",
    ] as const;

    if (
      typeof datos !== "object" ||
      Array.isArray(datos) ||
      !campos.some((campo) => datos[campo] !== undefined) ||
      Object.keys(datos).some(
        (campo) => !campos.includes(campo as typeof campos[number])
      ) ||
      campos.some(
        (campo) =>
          datos[campo] !== undefined &&
          typeof datos[campo] !== "string"
      ) ||
      (datos.nombre !== undefined && !datos.nombre.trim())
    ) {
      res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "Los datos de la carta no son válidos.",
      });
      return;
    }

    const carta = await modificarCarta(BigInt(id), datos);

    if (!carta) {
      res.status(404).type("application/problem+json").json({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "La carta no existe.",
      });
      return;
    }

    res.status(200).json(carta);
  } catch (error) {
    next(error);
  }
}

export async function deleteCarta(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);

    if (!/^[1-9]\d*$/.test(id)) {
      res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "El ID debe ser un entero positivo.",
      });
      return;
    }

    const eliminado = await borrarCarta(BigInt(id));

    if (!eliminado) {
      res.status(404).type("application/problem+json").json({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "La carta no existe.",
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}