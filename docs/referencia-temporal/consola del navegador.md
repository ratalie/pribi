ConvocatoriaJuntaSection.vue:335 [ConvocatoriaSection] detalleModo.get() {stored: 'PRESENCIAL', returned: 'PRESENCIAL', primeraConvocatoria: Proxy(Object)}
ConvocatoriaJuntaSection.vue:335 [ConvocatoriaSection] detalleModo.get() {stored: 'PRESENCIAL', returned: 'PRESENCIAL', primeraConvocatoria: Proxy(Object)}
FooterNavigationButtons.vue:48 🖱️ [FooterNavigationButtons] Click en botón Siguiente
FooterNavigationButtons.vue:48 🖱️ [FooterNavigationButtons] onNext es: function
FooterNavigationButtons.vue:48 🖱️ [FooterNavigationButtons] onNext función: async () => {
    console.log("🎯 [useJuntasFlowNext] onClickNext ejecutado desde el botón");
    console.log("🎯 [useJuntasFlowNext] Ruta actual:", route.path);
    try {
      juntasFlowStore.isLoading = true;
      console.log("⏳ [useJuntasFlowNext] Loading activado");
      console.log("▶️ [useJuntasFlowNext] Ejecutando handleNext...");
      await handleNext();
      console.log("✅ [useJuntasFlowNext] handleNext completado exitosamente");
      console.log("🔍 [useJuntasFlowNext] Buscando siguiente paso para:", route.path);
      const nextStep = juntasNavbarStore.getNextStepByCurrentStep(route.path);
      console.log("🔍 [useJuntasFlowNext] Siguiente paso encontrado:", nextStep);
      if (nextStep) {
        console.log("🚀 [useJuntasFlowNext] Navegando a:", nextStep.route);
        await router.push(nextStep.route);
        console.log("✅ [useJuntasFlowNext] Navegación completada");
      } else {
        console.warn("⚠️ [useJuntasFlowNext] No se encontró siguiente paso");
        console.warn("⚠️ [useJuntasFlowNext] Pasos disponibles:", juntasNavbarStore.steps.map((s) => ({ title: s.title, route: s.route })));
      }
    } catch (error) {
      console.error("❌ [useJuntasFlowNext] Error:", error);
      throw error;
    } finally {
      juntasFlowStore.isLoading = false;
      console.log("⏳ [useJuntasFlowNext] Loading desactivado");
    }
  }
useJuntasFlowNext.ts:38 🎯 [useJuntasFlowNext] onClickNext ejecutado desde el botón
useJuntasFlowNext.ts:39 🎯 [useJuntasFlowNext] Ruta actual: /operaciones/sociedades/68/junta-accionistas/26/detalles
useJuntasFlowNext.ts:42 ⏳ [useJuntasFlowNext] Loading activado
useJuntasFlowNext.ts:45 ▶️ [useJuntasFlowNext] Ejecutando handleNext...
index.vue:81 🚀 [Detalles] Handler de 'Siguiente' ejecutado
index.vue:82 🚀 [Detalles] societyId: 68
index.vue:83 🚀 [Detalles] flowId: 26
index.vue:84 🚀 [Detalles] meetingDetails: Proxy(Object) {id: undefined, tipoJunta: 'JUNTA_UNIVERSAL', esAnualObligatoria: false, primeraConvocatoria: {…}, segundaConvocatoria: undefined, …}
index.vue:114 💾 [Detalles] Iniciando guardado en backend...
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…HP7g'}
meeting-details.http.repository.ts:100 [Repository][MeetingDetailsHttp] update() request {url: 'http://localhost:3000/api/v2/society-profile/68/register-assembly/26/meeting-details', societyId: 68, flowId: 26, dto: '{\n  "tipoJunta": "JUNTA_UNIVERSAL",\n  "esAnualObli…9Z",\n    "hora": "2025-12-02T23:38:19.849Z"\n  }\n}'}
meeting-details.http.repository.ts:110 [Repository][MeetingDetailsHttp] update() response {success: true, message: 'Detalles de la junta actualizados correctamente.', code: 200}
meeting-details.store.ts:99 [Store][MeetingDetails] Datos actualizados: Proxy(Object) {id: undefined, tipoJunta: 'JUNTA_UNIVERSAL', esAnualObligatoria: false, primeraConvocatoria: {…}, segundaConvocatoria: undefined, …}
index.vue:119 ✅ [Detalles] Guardado exitoso
index.vue:137 ✅ [Detalles] Handler completado, el composable navegará al siguiente paso
useJuntasFlowNext.ts:47 ✅ [useJuntasFlowNext] handleNext completado exitosamente
useJuntasFlowNext.ts:50 🔍 [useJuntasFlowNext] Buscando siguiente paso para: /operaciones/sociedades/68/junta-accionistas/26/detalles
useJuntasFlowNext.ts:52 🔍 [useJuntasFlowNext] Siguiente paso encontrado: Proxy(Object) {title: 'Instalación de la Junta', description: 'Registra representante, asistencia y autoridades', status: 'completed', route: '/operaciones/sociedades/68/junta-accionistas/26/instalacion'}
useJuntasFlowNext.ts:55 🚀 [useJuntasFlowNext] Navegando a: /operaciones/sociedades/68/junta-accionistas/26/instalacion
useJuntasResumenDetection.ts:22 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/68/junta-accionistas/26/detalles', isResumenGeneral: false}
useJuntasFlowNext.ts:74 ✅ [useJuntasFlowNext] Handler configurado inmediatamente
useJuntasFlowNext.ts:75 ✅ [useJuntasFlowNext] Ruta actual: /operaciones/sociedades/68/junta-accionistas/26/instalacion
useJuntasResumenDetection.ts:22 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/68/junta-accionistas/26/detalles', isResumenGeneral: false}
useJuntasFlowNext.ts:84 ℹ️ [useJuntasFlowNext] Handler ya fue reemplazado, no limpiar
useJuntasFlowNext.ts:57 ✅ [useJuntasFlowNext] Navegación completada
useJuntasFlowNext.ts:68 ⏳ [useJuntasFlowNext] Loading desactivado
useJuntasNavbarRoutes.ts:231 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/68/junta-accionistas/26/instalacion
junta-navigation.ts:248 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'aporte-dinerarios', 1: 'remocion-gerente', 2: 'remocion-directores'}
junta-navigation.ts:253 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
junta-navigation.ts:267 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-no-dinerario': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'capitalizacion-creditos': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-gerente': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-directores': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-gerente': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-directores': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-nuevo-directorio': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'pronunciamiento-gestion': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aplicacion-resultados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'delegacion-auditores': EXCLUIDO
junta-navigation.ts:286 🟡 [juntaNavigation] Sub-steps filtrados: 3 (3) ['aporte-dinerarios', 'remocion-gerente', 'remocion-directores']
useJuntasNavbarRoutes.ts:236 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
useJuntasNavbarRoutes.ts:247 🟠 [useJuntasNavbarRoutes] Paso actual: instalacion
useJuntasNavbarRoutes.ts:252 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
useJuntasNavbarRoutes.ts:264 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasSidebarExpansion.ts:129 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
useJuntasSidebarExpansion.ts:130 🔴 [useJuntasSidebarExpansion] Old steps count: 6
useJuntasSidebarExpansion.ts:131 🔴 [useJuntasSidebarExpansion] New steps count: 6
useJuntasSidebarExpansion.ts:140 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 3, new: 3}
useJuntasSidebarExpansion.ts:36 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
useJuntasSidebarExpansion.ts:37 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
useJuntasSidebarExpansion.ts:38 🔴 [useJuntasSidebarExpansion] currentStepId: instalacion
useJuntasSidebarExpansion.ts:155 🔴 [useJuntasSidebarExpansion] Watch currentStepId cambiaron: instalacion
useJuntasSidebarExpansion.ts:36 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
useJuntasSidebarExpansion.ts:37 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
useJuntasSidebarExpansion.ts:38 🔴 [useJuntasSidebarExpansion] currentStepId: instalacion
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/68/junta-accionistas/26/instalacion
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'aporte-dinerarios', 1: 'remocion-gerente', 2: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'aporte-no-dinerario': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'capitalizacion-creditos': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-gerente': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-apoderados': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-directores': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'nombramiento-gerente': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'nombramiento-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-directores': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-nuevo-directorio': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'pronunciamiento-gestion': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aplicacion-resultados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'delegacion-auditores': EXCLUIDO
junta-navigation.ts:286 🟡 [juntaNavigation] Sub-steps filtrados: 3 (3) ['aporte-dinerarios', 'remocion-gerente', 'remocion-directores']
useJuntasNavbarRoutes.ts:236 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
useJuntasNavbarRoutes.ts:247 🟠 [useJuntasNavbarRoutes] Paso actual: instalacion
useJuntasNavbarRoutes.ts:252 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
useJuntasNavbarRoutes.ts:264 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasSidebarExpansion.ts:129 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
useJuntasSidebarExpansion.ts:130 🔴 [useJuntasSidebarExpansion] Old steps count: 6
useJuntasSidebarExpansion.ts:131 🔴 [useJuntasSidebarExpansion] New steps count: 6
useJuntasSidebarExpansion.ts:140 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 3, new: 3}
useJuntasSidebarExpansion.ts:36 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
useJuntasSidebarExpansion.ts:37 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
useJuntasSidebarExpansion.ts:38 🔴 [useJuntasSidebarExpansion] currentStepId: instalacion
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasNavbarRoutes.ts:231 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/68/junta-accionistas/26/instalacion
junta-navigation.ts:248 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'aporte-dinerarios', 1: 'remocion-gerente', 2: 'remocion-directores'}
junta-navigation.ts:253 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
junta-navigation.ts:267 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-no-dinerario': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'capitalizacion-creditos': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-gerente': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-directores': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-gerente': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-directores': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-nuevo-directorio': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'pronunciamiento-gestion': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aplicacion-resultados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'delegacion-auditores': EXCLUIDO
junta-navigation.ts:286 🟡 [juntaNavigation] Sub-steps filtrados: 3 (3) ['aporte-dinerarios', 'remocion-gerente', 'remocion-directores']
useJuntasNavbarRoutes.ts:236 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
useJuntasNavbarRoutes.ts:247 🟠 [useJuntasNavbarRoutes] Paso actual: instalacion
useJuntasNavbarRoutes.ts:252 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
useJuntasNavbarRoutes.ts:264 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasSidebarExpansion.ts:129 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
useJuntasSidebarExpansion.ts:130 🔴 [useJuntasSidebarExpansion] Old steps count: 6
useJuntasSidebarExpansion.ts:131 🔴 [useJuntasSidebarExpansion] New steps count: 6
useJuntasSidebarExpansion.ts:140 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 3, new: 3}
useJuntasSidebarExpansion.ts:36 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
useJuntasSidebarExpansion.ts:37 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
useJuntasSidebarExpansion.ts:38 🔴 [useJuntasSidebarExpansion] currentStepId: instalacion
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasResumenDetection.ts:22 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/68/junta-accionistas/26/instalacion', isResumenGeneral: false}
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasNavbarRoutes.ts:231 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/68/junta-accionistas/26/instalacion
junta-navigation.ts:248 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'aporte-dinerarios', 1: 'remocion-gerente', 2: 'remocion-directores'}
junta-navigation.ts:253 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
junta-navigation.ts:267 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-no-dinerario': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'capitalizacion-creditos': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-gerente': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-directores': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-gerente': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-directores': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-nuevo-directorio': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'pronunciamiento-gestion': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aplicacion-resultados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'delegacion-auditores': EXCLUIDO
junta-navigation.ts:286 🟡 [juntaNavigation] Sub-steps filtrados: 3 (3) ['aporte-dinerarios', 'remocion-gerente', 'remocion-directores']
useJuntasNavbarRoutes.ts:236 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
useJuntasNavbarRoutes.ts:247 🟠 [useJuntasNavbarRoutes] Paso actual: instalacion
useJuntasNavbarRoutes.ts:252 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
useJuntasNavbarRoutes.ts:264 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasSidebarExpansion.ts:129 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
useJuntasSidebarExpansion.ts:130 🔴 [useJuntasSidebarExpansion] Old steps count: 6
useJuntasSidebarExpansion.ts:131 🔴 [useJuntasSidebarExpansion] New steps count: 6
useJuntasSidebarExpansion.ts:140 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 3, new: 3}
useJuntasSidebarExpansion.ts:36 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
useJuntasSidebarExpansion.ts:37 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
useJuntasSidebarExpansion.ts:38 🔴 [useJuntasSidebarExpansion] currentStepId: instalacion
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasResumenDetection.ts:22 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/68/junta-accionistas/26/instalacion', isResumenGeneral: false}
useJuntasResumenDetection.ts:22 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/68/junta-accionistas/26/instalacion', isResumenGeneral: false}
 ✅ [useJuntasFlowNext] Handler configurado inmediatamente
 ✅ [useJuntasFlowNext] Ruta actual: /operaciones/sociedades/68/junta-accionistas/26/detalles
 [ConvocatoriaSection] detalleModo.get() {stored: 'PRESENCIAL', returned: 'PRESENCIAL', primeraConvocatoria: Proxy(Object)}
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/68/junta-accionistas/26/instalacion', isResumenGeneral: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…HP7g'}
 [Repository][MeetingDetailsHttp] get() request {url: 'http://localhost:3000/api/v2/society-profile/68/register-assembly/26/meeting-details', societyId: 68, flowId: 26}
 ℹ️ [useJuntasFlowNext] Handler ya fue reemplazado, no limpiar
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/68/junta-accionistas/26/detalles
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'aporte-dinerarios', 1: 'remocion-gerente', 2: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'aporte-no-dinerario': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'capitalizacion-creditos': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-gerente': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-apoderados': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-directores': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'nombramiento-gerente': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'nombramiento-apoderados': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'nombramiento-directores': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'nombramiento-nuevo-directorio': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'pronunciamiento-gestion': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'aplicacion-resultados': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'delegacion-auditores': EXCLUIDO
 🟡 [juntaNavigation] Sub-steps filtrados: 3 (3) ['aporte-dinerarios', 'remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: detalles
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 3, new: 3}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: detalles
 🔴 [useJuntasSidebarExpansion] Watch currentStepId cambiaron: detalles
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: detalles
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/68/junta-accionistas/26/detalles
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'aporte-dinerarios', 1: 'remocion-gerente', 2: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'aporte-no-dinerario': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'capitalizacion-creditos': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-gerente': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-apoderados': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'remocion-directores': INCLUIDO
 🟡 [juntaNavigation] Sub-step 'nombramiento-gerente': EXCLUIDO
 🟡 [juntaNavigation] Sub-step 'nombramiento-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-directores': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-nuevo-directorio': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'pronunciamiento-gestion': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aplicacion-resultados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'delegacion-auditores': EXCLUIDO
junta-navigation.ts:286 🟡 [juntaNavigation] Sub-steps filtrados: 3 (3) ['aporte-dinerarios', 'remocion-gerente', 'remocion-directores']
useJuntasNavbarRoutes.ts:236 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
useJuntasNavbarRoutes.ts:247 🟠 [useJuntasNavbarRoutes] Paso actual: detalles
useJuntasNavbarRoutes.ts:252 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
useJuntasNavbarRoutes.ts:264 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasSidebarExpansion.ts:129 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
useJuntasSidebarExpansion.ts:130 🔴 [useJuntasSidebarExpansion] Old steps count: 6
useJuntasSidebarExpansion.ts:131 🔴 [useJuntasSidebarExpansion] New steps count: 6
useJuntasSidebarExpansion.ts:140 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 3, new: 3}
useJuntasSidebarExpansion.ts:36 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
useJuntasSidebarExpansion.ts:37 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
useJuntasSidebarExpansion.ts:38 🔴 [useJuntasSidebarExpansion] currentStepId: detalles
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasNavbarRoutes.ts:231 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/68/junta-accionistas/26/detalles
junta-navigation.ts:248 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'aporte-dinerarios', 1: 'remocion-gerente', 2: 'remocion-directores'}
junta-navigation.ts:253 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
junta-navigation.ts:267 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-no-dinerario': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'capitalizacion-creditos': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-gerente': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-directores': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-gerente': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-directores': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-nuevo-directorio': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'pronunciamiento-gestion': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aplicacion-resultados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'delegacion-auditores': EXCLUIDO
junta-navigation.ts:286 🟡 [juntaNavigation] Sub-steps filtrados: 3 (3) ['aporte-dinerarios', 'remocion-gerente', 'remocion-directores']
useJuntasNavbarRoutes.ts:236 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
useJuntasNavbarRoutes.ts:247 🟠 [useJuntasNavbarRoutes] Paso actual: detalles
useJuntasNavbarRoutes.ts:252 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
useJuntasNavbarRoutes.ts:264 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasSidebarExpansion.ts:129 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
useJuntasSidebarExpansion.ts:130 🔴 [useJuntasSidebarExpansion] Old steps count: 6
useJuntasSidebarExpansion.ts:131 🔴 [useJuntasSidebarExpansion] New steps count: 6
useJuntasSidebarExpansion.ts:140 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 3, new: 3}
useJuntasSidebarExpansion.ts:36 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
useJuntasSidebarExpansion.ts:37 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
useJuntasSidebarExpansion.ts:38 🔴 [useJuntasSidebarExpansion] currentStepId: detalles
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasResumenDetection.ts:22 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/68/junta-accionistas/26/detalles', isResumenGeneral: false}
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasNavbarRoutes.ts:231 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/68/junta-accionistas/26/detalles
junta-navigation.ts:248 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'aporte-dinerarios', 1: 'remocion-gerente', 2: 'remocion-directores'}
junta-navigation.ts:253 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
junta-navigation.ts:267 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aporte-no-dinerario': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'capitalizacion-creditos': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-gerente': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'remocion-directores': INCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-gerente': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-apoderados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-directores': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'nombramiento-nuevo-directorio': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'pronunciamiento-gestion': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'aplicacion-resultados': EXCLUIDO
junta-navigation.ts:275 🟡 [juntaNavigation] Sub-step 'delegacion-auditores': EXCLUIDO
junta-navigation.ts:286 🟡 [juntaNavigation] Sub-steps filtrados: 3 (3) ['aporte-dinerarios', 'remocion-gerente', 'remocion-directores']
useJuntasNavbarRoutes.ts:236 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
useJuntasNavbarRoutes.ts:247 🟠 [useJuntasNavbarRoutes] Paso actual: detalles
useJuntasNavbarRoutes.ts:252 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
useJuntasNavbarRoutes.ts:264 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasSidebarExpansion.ts:129 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
useJuntasSidebarExpansion.ts:130 🔴 [useJuntasSidebarExpansion] Old steps count: 6
useJuntasSidebarExpansion.ts:131 🔴 [useJuntasSidebarExpansion] New steps count: 6
useJuntasSidebarExpansion.ts:140 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 3, new: 3}
useJuntasSidebarExpansion.ts:36 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
useJuntasSidebarExpansion.ts:37 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
useJuntasSidebarExpansion.ts:38 🔴 [useJuntasSidebarExpansion] currentStepId: detalles
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasNavbarRoutes.ts:365 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
useJuntasResumenDetection.ts:22 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/68/junta-accionistas/26/detalles', isResumenGeneral: false}
meeting-details.http.repository.ts:53 [Repository][MeetingDetailsHttp] get() response {success: true, message: 'Detalles de la junta obtenidos correctamente', data: {…}, code: 200}
meeting-details.http.repository.ts:57 [Repository][MeetingDetailsHttp] get() mapped {id: undefined, tipoJunta: 'JUNTA_UNIVERSAL', esAnualObligatoria: false, primeraConvocatoria: {…}, segundaConvocatoria: undefined, …}
meeting-details.store.ts:71 [Store][MeetingDetails] Datos cargados: {id: undefined, tipoJunta: 'JUNTA_UNIVERSAL', esAnualObligatoria: false, primeraConvocatoria: {…}, segundaConvocatoria: undefined, …}
ConvocatoriaJuntaSection.vue:335 [ConvocatoriaSection] detalleModo.get() {stored: 'VIRTUAL', returned: 'VIRTUAL', primeraConvocatoria: Proxy(Object)}
