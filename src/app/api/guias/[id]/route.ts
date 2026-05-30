import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * =======================================================
 * GET: Obtener una guía específica con sus detalles
 * =======================================================
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id: idParam } = await context.params;
    const id = Number(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "El ID proporcionado no es válido" },
        { status: 400 }
      );
    }

    const guia = await prisma.guide.findUnique({
      where: { id },
      include: {
        details: {
          include: {
            asset: true,
          },
        },
        origenLocal: true,
        destinoLocal: true,
      },
    });

    if (!guia) {
      return NextResponse.json(
        { error: "Guía no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(guia);
  } catch (error) {
    console.error("Error en GET /api/guias/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * =======================================================
 * POST: Agregar múltiples activos a la guía (Guardar Guía)
 * Ruta correspondiente a: /api/guias/[id]
 * =======================================================
 */

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id: idParam } = await context.params;
    const guiaId = Number(idParam);

    // 1. Validar Autenticación
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (isNaN(guiaId)) {
      return NextResponse.json({ error: "ID de guía inválido" }, { status: 400 });
    }

    // 2. Extraer los activos seleccionados en el frontend
    const body = await request.json();
    const { activos } = body; 

    if (!activos || !Array.isArray(activos) || activos.length === 0) {
      return NextResponse.json(
        { error: "Se requiere seleccionar al menos un activo" },
        { status: 400 }
      );
    }

    // 3. Verificar que la guía exista y siga en BORRADOR
    const guiaExistente = await prisma.guide.findUnique({
      where: { id: guiaId }
    });

    if (!guiaExistente) {
      return NextResponse.json({ error: "La guía especificada no existe" }, { status: 404 });
    }

    if (guiaExistente.estado !== "BORRADOR") {
      return NextResponse.json(
        { error: "Esta guía ya fue procesada y no se puede modificar" },
        { status: 400 }
      );
    }

    // 4. Limpiar detalles previos si estaba re-seleccionando activos
    await prisma.guideDetail.deleteMany({
      where: { guideId: guiaId }
    });

    // 5. Preparar la estructura de inserción masiva
    const datosDetalles = activos.map((assetId: number) => ({
      guideId: guiaId,
      assetId: Number(assetId),
      recibido: false, 
    }));

    // 6. Inserción de los activos en la tabla de detalles
    await prisma.guideDetail.createMany({
      data: datosDetalles,
    });

    /**
     * CORRECCIÓN CLAVE: 
     * Como el usuario ya presionó "Guardar Guía" con sus activos correspondientes,
     * actualizamos oficialmente el estado de BORRADOR a TRANSITO.
     */
    await prisma.guide.update({
      where: { id: guiaId },
      data: { estado: "TRANSITO" as any } // Usamos 'as any' para mitigar restricciones estrictas si es necesario
    });

    return NextResponse.json({
      success: true,
      message: `${activos.length} activos vinculados y guía puesta en TRÁNSITO con éxito.`,
    });

  } catch (error) {
    console.error("Error en POST /api/guias/[id]:", error);
    return NextResponse.json(
      { error: "Error al guardar los activos en la guía" },
      { status: 500 }
    );
  }
}