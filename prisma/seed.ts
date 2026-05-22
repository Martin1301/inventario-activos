import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

  /**
   * PASSWORD
   */
  const password = await bcrypt.hash("123456", 10);

  /**
   * USUARIO CENTRAL
   */
  await prisma.user.create({
    data: {
      nombre: "Admin Central",
      email: "admin@central.com",
      password,
      role: "CENTRAL",
    },
  });

  /**
   * LOCAL DEMO
   */
  const local = await prisma.local.create({
    data: {
      nombre: "Local Demo",
      direccion: "Av. Central 123",
      red: "RED-01",
    },
  });

  /**
   * USUARIO LOCAL
   */
  await prisma.user.create({
    data: {
      nombre: "Usuario Local",
      email: "local@demo.com",
      password,
      role: "LOCAL",
      localId: local.id,
    },
  });

  /**
   * ACTIVOS DE PRUEBA
   */
  await prisma.asset.createMany({
    data: [

      /**
       * CPU
       */
      {
        codigo: "CPU-001",
        serie: "SNCPU001",
        dispositivo: "CPU Core i5",
        marca: "HP",
        modelo: "EliteDesk 800",
        categoria: "CPU",
        estado: "STOCK",
      },

      /**
       * MONITOR
       */
      {
        codigo: "MON-001",
        serie: "SNMON001",
        dispositivo: "Monitor 24 pulgadas",
        marca: "Samsung",
        modelo: "LF24T350",
        categoria: "MONITOR",
        estado: "STOCK",
      },

      /**
       * IMPRESORA
       */
      {
        codigo: "IMP-001",
        serie: "SNIMP001",
        dispositivo: "Impresora Láser",
        marca: "Brother",
        modelo: "HL-L2350DW",
        categoria: "IMPRESORA",
        estado: "STOCK",
      },

      /**
       * SWITCH / ROUTER
       */
      {
        codigo: "SWR-001",
        serie: "SNSWR001",
        dispositivo: "Router Mikrotik",
        marca: "Mikrotik",
        modelo: "RB750Gr3",
        categoria: "SWITCH_ROUTER",
        estado: "STOCK",
      },

      /**
       * LECTORA
       */
      {
        codigo: "LEC-001",
        serie: "SNLEC001",
        dispositivo: "Lectora Código Barras",
        marca: "Honeywell",
        modelo: "Voyager 1250g",
        categoria: "LECTORA",
        estado: "STOCK",
      },

      /**
       * CELULAR
       */
      {
        codigo: "CEL-001",
        serie: "SNCEL001",
        dispositivo: "Celular Samsung",
        marca: "Samsung",
        modelo: "Galaxy A15",
        categoria: "CELULAR",
        estado: "STOCK",
      },

      /**
       * TABLET
       */
      {
        codigo: "TAB-001",
        serie: "SNTAB001",
        dispositivo: "Tablet Lenovo",
        marca: "Lenovo",
        modelo: "Tab M10",
        categoria: "TABLET",
        estado: "STOCK",
      },

      /**
       * TECLADO
       */
      {
        codigo: "TEC-001",
        serie: "SNTEC001",
        dispositivo: "Teclado USB",
        marca: "Logitech",
        modelo: "K120",
        categoria: "TECLADO",
        estado: "STOCK",
      },

      /**
       * MOUSE
       */
      {
        codigo: "MOU-001",
        serie: "SNMOU001",
        dispositivo: "Mouse Óptico",
        marca: "Logitech",
        modelo: "M90",
        categoria: "MOUSE",
        estado: "STOCK",
      },

      /**
       * GAVETA
       */
      {
        codigo: "GAV-001",
        serie: "SNGAV001",
        dispositivo: "Gaveta de Dinero",
        marca: "Epson",
        modelo: "CD-100",
        categoria: "GAVETA",
        estado: "STOCK",
      },

      /**
       * CAMARAS
       */
      {
        codigo: "CAM-001",
        serie: "SNCAM001",
        dispositivo: "Cámara IP",
        marca: "Hikvision",
        modelo: "DS-2CD1023G0",
        categoria: "CAMARAS",
        estado: "STOCK",
      },

      /**
       * OTROS
       */
      {
        codigo: "OTR-001",
        serie: "SNOTR001",
        dispositivo: "UPS APC",
        marca: "APC",
        modelo: "BVX1200LI",
        categoria: "OTROS",
        estado: "STOCK",
      },

    ],
  });

  console.log("✅ Seed completado");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });