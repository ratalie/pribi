import { v4 as uuidv4 } from "uuid";
import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import type { ClaseApoderadoResponseDTO } from "~/core/hexag/registros/sociedades/pasos/apoderados/application";
import { PersonTypeEnum } from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";
import {
  CreateOtorgamientoPoderUseCase,
  CreateTiposFacultadesUseCase,
  DeleteOtorgamientoPoderUseCase,
  DeleteTiposFacultadesUseCase,
  ListOtorgamientosPoderUseCase,
  ListTiposFacultadesUseCase,
  UpdateOtorgamientoPoderUseCase,
  UpdateTiposFacultadesUseCase,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/application";
import {
  ScopeUIEnum,
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  TipoMontoUIEnum,
  type ApoderadoFacultad,
  type CreateOtorgamientoPoderPayload,
  type EntityCoinUIEnum,
  type Facultad,
  type Firmante,
  type TipoFacultad,
  type UpdateOtorgamientoPoderPayload,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import { OtorgamientoPoderesMapper } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/mappers/otorgamiento-poderes.mapper";
import { TiposFacultadesMapper } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/mappers/tipos-facultades.mapper";
import { RegimenFacultadesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/repository/regimen-facultades.http.repository";
import type { BackendApiResponse } from "~/core/shared/http/api-response.types";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { ClasesApoderadoEspecialesEnum } from "../../apoderados/types/enums/ClasesApoderadoEspecialesEnum";
import type { ApoderadoFacultadRow } from "../types/apoderadosFacultades";
import type { TipoFacultadRow } from "../types/facultades";

const repository = new RegimenFacultadesHttpRepository();

const listTipoFacultadesUseCase = new ListTiposFacultadesUseCase(repository);
const createTipoFacultadUseCase = new CreateTiposFacultadesUseCase(repository);
const updateTipoFacultadUseCase = new UpdateTiposFacultadesUseCase(repository);
const deleteTipoFacultadUseCase = new DeleteTiposFacultadesUseCase(repository);

const listOtorgamientosPoderUseCase = new ListOtorgamientosPoderUseCase(repository);
const createOtorgamientoPoderUseCase = new CreateOtorgamientoPoderUseCase(repository);
const updateOtorgamientoPoderUseCase = new UpdateOtorgamientoPoderUseCase(repository);
const deleteOtorgamientoPoderUseCase = new DeleteOtorgamientoPoderUseCase(repository);

export const useRegimenFacultadesStore = defineStore("regimenFacultades", {
  state: (): State => ({
    tipoFacultades: [],
    apoderadosFacultades: [],
    otrosApoderados: [],
    apoderadosFacultadesOriginal: null,
    otrosApoderadosOriginal: null,
    clasesApoderadosDisponibles: [],
  }),

  getters: {
    tablaTipoFacultades(): TipoFacultadRow[] {
      return this.tipoFacultades.map((facultad, index) => {
        // Contar apoderados que tienen esta facultad asignada
        // Buscar en apoderadosFacultades (clases normales)
        const apoderadosConEstaFacultad = this.apoderadosFacultades.filter((apoderado) =>
          apoderado.facultades.some((f) => f.tipoFacultadId === facultad.id)
        ).length;

        // Buscar en otrosApoderados (apoderados individuales)
        const otrosApoderadosConEstaFacultad = this.otrosApoderados.filter((apoderado) =>
          apoderado.facultades.some((f) => f.tipoFacultadId === facultad.id)
        ).length;

        // Sumar ambos conteos
        const totalApoderados = apoderadosConEstaFacultad + otrosApoderadosConEstaFacultad;

        return {
          id: facultad.id,
          table_id: index + 1,
          tipo_facultades: facultad.tipoFacultades,
          numero_apoderados: totalApoderados,
        };
      });
    },

    tablaApoderadosFacultades(): ApoderadoFacultadRow[] {
      return this.apoderadosFacultades.map((apoderado) => ({
        id: apoderado.id,
        nombre: apoderado.claseApoderadoNombre,
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
            facultad: facultad.tipoFacultadNombre,
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
        nombre: apoderado.claseApoderadoNombre,
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
            facultad: facultad.tipoFacultadNombre,
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
    /**
     * Obtiene las facultades disponibles para un apoderado (excluyendo las ya asignadas)
     * @param apoderadoId ID del apoderado o clase
     * @param tipo "clase" para apoderadosFacultades, "otro" para otrosApoderados
     * @param facultadIdActual Opcional: ID de la facultad actual (para modo editar, se incluye en la lista)
     * @returns Array de opciones de facultades disponibles
     */
    obtenerFacultadesDisponibles(
      apoderadoId: string | null,
      tipo: "clase" | "otro",
      facultadIdActual?: string
    ): BaseSelectOption[] {
      // Si no hay apoderado seleccionado, mostrar todas las facultades
      if (!apoderadoId) {
        return this.listaFacultadesOptions;
      }

      // Obtener el apoderado según el tipo
      const apoderado =
        tipo === "clase"
          ? this.apoderadosFacultades.find((a) => a.id === apoderadoId)
          : this.otrosApoderados.find((a) => a.id === apoderadoId);

      // Si no se encuentra el apoderado, mostrar todas las facultades
      if (!apoderado) {
        return this.listaFacultadesOptions;
      }

      // Obtener IDs de facultades ya asignadas
      const facultadesAsignadasIds = new Set(
        apoderado.facultades.map((f) => f.tipoFacultadId)
      );

      // Si hay una facultad actual (modo editar), excluirla del filtro para que aparezca en la lista
      if (facultadIdActual) {
        const facultadActual = apoderado.facultades.find((f) => f.id === facultadIdActual);
        if (facultadActual) {
          facultadesAsignadasIds.delete(facultadActual.tipoFacultadId);
        }
      }

      // Filtrar facultades que no están asignadas (o que es la actual en modo editar)
      return this.tipoFacultades
        .filter((facultad) => !facultadesAsignadasIds.has(facultad.id))
        .map((facultad) => ({
          id: facultad.id,
          value: facultad.id,
          label: facultad.tipoFacultades,
        }));
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

    //apoderados
    async loadOtorgamientosPoderes(profileId: string) {
      try {
        // Obtener datos
        const otorgamientosPoder = await listOtorgamientosPoderUseCase.execute(profileId);

        // Obtener ResponseDTO con apoderados anidados (necesario para "Otros Apoderados")
        const config = useRuntimeConfig();
        const apiBase = config.public?.apiBase as string | undefined;

        if (!apiBase) {
          throw new Error("apiBase no está configurado");
        }

        const url = `${apiBase}/society-profile/${profileId}/attorney-register/classes`;
        const fetchConfig = withAuthHeaders({ method: "GET" as const });
        const response = await $fetch<BackendApiResponse<ClaseApoderadoResponseDTO[]>>(
          url,
          fetchConfig
        );

        if (!response.success || !response?.data) {
          throw new Error("No se encontraron clases de apoderado");
        }

        const clasesApoderadoResponse: ClaseApoderadoResponseDTO[] = response.data;

        // Separar apoderados: clases normales vs "Otros Apoderados"
        const apoderadosClasesNormales: ApoderadoFacultad[] = [];
        const otrosApoderadosList: ApoderadoFacultad[] = [];

        // Agrupar otorgamientos por claseApoderadoId (para clases normales)
        const otorgamientosPorClase = new Map<string, Facultad[]>();
        // Agrupar otorgamientos por apoderadoId (para "Otros Apoderados")
        const otorgamientosPorApoderado = new Map<string, Facultad[]>();

        // Procesar otorgamientos y convertirlos a Facultad
        otorgamientosPoder.forEach((otorgamiento) => {
          const facultad = OtorgamientoPoderesMapper.deResponseDTOAFacultad(otorgamiento);

          // Detectar si es clase normal o apoderado especial usando type guard
          if ("claseApoderado" in otorgamiento) {
            // Caso 1: Clase normal (tiene claseApoderado)
            const claseApoderadoId = otorgamiento.claseApoderado.id;

            // Agrupar por claseApoderadoId
            if (!otorgamientosPorClase.has(claseApoderadoId)) {
              otorgamientosPorClase.set(claseApoderadoId, []);
            }
            otorgamientosPorClase.get(claseApoderadoId)!.push(facultad);
          } else {
            // Caso 2: Otros Apoderados (tiene apoderadoEspecial)
            // TypeScript garantiza que si no tiene claseApoderado, tiene apoderadoEspecial
            const apoderadoId = otorgamiento.apoderadoEspecial;

            // Agrupar por apoderadoId individual
            if (!otorgamientosPorApoderado.has(apoderadoId)) {
              otorgamientosPorApoderado.set(apoderadoId, []);
            }
            otorgamientosPorApoderado.get(apoderadoId)!.push(facultad);
          }
        });

        // Construir apoderadosFacultades (clases normales)
        clasesApoderadoResponse
          .filter((clase) => clase.nombre !== ClasesApoderadoEspecialesEnum.OTROS_APODERADOS)
          .forEach((clase) => {
            const facultades = otorgamientosPorClase.get(clase.id) || [];

            // Si tiene otorgamientos, usar el claseApoderadoId del otorgamiento
            // Si no tiene otorgamientos, generar UUID temporal para la UI
            const claseIdFinal = facultades.length > 0 ? clase.id : uuidv4();

            apoderadosClasesNormales.push({
              id: claseIdFinal, // ID de la clase (si tiene otorgamientos) o UUID temporal
              claseApoderadoId: clase.id, // Siempre el ID real de la clase
              claseApoderadoNombre: clase.nombre,
              facultades: facultades,
            });
          });

        // Construir otrosApoderados (apoderados individuales)
        // Filtrar solo los apoderados que pertenecen a "Otros Apoderados"
        const claseOtrosApoderados = clasesApoderadoResponse.find(
          (clase) => clase.nombre === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS
        );

        if (claseOtrosApoderados && claseOtrosApoderados.apoderados) {
          claseOtrosApoderados.apoderados.forEach((apoderado) => {
            const nombreCompleto = this.obtenerNombrePersona(apoderado.persona);

            // Buscar si este apoderado tiene otorgamientos
            // El Map usa otorgamiento.apoderadoId como clave
            const facultades = otorgamientosPorApoderado.get(apoderado.id) || [];

            // Para "Otros Apoderados", SIEMPRE usar el ID real del apoderado (apoderado.id)
            // Este ID se usará como claseApoderadoId cuando se cree un otorgamiento
            otrosApoderadosList.push({
              id: apoderado.id, // Siempre el ID real del apoderado del backend
              claseApoderadoId: apoderado.claseApoderadoId, // ID de la clase "Otros Apoderados"
              claseApoderadoNombre: nombreCompleto, // Nombre de la persona
              facultades: facultades,
            });
          });
        }

        // Guardar clases disponibles con cantidad de apoderados (excluyendo "Otros Apoderados")
        this.clasesApoderadosDisponibles = clasesApoderadoResponse
          .filter((clase) => clase.nombre !== ClasesApoderadoEspecialesEnum.OTROS_APODERADOS)
          .map((clase) => ({
            id: clase.id,
            nombre: clase.nombre,
            cantidadApoderados: clase.apoderados?.length || 0,
          }));

        // Actualizar el estado
        this.apoderadosFacultades = apoderadosClasesNormales;
        this.otrosApoderados = otrosApoderadosList;
      } catch (error) {
        console.error(error);
        throw error;
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

    async eliminarFacultadApoderado(
      profileId: string,
      idApoderado: string,
      idFacultad: string
    ): Promise<void> {
      const apoderado = this.apoderadosFacultades.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el apoderado con id: ${idApoderado}`);
        throw new Error(`No se encontró el apoderado con id: ${idApoderado}`);
      }

      try {
        // Llamar al backend para eliminar
        await deleteOtorgamientoPoderUseCase.execute(profileId, [idFacultad]);

        // Actualizar estado local solo si el backend responde OK
        apoderado.facultades = apoderado.facultades.filter((f) => f.id !== idFacultad);
      } catch (error) {
        console.error("Error al eliminar el otorgamiento de poder:", error);
        throw error; // Re-lanzar para que el composable pueda manejarlo
      }
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

    async eliminarFacultadOtroApoderado(
      profileId: string,
      idApoderado: string,
      idFacultad: string
    ): Promise<void> {
      const apoderado = this.otrosApoderados.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el otro apoderado con id: ${idApoderado}`);
        throw new Error(`No se encontró el otro apoderado con id: ${idApoderado}`);
      }

      try {
        // Llamar al backend para eliminar
        await deleteOtorgamientoPoderUseCase.execute(profileId, [idFacultad]);

        // Actualizar estado local solo si el backend responde OK
        apoderado.facultades = apoderado.facultades.filter((f) => f.id !== idFacultad);
      } catch (error) {
        console.error("Error al eliminar el otorgamiento de poder:", error);
        throw error; // Re-lanzar para que el composable pueda manejarlo
      }
    },

    // ========== Sección 6: Estado Original/Actual ==========

    /**
     * Guarda una copia profunda del estado original del apoderado/clase que se va a editar.
     * @param tipo "clase" para apoderadosFacultades, "otro" para otrosApoderados
     * @param apoderadoId ID del apoderado o clase que se va a editar
     */
    guardarEstadoOriginal(tipo: "clase" | "otro", apoderadoId: string) {
      if (tipo === "clase") {
        const apoderado = this.apoderadosFacultades.find((a) => a.id === apoderadoId);
        if (apoderado) {
          this.apoderadosFacultadesOriginal = this.clonarProfundoApoderadosFacultades([
            apoderado,
          ]);
        }
      } else {
        const apoderado = this.otrosApoderados.find((a) => a.id === apoderadoId);
        if (apoderado) {
          this.otrosApoderadosOriginal = this.clonarProfundoApoderadosFacultades([apoderado]);
        }
      }
    },

    /**
     * Limpia los estados originales después de guardar o cancelar.
     */
    limpiarEstadoOriginal() {
      this.apoderadosFacultadesOriginal = null;
      this.otrosApoderadosOriginal = null;
    },

    /**
     * Obtiene el estado original de un apoderado específico.
     * @param apoderadoId ID del apoderado
     * @returns El estado original del apoderado o null si no existe
     */
    obtenerEstadoOriginalApoderado(apoderadoId: string): ApoderadoFacultad | null {
      // Buscar en apoderadosFacultadesOriginal
      if (this.apoderadosFacultadesOriginal) {
        const apoderado = this.apoderadosFacultadesOriginal.find((a) => a.id === apoderadoId);
        if (apoderado) {
          return apoderado;
        }
      }

      // Buscar en otrosApoderadosOriginal
      if (this.otrosApoderadosOriginal) {
        const apoderado = this.otrosApoderadosOriginal.find((a) => a.id === apoderadoId);
        if (apoderado) {
          return apoderado;
        }
      }

      return null;
    },

    /**
     * Obtiene el estado original de una facultad específica.
     * @param apoderadoId ID del apoderado que contiene la facultad
     * @param facultadId ID de la facultad
     * @returns El estado original de la facultad o null si no existe
     */
    obtenerEstadoOriginalFacultad(apoderadoId: string, facultadId: string): Facultad | null {
      const apoderadoOriginal = this.obtenerEstadoOriginalApoderado(apoderadoId);
      if (!apoderadoOriginal) {
        return null;
      }

      const facultad = apoderadoOriginal.facultades.find((f) => f.id === facultadId);
      return facultad || null;
    },

    /**
     * Realiza una clonación profunda de un array de ApoderadoFacultad.
     * @param apoderados Array de apoderados a clonar
     * @returns Array clonado profundamente
     */
    clonarProfundoApoderadosFacultades(apoderados: ApoderadoFacultad[]): ApoderadoFacultad[] {
      return apoderados.map((apoderado) => ({
        ...apoderado,
        facultades: apoderado.facultades.map((facultad) => {
          // Clonar facultad base
          const facultadClonada: Facultad = {
            ...facultad,
          };

          // Si tiene reglasYLimites, clonar también limiteMonetario
          if (facultad.reglasYLimites && "limiteMonetario" in facultad) {
            const limiteMonetario = (facultad as Extract<Facultad, { reglasYLimites: true }>)
              .limiteMonetario;
            (facultadClonada as Extract<Facultad, { reglasYLimites: true }>).limiteMonetario =
              limiteMonetario.map((limite) => {
                // Clonar según el tipo de firma
                if (limite.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA) {
                  // Para firma conjunta, incluir firmantes
                  return {
                    ...limite,
                    firmantes: limite.firmantes.map((firmante) => ({ ...firmante })),
                  };
                } else {
                  // Para sola firma, no incluir firmantes
                  return {
                    ...limite,
                  };
                }
              });
          }

          return facultadClonada;
        }),
      }));
    },

    // ========== Sección 7: Detección de Cambios ==========

    /**
     * Detecta cambios en una facultad comparando el estado original con el actual.
     * @param apoderadoId ID del apoderado que contiene la facultad
     * @param facultadId ID de la facultad a comparar
     * @param facultadActual Opcional: Facultad actual transformada del modal. Si no se proporciona, se lee del store.
     * @returns Objeto con los cambios detectados o null si no hay cambios
     */
    detectarCambiosFacultad(
      apoderadoId: string,
      facultadId: string,
      facultadActual?: Facultad
    ): {
      hayCambios: boolean;
      cambiosBase?: {
        esIrrevocable?: boolean;
        fechaInicio?: string;
        fechaFin?: string;
      };
    } | null {
      const facultadOriginal = this.obtenerEstadoOriginalFacultad(apoderadoId, facultadId);
      if (!facultadOriginal) {
        return null; // No existe en el original, es nueva
      }

      // Si no se proporciona facultadActual, leerla del store
      let facultadActualParaComparar: Facultad | undefined = facultadActual;
      if (!facultadActualParaComparar) {
        const apoderadoActual =
          this.apoderadosFacultades.find((a) => a.id === apoderadoId) ||
          this.otrosApoderados.find((a) => a.id === apoderadoId);
        if (!apoderadoActual) {
          return null;
        }
        facultadActualParaComparar = apoderadoActual.facultades.find(
          (f) => f.id === facultadId
        );
        if (!facultadActualParaComparar) {
          return null; // Fue eliminada
        }
      }

      const cambiosBase: {
        esIrrevocable?: boolean;
        fechaInicio?: string;
        fechaFin?: string;
      } = {};

      // Comparar esIrrevocable
      if (facultadOriginal.esIrrevocable !== facultadActualParaComparar.esIrrevocable) {
        cambiosBase.esIrrevocable = facultadActualParaComparar.esIrrevocable;
      }

      // Comparar fechas (solo si es vigencia determinada)
      if (
        facultadOriginal.vigencia === TiempoVigenciaUIEnum.DETERMIADO &&
        facultadActualParaComparar.vigencia === TiempoVigenciaUIEnum.DETERMIADO
      ) {
        if (facultadOriginal.fecha_inicio !== facultadActualParaComparar.fecha_inicio) {
          cambiosBase.fechaInicio = facultadActualParaComparar.fecha_inicio;
        }
        if (facultadOriginal.fecha_fin !== facultadActualParaComparar.fecha_fin) {
          cambiosBase.fechaFin = facultadActualParaComparar.fecha_fin;
        }
      }

      const hayCambios = Object.keys(cambiosBase).length > 0;
      return hayCambios ? { hayCambios: true, cambiosBase } : null;
    },

    /**
     * Detecta cambios en las reglas monetarias de una facultad.
     * @param apoderadoId ID del apoderado que contiene la facultad
     * @param facultadId ID de la facultad
     * @param facultadActual Opcional: Facultad actual transformada del modal. Si no se proporciona, se lee del store.
     * @returns Array con las acciones detectadas (add, update, remove, updateSigners)
     */
    detectarCambiosReglasMonetarias(
      apoderadoId: string,
      facultadId: string,
      facultadActual?: Facultad
    ): Extract<
      UpdateOtorgamientoPoderPayload,
      { tieneReglasFirma: true }
    >["reglasMonetarias"] {
      const facultadOriginal = this.obtenerEstadoOriginalFacultad(apoderadoId, facultadId);

      // Si no se proporciona facultadActual, leerla del store
      let facultadActualParaComparar: Facultad | undefined = facultadActual;
      if (!facultadActualParaComparar) {
        const apoderadoActual =
          this.apoderadosFacultades.find((a) => a.id === apoderadoId) ||
          this.otrosApoderados.find((a) => a.id === apoderadoId);
        if (!apoderadoActual) {
          return [];
        }
        facultadActualParaComparar = apoderadoActual.facultades.find(
          (f) => f.id === facultadId
        );
        if (!facultadActualParaComparar) {
          return [];
        }
      }

      // Si no tiene reglas en ninguno de los dos estados, no hay cambios
      if (!facultadOriginal?.reglasYLimites && !facultadActualParaComparar.reglasYLimites) {
        return [];
      }

      // Si tenía reglas y ahora no, todas se eliminaron
      if (facultadOriginal?.reglasYLimites && !facultadActualParaComparar.reglasYLimites) {
        return facultadOriginal.limiteMonetario.map((regla) => ({
          accion: "remove" as const,
          reglaId: regla.id,
        }));
      }

      // Si no tenía reglas y ahora sí, todas se agregaron
      if (!facultadOriginal?.reglasYLimites && facultadActualParaComparar.reglasYLimites) {
        const facultadConReglas = facultadActualParaComparar as Extract<
          Facultad,
          { reglasYLimites: true }
        >;
        return facultadConReglas.limiteMonetario.map((regla) => ({
          accion: "add" as const,
          id: regla.id,
          tipoMoneda: facultadConReglas.tipoMoneda,
          montoDesde: regla.desde,
          ...(regla.tipoMonto === TipoMontoUIEnum.MONTO
            ? { tipoLimite: TipoMontoUIEnum.MONTO, montoHasta: regla.hasta }
            : { tipoLimite: TipoMontoUIEnum.SIN_LIMITE }),
          ...(regla.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA
            ? {
                tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                firmantes: regla.firmantes.map((f) => ({
                  id: f.id,
                  cantidad: f.cantidad,
                  grupo: f.grupo,
                })),
              }
            : { tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA }),
        }));
      }

      // Ambos tienen reglas, comparar
      if (facultadOriginal?.reglasYLimites && facultadActualParaComparar.reglasYLimites) {
        const facultadOriginalConReglas = facultadOriginal as Extract<
          Facultad,
          { reglasYLimites: true }
        >;
        const facultadActualConReglas = facultadActualParaComparar as Extract<
          Facultad,
          { reglasYLimites: true }
        >;
        const reglasOriginales = facultadOriginalConReglas.limiteMonetario;
        const reglasActuales = facultadActualConReglas.limiteMonetario;
        const acciones: Extract<
          UpdateOtorgamientoPoderPayload,
          { tieneReglasFirma: true }
        >["reglasMonetarias"] = [];

        // Crear Maps para búsqueda rápida
        const reglasOriginalesMap = new Map(reglasOriginales.map((r) => [r.id, r]));
        const reglasActualesMap = new Map(reglasActuales.map((r) => [r.id, r]));

        // Detectar reglas eliminadas (están en original pero no en actual)
        reglasOriginales.forEach((reglaOriginal) => {
          if (!reglasActualesMap.has(reglaOriginal.id)) {
            acciones.push({
              accion: "remove",
              reglaId: reglaOriginal.id,
            });
          }
        });

        // Detectar reglas agregadas o actualizadas
        reglasActuales.forEach((reglaActual) => {
          const reglaOriginal = reglasOriginalesMap.get(reglaActual.id);

          if (!reglaOriginal) {
            // Nueva regla (add)
            acciones.push({
              accion: "add",
              id: reglaActual.id,
              tipoMoneda: facultadActualConReglas.tipoMoneda,
              montoDesde: reglaActual.desde,
              ...(reglaActual.tipoMonto === TipoMontoUIEnum.MONTO
                ? { tipoLimite: TipoMontoUIEnum.MONTO, montoHasta: reglaActual.hasta }
                : { tipoLimite: TipoMontoUIEnum.SIN_LIMITE }),
              ...(reglaActual.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA
                ? {
                    tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                    firmantes: reglaActual.firmantes.map((f) => ({
                      id: f.id,
                      cantidad: f.cantidad,
                      grupo: f.grupo,
                    })),
                  }
                : { tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA }),
            });
          } else {
            // Regla existente, verificar si cambió
            // Puede retornar múltiples acciones (update y/o updateSigners)
            const cambiosRegla = this.detectarCambiosEnRegla(
              reglaOriginal,
              reglaActual,
              facultadActualConReglas.tipoMoneda
            );
            acciones.push(...cambiosRegla);
          }
        });

        return acciones;
      }

      return [];
    },

    /**
     * Detecta cambios en una regla monetaria específica.
     * Puede retornar múltiples acciones si hay cambios tanto en la regla como en los firmantes.
     * @param reglaOriginal Regla original
     * @param reglaActual Regla actual
     * @param tipoMoneda Tipo de moneda de la facultad (necesario para la acción update)
     * @returns Array de acciones (update y/o updateSigners) o array vacío si no hay cambios
     */
    detectarCambiosEnRegla(
      reglaOriginal: Extract<Facultad, { reglasYLimites: true }>["limiteMonetario"][number],
      reglaActual: Extract<Facultad, { reglasYLimites: true }>["limiteMonetario"][number],
      tipoMoneda: EntityCoinUIEnum
    ): Extract<
      UpdateOtorgamientoPoderPayload,
      { tieneReglasFirma: true }
    >["reglasMonetarias"] {
      const acciones: Extract<
        UpdateOtorgamientoPoderPayload,
        { tieneReglasFirma: true }
      >["reglasMonetarias"] = [];

      // Comparar campos base
      const cambioDesde = reglaOriginal.desde !== reglaActual.desde;
      const cambioTipoMonto = reglaOriginal.tipoMonto !== reglaActual.tipoMonto;
      const cambioHasta =
        reglaOriginal.tipoMonto === TipoMontoUIEnum.MONTO &&
        reglaActual.tipoMonto === TipoMontoUIEnum.MONTO &&
        reglaOriginal.hasta !== reglaActual.hasta;
      const cambioTipoFirma = reglaOriginal.tipoFirma !== reglaActual.tipoFirma;

      // Si cambió el tipo de firma o hay cambios en campos base, agregar acción update
      if (cambioDesde || cambioTipoMonto || cambioHasta || cambioTipoFirma) {
        // Solo incluir tipoFirma, NO los firmantes (se manejan en updateSigners)
        if (reglaActual.tipoMonto === TipoMontoUIEnum.MONTO) {
          // Con límite
          if (reglaActual.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA) {
            acciones.push({
              accion: "update",
              id: reglaActual.id,
              tipoMoneda: tipoMoneda,
              montoDesde: reglaActual.desde,
              tipoLimite: TipoMontoUIEnum.MONTO,
              montoHasta: reglaActual.hasta,
              tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
            });
          } else {
            acciones.push({
              accion: "update",
              id: reglaActual.id,
              tipoMoneda: tipoMoneda,
              montoDesde: reglaActual.desde,
              tipoLimite: TipoMontoUIEnum.MONTO,
              montoHasta: reglaActual.hasta,
              tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
            });
          }
        } else {
          // Sin límite
          if (reglaActual.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA) {
            acciones.push({
              accion: "update",
              id: reglaActual.id,
              tipoMoneda: tipoMoneda,
              montoDesde: reglaActual.desde,
              tipoLimite: TipoMontoUIEnum.SIN_LIMITE,
              tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
            });
          } else {
            acciones.push({
              accion: "update",
              id: reglaActual.id,
              tipoMoneda: tipoMoneda,
              montoDesde: reglaActual.desde,
              tipoLimite: TipoMontoUIEnum.SIN_LIMITE,
              tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
            });
          }
        }
      }

      // Si la regla actual es firma conjunta, verificar cambios en firmantes
      // (independientemente de si hubo cambios en la regla o si la original era SOLA_FIRMA)
      if (reglaActual.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA) {
        let cambiosFirmantes: Array<
          | (Firmante & { accion: "add" })
          | (Firmante & { accion: "update" })
          | { accion: "remove"; signerId: string }
        >;

        // Si la original era SOLA_FIRMA y la actual es FIRMA_CONJUNTA,
        // todos los firmantes actuales son "add"
        if (reglaOriginal.tipoFirma === TipoFirmasUIEnum.SOLA_FIRMA) {
          cambiosFirmantes = reglaActual.firmantes.map((firmante) => ({
            accion: "add" as const,
            id: firmante.id,
            cantidad: firmante.cantidad,
            grupo: firmante.grupo,
          }));
        } else {
          // Ambas son FIRMA_CONJUNTA, usar la lógica normal de detección
          cambiosFirmantes = this.detectarCambiosFirmantes(
            reglaOriginal.firmantes,
            reglaActual.firmantes
          );
        }

        // Solo agregar updateSigners si hay cambios en los firmantes
        if (cambiosFirmantes.length > 0) {
          acciones.push({
            accion: "updateSigners",
            reglaId: reglaActual.id,
            firmantes: cambiosFirmantes,
          });
        }
      }

      return acciones; // Puede contener 0, 1 o 2 acciones
    },

    /**
     * Detecta cambios en los firmantes de una regla.
     * @param firmantesOriginales Firmantes originales
     * @param firmantesActuales Firmantes actuales
     * @returns Array con las acciones de firmantes (add, update, remove)
     */
    detectarCambiosFirmantes(
      firmantesOriginales: Firmante[],
      firmantesActuales: Firmante[]
    ): Array<
      | (Firmante & { accion: "add" })
      | (Firmante & { accion: "update" })
      | { accion: "remove"; signerId: string }
    > {
      const acciones: Array<
        | (Firmante & { accion: "add" })
        | (Firmante & { accion: "update" })
        | { accion: "remove"; signerId: string }
      > = [];

      // Crear Maps para búsqueda rápida
      const firmantesOriginalesMap = new Map(firmantesOriginales.map((f) => [f.id, f]));
      const firmantesActualesMap = new Map(firmantesActuales.map((f) => [f.id, f]));

      // Detectar firmantes eliminados
      firmantesOriginales.forEach((firmanteOriginal) => {
        if (!firmantesActualesMap.has(firmanteOriginal.id)) {
          acciones.push({
            accion: "remove",
            signerId: firmanteOriginal.id,
          });
        }
      });

      // Detectar firmantes agregados o actualizados
      firmantesActuales.forEach((firmanteActual) => {
        const firmanteOriginal = firmantesOriginalesMap.get(firmanteActual.id);

        if (!firmanteOriginal) {
          // Nuevo firmante (add)
          acciones.push({
            accion: "add",
            id: firmanteActual.id,
            cantidad: firmanteActual.cantidad,
            grupo: firmanteActual.grupo,
          });
        } else {
          // Firmante existente, verificar si cambió
          if (
            firmanteOriginal.cantidad !== firmanteActual.cantidad ||
            firmanteOriginal.grupo !== firmanteActual.grupo
          ) {
            acciones.push({
              accion: "update",
              id: firmanteActual.id,
              cantidad: firmanteActual.cantidad,
              grupo: firmanteActual.grupo,
            });
          }
        }
      });

      return acciones;
    },

    // ========== Sección 8: Store (Métodos Create/Update) ==========

    /**
     * Convierte una Facultad (entidad) a CreateOtorgamientoPoderPayload
     * @param facultad Facultad a convertir
     * @param scope Scope del otorgamiento (CLASS o ATTORNEY)
     * @param id ID del apoderado o clase según el scope
     */
    construirCreatePayload(
      facultad: Facultad,
      scope: ScopeUIEnum,
      id: string
    ): CreateOtorgamientoPoderPayload {
      const baseProps = {
        id: facultad.id,
        poderId: facultad.tipoFacultadId,
        esIrrevocable: facultad.esIrrevocable,
        fechaInicio: new Date(
          facultad.vigencia === TiempoVigenciaUIEnum.DETERMIADO
            ? facultad.fecha_inicio
            : new Date()
        ),
        fechaFin:
          facultad.vigencia === TiempoVigenciaUIEnum.DETERMIADO
            ? new Date(facultad.fecha_fin)
            : undefined,
      };

      // Construir payload según scope (discriminated union)
      if (scope === ScopeUIEnum.CLASS) {
        if (!facultad.reglasYLimites) {
          return {
            ...baseProps,
            scope: ScopeUIEnum.CLASS,
            claseApoderadoId: id,
            tieneReglasFirma: false,
          };
        }

        return {
          ...baseProps,
          scope: ScopeUIEnum.CLASS,
          claseApoderadoId: id,
          tieneReglasFirma: true,
          reglasMonetarias: facultad.limiteMonetario.map((regla) => ({
            id: regla.id,
            tipoMoneda: facultad.tipoMoneda,
            montoDesde: regla.desde,
            ...(regla.tipoMonto === TipoMontoUIEnum.MONTO
              ? { tipoLimite: TipoMontoUIEnum.MONTO, montoHasta: regla.hasta }
              : { tipoLimite: TipoMontoUIEnum.SIN_LIMITE }),
            ...(regla.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA
              ? {
                  tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                  firmantes: regla.firmantes.map((f) => ({
                    id: f.id,
                    cantidad: f.cantidad,
                    grupo: f.grupo,
                  })),
                }
              : { tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA }),
          })),
        };
      }

      // Para ATTORNEY
      if (!facultad.reglasYLimites) {
        return {
          ...baseProps,
          scope: ScopeUIEnum.ATTORNEY,
          apoderadoId: id,
          tieneReglasFirma: false,
        };
      }

      return {
        ...baseProps,
        scope: ScopeUIEnum.ATTORNEY,
        apoderadoId: id,
        tieneReglasFirma: true,
        reglasMonetarias: facultad.limiteMonetario.map((regla) => ({
          id: regla.id,
          tipoMoneda: facultad.tipoMoneda,
          montoDesde: regla.desde,
          ...(regla.tipoMonto === TipoMontoUIEnum.MONTO
            ? { tipoLimite: TipoMontoUIEnum.MONTO, montoHasta: regla.hasta }
            : { tipoLimite: TipoMontoUIEnum.SIN_LIMITE }),
          ...(regla.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA
            ? {
                tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                firmantes: regla.firmantes.map((f) => ({
                  id: f.id,
                  cantidad: f.cantidad,
                  grupo: f.grupo,
                })),
              }
            : { tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA }),
        })),
      };
    },

    /**
     * Construye el UpdateOtorgamientoPoderPayload a partir de los cambios detectados
     */
    construirUpdatePayload(
      facultadId: string,
      apoderadoId: string,
      cambiosBase: {
        esIrrevocable?: boolean;
        fechaInicio?: string;
        fechaFin?: string;
      } | null,
      cambiosReglas: Extract<
        UpdateOtorgamientoPoderPayload,
        { tieneReglasFirma: true }
      >["reglasMonetarias"],
      facultadActual: Facultad
    ): UpdateOtorgamientoPoderPayload {
      const basePayload = {
        id: facultadId,
        esIrrevocable: cambiosBase?.esIrrevocable ?? facultadActual.esIrrevocable,
        fechaInicio: cambiosBase?.fechaInicio
          ? new Date(cambiosBase.fechaInicio)
          : facultadActual.vigencia === TiempoVigenciaUIEnum.DETERMIADO
          ? new Date(facultadActual.fecha_inicio)
          : new Date(),
        fechaFin: cambiosBase?.fechaFin
          ? new Date(cambiosBase.fechaFin)
          : facultadActual.vigencia === TiempoVigenciaUIEnum.DETERMIADO
          ? new Date(facultadActual.fecha_fin)
          : undefined,
      };

      // Si hay cambios en reglas o si la facultad tiene reglas, incluir reglasMonetarias
      if (cambiosReglas.length > 0 || facultadActual.reglasYLimites) {
        return {
          ...basePayload,
          tieneReglasFirma: true,
          reglasMonetarias: cambiosReglas,
        };
      }

      return {
        ...basePayload,
        tieneReglasFirma: false,
      };
    },

    /**
     * Crea un nuevo otorgamiento de poder
     * @param profileId ID del perfil de la sociedad
     * @param tipo "clase" para apoderadosFacultades, "otro" para otrosApoderados
     * @param apoderadoId ID del apoderado o clase
     * @param facultad Facultad (entidad) a crear
     * @param poderId ID del poder (tipo de facultad)
     */
    async createOtorgamientoPoder(
      profileId: string,
      tipo: "clase" | "otro",
      apoderadoId: string,
      facultad: Facultad,
      poderId: string
    ): Promise<void> {
      try {
        // Determinar scope e id según el tipo
        let scope: ScopeUIEnum;
        let id: string;

        if (tipo === "otro") {
          // Para "Otros Apoderados": scope ATTORNEY, id es el apoderadoId individual
          scope = ScopeUIEnum.ATTORNEY;
          id = apoderadoId;
        } else {
          // Para clases normales: scope CLASS, id es el claseApoderadoId
          scope = ScopeUIEnum.CLASS;
          const apoderado = this.apoderadosFacultades.find((a) => a.id === apoderadoId);
          if (!apoderado) {
            throw new Error(`Apoderado con ID ${apoderadoId} no encontrado`);
          }
          id = apoderado.claseApoderadoId;
        }

        // Construir payload con scope e id
        const payload = this.construirCreatePayload(facultad, scope, id);
        // Asegurar que el poderId sea el correcto
        payload.poderId = poderId;

        // Llamar al use case
        await createOtorgamientoPoderUseCase.execute(profileId, payload);

        // Actualizar estado local: agregar la nueva facultad al apoderado correspondiente
        const apoderado =
          tipo === "clase"
            ? this.apoderadosFacultades.find((a) => a.id === apoderadoId)
            : this.otrosApoderados.find((a) => a.id === apoderadoId);

        if (apoderado) {
          apoderado.facultades.push(facultad);
        } else {
          // Si no existe el apoderado, es un caso inesperado
          console.warn(
            `Apoderado con ID ${apoderadoId} no encontrado en el estado local después de crear otorgamiento`
          );
        }
      } catch (error) {
        console.error("Error al crear otorgamiento de poder:", error);
        throw error;
      }
    },

    /**
     * Actualiza un otorgamiento de poder existente
     * @param profileId ID del perfil de la sociedad
     * @param tipo "clase" para apoderadosFacultades, "otro" para otrosApoderados
     * @param apoderadoId ID del apoderado o clase
     * @param facultadId ID de la facultad a actualizar
     * @param facultadActual Opcional: Facultad actual transformada del modal. Si no se proporciona, se lee del store.
     */
    async updateOtorgamientoPoder(
      profileId: string,
      tipo: "clase" | "otro",
      apoderadoId: string,
      facultadId: string,
      facultadActual?: Facultad
    ): Promise<void> {
      try {
        // Detectar cambios usando la facultad actual del modal si se proporciona
        const cambiosBase = this.detectarCambiosFacultad(
          apoderadoId,
          facultadId,
          facultadActual
        );
        const cambiosReglas = this.detectarCambiosReglasMonetarias(
          apoderadoId,
          facultadId,
          facultadActual
        );

        // Si no hay cambios, no hacer nada
        if (!cambiosBase && cambiosReglas.length === 0) {
          console.warn("No se detectaron cambios para actualizar");
          return;
        }

        // Construir payload
        // Si se proporciona facultadActual, usarla para obtener valores base; si no, leer del store
        const facultadParaPayload =
          facultadActual ||
          (tipo === "clase"
            ? this.apoderadosFacultades
                .find((a) => a.id === apoderadoId)
                ?.facultades.find((f) => f.id === facultadId)
            : this.otrosApoderados
                .find((a) => a.id === apoderadoId)
                ?.facultades.find((f) => f.id === facultadId));

        if (!facultadParaPayload) {
          throw new Error(`Facultad con ID ${facultadId} no encontrada`);
        }

        const payload = this.construirUpdatePayload(
          facultadId,
          apoderadoId,
          cambiosBase?.cambiosBase ?? null,
          cambiosReglas,
          facultadParaPayload
        );

        // Llamar al use case
        await updateOtorgamientoPoderUseCase.execute(profileId, payload);

        // Actualizar estado local directamente con los cambios
        const apoderado =
          tipo === "clase"
            ? this.apoderadosFacultades.find((a) => a.id === apoderadoId)
            : this.otrosApoderados.find((a) => a.id === apoderadoId);

        if (apoderado && facultadActual) {
          // Buscar la facultad en el estado local y reemplazarla con la versión actualizada
          const indexFacultad = apoderado.facultades.findIndex((f) => f.id === facultadId);
          if (indexFacultad !== -1) {
            apoderado.facultades[indexFacultad] = facultadActual;
          } else {
            // Si no existe, agregarla (caso poco probable pero por seguridad)
            apoderado.facultades.push(facultadActual);
          }
        }

        // Limpiar estado original después de guardar exitosamente
        this.limpiarEstadoOriginal();
      } catch (error) {
        console.error("Error al actualizar otorgamiento de poder:", error);
        throw error;
      }
    },
  },
});

interface State {
  tipoFacultades: TipoFacultad[];
  apoderadosFacultades: ApoderadoFacultad[];
  otrosApoderados: ApoderadoFacultad[];
  apoderadosFacultadesOriginal: ApoderadoFacultad[] | null;
  otrosApoderadosOriginal: ApoderadoFacultad[] | null;
  clasesApoderadosDisponibles: Array<{
    id: string;
    nombre: string;
    cantidadApoderados: number;
  }>;
}
