
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/prisma";

export interface AuthRequest extends Request {
  usuario?: {
    id: string;
    rol: string;
  };
}

export async function authGuard(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).type("application/problem+json").json({
      type: "about:blank",
      title: "Unauthorized",
      status: 401,
      detail: "Debes enviar un token de autenticación.",
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
      throw new Error("JWT_SECRET no está configurado correctamente");
    }

    const token = authorization.slice(7);
    const payload = jwt.verify(token, secret) as JwtPayload;

    if (typeof payload.sub !== "string" || !/^\d+$/.test(payload.sub)) {
      throw new jwt.JsonWebTokenError("Token inválido");
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: BigInt(payload.sub) },
      include: { rol: true },
    });

    if (!usuario || !usuario.activo) {
      res.status(401).type("application/problem+json").json({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Usuario inexistente o inactivo.",
      });
      return;
    }

    req.usuario = {
      id: usuario.id_usuario.toString(),
      rol: usuario.rol.nombre,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).type("application/problem+json").json({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Token inválido o caducado.",
      });
      return;
    }

    next(error);
  }
}
