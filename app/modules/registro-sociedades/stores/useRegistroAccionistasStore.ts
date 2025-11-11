import type { Accionista, AccionistaRow } from "../types/accionistas";

export const useRegistroAccionistasStore = defineStore("registroAccionistas", {
  state: (): State => ({
    accionistas: [],
  }),

  getters: {
    tablaAccionistas(): AccionistaRow[] {
      return this.accionistas.map((accionista) => {
        let nombre = "";
        let tipoAccionista = "";
        let tipoDocumento = "";
        let numeroDocumento = "";

        switch (accionista.tipoAccionista) {
          case "natural":
            nombre = `${accionista.nombre} ${accionista.apellidoPaterno} ${accionista.apellidoMaterno}`;
            tipoAccionista = "Persona Natural";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;

          case "juridica":
            nombre = accionista.razonSocial;
            tipoAccionista = "Persona Jurídica";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;

          case "sucursal":
            nombre = accionista.nombreSucursal;
            tipoAccionista = "Sucursal";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;

          case "sucesiones_indivisas":
            nombre = accionista.razonSocial;
            tipoAccionista = "Sucesiones Indivisas";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;

          case "fideicomisos":
            nombre = accionista.identificacionFideicomiso;
            tipoAccionista = "Fideicomisos";
            tipoDocumento = accionista.tieneRuc ? accionista.tipoDocumento : "-";
            numeroDocumento = accionista.tieneRuc ? accionista.numeroDocumento : "-";
            break;

          case "fondos_inversion":
            nombre = accionista.razonSocial;
            tipoAccionista = "Fondos de Inversión";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;
        }

        return {
          id: accionista.id,
          nombre,
          tipoAccionista,
          tipoDocumento,
          numeroDocumento,
        };
      });
    },
  },
});

interface State {
  accionistas: Accionista[];
}
