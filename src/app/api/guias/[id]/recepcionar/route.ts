import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  req: NextRequest,
  context: RouteParams
) {
  try {
    // 1. Desunimos la promesa de params usando await
    const { id: idParam } = await context.params;
    const id = Number(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de guía inválido" },
        { status: 400 }
      );
    }

    // 2. Extraemos el cuerpo de la petición
    const body = await req.json();
    const { details } = body;

    // 3. Buscar la guía actual para conocer su destinoLocalId original antes de actualizarla
    const guiaActual = await prisma.guide.findUnique({
      where: { id: id },
      include: { details: true }
    });

    if (!guiaActual) {
      return NextResponse.json(
        { error: "La guía especificada no existe" },
        { status: 404 }
      );
    }

    if (guiaActual.estado !== "TRANSITO") {
      
      return NextResponse.json(
        { error: "Esta guía ya fue procesada anteriormente" },
        { status: 400 }
      );
    }

    // Lógica para verificar si llegaron todos los activos o hay faltantes
    const faltantes = details?.some((d: any) => !d.recibido);
    const nuevoEstado = faltantes ? "PARCIAL" : "RECIBIDA";

    // Extraemos los IDs de todos los activos que viajan en esta guía
    const idsActivosFiltrados = guiaActual.details.map((d: { assetId: any; }) => d.assetId);

    /**
     * EJECUCIÓN EN TRANSACCIÓN SEGURA:
     * Si la guía se actualiza, los activos cambian de ubicación obligatoriamente.
     * Si uno falla, ninguno se guarda para evitar inconsistencias.
     */
    await prisma.$transaction([
      // PASO A: Actualizar el estado de la guía de envío
      prisma.guide.update({
        where: { id: id },
        data: {
          estado: nuevoEstado,
          fechaRecepcion: new Date(),
        },
      }),

      // PASO B: Mover físicamente los activos al local de destino
      prisma.asset.updateMany({
        where: {
          id: {
            in: idsActivosFiltrados,
          },
        },
        data: {
          // Cambia el localId (de null/Central al ID de la botica de destino)
          localId: guiaActual.destinoLocalId, 
          // Se mantiene en STOCK pero ahora pertenece a la sucursal que recibe
          estado: "STOCK", 
        },
      }),
    ]);

    console.log(`✅ ÉXITO: Guía #${guiaActual.numero} marcada como ${nuevoEstado}.`);
    console.log(`📦 Se reubicaron ${idsActivosFiltrados.length} activos al local ID: ${guiaActual.destinoLocalId}`);

    return NextResponse.json({ 
      success: true, 
      message: "Guía procesada y activos reubicados en su nuevo destino correctamente" 
    });

  } catch (error) {
    console.error("Error en POST /api/guias/[id]/recepcionar:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}