export type Asset = {
  id: number;

  codigo: string;
  serie: string;

  dispositivo: string;
  marca: string;
  modelo: string;

  observaciones?: string;

  ip?: string;

  estado: "CENTRAL" | "LOCAL" | "TRANSITO";

  localId?: number;
  areaId?: number;
};