import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const { id } = await context.params;

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    /**
     * =========================
     * USUARIO CENTRAL
     * =========================
     */
    if (decoded.role === "CENTRAL") {

      const activos = await prisma.asset.findMany({
        where: {
          estado: "STOCK",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(activos);
    }

    /**
     * =========================
     * USUARIO LOCAL
     * =========================
     */
    const activos = await prisma.asset.findMany({
      where: {
        estado: "LOCAL",
        localId: decoded.localId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(activos);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Error obteniendo activos" },
      { status: 500 }
    );
  }
}