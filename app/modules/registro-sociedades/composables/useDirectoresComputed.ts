import { storeToRefs } from "pinia";
import { computed, watch, type Ref } from "vue";
import type { TypeOption } from "~/types/TypeOptions";
import { TiposDirectoresEnum } from "~/types/enums/TiposDirectoresEnum";
import { useDirectorioStore, type Director } from "./useDirectores";

export interface DirectorTableRow {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipo_documento: string;
  numero_documento: string;
  tipo_director: string;
  reemplazo_asignado: string;
  nombres_apellidos: string;
}

const tipoDirectorLabels: Record<TiposDirectoresEnum, string> = {
  [TiposDirectoresEnum.TITULAR]: "Titular",
  [TiposDirectoresEnum.SUPLENTE]: "Suplente",
  [TiposDirectoresEnum.ALTERNO]: "Alterno",
};

const buildNombreCompleto = (
  director: Pick<Director, "nombres" | "apellidoPaterno" | "apellidoMaterno">
) =>
  `${director.nombres} ${director.apellidoPaterno} ${director.apellidoMaterno}`
    .replace(/\s+/g, " ")
    .trim();

const buildAcronimo = (nombreCompleto: string) => {
  const parts = nombreCompleto
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "");

  const acronimo = parts.join("").slice(0, 4);

  return acronimo || nombreCompleto.slice(0, 4).toUpperCase() || "N/A";
};

export const useDirectoresComputed = (presidenteDirectorio?: Ref<string>) => {
  const directorioStore = useDirectorioStore();
  const { directores, directoresTitulares } = storeToRefs(directorioStore);

  const presidenteOptions = computed<TypeOption[]>(() =>
    directoresTitulares.value.map((director, index) => {
      const nombreCompleto = buildNombreCompleto(director);

      return {
        id: index + 1,
        label: nombreCompleto,
        name: nombreCompleto,
        value: director.id,
        acronimo: buildAcronimo(nombreCompleto),
      };
    })
  );

  const directoresData = computed<DirectorTableRow[]>(() =>
    directores.value.map((director) => {
      const reemplazoTitular = director.reemplazoAsignado
        ? directores.value.find((item) => item.id === director.reemplazoAsignado)
        : null;

      const reemplazoAsignadoLabel = reemplazoTitular
        ? buildNombreCompleto(reemplazoTitular)
        : "Ninguno";

      return {
        id: director.id,
        nombres: director.nombres,
        apellidoPaterno: director.apellidoPaterno,
        apellidoMaterno: director.apellidoMaterno,
        tipo_documento: String(director.tipoDocumento),
        numero_documento: director.numeroDocumento,
        tipo_director:
          tipoDirectorLabels[director.tipoDirector as TiposDirectoresEnum] ??
          director.tipoDirector,
        reemplazo_asignado: reemplazoAsignadoLabel,
        nombres_apellidos: buildNombreCompleto(director),
      };
    })
  );

  if (presidenteDirectorio) {
    watch(
      directoresTitulares,
      (titulares) => {
        if (!titulares?.length) {
          presidenteDirectorio.value = "";
          return;
        }

        const exists = titulares.some(
          (director) => director.id === presidenteDirectorio.value
        );

        if (!exists) {
          const firstTitular = titulares[0];

          if (firstTitular) {
            presidenteDirectorio.value = firstTitular.id;
          }
        }
      },
      { immediate: true }
    );
  }

  return {
    directores,
    directoresTitulares,
    directoresData,
    presidenteOptions,
  };
};
