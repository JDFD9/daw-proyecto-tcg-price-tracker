
import express from "express";
import cors from "cors";
import { Prisma } from "../generated/prisma/client";
import authRoutes from "./routes/auth.routes";
import cartaRoutes from "./routes/carta.routes";
import seguimientoRoutes from "./routes/seguimiento.routes";
export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API TCG Price Tracker funcionando",
  });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/cartas", cartaRoutes);
app.use("/api/seguimientos", seguimientoRoutes);
// Ruta no encontrada
app.use((req, res) => {
  res.status(404).type("application/problem+json").json({
    type: "about:blank",
    title: "Not Found",
    status: 404,
    detail: `No existe la ruta ${req.originalUrl}`,
  });
});

app.use((
  error: unknown,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003" || error.code === "P2014") {
      res.status(409).type("application/problem+json").json({
        type: "about:blank",
        title: "Conflict",
        status: 409,
        detail: "No se puede realizar la operación porque existen registros relacionados.",
      });
      return;
    }

    if (error.code === "P2002") {
      res.status(409).type("application/problem+json").json({
        type: "about:blank",
        title: "Conflict",
        status: 409,
        detail: "Ya existe un registro con esos datos únicos.",
      });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).type("application/problem+json").json({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "El registro solicitado no existe.",
      });
      return;
    }
  }

  console.error("Error interno de la API:", error);

  res.status(500).type("application/problem+json").json({
    type: "about:blank",
    title: "Internal Server Error",
    status: 500,
    detail: "Se ha producido un error interno en el servidor.",
  });
});
