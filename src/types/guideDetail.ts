export type GuideDetail = {
  id: number;
  guideId: number;
  assetId: number;

  estado: "ENVIADO" | "RECIBIDO" | "FALTANTE";
};