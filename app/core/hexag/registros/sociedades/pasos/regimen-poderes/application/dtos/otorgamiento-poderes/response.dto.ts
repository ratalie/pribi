import type { TipoFirmaEnum, TipoLimiteEnum, TipoMonedaEnum } from "../..";

export interface OtorgamientoPoderResponseDTO {
  id: string;
  poderId: string;
  poder: {
    id: string;
    nombre: string;
    archivoId: string | null;
    archivo: ArchivoInfo | null;
  };
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
  signers: FirmantesResponseDto[];
}

interface FirmantesResponseDto {
  id: string;
  claseApoderadoId: string;
  claseApoderado: {
    id: string;
    nombre: string;
  };
  cantidadMiembros: number;
}

interface ArchivoInfo {
  id: string;
  nombre: string;
  url: string;
  size: number;
}
