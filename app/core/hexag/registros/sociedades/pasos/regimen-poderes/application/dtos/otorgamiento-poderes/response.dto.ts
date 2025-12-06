import type { TipoFirmaEnum, TipoLimiteEnum, TipoMonedaEnum } from "../..";

export interface OtorgamientoPoderResponseDTO {
  id: string;
  apoderadoId?: string; // ID del apoderado individual (solo para "Otros Apoderados")
  poder: {
    id: string;
    name: string;
    archivoId?: string | null;
    archivo?: ArchivoInfo | null;
  };
  claseApoderado: {
    id: string;
    name: string;
  };
  esIrrevocable: boolean;
  fechaInicio: string; // ISO string
  fechaFin?: string; // ISO string
  tieneReglasFirma: boolean;
  reglasMonetarias: ReglaMonetariaResponseDto[];
}

interface ReglaMonetariaResponseDto {
  id: string;
  tipoMoneda: TipoMonedaEnum;
  montoDesde: number;
  tipoLimite: TipoLimiteEnum;
  montoHasta: number | null;
  tipoFirma: TipoFirmaEnum;
  firmantes: FirmantesResponseDto[];
}

interface FirmantesResponseDto {
  id: string;
  claseApoderadoId: string;
  claseApoderado: {
    id: string;
    name: string;
  };
  cantidadMiembros: number;
}

interface ArchivoInfo {
  id: string;
  nombre: string;
  url: string;
  size: number;
}
