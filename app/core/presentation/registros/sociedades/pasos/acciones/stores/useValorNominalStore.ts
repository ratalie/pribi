import { defineStore } from "pinia";
import {
  GetValorNominalUseCase,
  UpdateValorNominalUseCase,
} from "~/core/hexag/registros/sociedades/application/use-cases";
import { ValorNominalHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories";

// Instancias de casos de uso
const repository = new ValorNominalHttpRepository();
const getUseCase = new GetValorNominalUseCase(repository);
const updateUseCase = new UpdateValorNominalUseCase(repository);

import type { TipoAccionesSociedad } from "~/core/hexag/registros/sociedades/application/dtos/valor-nominal.dto";

export const useValorNominalStore = defineStore("valorNominal", {
  state: () => ({
    valor: 0 as number,
    tipoAccionesSociedad: null as TipoAccionesSociedad,
    loading: false as boolean,
  }),

  actions: {
    /**
     * Carga el valor nominal y tipo de acciones desde el backend.
     * @param profileId ID del perfil de sociedad
     */
    async load(profileId: string) {
      this.loading = true;

      try {
        const result = await getUseCase.execute(profileId);
        this.valor = result.valorNominal;
        this.tipoAccionesSociedad = result.tipoAccionesSociedad ?? null;
      } catch (error) {
        console.error("[ValorNominalStore] Error al cargar valor nominal:", error);
        // En caso de error, mantener el valor actual o dejarlo en 0
        this.valor = 0;
        this.tipoAccionesSociedad = null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Actualiza el valor nominal y tipo de acciones en el backend.
     * @param profileId ID del perfil de sociedad
     * @param nuevoValor Nuevo valor nominal a guardar
     * @param tipoAccionesSociedad Tipo de acciones de la sociedad
     */
    async update(
      profileId: string,
      nuevoValor: number,
      tipoAccionesSociedad?: TipoAccionesSociedad
    ) {
      try {
        await updateUseCase.execute(profileId, {
          valorNominal: nuevoValor,
          tipoAccionesSociedad: tipoAccionesSociedad ?? undefined,
        });
        // Actualizar el valor local después de una actualización exitosa
        this.valor = nuevoValor;
        if (tipoAccionesSociedad !== undefined) {
          this.tipoAccionesSociedad = tipoAccionesSociedad;
        }
      } catch (error) {
        console.error("[ValorNominalStore] Error al actualizar valor nominal:", error);
        throw error;
      }
    },
  },
});
