import type { TipoFirmaEnum, TipoLimiteEnum, TipoMonedaEnum } from "../..";

// Tipo de respuesta del backend: puede ser para clase normal o apoderado especial
export type OtorgamientoPoderResponseDTO =
  | OtorgamientoPoderResponseClase
  | OtorgamientoPoderResponseApoderado;

interface OtorgamientoPoderResponseClase {
  id: string;
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

interface OtorgamientoPoderResponseApoderado {
  id: string;
  poder: {
    id: string;
    name: string;
    archivoId?: string | null;
    archivo?: ArchivoInfo | null;
  };
  apoderadoEspecial: string; // ID del apoderado individual (solo para "Otros Apoderados")
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
  claseApoderadoId?: string; // Opcional porque el backend puede no enviarlo
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
