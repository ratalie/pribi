import { defineStore } from "pinia";
import {
  GetAcuerdosSocietariosUseCase,
  UpdateAcuerdosSocietariosUseCase,
} from "~/core/hexag/registros/sociedades/pasos/acuerdos-societarios/application";
import type {
  AcuerdoSocietario,
  ArchivoMetadata,
} from "~/core/hexag/registros/sociedades/pasos/acuerdos-societarios/domain";
import { AcuerdosSocietariosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/acuerdos-societarios/infrastructure";
import { UploadFileUseCase } from "~/core/shared/infrastructure/file-storage/application/use-cases/upload-file.use-case";
import { AwsFileStorageRepository } from "~/core/shared/infrastructure/file-storage/infrastructure/repositories/aws-file-storage.repository";

// Instancias de casos de uso
const repository = new AcuerdosSocietariosHttpRepository();
const getUseCase = new GetAcuerdosSocietariosUseCase(repository);
const updateUseCase = new UpdateAcuerdosSocietariosUseCase(repository);

// Instancias de file storage
const fileStorageRepository = new AwsFileStorageRepository();
const uploadFileUseCase = new UploadFileUseCase(fileStorageRepository);

export const useAcuerdosSocietariosStore = defineStore("acuerdos-societarios", {
  state: (): State => ({
    // Estado UI
    showEstatutosSociales: false,
    estatutosSocialesFile: null,
    showConvenioAccionistas: false,
    convenioAccionistasFile: null,
    showAcuerdoTerceros: false,
    acuerdoTercerosFile: null,
    derechoPreferente: false,

    // Estado backend
    acuerdoSocietario: null,
    loading: false,

    // Estados de carga
    estatutosSocialesLoading: false,
    convenioAccionistasLoading: false,
    acuerdoTercerosLoading: false,
  }),

  getters: {
    hasData(): boolean {
      return this.acuerdoSocietario !== null;
    },

    estatutosMetadata(): ArchivoMetadata | null {
      return this.acuerdoSocietario?.archivoEstatutos ?? null;
    },

    accionistasMetadata(): ArchivoMetadata | null {
      return this.acuerdoSocietario?.archivoAccionistas ?? null;
    },

    tercerosMetadata(): ArchivoMetadata | null {
      return this.acuerdoSocietario?.archivoTerceros ?? null;
    },
  },

  actions: {
    // Action backend: cargar datos
    async load(profileId: string) {
      this.loading = true;

      try {
        const result = await getUseCase.execute(profileId);
        this.acuerdoSocietario = result;

        // Si hay datos del backend, actualizar estado UI
        if (result) {
          this.derechoPreferente = result.derechoPreferencia;

          // Actualizar switches según existencia de metadata
          this.showEstatutosSociales = result.archivoEstatutos !== null;
          this.showConvenioAccionistas = result.archivoAccionistas !== null;
          this.showAcuerdoTerceros = result.archivoTerceros !== null;
        }
      } catch (error) {
        console.error(
          "[AcuerdosSocietariosStore] Error al cargar acuerdos societarios:",
          error
        );
        this.acuerdoSocietario = null;
      } finally {
        this.loading = false;
      }
    },

    // Action backend: actualizar acuerdos societarios
    async uploadStep(societyId: string) {
      try {
        await updateUseCase.execute(societyId, {
          archivoEstatutos: this.acuerdoSocietario?.archivoEstatutos?.id ?? null,
          archivoAccionistas: this.acuerdoSocietario?.archivoAccionistas?.id ?? null,
          archivoTerceros: this.acuerdoSocietario?.archivoTerceros?.id ?? null,
          derechoPreferencia: this.derechoPreferente,
        });
      } catch (error) {
        console.error(
          "[AcuerdosSocietariosStore] Error al actualizar acuerdos societarios:",
          error
        );
        throw error;
      }
    },

    // Actions upload: subir archivos
    async uploadEstatutosFile(societyId: string, file: File | null) {
      try {
        this.estatutosSocialesLoading = true;

        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
          };
        }

        if (file) {
          const uploadResponse = await uploadFileUseCase.execute(societyId, file);

          if (!uploadResponse.data) {
            throw new Error("No se recibió data en la respuesta del upload");
          }

          const { fileId, originalName, size } = uploadResponse.data;

          // Actualizar metadata
          this.acuerdoSocietario.archivoEstatutos = {
            id: fileId,
            nombre: originalName,
            size: size,
          };
        } else {
          this.acuerdoSocietario.archivoEstatutos = null;
        }

        await updateUseCase.execute(societyId, {
          archivoEstatutos: this.acuerdoSocietario?.archivoEstatutos?.id ?? null,
          archivoAccionistas: this.acuerdoSocietario?.archivoAccionistas?.id ?? null,
          archivoTerceros: this.acuerdoSocietario?.archivoTerceros?.id ?? null,
          derechoPreferencia: this.derechoPreferente,
        });

        this.estatutosSocialesFile = null;
      } catch (error) {
        console.error(
          "[AcuerdosSocietariosStore] Error al subir archivo de estatutos:",
          error
        );
        this.estatutosSocialesFile = null;
      } finally {
        this.estatutosSocialesLoading = false;
      }
    },

    async uploadAccionistasFile(societyId: string, file: File | null) {
      try {
        this.convenioAccionistasLoading = true;

        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
          };
        }

        if (file) {
          const uploadResponse = await uploadFileUseCase.execute(societyId, file);

          if (!uploadResponse.data) {
            throw new Error("No se recibió data en la respuesta del upload");
          }

          const { fileId, originalName, size } = uploadResponse.data;

          // Actualizar metadata
          this.acuerdoSocietario.archivoAccionistas = {
            id: fileId,
            nombre: originalName,
            size: size,
          };
        } else {
          this.acuerdoSocietario.archivoAccionistas = null;
        }

        await updateUseCase.execute(societyId, {
          archivoEstatutos: this.acuerdoSocietario?.archivoEstatutos?.id ?? null,
          archivoAccionistas: this.acuerdoSocietario?.archivoAccionistas?.id ?? null,
          archivoTerceros: this.acuerdoSocietario?.archivoTerceros?.id ?? null,
          derechoPreferencia: this.derechoPreferente,
        });

        this.convenioAccionistasFile = null;
      } catch (error) {
        console.error(
          "[AcuerdosSocietariosStore] Error al subir archivo de accionistas:",
          error
        );
        this.convenioAccionistasFile = null;
      } finally {
        this.convenioAccionistasLoading = false;
      }
    },

    async uploadTercerosFile(societyId: string, file: File | null) {
      try {
        this.acuerdoTercerosLoading = true;

        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
          };
        }

        if (file) {
          const uploadResponse = await uploadFileUseCase.execute(societyId, file);

          if (!uploadResponse.data) {
            throw new Error("No se recibió data en la respuesta del upload");
          }

          const { fileId, originalName, size } = uploadResponse.data;

          // Actualizar metadata
          this.acuerdoSocietario.archivoTerceros = {
            id: fileId,
            nombre: originalName,
            size: size,
          };
        } else {
          this.acuerdoSocietario.archivoTerceros = null;
        }

        await updateUseCase.execute(societyId, {
          archivoEstatutos: this.acuerdoSocietario?.archivoEstatutos?.id ?? null,
          archivoAccionistas: this.acuerdoSocietario?.archivoAccionistas?.id ?? null,
          archivoTerceros: this.acuerdoSocietario?.archivoTerceros?.id ?? null,
          derechoPreferencia: this.derechoPreferente,
        });

        this.acuerdoTercerosFile = null;
      } catch (error) {
        console.error("[AcuerdosSocietariosStore] Error al subir archivo de terceros:", error);
        this.acuerdoTercerosFile = null;
      } finally {
        this.acuerdoTercerosLoading = false;
      }
    },
  },
});

interface State {
  // Estado UI
  showEstatutosSociales: boolean;
  estatutosSocialesFile: File | null;
  showConvenioAccionistas: boolean;
  convenioAccionistasFile: File | null;
  showAcuerdoTerceros: boolean;
  acuerdoTercerosFile: File | null;
  derechoPreferente: boolean;

  // Estado backend
  acuerdoSocietario: AcuerdoSocietario | null;
  loading: boolean;

  // Estados de carga
  estatutosSocialesLoading: boolean;
  convenioAccionistasLoading: boolean;
  acuerdoTercerosLoading: boolean;
}
