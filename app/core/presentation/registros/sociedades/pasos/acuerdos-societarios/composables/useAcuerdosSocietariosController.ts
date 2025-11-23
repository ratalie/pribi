import { onMounted } from "vue";
import { useAcuerdosSocietariosStore } from "../stores/useAcuerdosSocietariosStore";

export const useAcuerdosSocietariosController = (societyId: string) => {
  const acuerdosSocietariosStore = useAcuerdosSocietariosStore();

  const handleEstatutosFileUpdate = (newFile: File | null) => {
    acuerdosSocietariosStore.uploadEstatutosFile(societyId, newFile);
  };

  const handleConvenioAccionistasFileUpdate = (newFile: File | null) => {
    acuerdosSocietariosStore.uploadAccionistasFile(societyId, newFile);
  };

  const handleAcuerdoTercerosFileUpdate = (newFile: File | null) => {
    acuerdosSocietariosStore.uploadTercerosFile(societyId, newFile);
  };

  onMounted(() => {
    acuerdosSocietariosStore.load(societyId);
  });

  useFlowLayoutNext(() => {
    console.log("onClickNext");
  });

  return {
    acuerdosSocietariosStore,
    handleEstatutosFileUpdate,
    handleConvenioAccionistasFileUpdate,
    handleAcuerdoTercerosFileUpdate,
  };
};
