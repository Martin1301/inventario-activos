import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const activos = await prisma.asset.findMany({
      where: {
        estado: {
          not: "TRANSITO",
        },
      },

      include: {
        local: true,
        area: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(activos);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Error obteniendo activos",
      },
      {
        status: 500,
      }
    );
  }
}