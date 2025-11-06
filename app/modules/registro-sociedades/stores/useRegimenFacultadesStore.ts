import type { TipoFacultad, TipoFacultadRow } from "../types/facultades";

export const useRegimenFacultadesStore = defineStore("regimenFacultades", {
  state: (): State => ({
    tipoFacultades: [
      { id: "1", tipoFacultades: "Facultades Administrativas" },
      { id: "2", tipoFacultades: "Facultades Bancarias" },
    ],
  }),

  getters: {
    tablaTipoFacultades(): TipoFacultadRow[] {
      return this.tipoFacultades.map((facultad, index) => ({
        id: facultad.id,
        table_id: index + 1,
        tipo_facultades: facultad.tipoFacultades,
        numero_apoderados: 0,
      }));
    },
  },

  actions: {
    agregarTipoFacultad(tipoFacultad: TipoFacultad) {
      this.tipoFacultades.push(tipoFacultad);
    },

    editarTipoFacultad(tipoFacultad: TipoFacultad) {
      const index = this.tipoFacultades.findIndex(
        (facultad) => facultad.id === tipoFacultad.id
      );

      if (index !== -1) {
        this.tipoFacultades[index] = tipoFacultad;
      }
    },

    eliminarTipoFacultad(id: string) {
      this.tipoFacultades = this.tipoFacultades.filter((facultad) => facultad.id !== id);
    },
  },
});

interface State {
  tipoFacultades: TipoFacultad[];
}
