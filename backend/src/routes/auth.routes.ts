

import { Router } from "express";
import { loginController } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/authGuard";
import { roleGuard } from "../middlewares/roleGuard";

const router = Router();

router.post("/login", loginController);

router.get("/me", authGuard, (req, res) => {
  res.status(200).json({
    mensaje: "Acceso autorizado",
    usuario: req.usuario,
  });
});

router.get(
  "/admin",
  authGuard,
  roleGuard("admin"),
  (_req, res) => {
    res.status(200).json({
      mensaje: "Bienvenido al área de administración",
    });
  }
);

export default router;
