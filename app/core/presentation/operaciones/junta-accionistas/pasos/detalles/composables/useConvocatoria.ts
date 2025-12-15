/**
 * Composable para gestionar la lógica de convocatorias
 * 
 * ⭐ CRÍTICO: Este composable elimina ~300 líneas de código duplicado
 * 
 * Responsabilidades:
 * - Helper ensureConvocatoria reutilizable
 * - Computed properties reutilizables para modo, dirección, fecha, hora
 * - Crear/actualizar convocatorias
 * - Manejar primera, segunda y detalle (universal)
 */

import { computed, type Ref } from 'vue';
import { ModoReunion } from '~/core/hexag/juntas/domain/enums/modo-reunion.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';
import { useConvocatoriaFormatting } from './useConvocatoriaFormatting';

type ConvocatoriaTipo = 'primera' | 'segunda' | 'detalle';

export function useConvocatoria(tipo: ConvocatoriaTipo, tipoJunta: Ref<TipoJunta>) {
  const store = useMeetingDetailsStore();
  const { formatDate, formatTime, parseDate, parseTime } = useConvocatoriaFormatting();

  /**
   * Helper para crear convocatoria si no existe
   */
  const ensureConvocatoria = () => {
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
      console.warn(`⚠️ [useConvocatoria] Intento de crear segundaConvocatoria en Junta Universal, ignorado`);
      return;
    }

    // Crear primeraConvocatoria si no existe
    if ((tipo === 'primera' || tipo === 'detalle') && !store.meetingDetails.primeraConvocatoria) {
      store.meetingDetails.primeraConvocatoria = {
        direccion: '',
        modo: ModoReunion.IN_PERSON,
        fecha: new Date(),
        hora: new Date(),
      };
    }

    // Solo crear segundaConvocatoria si es GENERAL
    if (tipo === 'segunda' && tipoJunta.value === TipoJunta.GENERAL && !store.meetingDetails.segundaConvocatoria) {
      store.meetingDetails.segundaConvocatoria = {
        direccion: '',
        modo: ModoReunion.IN_PERSON,
        fecha: new Date(),
        hora: new Date(),
      };
    }
  };

  /**
   * Obtener la convocatoria correspondiente según el tipo
   */
  const getConvocatoria = () => {
    if (tipo === 'detalle' || tipo === 'primera') {
      return store.meetingDetails?.primeraConvocatoria;
    }
    return store.meetingDetails?.segundaConvocatoria;
  };

  /**
   * Computed para modo (Presencial/Virtual)
   */
  const modo = computed({
    get: () => {
      ensureConvocatoria();
      return getConvocatoria()?.modo || ModoReunion.IN_PERSON;
    },
    set: (value: ModoReunion) => {
      ensureConvocatoria();
      const convocatoria = getConvocatoria();
      if (convocatoria) {
        // ⚠️ Usar patchMeetingDetails para mantener reactividad
        if (tipo === 'detalle' || tipo === 'primera') {
          store.patchMeetingDetails({
            primeraConvocatoria: {
              ...convocatoria,
              modo: value,
            },
          });
        } else {
          store.patchMeetingDetails({
            segundaConvocatoria: {
              ...convocatoria,
              modo: value,
            },
          });
        }
      }
    },
  });

  /**
   * Computed para dirección
   */
  const direccion = computed({
    get: () => {
      ensureConvocatoria();
      return getConvocatoria()?.direccion || '';
    },
    set: (value: string) => {
      ensureConvocatoria();
      const convocatoria = getConvocatoria();
      if (convocatoria) {
        if (tipo === 'detalle' || tipo === 'primera') {
          store.patchMeetingDetails({
            primeraConvocatoria: {
              ...convocatoria,
              direccion: value,
            },
          });
        } else {
          store.patchMeetingDetails({
            segundaConvocatoria: {
              ...convocatoria,
              direccion: value,
            },
          });
        }
      }
    },
  });

  /**
   * Computed para fecha
   */
  const fecha = computed({
    get: () => {
      ensureConvocatoria();
      const fechaValue = getConvocatoria()?.fecha;
      return formatDate(fechaValue);
    },
    set: (value: string) => {
      if (!value) return;
      ensureConvocatoria();
      const convocatoria = getConvocatoria();
      if (convocatoria) {
        const dateValue = parseDate(value);
        if (tipo === 'detalle' || tipo === 'primera') {
          store.patchMeetingDetails({
            primeraConvocatoria: {
              ...convocatoria,
              fecha: dateValue,
            },
          });
        } else {
          store.patchMeetingDetails({
            segundaConvocatoria: {
              ...convocatoria,
              fecha: dateValue,
            },
          });
        }
      }
    },
  });

  /**
   * Computed para hora
   */
  const hora = computed({
    get: () => {
      ensureConvocatoria();
      const horaValue = getConvocatoria()?.hora;
      return formatTime(horaValue);
    },
    set: (value: string) => {
      if (!value) return;
      ensureConvocatoria();
      const convocatoria = getConvocatoria();
      if (convocatoria) {
        const timeValue = parseTime(value);
        if (tipo === 'detalle' || tipo === 'primera') {
          store.patchMeetingDetails({
            primeraConvocatoria: {
              ...convocatoria,
              hora: timeValue,
            },
          });
        } else {
          store.patchMeetingDetails({
            segundaConvocatoria: {
              ...convocatoria,
              hora: timeValue,
            },
          });
        }
      }
    },
  });

  return {
    modo,
    direccion,
    fecha,
    hora,
  };
}

