import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categorias = [
      "CPU",
      "MONITOR",
      "IMPRESORA",
      "SWITCH_ROUTER",
      "LECTORA",
      "CELULAR",
      "TABLET",
      "TECLADO",
      "MOUSE",
      "GAVETA",
      "CAMARAS",
      "OTROS",
    ];

    // 🔥 UNA SOLA CONSULTA (MUCHO MÁS RÁPIDO)
    const assets = await prisma.asset.findMany({
      select: {
        categoria: true,
        estado: true,
      },
    });

    // 🔥 AGRUPAR EN MEMORIA (evita 20 queries)
    const resumenMap = new Map<
      string,
      { central: number; locales: number }
    >();

    // inicializar categorías
    categorias.forEach((cat) => {
      resumenMap.set(cat, { central: 0, locales: 0 });
    });

    // contar datos
    for (const asset of assets) {
      const cat = asset.categoria;
      if (!resumenMap.has(cat)) continue;

      const actual = resumenMap.get(cat)!;

      if (asset.estado === "CENTRAL") actual.central++;
      if (asset.estado === "LOCAL") actual.locales++;
    }

    const data = categorias.map((categoria) => {
      const info = resumenMap.get(categoria)!;

      return {
        categoria,
        central: info.central,
        locales: info.locales,
        total: info.central + info.locales,
      };
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error("ERROR RESUMEN:", error);

    return NextResponse.json(
      { error: "Error obteniendo resumen" },
      { status: 500 }
    );
  }
}