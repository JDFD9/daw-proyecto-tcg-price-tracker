
import type { Request, Response, NextFunction } from "express";
import { login } from "../services/auth.service";

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(422).type("application/problem+json").json({
        type: "about:blank",
        title: "Unprocessable Content",
        status: 422,
        detail: "Debes introducir un correo y una contraseña.",
      });
    }

    const resultado = await login(email.trim(), password);

    if (!resultado) {
      return res.status(401).type("application/problem+json").json({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Correo o contraseña incorrectos.",
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}
