export interface SociedadResumenDTO {
  idSociety: string;
  razonSocial: string;
  tipoSocietario: string;
  estado: "borrador" | "completo";
  createdAt: string;
  updatedAt: string;
}

