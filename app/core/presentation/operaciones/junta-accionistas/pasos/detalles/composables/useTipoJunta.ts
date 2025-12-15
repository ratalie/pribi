/**
 * Composable para gestionar la lógica de tipo de junta
 * 
 * Responsabilidades:
 * - Gestionar selección de tipo de junta
 * - Limpiar segundaConvocatoria al cambiar a Universal
 * - Validar cambios de tipo
 * - Sincronizar con store
 */

import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';
import type { MeetingDetails } from '~/core/hexag/juntas/domain/entities/meeting-details.entity';

export function useTipoJunta() {
  const store = useMeetingDetailsStore();

  /**
   * Opciones de tipo de junta
   */
  const tipoJuntaOptions = [
    {
      label: 'Junta Universal',
      value: TipoJunta.UNIVERSAL,
      description: 'No requiere convocatoria previa',
    },
    {
      label: 'Junta General',
      value: TipoJunta.GENERAL,
      description: 'Requiere convocatoria con plazos establecidos',
    },
  ];

  /**
   * Computed para tipo de junta con getter/setter
   */
  const tipoJunta = computed({
    get: () => {
      if (!store.meetingDetails) {
        return TipoJunta.GENERAL;
      }
      return store.meetingDetails.tipoJunta;
    },
    set: (value: TipoJunta) => {
      if (!store.meetingDetails) {
        // Crear objeto inicial si no existe
        store.meetingDetails = {
          tipoJunta: value,
          esAnualObligatoria: false,
          presidenteAsistio: false,
          secretarioAsistio: false,
        };
      } else {
        const tipoAnterior = store.meetingDetails.tipoJunta;
        
        // ⚠️ IMPORTANTE: Usar patchMeetingDetails para mantener reactividad
        const updates: Partial<MeetingDetails> = { tipoJunta: value };

        // Si cambia de GENERAL a UNIVERSAL, limpiar segundaConvocatoria
        // El backend rechaza segundaConvocatoria para Universal
        if (tipoAnterior === TipoJunta.GENERAL && value === TipoJunta.UNIVERSAL) {
          console.log("🧹 [useTipoJunta] Limpiando segundaConvocatoria al cambiar a Universal");
          updates.segundaConvocatoria = undefined;
          updates.instaladaEnConvocatoria = undefined;
        }

        // Si cambia de UNIVERSAL a GENERAL, asegurar que no haya segundaConvocatoria inicialmente
        if (tipoAnterior === TipoJunta.UNIVERSAL && value === TipoJunta.GENERAL) {
          console.log("🔄 [useTipoJunta] Cambiando de Universal a General");
          // No limpiar primeraConvocatoria, puede reutilizarse como primera convocatoria
        }

        store.patchMeetingDetails(updates);
      }
    },
  });

  return {
    tipoJunta,
    tipoJuntaOptions,
  };
}

