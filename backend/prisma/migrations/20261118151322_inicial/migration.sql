-- CreateTable
CREATE TABLE "rol" (
    "id_rol" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "descripcion" VARCHAR(150),

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" BIGSERIAL NOT NULL,
    "id_rol" BIGINT NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "juego" (
    "id_juego" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "juego_pkey" PRIMARY KEY ("id_juego")
);

-- CreateTable
CREATE TABLE "edicion" (
    "id_edicion" BIGSERIAL NOT NULL,
    "id_juego" BIGINT NOT NULL,
    "codigo" VARCHAR(40) NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "fecha_lanzamiento" DATE,

    CONSTRAINT "edicion_pkey" PRIMARY KEY ("id_edicion")
);

-- CreateTable
CREATE TABLE "carta" (
    "id_carta" BIGSERIAL NOT NULL,
    "id_edicion" BIGINT NOT NULL,
    "nombre" VARCHAR(160) NOT NULL,
    "numero_coleccionista" VARCHAR(40),
    "rareza" VARCHAR(30),
    "acabado" VARCHAR(20),

    CONSTRAINT "carta_pkey" PRIMARY KEY ("id_carta")
);

-- CreateTable
CREATE TABLE "fuente_precio" (
    "id_fuente" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "url_base" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "ultima_consulta" TIMESTAMPTZ(6),

    CONSTRAINT "fuente_precio_pkey" PRIMARY KEY ("id_fuente")
);

-- CreateTable
CREATE TABLE "precio_historico" (
    "id_precio" BIGSERIAL NOT NULL,
    "id_carta" BIGINT NOT NULL,
    "id_fuente" BIGINT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'EUR',
    "fecha_registro" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url_referencia" VARCHAR(500) NOT NULL,

    CONSTRAINT "precio_historico_pkey" PRIMARY KEY ("id_precio")
);

-- CreateTable
CREATE TABLE "seguimiento" (
    "id_seguimiento" BIGSERIAL NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_carta" BIGINT NOT NULL,
    "fecha_alta" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notificaciones_activas" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "seguimiento_pkey" PRIMARY KEY ("id_seguimiento")
);

-- CreateTable
CREATE TABLE "alerta" (
    "id_alerta" BIGSERIAL NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_carta" BIGINT NOT NULL,
    "precio_objetivo" DECIMAL(12,2) NOT NULL,
    "tipo_condicion" VARCHAR(30) NOT NULL DEFAULT 'MENOR_IGUAL',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_notificacion" TIMESTAMPTZ(6),

    CONSTRAINT "alerta_pkey" PRIMARY KEY ("id_alerta")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "juego_nombre_key" ON "juego"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "edicion_id_juego_codigo_key" ON "edicion"("id_juego", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "fuente_precio_nombre_key" ON "fuente_precio"("nombre");

-- CreateIndex
CREATE INDEX "precio_historico_id_carta_fecha_registro_idx" ON "precio_historico"("id_carta", "fecha_registro");

-- CreateIndex
CREATE UNIQUE INDEX "seguimiento_id_usuario_id_carta_key" ON "seguimiento"("id_usuario", "id_carta");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edicion" ADD CONSTRAINT "edicion_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "juego"("id_juego") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carta" ADD CONSTRAINT "carta_id_edicion_fkey" FOREIGN KEY ("id_edicion") REFERENCES "edicion"("id_edicion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precio_historico" ADD CONSTRAINT "precio_historico_id_carta_fkey" FOREIGN KEY ("id_carta") REFERENCES "carta"("id_carta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precio_historico" ADD CONSTRAINT "precio_historico_id_fuente_fkey" FOREIGN KEY ("id_fuente") REFERENCES "fuente_precio"("id_fuente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimiento" ADD CONSTRAINT "seguimiento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimiento" ADD CONSTRAINT "seguimiento_id_carta_fkey" FOREIGN KEY ("id_carta") REFERENCES "carta"("id_carta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerta" ADD CONSTRAINT "alerta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerta" ADD CONSTRAINT "alerta_id_carta_fkey" FOREIGN KEY ("id_carta") REFERENCES "carta"("id_carta") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Evitar precios negativos
ALTER TABLE "precio_historico"
ADD CONSTRAINT "precio_no_negativo"
CHECK ("precio" >= 0);

-- Evitar objetivos de precio iguales o inferiores a cero
ALTER TABLE "alerta"
ADD CONSTRAINT "precio_objetivo_positivo"
CHECK ("precio_objetivo" > 0);