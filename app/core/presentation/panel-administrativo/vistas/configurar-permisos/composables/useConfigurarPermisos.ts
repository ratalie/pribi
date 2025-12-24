import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissionsConfigStore } from '~/core/presentation/panel-administrativo/stores/permissions-config.store';
import { useSocietiesStore } from '~/core/presentation/panel-administrativo/stores/societies.store';
import { ApplySimplePermissionsUseCase } from '~/core/hexag/permissions/application/use-cases/apply-simple-permissions.use-case';
import { PermissionsHttpRepository } from '~/core/hexag/permissions/infrastructure/repositories/permissions.http.repository';
import { UserHttpRepository } from '~/core/hexag/panel-administrativo/infrastructure/repositories/user-http.repository';
import type { SimplePermissionsConfig } from '../types/configurar-permisos.types';

/**
 * Composable para la configuración de permisos
 * 
 * Orquesta la lógica de la vista de configuración de permisos
 */
export function useConfigurarPermisos(userId: string) {
  const router = useRouter();
  const permissionsStore = usePermissionsConfigStore();
  const societiesStore = useSocietiesStore();

  // Repositorios y use case
  const permissionsRepository = new PermissionsHttpRepository();
  const userRepository = new UserHttpRepository();
  const applyPermissionsUseCase = new ApplySimplePermissionsUseCase(
    permissionsRepository,
    userRepository,
  );

  // Estados
  const isLoading = ref(false);
  const isSaving = ref(false);
  const errorMessage = ref<string | null>(null);

  // Computed
  const config = computed(() => permissionsStore.config);
  const societies = computed(() => societiesStore.societies);
  const isValid = computed(() => permissionsStore.isValid);

  /**
   * Carga los datos iniciales
   */
  const loadData = async () => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      await Promise.all([
        permissionsStore.loadFromUser(userId),
        societiesStore.loadSocieties(),
      ]);
    } catch (error: any) {
      errorMessage.value = error?.message ?? 'Error al cargar datos';
      console.error('[useConfigurarPermisos] Error al cargar datos:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Guarda la configuración de permisos
   */
  const save = async (configToSave: SimplePermissionsConfig) => {
    isSaving.value = true;
    errorMessage.value = null;

    try {
      // Aplicar permisos usando el use case
      await applyPermissionsUseCase.execute(userId, configToSave);

      // Redirigir a la lista de usuarios después de guardar
      await router.push('/admin/usuarios');
    } catch (error: any) {
      errorMessage.value = error?.message ?? 'Error al guardar permisos';
      console.error('[useConfigurarPermisos] Error al guardar:', error);
      throw error;
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Cancela la configuración y regresa
   */
  const cancel = () => {
    router.push('/admin/usuarios');
  };

  /**
   * Resetea la configuración
   */
  const reset = () => {
    permissionsStore.reset();
  };

  return {
    // Estado
    config,
    societies,
    isValid,
    isLoading: computed(() => isLoading.value),
    isSaving: computed(() => isSaving.value),
    errorMessage: computed(() => errorMessage.value),

    // Métodos
    loadData,
    save,
    cancel,
    reset,
  };
}


