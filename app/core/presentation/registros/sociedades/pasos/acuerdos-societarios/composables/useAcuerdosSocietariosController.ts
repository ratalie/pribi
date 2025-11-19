import { onMounted, watch } from "vue";
import { useAcuerdosSocietariosStore } from "../stores/useAcuerdosSocietariosStore";

export const useAcuerdosSocietariosController = (societyId: string) => {
  const acuerdosSocietariosStore = useAcuerdosSocietariosStore();

  onMounted(() => {
    acuerdosSocietariosStore.load(societyId);
  });

  // Watch para detectar cambios en files y hacer upload automático
  watch(
    () => acuerdosSocietariosStore.estatutosSocialesFile,
    (newFile) => {
      if (newFile && societyId) {
        acuerdosSocietariosStore.uploadEstatutosFile(societyId, newFile);
      }
    }
  );

  watch(
    () => acuerdosSocietariosStore.convenioAccionistasFile,
    (newFile) => {
      if (newFile && societyId) {
        console.log("newFile", newFile);
        acuerdosSocietariosStore.uploadAccionistasFile(societyId, newFile);
      }
    }
  );

  watch(
    () => acuerdosSocietariosStore.acuerdoTercerosFile,
    (newFile) => {
      if (newFile && societyId) {
        acuerdosSocietariosStore.uploadTercerosFile(societyId, newFile);
      }
    }
  );

  return {
    acuerdosSocietariosStore,
  };
};
