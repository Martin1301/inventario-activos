import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("=== INICIANDO SEEDING SIMÉTRICO ===");

  // 0. LIMPIEZA PREVIA (Opcional, previene errores de duplicación en desarrollo)
  await prisma.movement.deleteMany({});
  await prisma.guideDetail.deleteMany({});
  await prisma.guide.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.area.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.local.deleteMany({});

  /**
   * PASSWORD ENCRIPTADA (Compartida para pruebas)
   */
  const password = await bcrypt.hash("123456", 10);

  // =======================================================
  // 1. PRIMER LOCAL (OBLIGATORIAMENTE SEDE CENTRAL -> ID 1)
  // =======================================================
  console.log("Creando Sede Central...");
  const centralLocal = await prisma.local.create({
    data: {
      nombre: "Sede Central / Almacén Principal",
      direccion: "Av. Central 123",
      red: "RED-01",
    },
  });

  // =======================================================
  // 2. CREACIÓN DE 7 LOCALES COMERCIALES / BOTICAS DE VERDAD
  // =======================================================
  console.log("Creando 7 sucursales logísticas...");
  const nombresLocales = [
    "Local San Juan",
    "Local Miraflores",
    "Local Los Olivos",
    "Local La Molina",
    "Local Magdalena",
    "Local Surco",
    "Local Chorrillos",
  ];

  const localesSucursales = [];
  for (let i = 0; i < nombresLocales.length; i++) {
    const local = await prisma.local.create({
      data: {
        nombre: nombresLocales[i],
        direccion: `Av. Périferica Sucursal N° ${i + 1}`,
        red: `RED-0${i + 2}`,
      },
    });
    localesSucursales.push(local);
  }

  console.log(`✅ Infraestructura lista. ID Sede Central: ${centralLocal.id}`);

  // =======================================================
  // 3. CREACIÓN DE 7 USUARIOS ADMINISTRADORES (ROL: CENTRAL)
  // =======================================================
  console.log("Generando 7 usuarios con rol CENTRAL...");
  for (let i = 1; i <= 7; i++) {
    await prisma.user.create({
      data: {
        nombre: `Admin Central ${i}`,
        email: i === 1 ? "admin@central.com" : `admin${i}@central.com`, // Mantiene tu email base para el primero
        password,
        role: "CENTRAL",            // Mantiene todos los privilegios del sistema
        localId: centralLocal.id,   // Conectado permanentemente al ID 1 (Sede Central)
      },
    });
  }

  // =======================================================
  // 4. CREACIÓN DE 7 USUARIOS OPERATIVOS (ROL: LOCAL)
  // =======================================================
  console.log("Generando 7 usuarios con rol LOCAL...");
  // Recorremos las 7 tiendas físicas reales creadas en el paso 2
  for (let i = 0; i < localesSucursales.length; i++) {
    await prisma.user.create({
      data: {
        nombre: `Encargado ${localesSucursales[i].nombre}`,
        email: i === 0 ? "sanjuan@demo.com" : `local${i + 1}@demo.com`, // Mantiene tu email de San Juan para el primero
        password,
        role: "LOCAL",              // Permisos restringidos a su respectiva tienda
        localId: localesSucursales[i].id, // Enlazado a su botica de forma exclusiva
      },
    });
  }

  // =======================================================
  // 5. ACTIVOS DE PRUEBA INITIAL STOCK (UBICADOS EN CENTRAL)
  // =======================================================
  console.log("Inyectando stock de activos iniciales en Central...");
  await prisma.asset.createMany({
    data: [
      {
        codigo: "CPU-001",
        serie: "SNCPU001",
        dispositivo: "CPU Core i5",
        marca: "HP",
        modelo: "EliteDesk 800",
        categoria: "CPU",
        estado: "STOCK",
        localId: centralLocal.id, // Ahora apunta físicamente a la Sede Central (ID 1)
      },
      {
        codigo: "MON-001",
        serie: "SNMON001",
        dispositivo: "Monitor 24 pulgadas",
        marca: "Samsung",
        modelo: "LF24T350",
        categoria: "MONITOR",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "IMP-001",
        serie: "SNIMP001",
        dispositivo: "Impresora Láser",
        marca: "Brother",
        modelo: "HL-L2350DW",
        categoria: "IMPRESORA",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "SWR-001",
        serie: "SNSWR001",
        dispositivo: "Router Mikrotik",
        marca: "Mikrotik",
        modelo: "RB750Gr3",
        categoria: "SWITCH_ROUTER",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "LEC-001",
        serie: "SNLEC001",
        dispositivo: "Lectora Código Barras",
        marca: "Honeywell",
        modelo: "Voyager 1250g",
        categoria: "LECTORA",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "CEL-001",
        serie: "SNCEL001",
        dispositivo: "Celular Samsung",
        marca: "Samsung",
        modelo: "Galaxy A15",
        categoria: "CELULAR",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "TAB-001",
        serie: "SNTAB001",
        dispositivo: "Tablet Lenovo",
        marca: "Lenovo",
        modelo: "Tab M10",
        categoria: "TABLET",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "TEC-001",
        serie: "SNTEC001",
        dispositivo: "Teclado USB",
        marca: "Logitech",
        modelo: "K120",
        categoria: "TECLADO",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "MOU-001",
        serie: "SNMOU001",
        dispositivo: "Mouse Óptico",
        marca: "Logitech",
        modelo: "M90",
        categoria: "MOUSE",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "GAV-001",
        serie: "SNGAV001",
        dispositivo: "Gaveta de Dinero",
        marca: "Epson",
        modelo: "CD-100",
        categoria: "GAVETA",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "CAM-001",
        serie: "SNCAM001",
        dispositivo: "Cámara IP",
        marca: "Hikvision",
        modelo: "DS-2CD1023G0",
        categoria: "CAMARAS",
        estado: "STOCK",
        localId: centralLocal.id,
      },
      {
        codigo: "OTR-001",
        serie: "SNOTR001",
        dispositivo: "UPS APC",
        marca: "APC",
        modelo: "BVX1200LI",
        categoria: "OTROS",
        estado: "STOCK",
        localId: centralLocal.id,
      },
    ],
  });

  console.log("============== SEED COMPLETADO EN MODO SIMÉTRICO ==============");
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