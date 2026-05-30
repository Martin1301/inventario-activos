import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteParams) {
  try {
    const { id: idParam } = await context.params;
    const guiaId = Number(idParam);

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { codigoAsset } = body; // Buscaremos el activo por su código único

    if (!codigoAsset) {
      return NextResponse.json({ error: "Código de activo requerido" }, { status: 400 });
    }

    // 1. Verificar que la guía exista y esté en BORRADOR
    const guia = await prisma.guide.findUnique({
      where: { id: guiaId },
    });

    if (!guia) {
      return NextResponse.json({ error: "Guía no encontrada" }, { status: 404 });
    }

    if (guia.estado !== "BORRADOR") {
      return NextResponse.json({ error: "No se pueden agregar activos a una guía que ya fue enviada o cerrada" }, { status: 400 });
    }

    // 2. Buscar el activo por su código
    const asset = await prisma.asset.findUnique({
      where: { codigo: codigoAsset }, // Asegúrate de que 'codigo' sea @unique en tu schema
    });

    if (!asset) {
      return NextResponse.json({ error: "El activo con ese código no existe en el sistema" }, { status: 404 });
    }

    // 3. Verificar si el activo ya está agregado en esta guía para no duplicarlo
    // Reemplaza 'guideDetail' por el nombre exacto de tu modelo de detalles en tu schema.prisma
    const yaAgregado = await prisma.guideDetail.findFirst({
      where: {
        guideId: guiaId,
        assetId: asset.id,
      },
    });

    if (yaAgregado) {
      return NextResponse.json({ error: "Este activo ya está en la guía" }, { status: 400 });
    }

    // 4. Agregar el activo a los detalles de la guía
    const nuevoDetalle = await prisma.guideDetail.create({
      data: {
        guide: { connect: { id: guiaId } },
        asset: { connect: { id: asset.id } },
        recibido: false, // Inicializa en falso ya que apenas se va a enviar
      },
    });

    return NextResponse.json({ success: true, nuevoDetalle });

  } catch (error) {
    console.error("Error agregando activo:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}