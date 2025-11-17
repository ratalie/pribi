import { v4 as uuidv4 } from "uuid";
import { TipoFirmasEnum } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/types/enums/TipoFirmasEnum";
import { EntityCoinEnum } from "~/types/enums/EntityCoinEnum";
import { TiemposVigenciaEnum } from "~/types/enums/TiemposVigenciaEnum";
import type { useApoderadoFacultadStore } from "../stores/modal/useApoderadoFacultadStore";
import type { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";
import type { Facultad } from "../types/apoderadosFacultades";

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
    nombre: tipoFacultadEncontrada.tipoFacultades,
  };

  const tipoVigencia = !modalStore.esIrrevocable
    ? {
        esIrrevocable: false as const,
        vigencia: TiemposVigenciaEnum.INDEFINIDO,
      }
    : {
        esIrrevocable: true as const,
        vigencia: TiemposVigenciaEnum.DETERMIADO,
        fecha_inicio: modalStore.fechaInicio,
        fecha_fin: modalStore.fechaFin,
      };

  const tipoReglas = modalStore.reglasYLimites
    ? {
        reglasYLimites: true as const,
        tipoMoneda: modalStore.tipoMoneda,
        limiteMonetario: modalStore.limiteMonetario.map((limite) => ({
          id: uuidv4(),
          desde: limite.desde,
          tipoMonto: limite.tipoMonto,
          hasta: limite.hasta,
          tipoFirma: limite.tipoFirma,
          ...(limite.tipoFirma === TipoFirmasEnum.FIRMA_CONJUNTA
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
  } as Facultad;
};

export const transformarFacultadAModal = (
  facultad: Facultad,
  regimenStore: ReturnType<typeof useRegimenFacultadesStore>
): ReturnType<typeof useApoderadoFacultadStore>["$state"] | null => {
  const tipoFacultadEncontrada = regimenStore.tipoFacultades.find(
    (f) => f.tipoFacultades === facultad.nombre
  );

  if (!tipoFacultadEncontrada) {
    console.error(`No se encontró el tipo de facultad: ${facultad.nombre}`);
    return null;
  }

  const baseModal = {
    tipoFacultad: tipoFacultadEncontrada.id,
    esIrrevocable: facultad.esIrrevocable,
    vigencia: facultad.vigencia,
    fechaInicio: !facultad.esIrrevocable ? "" : facultad.fecha_inicio,
    fechaFin: !facultad.esIrrevocable ? "" : facultad.fecha_fin,
  };

  const reglas = facultad.reglasYLimites
    ? {
        reglasYLimites: true,
        tipoMoneda: facultad.tipoMoneda,
        limiteMonetario: facultad.limiteMonetario.map((limite) => ({
          id: limite.id,
          desde: limite.desde,
          tipoMonto: limite.tipoMonto,
          hasta: limite.hasta,
          tipoFirma: limite.tipoFirma,
          firmantes:
            limite.tipoFirma === TipoFirmasEnum.FIRMA_CONJUNTA
              ? limite.firmantes.map((firmante) => ({
                  id: firmante.id,
                  cantidad: String(firmante.cantidad),
                  grupo: firmante.grupo,
                }))
              : [],
        })),
      }
    : {
        reglasYLimites: false,
        tipoMoneda: EntityCoinEnum.SOLES,
        limiteMonetario: [],
      };

  return {
    ...baseModal,
    ...reglas,
  };
};
