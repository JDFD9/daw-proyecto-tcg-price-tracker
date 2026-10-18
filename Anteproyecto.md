Anteproyecto: TCG Price Tracker

Módulo: Proyecto Intermodular (0379 · PIDW2) — 2.º DAW Virtual
Centro: CIFP Avilés (Curso 2026/2027)
Autor/a: [Jesús Diego Fernández Diez]
Repositorio GitHub: https://github.com/JDFD9/daw-proyecto-tcg-price-tracker
Tablero GitHub Projects: Pendiente de crear

1. Justificación y dominio funcional
1.1. Elevator pitch

TCG Price Tracker es una aplicación web destinada a coleccionistas y jugadores de juegos de cartas coleccionables que necesitan consultar y seguir la evolución de sus precios. Actualmente, comprobar si una carta se ha revalorizado o ha bajado de precio puede requerir revisar diferentes tiendas y plataformas de forma manual. La aplicación centralizará la información disponible de las cartas compatibles, permitirá crear listas personales de seguimiento y conservará un histórico de precios para analizar sus variaciones. Además, los usuarios podrán configurar umbrales de precio y recibir avisos cuando se cumplan las condiciones establecidas. El sistema estará diseñado para admitir diferentes juegos de cartas, siempre que existan fuentes de datos compatibles. Su objetivo es facilitar el seguimiento del mercado, reducir las consultas manuales y ayudar a los usuarios a tomar decisiones informadas.

1.2. Público objetivo y contexto de uso

La aplicación estará dirigida a:

Coleccionistas: desean conocer la evolución del valor de sus cartas.
Jugadores: quieren localizar cartas y controlar su coste antes de adquirirlas.
Usuarios interesados en el mercado secundario: necesitan consultar variaciones de precios y configurar alertas.
Administradores: mantienen el catálogo, supervisan las fuentes de precios y gestionan los usuarios.

La plataforma se utilizará desde un navegador web. La actualización de precios dependerá de la disponibilidad, frecuencia y condiciones de acceso de las fuentes de datos compatibles.

2. Roles del sistema y casos de uso
2.1. Matriz de roles (RBAC)
Administrador: gestiona usuarios, juegos, cartas, ediciones y fuentes de datos; supervisa las actualizaciones y consulta estadísticas generales.
Usuario registrado: busca cartas, crea listas de seguimiento, consulta históricos y configura alertas de precios.
Público / invitado: consulta la información pública disponible y puede registrarse. No puede administrar cartas ni gestionar listas personales.
2.2. Casos de uso principales
CU-01 — Registro e inicio de sesión: el usuario crea una cuenta e inicia sesión de forma segura.
CU-02 — Gestión del catálogo: el administrador crea, consulta, modifica y elimina registros de juegos, cartas y ediciones.
CU-03 — Supervisión de fuentes: el administrador consulta el estado de las fuentes de precios y las incidencias de actualización.
CU-04 — Búsqueda de cartas: el usuario busca cartas por nombre, juego, edición u otros filtros disponibles.
CU-05 — Seguimiento personal: el usuario añade o elimina cartas de su lista de seguimiento.
CU-06 — Consulta del histórico: el usuario visualiza los precios registrados y su evolución temporal.
CU-07 — Configuración de alertas: el usuario establece un precio objetivo o una variación que desea vigilar.
CU-08 — Consulta de alertas: el usuario revisa los avisos generados cuando se cumplen las condiciones configuradas.
2.3. Alcance del MVP (Hito 3, diciembre)

Incluido:

Registro e inicio de sesión.
Consulta y búsqueda de un catálogo inicial de cartas.
Seguimiento personal de cartas.
Registro y consulta del histórico de precios.
Configuración de alertas por umbral de precio.
Interfaz web adaptable a distintos tamaños de pantalla.
Actualización de precios desde al menos una fuente compatible, si su acceso técnico y sus condiciones lo permiten.

Fuera del MVP:

Cobertura garantizada de todos los TCG y mercados existentes.
Compra y venta de cartas dentro de la plataforma.
Pasarela de pagos.
Predicciones automáticas del precio futuro.
Aplicaciones móviles nativas.
Garantía de actualización instantánea de todas las fuentes.
3. Modelo de datos

Diagrama entidad-relación en 3FN: docs/der.md

Entidades de negocio previstas:

JUEGO
CARTA
EDICION
FUENTE_PRECIO
PRECIO_HISTORICO
SEGUIMIENTO
ALERTA

Las entidades de usuarios y roles se añadirán para gestionar la autenticación y los permisos.

Relación 1:N: un juego puede contener muchas cartas; cada carta pertenece a un juego.

Relación M:N con atributos propios: los usuarios pueden seguir muchas cartas y una carta puede ser seguida por muchos usuarios. La relación se resuelve mediante SEGUIMIENTO, que podrá almacenar la fecha de alta y las preferencias de seguimiento.

Justificación de la 3FN: cada entidad tendrá una clave primaria que identificará sus registros. Los atributos serán atómicos y no se almacenarán listas repetidas en una misma columna. Las relaciones entre entidades se representarán mediante claves foráneas y tablas intermedias. Los atributos no clave dependerán de la clave, de toda la clave y de ningún otro atributo no clave. Se evitarán las dependencias parciales y transitivas para reducir redundancias y anomalías de actualización.

4. Stack tecnológico previsto
Motor de base de datos: PostgreSQL, por sus capacidades relacionales, integridad referencial y soporte de consultas complejas.
Backend API: Node.js con Express, para desarrollar una API REST con un entorno JavaScript.
Frontend: React, para construir una interfaz modular y dinámica.
Alojamiento cloud: Render para desplegar el backend y evaluar el alojamiento de la base de datos, y Vercel como alternativa para el frontend.

Las tecnologías son una selección inicial y podrán ajustarse durante el desarrollo.

5. Selección tentativa de Add-ons
Dockerización multicontenedor con Docker Compose (+1.0)
Pipeline CI/CD automatizado con GitHub Actions (+1.0)
Almacenamiento desacoplado en AWS S3 / Cloudinary (+0.5)
Pasarela de pagos Stripe en entorno Sandbox con Webhooks (+1.0)
Generación de informes en PDF/Excel en backend (+0.5)
WebSockets / Comunicación en tiempo real (+1.0)
Batería de pruebas automatizadas (>40 % de endpoints) (+1.0)
Documentación OpenAPI / Swagger interactiva (+0.5)
