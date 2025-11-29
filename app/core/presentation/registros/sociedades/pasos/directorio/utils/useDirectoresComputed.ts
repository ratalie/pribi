import { computed, watch, type Ref } from "vue";
import type { DirectorConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/entities/director.entity";
import type { TypeOption } from "~/types/TypeOptions";

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

const tipoDirectorLabels: Record<string, string> = {
  titular: "Titular",
  suplente: "Suplente",
  alterno: "Alterno",
};

const buildNombreCompleto = (director: DirectorConfig) =>
  `${director.persona.nombre} ${director.persona.apellidoPaterno} ${director.persona.apellidoMaterno}`
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

export const useDirectoresComputed = (
  directores: Ref<DirectorConfig[]>,
  presidenteDirectorio?: Ref<string>
) => {
  const directoresTitulares = computed(() =>
    directores.value.filter((d) => d.rolDirector === "titular")
  );

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
      const reemplazoTitular = director.reemplazaId
        ? directores.value.find((item) => item.id === director.reemplazaId)
        : null;

      const reemplazoAsignadoLabel = reemplazoTitular
        ? buildNombreCompleto(reemplazoTitular)
        : "Ninguno";

      const nombreCompleto = buildNombreCompleto(director);

      return {
        id: director.id,
        nombres: director.persona.nombre,
        apellidoPaterno: director.persona.apellidoPaterno,
        apellidoMaterno: director.persona.apellidoMaterno,
        tipo_documento: String(director.persona.tipoDocumento),
        numero_documento: director.persona.numeroDocumento,
        tipo_director: tipoDirectorLabels[director.rolDirector] || director.rolDirector,
        reemplazo_asignado: reemplazoAsignadoLabel,
        nombres_apellidos: nombreCompleto,
      };
    })
  );

  if (presidenteDirectorio) {
    watch(
      directoresTitulares,
      (titulares) => {
        if (!titulares?.length) {
          // Si no hay titulares, solo resetear si el valor actual no es válido
          // No resetear si hay un valor válido (puede venir del backend)
          return;
        }

        // Verificar si el presidente actual existe en los titulares
        const currentValue = presidenteDirectorio.value;
        const exists = titulares.some((director) => director.id === currentValue);

        // Si el valor actual no existe en los titulares y hay un valor,
        // puede ser que el director fue eliminado o los directores aún no se cargaron
        // No hacer nada automáticamente, dejar que el usuario o el backend lo maneje
        if (!exists && currentValue) {
          // El valor no existe en los titulares actuales
          // No resetear automáticamente, puede venir del backend
          console.debug("[useDirectoresComputed] presidenteId no encontrado en titulares", {
            presidenteId: currentValue,
            titulares: titulares.map((t) => t.id),
          });
        }

        // NO asignar automáticamente el primer titular
        // Dejar que el backend o el usuario lo asigne
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
