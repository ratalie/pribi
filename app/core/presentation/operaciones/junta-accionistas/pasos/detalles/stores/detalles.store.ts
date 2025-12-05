/**
 * Store: Detalles de Junta (Option API)
 */

import { defineStore } from "pinia";
import { CreateDetallesJuntaUseCase } from "@hexag/juntas/pasos/detalles/application/use-cases/create-detalles-junta.use-case";
import { GetDetallesJuntaUseCase } from "@hexag/juntas/pasos/detalles/application/use-cases/get-detalles-junta.use-case";
import { UpdateDetallesJuntaUseCase } from "@hexag/juntas/pasos/detalles/application/use-cases/update-detalles-junta.use-case";
import { DetallesJuntaHttpRepository } from "@hexag/juntas/pasos/detalles/infrastructure/repositories/detalles-junta.http.repository";
import type { DetallesJuntaEntity } from "@hexag/juntas/pasos/detalles/domain/entities/detalles-junta.entity";

const repository = new DetallesJuntaHttpRepository();
const createUseCase = new CreateDetallesJuntaUseCase(repository);
const getUseCase = new GetDetallesJuntaUseCase(repository);
const updateUseCase = new UpdateDetallesJuntaUseCase(repository);

export const useDetallesStore = defineStore("detallesJunta", {
  state: () => ({
    detalles: null as DetallesJuntaEntity | null,
    tipoJunta: "GENERAL" as "GENERAL" | "ESPECIAL" | "UNIVERSAL",
    modoRealizacion: "PRESENCIAL" as "PRESENCIAL" | "VIRTUAL" | "MIXTA",
    fechaJunta: "",
    horaJunta: "",
    lugarJunta: "",
    enlaceVirtual: "",
    observaciones: "",
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasDetalles: (state) => state.detalles !== null,
    isVirtual: (state) => state.modoRealizacion === "VIRTUAL" || state.modoRealizacion === "MIXTA",
    isPresencial: (state) => state.modoRealizacion === "PRESENCIAL" || state.modoRealizacion === "MIXTA",
  },

  actions: {
    async loadDetalles(juntaId: string) {
      this.loading = true;
      this.error = null;

      try {
        this.detalles = await getUseCase.execute(juntaId);
        
        if (this.detalles) {
          this.tipoJunta = this.detalles.tipoJunta;
          this.modoRealizacion = this.detalles.modoRealizacion;
          this.fechaJunta = this.detalles.fechaJunta.toISOString().split('T')[0] || "";
          this.horaJunta = this.detalles.horaJunta;
          this.lugarJunta = this.detalles.lugarJunta || "";
          this.enlaceVirtual = this.detalles.enlaceVirtual || "";
          this.observaciones = this.detalles.observaciones || "";
        }
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async saveDetalles(juntaId: string) {
      this.loading = true;
      this.error = null;

      try {
        const data = {
          tipoJunta: this.tipoJunta,
          modoRealizacion: this.modoRealizacion,
          fechaJunta: this.fechaJunta,
          horaJunta: this.horaJunta,
          lugarJunta: this.lugarJunta,
          enlaceVirtual: this.enlaceVirtual,
          observaciones: this.observaciones,
        };

        if (this.detalles) {
          this.detalles = await updateUseCase.execute(this.detalles.id, data);
        } else {
          this.detalles = await createUseCase.execute(juntaId, data);
        }
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.$reset();
    },
  },
});

