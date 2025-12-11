import type { Accionista as AccionistaDomain } from "~/core/hexag/registros/sociedades/pasos/accionistas/domain";
import type { Accionista as AccionistaStore } from "~/modules/registro-sociedades/types/accionistas";
import { TipoAccionistaEnum } from "~/modules/registro-sociedades/types/accionistas";

/**
 * Mapea un Accionista del dominio (hexagonal) al formato del store (presentation)
 */
export function mapAccionistaDomainToStore(
  accionistaDomain: AccionistaDomain
): AccionistaStore {
  const { id, persona } = accionistaDomain;

  switch (persona.tipo) {
    case "NATURAL": {
      return {
        id,
        tipoAccionista: TipoAccionistaEnum.NATURAL,
        tipoDocumento: persona.tipoDocumento,
        numeroDocumento: persona.numeroDocumento,
        nombre: persona.nombre,
        apellidoPaterno: persona.apellidoPaterno,
        apellidoMaterno: persona.apellidoMaterno || "",
        paisPasaporte: persona.paisEmision,
      } as AccionistaStore;
    }

    case "JURIDICA": {
      return {
        id,
        tipoAccionista: TipoAccionistaEnum.JURIDICA,
        tipoDocumento: persona.tipoDocumento,
        numeroDocumento: persona.numeroDocumento,
        razonSocial: persona.razonSocial,
        direccion: persona.direccion || "",
        seConstituyoEnPeru: persona.constituida ?? true,
        nombreComercial: persona.nombreComercial || "",
        distrito: persona.distrito || "",
        provincia: persona.provincia || "",
        departamento: persona.departamento || "",
        paisOrigen: persona.pais || "",
        tieneRepresentante: !!persona.representadoPor,
        representanteLegal: persona.representadoPor
          ? {
              nombre: persona.representadoPor.nombre,
              apellidoPaterno: persona.representadoPor.apellidoPaterno,
              apellidoMaterno: persona.representadoPor.apellidoMaterno || "",
              tipoDocumento: persona.representadoPor.tipoDocumento,
              numeroDocumento: persona.representadoPor.numeroDocumento,
              paisPasaporte: persona.representadoPor.paisEmision,
            }
          : undefined,
      } as AccionistaStore;
    }

    case "SUCURSAL": {
      return {
        id,
        tipoAccionista: TipoAccionistaEnum.SUCURSAL,
        tipoDocumento: "RUC",
        numeroDocumento: persona.ruc,
        nombreSucursal: persona.nombreSucursal,
        partidaRegistral: persona.partidaRegistral || "",
        sedeRegistral: persona.oficinaRegistrada || "",
        domicilioFiscal: persona.direccionFiscal || "",
        tieneRepresentante: !!persona.representante,
        representanteLegal: persona.representante
          ? {
              nombre: persona.representante.nombre,
              apellidoPaterno: persona.representante.apellidoPaterno,
              apellidoMaterno: persona.representante.apellidoMaterno || "",
              tipoDocumento: persona.representante.tipoDocumento,
              numeroDocumento: persona.representante.numeroDocumento,
              paisPasaporte: persona.representante.paisEmision,
            }
          : undefined,
      } as AccionistaStore;
    }

    case "FONDO_INVERSION": {
      return {
        id,
        tipoAccionista: TipoAccionistaEnum.FONDOS_INVERSION,
        tipoDocumento: "RUC",
        numeroDocumento: persona.ruc,
        razonSocial: persona.razonSocial,
        direccion: persona.direccion || "",
        tipoFondo: persona.tipoFondo || "PRIVADO",
        numeroDocumentoSociedadAdministradora: persona.fiduciario?.ruc || "",
        tipoDocumentoSociedadAdministradora: "RUC",
        razonSocialSociedadAdministradora: persona.fiduciario?.razonSocial || "",
        tieneRepresentante: !!persona.representante,
        representanteLegal: persona.representante
          ? {
              nombre: persona.representante.nombre,
              apellidoPaterno: persona.representante.apellidoPaterno,
              apellidoMaterno: persona.representante.apellidoMaterno || "",
              tipoDocumento: persona.representante.tipoDocumento,
              numeroDocumento: persona.representante.numeroDocumento,
              paisPasaporte: persona.representante.paisEmision,
            }
          : undefined,
      } as AccionistaStore;
    }

    case "FIDEICOMISO": {
      const baseData = {
        id,
        tipoAccionista: TipoAccionistaEnum.FIDEICOMISOS,
        identificacionFideicomiso: persona.numeroRegistroFideicomiso || "",
        partidaRegistral: persona.partidaRegistral || "",
        sedeRegistral: persona.oficinaRegistrada || "",
        domicilioFiscal: persona.direccionFiscal || "",
        numeroDocumentoFiduciaria: persona.fiduciario?.ruc || "",
        tipoDocumentoFiduciaria: "RUC",
        razonSocialFiduciaria: persona.fiduciario?.razonSocial || "",
        tieneRepresentante: !!persona.representante,
        representanteLegal: persona.representante
          ? {
              nombre: persona.representante.nombre,
              apellidoPaterno: persona.representante.apellidoPaterno,
              apellidoMaterno: persona.representante.apellidoMaterno || "",
              tipoDocumento: persona.representante.tipoDocumento,
              numeroDocumento: persona.representante.numeroDocumento,
              paisPasaporte: persona.representante.paisEmision,
            }
          : undefined,
      };

      if (persona.tieneRuc && persona.ruc && persona.razonSocial) {
        return {
          ...baseData,
          tieneRuc: true,
          numeroDocumento: persona.ruc,
          tipoDocumento: "RUC",
          razonSocial: persona.razonSocial,
        } as AccionistaStore;
      }

      return {
        ...baseData,
        tieneRuc: false,
      } as AccionistaStore;
    }

    case "SUCESION_INDIVISA": {
      return {
        id,
        tipoAccionista: TipoAccionistaEnum.SUCESIONES_INDIVISAS,
        tipoDocumento: "RUC",
        numeroDocumento: persona.ruc || "",
        razonSocial: persona.razonSocial,
        direccion: persona.direccion || "",
        distrito: persona.distrito || "",
        provincia: persona.provincia || "",
        departamento: persona.departamento || "",
        tieneRepresentante: !!persona.representante,
        representanteLegal: persona.representante
          ? {
              nombre: persona.representante.nombre,
              apellidoPaterno: persona.representante.apellidoPaterno,
              apellidoMaterno: persona.representante.apellidoMaterno || "",
              tipoDocumento: persona.representante.tipoDocumento,
              numeroDocumento: persona.representante.numeroDocumento,
              paisPasaporte: persona.representante.paisEmision,
            }
          : undefined,
      } as AccionistaStore;
    }

    default:
      console.warn(
        `[mapAccionistaDomainToStore] Tipo de persona desconocido: ${(persona as any).tipo}`
      );
      // Fallback a persona natural
      return {
        id,
        tipoAccionista: TipoAccionistaEnum.NATURAL,
        tipoDocumento: "DNI",
        numeroDocumento: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
      } as AccionistaStore;
  }
}

/**
 * Mapea una lista de Accionistas del dominio al formato del store
 */
export function mapAccionistasDomainToStore(
  accionistasDomain: AccionistaDomain[]
): AccionistaStore[] {
  return accionistasDomain.map(mapAccionistaDomainToStore);
}
