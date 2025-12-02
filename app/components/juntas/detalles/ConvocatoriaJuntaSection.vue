<template>
  <section id="convocatoria" class="flex flex-col gap-5">
    <TitleH4
      title="Convocatoria"
      subtitle="Indica el lugar, fecha y hora de realización de la primera convocatoría"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <!-- JUNTA UNIVERSAL: Solo 1 detalle -->
    <template v-if="tipoJunta === TipoJunta.UNIVERSAL">
      <ConvocatoriaCard
        title="Detalles de la Junta"
        subtitle="Indica el lugar, fecha y hora de realización de la junta"
        prefix="detalle"
        :modo="detalleModo"
        :direccion="detalleDireccion"
        :fecha="detalleFecha"
        :hora="detalleHora"
        @update:modo="detalleModo = $event"
        @update:direccion="detalleDireccion = $event"
        @update:fecha="detalleFecha = $event"
        @update:hora="detalleHora = $event"
      />
    </template>

    <!-- JUNTA GENERAL: 2 Convocatorias -->
    <template v-else>
      <!-- Primera Convocatoria -->
      <ConvocatoriaCard
        title="Primera Convocatoria"
        subtitle="Indica el lugar, fecha y hora de realización de la primera convocatoría"
        prefix="primera"
        :modo="primeraModo"
        :direccion="primeraDireccion"
        :fecha="primeraFecha"
        :hora="primeraHora"
        :show-info-banner="true"
        info-banner-text="El plazo entre convocatoria y junta es de 3 días calendarios"
        :is-primera-convocatoria="true"
        @update:modo="primeraModo = $event"
        @update:direccion="primeraDireccion = $event"
        @update:fecha="primeraFecha = $event"
        @update:hora="primeraHora = $event"
      />

      <!-- Segunda Convocatoria -->
      <ConvocatoriaCard
        title="Segunda Convocatoria"
        subtitle="Indica el lugar, fecha y hora de realización de la segunda convocatoría"
        prefix="segunda"
        :modo="segundaModo"
        :direccion="segundaDireccion"
        :fecha="segundaFecha"
        :hora="segundaHora"
        :show-info-banner="true"
        info-banner-text="El plazo para la segunda convocatoria es de 3 a 10 días calendarios"
        :is-segunda-convocatoria="true"
        @update:modo="segundaModo = $event"
        @update:direccion="segundaDireccion = $event"
        @update:fecha="segundaFecha = $event"
        @update:hora="segundaHora = $event"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TitleH4 from '~/components/titles/TitleH4.vue';
import ConvocatoriaCard from './ConvocatoriaCard.vue';
import Titles from '~/types/enums/Titles.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { ModoReunion } from '~/core/hexag/juntas/domain/enums/modo-reunion.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';

const store = useMeetingDetailsStore();

const tipoJunta = computed(() => store.meetingDetails?.tipoJunta || TipoJunta.GENERAL);

// Helper para crear convocatoria si no existe
const ensureConvocatoria = (tipo: 'primera' | 'segunda' | 'detalle') => {
  if (!store.meetingDetails) {
    store.meetingDetails = {
      tipoJunta: tipoJunta.value,
      esAnualObligatoria: false,
      presidenteAsistio: false,
      secretarioAsistio: false,
    };
  }

  // ⚠️ IMPORTANTE: Para JUNTA_UNIVERSAL, NO crear segundaConvocatoria
  if (tipo === 'segunda' && tipoJunta.value === TipoJunta.UNIVERSAL) {
    console.warn('⚠️ [ConvocatoriaJuntaSection] Intento de crear segundaConvocatoria en Junta Universal, ignorado');
    return;
  }

  if (tipo === 'primera' && !store.meetingDetails.primeraConvocatoria) {
    store.meetingDetails.primeraConvocatoria = {
      direccion: '',
      modo: ModoReunion.PRESENCIAL,
      fecha: new Date(),
      hora: new Date(),
    };
  }

  // Solo crear segundaConvocatoria si es GENERAL
  if (tipo === 'segunda' && tipoJunta.value === TipoJunta.GENERAL && !store.meetingDetails.segundaConvocatoria) {
    store.meetingDetails.segundaConvocatoria = {
      direccion: '',
      modo: ModoReunion.PRESENCIAL,
      fecha: new Date(),
      hora: new Date(),
    };
  }

  // Para junta universal, usar primeraConvocatoria como "detalle"
  if (tipo === 'detalle' && tipoJunta.value === TipoJunta.UNIVERSAL && !store.meetingDetails.primeraConvocatoria) {
    store.meetingDetails.primeraConvocatoria = {
      direccion: '',
      modo: ModoReunion.PRESENCIAL,
      fecha: new Date(),
      hora: new Date(),
    };
  }
};

// Computed properties para primera convocatoria
const primeraModo = computed({
  get: () => {
    ensureConvocatoria('primera');
    return store.meetingDetails?.primeraConvocatoria?.modo || ModoReunion.PRESENCIAL;
  },
  set: (value: ModoReunion) => {
    ensureConvocatoria('primera');
    if (store.meetingDetails?.primeraConvocatoria) {
      // ⚠️ Usar patchMeetingDetails para mantener reactividad
      store.patchMeetingDetails({
        primeraConvocatoria: {
          ...store.meetingDetails.primeraConvocatoria,
          modo: value,
        },
      });
    }
  },
});

const primeraDireccion = computed({
  get: () => {
    ensureConvocatoria('primera');
    return store.meetingDetails?.primeraConvocatoria?.direccion || '';
  },
  set: (value: string) => {
    ensureConvocatoria('primera');
    if (store.meetingDetails?.primeraConvocatoria) {
      store.patchMeetingDetails({
        primeraConvocatoria: {
          ...store.meetingDetails.primeraConvocatoria,
          direccion: value,
        },
      });
    }
  },
});

const primeraFecha = computed({
  get: () => {
    ensureConvocatoria('primera');
    const fecha = store.meetingDetails?.primeraConvocatoria?.fecha;
    if (!fecha) return '';
    // Convertir Date a string formato YYYY-MM-DD para input type="date"
    return fecha.toISOString().split('T')[0];
  },
  set: (value: string) => {
    if (!value) return;
    ensureConvocatoria('primera');
    if (store.meetingDetails?.primeraConvocatoria) {
      store.patchMeetingDetails({
        primeraConvocatoria: {
          ...store.meetingDetails.primeraConvocatoria,
          fecha: new Date(value),
        },
      });
    }
  },
});

const primeraHora = computed({
  get: () => {
    ensureConvocatoria('primera');
    const hora = store.meetingDetails?.primeraConvocatoria?.hora;
    if (!hora) return '';
    // Convertir Date a string formato HH:mm para input type="time"
    const hours = hora.getHours().toString().padStart(2, '0');
    const minutes = hora.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  set: (value: string) => {
    if (!value) return;
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0);

    ensureConvocatoria('primera');
    if (store.meetingDetails?.primeraConvocatoria) {
      store.patchMeetingDetails({
        primeraConvocatoria: {
          ...store.meetingDetails.primeraConvocatoria,
          hora: date,
        },
      });
    }
  },
});

// Computed properties para segunda convocatoria (similar a primera)
const segundaModo = computed({
  get: () => {
    ensureConvocatoria('segunda');
    return store.meetingDetails?.segundaConvocatoria?.modo || ModoReunion.PRESENCIAL;
  },
  set: (value: ModoReunion) => {
    ensureConvocatoria('segunda');
    if (store.meetingDetails?.segundaConvocatoria) {
      store.patchMeetingDetails({
        segundaConvocatoria: {
          ...store.meetingDetails.segundaConvocatoria,
          modo: value,
        },
      });
    }
  },
});

const segundaDireccion = computed({
  get: () => {
    ensureConvocatoria('segunda');
    return store.meetingDetails?.segundaConvocatoria?.direccion || '';
  },
  set: (value: string) => {
    ensureConvocatoria('segunda');
    if (store.meetingDetails?.segundaConvocatoria) {
      store.patchMeetingDetails({
        segundaConvocatoria: {
          ...store.meetingDetails.segundaConvocatoria,
          direccion: value,
        },
      });
    }
  },
});

const segundaFecha = computed({
  get: () => {
    ensureConvocatoria('segunda');
    const fecha = store.meetingDetails?.segundaConvocatoria?.fecha;
    if (!fecha) return '';
    return fecha.toISOString().split('T')[0];
  },
  set: (value: string) => {
    if (!value) return;
    ensureConvocatoria('segunda');
    if (store.meetingDetails?.segundaConvocatoria) {
      store.patchMeetingDetails({
        segundaConvocatoria: {
          ...store.meetingDetails.segundaConvocatoria,
          fecha: new Date(value),
        },
      });
    }
  },
});

const segundaHora = computed({
  get: () => {
    ensureConvocatoria('segunda');
    const hora = store.meetingDetails?.segundaConvocatoria?.hora;
    if (!hora) return '';
    const hours = hora.getHours().toString().padStart(2, '0');
    const minutes = hora.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  set: (value: string) => {
    if (!value) return;
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0);

    ensureConvocatoria('segunda');
    if (store.meetingDetails?.segundaConvocatoria) {
      store.patchMeetingDetails({
        segundaConvocatoria: {
          ...store.meetingDetails.segundaConvocatoria,
          hora: date,
        },
      });
    }
  },
});

// Computed properties para detalle (junta universal - usa primeraConvocatoria)
const detalleModo = computed({
  get: () => {
    ensureConvocatoria('detalle');
    return store.meetingDetails?.primeraConvocatoria?.modo || ModoReunion.PRESENCIAL;
  },
  set: (value: ModoReunion) => {
    ensureConvocatoria('detalle');
    if (store.meetingDetails?.primeraConvocatoria) {
      store.patchMeetingDetails({
        primeraConvocatoria: {
          ...store.meetingDetails.primeraConvocatoria,
          modo: value,
        },
      });
    }
  },
});

const detalleDireccion = computed({
  get: () => {
    ensureConvocatoria('detalle');
    return store.meetingDetails?.primeraConvocatoria?.direccion || '';
  },
  set: (value: string) => {
    ensureConvocatoria('detalle');
    if (store.meetingDetails?.primeraConvocatoria) {
      store.patchMeetingDetails({
        primeraConvocatoria: {
          ...store.meetingDetails.primeraConvocatoria,
          direccion: value,
        },
      });
    }
  },
});

const detalleFecha = computed({
  get: () => {
    ensureConvocatoria('detalle');
    const fecha = store.meetingDetails?.primeraConvocatoria?.fecha;
    if (!fecha) return '';
    return fecha.toISOString().split('T')[0];
  },
  set: (value: string) => {
    if (!value) return;
    ensureConvocatoria('detalle');
    if (store.meetingDetails?.primeraConvocatoria) {
      store.patchMeetingDetails({
        primeraConvocatoria: {
          ...store.meetingDetails.primeraConvocatoria,
          fecha: new Date(value),
        },
      });
    }
  },
});

const detalleHora = computed({
  get: () => {
    ensureConvocatoria('detalle');
    const hora = store.meetingDetails?.primeraConvocatoria?.hora;
    if (!hora) return '';
    const hours = hora.getHours().toString().padStart(2, '0');
    const minutes = hora.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  set: (value: string) => {
    if (!value) return;
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0);

    ensureConvocatoria('detalle');
    if (store.meetingDetails?.primeraConvocatoria) {
      store.patchMeetingDetails({
        primeraConvocatoria: {
          ...store.meetingDetails.primeraConvocatoria,
          hora: date,
        },
      });
    }
  },
});
</script>
