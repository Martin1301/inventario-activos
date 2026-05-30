-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CENTRAL', 'LOCAL');

-- CreateEnum
CREATE TYPE "AssetState" AS ENUM ('STOCK', 'EN_USO', 'MALOGRADO', 'TRANSITO', 'BAJA');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('CPU', 'MONITOR', 'IMPRESORA', 'SWITCH_ROUTER', 'LECTORA', 'CELULAR', 'TABLET', 'TECLADO', 'MOUSE', 'GAVETA', 'CAMARAS', 'OTROS');

-- CreateEnum
CREATE TYPE "GuideState" AS ENUM ('GENERADA', 'BORRADOR', 'TRANSITO', 'RECIBIDA', 'PARCIAL');

-- CreateEnum
CREATE TYPE "GuideDetailState" AS ENUM ('ENVIADO', 'RECIBIDO', 'FALTANTE');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('CENTRAL', 'LOCAL', 'OTROS');

-- CreateEnum
CREATE TYPE "DestinationType" AS ENUM ('CENTRAL', 'LOCAL', 'OTROS');

-- CreateEnum
CREATE TYPE "ResponsableType" AS ENUM ('SOPORTE', 'TRANSPORTE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "localId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Local" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "red" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "numeroFactura" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL,
    "detalles" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "dispositivo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "categoria" "AssetCategory" NOT NULL,
    "observaciones" TEXT,
    "ip" TEXT,
    "estado" "AssetState" NOT NULL,
    "areaId" INTEGER,
    "localId" INTEGER,
    "otherLocation" TEXT,
    "invoiceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "estado" "GuideState" NOT NULL,
    "observaciones" TEXT,
    "origenTipo" "LocationType" NOT NULL,
    "origenLocalId" INTEGER,
    "destinoTipo" "DestinationType" NOT NULL,
    "destinoLocalId" INTEGER,
    "otroDestino" TEXT,
    "encargadoTipo" "ResponsableType" NOT NULL,
    "enviadoPorId" INTEGER,
    "recibidoPorId" INTEGER,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaRecepcion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideDetail" (
    "id" SERIAL NOT NULL,
    "guideId" INTEGER NOT NULL,
    "assetId" INTEGER NOT NULL,
    "estado" "GuideDetailState" NOT NULL DEFAULT 'ENVIADO',
    "recibido" BOOLEAN NOT NULL DEFAULT false,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movement" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "observacion" TEXT,
    "guideId" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_codigo_key" ON "Asset"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_numero_key" ON "Guide"("numero");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_origenLocalId_fkey" FOREIGN KEY ("origenLocalId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_destinoLocalId_fkey" FOREIGN KEY ("destinoLocalId") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_enviadoPorId_fkey" FOREIGN KEY ("enviadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_recibidoPorId_fkey" FOREIGN KEY ("recibidoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideDetail" ADD CONSTRAINT "GuideDetail_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideDetail" ADD CONSTRAINT "GuideDetail_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
