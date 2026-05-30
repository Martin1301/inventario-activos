import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      email,
      password,
    } = body;

    const user = await prisma.user.findUnique({

      where: {
        email,
      },
    });

    if (!user) {

      return NextResponse.json(
        {
          error: "Usuario no encontrado",
        },
        {
          status: 401,
        }
      );
    }

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {

      return NextResponse.json(
        {
          error: "Password incorrecto",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * TOKEN
     */
    const token = signToken({

      id: user.id,

      role: user.role,

      localId: user.localId,
    });

    /**
     * RESPONSE
     */
    const response = NextResponse.json({

      ok: true,

      user: {
        id: user.id,
        nombre: user.nombre,
        role: user.role,
      },
    });

    /**
     * COOKIE
     */
    response.cookies.set({

      name: "token",

      value: token,

      httpOnly: true,

      secure: false,

      sameSite: "lax",

      path: "/",
    });

    return response;

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Error login",
      },
      {
        status: 500,
      }
    );
  }
}