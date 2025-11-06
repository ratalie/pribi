export const useAsignacionAccionesStore = defineStore("asignacionAccionesForm", {
  state: (): AsignacionAcciones => ({
    tipoAccion: "",
    cantidadAccionesSuscritas: 0,
    precioAccion: 0,
    capitalSocial: 0,
    prima: 0,
    totalmentePagado: false,
    porcentajePagado: 0,
    dividendoPasivo: 0,
  }),
});

interface AsignacionAcciones {
  tipoAccion: string;
  cantidadAccionesSuscritas: number;
  precioAccion: number;
  capitalSocial: number;
  prima: number;
  totalmentePagado: boolean;
  porcentajePagado: number;
  dividendoPasivo: number;
}
