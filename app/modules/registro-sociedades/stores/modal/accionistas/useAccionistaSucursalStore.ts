export const useAccionistaSucursalStore = defineStore("accionistaSucursalForm", {
  state: (): AccionistaSucursalState => ({
    tipoDocumento: "",
    numeroDocumento: "",
    nombreSucursal: "",
    partidaRegistral: "",
    sedeRegistral: "",
    domicilioFiscal: "",
    tieneRepresentante: false,
  }),
});

export interface AccionistaSucursalState {
  tipoDocumento: string;
  numeroDocumento: string;
  nombreSucursal: string;
  partidaRegistral: string;
  sedeRegistral: string;
  domicilioFiscal: string;
  tieneRepresentante: boolean;
}
