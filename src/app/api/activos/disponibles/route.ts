import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("=== DIAGNÓSTICO DE ACTIVOS DISPONIBLES ===");
    console.log("Usuario autenticado:", { id: user.id, role: user.role, localId: user.localId });

    if (!user.localId) {
      console.log("❌ ERROR: El usuario no tiene un localId asignado en su sesión");
      return NextResponse.json({ error: "Usuario sin local asignado" }, { status: 400 });
    }

    const parsedLocalId = parseInt(user.localId.toString(), 10);
    if (isNaN(parsedLocalId)) {
      return NextResponse.json({ error: "ID de local inválido" }, { status: 400 });
    }

    let conditions: any = {};

    // ========================================================
    // FILTRADO SIMÉTRICO SEGÚN EL ROL
    // ========================================================
    if (user.role === "LOCAL") {
      // Un local ve sus activos disponibles en STOCK y los MALOGRADOS (para poder enviarlos a reparación)
      conditions = {
        localId: parsedLocalId,
        estado: {
          in: ["STOCK", "MALOGRADO"]
        }
      };
    } else {
      /**
       * SOLUCIÓN PARA CENTRAL / ADMIN (ID: 1):
       * Al ser simétrico, el admin ahora tiene localId: 1.
       * Buscamos los activos en STOCK que están físicamente en la Sede Central (ID 1)
       * e incluimos 'null' mediante un OR por si quedó algún activo antiguo sin migrar en tu BD.
       */
      conditions = {
        estado: "STOCK",
        OR: [
          { localId: parsedLocalId },
          { localId: null } 
        ]
      };
    }

    console.log("Filtro seguro enviado a Prisma:", JSON.stringify(conditions, null, 2));

    const activosDisponibles = await prisma.asset.findMany({
      where: conditions,
      orderBy: { id: "desc" },
    });

    console.log(`Cantidad de activos encontrados por Prisma: ${activosDisponibles.length}`);
    console.log("=======================================");

    return NextResponse.json(activosDisponibles);
  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN BACKEND:", error);
    return NextResponse.json(
      { error: "Error interno al procesar los activos en el servidor" },
      { status: 500 }
    );
  }
}