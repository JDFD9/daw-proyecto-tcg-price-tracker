
# ANTEPROYECTO TÉCNICO: TCG PRICE TRACKER

**Módulo:** Proyecto Intermodular (0379 · PIDW2) — 2.º DAW Virtual  
**Centro:** CIFP Avilés  
**Curso:** 2026/2027  
**Autor:** Jesús Diego Fernández Diez  
**Repositorio:** https://github.com/JDFD9/daw-proyecto-tcg-price-tracker  
**Tablero:** GitHub Projects — TCG Price Tracker - Hito 1

---

# Índice

1. Introducción y justificación
2. Objetivos del proyecto
3. Público objetivo y contexto de uso
4. Alcance funcional del proyecto
5. Roles y casos de uso
6. Historias de usuario y criterios de aceptación
7. Fuente de datos y gestión de precios
8. Modelo de datos y diseño relacional
9. Arquitectura y tecnologías
10. Add-ons y ampliaciones previstas
11. Organización y gestión del proyecto

---

# 1. Introducción y justificación

## 1.1. Descripción del proyecto

TCG Price Tracker es una aplicación web orientada al seguimiento de precios de cartas de juegos de cartas coleccionables (TCG). La plataforma permite consultar un catálogo de cartas, realizar búsquedas, crear listas personales de seguimiento y consultar el histórico de precios registrados.

El sistema almacena los precios consultados en Cardmarket, que constituye la única fuente de referencia del proyecto. En la primera versión, la incorporación de los precios se realiza manualmente a partir de la información consultada en dicha plataforma. La automatización queda condicionada a la disponibilidad de mecanismos de acceso autorizados.

La aplicación también permite configurar alertas mediante umbrales de precio. De esta forma, cada usuario puede identificar cuándo un precio registrado alcanza una condición que previamente establece.

## 1.2. Justificación

La consulta y el seguimiento de precios de cartas coleccionables requieren revisar periódicamente la información disponible en el mercado. Esta tarea puede resultar repetitiva cuando el usuario controla numerosas cartas.

TCG Price Tracker centraliza el registro de precios y su evolución histórica en una aplicación. El sistema facilita la organización de cartas, el seguimiento individual y la consulta de variaciones de precio.

El proyecto aplica tecnologías de desarrollo web, persistencia relacional, diseño de API REST, autenticación y control de acceso.

# 2. Objetivos del proyecto

## 2.1. Objetivo general

Desarrollar una aplicación web que gestione un catálogo de cartas coleccionables y permita registrar, consultar y seguir su evolución de precios tomando Cardmarket como única fuente de referencia.

## 2.2. Objetivos específicos

- Gestionar un catálogo de juegos, cartas y ediciones.
- Permitir el registro y la autenticación de usuarios.
- Facilitar la búsqueda y el filtrado de cartas.
- Permitir que cada usuario mantenga su propia lista de seguimiento.
- Registrar los precios consultados en Cardmarket.
- Conservar un histórico de precios asociado a cada carta.
- Permitir la configuración y consulta de alertas por umbral.
- Aplicar permisos diferenciados según el rol del usuario.
- Mantener la integridad y consistencia de la información almacenada.

# 3. Público objetivo y contexto de uso

La aplicación está dirigida a los siguientes perfiles:

- **Coleccionistas:** consultan la evolución de los precios de las cartas que les interesan.
- **Jugadores:** buscan cartas y controlan los precios registrados antes de realizar una compra.
- **Usuarios interesados en el mercado secundario:** realizan seguimientos y configuran alertas.
- **Administradores:** mantienen el catálogo, registran precios y gestionan los usuarios.

La plataforma funciona desde un navegador web y dispone de una interfaz adaptable a distintos tamaños de pantalla.

# 4. Alcance funcional del proyecto

## 4.1. Funcionalidades incluidas en el MVP

- Registro e inicio de sesión.
- Consulta de un catálogo inicial de cartas.
- Búsqueda y filtrado de cartas.
- Seguimiento personal de cartas.
- Registro manual de precios consultados en Cardmarket.
- Consulta del histórico de precios.
- Configuración de alertas por umbral de precio.
- Consulta de las alertas generadas.
- Gestión administrativa del catálogo y de los registros de precios.

## 4.2. Funcionalidades fuera del MVP

- Compra y venta de cartas desde la plataforma.
- Pasarela de pagos.
- Predicción automática de precios futuros.
- Aplicaciones móviles nativas.
- Integración automática con varias plataformas de precios.
- Actualización instantánea o garantizada de precios.
- Automatización de consultas a Cardmarket sin autorización.

# 5. Roles y casos de uso

## 5.1. Matriz de roles (RBAC)

**Administrador**
- Gestiona los usuarios.
- Crea, consulta, modifica y elimina juegos, cartas y ediciones.
- Registra y actualiza los precios consultados en Cardmarket.
- Supervisa los registros de precios y las alertas.

**Usuario registrado**
- Consulta y busca cartas.
- Gestiona su lista personal de seguimiento.
- Consulta el histórico de precios.
- Configura y consulta sus alertas.

**Público o invitado**
- Consulta la información pública disponible.
- Puede registrarse en la plataforma.
- No accede a las funciones personales ni administrativas.

## 5.2. Casos de uso principales

- **CU-01 — Registro e inicio de sesión:** permite crear una cuenta e iniciar sesión.
- **CU-02 — Gestión del catálogo:** permite al administrador gestionar juegos, cartas y ediciones.
- **CU-03 — Registro de precios:** permite registrar precios consultados en Cardmarket.
- **CU-04 — Búsqueda de cartas:** permite localizar cartas mediante texto y filtros.
- **CU-05 — Seguimiento personal:** permite añadir y retirar cartas de una lista personal.
- **CU-06 — Consulta del histórico:** permite consultar los precios registrados y su evolución temporal.
- **CU-07 — Configuración de alertas:** permite establecer umbrales de precio.
- **CU-08 — Consulta de alertas:** permite revisar las alertas generadas para el usuario.

# 6. Historias de usuario y criterios de aceptación

## HU-01 — Registro e inicio de sesión

**Como** visitante,  
**quiero** registrarme e iniciar sesión,  
**para** acceder a las funciones personales de la aplicación.

Criterios de aceptación:
- El sistema permite registrar una cuenta con los datos obligatorios.
- El correo electrónico no puede estar asociado a otra cuenta.
- El sistema valida las credenciales durante el inicio de sesión.
- Las contraseñas se almacenan mediante un algoritmo de hash seguro.
- Las operaciones privadas requieren autenticación.

## HU-02 — Catálogo de cartas

**Como** usuario,  
**quiero** consultar el catálogo de cartas,  
**para** localizar las cartas que me interesan.

Criterios de aceptación:
- El sistema muestra las cartas disponibles.
- Cada carta muestra su nombre y los datos principales registrados.
- El usuario puede consultar la información de una carta.
- Solo el administrador puede crear, modificar o eliminar cartas.

## HU-03 — Fuentes y registro de precios

**Como** administrador,  
**quiero** registrar los precios consultados en Cardmarket,  
**para** mantener actualizada la información económica de las cartas.

Criterios de aceptación:
- Cardmarket es la única fuente de referencia de precios del proyecto.
- El administrador registra la carta, el importe, la fecha de consulta y el enlace de referencia.
- El importe debe ser un valor numérico válido y no negativo.
- Cada registro queda asociado a la carta correspondiente.
- El sistema conserva los registros anteriores para mantener el histórico.

## HU-04 — Búsqueda y filtrado

**Como** usuario,  
**quiero** buscar y filtrar cartas,  
**para** localizar rápidamente los resultados que necesito.

Criterios de aceptación:
- El sistema permite buscar por nombre de carta.
- El sistema permite filtrar por juego.
- El sistema permite filtrar por edición cuando existe esa información.
- Los resultados cumplen los filtros seleccionados.
- Si no existen coincidencias, el sistema informa de ello.

## HU-05 — Seguimiento personal de cartas

**Como** usuario registrado,  
**quiero** añadir cartas a mi lista de seguimiento,  
**para** controlar los precios de las cartas que me interesan.

Criterios de aceptación:
- El usuario autenticado puede añadir una carta a su seguimiento.
- El sistema evita duplicar una misma carta en la lista del usuario.
- El usuario puede consultar sus cartas seguidas.
- El usuario puede retirar cartas de su lista.
- Un usuario no puede modificar el seguimiento de otra persona.

## HU-06 — Histórico de precios

**Como** usuario,  
**quiero** consultar el histórico de precios de una carta,  
**para** conocer cómo evoluciona su valor registrado.

Criterios de aceptación:
- El sistema muestra los registros históricos disponibles.
- Cada registro incluye importe y fecha de consulta.
- Los registros se muestran ordenados cronológicamente.
- El usuario puede consultar el histórico de una carta del catálogo.
- El sistema informa cuando una carta no dispone de registros históricos.

## HU-07 — Alertas de precio

**Como** usuario registrado,  
**quiero** establecer un precio objetivo para una carta,  
**para** identificar cuándo alcanza el valor que me interesa.

Criterios de aceptación:
- El usuario puede configurar un umbral de precio para una carta.
- El umbral debe ser un valor numérico positivo.
- El sistema comprueba la condición cuando se registra un nuevo precio.
- El sistema genera una alerta cuando se cumple la condición configurada.
- El usuario puede consultar y gestionar sus propias alertas.

## HU-08 — Consulta de alertas y disponibilidad registrada

**Como** usuario registrado,  
**quiero** consultar las alertas y la información de precios registrada,  
**para** conocer el estado de las cartas que sigo.

Criterios de aceptación:
- El usuario puede consultar sus alertas.
- Cada alerta identifica la carta y la condición que se cumple.
- El usuario puede distinguir las alertas pendientes de las ya consultadas.
- La información de precios muestra la fecha de su última consulta.
- El sistema no presenta la fecha de consulta como si fuera una comprobación de disponibilidad en tiempo real.

# 7. Fuente de datos y gestión de precios

## 7.1. Fuente única

Cardmarket constituye la única fuente de referencia de precios de TCG Price Tracker.

La primera versión registra manualmente los precios consultados en las fichas de producto de Cardmarket. No se combinan datos de otras plataformas ni se presentan precios procedentes de fuentes diferentes como si fueran de Cardmarket.

## 7.2. Datos registrados

Cada registro de precio contiene:
- Carta a la que corresponde.
- Importe consultado.
- Moneda.
- Fecha y hora de consulta.
- Enlace de referencia al producto de Cardmarket.

## 7.3. Limitaciones

La obtención automática de precios no forma parte del MVP. Cualquier automatización futura depende de la disponibilidad de mecanismos de acceso y de las autorizaciones correspondientes.

# 8. Modelo de datos y diseño relacional

## 8.1. Entidades de negocio

El modelo contempla las siguientes entidades:

- **JUEGO:** almacena los juegos de cartas compatibles.
- **CARTA:** almacena la información de las cartas.
- **EDICION:** identifica las ediciones de publicación.
- **FUENTE_PRECIO:** identifica la fuente de referencia, Cardmarket.
- **PRECIO_HISTORICO:** conserva los registros de precios consultados.
- **SEGUIMIENTO:** relaciona usuarios y cartas seguidas.
- **ALERTA:** almacena las condiciones de precio configuradas por los usuarios.

Las entidades USUARIO y ROL gestionan la autenticación y los permisos, pero no se contabilizan como entidades de negocio.

## 8.2. Relaciones

- **JUEGO 1:N CARTA:** un juego contiene varias cartas y cada carta pertenece a un juego.
- **EDICION 1:N CARTA:** una edición puede incluir varias cartas y cada carta se asocia a la edición correspondiente.
- **CARTA 1:N PRECIO_HISTORICO:** una carta dispone de varios registros históricos de precio.
- **FUENTE_PRECIO 1:N PRECIO_HISTORICO:** una fuente identifica el origen de los registros de precios.
- **USUARIO M:N CARTA:** un usuario puede seguir varias cartas y una carta puede estar en las listas de seguimiento de varios usuarios. La relación se implementa mediante SEGUIMIENTO, que almacena atributos propios como la fecha de alta.
- **USUARIO 1:N ALERTA:** un usuario puede configurar varias alertas.
- **CARTA 1:N ALERTA:** una carta puede tener alertas configuradas por distintos usuarios.

## 8.3. Justificación de la tercera forma normal (3FN)

El diseño aplica los principios de normalización:

- **Primera forma normal (1FN):** los atributos almacenan valores atómicos y no contienen listas de datos repetidos.
- **Segunda forma normal (2FN):** los atributos no clave dependen de la totalidad de la clave primaria, especialmente en las relaciones con claves compuestas.
- **Tercera forma normal (3FN):** los atributos no clave dependen directamente de la clave primaria y no de otros atributos no clave.

Las relaciones entre entidades se representan mediante claves foráneas y tablas intermedias. Esta organización reduce la redundancia y evita anomalías de inserción, modificación y eliminación.

El diagrama entidad-relación se encuentra en `docs/der.md`.

# 9. Arquitectura y tecnologías

## 9.1. Base de datos

**PostgreSQL:** almacena los usuarios, roles, juegos, cartas, ediciones, seguimientos, alertas y registros históricos. El sistema utiliza claves primarias, claves foráneas y restricciones para mantener la integridad de los datos.

## 9.2. Backend

**Node.js y Express:** implementan la API REST y gestionan las peticiones del cliente. La lógica de negocio se organiza en capas para separar rutas, controladores, servicios y acceso a datos.

## 9.3. Persistencia

**Prisma ORM:** gestiona el acceso a PostgreSQL, el modelo de datos y las migraciones de la base de datos.

## 9.4. Frontend

**React:** construye la interfaz de usuario mediante componentes reutilizables y permite consultar e interactuar con la API REST.

## 9.5. Seguridad

La autenticación utiliza contraseñas almacenadas mediante hash seguro y tokens JWT. El control de acceso diferencia las operaciones disponibles para administradores y usuarios registrados.

## 9.6. Despliegue

Render se contempla para el backend y la base de datos, mientras que Vercel se contempla para el frontend. La configuración definitiva depende de las necesidades y limitaciones de los planes disponibles.

# 10. Add-ons y ampliaciones previstas

Se consideran las siguientes ampliaciones:

- Docker Compose para la ejecución del entorno multicontenedor.
- GitHub Actions para automatizar integración y comprobaciones.
- Almacenamiento externo mediante S3 o Cloudinary.
- Informes PDF y Excel generados desde el backend.
- Comunicación en tiempo real mediante WebSockets.
- Pruebas automatizadas de los endpoints.
- Documentación interactiva mediante OpenAPI y Swagger.

La selección definitiva de ampliaciones se realiza según el tiempo disponible y los requisitos de las siguientes entregas.

# 11. Organización y gestión del proyecto

El proyecto utiliza Git y GitHub para el control de versiones y la organización del trabajo.

El repositorio mantiene las ramas principales `main` y `develop`. Las nuevas funcionalidades se desarrollan en ramas específicas y se integran mediante solicitudes de incorporación de cambios.

GitHub Projects organiza las tareas mediante las columnas:

- Product Backlog.
- Sprint 2 (Backend & DB).
- In Progress.
- Done.

Las tareas se registran como historias de usuario y contienen criterios de aceptación que permiten comprobar su cumplimiento.

El repositorio incorpora documentación técnica, archivos de configuración de ejemplo y los recursos necesarios para reproducir el entorno de desarrollo.

