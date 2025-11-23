import { useFlowLayoutStore } from "~/stores/useFlowLayoutStore";

type FlowNextHandler = (() => void) | (() => Promise<void>);

export const useFlowLayoutNext = (handleNext: FlowNextHandler) => {
  const flowLayoutStore = useFlowLayoutStore();

  onMounted(() => {
    flowLayoutStore.onClickNext = async () => {
      try {
        flowLayoutStore.isLoading = true;
        await handleNext();
      } catch (error) {
        console.error(error);
      } finally {
        flowLayoutStore.isLoading = false;
      }
    };
  });

  onUnmounted(() => {
    flowLayoutStore.clearValues();
  });
};
