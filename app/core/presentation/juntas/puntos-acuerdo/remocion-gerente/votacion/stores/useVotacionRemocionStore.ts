import { defineStore } from "pinia";
import type {
  PersonaJuridica,
  PersonaNatural,
} from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Store para datos de votación de remoción de gerente
 *
 * Responsabilidades:
 * - Generar texto de votación dinámico con datos del gerente
 */
export const useVotacionRemocionStore = defineStore("votacionRemocion", {
  state: () => ({
    // Estado vacío por ahora, todo se calcula en getters
  }),

  getters: {
    /**
     * Genera el texto de votación para remoción de gerente
     *
     * Usa datos del gerente general del snapshot
     */
    textoVotacion(): string {
      const snapshotStore = useSnapshotStore();
      const gerente = snapshotStore.snapshot?.gerenteGeneral;

      if (!gerente) {
        return "Se aprueba la remoción del gerente general.";
      }

      const nombreGerente = this.getNombreCompletoGerente(gerente.persona);

      return `Se aprueba la remoción del gerente general ${nombreGerente} de sus funciones como gerente general de la sociedad.`;
    },

    /**
     * Obtiene el nombre completo del gerente según su tipo
     */
    getNombreCompletoGerente() {
      return (persona: PersonaNatural | PersonaJuridica): string => {
        if (persona.tipo === "NATURAL") {
          return `${persona.nombre} ${persona.apellidoPaterno} ${
            persona.apellidoMaterno || ""
          }`.trim();
        } else {
          return persona.razonSocial;
        }
      };
    },
  },
});
