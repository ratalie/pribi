import type { SocietyRegisterStep } from "../../domain/enums/society-register-step.enum";

export interface SociedadResumenDTO {
  idSociety: string;
  razonSocial: string;
  ruc: string;
  directorio: boolean;
  fechaRegistroSociedad: string | null;
  nombreComercial: string;
  tipoSocietario: string;
  pasoActual: SocietyRegisterStep;
  createdAt: string;
  updatedAt: string;
  estado?: "borrador" | "completo";
}


