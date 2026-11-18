
# Diccionario de Datos — TCG Price Tracker

## 1. Introducción

Este documento describe la estructura de la base de datos relacional de TCG Price Tracker.

El sistema utiliza PostgreSQL y Prisma ORM para gestionar la persistencia de la información.

La base de datos contiene nueve entidades:

- ROL
- USUARIO
- JUEGO
- EDICION
- CARTA
- FUENTE_PRECIO
- PRECIO_HISTORICO
- SEGUIMIENTO
- ALERTA

Las siete últimas, excepto USUARIO y ROL, corresponden a entidades de negocio.

Los tipos indicados corresponden al diseño SQL previsto. Su implementación se realiza mediante migraciones.

## 2. Tabla ROL

Almacena los perfiles de acceso a la aplicación.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_rol | BIGINT | No | PK, identidad | Identificador del rol |
| nombre | VARCHAR(30) | No | UNIQUE | Nombre del rol |
| descripcion | VARCHAR(150) | Sí | — | Descripción del rol |

## 3. Tabla USUARIO

Almacena los datos de las cuentas registradas.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_usuario | BIGINT | No | PK, identidad | Identificador del usuario |
| id_rol | BIGINT | No | FK → ROL | Rol asignado |
| nombre | VARCHAR(80) | No | — | Nombre del usuario |
| email | VARCHAR(160) | No | UNIQUE | Correo electrónico |
| password_hash | VARCHAR(255) | No | — | Hash de la contraseña |
| fecha_creacion | TIMESTAMPTZ | No | DEFAULT CURRENT_TIMESTAMP | Fecha de registro |
| activo | BOOLEAN | No | DEFAULT TRUE | Estado de la cuenta |

## 4. Tabla JUEGO

Almacena los juegos de cartas coleccionables.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_juego | BIGINT | No | PK, identidad | Identificador del juego |
| nombre | VARCHAR(80) | No | UNIQUE | Nombre del juego |
| descripcion | TEXT | Sí | — | Descripción del juego |

## 5. Tabla EDICION

Representa las ediciones pertenecientes a un juego.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_edicion | BIGINT | No | PK, identidad | Identificador de edición |
| id_juego | BIGINT | No | FK → JUEGO | Juego al que pertenece |
| codigo | VARCHAR(40) | No | UNIQUE junto con id_juego | Código de edición |
| nombre | VARCHAR(120) | No | — | Nombre de edición |
| fecha_lanzamiento | DATE | Sí | — | Fecha de lanzamiento |

La combinación `(id_juego, codigo)` es única.

## 6. Tabla CARTA

Representa una impresión concreta de una carta.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_carta | BIGINT | No | PK, identidad | Identificador de carta |
| id_edicion | BIGINT | No | FK → EDICION | Edición de la carta |
| nombre | VARCHAR(160) | No | — | Nombre de la carta |
| numero_coleccionista | VARCHAR(40) | Sí | — | Número de colección |
| rareza | VARCHAR(30) | Sí | — | Rareza |
| acabado | VARCHAR(20) | Sí | — | Acabado o variante |

## 7. Tabla FUENTE_PRECIO

Identifica la procedencia de los registros de precios.

En el MVP solo se utiliza Cardmarket.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_fuente | BIGINT | No | PK, identidad | Identificador de fuente |
| nombre | VARCHAR(100) | No | UNIQUE | Nombre de la fuente |
| url_base | TEXT | No | — | Dirección web de referencia |
| activa | BOOLEAN | No | DEFAULT TRUE | Estado de la fuente |
| ultima_consulta | TIMESTAMPTZ | Sí | — | Fecha de última consulta registrada |

## 8. Tabla PRECIO_HISTORICO

Almacena observaciones de precios introducidas manualmente.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_precio | BIGINT | No | PK, identidad | Identificador del registro |
| id_carta | BIGINT | No | FK → CARTA | Carta asociada |
| id_fuente | BIGINT | No | FK → FUENTE_PRECIO | Fuente de referencia |
| precio | NUMERIC(12,2) | No | CHECK >= 0 | Precio registrado |
| moneda | CHAR(3) | No | DEFAULT 'EUR' | Código de moneda |
| fecha_registro | TIMESTAMPTZ | No | DEFAULT CURRENT_TIMESTAMP | Fecha de consulta |
| url_referencia | VARCHAR(500) | No | — | Enlace del producto |

Se establece un índice compuesto sobre `(id_carta, fecha_registro)`.

## 9. Tabla SEGUIMIENTO

Resuelve la relación muchos a muchos entre usuarios y cartas.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_seguimiento | BIGINT | No | PK, identidad | Identificador del seguimiento |
| id_usuario | BIGINT | No | FK → USUARIO | Usuario propietario |
| id_carta | BIGINT | No | FK → CARTA | Carta seguida |
| fecha_alta | TIMESTAMPTZ | No | DEFAULT CURRENT_TIMESTAMP | Fecha de alta |
| notificaciones_activas | BOOLEAN | No | DEFAULT TRUE | Preferencia de avisos |

La combinación `(id_usuario, id_carta)` es única.

## 10. Tabla ALERTA

Almacena las condiciones de precio configuradas por los usuarios.

| Campo | Tipo SQL | Nulo | Restricciones | Descripción |
|---|---|---|---|---|
| id_alerta | BIGINT | No | PK, identidad | Identificador de alerta |
| id_usuario | BIGINT | No | FK → USUARIO | Usuario propietario |
| id_carta | BIGINT | No | FK → CARTA | Carta asociada |
| precio_objetivo | NUMERIC(12,2) | No | CHECK > 0 | Umbral configurado |
| tipo_condicion | VARCHAR(30) | No | DEFAULT 'MENOR_IGUAL' | Tipo de condición |
| activa | BOOLEAN | No | DEFAULT TRUE | Estado de la alerta |
| fecha_creacion | TIMESTAMPTZ | No | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| ultima_notificacion | TIMESTAMPTZ | Sí | — | Último aviso generado |

El valor permitido de `tipo_condicion` en el MVP es `MENOR_IGUAL`.

## 11. Integridad referencial

Las relaciones utilizan claves foráneas para garantizar la consistencia.

Reglas de eliminación:

- ROL → USUARIO: RESTRICT.
- JUEGO → EDICION: RESTRICT.
- EDICION → CARTA: RESTRICT.
- CARTA → PRECIO_HISTORICO: RESTRICT.
- FUENTE_PRECIO → PRECIO_HISTORICO: RESTRICT.
- USUARIO → SEGUIMIENTO: CASCADE.
- USUARIO → ALERTA: CASCADE.
- CARTA → SEGUIMIENTO: RESTRICT.
- CARTA → ALERTA: RESTRICT.

Las restricciones se aplican en las migraciones de PostgreSQL.

## 12. Normalización

El modelo se diseña siguiendo la tercera forma normal:

- **1FN:** los atributos contienen valores atómicos.
- **2FN:** los atributos no clave dependen de la totalidad de la clave candidata.
- **3FN:** no existen dependencias transitivas entre atributos no clave.

La separación de juegos, ediciones, cartas, precios, usuarios y seguimientos reduce la duplicación de datos y facilita el mantenimiento.

## 13. Correspondencia con el DER

Este diccionario complementa el archivo `docs/der.md`.

Ambos documentos definen las mismas nueve entidades, sus relaciones y las restricciones previstas.

La implementación de la base de datos debe mantener la correspondencia con el esquema Prisma y las migraciones versionadas.
