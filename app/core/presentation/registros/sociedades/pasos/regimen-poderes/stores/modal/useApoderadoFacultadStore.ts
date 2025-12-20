import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import {
  EntityCoinUIEnum,
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  TipoMontoUIEnum,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { ClasesApoderadoEspecialesEnum } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/enums/ClasesApoderadoEspecialesEnum";
import { useRegimenFacultadesStore } from "../useRegimenFacultadesStore";

export const useApoderadoFacultadStore = defineStore("apoderadoFacultad", {
  state: (): State => ({
    tipoFacultad: "",
    reglasYLimites: false,
    esIrrevocable: false,
    vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
    fechaInicio: "",
    fechaFin: "",
    tipoMoneda: EntityCoinUIEnum.SOLES,
    limiteMonetario: [],
    claseApoderadoIdSeleccionada: null,
    claseFirmanteSeleccionada: null,
    esOtrosApoderados: false,
  }),

  getters: {
    monedaOptions(): BaseSelectOption[] {
      return Object.values(EntityCoinUIEnum).map((moneda) => ({
        id: moneda,
        label: moneda,
        value: moneda,
      }));
    },

    tipoMontoOptions(): BaseSelectOption[] {
      return Object.values(TipoMontoUIEnum).map((tipoMonto) => ({
        id: tipoMonto,
        label: tipoMonto,
        value: tipoMonto,
      }));
    },

    tipoFirmaOptions(): BaseSelectOption[] {
      return Object.values(TipoFirmasUIEnum).map((tipoFirma) => ({
        id: tipoFirma,
        label: tipoFirma,
        value: tipoFirma,
      }));
    },

    /**
     * Indica si debe usarse input libre para la cantidad de firmantes
     * (solo cuando el apoderado principal es "Gerente General")
     */
    usarInputLibreCantidadFirmantes(): boolean {
      if (!this.claseApoderadoIdSeleccionada) {
        return false;
      }

      const regimenStore = useRegimenFacultadesStore();
      const snapshotStore = useSnapshotStore();

      // En contexto de juntas, usar clases del snapshot
      const clasesDelSnapshot = snapshotStore.snapshot?.attorneyClasses || [];
      const usarSnapshot = clasesDelSnapshot.length > 0;

      // Verificar si la clase del APODERADO PRINCIPAL es "Gerente General"
      // Si es así, debe usar input libre para los firmantes
      let claseApoderadoPrincipalNombre: string | undefined;

      if (usarSnapshot) {
        const clase = clasesDelSnapshot.find(
          (c) => c.id === this.claseApoderadoIdSeleccionada
        );
        claseApoderadoPrincipalNombre = clase?.name;
      } else {
        const clase = regimenStore.clasesApoderadosDisponibles.find(
          (c) => c.id === this.claseApoderadoIdSeleccionada
        );
        claseApoderadoPrincipalNombre = clase?.nombre;
      }

      return claseApoderadoPrincipalNombre === ClasesApoderadoEspecialesEnum.GERENTE_GENERAL;
    },

    cantidadFirmantesOptions(): BaseSelectOption[] | null {
      // Si debe usarse input libre (Gerente General), retornar null
      // Acceder al getter como propiedad (los getters de Pinia son propiedades computadas)
      const debeUsarInputLibre = this.usarInputLibreCantidadFirmantes;
      if (debeUsarInputLibre) {
        return null; // null indica que debe usarse input libre
      }

      // Si no hay clase de firmante seleccionada, retornar opciones por defecto (1-10)
      if (!this.claseFirmanteSeleccionada) {
        return Array.from({ length: 10 }, (_, index) => ({
          id: index + 1,
          label: String(index + 1),
          value: index + 1,
        }));
      }

      const regimenStore = useRegimenFacultadesStore();
      const snapshotStore = useSnapshotStore();

      // En contexto de juntas, usar clases del snapshot
      const clasesDelSnapshot = snapshotStore.snapshot?.attorneyClasses || [];
      const usarSnapshot = clasesDelSnapshot.length > 0;

      let cantidadApoderados: number | undefined;

      if (usarSnapshot) {
        // Buscar la clase en el snapshot y contar apoderados de esa clase
        const claseSnapshot = clasesDelSnapshot.find(
          (c) => c.id === this.claseFirmanteSeleccionada
        );
        if (claseSnapshot) {
          // Contar apoderados de esta clase en el snapshot
          const apoderados = snapshotStore.snapshot?.attorneys || [];
          cantidadApoderados = apoderados.filter(
            (a) => a.claseApoderadoId === claseSnapshot.id
          ).length;
        }
      } else {
        // Usar cantidad del store de regimen
      const clase = regimenStore.clasesApoderadosDisponibles.find(
        (c) => c.id === this.claseFirmanteSeleccionada
      );
        cantidadApoderados = clase?.cantidadApoderados;
      }

      if (!cantidadApoderados || cantidadApoderados === 0) {
        // Si no hay cantidad definida, usar opciones por defecto (1-10)
        return Array.from({ length: 10 }, (_, index) => ({
          id: index + 1,
          label: String(index + 1),
          value: index + 1,
        }));
      }

      // Generar opciones desde 1 hasta la cantidad de apoderados de la clase
      return Array.from({ length: cantidadApoderados }, (_, index) => ({
        id: index + 1,
        label: String(index + 1),
        value: index + 1,
      }));
    },

    grupoFirmantesOptions(): BaseSelectOption[] {
      const regimenStore = useRegimenFacultadesStore();
      const snapshotStore = useSnapshotStore();

      // En contexto de juntas, usar clases del snapshot
      const clasesDelSnapshot = snapshotStore.snapshot?.attorneyClasses || [];
      const usarSnapshot = clasesDelSnapshot.length > 0;

      console.log("🔵 [useApoderadoFacultadStore] grupoFirmantesOptions", {
        usarSnapshot,
        clasesDelSnapshotCount: clasesDelSnapshot.length,
        clasesRegimenCount: regimenStore.clasesApoderadosDisponibles.length,
        claseApoderadoIdSeleccionada: this.claseApoderadoIdSeleccionada,
      });

      // Obtener las clases disponibles (del snapshot o del store de regimen)
      let clasesDisponibles: Array<{
        id: string;
        nombre: string;
        cantidadApoderados?: number;
      }>;

      if (usarSnapshot) {
        // Usar clases del snapshot (contexto de juntas)
        clasesDisponibles = clasesDelSnapshot.map((clase) => ({
          id: clase.id,
          nombre: clase.name,
        }));
        console.log(
          "🔵 [useApoderadoFacultadStore] Usando clases del snapshot:",
          clasesDisponibles
        );
      } else {
        // Usar clases del store de regimen (contexto de registro permanente)
        clasesDisponibles = regimenStore.clasesApoderadosDisponibles;
        console.log(
          "🔵 [useApoderadoFacultadStore] Usando clases del store de regimen:",
          clasesDisponibles
        );
      }

      // Si es "Otros Apoderados", mostrar TODAS las clases disponibles (sin filtrar)
      if (this.esOtrosApoderados) {
        return clasesDisponibles.map((clase) => ({
          id: clase.id,
          label: clase.nombre,
          value: clase.id,
        }));
      }

      // Para clases normales, determinar qué filtrar
      const claseSeleccionada = clasesDisponibles.find(
        (c) => c.id === this.claseApoderadoIdSeleccionada
      );
      const esGerenteGeneral =
        claseSeleccionada?.nombre === ClasesApoderadoEspecialesEnum.GERENTE_GENERAL;

      // Si es "Gerente General", mostrar TODAS las clases EXCEPTO "Gerente General" y "Otros Apoderados"
      // (puede tener firma conjunta con cualquier otro cargo, pero no consigo mismo ni con "Otros Apoderados")
      if (esGerenteGeneral) {
        return clasesDisponibles
          .filter(
            (clase) =>
              clase.nombre !== ClasesApoderadoEspecialesEnum.GERENTE_GENERAL &&
              clase.nombre !== ClasesApoderadoEspecialesEnum.OTROS_APODERADOS
          )
          .map((clase) => ({
            id: clase.id,
            label: clase.nombre,
            value: clase.id,
          }));
      }

      // Para otras clases, excluir solo la clase seleccionada (comportamiento normal)
      return clasesDisponibles
        .filter((clase) => clase.id !== this.claseApoderadoIdSeleccionada)
        .map((clase) => ({
          id: clase.id,
          label: clase.nombre,
          value: clase.id,
        }));
    },
  },
});

interface State {
  tipoFacultad: string;
  reglasYLimites: boolean;
  esIrrevocable: boolean;
  vigencia: TiempoVigenciaUIEnum;
  fechaInicio: string;
  fechaFin: string;
  tipoMoneda: EntityCoinUIEnum;
  limiteMonetario: LimiteMonetarioModal[];
  claseApoderadoIdSeleccionada: string | null;
  claseFirmanteSeleccionada: string | null;
  esOtrosApoderados: boolean;
}

export interface LimiteMonetarioModal {
  id: string;
  desde: number;
  tipoMonto: TipoMontoUIEnum;
  hasta: number;
  tipoFirma: TipoFirmasUIEnum;
  firmantes: FirmanteModal[];
}

interface FirmanteModal {
  id: string;
  cantidad: string;
  grupo: string;
}
