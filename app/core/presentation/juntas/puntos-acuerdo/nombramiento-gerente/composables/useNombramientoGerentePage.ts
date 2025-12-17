import { computed, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type {
  PersonJuridicDTO,
  PersonNaturalDTO,
} from "~/core/hexag/juntas/application/dtos/designation-attorney.dto";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useNombramientoGerenteStore } from "../stores/useNombramientoGerenteStore";

/**
 * Composable para la página de Nombramiento de Gerente General
 *
 * Responsabilidades:
 * - Cargar datos del gerente (GET - retorna null al inicio)
 * - Manejar formulario de persona natural/jurídica
 * - Crear nuevo gerente general cuando se hace clic en "Siguiente" (POST)
 * - Obtener attorneyClassId de clase "Gerente General" desde snapshot
 */
export function useNombramientoGerentePage() {
  const route = useRoute();
  const nombramientoStore = useNombramientoGerenteStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estado del formulario
  const tipoPersona = ref<"natural" | "juridica">("natural");
  const isLoading = computed(() => nombramientoStore.status === "loading");
  const error = computed(() => nombramientoStore.errorMessage);

  // Datos del formulario - Persona Natural
  const personaNatural = ref({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
  });

  // Datos del formulario - Persona Jurídica
  const personaJuridica = ref({
    seConstituyoEnPeru: true,
    tipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
    paisOrigen: "",
    tieneRepresentante: false,
  });

  // Representante legal (para persona jurídica)
  const representanteLegal = ref({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
  });

  /**
   * Cargar datos del gerente general
   *
   * Flujo:
   * 1. Cargar snapshot (necesario para obtener attorneyClassId y comparar person.id)
   * 2. GET /designation-attorney para verificar si existe un nuevo gerente
   * 3. Si existe → cargar datos en formulario
   * 4. Si NO existe → dejar formulario vacío (se creará con POST cuando el usuario haga clic en "Siguiente")
   */
  async function loadData() {
    try {
      // 1. Cargar snapshot (necesario para obtener attorneyClassId y comparar person.id)
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. GET /designation-attorney para verificar si existe un nuevo gerente
      await nombramientoStore.loadGerente(societyId.value, flowId.value);

      // 3. Si hay gerente designado, cargar datos en el formulario
      if (nombramientoStore.gerenteDesignado) {
        const gerente = nombramientoStore.gerenteDesignado;
        const person = gerente.person;

        console.log("[Composable][NombramientoGerente] Cargando datos del nuevo gerente:", {
          gerenteId: gerente.id,
          personId: person.id,
          tipo: person.type,
        });

        if (person.type === "NATURAL" && person.natural) {
          tipoPersona.value = "natural";
          personaNatural.value = {
            tipoDocumento: person.natural.typeDocument,
            numeroDocumento: person.natural.documentNumber,
            nombre: person.natural.firstName,
            apellidoPaterno: person.natural.lastNamePaternal,
            apellidoMaterno: person.natural.lastNameMaternal || "",
            paisPasaporte: person.natural.issuingCountry || "",
          };
        } else if (person.type === "JURIDIC" && person.juridic) {
          tipoPersona.value = "juridica";
          personaJuridica.value = {
            seConstituyoEnPeru: true, // TODO: Determinar desde datos
            tipoDocumento: person.juridic.typeDocument,
            numeroDocumento: person.juridic.documentNumber,
            razonSocial: person.juridic.businessName,
            nombreComercial: "",
            direccion: "",
            distrito: "",
            provincia: "",
            departamento: "",
            paisOrigen: person.juridic.issuingCountry || "",
            tieneRepresentante: false,
          };
        }
      } else {
        console.log(
          "[Composable][NombramientoGerente] No hay nuevo gerente, formulario vacío (se creará con POST al hacer clic en 'Siguiente')"
        );
      }
    } catch (err: any) {
      console.error("[Composable][NombramientoGerente] Error al cargar datos:", err);
      // No lanzar error, simplemente dejar formulario vacío
    }
  }

  /**
   * Guardar gerente general (POST o PUT según corresponda)
   *
   * Flujo:
   * 1. Si NO hay gerente designado → POST (crear nuevo gerente con datos del formulario)
   * 2. Si YA hay gerente designado → PUT (actualizar gerente existente con datos del formulario)
   */
  async function guardarGerente(): Promise<void> {
    try {
      let person: PersonNaturalDTO | PersonJuridicDTO;

      if (tipoPersona.value === "natural") {
        // Validar campos requeridos
        if (
          !personaNatural.value.tipoDocumento ||
          !personaNatural.value.numeroDocumento ||
          !personaNatural.value.nombre ||
          !personaNatural.value.apellidoPaterno
        ) {
          throw new Error("Por favor, complete todos los campos requeridos");
        }

        // ⚠️ NO incluir campos de cónyuge (no aplica para apoderados/gerentes/directores)
        // Enviar strings vacíos "" cuando no hay datos (no null)
        person = {
          typeDocument: personaNatural.value.tipoDocumento || "",
          documentNumber: personaNatural.value.numeroDocumento || "",
          issuingCountry:
            personaNatural.value.tipoDocumento === "PASAPORTE"
              ? personaNatural.value.paisPasaporte || null
              : null,
          firstName: personaNatural.value.nombre || "",
          lastNamePaternal: personaNatural.value.apellidoPaterno || "",
          lastNameMaternal: personaNatural.value.apellidoMaterno || "",
        };
      } else {
        // Validar campos requeridos
        if (
          !personaJuridica.value.tipoDocumento ||
          !personaJuridica.value.numeroDocumento ||
          !personaJuridica.value.razonSocial
        ) {
          throw new Error("Por favor, complete todos los campos requeridos");
        }

        // ⚠️ NO incluir campos de cónyuge (no aplica para apoderados/gerentes/directores)
        // Enviar strings vacíos "" cuando no hay datos (no null)
        person = {
          typeDocument: personaJuridica.value.tipoDocumento || "",
          documentNumber: personaJuridica.value.numeroDocumento || "",
          issuingCountry: personaJuridica.value.paisOrigen || null,
          businessName: personaJuridica.value.razonSocial || "",
          commercialName: personaJuridica.value.nombreComercial || "",
          address: personaJuridica.value.direccion || "",
          district: personaJuridica.value.distrito || "",
          province: personaJuridica.value.provincia || "",
          department: personaJuridica.value.departamento || "",
          countryOfOrigin: personaJuridica.value.paisOrigen || null,
          representative:
            personaJuridica.value.tieneRepresentante &&
            representanteLegal.value.nombre &&
            representanteLegal.value.apellidoPaterno
              ? {
                  // ⚠️ NO incluir campos de cónyuge en representante
                  typeDocument: representanteLegal.value.tipoDocumento || "",
                  documentNumber: representanteLegal.value.numeroDocumento || "",
                  issuingCountry:
                    representanteLegal.value.tipoDocumento === "PASAPORTE"
                      ? representanteLegal.value.paisPasaporte || null
                      : null,
                  firstName: representanteLegal.value.nombre || "",
                  lastNamePaternal: representanteLegal.value.apellidoPaterno || "",
                  lastNameMaternal: representanteLegal.value.apellidoMaterno || "",
                }
              : null,
        };
      }

      // Verificar si ya existe un nuevo gerente (diferente al del snapshot)
      const tieneNuevoGerente = nombramientoStore.hasGerenteDesignado;

      if (tieneNuevoGerente) {
        // Ya existe un nuevo gerente → PUT (actualizar)
        console.log(
          "[Composable][NombramientoGerente] Ya existe nuevo gerente, actualizando con PUT..."
        );
        await nombramientoStore.updateGerente(societyId.value, flowId.value, person);
      } else {
        // No existe nuevo gerente → POST (crear)
        console.log(
          "[Composable][NombramientoGerente] No existe nuevo gerente, creando con POST..."
        );
        await nombramientoStore.createGerente(societyId.value, flowId.value, person);
      }
    } catch (error: any) {
      console.error("[Composable][NombramientoGerente] Error al guardar gerente:", error);
      throw error;
    }
  }

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  // Recargar al activar (si cambia de ruta y vuelve)
  onActivated(() => {
    if (!snapshotStore.snapshot) {
      loadData();
    }
  });

  return {
    // Estado
    tipoPersona,
    personaNatural,
    personaJuridica,
    representanteLegal,
    isLoading,
    error,
    hasGerenteDesignado: computed(() => nombramientoStore.hasGerenteDesignado),

    // Métodos
    loadData,
    guardarGerente,
  };
}
