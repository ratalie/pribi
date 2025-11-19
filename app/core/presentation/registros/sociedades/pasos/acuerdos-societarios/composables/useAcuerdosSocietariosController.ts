import { onMounted } from "vue";
import { useAcuerdosSocietariosStore } from "../stores/useAcuerdosSocietariosStore";

export const useAcuerdosSocietariosController = (societyId: string) => {
  const acuerdosSocietariosStore = useAcuerdosSocietariosStore();

  onMounted(() => {
    acuerdosSocietariosStore.load(societyId);
  });

  return {
    acuerdosSocietariosStore,
  };
};
