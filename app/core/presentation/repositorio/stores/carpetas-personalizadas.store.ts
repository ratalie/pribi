import { defineStore } from 'pinia';
import {
  ListCarpetasUseCase,
  GetCarpetaDetailUseCase,
  CreateCarpetaUseCase,
  UpdateCarpetaUseCase,
  DeleteCarpetaUseCase,
  AddEnlaceUseCase,
  RemoveEnlaceUseCase,
} from '~/core/hexag/repositorio/carpetas-personalizadas/application';
import type { CarpetaPersonalizada } from '~/core/hexag/repositorio/carpetas-personalizadas/domain/entities/carpeta-personalizada.entity';
import type { EnlaceDocumento } from '~/core/hexag/repositorio/carpetas-personalizadas/domain/entities/enlace-documento.entity';
import type { CreateCarpetaDTO } from '~/core/hexag/repositorio/carpetas-personalizadas/application/dtos/carpeta-personalizada.dto';
import type { CreateEnlaceDTO } from '~/core/hexag/repositorio/carpetas-personalizadas/application/dtos/enlace-documento.dto';
import { CarpetasPersonalizadasHttpRepository } from '~/core/hexag/repositorio/carpetas-personalizadas/infrastructure';

type Status = 'idle' | 'loading' | 'saving' | 'error';

/**
 * Store para Carpetas Personalizadas
 * Usa Option API según las reglas del proyecto
 */
export const useCarpetasPersonalizadasStore = defineStore('carpetas-personalizadas', {
  state: () => ({
    carpetas: [] as CarpetaPersonalizada[],
    carpetaActual: null as CarpetaPersonalizada | null,
    enlacesActuales: [] as EnlaceDocumento[],
    status: 'idle' as Status,
    errorMessage: null as string | null,
    sociedadId: null as string | null,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    isSaving: (state) => state.status === 'saving',
    hasError: (state) => state.status === 'error',
    totalCarpetas: (state) => state.carpetas.length,
  },

  actions: {
    /**
     * Establece la sociedad actual
     */
    setSociedadId(sociedadId: string) {
      this.sociedadId = sociedadId;
    },

    /**
     * Carga la lista de carpetas personalizadas
     */
    async cargarCarpetas(sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new CarpetasPersonalizadasHttpRepository();
        const useCase = new ListCarpetasUseCase(repository);
        const carpetas = await useCase.execute(id);

        this.carpetas = carpetas;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[CarpetasPersonalizadasStore] Error al cargar carpetas:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar las carpetas personalizadas';
      }
    },

    /**
     * Carga el detalle de una carpeta con sus enlaces
     */
    async cargarDetalleCarpeta(carpetaId: string, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new CarpetasPersonalizadasHttpRepository();
        const useCase = new GetCarpetaDetailUseCase(repository);
        const { carpeta, enlaces } = await useCase.execute(id, carpetaId);

        this.carpetaActual = carpeta;
        this.enlacesActuales = enlaces;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[CarpetasPersonalizadasStore] Error al cargar detalle:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar el detalle de la carpeta';
      }
    },

    /**
     * Crea una nueva carpeta personalizada
     */
    async crearCarpeta(dto: CreateCarpetaDTO, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return null;
      }

      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new CarpetasPersonalizadasHttpRepository();
        const useCase = new CreateCarpetaUseCase(repository);
        const carpeta = await useCase.execute(id, dto);

        // Agregar a la lista
        this.carpetas.push(carpeta);
        this.status = 'idle';
        return carpeta;
      } catch (error: any) {
        console.error('[CarpetasPersonalizadasStore] Error al crear carpeta:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos crear la carpeta';
        return null;
      }
    },

    /**
     * Actualiza una carpeta personalizada
     */
    async actualizarCarpeta(carpetaId: string, dto: CreateCarpetaDTO, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return null;
      }

      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new CarpetasPersonalizadasHttpRepository();
        const useCase = new UpdateCarpetaUseCase(repository);
        const carpeta = await useCase.execute(id, carpetaId, dto);

        // Actualizar en la lista
        const index = this.carpetas.findIndex((c) => c.id === carpetaId);
        if (index !== -1) {
          this.carpetas[index] = carpeta;
        }

        // Si es la carpeta actual, actualizarla también
        if (this.carpetaActual?.id === carpetaId) {
          this.carpetaActual = carpeta;
        }

        this.status = 'idle';
        return carpeta;
      } catch (error: any) {
        console.error('[CarpetasPersonalizadasStore] Error al actualizar carpeta:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos actualizar la carpeta';
        return null;
      }
    },

    /**
     * Elimina una carpeta personalizada
     */
    async eliminarCarpeta(carpetaId: string, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new CarpetasPersonalizadasHttpRepository();
        const useCase = new DeleteCarpetaUseCase(repository);
        await useCase.execute(id, carpetaId);

        // Eliminar de la lista
        this.carpetas = this.carpetas.filter((c) => c.id !== carpetaId);

        // Si es la carpeta actual, limpiarla
        if (this.carpetaActual?.id === carpetaId) {
          this.carpetaActual = null;
          this.enlacesActuales = [];
        }

        this.status = 'idle';
      } catch (error: any) {
        console.error('[CarpetasPersonalizadasStore] Error al eliminar carpeta:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos eliminar la carpeta';
      }
    },

    /**
     * Agrega un enlace a la carpeta actual
     */
    async agregarEnlace(dto: CreateEnlaceDTO, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return null;
      }

      if (!this.carpetaActual) {
        this.errorMessage = 'No hay carpeta seleccionada';
        return null;
      }

      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new CarpetasPersonalizadasHttpRepository();
        const useCase = new AddEnlaceUseCase(repository);
        const enlace = await useCase.execute(id, this.carpetaActual.id, dto);

        // Agregar a la lista de enlaces
        this.enlacesActuales.push(enlace);

        // Actualizar total de enlaces en la carpeta
        if (this.carpetaActual) {
          this.carpetaActual.totalEnlaces = this.enlacesActuales.length;
        }

        // Actualizar en la lista de carpetas
        const index = this.carpetas.findIndex((c) => c.id === this.carpetaActual?.id);
        if (index !== -1 && this.carpetaActual) {
          this.carpetas[index] = { ...this.carpetaActual };
        }

        this.status = 'idle';
        return enlace;
      } catch (error: any) {
        console.error('[CarpetasPersonalizadasStore] Error al agregar enlace:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos agregar el enlace';
        return null;
      }
    },

    /**
     * Elimina un enlace de la carpeta actual
     */
    async eliminarEnlace(enlaceId: string, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      if (!this.carpetaActual) {
        this.errorMessage = 'No hay carpeta seleccionada';
        return;
      }

      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new CarpetasPersonalizadasHttpRepository();
        const useCase = new RemoveEnlaceUseCase(repository);
        await useCase.execute(id, this.carpetaActual.id, enlaceId);

        // Eliminar de la lista de enlaces
        this.enlacesActuales = this.enlacesActuales.filter((e) => e.id !== enlaceId);

        // Actualizar total de enlaces en la carpeta
        if (this.carpetaActual) {
          this.carpetaActual.totalEnlaces = this.enlacesActuales.length;
        }

        // Actualizar en la lista de carpetas
        const index = this.carpetas.findIndex((c) => c.id === this.carpetaActual?.id);
        if (index !== -1 && this.carpetaActual) {
          this.carpetas[index] = { ...this.carpetaActual };
        }

        this.status = 'idle';
      } catch (error: any) {
        console.error('[CarpetasPersonalizadasStore] Error al eliminar enlace:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos eliminar el enlace';
      }
    },

    /**
     * Limpia el estado de la carpeta actual
     */
    limpiarCarpetaActual() {
      this.carpetaActual = null;
      this.enlacesActuales = [];
    },
  },
});

