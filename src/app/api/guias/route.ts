import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      numero,
      encargadoTipo,
      encargadoId,
      destinoTipo,
      destinoLocalId,
      otroDestino,
      observaciones,
    } = body;

    /**
     * VALIDAR NUMERO
     */
    if (!numero) {
      return NextResponse.json(
        {
          error: "Número de guía requerido",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * VALIDAR DUPLICADO
     */
    const existe = await prisma.guide.findUnique({
      where: {
        numero,
      },
    });

    if (existe) {
      return NextResponse.json(
        {
          error: "El número de guía ya existe",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * CREAR GUIA
     */
    const guia = await prisma.guide.create({
      data: {
        numero,

        estado: "GENERADA",

        observaciones,

        /**
         * ORIGEN
         */
        origenTipo: "CENTRAL",

        /**
         * DESTINO
         */
        destinoTipo,

        destinoLocalId:
          destinoTipo === "LOCAL"
            ? Number(destinoLocalId)
            : null,

        otroDestino:
          destinoTipo === "OTROS"
            ? otroDestino
            : null,

        /**
         * RESPONSABLE
         */
        encargadoTipo,

        enviadoPorId:
          encargadoTipo === "SOPORTE"
            ? Number(encargadoId)
            : null,

        /**
         * FECHA
         */
        fechaEnvio: new Date(),
      },
    });

    return NextResponse.json(guia);

  } catch (error) {

    console.error("ERROR CREANDO GUIA:");
    console.error(error);

    return NextResponse.json(
      {
        error: "Error creando guía",
      },
      {
        status: 500,
      }
    );
  }
}