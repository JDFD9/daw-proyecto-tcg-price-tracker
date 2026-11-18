
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authGuard";

export function roleGuard(...rolesPermitidos: string[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.usuario) {
      res.status(401).type("application/problem+json").json({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Debes iniciar sesión.",
      });
      return;
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      res.status(403).type("application/problem+json").json({
        type: "about:blank",
        title: "Forbidden",
        status: 403,
        detail: "No tienes permisos para acceder a este recurso.",
      });
      return;
    }

    next();
  };
}
