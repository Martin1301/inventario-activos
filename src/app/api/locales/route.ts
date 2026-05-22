import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const locales = await prisma.local.findMany({
      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json(locales);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Error obteniendo locales" },
      { status: 500 }
    );
  }
}