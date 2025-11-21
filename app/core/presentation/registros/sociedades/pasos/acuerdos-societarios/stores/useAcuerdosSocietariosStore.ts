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
    // Actions UI
    setEstatutosSocialesFile(file: File) {
      this.estatutosSocialesFile = file;
      this.showEstatutosSociales = true;
    },

    setConvenioAccionistasFile(file: File) {
      this.convenioAccionistasFile = file;
      this.showConvenioAccionistas = true;
    },

    setAcuerdoTercerosFile(file: File) {
      this.acuerdoTercerosFile = file;
      this.showAcuerdoTerceros = true;
    },

    setDerechoPreferente(value: boolean) {
      this.derechoPreferente = value;
    },

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

    // Actions upload: subir archivos
    async uploadEstatutosFile(societyId: string, file: File) {
      try {
        const uploadResponse = await uploadFileUseCase.execute(societyId, file);

        if (!uploadResponse.data) {
          throw new Error("No se recibió data en la respuesta del upload");
        }

        const uploadStep = await updateUseCase.execute(societyId, {
          archivoEstatutos: uploadResponse.data.fileId,
          archivoAccionistas: null,
          archivoTerceros: null,
          derechoPreferencia: this.derechoPreferente,
        });

        if (!uploadStep) {
          throw new Error("No se pudo actualizar los acuerdos societarios");
        }

        const { fileId, originalName, size } = uploadResponse.data;

        // Inicializar acuerdoSocietario si no existe
        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
          };
        }

        // Actualizar metadata
        this.acuerdoSocietario.archivoEstatutos = {
          id: fileId,
          nombre: originalName,
          size: size,
        };
      } catch (error) {
        console.error(
          "[AcuerdosSocietariosStore] Error al subir archivo de estatutos:",
          error
        );
        this.estatutosSocialesFile = null;
      }
    },

    async uploadAccionistasFile(societyId: string, file: File) {
      try {
        const uploadResponse = await uploadFileUseCase.execute(societyId, file);

        if (!uploadResponse.data) {
          throw new Error("No se recibió data en la respuesta del upload");
        }

        const uploadStep = await updateUseCase.execute(societyId, {
          archivoEstatutos: null,
          archivoAccionistas: uploadResponse.data.fileId,
          archivoTerceros: null,
          derechoPreferencia: this.derechoPreferente,
        });

        if (!uploadStep) {
          throw new Error("No se pudo actualizar los acuerdos societarios");
        }

        const { fileId, originalName, size } = uploadResponse.data;

        // Inicializar acuerdoSocietario si no existe
        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
          };
        }

        // Actualizar metadata
        this.acuerdoSocietario.archivoAccionistas = {
          id: fileId,
          nombre: originalName,
          size: size,
        };
      } catch (error) {
        console.error(
          "[AcuerdosSocietariosStore] Error al subir archivo de accionistas:",
          error
        );
        this.convenioAccionistasFile = null;
      }
    },

    async uploadTercerosFile(societyId: string, file: File) {
      try {
        const uploadResponse = await uploadFileUseCase.execute(societyId, file);

        if (!uploadResponse.data) {
          throw new Error("No se recibió data en la respuesta del upload");
        }

        const uploadStep = await updateUseCase.execute(societyId, {
          archivoEstatutos: null,
          archivoAccionistas: null,
          archivoTerceros: uploadResponse.data.fileId,
          derechoPreferencia: this.derechoPreferente,
        });

        if (!uploadStep) {
          throw new Error("No se pudo actualizar los acuerdos societarios");
        }

        const { fileId, originalName, size } = uploadResponse.data;

        // Inicializar acuerdoSocietario si no existe
        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
          };
        }

        // Actualizar metadata
        this.acuerdoSocietario.archivoTerceros = {
          id: fileId,
          nombre: originalName,
          size: size,
        };
      } catch (error) {
        console.error("[AcuerdosSocietariosStore] Error al subir archivo de terceros:", error);
        this.acuerdoTercerosFile = null;
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
}
