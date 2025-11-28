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

export const useValorNominalStore = defineStore("valorNominal", {
  state: () => ({
    valor: 0 as number,
    loading: false as boolean,
  }),

  actions: {
    /**
     * Carga el valor nominal desde el backend.
     * @param profileId ID del perfil de sociedad
     */
    async load(profileId: string) {
      this.loading = true;

      try {
        const result = await getUseCase.execute(profileId);
        this.valor = result;
      } catch (error) {
        console.error("[ValorNominalStore] Error al cargar valor nominal:", error);
        // En caso de error, mantener el valor actual o dejarlo en 0
        this.valor = 0;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Actualiza el valor nominal en el backend.
     * @param profileId ID del perfil de sociedad
     * @param nuevoValor Nuevo valor nominal a guardar
     */
    async update(profileId: string, nuevoValor: number) {
      try {
        await updateUseCase.execute(profileId, {
          valorNominal: nuevoValor,
        });
        // Actualizar el valor local después de una actualización exitosa
        this.valor = nuevoValor;
      } catch (error) {
        console.error("[ValorNominalStore] Error al actualizar valor nominal:", error);
        throw error;
      }
    },
  },
});
