export const useFlowLayoutStore = defineStore("flowLayout", {
  state: () => ({
    isLoading: false,
    onClickNext: () => {},
  }),

  actions: {
    clearValues() {
      this.isLoading = false;
      this.onClickNext = () => {};
    },
  },
});
