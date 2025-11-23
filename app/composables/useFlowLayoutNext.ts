import { useFlowLayoutStore } from "~/stores/useFlowLayoutStore";

type FlowNextHandler = (() => void) | (() => Promise<void>);

export const useFlowLayoutNext = (handleNext: FlowNextHandler) => {
  const flowLayoutStore = useFlowLayoutStore();
  const progressNavbarStore = useProgressNavbarStore();
  const router = useRouter();
  const route = useRoute();

  onMounted(() => {
    flowLayoutStore.onClickNext = async () => {
      try {
        flowLayoutStore.isLoading = true;
        await handleNext();

        // navegamos al siguiente paso
        const nextStep = progressNavbarStore.getNextStepByCurrentStep(route.path);

        if (nextStep) {
          router.push(nextStep.route);
        }
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
