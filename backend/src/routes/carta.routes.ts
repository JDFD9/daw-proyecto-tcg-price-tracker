import { Router } from "express";
import {
  getCartas,
  getCartaPorId,
  postCarta,
  putCarta,
  deleteCarta,
} from "../controllers/carta.controller";

import { authGuard } from "../middlewares/authGuard";
import { roleGuard } from "../middlewares/roleGuard";

const router = Router();

router.get("/", getCartas);
router.get("/:id", getCartaPorId);

router.post("/", authGuard, roleGuard("admin"), postCarta);
router.put("/:id", authGuard, roleGuard("admin"), putCarta);
router.delete("/:id", authGuard, roleGuard("admin"), deleteCarta);

export default router;