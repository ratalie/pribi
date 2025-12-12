import { defineStore } from "pinia";
import type { VoteSession } from "~/core/hexag/juntas/domain/entities/vote-session.entity";
import type { VoteItem } from "~/core/hexag/juntas/domain/entities/vote-item.entity";
import type { VoteEntry } from "~/core/hexag/juntas/domain/entities/vote-entry.entity";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { GetVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/get-vote-session.use-case";
import { CreateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/create-vote-session.use-case";
import { UpdateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/update-vote-session.use-case";
import { VoteHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/vote.http.repository";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { TipoAcuerdo, getTipoAcuerdo } from "~/core/hexag/juntas/domain/constants/agenda-classification.constants";

/**
 * Store para gestionar Votaciones de Aporte Dinerario
 * 
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useVotacionStore = defineStore("votacion", {
  state: () => ({
    sesionVotacion: null as VoteSession | null,
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Indica si hay una sesión de votación cargada
     */
    hasVotacion(): boolean {
      return this.sesionVotacion !== null;
    },

    /**
     * Obtiene el item de votación (solo hay 1 para aporte dinerario)
     */
    itemVotacion(): VoteItem | null {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        return null;
      }
      const item = this.sesionVotacion.items[0];
      return item ?? null;
    },

    /**
     * Obtiene todos los votos del item
     */
    votos(): VoteEntry[] {
      return this.itemVotacion?.votos || [];
    },

    /**
     * Obtiene el voto de un accionista específico
     */
    getVotoByAccionista: (state) => (accionistaId: string): VoteEntry | null => {
      if (!state.sesionVotacion || state.sesionVotacion.items.length === 0) {
        return null;
      }
      const item = state.sesionVotacion.items[0];
      if (!item) return null;
      return item.votos.find((v) => v.accionistaId === accionistaId) || null;
    },

    /**
     * Indica si es unanimidad (APROBADO_POR_TODOS)
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     */
    esUnanimidad(): boolean {
      return this.itemVotacion?.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS;
    },

    /**
     * Indica si es sometida a votación (SOMETIDO_A_VOTACION)
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     */
    esSometidaAVotacion(): boolean {
      return this.itemVotacion?.tipoAprobacion === VoteAgreementType.SOMETIDO_A_VOTACION;
    },

    /**
     * Calcula el resultado de la votación
     * 
     * @param puntoId - ID del punto de agenda (ej: "aporte-dinerarios")
     * @returns Resultado completo de la votación con aprobación, porcentajes, etc.
     */
    getResult: (state) => (puntoId: string) => {
      // 1. Obtener snapshot store
      const snapshotStore = useSnapshotStore();
      
      // 2. Obtener accionistas con derecho a voto
      const accionistasConDerechoVoto = snapshotStore.accionistasConDerechoVoto;
      
      // 3. Obtener votos del store
      const votos = state.sesionVotacion?.items?.[0]?.votos || [];
      
      // 4. Determinar tipo de acuerdo (SIMPLE o CALIFICADO)
      const tipoAcuerdo = getTipoAcuerdo(puntoId);
      
      // 5. Obtener quorum mínimo requerido (mayorías para acuerdos)
      const quorums = snapshotStore.quorums;
      const quorumMinimoRequerido = tipoAcuerdo === TipoAcuerdo.CALIFICADO
        ? (quorums?.mayoriasAcuerdosCalificado || 60)
        : (quorums?.mayoriasAcuerdosSimple || 50);
      
      // 6. Calcular acciones por tipo de voto
      let accionesAFavor = 0;
      let accionesEnContra = 0;
      let accionesAbstencion = 0;
      let accionesSinVoto = 0;
      
      // Mapa para acceder rápido a acciones por accionista
      const accionesPorAccionista = new Map<string, number>();
      accionistasConDerechoVoto.forEach((acc) => {
        accionesPorAccionista.set(acc.shareholder.id, acc.totalAcciones);
      });
      
      // Calcular acciones por tipo de voto
      votos.forEach((voto) => {
        const acciones = accionesPorAccionista.get(voto.accionistaId) || 0;
        
        if (voto.valor === VoteValue.A_FAVOR) {
          accionesAFavor += acciones;
        } else if (voto.valor === VoteValue.EN_CONTRA) {
          accionesEnContra += acciones;
        } else if (voto.valor === VoteValue.ABSTENCION) {
          accionesAbstencion += acciones;
        }
      });
      
      // Calcular acciones sin voto (accionistas que no votaron)
      accionistasConDerechoVoto.forEach((acc) => {
        const tieneVoto = votos.some((v) => v.accionistaId === acc.shareholder.id);
        if (!tieneVoto) {
          accionesSinVoto += acc.totalAcciones;
        }
      });
      
      // 7. Calcular total de acciones con derecho a voto
      const totalAccionesConDerechoVoto = accionistasConDerechoVoto.reduce(
        (sum, acc) => sum + acc.totalAcciones,
        0
      );
      
      // 8. Calcular porcentajes
      const porcentajeAFavor = totalAccionesConDerechoVoto > 0
        ? (accionesAFavor / totalAccionesConDerechoVoto) * 100
        : 0;
      
      const porcentajeEnContra = totalAccionesConDerechoVoto > 0
        ? (accionesEnContra / totalAccionesConDerechoVoto) * 100
        : 0;
      
      const porcentajeAbstencion = totalAccionesConDerechoVoto > 0
        ? (accionesAbstencion / totalAccionesConDerechoVoto) * 100
        : 0;
      
      const porcentajeSinVoto = totalAccionesConDerechoVoto > 0
        ? (accionesSinVoto / totalAccionesConDerechoVoto) * 100
        : 0;
      
      // 9. Determinar si está aprobado
      const aprobado = porcentajeAFavor >= quorumMinimoRequerido;
      
      // 10. Calcular total de acciones que votaron
      const accionesVotantes = accionesAFavor + accionesEnContra + accionesAbstencion;
      const porcentajeVotantes = totalAccionesConDerechoVoto > 0
        ? (accionesVotantes / totalAccionesConDerechoVoto) * 100
        : 0;
      
      return {
        // Tipo de acuerdo
        tipoAcuerdo,
        quorumMinimoRequerido,
        
        // Totales
        totalAccionesConDerechoVoto,
        accionesVotantes,
        porcentajeVotantes,
        
        // Resultados por tipo de voto
        accionesAFavor,
        accionesEnContra,
        accionesAbstencion,
        accionesSinVoto,
        
        // Porcentajes
        porcentajeAFavor,
        porcentajeEnContra,
        porcentajeAbstencion,
        porcentajeSinVoto,
        
        // Aprobación
        aprobado,
        
        // Detalles adicionales
        totalVotantes: votos.length,
        totalAccionistas: accionistasConDerechoVoto.length,
      };
    },
  },

  actions: {
    /**
     * Cargar sesión de votación desde el backend
     */
    async loadVotacion(societyId: number, flowId: number) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new VoteHttpRepository();
        const useCase = new GetVoteSessionUseCase(repository);
        this.sesionVotacion = await useCase.execute(
          societyId,
          flowId,
          VoteContext.APORTES_DINERARIOS
        );

        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar votación";
        console.error("[Store][Votacion] Error al cargar:", error);
        throw error;
      }
    },

    /**
     * Crear nueva sesión de votación
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     */
    async createVotacion(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion?: string,
      tipoAprobacion: VoteAgreementType = VoteAgreementType.APROBADO_POR_TODOS // ✅ Por defecto: UNANIMIDAD
    ) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new VoteHttpRepository();
        const useCase = new CreateVoteSessionUseCase(repository);

        // ✅ Usar la sesión que ya está en memoria (con votos si los hay)
        if (!this.sesionVotacion) {
          // Si no hay sesión en memoria, crear una nueva
          const sessionId = this.generateUuid();
          const item: VoteItem = {
            id: itemId,
            orden: 0,
            label,
            descripción: descripcion,
            tipoAprobacion,
            votos: [], // Se llenará antes de crear
          };

          this.sesionVotacion = {
            id: sessionId,
            contexto: VoteContext.APORTES_DINERARIOS,
            modo: VoteMode.SIMPLE,
            items: [item],
          };
        } else {
          // Asegurar que el item tenga los datos correctos
          const item = this.sesionVotacion.items[0];
          if (item) {
            item.id = itemId;
            item.label = label;
            item.descripción = descripcion;
            item.tipoAprobacion = tipoAprobacion;
          }
        }

        console.log("[Store][Votacion] Creando sesión con datos:", {
          sessionId: this.sesionVotacion.id,
          itemId: this.sesionVotacion.items[0]?.id,
          tipoAprobacion: this.sesionVotacion.items[0]?.tipoAprobacion,
          votosCount: this.sesionVotacion.items[0]?.votos.length || 0,
        });

        await useCase.execute(societyId, flowId, this.sesionVotacion);
        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al crear votación";
        console.error("[Store][Votacion] Error al crear:", error);
        throw error;
      }
    },

    /**
     * Agregar o actualizar un voto
     */
    async addOrUpdateVote(
      societyId: number,
      flowId: number,
      accionistaId: string,
      valor: VoteValue | number
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      const item = this.sesionVotacion.items[0];
      if (!item) {
        throw new Error("No hay item de votación activo");
      }
      const existingVote = item.votos.find((v) => v.accionistaId === accionistaId);

      if (existingVote) {
        // Actualizar voto existente
        await this.updateVote(societyId, flowId, existingVote.id, valor);
      } else {
        // Agregar nuevo voto
        await this.addVote(societyId, flowId, accionistaId, valor);
      }
    },

    /**
     * Agregar un nuevo voto
     */
    async addVote(
      societyId: number,
      flowId: number,
      accionistaId: string,
      valor: VoteValue | number
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      const item = this.sesionVotacion.items[0];
      if (!item) {
        throw new Error("No hay item de votación activo");
      }
      const voteId = this.generateUuid();

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        await useCase.execute(societyId, flowId, VoteContext.APORTES_DINERARIOS, [
          {
            accion: "updateVote",
            itemId: item.id,
            votos: [
              {
                accion: "addVote",
                itemId: item.id,
                id: voteId,
                accionistaId: accionistaId, // ✅ Backend ahora espera accionistaId (no voterPersonId)
                value: valor as string | number, // ✅ Backend espera "value" cuando es accion: "updateVote"
              },
            ],
          },
        ]);

        // Actualizar estado local
        item.votos.push({
          id: voteId,
          accionistaId,
          valor: valor as string | number,
        });
      } catch (error: any) {
        console.error("[Store][Votacion] Error al agregar voto:", error);
        throw error;
      }
    },

    /**
     * Actualizar un voto existente
     */
    async updateVote(
      societyId: number,
      flowId: number,
      voteId: string,
      valor: VoteValue | number
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      const item = this.sesionVotacion.items[0];
      if (!item) {
        throw new Error("No hay item de votación activo");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        await useCase.execute(societyId, flowId, VoteContext.APORTES_DINERARIOS, [
          {
            accion: "updateVote",
            itemId: item.id,
            votos: [
              {
                accion: "updateVote",
                id: voteId,
                value: valor as string | number, // ✅ Backend espera "value" no "valor"
              },
            ],
          },
        ]);

        // Actualizar estado local
        const vote = item.votos.find((v) => v.id === voteId);
        if (vote) {
          vote.valor = valor as string | number;
        }
      } catch (error: any) {
        console.error("[Store][Votacion] Error al actualizar voto:", error);
        throw error;
      }
    },

    /**
     * Eliminar un voto
     */
    async removeVote(societyId: number, flowId: number, voteId: string) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      const item = this.sesionVotacion.items[0];
      if (!item) {
        throw new Error("No hay item de votación activo");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        await useCase.execute(societyId, flowId, VoteContext.APORTES_DINERARIOS, [
          {
            accion: "updateVote",
            itemId: item.id,
            votos: [
              {
                accion: "removeVote",
                id: voteId,
              },
            ],
          },
        ]);

        // Actualizar estado local
        const index = item.votos.findIndex((v) => v.id === voteId);
        if (index > -1) {
          item.votos.splice(index, 1);
        }
      } catch (error: any) {
        console.error("[Store][Votacion] Error al eliminar voto:", error);
        throw error;
      }
    },

    /**
     * Agregar item de votación a una sesión existente (cuando items: [])
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     * ⚠️ IMPORTANTE: Si es unanimidad, NO enviar votos (o enviar vacío según backend)
     */
    async addVoteItem(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion?: string,
      tipoAprobacion: VoteAgreementType = VoteAgreementType.APROBADO_POR_TODOS
    ) {
      if (!this.sesionVotacion) {
        throw new Error("No hay sesión de votación activa");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        // ✅ Construir payload según tipo de aprobación
        const itemPayload: any = {
          accion: "add",
          id: itemId,
          orden: 0,
          label,
          descripción: descripcion,
          tipoAprobacion,
        };

        // ⚠️ IMPORTANTE: Si es unanimidad, NO enviar votos (o enviar vacío según backend)
        // Por ahora, NO enviamos el campo votos si es unanimidad
        // TODO: Confirmar con backend si debe ser [] o no enviarse
        if (tipoAprobacion === VoteAgreementType.SOMETIDO_A_VOTACION) {
          // Solo para mayoría, enviar votos vacío (se llenarán después)
          itemPayload.votos = [];
        }
        // Si es unanimidad, no enviamos el campo votos

        console.log("[Store][Votacion] Agregando item con payload:", JSON.stringify(itemPayload, null, 2));

        await useCase.execute(
          societyId,
          flowId,
          VoteContext.APORTES_DINERARIOS,
          [itemPayload]
        );

        // Actualizar estado local
        this.sesionVotacion.items.push({
          id: itemId,
          orden: 0,
          label,
          descripción: descripcion,
          tipoAprobacion,
          votos: [],
        });
      } catch (error: any) {
        console.error("[Store][Votacion] Error al agregar item:", error);
        console.error("[Store][Votacion] Error details:", {
          message: error.message,
          statusCode: error.statusCode,
          data: error.data,
        });
        throw error;
      }
    },

    /**
     * Agregar item con votos en un solo request (PUT con accion: "add")
     * ⚠️ IMPORTANTE: Usa "add" porque "update" no crea el item si no existe
     */
    async addVoteItemConVotos(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion: string | undefined,
      tipoAprobacion: VoteAgreementType,
      votos: Array<{ id: string; accionistaId: string; valor: string | number }>
    ) {
      if (!this.sesionVotacion) {
        throw new Error("No hay sesión de votación activa");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        // ✅ Construir payload con item + votos en un solo request
        const itemPayload: any = {
          accion: "add", // ✅ Usar "add" para crear/actualizar el item
          id: itemId,
          orden: 0,
          label,
          descripción: descripcion,
          tipoAprobacion,
        };

        // ✅ Incluir votos si los hay
        // ⚠️ IMPORTANTE: Cuando se usa accion: "add" en el item, los votos usan VoteEntrySchema
        // (sin accion, sin itemId, con accionistaId y valor)
        if (votos.length > 0) {
          itemPayload.votos = votos.map((voto) => ({
            id: voto.id,
            accionistaId: voto.accionistaId, // ✅ Backend espera accionistaId (no voterPersonId)
            valor: voto.valor, // ✅ Backend espera "valor" (no "value") cuando es accion: "add"
          }));
        }

        console.log("[Store][Votacion] Agregando item con votos (un solo request):", JSON.stringify(itemPayload, null, 2));

        await useCase.execute(
          societyId,
          flowId,
          VoteContext.APORTES_DINERARIOS,
          [itemPayload]
        );

        // Actualizar estado local
        const existingItem = this.sesionVotacion.items.find((i) => i.id === itemId);
        if (existingItem) {
          existingItem.label = label;
          existingItem.descripción = descripcion;
          existingItem.tipoAprobacion = tipoAprobacion;
          existingItem.votos = votos.map((v) => ({
            id: v.id,
            accionistaId: v.accionistaId,
            valor: v.valor,
          }));
        } else {
          this.sesionVotacion.items.push({
            id: itemId,
            orden: 0,
            label,
            descripción: descripcion,
            tipoAprobacion,
            votos: votos.map((v) => ({
              id: v.id,
              accionistaId: v.accionistaId,
              valor: v.valor,
            })),
          });
        }
      } catch (error: any) {
        console.error("[Store][Votacion] Error al agregar item con votos:", error);
        throw error;
      }
    },

    /**
     * Actualizar item existente con votos en un solo request (PUT con accion: "add")
     * ⚠️ IMPORTANTE: Usa "add" porque reemplaza todo el item (según diagnóstico del backend)
     */
    async updateItemConVotos(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion: string | undefined,
      tipoAprobacion: VoteAgreementType,
      votos: Array<{ id: string; accionistaId: string; valor: string | number }>
    ) {
      if (!this.sesionVotacion || !this.itemVotacion) {
        throw new Error("No hay sesión de votación activa o no hay item");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        // ✅ Construir payload con item + votos en un solo request
        // ⚠️ IMPORTANTE: Usar "add" porque según el diagnóstico, "update" no funciona si el item no existe
        // Y "add" puede reemplazar/actualizar el item existente
        const itemPayload: any = {
          accion: "add", // ✅ Usar "add" para reemplazar/actualizar el item
          id: itemId,
          orden: 0,
          label,
          descripción: descripcion,
          tipoAprobacion,
        };

        // ✅ Incluir votos si los hay
        // ⚠️ IMPORTANTE: Cuando se usa accion: "add" en el item, los votos usan VoteEntrySchema
        // (sin accion, sin itemId, con accionistaId y valor)
        if (votos.length > 0) {
          itemPayload.votos = votos.map((voto) => ({
            id: voto.id,
            accionistaId: voto.accionistaId, // ✅ Backend espera accionistaId (no voterPersonId)
            valor: voto.valor, // ✅ Backend espera "valor" (no "value") cuando es accion: "add"
          }));
        }

        console.log("[Store][Votacion] Actualizando item con votos (un solo request):", JSON.stringify(itemPayload, null, 2));

        await useCase.execute(
          societyId,
          flowId,
          VoteContext.APORTES_DINERARIOS,
          [itemPayload]
        );

        // Actualizar estado local
        const item = this.itemVotacion;
        item.label = label;
        item.descripción = descripcion;
        item.tipoAprobacion = tipoAprobacion;
        item.votos = votos.map((v) => ({
          id: v.id,
          accionistaId: v.accionistaId,
          valor: v.valor,
        }));
      } catch (error: any) {
        console.error("[Store][Votacion] Error al actualizar item con votos:", error);
        throw error;
      }
    },

    /**
     * Actualizar tipo de aprobación (unanimidad/sometida a votación)
     * ⚠️ DEPRECATED: Usar updateItemConVotos en su lugar para enviar todo en un solo request
     */
    async updateTipoAprobacion(
      societyId: number,
      flowId: number,
      tipoAprobacion: VoteAgreementType
    ) {
      if (!this.sesionVotacion || !this.itemVotacion) {
        throw new Error("No hay sesión de votación activa o no hay item");
      }

      const item = this.itemVotacion;

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        // ✅ Usar accion: 'update' con tipoAprobacion en el item
        await useCase.execute(
          societyId,
          flowId,
          VoteContext.APORTES_DINERARIOS,
          [
            {
              accion: "update",
              id: item.id,
              orden: item.orden,
              label: item.label,
              descripción: item.descripción,
              tipoAprobacion, // ✅ AQUÍ, en el item con accion: 'update'
            },
          ]
        );

        // Actualizar estado local
        item.tipoAprobacion = tipoAprobacion;
      } catch (error: any) {
        console.error("[Store][Votacion] Error al actualizar tipo de aprobación:", error);
        throw error;
      }
    },

    /**
     * Generar UUID
     */
    generateUuid(): string {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    },

    /**
     * Resetear estado
     */
    reset() {
      this.sesionVotacion = null;
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});

