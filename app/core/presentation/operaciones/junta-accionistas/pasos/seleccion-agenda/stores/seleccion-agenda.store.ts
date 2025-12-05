/**
 * Store: Selección de Agenda
 * 
 * Gestiona el estado de selección de puntos de agenda.
 * OBLIGATORIO: Option API (NO Composition API)
 */

import { defineStore } from "pinia";
import { CreateSeleccionAgendaUseCase } from "@hexag/juntas/pasos/seleccion-agenda/application/use-cases/create-seleccion-agenda.use-case";
import { GetSeleccionAgendaUseCase } from "@hexag/juntas/pasos/seleccion-agenda/application/use-cases/get-seleccion-agenda.use-case";
import { UpdateSeleccionAgendaUseCase } from "@hexag/juntas/pasos/seleccion-agenda/application/use-cases/update-seleccion-agenda.use-case";
import { SeleccionAgendaHttpRepository } from "@hexag/juntas/pasos/seleccion-agenda/infrastructure/repositories/seleccion-agenda.http.repository";
import type { SeleccionAgendaEntity } from "@hexag/juntas/pasos/seleccion-agenda/domain/entities/seleccion-agenda.entity";

// Instanciar repositorio y use cases
const repository = new SeleccionAgendaHttpRepository();
const createUseCase = new CreateSeleccionAgendaUseCase(repository);
const getUseCase = new GetSeleccionAgendaUseCase(repository);
const updateUseCase = new UpdateSeleccionAgendaUseCase(repository);

export const useSeleccionAgendaStore = defineStore("seleccionAgenda", {
  state: () => ({
    seleccion: null as SeleccionAgendaEntity | null,
    puntosSeleccionados: [] as string[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasPuntosSeleccionados: (state) => state.puntosSeleccionados.length > 0,
    totalPuntosSeleccionados: (state) => state.puntosSeleccionados.length,
    isPuntoSeleccionado: (state) => (puntoId: string) => {
      return state.puntosSeleccionados.includes(puntoId);
    },
  },

  actions: {
    /**
     * Toggle de un punto de agenda
     */
    togglePunto(puntoId: string) {
      const index = this.puntosSeleccionados.indexOf(puntoId);
      if (index > -1) {
        // Ya está seleccionado, remover
        this.puntosSeleccionados.splice(index, 1);
      } else {
        // No está seleccionado, agregar
        this.puntosSeleccionados.push(puntoId);
      }
    },

    /**
     * Cargar selección existente
     */
    async loadSeleccion(juntaId: string) {
      this.loading = true;
      this.error = null;

      try {
        this.seleccion = await getUseCase.execute(juntaId);
        
        if (this.seleccion && Array.isArray(this.seleccion.puntosSeleccionados)) {
          this.puntosSeleccionados = [...this.seleccion.puntosSeleccionados];
        } else {
          // Si no hay selección o no es array, inicializar vacío
          this.puntosSeleccionados = [];
        }
      } catch (err: any) {
        this.error = err.message;
        console.error("[SeleccionAgendaStore] Error al cargar:", err);
        // Si hay error (404, etc), inicializar vacío
        this.puntosSeleccionados = [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Guardar selección
     */
    async saveSeleccion(juntaId: string) {
      this.loading = true;
      this.error = null;

      try {
        if (this.seleccion && this.seleccion.id) {
          // Ya existe, actualizar
          this.seleccion = await updateUseCase.execute(this.seleccion.id, {
            puntosSeleccionados: this.puntosSeleccionados,
          });
        } else {
          // No existe, crear
          this.seleccion = await createUseCase.execute(juntaId, {
            puntosSeleccionados: this.puntosSeleccionados,
          });
        }
      } catch (err: any) {
        this.error = err.message;
        console.error("[SeleccionAgendaStore] Error al guardar:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Resetear estado
     */
    reset() {
      this.seleccion = null;
      this.puntosSeleccionados = [];
      this.loading = false;
      this.error = null;
    },
  },
});

