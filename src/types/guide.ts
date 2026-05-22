export type Guide = {
  id: number;
  numero: string;

  origen: string;
  destinoLocalId: number;

  estado: "GENERADA" | "TRANSITO" | "RECIBIDA" | "PARCIAL";

  fecha: string;
};