export const useAsignacionAccionesStore = defineStore("asignacionAccionesForm", {
  state: (): AsignacionAcciones => ({
    tipoAccion: "",
    cantidadAccionesSuscritas: "",
    precioAccion: "",
    capitalSocial: "",
    prima: "",
    totalmentePagado: false,
    porcentajePagado: "",
    dividendoPasivo: "",
  }),
});

interface AsignacionAcciones {
  tipoAccion: string;
  cantidadAccionesSuscritas: string;
  precioAccion: string;
  capitalSocial: string;
  prima: string;
  totalmentePagado: boolean;
  porcentajePagado: string;
  dividendoPasivo: string;
}
