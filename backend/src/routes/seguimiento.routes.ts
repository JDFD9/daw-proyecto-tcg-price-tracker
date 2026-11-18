
import { Router } from "express";
import {
  getMisSeguimientos,
  postSeguimiento,
  deleteSeguimiento,
} from "../controllers/seguimiento.controller";

import { authGuard } from "../middlewares/authGuard";

const router = Router();

router.get(
  "/mis-seguimientos",
  authGuard,
  getMisSeguimientos
);

router.post(
  "/",
  authGuard,
  postSeguimiento
);

router.delete(
  "/:id",
  authGuard,
  deleteSeguimiento
);

export default router;

