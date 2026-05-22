import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {

  const pathname = req.nextUrl.pathname;

  // Rutas públicas
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // No token
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  try {

    await verifyToken(token);

    return NextResponse.next();

  } catch (error) {

    console.error("TOKEN ERROR:", error);

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"],
};