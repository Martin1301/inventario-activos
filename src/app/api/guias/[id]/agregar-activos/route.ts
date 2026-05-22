import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const body = await req.json();

    const { activos } = body;

    const { id } = await context.params;

    for (const assetId of activos) {

      await prisma.guideDetail.create({
        data: {
          guideId: Number(id),
          assetId,
        },
      });

      await prisma.asset.update({
        where: {
          id: assetId,
        },
        data: {
          estado: "TRANSITO",
          areaId: null,
          localId: null,
          otherLocation: null,
        },
      });

    }

    await prisma.guide.update({
      where: {
        id: Number(id),
      },
      data: {
        estado: "TRANSITO",
        fechaEnvio: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Error agregando activos" },
      { status: 500 }
    );
  }
}