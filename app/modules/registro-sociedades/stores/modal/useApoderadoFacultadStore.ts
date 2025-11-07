import { TiemposVigenciaEnum } from "~/types/enums/TiemposVigenciaEnum";

export const useApoderadoFacultadStore = defineStore("apoderadoFacultad", {
  state: () => ({
    tipoFacultad: "",
    showReglasFirmas: false,
    esIrrevocable: false,
    vigencia: TiemposVigenciaEnum.INDEFINIDO,
    fechaInicio: "",
    fechaFin: "",
  }),
});
