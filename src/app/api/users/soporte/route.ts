import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const users = await prisma.user.findMany({
      where: {
        role: "CENTRAL",
      },
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json(users);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Error obteniendo usuarios" },
      { status: 500 }
    );
  }
}