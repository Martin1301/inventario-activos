import { verifyToken } from "./auth";

export function getUserFromToken(token: string) {
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}