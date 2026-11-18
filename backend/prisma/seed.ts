
import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma";

async function main() {
  console.log("Iniciando seed de TCG Price Tracker...");

  // 1. Roles
  const adminRol = await prisma.rol.upsert({
    where: { nombre: "admin" },
    update: {},
    create: {
      nombre: "admin",
      descripcion: "Administrador del sistema",
    },
  });

  const userRol = await prisma.rol.upsert({
    where: { nombre: "user" },
    update: {},
    create: {
      nombre: "user",
      descripcion: "Usuario estándar",
    },
  });

  // 2. Usuarios con contraseñas cifradas
  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  const userPassword = await bcrypt.hash("User1234!", 12);

  const usuarios = [];

  for (let i = 0; i < 10; i++) {
    const esAdmin = i === 0;
    const email = esAdmin
      ? "admin@cifpaviles.es"
      : `user${i}@cifpaviles.es`;

    const usuario = await prisma.usuario.upsert({
      where: { email },
      update: {
        nombre: esAdmin ? "Administrador" : `Usuario ${i}`,
        id_rol: esAdmin ? adminRol.id_rol : userRol.id_rol,
        password_hash: esAdmin ? adminPassword : userPassword,
        activo: true,
      },
      create: {
        nombre: esAdmin ? "Administrador" : `Usuario ${i}`,
        email,
        password_hash: esAdmin ? adminPassword : userPassword,
        id_rol: esAdmin ? adminRol.id_rol : userRol.id_rol,
      },
    });

    usuarios.push(usuario);
  }

  // 3. Juegos de cartas
  const nombresJuegos = [
    "Magic: The Gathering",
    "Pokémon TCG",
    "Yu-Gi-Oh!",
    "One Piece Card Game",
    "Disney Lorcana",
    "Flesh and Blood",
    "Digimon Card Game",
    "Star Wars Unlimited",
    "Altered TCG",
    "Riftbound",
  ];

  const juegos = [];

  for (const nombre of nombresJuegos) {
    const juego = await prisma.juego.upsert({
      where: { nombre },
      update: {},
      create: {
        nombre,
        descripcion: `Juego de cartas coleccionables: ${nombre}`,
      },
    });

    juegos.push(juego);
  }

  // 4. Ediciones de demostración
  const ediciones = [];

  for (let i = 0; i < juegos.length; i++) {
    const edicion = await prisma.edicion.upsert({
      where: {
        id_juego_codigo: {
          id_juego: juegos[i].id_juego,
          codigo: `DEMO-${i + 1}`,
        },
      },
      update: {},
      create: {
        id_juego: juegos[i].id_juego,
        codigo: `DEMO-${i + 1}`,
        nombre: `Edición de prueba ${i + 1}`,
      },
    });

    ediciones.push(edicion);
  }

  // 5. Cartas: dos por edición
  const cartas = [];

  for (let i = 0; i < ediciones.length; i++) {
    for (let j = 1; j <= 2; j++) {
      const nombre = `Carta Demo ${i + 1}-${j}`;
      const numero = String(j).padStart(3, "0");

      let carta = await prisma.carta.findFirst({
        where: {
          id_edicion: ediciones[i].id_edicion,
          numero_coleccionista: numero,
          nombre,
        },
      });

      if (!carta) {
        carta = await prisma.carta.create({
          data: {
            id_edicion: ediciones[i].id_edicion,
            nombre,
            numero_coleccionista: numero,
            rareza: j === 1 ? "Común" : "Rara",
            acabado: "Normal",
          },
        });
      }

      cartas.push(carta);
    }
  }

  // 6. Fuente de precios del MVP
  const fuente = await prisma.fuentePrecio.upsert({
    where: { nombre: "Cardmarket" },
    update: {
      url_base: "https://www.cardmarket.com",
      activa: true,
    },
    create: {
      nombre: "Cardmarket",
      url_base: "https://www.cardmarket.com",
      activa: true,
    },
  });

  // 7. Precios históricos ficticios
  for (let i = 0; i < cartas.length; i++) {
    const precio = ((i + 1) * 1.25).toFixed(2);
    const fecha = new Date("2026-10-01T12:00:00Z");

    const existente = await prisma.precioHistorico.findFirst({
      where: {
        id_carta: cartas[i].id_carta,
        id_fuente: fuente.id_fuente,
        fecha_registro: fecha,
      },
    });

    if (!existente) {
      await prisma.precioHistorico.create({
        data: {
          id_carta: cartas[i].id_carta,
          id_fuente: fuente.id_fuente,
          precio,
          moneda: "EUR",
          fecha_registro: fecha,
          url_referencia: "https://www.cardmarket.com",
        },
      });
    }
  }

  // 8. Seguimientos: relación M:N con atributos
  for (let i = 0; i < 10; i++) {
    await prisma.seguimiento.upsert({
      where: {
        id_usuario_id_carta: {
          id_usuario: usuarios[i].id_usuario,
          id_carta: cartas[i].id_carta,
        },
      },
      update: {},
      create: {
        id_usuario: usuarios[i].id_usuario,
        id_carta: cartas[i].id_carta,
        notificaciones_activas: true,
      },
    });
  }

  // 9. Alertas de precios
  for (let i = 0; i < 10; i++) {
    const existente = await prisma.alerta.findFirst({
      where: {
        id_usuario: usuarios[i].id_usuario,
        id_carta: cartas[i].id_carta,
        tipo_condicion: "MENOR_IGUAL",
      },
    });

    if (!existente) {
      await prisma.alerta.create({
        data: {
          id_usuario: usuarios[i].id_usuario,
          id_carta: cartas[i].id_carta,
          precio_objetivo: ((i + 1) * 1.1).toFixed(2),
          tipo_condicion: "MENOR_IGUAL",
          activa: true,
        },
      });
    }
  }

  console.log("Seed completado correctamente.");

  const resumen = {
    roles: await prisma.rol.count(),
    usuarios: await prisma.usuario.count(),
    juegos: await prisma.juego.count(),
    ediciones: await prisma.edicion.count(),
    cartas: await prisma.carta.count(),
    fuentes: await prisma.fuentePrecio.count(),
    precios: await prisma.precioHistorico.count(),
    seguimientos: await prisma.seguimiento.count(),
    alertas: await prisma.alerta.count(),
  };

  console.table(resumen);
}

main()
  .catch((error) => {
    console.error("Error ejecutando el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
