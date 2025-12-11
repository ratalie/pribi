import { v4 as uuidv4 } from "uuid";
import {
  EntityCoinUIEnum,
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  type Facultad,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import type { useApoderadoFacultadStore } from "../stores/modal/useApoderadoFacultadStore";
import type { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";

export const transformarModalAFacultad = (
  modalStore: ReturnType<typeof useApoderadoFacultadStore>,
  regimenStore: ReturnType<typeof useRegimenFacultadesStore>,
  idFacultad?: string
): Facultad | null => {
  const tipoFacultadEncontrada = regimenStore.tipoFacultades.find(
    (f) => f.id === modalStore.tipoFacultad
  );

  if (!tipoFacultadEncontrada) {
    console.error(`No se encontró el tipo de facultad con id: ${modalStore.tipoFacultad}`);
    return null;
  }

  const baseFacultad = {
    id: idFacultad || uuidv4(),
    tipoFacultadId: tipoFacultadEncontrada.id,
    tipoFacultadNombre: tipoFacultadEncontrada.tipoFacultades,
  };

  const tipoVigencia = !modalStore.esIrrevocable
    ? {
        esIrrevocable: false as const,
        vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
      }
    : {
        esIrrevocable: true as const,
        vigencia: TiempoVigenciaUIEnum.DETERMINADO,  // ✅ Corregido typo
        fecha_inicio: modalStore.fechaInicio,
        fecha_fin: modalStore.fechaFin,
      };

  const tipoReglas = modalStore.reglasYLimites
    ? {
        reglasYLimites: true as const,
        tipoMoneda: modalStore.tipoMoneda,
        limiteMonetario: modalStore.limiteMonetario.map((limite) => ({
          // Preservar el ID original si existe (edición), generar nuevo si no (creación)
          id: limite.id && limite.id.trim() !== "" ? limite.id : uuidv4(),
          desde: limite.desde,
          tipoMonto: limite.tipoMonto,
          hasta: limite.hasta,
          tipoFirma: limite.tipoFirma,
          ...(limite.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA
            ? {
                firmantes: limite.firmantes.map((firmante) => ({
                  id: firmante.id,
                  cantidad: Number(firmante.cantidad),
                  grupo: firmante.grupo,
                })),
              }
            : {}),
        })),
      }
    : {
        reglasYLimites: false as const,
      };

  return {
    ...baseFacultad,
    ...tipoVigencia,
    ...tipoReglas,
  } as unknown as Facultad;
};

export const transformarFacultadAModal = (
  facultad: Facultad,
  regimenStore: ReturnType<typeof useRegimenFacultadesStore>
): ReturnType<typeof useApoderadoFacultadStore>["$state"] | null => {
  const tipoFacultadEncontrada = regimenStore.tipoFacultades.find(
    (f) => f.tipoFacultades === facultad.tipoFacultadNombre
  );

  if (!tipoFacultadEncontrada) {
    console.error(`No se encontró el tipo de facultad: ${facultad.tipoFacultadNombre}`);
    return null;
  }

  const baseModal = {
    tipoFacultad: tipoFacultadEncontrada.id,
    esIrrevocable: facultad.esIrrevocable,
    vigencia: facultad.vigencia as unknown as TiemposVigenciaEnum,
    fechaInicio: !facultad.esIrrevocable ? "" : facultad.fecha_inicio,
    fechaFin: !facultad.esIrrevocable ? "" : facultad.fecha_fin,
  };

  const reglas = facultad.reglasYLimites
    ? {
        reglasYLimites: true,
        tipoMoneda: facultad.tipoMoneda as unknown as EntityCoinEnum,
        limiteMonetario: facultad.limiteMonetario.map((limite: any) => ({
          id: limite.id,
          desde: limite.desde,
          tipoMonto: limite.tipoMonto,
          hasta: limite.hasta,
          tipoFirma: limite.tipoFirma,
          firmantes:
            limite.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA
              ? limite.firmantes.map((firmante: any) => ({
                  id: firmante.id,
                  cantidad: String(firmante.cantidad),
                  grupo: firmante.grupo,
                }))
              : [],
        })),
      }
    : {
        reglasYLimites: false,
        tipoMoneda: EntityCoinUIEnum.SOLES,
        limiteMonetario: [],
      };

  return {
    ...baseModal,
    ...reglas,
  };
};
