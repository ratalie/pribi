import { onMounted } from "vue";
import { useAcuerdosSocietariosStore } from "../stores/useAcuerdosSocietariosStore";

export const useAcuerdosSocietariosController = (societyId: string) => {
  const acuerdosSocietariosStore = useAcuerdosSocietariosStore();

  const handleEstatutosFileUpdate = (newFile: File | null) => {
    if (societyId) {
      acuerdosSocietariosStore.uploadEstatutosFile(societyId, newFile);
    }
  };

  const handleConvenioAccionistasFileUpdate = (newFile: File | null) => {
    if (societyId) {
      acuerdosSocietariosStore.uploadAccionistasFile(societyId, newFile);
    }
  };

  const handleAcuerdoTercerosFileUpdate = (newFile: File | null) => {
    if (societyId) {
      acuerdosSocietariosStore.uploadTercerosFile(societyId, newFile);
    }
  };

  onMounted(() => {
    acuerdosSocietariosStore.load(societyId);
  });

  return {
    acuerdosSocietariosStore,
    handleEstatutosFileUpdate,
    handleConvenioAccionistasFileUpdate,
    handleAcuerdoTercerosFileUpdate,
  };
};
