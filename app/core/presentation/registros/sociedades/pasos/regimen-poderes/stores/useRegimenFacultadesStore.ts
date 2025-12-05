import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import {
  ListApoderadosUseCase,
  ListClasesApoderadoUseCase,
} from "~/core/hexag/registros/sociedades/pasos/apoderados/application";
import { PersonTypeEnum } from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";
import { ApoderadosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/repositories/apoderados.http.repository";
import {
  CreateTiposFacultadesUseCase,
  DeleteTiposFacultadesUseCase,
  ListOtorgamientosPoderUseCase,
  ListTiposFacultadesUseCase,
  UpdateTiposFacultadesUseCase,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/application";
import {
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  TipoMontoUIEnum,
  type ApoderadoFacultad,
  type Facultad,
  type TipoFacultad,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import { OtorgamientoPoderesMapper } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/mappers/otorgamiento-poderes.mapper";
import { TiposFacultadesMapper } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/mappers/tipos-facultades.mapper";
import { RegimenFacultadesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/repository/regimen-facultades.http.repository";
import { ClasesApoderadoEspecialesEnum } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/enums/ClasesApoderadoEspecialesEnum";
import type { ApoderadoFacultadRow } from "../types/apoderadosFacultades";
import type { TipoFacultadRow } from "../types/facultades";

const repository = new RegimenFacultadesHttpRepository();
const apoderadosRepository = new ApoderadosHttpRepository();

const listTipoFacultadesUseCase = new ListTiposFacultadesUseCase(repository);
const createTipoFacultadUseCase = new CreateTiposFacultadesUseCase(repository);
const updateTipoFacultadUseCase = new UpdateTiposFacultadesUseCase(repository);
const deleteTipoFacultadUseCase = new DeleteTiposFacultadesUseCase(repository);
const listOtorgamientosPoderUseCase = new ListOtorgamientosPoderUseCase(repository);

const listApoderadosUseCase = new ListApoderadosUseCase(apoderadosRepository);
const listClasesApoderadoUseCase = new ListClasesApoderadoUseCase(apoderadosRepository);

export const useRegimenFacultadesStore = defineStore("regimenFacultades", {
  state: (): State => ({
    tipoFacultades: [],
    apoderadosFacultades: [],
    otrosApoderados: [],
  }),

  getters: {
    tablaTipoFacultades(): TipoFacultadRow[] {
      return this.tipoFacultades.map((facultad, index) => ({
        id: facultad.id,
        table_id: index + 1,
        tipo_facultades: facultad.tipoFacultades,
        numero_apoderados: 0,
      }));
    },

    tablaApoderadosFacultades(): ApoderadoFacultadRow[] {
      return this.apoderadosFacultades.map((apoderado) => ({
        id: apoderado.id,
        nombre: apoderado.nombre,
        facultades: apoderado.facultades.map((facultad) => {
          // Vigencia
          const vigencia =
            facultad.vigencia === TiempoVigenciaUIEnum.INDEFINIDO
              ? "Indefinido"
              : `${facultad.fecha_inicio} - ${facultad.fecha_fin}`;

          // Reglas de Firma
          const reglas_firma = facultad.reglasYLimites ? facultad.limiteMonetario.length : 0;

          // Reglas y Límites
          const reglas_y_limites = facultad.reglasYLimites
            ? facultad.limiteMonetario.map((limite, index) => ({
                id: limite.id,
                table_id: index + 1,
                desde: String(limite.desde),
                hasta:
                  limite.tipoMonto === TipoMontoUIEnum.SIN_LIMITE
                    ? "Sin límite"
                    : String(limite.hasta),
                tipo_firma: limite.tipoFirma,
                firmantes:
                  limite.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA ? limite.firmantes : [],
              }))
            : [];

          return {
            id: facultad.id,
            facultad: facultad.nombre,
            vigencia: vigencia,
            reglas_firma: reglas_firma,
            reglas_y_limites: reglas_y_limites,
          };
        }),
      }));
    },

    tablaOtrosApoderadosFacultades(): ApoderadoFacultadRow[] {
      return this.otrosApoderados.map((apoderado) => ({
        id: apoderado.id,
        nombre: apoderado.nombre,
        facultades: apoderado.facultades.map((facultad) => {
          const vigencia =
            facultad.vigencia === TiempoVigenciaUIEnum.INDEFINIDO
              ? "Indefinido"
              : `${facultad.fecha_inicio} - ${facultad.fecha_fin}`;

          const reglas_firma = facultad.reglasYLimites ? facultad.limiteMonetario.length : 0;

          const reglas_y_limites = facultad.reglasYLimites
            ? facultad.limiteMonetario.map((limite, index) => ({
                id: limite.id,
                table_id: index + 1,
                desde: String(limite.desde),
                hasta:
                  limite.tipoMonto === TipoMontoUIEnum.SIN_LIMITE
                    ? "Sin límite"
                    : String(limite.hasta),
                tipo_firma: limite.tipoFirma,
                firmantes:
                  limite.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA ? limite.firmantes : [],
              }))
            : [];

          return {
            id: facultad.id,
            facultad: facultad.nombre,
            vigencia: vigencia,
            reglas_firma: reglas_firma,
            reglas_y_limites: reglas_y_limites,
          };
        }),
      }));
    },

    listaFacultadesOptions(): BaseSelectOption[] {
      return this.tipoFacultades.map((facultad) => ({
        id: facultad.id,
        value: facultad.id,
        label: facultad.tipoFacultades,
      }));
    },
  },

  actions: {
    //apoderados
    async loadApoderados(profileId: string) {
      try {
        // Obtener todas las clases de apoderados
        const clases = await listClasesApoderadoUseCase.execute(profileId);

        // Obtener todos los apoderados
        const apoderados = await listApoderadosUseCase.execute(profileId);

        // Obtener todos los otorgamientos de poder
        const otorgamientos = await listOtorgamientosPoderUseCase.execute(profileId);

        // Crear un mapa de clases por ID para búsqueda rápida
        const clasesMap = new Map(clases.map((clase) => [clase.id, clase]));

        // Inicializar arrays
        const apoderadosFacultadesList: ApoderadoFacultad[] = [];
        const otrosApoderadosList: ApoderadoFacultad[] = [];

        // Clasificar apoderados
        for (const apoderado of apoderados) {
          const clase = clasesMap.get(apoderado.claseApoderadoId);

          if (!clase) {
            // Si no tiene clase, va a otros apoderados
            const nombreCompleto = this.obtenerNombrePersona(apoderado.persona);
            otrosApoderadosList.push({
              id: apoderado.id,
              nombre: nombreCompleto,
              facultades: [],
            });
            continue;
          }

          // Si es "Otros Apoderados", agregar individualmente
          if (clase.nombre === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS) {
            const nombreCompleto = this.obtenerNombrePersona(apoderado.persona);
            otrosApoderadosList.push({
              id: apoderado.id,
              nombre: nombreCompleto,
              facultades: [],
            });
          } else {
            // Para otras clases (incluyendo "Gerente General"), verificar si ya existe en la lista
            const claseExistente = apoderadosFacultadesList.find(
              (item) => item.id === clase.id
            );

            if (!claseExistente) {
              // Si no existe, agregar la clase
              apoderadosFacultadesList.push({
                id: clase.id,
                nombre: clase.nombre,
                facultades: [],
              });
            }
          }
        }

        // Combinar otorgamientos con apoderados
        // Agrupar otorgamientos por claseApoderadoId (para clases normales)
        const otorgamientosPorClase = new Map<string, Facultad[]>();
        // Agrupar otorgamientos por apoderadoId (para "Otros Apoderados")
        const otorgamientosPorApoderado = new Map<string, Facultad[]>();

        for (const otorgamiento of otorgamientos) {
          const facultad = OtorgamientoPoderesMapper.deResponseDTOAFacultad(otorgamiento);

          // Si es "Otros Apoderados", buscar por apoderadoId individual
          const clase = clasesMap.get(otorgamiento.claseApoderadoId);
          if (clase?.nombre === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS) {
            // Para "Otros Apoderados", usar apoderadoId si está disponible
            const apoderadoId = otorgamiento.apoderadoId || otorgamiento.claseApoderadoId;
            if (!otorgamientosPorApoderado.has(apoderadoId)) {
              otorgamientosPorApoderado.set(apoderadoId, []);
            }
            otorgamientosPorApoderado.get(apoderadoId)!.push(facultad);
          } else {
            // Para otras clases, agrupar por claseApoderadoId
            if (!otorgamientosPorClase.has(otorgamiento.claseApoderadoId)) {
              otorgamientosPorClase.set(otorgamiento.claseApoderadoId, []);
            }
            otorgamientosPorClase.get(otorgamiento.claseApoderadoId)!.push(facultad);
          }
        }

        // Asignar facultades a apoderadosFacultades (por clase)
        for (const apoderadoFacultad of apoderadosFacultadesList) {
          const facultades = otorgamientosPorClase.get(apoderadoFacultad.id) || [];
          apoderadoFacultad.facultades = facultades;
        }

        // Asignar facultades a otrosApoderados (individuales)
        for (const otroApoderado of otrosApoderadosList) {
          const facultades = otorgamientosPorApoderado.get(otroApoderado.id) || [];
          otroApoderado.facultades = facultades;
        }

        // Actualizar el estado
        this.apoderadosFacultades = apoderadosFacultadesList;
        this.otrosApoderados = otrosApoderadosList;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    /**
     * Obtiene el nombre completo de una persona (Natural o Jurídica)
     */
    obtenerNombrePersona(persona: { tipo: PersonTypeEnum; [key: string]: any }): string {
      if (persona.tipo === PersonTypeEnum.NATURAL) {
        const parts = [persona.nombre, persona.apellidoPaterno, persona.apellidoMaterno]
          .map((part) => part?.trim())
          .filter((part) => !!part);

        return parts.join(" ").trim() || "Sin nombre";
      } else {
        // Persona Jurídica
        return (
          persona.razonSocial?.trim() || persona.nombreComercial?.trim() || "Sin razón social"
        );
      }
    },

    //tipo
    async loadTipoFacultades(profileId: string) {
      try {
        const tiposFacultades = await listTipoFacultadesUseCase.execute(profileId);

        this.tipoFacultades = tiposFacultades;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async agregarTipoFacultad(profileId: string, tipoFacultad: TipoFacultad) {
      try {
        const payload = TiposFacultadesMapper.deEntityAPayload(tipoFacultad);

        await createTipoFacultadUseCase.execute(profileId, payload);

        this.tipoFacultades.push(tipoFacultad);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async editarTipoFacultad(profileId: string, tipoFacultad: TipoFacultad) {
      try {
        const payload = TiposFacultadesMapper.deEntityAPayload(tipoFacultad);

        await updateTipoFacultadUseCase.execute(profileId, payload);

        const index = this.tipoFacultades.findIndex(
          (facultad) => facultad.id === tipoFacultad.id
        );

        if (index !== -1) {
          this.tipoFacultades[index] = tipoFacultad;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async eliminarTipoFacultad(profileId: string, id: string) {
      try {
        await deleteTipoFacultadUseCase.execute(profileId, [id]);

        this.tipoFacultades = this.tipoFacultades.filter((facultad) => facultad.id !== id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    //apoderado facultad
    agregarFacultadApoderado(idApoderado: string, nuevaFacultad: Facultad) {
      const apoderado = this.apoderadosFacultades.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el apoderado con id: ${idApoderado}`);
        return;
      }

      apoderado.facultades.push(nuevaFacultad);
    },

    editarFacultadApoderado(
      idApoderado: string,
      idFacultad: string,
      facultadActualizada: Facultad
    ) {
      const apoderado = this.apoderadosFacultades.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el apoderado con id: ${idApoderado}`);
        return;
      }

      const index = apoderado.facultades.findIndex((f) => f.id === idFacultad);

      if (index === -1) {
        console.error(`No se encontró la facultad con id: ${idFacultad}`);
        return;
      }

      apoderado.facultades[index] = facultadActualizada;
    },

    eliminarFacultadApoderado(idApoderado: string, idFacultad: string) {
      const apoderado = this.apoderadosFacultades.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el apoderado con id: ${idApoderado}`);
        return;
      }

      apoderado.facultades = apoderado.facultades.filter((f) => f.id !== idFacultad);
    },

    //otros apoderados facultad
    agregarFacultadOtroApoderado(idApoderado: string, nuevaFacultad: Facultad) {
      const apoderado = this.otrosApoderados.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el otro apoderado con id: ${idApoderado}`);
        return;
      }

      apoderado.facultades.push(nuevaFacultad);
    },

    editarFacultadOtroApoderado(
      idApoderado: string,
      idFacultad: string,
      facultadActualizada: Facultad
    ) {
      const apoderado = this.otrosApoderados.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el otro apoderado con id: ${idApoderado}`);
        return;
      }

      const index = apoderado.facultades.findIndex((f) => f.id === idFacultad);

      if (index === -1) {
        console.error(`No se encontró la facultad con id: ${idFacultad}`);
        return;
      }

      apoderado.facultades[index] = facultadActualizada;
    },

    eliminarFacultadOtroApoderado(idApoderado: string, idFacultad: string) {
      const apoderado = this.otrosApoderados.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el otro apoderado con id: ${idApoderado}`);
        return;
      }

      apoderado.facultades = apoderado.facultades.filter((f) => f.id !== idFacultad);
    },
  },
});

interface State {
  tipoFacultades: TipoFacultad[];
  apoderadosFacultades: ApoderadoFacultad[];
  otrosApoderados: ApoderadoFacultad[];
}
