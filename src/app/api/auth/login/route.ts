import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {

    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no existe" },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Password incorrecto" },
        { status: 400 }
      );
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      localId: user.localId,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        localId: user.localId,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return response;

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}