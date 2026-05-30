import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";

export async function GET() {

  try {

    const user = await getUser();

    if (!user) {

      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({

      id: user.id,

      nombre: user.nombre,

      role: user.role,

      localId: user.localId,
    });

  } catch (error) {

    return NextResponse.json(
      {
        error: "Error obteniendo usuario",
      },
      {
        status: 500,
      }
    );
  }
}