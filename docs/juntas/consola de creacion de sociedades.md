 [vite] connecting...
 [vite] connected.
 mswDisabled true
 <Suspense> is an experimental feature and its API will likely change.
 ✨ Nuxt DevTools  Press Shift + Alt + D to open DevTools 
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🚀 [onMounted] useTheme MONTADO
   🌍 true: true
   📄 typeof document: object
   📄 typeof window: object
   💾 Intentando cargar desde localStorage...
     - Valor en localStorage: light
   ✅ Tema válido encontrado: light
   📊 Estado después de cargar:
     - currentTheme.value: light
     - effectiveTheme.value: light
   🎯 Aplicando tema inicial...
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🔧 [applyTheme] INICIO
   📝 Theme solicitado: light
   🌍 true: true
   ✅ Estamos en CLIENT - procediendo...
   📄 document.documentElement: 
   📄 tagName: HTML
   📊 ESTADO ANTES:
     - className: ""
     - classList: []
     - style.colorScheme: 
   🧹 Limpiando clases...
     - Después de remove: []
   ➕ Agregando clase: light
     - Después de add: ['light']
   ✔️ Verificación classList.contains('light'): true
   📊 ESTADO DESPUÉS:
     - className: "light"
     - classList: ['light']
   🎨 Actualizando color-scheme a: light
     - style.colorScheme: light
   🔍 Verificando variables CSS:
     - --color-background: oklch(1 0 0)
     - --color-primary: oklch(0.21 0.034 264.665)
 ✅ [applyTheme] COMPLETADO
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   👁️ Configurando watcher de effectiveTheme...
   💾 Configurando watcher de currentTheme...
 ✅ [onMounted] CONFIGURACIÓN COMPLETA
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 🍍 "registros-sociedad-historial" store installed 🆕
 🍍 "juntas-historial" store installed 🆕
 🍍 "auth" store installed 🆕
 [Repository][SociedadHttp] list():response {count: 5}
 [Store][SociedadHistorial] Sociedades obtenidas (5) [{…}, {…}, {…}, {…}, {…}]
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] create() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly', societyId: 3}
 [Repository][JuntaHttp] create() response {success: true, message: 'Flujo de Junta creado correctamente.', data: {…}, code: 201}
 [Store][JuntaHistorial] Junta creada con id 2
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] getSnapshot() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/2/snapshot/complete', societyId: 3, flowId: 2}
 [Repository][JuntaHttp] getSnapshot() error {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/2/snapshot/complete', societyId: 3, flowId: 2, statusCode: 500, message: 'Internal server error'}
getSnapshot @ junta.http.repositor…t=1764608702051:159
await in getSnapshot
execute @ get-snapshot.use-cas…s?t=1764608702056:6
crearJunta @ junta-historial.stor…?t=1764608702070:80
await in crearJunta
wrappedAction @ pinia.mjs?v=7e67ddf4:1067
store.<computed> @ pinia.mjs?v=7e67ddf4:761
handleStartFlow @ crear.vue?t=1764608702070:90
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:204
invoker @ runtime-dom.esm-bund…r.js?v=7e67ddf4:721
 [Store][JuntaHistorial] Error al obtener snapshot: 
crearJunta @ junta-historial.stor…t=1764608702070:100
await in crearJunta
wrappedAction @ pinia.mjs?v=7e67ddf4:1067
store.<computed> @ pinia.mjs?v=7e67ddf4:761
handleStartFlow @ crear.vue?t=1764608702070:90
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:204
invoker @ runtime-dom.esm-bund…r.js?v=7e67ddf4:721
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] list() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/list', societyId: 3}
 [Repository][JuntaHttp] list() response {count: 1}
 [Store][JuntaHistorial] Juntas obtenidas [{…}]
 🔵 [puntos-acuerdo] Acuerdos individuales encontrados: (14) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/2/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] No hay sub-steps seleccionados, retornando paso sin sub-steps
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 0
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🔴 [useJuntasSidebarExpansion] Watch currentStepId cambiaron: seleccion-agenda
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/2/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] No hay sub-steps seleccionados, retornando paso sin sub-steps
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/2/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] No hay sub-steps seleccionados, retornando paso sin sub-steps
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/3/junta-accionistas/2/seleccion-agenda', isResumenGeneral: false}
 🟪 [useJuntasContentSidebar] hasRightSidebar (normal): {hasSubStep: false, hasSections: false, currentSubStepId: undefined, sectionsCount: 0, result: false}
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/2/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] No hay sub-steps seleccionados, retornando paso sin sub-steps
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/3/junta-accionistas/2/seleccion-agenda', isResumenGeneral: false}
 🍍 "juntasNavbar" store installed 🆕
 🍍 "juntasFlow" store installed 🆕
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 0, new: 0}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AgendaItemsHttp] get() request {url: 'http://localhost:3000/api/v2/society-profile/3/assembly/2/agenda-items', societyId: 3, flowId: 2}
 🍍 "agenda-items" store installed 🆕
 [Repository][AgendaItemsHttp] get() response {success: true, message: 'Puntos de agenda obtenidos correctamente', data: {…}, code: 200}
 [Store][AgendaItems] Agenda items cargados {aumentoCapital: {…}, remocion: {…}, nombramiento: {…}, gestionSocialYResultadosEconomicos: {…}}
 🟢 [useJuntasFlowStore] updateDynamicSubSteps: (2) ['remocion-gerente', 'remocion-directores']
 🟢 [useJuntasFlowStore] selectedSubSteps actualizado: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 0, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 [Repository][SociedadHttp] list():response {count: 5}
 [Store][SociedadHistorial] Sociedades obtenidas (5) [{…}, {…}, {…}, {…}, {…}]
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] create() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly', societyId: 3}
 [Repository][JuntaHttp] create() response {success: true, message: 'Flujo de Junta creado correctamente.', data: {…}, code: 201}
 [Store][JuntaHistorial] Junta creada con id 3
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] getSnapshot() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/3/snapshot/complete', societyId: 3, flowId: 3}
 [Repository][JuntaHttp] getSnapshot() error {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/3/snapshot/complete', societyId: 3, flowId: 3, statusCode: 500, message: 'Internal server error'}
getSnapshot @ junta.http.repositor…t=1764608702051:159
await in getSnapshot
execute @ get-snapshot.use-cas…s?t=1764608702056:6
crearJunta @ junta-historial.stor…?t=1764608702070:80
await in crearJunta
wrappedAction @ pinia.mjs?v=7e67ddf4:1067
store.<computed> @ pinia.mjs?v=7e67ddf4:761
handleStartFlow @ crear.vue?t=1764608702070:90
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:204
invoker @ runtime-dom.esm-bund…r.js?v=7e67ddf4:721
 [Store][JuntaHistorial] Error al obtener snapshot: 
crearJunta @ junta-historial.stor…t=1764608702070:100
await in crearJunta
wrappedAction @ pinia.mjs?v=7e67ddf4:1067
store.<computed> @ pinia.mjs?v=7e67ddf4:761
handleStartFlow @ crear.vue?t=1764608702070:90
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:204
invoker @ runtime-dom.esm-bund…r.js?v=7e67ddf4:721
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] list() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/list', societyId: 3}
 [Repository][JuntaHttp] list() response {count: 2}
 [Store][JuntaHistorial] Juntas obtenidas (2) [{…}, {…}]
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/3/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 0
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🔴 [useJuntasSidebarExpansion] Watch currentStepId cambiaron: seleccion-agenda
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/3/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/3/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/3/junta-accionistas/3/seleccion-agenda', isResumenGeneral: false}
 🟪 [useJuntasContentSidebar] hasRightSidebar (normal): {hasSubStep: false, hasSections: false, currentSubStepId: undefined, sectionsCount: 0, result: false}
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/3/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/3/junta-accionistas/3/seleccion-agenda', isResumenGeneral: false}
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AgendaItemsHttp] get() request {url: 'http://localhost:3000/api/v2/society-profile/3/assembly/3/agenda-items', societyId: 3, flowId: 3}
 [Repository][AgendaItemsHttp] get() response {success: true, message: 'Puntos de agenda obtenidos correctamente', data: {…}, code: 200}
 [Store][AgendaItems] Agenda items cargados {aumentoCapital: {…}, remocion: {…}, nombramiento: {…}, gestionSocialYResultadosEconomicos: {…}}
 🟢 [useJuntasFlowStore] updateDynamicSubSteps: (2) ['remocion-gerente', 'remocion-directores']
 🟢 [useJuntasFlowStore] selectedSubSteps actualizado: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 [Repository][SociedadHttp] list():response {count: 5}
 [Store][SociedadHistorial] Sociedades obtenidas (5) [{…}, {…}, {…}, {…}, {…}]
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] create() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly', societyId: 3}
 [Repository][JuntaHttp] create() response {success: true, message: 'Flujo de Junta creado correctamente.', data: {…}, code: 201}
 [Store][JuntaHistorial] Junta creada con id 4
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] getSnapshot() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/4/snapshot/complete', societyId: 3, flowId: 4}
 [Repository][JuntaHttp] getSnapshot() error {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/4/snapshot/complete', societyId: 3, flowId: 4, statusCode: 500, message: 'Internal server error'}
getSnapshot @ junta.http.repositor…t=1764608702051:159
await in getSnapshot
execute @ get-snapshot.use-cas…s?t=1764608702056:6
crearJunta @ junta-historial.stor…?t=1764608702070:80
await in crearJunta
wrappedAction @ pinia.mjs?v=7e67ddf4:1067
store.<computed> @ pinia.mjs?v=7e67ddf4:761
handleStartFlow @ crear.vue?t=1764608702070:90
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:204
invoker @ runtime-dom.esm-bund…r.js?v=7e67ddf4:721
 [Store][JuntaHistorial] Error al obtener snapshot: 
crearJunta @ junta-historial.stor…t=1764608702070:100
await in crearJunta
wrappedAction @ pinia.mjs?v=7e67ddf4:1067
store.<computed> @ pinia.mjs?v=7e67ddf4:761
handleStartFlow @ crear.vue?t=1764608702070:90
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:204
invoker @ runtime-dom.esm-bund…r.js?v=7e67ddf4:721
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] list() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/list', societyId: 3}
 [Repository][JuntaHttp] list() response {count: 3}
 [Store][JuntaHistorial] Juntas obtenidas (3) [{…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/4/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 0
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🔴 [useJuntasSidebarExpansion] Watch currentStepId cambiaron: seleccion-agenda
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/4/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/4/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/3/junta-accionistas/4/seleccion-agenda', isResumenGeneral: false}
 🟪 [useJuntasContentSidebar] hasRightSidebar (normal): {hasSubStep: false, hasSections: false, currentSubStepId: undefined, sectionsCount: 0, result: false}
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/4/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/3/junta-accionistas/4/seleccion-agenda', isResumenGeneral: false}
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AgendaItemsHttp] get() request {url: 'http://localhost:3000/api/v2/society-profile/3/assembly/4/agenda-items', societyId: 3, flowId: 4}
 [Repository][AgendaItemsHttp] get() response {success: true, message: 'Puntos de agenda obtenidos correctamente', data: {…}, code: 200}
 [Store][AgendaItems] Agenda items cargados {aumentoCapital: {…}, remocion: {…}, nombramiento: {…}, gestionSocialYResultadosEconomicos: {…}}
 🟢 [useJuntasFlowStore] updateDynamicSubSteps: (2) ['remocion-gerente', 'remocion-directores']
 🟢 [useJuntasFlowStore] selectedSubSteps actualizado: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 [Repository][SociedadHttp] list():response {count: 5}
 [Store][SociedadHistorial] Sociedades obtenidas (5) [{…}, {…}, {…}, {…}, {…}]
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] create() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly', societyId: 3}
 [Repository][JuntaHttp] create() response {success: true, message: 'Flujo de Junta creado correctamente.', data: {…}, code: 201}
 [Store][JuntaHistorial] Junta creada con id 5
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] getSnapshot() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/5/snapshot/complete', societyId: 3, flowId: 5}
 [Repository][JuntaHttp] getSnapshot() response {hasData: true, snapshotKeys: Array(21)}
 
================================================================================
 📸 SNAPSHOT COMPLETO DE JUNTA
 ================================================================================
 Sociedad ID: 3
 Flow ID: 5
 
📋 RESUMEN:
   • Accionistas: 2
   • Clases de Acciones: 1
   • Asignaciones: 2
   • Directores: 0
   • Apoderados: 0
   • Valor Nominal: $0
   • Tiene Directorio: Sí
   • Tiene Quorums: Sí
 
📦 DATOS COMPLETOS:
 {
  "shareholderId": "019adae7-18e0-72ee-90d9-c91768ec9b2a",
  "nominalValueId": "019adae7-18e0-72ee-90d9-cfd1b832577e",
  "shareAllocationId": "019adae7-18e0-72ee-90d9-d365a1ca2ad8",
  "meetingConfigId": "019adae7-18e0-72ee-90d9-d67fb48c514b",
  "directoryId": "019adae7-18e0-72ee-90d9-dba42dc3aa18",
  "attorneyRegistryId": "019adae7-18e0-72ee-90d9-ddb46e53f2a7",
  "powerRegimenId": "019adae7-18e0-72ee-90d9-e0a5631d10fc",
  "quorumId": "019adae7-18e0-72ee-90d9-e7dcfad6bdb7",
  "specialAgreementsId": "019adae7-18e0-72ee-90d9-e918859cbf4f",
  "nominalValue": 0,
  "shareClasses": [
    {
      "id": "019adae7-18e0-72ee-90d9-fef6f4ac09d3",
      "tipo": "COMUN",
      "cantidadSuscrita": 500,
      "redimible": true,
      "conDerechoVoto": false
    }
  ],
  "shareholders": [
    {
      "id": "019adae7-18e0-72ee-90d9-ec56f72673bd",
      "person": {
        "id": "019adae7-18e0-72ee-90d9-f14dc202b4a4",
        "tipo": "NATURAL",
        "nombre": "Juan",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "García",
        "tipoDocumento": "DNI",
        "numeroDocumento": "00000005"
      }
    },
    {
      "id": "019adae7-18e0-72ee-90d9-f7233cc89bfc",
      "person": {
        "id": "019adae7-18e0-72ee-90d9-f962d281ad94",
        "tipo": "NATURAL",
        "nombre": "María",
        "apellidoPaterno": "González",
        "apellidoMaterno": "López",
        "tipoDocumento": "DNI",
        "numeroDocumento": "00000006"
      }
    }
  ],
  "shareAllocations": [
    {
      "id": "019adae7-18e1-772b-bcd3-9521dc9007a1",
      "accionId": "019adae7-18e0-72ee-90d9-fef6f4ac09d3",
      "accionistaId": "019adae7-18e0-72ee-90d9-ec56f72673bd",
      "cantidadSuscrita": 300,
      "precioPorAccion": 1,
      "porcentajePagadoPorAccion": 100,
      "totalDividendosPendientes": 0,
      "pagadoCompletamente": true,
      "fechaCreacion": "2025-12-01T17:12:49.666Z",
      "fechaActualizacion": "2025-12-01T17:12:49.666Z"
    },
    {
      "id": "019adae7-18e1-772b-bcd3-99630d1b380f",
      "accionId": "019adae7-18e0-72ee-90d9-fef6f4ac09d3",
      "accionistaId": "019adae7-18e0-72ee-90d9-f7233cc89bfc",
      "cantidadSuscrita": 200,
      "precioPorAccion": 1,
      "porcentajePagadoPorAccion": 100,
      "totalDividendosPendientes": 0,
      "pagadoCompletamente": true,
      "fechaCreacion": "2025-12-01T17:12:49.666Z",
      "fechaActualizacion": "2025-12-01T17:12:49.666Z"
    }
  ],
  "directory": {
    "conteoPersonalizado": true,
    "minimoDirectores": 3,
    "maximoDirectores": 5,
    "inicioMandato": "2025-01-01T05:00:00.000Z",
    "finMandato": "2026-01-01T05:00:00.000Z",
    "quorumMinimo": 2,
    "mayoria": 2,
    "presidenteDesignado": true,
    "secretarioAsignado": true,
    "reeleccionPermitida": true,
    "presidentePreside": false,
    "presidenteDesempata": true,
    "periodo": "ONE_YEAR",
    "presidenteId": "019adae7-18e0-72ee-90da-0223e738d190"
  },
  "directors": [],
  "attorneys": [],
  "powers": {
    "id": "019adae7-18e0-72ee-90d9-e0a5631d10fc",
    "powers": [],
    "powerGrants": []
  },
  "quorums": {
    "primeraConvocatoriaSimple": 60,
    "primeraConvocatoriaCalificada": 60,
    "segundaConvocatoriaSimple": 66,
    "segundaConvocatoriaCalificada": 66,
    "quorumMinimoSimple": 50,
    "quorumMinimoCalificado": 60
  },
  "specialAgreements": {
    "derechoPreferencia": false,
    "archivoEstatutos": null,
    "archivoAccionistas": null,
    "archivoTerceros": null
  },
  "meetingConfig": {
    "id": "019adae7-18e0-72ee-90d9-d67fb48c514b",
    "meetingType": "JUNTA_UNIVERSAL",
    "isAnnualMandatory": false
  },
  "flowInfo": {
    "flowStructureId": 5,
    "currentStep": "INIT",
    "statusProgression": "CREATED"
  }
}
 ================================================================================

 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][JuntaHttp] list() request {url: 'http://localhost:3000/api/v2/society-profile/3/register-assembly/list', societyId: 3}
 [Repository][JuntaHttp] list() response {count: 4}
 [Store][JuntaHistorial] Juntas obtenidas (4) [{…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/5/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 0
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🔴 [useJuntasSidebarExpansion] Watch currentStepId cambiaron: seleccion-agenda
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/5/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/5/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/3/junta-accionistas/5/seleccion-agenda', isResumenGeneral: false}
 🟪 [useJuntasContentSidebar] hasRightSidebar (normal): {hasSubStep: false, hasSections: false, currentSubStepId: undefined, sectionsCount: 0, result: false}
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] Ruta cambiada: /operaciones/sociedades/3/junta-accionistas/5/seleccion-agenda
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟠 [useJuntasNavbarRoutes] Pasos generados: 6 (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] Paso actual: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado: undefined
 🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟦 [useJuntasResumenDetection] isResumenPage: {path: '/operaciones/sociedades/3/junta-accionistas/5/seleccion-agenda', isResumenGeneral: false}
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AgendaItemsHttp] get() request {url: 'http://localhost:3000/api/v2/society-profile/3/assembly/5/agenda-items', societyId: 3, flowId: 5}
 [Repository][AgendaItemsHttp] get() response {success: true, message: 'Puntos de agenda obtenidos correctamente', data: {…}, code: 200}
 [Store][AgendaItems] Agenda items cargados {aumentoCapital: {…}, remocion: {…}, nombramiento: {…}, gestionSocialYResultadosEconomicos: {…}}
 🟢 [useJuntasFlowStore] updateDynamicSubSteps: (2) ['remocion-gerente', 'remocion-directores']
 🟢 [useJuntasFlowStore] selectedSubSteps actualizado: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] dynamicSubSteps desde store: Proxy(Array) {0: 'remocion-gerente', 1: 'remocion-directores'}
 🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'
 🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS: 13
 🟡 [juntaNavigation] Sub-step 'aporte-dinerarios': EXCLUIDO
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
 🟡 [juntaNavigation] Sub-steps filtrados: 2 (2) ['remocion-gerente', 'remocion-directores']
 🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🔴 [useJuntasSidebarExpansion] Watch steps cambiaron
 🔴 [useJuntasSidebarExpansion] Old steps count: 6
 🔴 [useJuntasSidebarExpansion] New steps count: 6
 🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps: {old: 2, new: 2}
 🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado
 🔴 [useJuntasSidebarExpansion] steps: Proxy(Array) {0: {…}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}
 🔴 [useJuntasSidebarExpansion] currentStepId: seleccion-agenda
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps: 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 [Repository][SociedadHttp] list():response {count: 5}
 [Store][SociedadHistorial] Sociedades obtenidas (5) [{…}, {…}, {…}, {…}, {…}]
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] delete() executed 5
 [Store][SociedadHistorial] Sociedad eliminada 5
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] delete() executed 4
 [Store][SociedadHistorial] Sociedad eliminada 4
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] delete() executed 3
 [Store][SociedadHistorial] Sociedad eliminada 3
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] delete() executed 2
 [Store][SociedadHistorial] Sociedad eliminada 2
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] delete() executed 1
 [Store][SociedadHistorial] Sociedad eliminada 1
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 [Repository][SociedadHttp] list():error {url: 'http://localhost:3000/api/v2/society-profile/list', statusCode: 404, message: 'Society Profile not found with criteria: No societies found for the user'}
list @ sociedad.http.repository.ts:141
await in list
execute @ list-sociedades.use-case.ts:6
cargarHistorial @ sociedad-historial.store.ts:56
eliminarTodasLasSociedades @ sociedad-historial.store.ts:117
await in eliminarTodasLasSociedades
wrappedAction @ pinia.mjs?v=7e67ddf4:1067
store.<computed> @ pinia.mjs?v=7e67ddf4:761
handleDeleteAll @ historial.vue:99
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:204
invoker @ runtime-dom.esm-bund…r.js?v=7e67ddf4:721
 [SociedadHistorialStore] Error al cargar sociedades: {statusCode: 404, message: 'Society Profile not found with criteria: No societies found for the user'}
cargarHistorial @ sociedad-historial.store.ts:63
await in cargarHistorial
eliminarTodasLasSociedades @ sociedad-historial.store.ts:117
await in eliminarTodasLasSociedades
wrappedAction @ pinia.mjs?v=7e67ddf4:1067
store.<computed> @ pinia.mjs?v=7e67ddf4:761
handleDeleteAll @ historial.vue:99
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=7e67ddf4:204
invoker @ runtime-dom.esm-bund…r.js?v=7e67ddf4:721
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] create() response {success: true, message: 'Sociedad creada correctamente.', data: {…}, code: 201}
 [Store][SociedadHistorial] Sociedad creada con id 6
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 [Repository][SociedadHttp] list():response {count: 1}
 [Store][SociedadHistorial] Sociedades obtenidas [{…}]
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000165",
  "razonSocial": "Empresa Test 1",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Empresa Test 1 S.A.C.",
  "direccion": "Av. Principal 1",
  "distrito": "San Isidro",
  "provincia": "Lima",
  "departamento": "Lima",
  "fechaRegistro": "2024-01-01",
  "actividadExtranjera": "Comercio",
  "fechaEscritura": "2024-01-01",
  "oficinaRegistral": "LIM",
  "partidaRegistral": "12340"
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DatosSociedadHttp] create() {idSociety: '6', payload: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DatosSociedadHttp] get() {idSociety: '6', response: {…}}
 [DatosSociedadMapper] toDomain() input: {
  "ruc": "20000000165",
  "reasonSocial": "Empresa Test 1",
  "typeSociety": null,
  "commercialName": "Empresa Test 1 S.A.C.",
  "address": "Av. Principal 1",
  "district": "San Isidro",
  "province": "Lima",
  "department": "Lima",
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "foreignActivity": "Comercio",
  "publicDeedDate": "2024-01-01T00:00:00.000Z",
  "registryOffice": "LIM",
  "registrationRecord": "12340"
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/6/shareholder', personaTipo: 'NATURAL'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/6/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/6/shareholder', personaTipo: 'NATURAL'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/6/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/6/acction', payload: '{\n  "id": "c2160e94-0e2a-4667-ac13-87a18e291e21",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/6/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "c2160e94-0e2a-4667-ac13-87a18e291e21",
        "tipo": "COMUN",
        "cantidadSuscrita": 500,
        "redimible": true,
        "conDerechoVoto": false
      }
    ],
    "paginacion": {
      "tieneSiguientePagina": false,
      "cantidad": 1
    }
  },
  "code": 200
}
 [Repository][AccionesHttp] list:mapped {count: 1}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/6/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/6/quorum', societyProfileId: '6'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] get:response {
  "success": true,
  "message": "Quórum obtenido correctamente",
  "data": {
    "primeraConvocatoriaSimple": 60,
    "primeraConvocatoriaCalificada": 60,
    "segundaConvocatoriaSimple": 66,
    "segundaConvocatoriaCalificada": 66,
    "quorumMinimoSimple": 50,
    "quorumMinimoCalificado": 60
  },
  "code": 200
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/6/directorio/directores', societyProfileId: '6', rolDirector: 'titular', payload: '{\n  "id": "096220fc-7fbe-445b-9e87-fb0bab43d303",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "096220fc-7fbe-445b-9e87-fb0bab43d303",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/6/directorio/directores', societyProfileId: '6', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 1, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 1}
 [Repository][DirectorHttp] create:success-fallback {directorId: '096220fc-7fbe-445b-9e87-fb0bab43d303'}
 [Seeds] Primer director titular encontrado, ID: 096220fc-7fbe-445b-9e87-fb0bab43d303
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/6/directorio/directores', societyProfileId: '6', rolDirector: 'titular', payload: '{\n  "id": "7384d81d-1882-4093-abff-960a4b306a95",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "7384d81d-1882-4093-abff-960a4b306a95",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/6/directorio/directores', societyProfileId: '6', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 2, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 2}
 [Repository][DirectorHttp] create:success-fallback {directorId: '7384d81d-1882-4093-abff-960a4b306a95'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/6/directorio/directores', societyProfileId: '6', rolDirector: 'titular', payload: '{\n  "id": "3d8a4273-d3b7-44e5-aeca-81863ddb069c",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "3d8a4273-d3b7-44e5-aeca-81863ddb069c",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/6/directorio/directores', societyProfileId: '6', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 3, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 3}
 [Repository][DirectorHttp] create:success-fallback {directorId: '3d8a4273-d3b7-44e5-aeca-81863ddb069c'}
 [Seeds] Directores creados: 3, IDs: (3) ['096220fc-7fbe-445b-9e87-fb0bab43d303', '7384d81d-1882-4093-abff-960a4b306a95', '3d8a4273-d3b7-44e5-aeca-81863ddb069c']
 [Seeds] Configurando directorio para sociedad 6 {cantidadDirectores: 3, conteoPersonalizado: false, minimoDirectores: null, maximoDirectores: null, inicioMandato: '01-01-2025', …}
 [DirectorioMapper] toPayload {input: {…}, output: {…}, periodoInput: '1', periodoBackend: 'ONE_YEAR', cantidadBase: 3, …}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorioHttp] update:request {url: 'http://localhost:3000/api/v2/society-profile/6/directorio', directorioId: undefined, originalPayload: {…}, transformedPayload: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorioHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/6/directorio'}
 [Seeds] Directorio configurado exitosamente con presidenteId: 096220fc-7fbe-445b-9e87-fb0bab43d303
 [Seeds] Creando clase de apoderado para sociedad 6 {id: '20ca8684-e8c3-482f-bef3-ae38d71d1768', nombre: 'Gerente General'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Seeds] Clase de apoderado creada: {id: '20ca8684-e8c3-482f-bef3-ae38d71d1768', nombre: 'Gerente General', apoderados: undefined, createdAt: undefined, updatedAt: undefined}
 [Seeds] Creando apoderado para sociedad 6 {id: '90dca2fc-2970-4b1a-834e-bc38e2523435', claseApoderadoId: '20ca8684-e8c3-482f-bef3-ae38d71d1768', persona: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Seeds] Apoderado creado exitosamente
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] create() response {success: true, message: 'Sociedad creada correctamente.', data: {…}, code: 201}
 [Store][SociedadHistorial] Sociedad creada con id 7
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 [Repository][SociedadHttp] list():response {count: 2}
 [Store][SociedadHistorial] Sociedades obtenidas (2) [{…}, {…}]
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000243",
  "razonSocial": "Empresa Test 2",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Empresa Test 2 S.A.C.",
  "direccion": "Av. Principal 2",
  "distrito": "San Isidro",
  "provincia": "Lima",
  "departamento": "Lima",
  "fechaRegistro": "2024-01-01",
  "actividadExtranjera": "Comercio",
  "fechaEscritura": "2024-01-01",
  "oficinaRegistral": "LIM",
  "partidaRegistral": "12341"
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DatosSociedadHttp] create() {idSociety: '7', payload: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DatosSociedadHttp] get() {idSociety: '7', response: {…}}
 [DatosSociedadMapper] toDomain() input: {
  "ruc": "20000000243",
  "reasonSocial": "Empresa Test 2",
  "typeSociety": null,
  "commercialName": "Empresa Test 2 S.A.C.",
  "address": "Av. Principal 2",
  "district": "San Isidro",
  "province": "Lima",
  "department": "Lima",
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "foreignActivity": "Comercio",
  "publicDeedDate": "2024-01-01T00:00:00.000Z",
  "registryOffice": "LIM",
  "registrationRecord": "12341"
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/7/shareholder', personaTipo: 'NATURAL'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/7/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/7/shareholder', personaTipo: 'NATURAL'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/7/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/7/acction', payload: '{\n  "id": "bdef9ddd-9fd4-4ef1-b9d4-f2d2c5fe608e",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/7/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "bdef9ddd-9fd4-4ef1-b9d4-f2d2c5fe608e",
        "tipo": "COMUN",
        "cantidadSuscrita": 500,
        "redimible": true,
        "conDerechoVoto": false
      }
    ],
    "paginacion": {
      "tieneSiguientePagina": false,
      "cantidad": 1
    }
  },
  "code": 200
}
 [Repository][AccionesHttp] list:mapped {count: 1}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/7/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/7/quorum', societyProfileId: '7'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] get:response {
  "success": true,
  "message": "Quórum obtenido correctamente",
  "data": {
    "primeraConvocatoriaSimple": 60,
    "primeraConvocatoriaCalificada": 60,
    "segundaConvocatoriaSimple": 66,
    "segundaConvocatoriaCalificada": 66,
    "quorumMinimoSimple": 50,
    "quorumMinimoCalificado": 60
  },
  "code": 200
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/7/directorio/directores', societyProfileId: '7', rolDirector: 'titular', payload: '{\n  "id": "92ac72bf-0de1-47e5-b930-0008d62d6441",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "92ac72bf-0de1-47e5-b930-0008d62d6441",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/7/directorio/directores', societyProfileId: '7', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 1, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 1}
 [Repository][DirectorHttp] create:success-fallback {directorId: '92ac72bf-0de1-47e5-b930-0008d62d6441'}
 [Seeds] Primer director titular encontrado, ID: 92ac72bf-0de1-47e5-b930-0008d62d6441
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/7/directorio/directores', societyProfileId: '7', rolDirector: 'titular', payload: '{\n  "id": "417ff0ed-41cb-44c4-8e21-f2132172ab5c",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "417ff0ed-41cb-44c4-8e21-f2132172ab5c",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/7/directorio/directores', societyProfileId: '7', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 2, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 2}
 [Repository][DirectorHttp] create:success-fallback {directorId: '417ff0ed-41cb-44c4-8e21-f2132172ab5c'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/7/directorio/directores', societyProfileId: '7', rolDirector: 'titular', payload: '{\n  "id": "554c1a3a-9b69-4a8f-97f2-35169064dcb9",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "554c1a3a-9b69-4a8f-97f2-35169064dcb9",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/7/directorio/directores', societyProfileId: '7', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 3, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 3}
 [Repository][DirectorHttp] create:success-fallback {directorId: '554c1a3a-9b69-4a8f-97f2-35169064dcb9'}
 [Seeds] Directores creados: 3, IDs: (3) ['92ac72bf-0de1-47e5-b930-0008d62d6441', '417ff0ed-41cb-44c4-8e21-f2132172ab5c', '554c1a3a-9b69-4a8f-97f2-35169064dcb9']
 [Seeds] Configurando directorio para sociedad 7 {cantidadDirectores: 3, conteoPersonalizado: false, minimoDirectores: null, maximoDirectores: null, inicioMandato: '01-01-2025', …}
 [DirectorioMapper] toPayload {input: {…}, output: {…}, periodoInput: '1', periodoBackend: 'ONE_YEAR', cantidadBase: 3, …}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorioHttp] update:request {url: 'http://localhost:3000/api/v2/society-profile/7/directorio', directorioId: undefined, originalPayload: {…}, transformedPayload: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorioHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/7/directorio'}
 [Seeds] Directorio configurado exitosamente con presidenteId: 92ac72bf-0de1-47e5-b930-0008d62d6441
 [Seeds] Creando clase de apoderado para sociedad 7 {id: 'c0b48827-8745-406e-82dd-be64ccb7b591', nombre: 'Gerente General'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Seeds] Clase de apoderado creada: {id: 'c0b48827-8745-406e-82dd-be64ccb7b591', nombre: 'Gerente General', apoderados: undefined, createdAt: undefined, updatedAt: undefined}
 [Seeds] Creando apoderado para sociedad 7 {id: '0f2bef30-614d-4da1-9669-3b430c6ed7a7', claseApoderadoId: 'c0b48827-8745-406e-82dd-be64ccb7b591', persona: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Seeds] Apoderado creado exitosamente
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] create() response {success: true, message: 'Sociedad creada correctamente.', data: {…}, code: 201}
 [Store][SociedadHistorial] Sociedad creada con id 8
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
 [Repository][SociedadHttp] list():response {count: 3}
 [Store][SociedadHistorial] Sociedades obtenidas (3) [{…}, {…}, {…}]
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000314",
  "razonSocial": "Empresa Test 3",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Empresa Test 3 S.A.C.",
  "direccion": "Av. Principal 3",
  "distrito": "San Isidro",
  "provincia": "Lima",
  "departamento": "Lima",
  "fechaRegistro": "2024-01-01",
  "actividadExtranjera": "Comercio",
  "fechaEscritura": "2024-01-01",
  "oficinaRegistral": "LIM",
  "partidaRegistral": "12342"
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DatosSociedadHttp] create() {idSociety: '8', payload: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DatosSociedadHttp] get() {idSociety: '8', response: {…}}
 [DatosSociedadMapper] toDomain() input: {
  "ruc": "20000000314",
  "reasonSocial": "Empresa Test 3",
  "typeSociety": null,
  "commercialName": "Empresa Test 3 S.A.C.",
  "address": "Av. Principal 3",
  "district": "San Isidro",
  "province": "Lima",
  "department": "Lima",
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "foreignActivity": "Comercio",
  "publicDeedDate": "2024-01-01T00:00:00.000Z",
  "registryOffice": "LIM",
  "registrationRecord": "12342"
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/8/shareholder', personaTipo: 'NATURAL'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/8/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/8/shareholder', personaTipo: 'NATURAL'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/8/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/8/acction', payload: '{\n  "id": "7e43579d-bee1-478e-835d-58e490ff1b21",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/8/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "7e43579d-bee1-478e-835d-58e490ff1b21",
        "tipo": "COMUN",
        "cantidadSuscrita": 500,
        "redimible": true,
        "conDerechoVoto": false
      }
    ],
    "paginacion": {
      "tieneSiguientePagina": false,
      "cantidad": 1
    }
  },
  "code": 200
}
 [Repository][AccionesHttp] list:mapped {count: 1}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/8/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/8/quorum', societyProfileId: '8'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][QuorumHttp] get:response {
  "success": true,
  "message": "Quórum obtenido correctamente",
  "data": {
    "primeraConvocatoriaSimple": 60,
    "primeraConvocatoriaCalificada": 60,
    "segundaConvocatoriaSimple": 66,
    "segundaConvocatoriaCalificada": 66,
    "quorumMinimoSimple": 50,
    "quorumMinimoCalificado": 60
  },
  "code": 200
}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/8/directorio/directores', societyProfileId: '8', rolDirector: 'titular', payload: '{\n  "id": "0bcbc51e-48d7-4a47-9c4c-e2ef5b61ce26",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "0bcbc51e-48d7-4a47-9c4c-e2ef5b61ce26",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/8/directorio/directores', societyProfileId: '8', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 1, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 1}
 [Repository][DirectorHttp] create:success-fallback {directorId: '0bcbc51e-48d7-4a47-9c4c-e2ef5b61ce26'}
 [Seeds] Primer director titular encontrado, ID: 0bcbc51e-48d7-4a47-9c4c-e2ef5b61ce26
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/8/directorio/directores', societyProfileId: '8', rolDirector: 'titular', payload: '{\n  "id": "8934be83-e8e8-4259-af64-d47f537d6f23",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "8934be83-e8e8-4259-af64-d47f537d6f23",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/8/directorio/directores', societyProfileId: '8', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 2, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 2}
 [Repository][DirectorHttp] create:success-fallback {directorId: '8934be83-e8e8-4259-af64-d47f537d6f23'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/8/directorio/directores', societyProfileId: '8', rolDirector: 'titular', payload: '{\n  "id": "49692ded-9b36-4400-8d70-4cfab1f179d2",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "49692ded-9b36-4400-8d70-4cfab1f179d2",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/8/directorio/directores', societyProfileId: '8', config: {…}}
 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
 [Repository][DirectorHttp] get:processing {listLength: 3, firstItem: {…}}
 [Repository][DirectorHttp] get:success {count: 3}
 [Repository][DirectorHttp] create:success-fallback {directorId: '49692ded-9b36-4400-8d70-4cfab1f179d2'}
 [Seeds] Directores creados: 3, IDs: (3) ['0bcbc51e-48d7-4a47-9c4c-e2ef5b61ce26', '8934be83-e8e8-4259-af64-d47f537d6f23', '49692ded-9b36-4400-8d70-4cfab1f179d2']
 [Seeds] Configurando directorio para sociedad 8 {cantidadDirectores: 3, conteoPersonalizado: true, minimoDirectores: 3, maximoDirectores: 5, inicioMandato: '01-01-2025', …}
 [DirectorioMapper] toPayload {input: {…}, output: {…}, periodoInput: '1', periodoBackend: 'ONE_YEAR', cantidadBase: 3, …}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorioHttp] update:request {url: 'http://localhost:3000/api/v2/society-profile/8/directorio', directorioId: undefined, originalPayload: {…}, transformedPayload: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Repository][DirectorioHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/8/directorio'}
 [Seeds] Directorio configurado exitosamente con presidenteId: 0bcbc51e-48d7-4a47-9c4c-e2ef5b61ce26
 [Seeds] Creando clase de apoderado para sociedad 8 {id: 'ca359e68-54fa-47bf-a128-6957d0248416', nombre: 'Gerente General'}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Seeds] Clase de apoderado creada: {id: 'ca359e68-54fa-47bf-a128-6957d0248416', nombre: 'Gerente General', apoderados: undefined, createdAt: undefined, updatedAt: undefined}
 [Seeds] Creando apoderado para sociedad 8 {id: '9a48a73e-df9a-4ac1-8a8d-1cca7f733677', claseApoderadoId: 'ca359e68-54fa-47bf-a128-6957d0248416', persona: {…}}
 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
 [Seeds] Apoderado creado exitosamente
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
sociedad.http.repository.ts:184 [Repository][SociedadHttp] create() response {success: true, message: 'Sociedad creada correctamente.', data: {…}, code: 201}
sociedad-historial.store.ts:96 [Store][SociedadHistorial] Sociedad creada con id 9
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
sociedad.http.repository.ts:213 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
sociedad.http.repository.ts:227 [Repository][SociedadHttp] list():response {count: 4}
sociedad-historial.store.ts:70 [Store][SociedadHistorial] Sociedades obtenidas (4) [{…}, {…}, {…}, {…}]
datos-sociedad.http.repository.ts:82 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000432",
  "razonSocial": "Empresa Test 4",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Empresa Test 4 S.A.C.",
  "direccion": "Av. Principal 4",
  "distrito": "San Isidro",
  "provincia": "Lima",
  "departamento": "Lima",
  "fechaRegistro": "2024-01-01",
  "actividadExtranjera": "Comercio",
  "fechaEscritura": "2024-01-01",
  "oficinaRegistral": "LIM",
  "partidaRegistral": "12343"
}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
datos-sociedad.http.repository.ts:93 [Repository][DatosSociedadHttp] create() {idSociety: '9', payload: {…}}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
datos-sociedad.http.repository.ts:72 [Repository][DatosSociedadHttp] get() {idSociety: '9', response: {…}}
datos-sociedad.mapper.ts:70 [DatosSociedadMapper] toDomain() input: {
  "ruc": "20000000432",
  "reasonSocial": "Empresa Test 4",
  "typeSociety": null,
  "commercialName": "Empresa Test 4 S.A.C.",
  "address": "Av. Principal 4",
  "district": "San Isidro",
  "province": "Lima",
  "department": "Lima",
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "foreignActivity": "Comercio",
  "publicDeedDate": "2024-01-01T00:00:00.000Z",
  "registryOffice": "LIM",
  "registrationRecord": "12343"
}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/9/shareholder', personaTipo: 'NATURAL'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/9/shareholder'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] list:success {count: 1}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/9/shareholder', personaTipo: 'NATURAL'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/9/shareholder'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] list:success {count: 2}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
acciones.http.repository.ts:66 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/9/acction', payload: '{\n  "id": "fea592e4-6636-4a9e-b6d5-16b974d32996",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
acciones.http.repository.ts:68 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
acciones.http.repository.ts:36 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/9/acction'}
acciones.http.repository.ts:38 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "fea592e4-6636-4a9e-b6d5-16b974d32996",
        "tipo": "COMUN",
        "cantidadSuscrita": 500,
        "redimible": true,
        "conDerechoVoto": false
      }
    ],
    "paginacion": {
      "tieneSiguientePagina": false,
      "cantidad": 1
    }
  },
  "code": 200
}
acciones.http.repository.ts:42 [Repository][AccionesHttp] list:mapped {count: 1}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
quorum.http.repository.ts:75 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/9/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
quorum.http.repository.ts:83 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
quorum.http.repository.ts:46 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/9/quorum', societyProfileId: '9'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
quorum.http.repository.ts:51 [Repository][QuorumHttp] get:response {
  "success": true,
  "message": "Quórum obtenido correctamente",
  "data": {
    "primeraConvocatoriaSimple": 60,
    "primeraConvocatoriaCalificada": 60,
    "segundaConvocatoriaSimple": 66,
    "segundaConvocatoriaCalificada": 66,
    "quorumMinimoSimple": 50,
    "quorumMinimoCalificado": 60
  },
  "code": 200
}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/9/directorio/directores', societyProfileId: '9', rolDirector: 'titular', payload: '{\n  "id": "bb48ebcb-4b11-43e7-bb14-2b08c150422e",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "bb48ebcb-4b11-43e7-bb14-2b08c150422e",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/9/directorio/directores', societyProfileId: '9', config: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
director.http.repository.ts:49 [Repository][DirectorHttp] get:processing {listLength: 1, firstItem: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:success {count: 1}
director.http.repository.ts:49 [Repository][DirectorHttp] create:success-fallback {directorId: 'bb48ebcb-4b11-43e7-bb14-2b08c150422e'}
seeds-sociedades.vue:533 [Seeds] Primer director titular encontrado, ID: bb48ebcb-4b11-43e7-bb14-2b08c150422e
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/9/directorio/directores', societyProfileId: '9', rolDirector: 'titular', payload: '{\n  "id": "d9ab2bef-540e-4301-b7e7-fcebf33e8621",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "d9ab2bef-540e-4301-b7e7-fcebf33e8621",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/9/directorio/directores', societyProfileId: '9', config: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
director.http.repository.ts:49 [Repository][DirectorHttp] get:processing {listLength: 2, firstItem: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:success {count: 2}
director.http.repository.ts:49 [Repository][DirectorHttp] create:success-fallback {directorId: 'd9ab2bef-540e-4301-b7e7-fcebf33e8621'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/9/directorio/directores', societyProfileId: '9', rolDirector: 'titular', payload: '{\n  "id": "adfa5f48-10a9-4960-bed2-95eea0f0d6e7",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "adfa5f48-10a9-4960-bed2-95eea0f0d6e7",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/9/directorio/directores', societyProfileId: '9', config: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
director.http.repository.ts:49 [Repository][DirectorHttp] get:processing {listLength: 3, firstItem: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:success {count: 3}
director.http.repository.ts:49 [Repository][DirectorHttp] create:success-fallback {directorId: 'adfa5f48-10a9-4960-bed2-95eea0f0d6e7'}
seeds-sociedades.vue:540 [Seeds] Directores creados: 3, IDs: (3) ['bb48ebcb-4b11-43e7-bb14-2b08c150422e', 'd9ab2bef-540e-4301-b7e7-fcebf33e8621', 'adfa5f48-10a9-4960-bed2-95eea0f0d6e7']
seeds-sociedades.vue:556 [Seeds] Configurando directorio para sociedad 9 {cantidadDirectores: 3, conteoPersonalizado: true, minimoDirectores: 3, maximoDirectores: 7, inicioMandato: '01-01-2025', …}
directorio.mapper.ts:172 [DirectorioMapper] toPayload {input: {…}, output: {…}, periodoInput: '1', periodoBackend: 'ONE_YEAR', cantidadBase: 3, …}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
directorio.http.repository.ts:40 [Repository][DirectorioHttp] update:request {url: 'http://localhost:3000/api/v2/society-profile/9/directorio', directorioId: undefined, originalPayload: {…}, transformedPayload: {…}}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
directorio.http.repository.ts:40 [Repository][DirectorioHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/9/directorio'}
seeds-sociedades.vue:561 [Seeds] Directorio configurado exitosamente con presidenteId: bb48ebcb-4b11-43e7-bb14-2b08c150422e
seeds-sociedades.vue:574 [Seeds] Creando clase de apoderado para sociedad 9 {id: 'b6e2ab21-dd56-4c91-88d6-dbe5382b5f57', nombre: 'Gerente General'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
seeds-sociedades.vue:582 [Seeds] Clase de apoderado creada: {id: 'b6e2ab21-dd56-4c91-88d6-dbe5382b5f57', nombre: 'Gerente General', apoderados: undefined, createdAt: undefined, updatedAt: undefined}
seeds-sociedades.vue:595 [Seeds] Creando apoderado para sociedad 9 {id: 'e52ac861-a1b5-48ba-94aa-6ec877df1612', claseApoderadoId: 'b6e2ab21-dd56-4c91-88d6-dbe5382b5f57', persona: {…}}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
seeds-sociedades.vue:600 [Seeds] Apoderado creado exitosamente
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
sociedad.http.repository.ts:184 [Repository][SociedadHttp] create() response {success: true, message: 'Sociedad creada correctamente.', data: {…}, code: 201}
sociedad-historial.store.ts:96 [Store][SociedadHistorial] Sociedad creada con id 10
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
sociedad.http.repository.ts:213 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
sociedad.http.repository.ts:227 [Repository][SociedadHttp] list():response {count: 5}
sociedad-historial.store.ts:70 [Store][SociedadHistorial] Sociedades obtenidas (5) [{…}, {…}, {…}, {…}, {…}]
datos-sociedad.http.repository.ts:82 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000585",
  "razonSocial": "Empresa Test 5",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Empresa Test 5 S.A.C.",
  "direccion": "Av. Principal 5",
  "distrito": "San Isidro",
  "provincia": "Lima",
  "departamento": "Lima",
  "fechaRegistro": "2024-01-01",
  "actividadExtranjera": "Comercio",
  "fechaEscritura": "2024-01-01",
  "oficinaRegistral": "LIM",
  "partidaRegistral": "12344"
}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
datos-sociedad.http.repository.ts:93 [Repository][DatosSociedadHttp] create() {idSociety: '10', payload: {…}}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
datos-sociedad.http.repository.ts:72 [Repository][DatosSociedadHttp] get() {idSociety: '10', response: {…}}
datos-sociedad.mapper.ts:70 [DatosSociedadMapper] toDomain() input: {
  "ruc": "20000000585",
  "reasonSocial": "Empresa Test 5",
  "typeSociety": null,
  "commercialName": "Empresa Test 5 S.A.C.",
  "address": "Av. Principal 5",
  "district": "San Isidro",
  "province": "Lima",
  "department": "Lima",
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "foreignActivity": "Comercio",
  "publicDeedDate": "2024-01-01T00:00:00.000Z",
  "registryOffice": "LIM",
  "registrationRecord": "12344"
}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/shareholder', personaTipo: 'NATURAL'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/10/shareholder'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] list:success {count: 1}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/shareholder', personaTipo: 'NATURAL'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/10/shareholder'}
accionistas.http.repository.ts:46 [Repository][AccionistasHttp] list:success {count: 2}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
acciones.http.repository.ts:66 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/acction', payload: '{\n  "id": "deb4d37d-9dac-4164-9203-c1712a6fea3d",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
acciones.http.repository.ts:68 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
acciones.http.repository.ts:36 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/10/acction'}
acciones.http.repository.ts:38 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "deb4d37d-9dac-4164-9203-c1712a6fea3d",
        "tipo": "COMUN",
        "cantidadSuscrita": 500,
        "redimible": true,
        "conDerechoVoto": false
      }
    ],
    "paginacion": {
      "tieneSiguientePagina": false,
      "cantidad": 1
    }
  },
  "code": 200
}
acciones.http.repository.ts:42 [Repository][AccionesHttp] list:mapped {count: 1}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
quorum.http.repository.ts:75 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
quorum.http.repository.ts:83 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
quorum.http.repository.ts:46 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/10/quorum', societyProfileId: '10'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
quorum.http.repository.ts:51 [Repository][QuorumHttp] get:response {
  "success": true,
  "message": "Quórum obtenido correctamente",
  "data": {
    "primeraConvocatoriaSimple": 60,
    "primeraConvocatoriaCalificada": 60,
    "segundaConvocatoriaSimple": 66,
    "segundaConvocatoriaCalificada": 66,
    "quorumMinimoSimple": 50,
    "quorumMinimoCalificado": 60
  },
  "code": 200
}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', rolDirector: 'titular', payload: '{\n  "id": "cb3f95e6-eb53-4467-853c-9c587b07a116",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "cb3f95e6-eb53-4467-853c-9c587b07a116",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', config: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
director.http.repository.ts:49 [Repository][DirectorHttp] get:processing {listLength: 1, firstItem: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:success {count: 1}
director.http.repository.ts:49 [Repository][DirectorHttp] create:success-fallback {directorId: 'cb3f95e6-eb53-4467-853c-9c587b07a116'}
seeds-sociedades.vue:533 [Seeds] Primer director titular encontrado, ID: cb3f95e6-eb53-4467-853c-9c587b07a116
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', rolDirector: 'titular', payload: '{\n  "id": "7be5699a-5b2c-418a-ae8f-95a81790f05a",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "7be5699a-5b2c-418a-ae8f-95a81790f05a",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', config: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
director.http.repository.ts:49 [Repository][DirectorHttp] get:processing {listLength: 2, firstItem: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:success {count: 2}
director.http.repository.ts:49 [Repository][DirectorHttp] create:success-fallback {directorId: '7be5699a-5b2c-418a-ae8f-95a81790f05a'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', rolDirector: 'titular', payload: '{\n  "id": "524fd429-a9d2-4b0f-a9aa-d7854a1fbc0b",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "524fd429-a9d2-4b0f-a9aa-d7854a1fbc0b",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', config: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
director.http.repository.ts:49 [Repository][DirectorHttp] get:processing {listLength: 3, firstItem: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:success {count: 3}
director.http.repository.ts:49 [Repository][DirectorHttp] create:success-fallback {directorId: '524fd429-a9d2-4b0f-a9aa-d7854a1fbc0b'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', rolDirector: 'titular', payload: '{\n  "id": "1d8c015a-05e1-48e5-a688-a86c011a081a",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "1d8c015a-05e1-48e5-a688-a86c011a081a",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', config: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
director.http.repository.ts:49 [Repository][DirectorHttp] get:processing {listLength: 4, firstItem: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:success {count: 4}
director.http.repository.ts:49 [Repository][DirectorHttp] create:success-fallback {directorId: '1d8c015a-05e1-48e5-a688-a86c011a081a'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', rolDirector: 'titular', payload: '{\n  "id": "a64d2b9f-4556-4524-8aac-908e9a843695",\n…sEmision": "PE"\n  },\n  "rolDirector": "titular"\n}', mappedPayload: '{\n  "id": "a64d2b9f-4556-4524-8aac-908e9a843695",\n…sEmision": "PE"\n  },\n  "rolDirector": "TITULAR"\n}'}
director.http.repository.ts:49 [Repository][DirectorHttp] create:response {response: {…}, hasData: false}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
director.http.repository.ts:49 [Repository][DirectorHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio/directores', societyProfileId: '10', config: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:response {response: {…}, hasData: true, responseKeys: Array(4), dataType: 'object', isArray: false, …}
director.http.repository.ts:49 [Repository][DirectorHttp] get:processing {listLength: 5, firstItem: {…}}
director.http.repository.ts:49 [Repository][DirectorHttp] get:success {count: 5}
director.http.repository.ts:49 [Repository][DirectorHttp] create:success-fallback {directorId: 'a64d2b9f-4556-4524-8aac-908e9a843695'}
seeds-sociedades.vue:540 [Seeds] Directores creados: 5, IDs: (5) ['cb3f95e6-eb53-4467-853c-9c587b07a116', '7be5699a-5b2c-418a-ae8f-95a81790f05a', '524fd429-a9d2-4b0f-a9aa-d7854a1fbc0b', '1d8c015a-05e1-48e5-a688-a86c011a081a', 'a64d2b9f-4556-4524-8aac-908e9a843695']
seeds-sociedades.vue:556 [Seeds] Configurando directorio para sociedad 10 {cantidadDirectores: 5, conteoPersonalizado: false, minimoDirectores: null, maximoDirectores: null, inicioMandato: '01-01-2025', …}
directorio.mapper.ts:172 [DirectorioMapper] toPayload {input: {…}, output: {…}, periodoInput: '1', periodoBackend: 'ONE_YEAR', cantidadBase: 5, …}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
directorio.http.repository.ts:40 [Repository][DirectorioHttp] update:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio', directorioId: undefined, originalPayload: {…}, transformedPayload: {…}}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
directorio.http.repository.ts:40 [Repository][DirectorioHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/10/directorio'}
seeds-sociedades.vue:561 [Seeds] Directorio configurado exitosamente con presidenteId: cb3f95e6-eb53-4467-853c-9c587b07a116
seeds-sociedades.vue:574 [Seeds] Creando clase de apoderado para sociedad 10 {id: '99ce774c-9c4c-4ca8-96b8-bf0520a3bf61', nombre: 'Gerente General'}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
seeds-sociedades.vue:582 [Seeds] Clase de apoderado creada: {id: '99ce774c-9c4c-4ca8-96b8-bf0520a3bf61', nombre: 'Gerente General', apoderados: undefined, createdAt: undefined, updatedAt: undefined}
seeds-sociedades.vue:595 [Seeds] Creando apoderado para sociedad 10 {id: 'ae13e8f4-d85e-4e20-86b8-d8000d21af67', claseApoderadoId: '99ce774c-9c4c-4ca8-96b8-bf0520a3bf61', persona: {…}}
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
seeds-sociedades.vue:600 [Seeds] Apoderado creado exitosamente
with-auth-headers.ts:54 [withAuthHeaders] Token aplicado {hasSessionToken: true, usingFallbackToken: false, preview: 'eyJhbG…xfqM'}
sociedad.http.repository.ts:213 [Repository][SociedadHttp] list():request {url: 'http://localhost:3000/api/v2/society-profile/list', hasAuthHeader: false, tokenPreview: null}
sociedad.http.repository.ts:227 [Repository][SociedadHttp] list():response {count: 5}
sociedad-historial.store.ts:70 [Store][SociedadHistorial] Sociedades obtenidas (5) [{…}, {…}, {…}, {…}, {…}]
