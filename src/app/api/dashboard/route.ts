import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const [
      totalLocales,
      totalGuias,
      totalUsuariosCentral,
      totalActivos,
      guiasPorCentral,
      estadosGuias,
      ultimasGuias,
    ] = await Promise.all([

      /**
       * LOCALES
       */
      prisma.local.count(),

      /**
       * GUIAS
       */
      prisma.guide.count(),

      /**
       * USUARIOS CENTRAL
       */
      prisma.user.count({
        where: {
          role: "CENTRAL",
        },
      }),

      /**
       * ACTIVOS
       */
      prisma.asset.count(),

      /**
       * GUIAS POR USUARIO CENTRAL
       */
      prisma.user.findMany({

        where: {
          role: "CENTRAL",
        },

        select: {

          id: true,

          nombre: true,

          _count: {

            select: {
              guidesEnviadas: true,
            },
          },
        },

        orderBy: {
          nombre: "asc",
        },
      }),

      /**
       * ESTADOS DE GUIAS
       */
      prisma.guide.groupBy({

        by: ["estado"],

        _count: {
          estado: true,
        },
      }),

      /**
       * ULTIMAS GUIAS
       */
      prisma.guide.findMany({

        take: 10,

        orderBy: {
          id: "desc",
        },

        include: {

          origenLocal: true,

          destinoLocal: true,

          enviadoPor: {
            select: {
              nombre: true,
            },
          },
        },
      }),
    ]);

    /**
     * ORDENAR USUARIOS
     * POR CANTIDAD DE GUIAS
     */
    const guiasPorCentralOrdenado =
      [...guiasPorCentral].sort(
        (a, b) =>
          b._count.guidesEnviadas -
          a._count.guidesEnviadas
      );

    return NextResponse.json({

      totalLocales,

      totalGuias,

      totalUsuariosCentral,

      totalActivos,

      guiasPorCentral:
        guiasPorCentralOrdenado,

      estadosGuias,

      ultimasGuias,
    });

  } catch (error) {

    console.error(
      "ERROR DASHBOARD:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error obteniendo dashboard",
      },
      {
        status: 500,
      }
    );
  }
}