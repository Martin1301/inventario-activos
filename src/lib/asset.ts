export function setEstadoMovimiento(destino: string) {
  if (destino === "LOCAL") return "TRANSITO";
  if (destino === "CENTRAL") return "CENTRAL";

  return "TRANSITO";
}