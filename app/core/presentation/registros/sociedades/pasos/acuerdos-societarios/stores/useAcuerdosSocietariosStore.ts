import { defineStore } from "pinia";
import { GetAcuerdosSocietariosUseCase } from "~/core/hexag/registros/sociedades/pasos/acuerdos-societarios/application";
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
      return this.acuerdoSocietario?.estatutos ?? null;
    },

    accionistasMetadata(): ArchivoMetadata | null {
      return this.acuerdoSocietario?.accionistas ?? null;
    },

    tercerosMetadata(): ArchivoMetadata | null {
      return this.acuerdoSocietario?.terceros ?? null;
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
          this.showEstatutosSociales = !!result.estatutos;
          this.showConvenioAccionistas = !!result.accionistas;
          this.showAcuerdoTerceros = !!result.terceros;
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

        const { fileId, originalName } = uploadResponse.data;

        // Inicializar acuerdoSocietario si no existe
        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
            estatutos: null,
            accionistas: null,
            terceros: null,
          };
        }

        // Actualizar metadata
        this.acuerdoSocietario.archivoEstatutos = fileId;
        this.acuerdoSocietario.estatutos = {
          id: fileId,
          nombre: originalName,
          url: "", // Sin URL por ahora
        };

        // Actualizar UI
        this.showEstatutosSociales = true;
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

        const { fileId, originalName } = uploadResponse.data;

        // Inicializar acuerdoSocietario si no existe
        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
            estatutos: null,
            accionistas: null,
            terceros: null,
          };
        }

        // Actualizar metadata
        this.acuerdoSocietario.archivoAccionistas = fileId;
        this.acuerdoSocietario.accionistas = {
          id: fileId,
          nombre: originalName,
          url: "", // Sin URL por ahora
        };

        // Actualizar UI
        this.showConvenioAccionistas = true;
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

        const { fileId, originalName } = uploadResponse.data;

        // Inicializar acuerdoSocietario si no existe
        if (!this.acuerdoSocietario) {
          this.acuerdoSocietario = {
            derechoPreferencia: false,
            archivoEstatutos: null,
            archivoAccionistas: null,
            archivoTerceros: null,
            estatutos: null,
            accionistas: null,
            terceros: null,
          };
        }

        // Actualizar metadata
        this.acuerdoSocietario.archivoTerceros = fileId;
        this.acuerdoSocietario.terceros = {
          id: fileId,
          nombre: originalName,
          url: "", // Sin URL por ahora
        };

        // Actualizar UI
        this.showAcuerdoTerceros = true;
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
