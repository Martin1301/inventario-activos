export function requiereGuia(origen: string, destino: string) {
  if (origen === "CENTRAL" && destino === "LOCAL") return true;
  if (origen === "LOCAL" && destino === "LOCAL") return true;
  if (origen === "LOCAL" && destino === "CENTRAL") return true;

  return false;
}