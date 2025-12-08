import { ListAccionistasUseCase } from "~/core/hexag/registros/sociedades/pasos/accionistas/application";
import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure";
import { mapAccionistasDomainToStore } from "~/core/presentation/registros/sociedades/pasos/asignacion-acciones/mappers/accionista-domain-to-store.mapper";
import type { Accionista, AccionistaRow } from "../types/accionistas";
import { TipoAccionistaEnum } from "../types/enums/TipoAccionistaEnum";

const repository = new AccionistasHttpRepository();
const listUseCase = new ListAccionistasUseCase(repository);

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
          case TipoAccionistaEnum.NATURAL:
            nombre = `${accionista.nombre} ${accionista.apellidoPaterno} ${accionista.apellidoMaterno}`;
            tipoAccionista = "Persona Natural";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;

          case TipoAccionistaEnum.JURIDICA:
            nombre = accionista.razonSocial;
            tipoAccionista = "Persona Jurídica";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;

          case TipoAccionistaEnum.SUCURSAL:
            nombre = accionista.nombreSucursal;
            tipoAccionista = "Sucursal";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;

          case TipoAccionistaEnum.SUCESIONES_INDIVISAS:
            nombre = accionista.razonSocial;
            tipoAccionista = "Sucesiones Indivisas";
            tipoDocumento = accionista.tipoDocumento;
            numeroDocumento = accionista.numeroDocumento;
            break;

          case TipoAccionistaEnum.FIDEICOMISOS:
            nombre = accionista.identificacionFideicomiso;
            tipoAccionista = "Fideicomisos";
            tipoDocumento = accionista.tieneRuc ? accionista.tipoDocumento : "-";
            numeroDocumento = accionista.tieneRuc ? accionista.numeroDocumento : "-";
            break;

          case TipoAccionistaEnum.FONDOS_INVERSION:
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

  actions: {
    /**
     * Carga los accionistas desde el backend
     * @param profileId ID del perfil de sociedad
     */
    async loadAccionistas(profileId: string) {
      try {
        const accionistasDomain = await listUseCase.execute(profileId);
        const accionistasStore = mapAccionistasDomainToStore(accionistasDomain);
        this.accionistas = accionistasStore;
      } catch (error) {
        console.error("[useRegistroAccionistasStore] Error al cargar accionistas:", error);
        this.accionistas = [];
      }
    },
    agregarAccionista(accionista: Accionista) {
      this.accionistas.push(accionista);
    },

    editarAccionista(idAccionista: string, accionistaActualizado: Accionista) {
      const indiceAccionista = this.accionistas.findIndex(
        (accionista) => accionista.id === idAccionista
      );

      if (indiceAccionista !== -1) {
        this.accionistas[indiceAccionista] = accionistaActualizado;
      } else {
        console.error(`No se encontró accionista con id: ${idAccionista}`);
      }
    },

    eliminarAccionista(idAccionista: string) {
      const accionistasFiltrados = this.accionistas.filter(
        (accionista) => accionista.id !== idAccionista
      );

      this.accionistas = accionistasFiltrados;
    },

    obtenerAccionista(idAccionista: string): Accionista | undefined {
      return this.accionistas.find((accionista) => accionista.id === idAccionista);
    },
  },
});

interface State {
  accionistas: Accionista[];
}
