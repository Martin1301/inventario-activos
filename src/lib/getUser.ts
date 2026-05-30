import { cookies } from "next/headers";
import { prisma } from "./prisma";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function getUser() {

  try {

    const cookieStore = await cookies();

    const token =
      cookieStore.get("token")?.value;

    if (!token) {

      console.log("SIN TOKEN");

      return null;
    }

    const decoded: any =
      jwt.verify(token, SECRET);

    console.log("TOKEN:", decoded);

    const user = await prisma.user.findUnique({

      where: {
        id: decoded.id,
      },
    });

    console.log("USER:", user);

    return user;

  } catch (error) {

    console.log(error);

    return null;
  }
}