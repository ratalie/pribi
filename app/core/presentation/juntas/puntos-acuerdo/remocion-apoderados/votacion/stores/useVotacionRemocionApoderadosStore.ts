import { defineStore } from "pinia";
import { CreateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/create-vote-session.use-case";
import { GetVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/get-vote-session.use-case";
import { UpdateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/update-vote-session.use-case";
import {
  TipoAcuerdo,
  getTipoAcuerdo,
} from "~/core/hexag/juntas/domain/constants/agenda-classification.constants";
import type { VoteEntry } from "~/core/hexag/juntas/domain/entities/vote-entry.entity";
import type { VoteItem } from "~/core/hexag/juntas/domain/entities/vote-item.entity";
import type { VoteSession } from "~/core/hexag/juntas/domain/entities/vote-session.entity";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { VoteHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/vote.http.repository";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Store para gestionar Votaciones de Remoción de Apoderados
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 * ✅ Soporta MÚLTIPLES items (una votación por cada apoderado a remover)
 */
export const useVotacionRemocionApoderadosStore = defineStore("votacionRemocionApoderados", {
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
     * ✅ Obtiene todos los items de votación (múltiples items)
     */
    items(): VoteItem[] {
      return this.sesionVotacion?.items || [];
    },

    /**
     * ✅ Obtiene el item de votación (para compatibilidad con otros flujos - retorna primer item)
     */
    itemVotacion(): VoteItem | null {
      return this.items[0] || null;
    },

    /**
     * ✅ Obtiene todos los votos del primer item (para compatibilidad)
     */
    votos(): VoteEntry[] {
      return this.itemVotacion?.votos || [];
    },

    /**
     * ✅ Obtiene el voto de un accionista específico para un item específico
     */
    getVotoByAccionistaAndItem:
      (state) =>
      (accionistaId: string, itemIndex: number): VoteEntry | null => {
        const item = state.sesionVotacion?.items[itemIndex];
        if (!item) return null;
        return item.votos.find((v) => v.accionistaId === accionistaId) || null;
      },

    /**
     * ✅ Obtiene el voto de un accionista del primer item (para compatibilidad)
     */
    getVotoByAccionista:
      (state) =>
      (accionistaId: string): VoteEntry | null => {
        return state.sesionVotacion?.items?.[0]?.votos.find((v) => v.accionistaId === accionistaId) || null;
      },

    /**
     * ✅ Obtiene un item por índice
     */
    getItemByIndex: (state) => (index: number): VoteItem | null => {
      return state.sesionVotacion?.items[index] || null;
    },

    /**
     * Indica si es unanimidad (APROBADO_POR_TODOS) - para el primer item
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     */
    esUnanimidad(): boolean {
      return this.itemVotacion?.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS;
    },

    /**
     * Indica si es sometida a votación (SOMETIDO_A_VOTACION) - para el primer item
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     */
    esSometidaAVotacion(): boolean {
      return this.itemVotacion?.tipoAprobacion === VoteAgreementType.SOMETIDO_A_VOTACION;
    },

    /**
     * Calcula el resultado de la votación para un item específico
     *
     * @param puntoId - ID del punto de agenda (ej: "remocion-apoderados")
     * @param itemIndex - Índice del item (pregunta) - por defecto 0
     * @returns Resultado completo de la votación con aprobación, porcentajes, etc.
     */
    getResult: (state) => (puntoId: string, itemIndex: number = 0) => {
      // 1. Obtener snapshot store
      const snapshotStore = useSnapshotStore();

      // 2. Obtener accionistas con derecho a voto
      const accionistasConDerechoVoto = snapshotStore.accionistasConDerechoVoto;

      // 3. Obtener votos del item específico
      const item = state.sesionVotacion?.items[itemIndex];
      const votos = item?.votos || [];

      // 4. Determinar tipo de acuerdo (SIMPLE o CALIFICADO)
      const tipoAcuerdo = getTipoAcuerdo(puntoId);

      // 5. Obtener quorum mínimo requerido (mayorías para acuerdos)
      const quorums = snapshotStore.quorums;
      const quorumMinimoRequerido =
        tipoAcuerdo === TipoAcuerdo.CALIFICADO
          ? quorums?.mayoriasAcuerdosCalificado || 60
          : quorums?.mayoriasAcuerdosSimple || 50;

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
      const porcentajeAFavor =
        totalAccionesConDerechoVoto > 0
          ? (accionesAFavor / totalAccionesConDerechoVoto) * 100
          : 0;

      const porcentajeEnContra =
        totalAccionesConDerechoVoto > 0
          ? (accionesEnContra / totalAccionesConDerechoVoto) * 100
          : 0;

      const porcentajeAbstencion =
        totalAccionesConDerechoVoto > 0
          ? (accionesAbstencion / totalAccionesConDerechoVoto) * 100
          : 0;

      const porcentajeSinVoto =
        totalAccionesConDerechoVoto > 0
          ? (accionesSinVoto / totalAccionesConDerechoVoto) * 100
          : 0;

      // 9. Determinar si está aprobado
      const aprobado = porcentajeAFavor >= quorumMinimoRequerido;

      // 10. Calcular total de acciones que votaron
      const accionesVotantes = accionesAFavor + accionesEnContra + accionesAbstencion;
      const porcentajeVotantes =
        totalAccionesConDerechoVoto > 0
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
          VoteContext.REMOCION_APODERADOS
        );

        // Si no hay sesión (404), es normal - se creará al guardar
        if (!this.sesionVotacion) {
          console.log("[Store][VotacionRemocionApoderados] No hay votación existente, se creará al guardar");
        }

        this.status = "idle";
      } catch (error: any) {
        // Si es 404, no existe la sesión (es normal)
        if (error.statusCode === 404 || error.status === 404) {
          console.log("[Store][VotacionRemocionApoderados] No hay votación existente (404), se creará al guardar");
          this.sesionVotacion = null;
          this.status = "idle";
          return;
        }

        this.status = "error";
        this.errorMessage = error.message || "Error al cargar votación";
        console.error("[Store][VotacionRemocionApoderados] Error al cargar:", error);
        throw error;
      }
    },

    /**
     * ✅ Agregar o actualizar un voto para un item específico
     */
    async addOrUpdateVoteForItem(
      societyId: number,
      flowId: number,
      itemIndex: number,
      accionistaId: string,
      valor: VoteValue | number
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      const item = this.sesionVotacion.items[itemIndex];
      if (!item) {
        throw new Error(`Item ${itemIndex} no existe`);
      }

      const existingVote = item.votos.find((v) => v.accionistaId === accionistaId);

      if (existingVote) {
        // Actualizar voto existente
        await this.updateVote(societyId, flowId, existingVote.id, valor, itemIndex);
      } else {
        // Agregar nuevo voto
        await this.addVote(societyId, flowId, itemIndex, accionistaId, valor);
      }
    },

    /**
     * ✅ Agregar un nuevo voto a un item específico
     */
    async addVote(
      societyId: number,
      flowId: number,
      itemIndex: number,
      accionistaId: string,
      valor: VoteValue | number
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      const item = this.sesionVotacion.items[itemIndex];
      if (!item) {
        throw new Error(`Item ${itemIndex} no existe`);
      }

      const voteId = this.generateUuid();

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        await useCase.execute(societyId, flowId, VoteContext.REMOCION_APODERADOS, [
          {
            accion: "updateVote",
            itemId: item.id,
            votos: [
              {
                accion: "addVote",
                itemId: item.id,
                id: voteId,
                accionistaId: accionistaId,
                value: valor as string | number,
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
        console.error("[Store][VotacionRemocionApoderados] Error al agregar voto:", error);
        throw error;
      }
    },

    /**
     * ✅ Actualizar un voto existente de un item específico
     */
    async updateVote(
      societyId: number,
      flowId: number,
      voteId: string,
      valor: VoteValue | number,
      itemIndex?: number
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      // Si no se especifica itemIndex, buscar en todos los items
      let item: VoteItem | undefined;
      if (itemIndex !== undefined) {
        item = this.sesionVotacion.items[itemIndex];
      } else {
        // Buscar el item que contiene el voto
        for (const it of this.sesionVotacion.items) {
          if (it.votos.some((v) => v.id === voteId)) {
            item = it;
            break;
          }
        }
      }

      if (!item) {
        throw new Error("No se encontró el item que contiene el voto");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        await useCase.execute(societyId, flowId, VoteContext.REMOCION_APODERADOS, [
          {
            accion: "updateVote",
            itemId: item.id,
            votos: [
              {
                accion: "updateVote",
                id: voteId,
                value: valor as string | number,
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
        console.error("[Store][VotacionRemocionApoderados] Error al actualizar voto:", error);
        throw error;
      }
    },

    /**
     * ✅ Agregar un nuevo item de votación
     */
    async addVoteItem(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion?: string,
      tipoAprobacion: VoteAgreementType = VoteAgreementType.SOMETIDO_A_VOTACION,
      orden?: number
    ) {
      if (!this.sesionVotacion) {
        throw new Error("No hay sesión de votación activa");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        const itemOrden = orden !== undefined ? orden : this.sesionVotacion.items.length;
        const itemPayload: any = {
          accion: "add",
          id: itemId,
          orden: itemOrden,
          label,
          descripción: descripcion,
          tipoAprobacion,
          votos: [],
        };

        console.log("[Store][VotacionRemocionApoderados] Agregando item:", JSON.stringify(itemPayload, null, 2));

        await useCase.execute(societyId, flowId, VoteContext.REMOCION_APODERADOS, [itemPayload]);

        // Actualizar estado local
        this.sesionVotacion.items.push({
          id: itemId,
          orden: itemOrden,
          label,
          descripción: descripcion,
          tipoAprobacion,
          votos: [],
        });
      } catch (error: any) {
        console.error("[Store][VotacionRemocionApoderados] Error al agregar item:", error);
        throw error;
      }
    },

    /**
     * ✅ Actualizar tipo de aprobación de un item específico
     */
    async updateTipoAprobacion(
      societyId: number,
      flowId: number,
      itemIndex: number,
      tipoAprobacion: VoteAgreementType
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa o no hay items");
      }

      const item = this.sesionVotacion.items[itemIndex];
      if (!item) {
        throw new Error(`Item ${itemIndex} no existe`);
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        await useCase.execute(societyId, flowId, VoteContext.REMOCION_APODERADOS, [
          {
            accion: "update",
            id: item.id,
            orden: item.orden,
            label: item.label,
            descripción: item.descripción,
            tipoAprobacion,
          },
        ]);

        // Actualizar estado local
        item.tipoAprobacion = tipoAprobacion;
      } catch (error: any) {
        console.error("[Store][VotacionRemocionApoderados] Error al actualizar tipo de aprobación:", error);
        throw error;
      }
    },

    /**
     * ✅ Crear nueva sesión de votación con el primer item
     */
    async createVotacion(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion?: string,
      tipoAprobacion: VoteAgreementType = VoteAgreementType.SOMETIDO_A_VOTACION
    ) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new VoteHttpRepository();
        const useCase = new CreateVoteSessionUseCase(repository);

        // ✅ Usar la sesión que ya está en memoria (con votos si los hay)
        if (!this.sesionVotacion) {
          const sessionId = this.generateUuid();
          const item: VoteItem = {
            id: itemId,
            orden: 0,
            label,
            descripción: descripcion,
            tipoAprobacion,
            votos: [],
          };

          this.sesionVotacion = {
            id: sessionId,
            contexto: VoteContext.REMOCION_APODERADOS,
            modo: VoteMode.SIMPLE,
            items: [item],
          };
        } else {
          // Asegurar que el primer item tenga los datos correctos
          const item = this.sesionVotacion.items[0];
          if (item) {
            item.id = itemId;
            item.label = label;
            item.descripción = descripcion;
            item.tipoAprobacion = tipoAprobacion;
          }
        }

        console.log("[Store][VotacionRemocionApoderados] Creando sesión con datos:", {
          sessionId: this.sesionVotacion.id,
          contexto: this.sesionVotacion.contexto, // ✅ DEBUG: Verificar contexto
          itemId: this.sesionVotacion.items[0]?.id,
          tipoAprobacion: this.sesionVotacion.items[0]?.tipoAprobacion,
          votosCount: this.sesionVotacion.items[0]?.votos.length || 0,
          itemsCount: this.sesionVotacion.items.length,
        });

        // ✅ Validar que el contexto esté presente antes de crear
        if (!this.sesionVotacion.contexto) {
          throw new Error("El contexto de la sesión de votación es requerido");
        }

        await useCase.execute(societyId, flowId, this.sesionVotacion);
        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al crear votación";
        console.error("[Store][VotacionRemocionApoderados] Error al crear:", error);
        throw error;
      }
    },

    /**
     * ✅ Agregar un item de votación con votos en un solo request
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

        const existingItem = this.sesionVotacion.items.find((i) => i.id === itemId);
        const orden = existingItem?.orden ?? this.sesionVotacion.items.length;

        const itemPayload: any = {
          accion: "add",
          id: itemId,
          orden,
          label,
          descripción: descripcion,
          tipoAprobacion,
        };

        if (votos.length > 0) {
          itemPayload.votos = votos.map((voto) => ({
            id: voto.id,
            accionistaId: voto.accionistaId,
            valor: voto.valor,
          }));
        }

        console.log(
          "[Store][VotacionRemocionApoderados] Agregando item con votos:",
          JSON.stringify(itemPayload, null, 2)
        );

        await useCase.execute(societyId, flowId, VoteContext.REMOCION_APODERADOS, [itemPayload]);

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
            orden,
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
        console.error("[Store][VotacionRemocionApoderados] Error al agregar item con votos:", error);
        throw error;
      }
    },

    /**
     * ✅ Actualizar item existente con votos en un solo request
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
      if (!this.sesionVotacion) {
        throw new Error("No hay sesión de votación activa");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        const item = this.sesionVotacion.items.find((i) => i.id === itemId);
        if (!item) {
          throw new Error(`Item ${itemId} no existe`);
        }

        const itemPayload: any = {
          accion: "add", // ✅ Usar "add" porque reemplaza todo el item
          id: itemId,
          orden: item.orden,
          label,
          descripción: descripcion,
          tipoAprobacion,
        };

        if (votos.length > 0) {
          itemPayload.votos = votos.map((voto) => ({
            id: voto.id,
            accionistaId: voto.accionistaId,
            valor: voto.valor,
          }));
        }

        console.log(
          "[Store][VotacionRemocionApoderados] Actualizando item con votos:",
          JSON.stringify(itemPayload, null, 2)
        );

        await useCase.execute(societyId, flowId, VoteContext.REMOCION_APODERADOS, [itemPayload]);

        // Actualizar estado local
        item.label = label;
        item.descripción = descripcion;
        item.tipoAprobacion = tipoAprobacion;
        item.votos = votos.map((v) => ({
          id: v.id,
          accionistaId: v.accionistaId,
          valor: v.valor,
        }));
      } catch (error: any) {
        console.error("[Store][VotacionRemocionApoderados] Error al actualizar item con votos:", error);
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
