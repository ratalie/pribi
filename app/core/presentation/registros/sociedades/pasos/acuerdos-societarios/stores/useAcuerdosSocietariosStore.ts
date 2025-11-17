export const useAcuerdosSocietariosStore = defineStore("acuerdos-societarios", {
  state: (): State => ({
    showEstatutosSociales: false,
    estatutosSocialesFile: null,
    showConvenioAccionistas: false,
    convenioAccionistasFile: null,
    showAcuerdoTerceros: false,
    acuerdoTercerosFile: null,
    derechoPreferente: false,
  }),

  actions: {
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
  },
});

interface State {
  showEstatutosSociales: boolean;
  estatutosSocialesFile: File | null;
  showConvenioAccionistas: boolean;
  convenioAccionistasFile: File | null;
  showAcuerdoTerceros: boolean;
  acuerdoTercerosFile: File | null;
  derechoPreferente: boolean;
}
