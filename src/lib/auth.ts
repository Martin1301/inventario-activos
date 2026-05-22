import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

// Para API routes / backend
export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

// Para middleware (Edge Runtime)
export async function verifyToken(token: string) {

  const secret = new TextEncoder().encode(
    JWT_SECRET
  );

  const { payload } = await jwtVerify(
    token,
    secret
  );

  return payload;
}