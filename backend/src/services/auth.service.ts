
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export async function login(email: string, password: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { rol: true },
  });

  if (!usuario || !usuario.activo) {
    return null;
  }

  const passwordValida = await bcrypt.compare(
    password,
    usuario.password_hash
  );

  if (!passwordValida) {
    return null;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET debe tener al menos 32 caracteres");
  }

  const token = jwt.sign(
    {
      sub: usuario.id_usuario.toString(),
      rol: usuario.rol.nombre,
    },
    secret,
    { expiresIn: "2h" }
  );

  return {
    token,
    usuario: {
      id: usuario.id_usuario.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol.nombre,
    },
  };
}
