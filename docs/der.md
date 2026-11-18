# Diagrama Entidad-Relación (DER) --- TCG Price Tracker

Este documento define el modelo de datos inicial de **TCG Price
Tracker**, una aplicación web para consultar precios de cartas
coleccionables, guardar cartas en seguimiento y configurar alertas.

## 1. Diagrama entidad-relación

El diagrama está escrito en Mermaid. GitHub puede representarlo
directamente dentro de este archivo Markdown.

``` mermaid
erDiagram
    ROL ||--o{ USUARIO : "asigna"
    JUEGO ||--o{ EDICION : "contiene"
    EDICION ||--o{ CARTA : "incluye"
    USUARIO ||--o{ SEGUIMIENTO : "crea"
    CARTA ||--o{ SEGUIMIENTO : "es seguida en"
    USUARIO ||--o{ ALERTA : "configura"
    CARTA ||--o{ ALERTA : "recibe"
    CARTA ||--o{ PRECIO_HISTORICO : "registra"
    FUENTE_PRECIO ||--o{ PRECIO_HISTORICO : "proporciona"

    ROL {
        BIGINT id_rol PK
        VARCHAR(30) nombre UK
        VARCHAR(150) descripcion
    }

    USUARIO {
        BIGINT id_usuario PK
        BIGINT id_rol FK
        VARCHAR(80) nombre
        VARCHAR(160) email UK
        VARCHAR(255) password_hash
        TIMESTAMPTZ fecha_creacion
        BOOLEAN activo
    }

    JUEGO {
        BIGINT id_juego PK
        VARCHAR(80) nombre UK
        TEXT descripcion
    }

    EDICION {
        BIGINT id_edicion PK
        BIGINT id_juego FK
        VARCHAR(40) codigo
        VARCHAR(120) nombre
        DATE fecha_lanzamiento
    }

    CARTA {
        BIGINT id_carta PK
        BIGINT id_edicion FK
        VARCHAR(160) nombre
        VARCHAR(40) numero_coleccionista
        VARCHAR(30) rareza
        VARCHAR(20) acabado
    }

    FUENTE_PRECIO {
        BIGINT id_fuente PK
        VARCHAR(100) nombre UK
        TEXT url_base
        BOOLEAN activa
        TIMESTAMPTZ ultima_consulta
    }

    PRECIO_HISTORICO {
        BIGINT id_precio PK
        BIGINT id_carta FK
        BIGINT id_fuente FK
        NUMERIC(12,2) precio
        CHAR(3) moneda
        TIMESTAMPTZ fecha_registro
        INTEGER unidades_disponibles
    }

    SEGUIMIENTO {
        BIGINT id_seguimiento PK
        BIGINT id_usuario FK
        BIGINT id_carta FK
        TIMESTAMPTZ fecha_alta
        BOOLEAN notificaciones_activas
    }

    ALERTA {
        BIGINT id_alerta PK
        BIGINT id_usuario FK
        BIGINT id_carta FK
        NUMERIC(12,2) precio_objetivo
        VARCHAR(30) tipo_condicion
        BOOLEAN activa
        TIMESTAMPTZ fecha_creacion
        TIMESTAMPTZ ultima_notificacion
    }
```

## 2. Descripción de las entidades

  -----------------------------------------------------------------------
  Entidad                             Finalidad
  ----------------------------------- -----------------------------------
  `ROL`                               Define los permisos generales de la
                                      aplicación, por ejemplo,
                                      administrador y usuario registrado.

  `USUARIO`                           Guarda los datos de acceso y el
                                      estado de cada cuenta. La
                                      contraseña se almacena como hash,
                                      nunca en texto plano.

  `JUEGO`                             Representa un juego de cartas
                                      coleccionables, por ejemplo, Magic:
                                      The Gathering. El diseño permite
                                      añadir otros juegos en el futuro.

  `EDICION`                           Representa una colección o edición
                                      publicada para un juego.

  `CARTA`                             Representa una impresión concreta
                                      de una carta dentro de una edición,
                                      incluyendo número de coleccionista,
                                      rareza y acabado.

  `FUENTE_PRECIO`                     Identifica la web o proveedor del
                                      que se obtienen precios y
                                      disponibilidad.

  `PRECIO_HISTORICO`                  Guarda cada observación de precio
                                      y, cuando la fuente lo permita, las
                                      unidades disponibles en ese
                                      momento.

  `SEGUIMIENTO`                       Tabla intermedia que relaciona
                                      usuarios con cartas seguidas y
                                      guarda preferencias propias de esa
                                      relación.

  `ALERTA`                            Guarda las condiciones de precio
                                      configuradas por un usuario para
                                      una carta.
  -----------------------------------------------------------------------

## 3. Relaciones y cardinalidades

-   **ROL 1:N USUARIO:** un rol puede asignarse a muchos usuarios; cada
    usuario tiene un rol.
-   **JUEGO 1:N EDICION:** un juego puede tener muchas ediciones; cada
    edición pertenece a un juego.
-   **EDICION 1:N CARTA:** una edición puede contener muchas cartas;
    cada carta del modelo pertenece a una edición.
-   **USUARIO N:M CARTA mediante SEGUIMIENTO:** un usuario puede seguir
    muchas cartas y una carta puede ser seguida por muchos usuarios.
    `SEGUIMIENTO` resuelve la relación e incluye atributos propios:
    fecha de alta y estado de las notificaciones.
-   **USUARIO 1:N ALERTA:** un usuario puede crear varias alertas; cada
    alerta pertenece a un usuario.
-   **CARTA 1:N ALERTA:** una carta puede tener alertas de distintos
    usuarios o varias condiciones; cada alerta apunta a una carta.
-   **CARTA 1:N PRECIO_HISTORICO:** una carta puede acumular muchas
    observaciones de precio.
-   **FUENTE_PRECIO 1:N PRECIO_HISTORICO:** una fuente puede
    proporcionar muchas observaciones históricas.

## 4. Claves y restricciones recomendadas

Además de las claves primarias y foráneas mostradas en el diagrama, al
implementar la base de datos se recomienda definir:

-   `USUARIO.email` como único y obligatorio.
-   `ROL.nombre`, `JUEGO.nombre` y `FUENTE_PRECIO.nombre` como únicos.
-   `EDICION (id_juego, codigo)` como combinación única, para evitar
    duplicar el código de una edición dentro del mismo juego.
-   `SEGUIMIENTO (id_usuario, id_carta)` como combinación única, para
    impedir que un usuario siga dos veces la misma carta.
-   `PRECIO_HISTORICO.precio >= 0` y `ALERTA.precio_objetivo >= 0`.
-   `PRECIO_HISTORICO.unidades_disponibles >= 0` cuando el dato no sea
    nulo.
-   Campos obligatorios (`NOT NULL`) en las claves, nombres y datos
    imprescindibles para cada entidad.
-   Índices en las claves foráneas y en
    `PRECIO_HISTORICO (id_carta, fecha_registro)` para agilizar las
    búsquedas de historial.

Los valores de `tipo_condicion` deben limitarse a los tipos de alerta
que implemente la aplicación. Para el MVP puede bastar una alerta cuando
el precio sea menor o igual al precio objetivo.

## 5. Justificación de la tercera forma normal (3FN)

El modelo está planteado para aproximarse a la **tercera forma normal
(3FN)** siguiendo estos criterios:

1.  **Primera forma normal (1FN):** cada atributo contiene un único
    valor por fila; no se almacenan listas de cartas, fuentes o alertas
    dentro de una misma columna.
2.  **Segunda forma normal (2FN):** las entidades utilizan claves
    primarias simples. En `SEGUIMIENTO`, la relación entre usuario y
    carta se representa en una fila independiente y sus atributos
    dependen de esa relación completa; además, se recomienda la
    restricción única `(id_usuario, id_carta)`.
3.  **Tercera forma normal (3FN):** los datos de rol, juego, edición y
    fuente se almacenan en sus propias entidades. Por ejemplo, el nombre
    de un juego no se repite en cada carta ni los datos de una fuente se
    repiten en cada precio; las claves foráneas enlazan esas entidades.

La validación definitiva de 3FN deberá comprobarse al desarrollar el
esquema SQL real y sus dependencias funcionales.

## 6. Alcance y decisiones del modelo

-   El modelo contempla un catálogo de cartas, ediciones, fuentes de
    precios, histórico, seguimiento personal y alertas.
-   Los datos de precio y disponibilidad dependen de lo que ofrezca cada
    fuente y de sus condiciones de acceso.
-   `CARTA` representa una impresión concreta de una carta, no
    necesariamente el concepto abstracto de la carta en todos sus
    idiomas, ediciones y acabados. Si el proyecto necesita comparar
    todas las impresiones de una misma carta, se podrá añadir más
    adelante una entidad conceptual `CARTA_BASE`.
-   El modelo no incluye pagos, compras ni ventas, ya que quedan fuera
    del MVP inicial.
