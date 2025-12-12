 mswDisabled true
 <Suspense> is an experimental feature and its API will likely change.
 ✨ Nuxt DevTools  Press Shift + Alt + D to open DevTools 
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🚀 [onMounted] useTheme MONTADO
   🌍 true: true
   📄 typeof document: object
   📄 typeof window: object
   💾 Intentando cargar desde localStorage...
     - Valor en localStorage: null
   ℹ️ No hay tema válido, usando default: light
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
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <Almacen onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/almacen" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/almacen', hash: '', query: {…}, name: 'storage-almacen', path: '/storage/almacen', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
baseWatchOptions.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:6314
effect2.scheduler @ reactivity.esm-bundl….js?v=e57cfd2b:1773
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
ref @ reka-ui.js?v=e57cfd2b:4473
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setRef @ runtime-core.esm-bun….js?v=e57cfd2b:1607
(anonymous) @ runtime-core.esm-bun….js?v=e57cfd2b:1546
setRef @ runtime-core.esm-bun….js?v=e57cfd2b:1545
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4831
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
Promise.then
registerDep @ runtime-core.esm-bun….js?v=e57cfd2b:7293
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5316
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:6926
process @ runtime-core.esm-bun….js?v=e57cfd2b:6867
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
processFragment @ runtime-core.esm-bun….js?v=e57cfd2b:5205
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4763
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:6926
process @ runtime-core.esm-bun….js?v=e57cfd2b:6867
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
render @ runtime-core.esm-bun….js?v=e57cfd2b:6086
mount @ runtime-core.esm-bun….js?v=e57cfd2b:4021
app.mount @ runtime-dom.esm-bund….js?v=e57cfd2b:1774
initApp @ entry.js?v=e57cfd2b:65
await in initApp
(anonymous) @ entry.js?v=e57cfd2b:73
 🍍 "repositorio-dashboard" store installed 🆕
 🍍 "registros-sociedad-historial" store installed 🆕
 🟢 [RepositorioDashboardStore] Seleccionando sociedad: 10
 🟢 [RepositorioDashboardStore] Sociedad mapeada: {id: '10', nombre: 'Empresa Test 5', rut: '20000000582', tipo: 'Sociedad Anónima Cerrada (S.A.C.)', activa: false}
 🟢 [RepositorioDashboardStore] Sociedad seleccionada actualizada en store
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(0), oldPath: undefined}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: null, structureId: '10'}
 🔵 [AlmacenView] Obteniendo carpeta /core/ para subir archivos...
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
patchBlockChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5145
patchElement @ runtime-core.esm-bun….js?v=e57cfd2b:5063
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4922
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
baseWatchOptions.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:6314
effect2.scheduler @ reactivity.esm-bundl….js?v=e57cfd2b:1773
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:695
set @ reactivity.esm-bundler.js?v=e57cfd2b:983
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1511
set @ reactivity.esm-bundler.js?v=e57cfd2b:967
set @ pinia.mjs?v=e57cfd2b:757
seleccionarSociedad @ repositorio-dashboard.store.ts:74
wrappedAction @ pinia.mjs?v=e57cfd2b:1067
store.<computed> @ pinia.mjs?v=e57cfd2b:761
seleccionarSociedad @ SocietySelector.vue:39
onClick @ SocietySelector.vue:325
(anonymous) @ runtime-dom.esm-bund…r.js?v=e57cfd2b:750
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:215
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🍍 "almacenamiento" store installed 🆕
 🍍 "auth" store installed 🆕
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(0), oldPath: Array(0)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [useObtenerCarpetaDocumentosSocietarios] Nodos raíz obtenidos: 2
 🟢 [useObtenerCarpetaDocumentosSocietarios] Carpeta /core/ encontrada: {id: '39', name: 'core', path: '/', code: 'ee3fb899-00cb-4c26-b08a-589beedc688c'}
 🔵 [AlmacenView] Carpeta /core/ obtenida: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 1 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 1 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 1 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Obteniendo documento para preview: 73
 🟢 [AlmacenView] Usando versionCode del documento: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: true
 🟡 [PreviewModal] versionCode: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [PreviewModal] document: Proxy(Object) {name: 'acta-junta-universal.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', owner: 'Sistema', dateModified: Thu Dec 11 2025 16:47:00 GMT-0500 (hora estándar de Perú), size: undefined, …}
 🟡 [PreviewModal] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🟢 [PreviewModal] Iniciando carga de preview...
 🟢 [PreviewModal] Llamando a previsualizar...
 🟡 [usePrevisualizarDocumento] ========================================
 🟡 [usePrevisualizarDocumento] PREVISUALIZAR DOCUMENTO
 🟡 [usePrevisualizarDocumento] ========================================
 🟡 [usePrevisualizarDocumento] versionCode: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [usePrevisualizarDocumento] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🔵 [RepositorioDocumentosHttp] Descargando versión: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [DocumentPreviewService] ========================================
 🟡 [DocumentPreviewService] PREVIEW DOCUMENT
 🟡 [DocumentPreviewService] ========================================
 🟡 [DocumentPreviewService] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🟡 [DocumentPreviewService] blob size: 79784 bytes
 🟢 [DocumentPreviewService] Procesando como Word (DOCX)...
 🟡 [DocumentPreviewService] Iniciando conversión de Word a HTML...
 🟢 [DocumentPreviewService] ArrayBuffer obtenido, tamaño: 79784
 🟢 [DocumentPreviewService] Conversión completada, HTML length: 947
 🟢 [DocumentPreviewService] HTML sanitizado, length: 947
 🟢 [usePrevisualizarDocumento] Preview obtenido: {type: 'html', hasContent: true}
 🟢 [PreviewModal] Preview obtenido: {type: 'html', hasContent: true}
 🟢 [PreviewModal] Preview cargado correctamente
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
flushPreFlushCbs @ runtime-core.esm-bun…r.js?v=e57cfd2b:353
updateComponentPreRender @ runtime-core.esm-bun….js?v=e57cfd2b:5559
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5478
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
updateComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5352
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5286
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchBlockChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5145
patchElement @ runtime-core.esm-bun….js?v=e57cfd2b:5063
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4922
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
set @ reactivity.esm-bundl….js?v=e57cfd2b:1459
_createVNode.onClose._cache.<computed>._cache.<computed> @ AlmacenView.vue:1187
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
emit @ runtime-core.esm-bun….js?v=e57cfd2b:6493
(anonymous) @ runtime-core.esm-bun….js?v=e57cfd2b:8204
$props.isOpen._createElementVNode.onClick._cache.<computed>._cache.<computed> @ PreviewModal.vue:167
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [AlmacenView] Obteniendo documento para preview: 73
 🟢 [AlmacenView] Usando versionCode del documento: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: true
 🟡 [PreviewModal] versionCode: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [PreviewModal] document: Proxy(Object) {name: 'acta-junta-universal.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', owner: 'Sistema', dateModified: Thu Dec 11 2025 16:47:00 GMT-0500 (hora estándar de Perú), size: undefined, …}
 🟡 [PreviewModal] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🟢 [PreviewModal] Iniciando carga de preview...
 🟢 [PreviewModal] Llamando a previsualizar...
 🟡 [usePrevisualizarDocumento] ========================================
 🟡 [usePrevisualizarDocumento] PREVISUALIZAR DOCUMENTO
 🟡 [usePrevisualizarDocumento] ========================================
 🟡 [usePrevisualizarDocumento] versionCode: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [usePrevisualizarDocumento] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🔵 [RepositorioDocumentosHttp] Descargando versión: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [DocumentPreviewService] ========================================
 🟡 [DocumentPreviewService] PREVIEW DOCUMENT
 🟡 [DocumentPreviewService] ========================================
 🟡 [DocumentPreviewService] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🟡 [DocumentPreviewService] blob size: 79784 bytes
 🟢 [DocumentPreviewService] Procesando como Word (DOCX)...
 🟡 [DocumentPreviewService] Iniciando conversión de Word a HTML...
 🟢 [DocumentPreviewService] ArrayBuffer obtenido, tamaño: 79784
 🟢 [DocumentPreviewService] Conversión completada, HTML length: 947
 🟢 [DocumentPreviewService] HTML sanitizado, length: 947
 🟢 [usePrevisualizarDocumento] Preview obtenido: {type: 'html', hasContent: true}
 🟢 [PreviewModal] Preview obtenido: {type: 'html', hasContent: true}
 🟢 [PreviewModal] Preview cargado correctamente
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
flushPreFlushCbs @ runtime-core.esm-bun…r.js?v=e57cfd2b:353
updateComponentPreRender @ runtime-core.esm-bun….js?v=e57cfd2b:5559
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5478
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
updateComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5352
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5286
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchBlockChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5145
patchElement @ runtime-core.esm-bun….js?v=e57cfd2b:5063
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4922
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
set @ reactivity.esm-bundl….js?v=e57cfd2b:1459
_createVNode.onClose._cache.<computed>._cache.<computed> @ AlmacenView.vue:1187
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
emit @ runtime-core.esm-bun….js?v=e57cfd2b:6493
(anonymous) @ runtime-core.esm-bun….js?v=e57cfd2b:8204
$props.isOpen._createElementVNode.onClick._cache.<computed>._cache.<computed> @ PreviewModal.vue:167
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: null, estructuraOperaciones: null}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: '', segments: Array(0), routePath: '/storage/documentos-generados/10/operaciones/'}
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToDocumentosGenerados @ AlmacenView.vue:314
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/', path: '/storage/documentos-generados/10/operaciones/', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToDocumentosGenerados @ AlmacenView.vue:314
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🍍 "documentos-generados" store installed 🆕
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [DocumentosGeneradosView] Mostrando carpetas de operaciones: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', estructuraOperaciones: Proxy(Object), documentosGenerados: {…}, directorio: {…}, …}
 🟢 [DocumentosGeneradosView] Carpetas agregadas: (2) [{…}, {…}]
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: '', segments: Array(0), routePath: '/storage/documentos-generados/10/operaciones/'}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [DocumentosGeneradosView] Mostrando carpetas de operaciones: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', estructuraOperaciones: Proxy(Object), documentosGenerados: {…}, directorio: {…}, …}
 🟢 [DocumentosGeneradosView] Carpetas agregadas: (2) [{…}, {…}]
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(0), oldPath: undefined}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: null, structureId: '10'}
 🔵 [AlmacenView] Obteniendo carpeta /core/ para subir archivos...
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1222
Promise.then
(anonymous) @ vue-router.mjs?v=e57cfd2b:1221
(anonymous) @ vue-router.mjs?v=e57cfd2b:39
popStateHandler @ vue-router.mjs?v=e57cfd2b:38
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <Almacen onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/almacen" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/almacen/10', path: '/storage/almacen/10', query: {…}, hash: '', name: 'storage-almacen-idSociety-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1222
Promise.then
(anonymous) @ vue-router.mjs?v=e57cfd2b:1221
(anonymous) @ vue-router.mjs?v=e57cfd2b:39
popStateHandler @ vue-router.mjs?v=e57cfd2b:38
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [useObtenerCarpetaDocumentosSocietarios] Nodos raíz obtenidos: 2
 🟢 [useObtenerCarpetaDocumentosSocietarios] Carpeta /core/ encontrada: {id: '39', name: 'core', path: '/', code: 'ee3fb899-00cb-4c26-b08a-589beedc688c'}
 🔵 [AlmacenView] Carpeta /core/ obtenida: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 1 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Creando carpeta: kkk
 🔵 [AlmacenView] carpetaActual: null
 🔵 [AlmacenView] sociedadSeleccionada: 10
 🔵 [AlmacenView] Obteniendo carpeta /core/...
 🔵 [AlmacenView] Carpeta /core/ obtenida: 39
 🔵 [AlmacenView] Creando carpeta con parentId: 39
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] CREATE CARPETA
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] nombre: kkk
 🔵 [AlmacenamientoHttp] parentId: 39
 🔵 [AlmacenamientoHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/39/folder
 🔵 [AlmacenamientoHttp] Body: {name: 'kkk', description: null}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] RESPUESTA:
 🔵 [AlmacenamientoHttp] response: {
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "id": 78,
    "code": "e4c60e3f-41a5-4b76-8b79-38eb3e55a394",
    "societyId": 4,
    "parentId": 39,
    "name": "kkk",
    "type": 1,
    "path": "/core/",
    "description": null,
    "createdAt": "2025-12-11T22:28:51.083Z",
    "updatedAt": "2025-12-11T22:28:51.083Z",
    "isCore": false,
    "children": []
  },
  "code": 201
}
 🔵 [AlmacenamientoHttp] ========================================
 🟢 [AlmacenamientoHttp] Carpeta creada exitosamente: {id: '78', name: 'kkk', path: '/core/'}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 39
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '39', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 3
 🔵 [AlmacenamientoHttp] ========================================
 ✅ [AlmacenView] Carpeta creada exitosamente
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 39
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 3
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a carpeta: 78
 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(1), oldPath: Array(0)}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '78', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(1), oldPath: Array(1)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Creando carpeta: kkkk
 🔵 [AlmacenView] carpetaActual: 78
 🔵 [AlmacenView] sociedadSeleccionada: 10
 🔵 [AlmacenView] Creando carpeta con parentId: 78
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] CREATE CARPETA
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] nombre: kkkk
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [AlmacenamientoHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/78/folder
 🔵 [AlmacenamientoHttp] Body: {name: 'kkkk', description: null}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] RESPUESTA:
 🔵 [AlmacenamientoHttp] response: {
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "id": 79,
    "code": "7a902982-d28e-4891-98ff-502b432425a7",
    "societyId": 4,
    "parentId": 78,
    "name": "kkkk",
    "type": 1,
    "path": "/core/kkk/",
    "description": null,
    "createdAt": "2025-12-11T22:29:02.319Z",
    "updatedAt": "2025-12-11T22:29:02.319Z",
    "isCore": false,
    "children": []
  },
  "code": 201
}
 🔵 [AlmacenamientoHttp] ========================================
 🟢 [AlmacenamientoHttp] Carpeta creada exitosamente: {id: '79', name: 'kkkk', path: '/core/kkk/'}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 ✅ [AlmacenView] Carpeta creada exitosamente
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a carpeta: 79
 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78/79
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(2), oldPath: Array(1)}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '79', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a breadcrumb index: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(1), oldPath: Array(2)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '78', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: null, structureId: '10'}
 🔵 [AlmacenView] Obteniendo carpeta /core/ para subir archivos...
 🔵 [AlmacenView] Carpeta /core/ obtenida: 39
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 2 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 2
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a carpeta: 78
 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78/78
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(2), oldPath: Array(1)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '78', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a breadcrumb index: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a breadcrumb index: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(1), oldPath: Array(2)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a carpeta: 79
 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78/79
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(2), oldPath: Array(1)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '79', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Creando carpeta: 8888
 🔵 [AlmacenView] carpetaActual: 79
 🔵 [AlmacenView] sociedadSeleccionada: 10
 🔵 [AlmacenView] Creando carpeta con parentId: 79
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] CREATE CARPETA
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] nombre: 8888
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [AlmacenamientoHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/79/folder
 🔵 [AlmacenamientoHttp] Body: {name: '8888', description: null}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] RESPUESTA:
 🔵 [AlmacenamientoHttp] response: {
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "id": 80,
    "code": "2f7fd321-74c0-4c8c-8483-056935c932e2",
    "societyId": 4,
    "parentId": 79,
    "name": "8888",
    "type": 1,
    "path": "/core/kkk/kkkk/",
    "description": null,
    "createdAt": "2025-12-11T22:29:15.535Z",
    "updatedAt": "2025-12-11T22:29:15.535Z",
    "isCore": false,
    "children": []
  },
  "code": 201
}
 🔵 [AlmacenamientoHttp] ========================================
 🟢 [AlmacenamientoHttp] Carpeta creada exitosamente: {id: '80', name: '8888', path: '/core/kkk/kkkk/'}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 ✅ [AlmacenView] Carpeta creada exitosamente
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a carpeta: 80
 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78/79/80
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 80
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/80
 🔵 [RepositorioDocumentosHttp] nodeId: 80
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(3), oldPath: Array(2)}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/80
 🔵 [RepositorioDocumentosHttp] nodeId: 80
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 80, name: '8888', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '80', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 80
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 80, name: '8888', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 80
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/80
 🔵 [RepositorioDocumentosHttp] nodeId: 80
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 80, name: '8888', type: 1, childrenCount: 0, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Abriendo modal de subida: {structureId: '10', parentNodeId: '80'}
 🟡 [useSubirArchivo] Subiendo archivo...
 🟡 [SubirArchivoUseCase] ========================================
 🟡 [SubirArchivoUseCase] SUBIR ARCHIVO
 🟡 [SubirArchivoUseCase] ========================================
 🟡 [SubirArchivoUseCase] structureId: 10
 🟡 [SubirArchivoUseCase] parentNodeId: 80
 🟡 [SubirArchivoUseCase] fileName: acta-junta-universal.docx
 🟡 [SubirArchivoUseCase] fileSize: 79784 bytes
 🟡 [SubirArchivoUseCase] fileType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] SUBIR ARCHIVO
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/80/documents
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [RepositorioDocumentosHttp] parentNodeId: 80
 🔵 [RepositorioDocumentosHttp] fileName: acta-junta-universal.docx
 🔵 [RepositorioDocumentosHttp] fileSize: 79784
 🔵 [RepositorioDocumentosHttp] Respuesta: {success: true, message: 'Documentos cargados y creados correctamente.', data: {…}, code: 201}
 🟢 [RepositorioDocumentosHttp] Archivo subido exitosamente: {id: 'undefined', name: undefined}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟢 [SubirArchivoUseCase] Archivo subido exitosamente: {id: 'undefined', name: undefined}
 🟢 [SubirArchivoUseCase] ========================================
 🟢 [useSubirArchivo] Archivo subido exitosamente: {id: 'undefined', code: undefined, societyId: 'undefined', parentId: null, name: undefined, …}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 80
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/80
 🔵 [RepositorioDocumentosHttp] nodeId: 80
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 80, name: '8888', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a breadcrumb index: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(2), oldPath: Array(3)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '79', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a breadcrumb index: 0
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(1), oldPath: Array(2)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '78', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: null, structureId: '10'}
 🔵 [AlmacenView] Obteniendo carpeta /core/ para subir archivos...
 🔵 [AlmacenView] Carpeta /core/ obtenida: 39
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 2 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 2
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Obteniendo documento para preview: 73
 🟢 [AlmacenView] Usando versionCode del documento: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: true
 🟡 [PreviewModal] versionCode: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [PreviewModal] document: Proxy(Object) {name: 'acta-junta-universal.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', owner: 'Sistema', dateModified: Thu Dec 11 2025 16:47:00 GMT-0500 (hora estándar de Perú), size: undefined, …}
 🟡 [PreviewModal] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🟢 [PreviewModal] Iniciando carga de preview...
 🟢 [PreviewModal] Llamando a previsualizar...
 🟡 [usePrevisualizarDocumento] ========================================
 🟡 [usePrevisualizarDocumento] PREVISUALIZAR DOCUMENTO
 🟡 [usePrevisualizarDocumento] ========================================
 🟡 [usePrevisualizarDocumento] versionCode: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [usePrevisualizarDocumento] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🔵 [RepositorioDocumentosHttp] Descargando versión: cd1d12ef-da3c-41aa-bfb5-ffac47efe278
 🟡 [DocumentPreviewService] ========================================
 🟡 [DocumentPreviewService] PREVIEW DOCUMENT
 🟡 [DocumentPreviewService] ========================================
 🟡 [DocumentPreviewService] mimeType: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 🟡 [DocumentPreviewService] blob size: 79784 bytes
 🟢 [DocumentPreviewService] Procesando como Word (DOCX)...
 🟡 [DocumentPreviewService] Iniciando conversión de Word a HTML...
 🟢 [DocumentPreviewService] ArrayBuffer obtenido, tamaño: 79784
 🟢 [DocumentPreviewService] Conversión completada, HTML length: 947
 🟢 [DocumentPreviewService] HTML sanitizado, length: 947
 🟢 [usePrevisualizarDocumento] Preview obtenido: {type: 'html', hasContent: true}
 🟢 [PreviewModal] Preview obtenido: {type: 'html', hasContent: true}
 🟢 [PreviewModal] Preview cargado correctamente
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
flushPreFlushCbs @ runtime-core.esm-bun…r.js?v=e57cfd2b:353
updateComponentPreRender @ runtime-core.esm-bun….js?v=e57cfd2b:5559
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5478
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
updateComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5352
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5286
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchBlockChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5145
patchElement @ runtime-core.esm-bun….js?v=e57cfd2b:5063
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4922
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
set @ reactivity.esm-bundl….js?v=e57cfd2b:1459
_createVNode.onClose._cache.<computed>._cache.<computed> @ AlmacenView.vue:1187
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
emit @ runtime-core.esm-bun….js?v=e57cfd2b:6493
(anonymous) @ runtime-core.esm-bun….js?v=e57cfd2b:8204
$props.isOpen._createElementVNode.onClick._cache.<computed>._cache.<computed> @ PreviewModal.vue:167
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [AlmacenView] Navegando a carpeta: 78
 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78/78
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(2), oldPath: Array(1)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 78
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
 🔵 [RepositorioDocumentosHttp] nodeId: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '78', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 78
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a carpeta: 79
 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78/78/79
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(3), oldPath: Array(2)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 79
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
 🔵 [RepositorioDocumentosHttp] nodeId: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '79', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 79
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Navegando a carpeta: 80
 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78/78/79/80
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 80
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/80
 🔵 [RepositorioDocumentosHttp] nodeId: 80
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(4), oldPath: Array(3)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: 80
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/80
 🔵 [RepositorioDocumentosHttp] nodeId: 80
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 80, name: '8888', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '80', structureId: '10'}
 🔵 [AlmacenView] Usando carpeta actual: 80
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 80, name: '8888', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: null, structureId: '10'}
 🔵 [AlmacenView] Obteniendo carpeta /core/ para subir archivos...
 🔵 [AlmacenView] Carpeta /core/ obtenida: 39
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 2 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 2
 🔵 [AlmacenamientoHttp] ========================================
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: '', segments: Array(0), routePath: '/storage/documentos-generados/10/operaciones/'}
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToDocumentosGenerados @ AlmacenView.vue:314
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/', path: '/storage/documentos-generados/10/operaciones/', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToDocumentosGenerados @ AlmacenView.vue:314
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [DocumentosGeneradosView] Mostrando carpetas de operaciones: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', estructuraOperaciones: Proxy(Object), documentosGenerados: {…}, directorio: {…}, …}
 🟢 [DocumentosGeneradosView] Carpetas agregadas: (2) [{…}, {…}]
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 📂 [DocumentosGeneradosView] Navegando a carpeta: operaciones-juntas
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(1), segments: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas'}
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosView.vue:391
onClick @ DocumentosGeneradosView.vue:1071
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/junta-accionistas" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/junta-accionistas', path: '/storage/documentos-generados/10/operaciones/junta-accionistas', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosView.vue:391
onClick @ DocumentosGeneradosView.vue:1071
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 📂 [DocumentosGeneradosView] Navegando a carpeta: carpeta-62
 📂 [DocumentosGeneradosView] Cargando documentos de carpeta de junta: 62
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER DOCUMENTOS DE CARPETA
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] carpetaId: 62
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(2), segments: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62'}
 🟡 [DocumentosGeneradosView] Watch detectó cambio a carpeta de junta, cargando: 62
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosView.vue:359
onClick @ DocumentosGeneradosView.vue:999
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/junta-accionistas,carpeta-62" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', path: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosView.vue:359
onClick @ DocumentosGeneradosView.vue:999
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', type: 'folder', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] Hijos encontrados: 2
 🟡 [ObtenerDocumentosJuntasUseCase] Detalle de hijos: (2) [{…}, {…}]
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 [DocumentosGeneradosStore] Documentos de carpeta cargados: {carpetaId: '62', cantidad: 2}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 [Vue warn] Write operation failed: computed value is readonly
overrideMethod @ installHook.js:1
warn @ reactivity.esm-bundler.js?v=e57cfd2b:8
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1586
navigateBack @ DocumentosGeneradosView.vue:414
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(2), segments: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62'}
 🟡 [DocumentosGeneradosView] Watch detectó cambio a carpeta de junta, cargando: 62
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
  GET http://localhost:3000/api/v2/society-profile/list 404 (Not Found)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
list @ sociedad.http.repository.ts:132
execute @ list-sociedades.use-case.ts:6
cargarHistorial @ sociedad-historial.store.ts:56
eliminarTodasLasSociedades @ sociedad-historial.store.ts:117
await in eliminarTodasLasSociedades
wrappedAction @ pinia.mjs?v=e57cfd2b:1067
store.<computed> @ pinia.mjs?v=e57cfd2b:761
handleDeleteAll @ historial.vue:87
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][SociedadHttp] list():error {url: 'http://localhost:3000/api/v2/society-profile/list', statusCode: 404, message: 'Society Profile not found with criteria: No societies found for the user'}
overrideMethod @ installHook.js:1
list @ sociedad.http.repository.ts:141
await in list
execute @ list-sociedades.use-case.ts:6
cargarHistorial @ sociedad-historial.store.ts:56
eliminarTodasLasSociedades @ sociedad-historial.store.ts:117
await in eliminarTodasLasSociedades
wrappedAction @ pinia.mjs?v=e57cfd2b:1067
store.<computed> @ pinia.mjs?v=e57cfd2b:761
handleDeleteAll @ historial.vue:87
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [SociedadHistorialStore] Error al cargar sociedades: {statusCode: 404, message: 'Society Profile not found with criteria: No societies found for the user'}
overrideMethod @ installHook.js:1
cargarHistorial @ sociedad-historial.store.ts:63
await in cargarHistorial
eliminarTodasLasSociedades @ sociedad-historial.store.ts:117
await in eliminarTodasLasSociedades
wrappedAction @ pinia.mjs?v=e57cfd2b:1067
store.<computed> @ pinia.mjs?v=e57cfd2b:761
handleDeleteAll @ historial.vue:87
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000131",
  "razonSocial": "Inversiones del Sur S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Inversiones del Sur S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/16/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/16/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/16/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/16/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/16/acction', payload: '{\n  "id": "55ead9c4-66de-4ae3-95cf-d94e4208969a",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/16/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "55ead9c4-66de-4ae3-95cf-d94e4208969a",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/16/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/16/quorum', societyProfileId: '16'}
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
  POST http://localhost:3000/api/v2/society-profile/16/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:923
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/16/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:936
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/16/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:952
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/16/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:964
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000202",
  "razonSocial": "Comercial Andina S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Comercial Andina S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/17/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/17/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/17/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/17/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/17/acction', payload: '{\n  "id": "8283b734-bcf8-4bb8-8183-5a86dd215e18",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/17/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "8283b734-bcf8-4bb8-8183-5a86dd215e18",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/17/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/17/quorum', societyProfileId: '17'}
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
  POST http://localhost:3000/api/v2/society-profile/17/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:923
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/17/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:936
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/17/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:952
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/17/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:964
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000326",
  "razonSocial": "Servicios Empresariales S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Servicios Empresariales S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/18/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/18/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/18/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/18/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/18/acction', payload: '{\n  "id": "690f4205-1c76-4309-82c3-a2ccc50b5a83",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/18/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "690f4205-1c76-4309-82c3-a2ccc50b5a83",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/18/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/18/quorum', societyProfileId: '18'}
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
  POST http://localhost:3000/api/v2/society-profile/18/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:923
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/18/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:936
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/18/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:952
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/18/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:964
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000418",
  "razonSocial": "Construcciones Modernas S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Construcciones Modernas S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/19/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/19/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/19/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/19/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/19/acction', payload: '{\n  "id": "685d753f-7fe9-45ec-a4e8-9b061d13ae21",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/19/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "685d753f-7fe9-45ec-a4e8-9b061d13ae21",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/19/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/19/quorum', societyProfileId: '19'}
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
  POST http://localhost:3000/api/v2/society-profile/19/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:923
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/19/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:936
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/19/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:952
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/19/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:964
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000508",
  "razonSocial": "Tecnología Avanzada S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Tecnología Avanzada S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/20/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/20/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/20/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/20/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/20/acction', payload: '{\n  "id": "bbe366a8-9a23-45ec-b90f-3aa1a689b108",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/20/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "bbe366a8-9a23-45ec-b90f-3aa1a689b108",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/20/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/20/quorum', societyProfileId: '20'}
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
  POST http://localhost:3000/api/v2/society-profile/20/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:923
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:914
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/20/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:936
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/20/attorney-register/attorneys 400 (Bad Request)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765492126359:952
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765492126359:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765492126359:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:939
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/20/attorney-register/attorneys": 400 Bad Request
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765492126359:964
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765492126359:1177
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765492126359:1388
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  GET http://localhost:3000/api/v2/society-profile/list net::ERR_CONNECTION_REFUSED
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
list @ sociedad.http.repository.ts:132
execute @ list-sociedades.use-case.ts:6
cargarHistorial @ sociedad-historial.store.ts:56
wrappedAction @ pinia.mjs?v=e57cfd2b:1067
store.<computed> @ pinia.mjs?v=e57cfd2b:761
(anonymous) @ historial.vue:29
(anonymous) @ runtime-core.esm-bun….js?v=e57cfd2b:2902
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
hook.__weh.hook.__weh @ runtime-core.esm-bun….js?v=e57cfd2b:2882
flushPostFlushCbs @ runtime-core.esm-bun…r.js?v=e57cfd2b:382
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:424
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  GET http://localhost:3000/api/v2/society-profile/list net::ERR_CONNECTION_REFUSED
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
onError @ ofetch.03887fc3.mjs?v=e57cfd2b:179
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:270
await in $fetchRaw2
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
list @ sociedad.http.repository.ts:132
execute @ list-sociedades.use-case.ts:6
cargarHistorial @ sociedad-historial.store.ts:56
wrappedAction @ pinia.mjs?v=e57cfd2b:1067
store.<computed> @ pinia.mjs?v=e57cfd2b:761
(anonymous) @ historial.vue:29
(anonymous) @ runtime-core.esm-bun….js?v=e57cfd2b:2902
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
hook.__weh.hook.__weh @ runtime-core.esm-bun….js?v=e57cfd2b:2882
flushPostFlushCbs @ runtime-core.esm-bun…r.js?v=e57cfd2b:382
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:424
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][SociedadHttp] list():error {url: 'http://localhost:3000/api/v2/society-profile/list', statusCode: null, message: '[GET] "http://localhost:3000/api/v2/society-profile/list": <no response> Failed to fetch'}
overrideMethod @ installHook.js:1
list @ sociedad.http.repository.ts:141
await in list
execute @ list-sociedades.use-case.ts:6
cargarHistorial @ sociedad-historial.store.ts:56
wrappedAction @ pinia.mjs?v=e57cfd2b:1067
store.<computed> @ pinia.mjs?v=e57cfd2b:761
(anonymous) @ historial.vue:29
(anonymous) @ runtime-core.esm-bun….js?v=e57cfd2b:2902
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
hook.__weh.hook.__weh @ runtime-core.esm-bun….js?v=e57cfd2b:2882
flushPostFlushCbs @ runtime-core.esm-bun…r.js?v=e57cfd2b:382
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:424
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [SociedadHistorialStore] Error al cargar sociedades: {statusCode: null, message: '[GET] "http://localhost:3000/api/v2/society-profile/list": <no response> Failed to fetch'}
overrideMethod @ installHook.js:1
cargarHistorial @ sociedad-historial.store.ts:63
await in cargarHistorial
wrappedAction @ pinia.mjs?v=e57cfd2b:1067
store.<computed> @ pinia.mjs?v=e57cfd2b:761
(anonymous) @ historial.vue:29
(anonymous) @ runtime-core.esm-bun….js?v=e57cfd2b:2902
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
hook.__weh.hook.__weh @ runtime-core.esm-bun….js?v=e57cfd2b:2882
flushPostFlushCbs @ runtime-core.esm-bun…r.js?v=e57cfd2b:382
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:424
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000155",
  "razonSocial": "Inversiones del Sur S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Inversiones del Sur S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/21/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/21/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/21/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/21/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/21/acction', payload: '{\n  "id": "6192e298-b156-4c5b-bf19-121fb345ca4c",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/21/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "6192e298-b156-4c5b-bf19-121fb345ca4c",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/21/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/21/quorum', societyProfileId: '21'}
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
  POST http://localhost:3000/api/v2/society-profile/21/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:929
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/21/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:942
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/21/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:958
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/21/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:970
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000228",
  "razonSocial": "Comercial Andina S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Comercial Andina S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/22/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/22/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/22/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/22/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/22/acction', payload: '{\n  "id": "260049d5-ba7c-4876-b142-b066df0769da",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/22/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "260049d5-ba7c-4876-b142-b066df0769da",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/22/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/22/quorum', societyProfileId: '22'}
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
  POST http://localhost:3000/api/v2/society-profile/22/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:929
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/22/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:942
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/22/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:958
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/22/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:970
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000301",
  "razonSocial": "Servicios Empresariales S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Servicios Empresariales S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/23/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/23/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/23/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/23/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/23/acction', payload: '{\n  "id": "09df9240-3d35-4ada-a442-34e173544e03",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/23/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "09df9240-3d35-4ada-a442-34e173544e03",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/23/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/23/quorum', societyProfileId: '23'}
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
  POST http://localhost:3000/api/v2/society-profile/23/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:929
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/23/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:942
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/23/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:958
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/23/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:970
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000460",
  "razonSocial": "Construcciones Modernas S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Construcciones Modernas S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/24/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/24/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/24/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/24/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/24/acction', payload: '{\n  "id": "e650da9e-8316-4fc6-8898-4f4429c71b46",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/24/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "e650da9e-8316-4fc6-8898-4f4429c71b46",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/24/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/24/quorum', societyProfileId: '24'}
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
  POST http://localhost:3000/api/v2/society-profile/24/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:929
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/24/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:942
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/24/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:958
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/24/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:970
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Repository][DatosSociedadHttp] create() - Payload mapeado: {
  "ruc": "20000000530",
  "razonSocial": "Tecnología Avanzada S.A.C.",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Tecnología Avanzada S.A.C. S.A.C.",
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
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/25/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/25/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 1}
 [Repository][AccionistasHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/25/shareholder', personaTipo: 'NATURAL'}
 [Repository][AccionistasHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/25/shareholder'}
 [Repository][AccionistasHttp] list:success {count: 2}
 [Repository][AccionesHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/25/acction', payload: '{\n  "id": "3cdd9384-fa01-4b8d-a0be-81e7834ec8ff",\n…\n  "redimible": false,\n  "conDerechoVoto": true\n}'}
 [Repository][AccionesHttp] create:response {
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
 [Repository][AccionesHttp] list:request {url: 'http://localhost:3000/api/v2/society-profile/25/acction'}
 [Repository][AccionesHttp] list:response {
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "datos": [
      {
        "id": "3cdd9384-fa01-4b8d-a0be-81e7834ec8ff",
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
 [Repository][QuorumHttp] create:request {url: 'http://localhost:3000/api/v2/society-profile/25/quorum', payload: '{\n  "primeraConvocatoriaSimple": 60,\n  "primeraCon…nimoSimple": 50,\n  "quorumMinimoCalificado": 60\n}'}
 [Repository][QuorumHttp] create:response {
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
 [Repository][QuorumHttp] get:request {url: 'http://localhost:3000/api/v2/society-profile/25/quorum', societyProfileId: '25'}
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
  POST http://localhost:3000/api/v2/society-profile/25/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:929
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso apoderadosAdicionales: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:920
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando apoderados adicionales: [POST] "http://localhost:3000/api/v2/society-profile/25/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:942
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
  POST http://localhost:3000/api/v2/society-profile/25/attorney-register/attorneys 422 (Unprocessable Entity)
(anonymous) @ index.mjs?v=e57cfd2b:21
$fetchRaw2 @ ofetch.03887fc3.mjs?v=e57cfd2b:258
$fetch2 @ ofetch.03887fc3.mjs?v=e57cfd2b:316
createApoderado @ apoderados.http.repository.ts:92
execute @ create-apoderado.use-case.ts:6
(anonymous) @ seeds-sociedades.vue?t=1765493123374:958
await in (anonymous)
executeStep @ seeds-sociedades.vue?t=1765493123374:374
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error en paso otrosApoderados: 
overrideMethod @ installHook.js:1
executeStep @ seeds-sociedades.vue?t=1765493123374:378
await in executeStep
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:945
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Seeds] Error creando otros apoderados: [POST] "http://localhost:3000/api/v2/society-profile/25/attorney-register/attorneys": 422 Unprocessable Entity
overrideMethod @ installHook.js:1
createSocietyCompleto @ seeds-sociedades.vue?t=1765493123374:970
await in createSocietyCompleto
createMultipleSocietiesCompleto @ seeds-sociedades.vue…=1765493123374:1183
await in createMultipleSocietiesCompleto
_createVNode.onClick._cache.<computed>._cache.<computed> @ seeds-sociedades.vue…=1765493123374:1394
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(0), oldPath: undefined}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: null, structureId: '10'}
 🔵 [AlmacenView] Obteniendo carpeta /core/ para subir archivos...
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <Almacen onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/almacen" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/almacen', path: '/storage/almacen', query: {…}, hash: '', name: 'storage-almacen', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [useObtenerCarpetaDocumentosSocietarios] Nodos raíz obtenidos: 2
 🟢 [useObtenerCarpetaDocumentosSocietarios] Carpeta /core/ encontrada: {id: '39', name: 'core', path: '/', code: 'ee3fb899-00cb-4c26-b08a-589beedc688c'}
 🔵 [AlmacenView] Carpeta /core/ obtenida: 39
 🔵 [AlmacenView] Ruta cambió: {newPath: Array(0), oldPath: Array(0)}
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [AlmacenamientoHttp] sociedadId: 10
 🔵 [AlmacenamientoHttp] parentId: null
 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 2 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 2
 🔵 [AlmacenamientoHttp] ========================================
 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
 🔵 [RepositorioDocumentosHttp] nodeId: 39
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 2 elementos
 🔵 [AlmacenamientoHttp] Nodos obtenidos: 2
 🔵 [AlmacenamientoHttp] ========================================
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados', path: '/storage/documentos-generados', query: {…}, hash: '', name: 'storage-documentos-generados', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: '', segments: Array(0), routePath: '/storage/documentos-generados/10/operaciones/'}
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToOperaciones @ index.vue:19
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/', path: '/storage/documentos-generados/10/operaciones/', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToOperaciones @ index.vue:19
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [DocumentosGeneradosView] Mostrando carpetas de operaciones: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', estructuraOperaciones: Proxy(Object), documentosGenerados: {…}, directorio: {…}, …}
 🟢 [DocumentosGeneradosView] Carpetas agregadas: (2) [{…}, {…}]
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 📂 [DocumentosGeneradosView] Navegando a carpeta: operaciones-juntas
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(1), segments: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas'}
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosV…t=1765493006698:448
onClick @ DocumentosGeneradosV…=1765493006698:1069
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/junta-accionistas" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/junta-accionistas', path: '/storage/documentos-generados/10/operaciones/junta-accionistas', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosV…t=1765493006698:448
onClick @ DocumentosGeneradosV…=1765493006698:1069
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(1), segments: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas'}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 📂 [DocumentosGeneradosView] Navegando a carpeta: carpeta-62
 📂 [DocumentosGeneradosView] Cargando documentos de carpeta de junta: 62
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER DOCUMENTOS DE CARPETA
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] carpetaId: 62
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(2), segments: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62'}
 🟡 [DocumentosGeneradosView] Watch detectó cambio a carpeta de junta, cargando: 62
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosV…t=1765493006698:416
onClick @ DocumentosGeneradosV…=1765493006698:1069
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/junta-accionistas,carpeta-62" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', path: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosV…t=1765493006698:416
onClick @ DocumentosGeneradosV…=1765493006698:1069
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', type: 'folder', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] Hijos encontrados: 2
 🟡 [ObtenerDocumentosJuntasUseCase] Detalle de hijos: (2) [{…}, {…}]
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 [DocumentosGeneradosStore] Documentos de carpeta cargados: {carpetaId: '62', cantidad: 2}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 2
 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 0
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(1), segments: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas'}
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToBreadcrumb @ DocumentosGeneradosV…t=1765493006698:488
onClick @ DocumentosGeneradosV…t=1765493006698:934
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/junta-accionistas" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/junta-accionistas', path: '/storage/documentos-generados/10/operaciones/junta-accionistas', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToBreadcrumb @ DocumentosGeneradosV…t=1765493006698:488
onClick @ DocumentosGeneradosV…t=1765493006698:934
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 0
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: '', segments: Array(0), routePath: '/storage/documentos-generados/10/operaciones/'}
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateBack @ DocumentosGeneradosV…t=1765493006698:474
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/', path: '/storage/documentos-generados/10/operaciones/', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateBack @ DocumentosGeneradosV…t=1765493006698:474
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [DocumentosGeneradosView] Mostrando carpetas de operaciones: {currentPath: Array(0), routePath: '/storage/documentos-generados/10/operaciones/', estructuraOperaciones: Proxy(Object), documentosGenerados: {…}, directorio: {…}, …}
 🟢 [DocumentosGeneradosView] Carpetas agregadas: (2) [{…}, {…}]
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 0
 📂 [DocumentosGeneradosView] Navegando a carpeta: operaciones-juntas
 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(1), segments: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas'}
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] WATCH TRIGGERED
 🟡 [PreviewModal] ========================================
 🟡 [PreviewModal] isOpen: false
 🟡 [PreviewModal] versionCode: undefined
 🟡 [PreviewModal] document: null
 🟡 [PreviewModal] mimeType: undefined
 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:79
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bun….js?v=e57cfd2b:6302
job @ reactivity.esm-bundl….js?v=e57cfd2b:1757
watch @ reactivity.esm-bundl….js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bun….js?v=e57cfd2b:6330
watch @ runtime-core.esm-bun….js?v=e57cfd2b:6263
setup @ PreviewModal.vue:37
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bun….js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bun….js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bun….js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bun….js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bun….js?v=e57cfd2b:4911
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bun….js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bun….js?v=e57cfd2b:5275
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bun….js?v=e57cfd2b:7087
process @ runtime-core.esm-bun….js?v=e57cfd2b:6885
patch @ runtime-core.esm-bun….js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosV…t=1765493006698:448
onClick @ DocumentosGeneradosV…=1765493006698:1069
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/junta-accionistas" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/junta-accionistas', path: '/storage/documentos-generados/10/operaciones/junta-accionistas', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bun…er.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bun….js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bun….js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bun…r.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bun…r.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bun…r.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bun….js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundl….js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosV…t=1765493006698:448
onClick @ DocumentosGeneradosV…=1765493006698:1069
callWithErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bun…r.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bund…r.js?v=e57cfd2b:721
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
 🔵 [RepositorioDocumentosHttp] structureId: 10
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
 🔵 [RepositorioDocumentosHttp] ========================================
 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
 🔵 [RepositorioDocumentosHttp] nodeId: 62
 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
 🔵 [RepositorioDocumentosHttp] ========================================
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(1), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
 📂 [DocumentosGeneradosView] Navegando a carpeta: carpeta-62
DocumentosGeneradosView.vue:530 📂 [DocumentosGeneradosView] Cargando documentos de carpeta de junta: 62
obtener-documentos-juntas.use-case.ts:133 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:134 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER DOCUMENTOS DE CARPETA
obtener-documentos-juntas.use-case.ts:135 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:136 🟡 [ObtenerDocumentosJuntasUseCase] carpetaId: 62
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 62
useDocumentosGenerados.ts:25 🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad: {oldId: undefined, newId: '10', sociedadCompleta: Proxy(Object)}
useDocumentosGenerados.ts:32 🟢 [useDocumentosGenerados] Cargando documentos para sociedad: 10
documentos-generados.store.ts:51 🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId: 10
documentos-generados.store.ts:60 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones...
obtener-documentos-juntas.use-case.ts:190 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:191 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)
obtener-documentos-juntas.use-case.ts:192 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:193 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
repositorio-documentos-http.repository.ts:304 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:305 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
repositorio-documentos-http.repository.ts:306 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:307 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
repositorio-documentos-http.repository.ts:308 🔵 [RepositorioDocumentosHttp] structureId: 10
useDocumentosGenerados.ts:52 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
DocumentosGeneradosView.vue:72 🔵 [DocumentosGeneradosView] currentPath computed: {routeParamsPath: Array(2), segments: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62'}
DocumentosGeneradosView.vue:118 🟡 [DocumentosGeneradosView] Watch detectó cambio a carpeta de junta, cargando: 62
PreviewModal.vue:56 🟡 [PreviewModal] ========================================
PreviewModal.vue:57 🟡 [PreviewModal] WATCH TRIGGERED
PreviewModal.vue:58 🟡 [PreviewModal] ========================================
PreviewModal.vue:59 🟡 [PreviewModal] isOpen: false
PreviewModal.vue:60 🟡 [PreviewModal] versionCode: undefined
PreviewModal.vue:61 🟡 [PreviewModal] document: null
PreviewModal.vue:62 🟡 [PreviewModal] mimeType: undefined
installHook.js:1 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:103
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bundler.js?v=e57cfd2b:6302
job @ reactivity.esm-bundler.js?v=e57cfd2b:1757
watch @ reactivity.esm-bundler.js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bundler.js?v=e57cfd2b:6330
watch @ runtime-core.esm-bundler.js?v=e57cfd2b:6263
setup @ PreviewModal.vue:53
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5275
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bundler.js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5275
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bundler.js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5275
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bundler.js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5275
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bundler.js?v=e57cfd2b:7087
process @ runtime-core.esm-bundler.js?v=e57cfd2b:6885
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bundler.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bundler.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bundler.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bundler.js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundler.js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosView.vue:536
onClick @ DocumentosGeneradosView.vue:990
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bundler.js?v=e57cfd2b:721
installHook.js:1 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <[...path] onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/documentos-generados/10()/operaciones/junta-accionistas,carpeta-62" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', path: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', query: {…}, hash: '', name: 'storage-documentos-generados-idSociety-operaciones-path', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bundler.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bundler.js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bundler.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bundler.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bundler.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bundler.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bundler.js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundler.js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigateToFolder @ DocumentosGeneradosView.vue:536
onClick @ DocumentosGeneradosView.vue:990
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bundler.js?v=e57cfd2b:721
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-node.mapper.ts:44 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
repositorio-node.mapper.ts:44 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
obtener-documentos-juntas.use-case.ts:147 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', type: 'folder', childrenCount: 2}
obtener-documentos-juntas.use-case.ts:159 🟡 [ObtenerDocumentosJuntasUseCase] Hijos encontrados: 2
obtener-documentos-juntas.use-case.ts:161 🟡 [ObtenerDocumentosJuntasUseCase] Detalle de hijos: (2) [{…}, {…}]
obtener-documentos-juntas.use-case.ts:167 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
documentos-generados.store.ts:111 [DocumentosGeneradosStore] Documentos de carpeta cargados: {carpetaId: '62', cantidad: 2}
DocumentosGeneradosView.vue:156 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
DocumentosGeneradosView.vue:273 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
DocumentosGeneradosView.vue:287 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
repositorio-documentos-http.repository.ts:319 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
repositorio-documentos-http.repository.ts:320 🔵 [RepositorioDocumentosHttp] ========================================
obtener-documentos-juntas.use-case.ts:198 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
obtener-documentos-juntas.use-case.ts:217 🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2): {directorio: {…}, juntas: {…}}
obtener-documentos-juntas.use-case.ts:221 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
documentos-generados.store.ts:64 🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...
obtener-documentos-juntas.use-case.ts:251 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:252 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS
obtener-documentos-juntas.use-case.ts:253 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:254 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
obtener-documentos-juntas.use-case.ts:31 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:32 🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)
obtener-documentos-juntas.use-case.ts:33 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:34 🟡 [ObtenerDocumentosJuntasUseCase] structureId: 10
repositorio-documentos-http.repository.ts:304 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:305 🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE
repositorio-documentos-http.repository.ts:306 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:307 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/core
repositorio-documentos-http.repository.ts:308 🔵 [RepositorioDocumentosHttp] structureId: 10
useDocumentosGenerados.ts:52 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
DocumentosGeneradosView.vue:156 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
DocumentosGeneradosView.vue:273 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
DocumentosGeneradosView.vue:287 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
repositorio-documentos-http.repository.ts:319 🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 22
repositorio-documentos-http.repository.ts:320 🔵 [RepositorioDocumentosHttp] ========================================
obtener-documentos-juntas.use-case.ts:39 🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core: 22
obtener-documentos-juntas.use-case.ts:66 🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado: {id: '45', name: 'juntas-accionistas', path: '/core/documentos-generados/operaciones/'}
obtener-documentos-juntas.use-case.ts:91 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas: 1
obtener-documentos-juntas.use-case.ts:92 🟡 [ObtenerDocumentosJuntasUseCase] Carpetas: [{…}]
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/62
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 62
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 62, name: 'junta del 11 de diciembre del 2025', type: 1, childrenCount: 2, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-node.mapper.ts:44 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
repositorio-node.mapper.ts:44 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'minuta-aumento-capital-aporte-dinerario.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
obtener-documentos-juntas.use-case.ts:104 🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida: {id: '62', name: 'junta del 11 de diciembre del 2025', childrenCount: 2}
obtener-documentos-juntas.use-case.ts:117 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
obtener-documentos-juntas.use-case.ts:265 🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida: {totalJuntas: 1}
obtener-documentos-juntas.use-case.ts:268 🟡 [ObtenerDocumentosJuntasUseCase] ========================================
documentos-generados.store.ts:67 🟢 [DocumentosGeneradosStore] Estructura obtenida: {operaciones: {…}, totalJuntas: 1}
useDocumentosGenerados.ts:52 🔵 [useDocumentosGenerados] documentosGenerados computed: {estructuraJuntas: Proxy(Object), estructuraOperaciones: Proxy(Object)}
DocumentosGeneradosView.vue:156 🔵 [DocumentosGeneradosView] getCurrentData ejecutado: {currentPath: Array(2), routePath: '/storage/documentos-generados/10/operaciones/junta-accionistas/carpeta-62', routeParams: {…}, documentosGenerados: {…}, estructuraOperaciones: Proxy(Object)}
DocumentosGeneradosView.vue:273 🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta: {carpetaId: 'carpeta-62', nodeId: '62', carpetaActual: '62', documentosCarpetaLength: 2}
DocumentosGeneradosView.vue:287 🟢 [DocumentosGeneradosView] Usando documentos cargados: Proxy(Array) {0: {…}, 1: {…}}
useDocumentosGenerados.ts:35 🟢 [useDocumentosGenerados] Documentos cargados exitosamente
DocumentosGeneradosView.vue:624 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
DocumentosGeneradosView.vue:624 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
DocumentosGeneradosView.vue:624 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
DocumentosGeneradosView.vue:624 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
DocumentosGeneradosView.vue:624 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
DocumentosGeneradosView.vue:624 🔵 [DocumentosGeneradosView] Navegando a breadcrumb index: 1
AlmacenView.vue:197 🔵 [AlmacenView] Ruta cambió: {newPath: Array(0), oldPath: undefined}
almacenamiento-http.repository.ts:59 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:60 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
almacenamiento-http.repository.ts:61 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:62 🔵 [AlmacenamientoHttp] sociedadId: 10
almacenamiento-http.repository.ts:63 🔵 [AlmacenamientoHttp] parentId: null
almacenamiento-http.repository.ts:71 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
repositorio-documentos-http.repository.ts:348 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:349 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
repositorio-documentos-http.repository.ts:350 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:351 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
repositorio-documentos-http.repository.ts:352 🔵 [RepositorioDocumentosHttp] structureId: 10
AlmacenView.vue:454 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: null, structureId: '10'}
AlmacenView.vue:468 🔵 [AlmacenView] Obteniendo carpeta /core/ para subir archivos...
repositorio-documentos-http.repository.ts:348 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:349 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
repositorio-documentos-http.repository.ts:350 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:351 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
repositorio-documentos-http.repository.ts:352 🔵 [RepositorioDocumentosHttp] structureId: 10
PreviewModal.vue:56 🟡 [PreviewModal] ========================================
PreviewModal.vue:57 🟡 [PreviewModal] WATCH TRIGGERED
PreviewModal.vue:58 🟡 [PreviewModal] ========================================
PreviewModal.vue:59 🟡 [PreviewModal] isOpen: false
PreviewModal.vue:60 🟡 [PreviewModal] versionCode: undefined
PreviewModal.vue:61 🟡 [PreviewModal] document: null
PreviewModal.vue:62 🟡 [PreviewModal] mimeType: undefined
installHook.js:1 ⚠️ [PreviewModal] Condiciones no cumplidas: {isOpen: false, hasVersionCode: false, hasMimeType: false}
overrideMethod @ installHook.js:1
watch.immediate @ PreviewModal.vue:103
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:204
baseWatchOptions.call @ runtime-core.esm-bundler.js?v=e57cfd2b:6302
job @ reactivity.esm-bundler.js?v=e57cfd2b:1757
watch @ reactivity.esm-bundler.js?v=e57cfd2b:1792
doWatch @ runtime-core.esm-bundler.js?v=e57cfd2b:6330
watch @ runtime-core.esm-bundler.js?v=e57cfd2b:6263
setup @ PreviewModal.vue:53
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
setupStatefulComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:8012
setupComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:7973
mountComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5309
processComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5275
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bundler.js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5275
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4789
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
mountChildren @ runtime-core.esm-bundler.js?v=e57cfd2b:5023
mountElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4946
processElement @ runtime-core.esm-bundler.js?v=e57cfd2b:4911
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4777
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bundler.js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5275
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4789
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5421
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
setupRenderEffect @ runtime-core.esm-bundler.js?v=e57cfd2b:5549
mountComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5323
processComponent @ runtime-core.esm-bundler.js?v=e57cfd2b:5275
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4789
patchSuspense @ runtime-core.esm-bundler.js?v=e57cfd2b:7087
process @ runtime-core.esm-bundler.js?v=e57cfd2b:6885
patch @ runtime-core.esm-bundler.js?v=e57cfd2b:4814
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5501
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bundler.js?v=e57cfd2b:405
Promise.then
queueFlush @ runtime-core.esm-bundler.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bundler.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bundler.js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundler.js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bundler.js?v=e57cfd2b:721
installHook.js:1 [Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes. 
  at <Teleport to=undefined disabled=false defer=false  ... > 
  at <MenuPortal disabled=false defer=false forceMount=false  ... > 
  at <DropdownMenuPortal style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <DropdownMenuContent align="start" class="w-[400px]" style= {fontFamily: 'var(--font-secondary)', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px'} > 
  at <PopperRoot data-slot="dropdown-menu" > 
  at <MenuRoot open=false onUpdate:open=fn dir="ltr"  ... > 
  at <DropdownMenuRoot data-slot="dropdown-menu" onUpdate:open=fn > 
  at <DropdownMenu > 
  at <SocietySelector > 
  at <Almacen onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouteProvider key="/storage/almacen" vnode= {__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …} route= {fullPath: '/storage/almacen', path: '/storage/almacen', query: {…}, hash: '', name: 'storage-almacen', …}  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage > 
  at <Default ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <AsyncComponentWrapper ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <LayoutLoader key="default" layoutProps= {ref: RefImpl} name="default" > 
  at <NuxtLayoutProvider layoutProps= {ref: RefImpl} key="default" name="default"  ... > 
  at <NuxtLayout > 
  at <App key=4 > 
  at <NuxtRoot>
overrideMethod @ installHook.js:1
warn$1 @ runtime-core.esm-bundler.js?v=e57cfd2b:50
renderComponentRoot @ runtime-core.esm-bundler.js?v=e57cfd2b:6680
componentUpdateFn @ runtime-core.esm-bundler.js?v=e57cfd2b:5492
run @ reactivity.esm-bundler.js?v=e57cfd2b:207
runIfDirty @ reactivity.esm-bundler.js?v=e57cfd2b:245
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
flushJobs @ runtime-core.esm-bundler.js?v=e57cfd2b:405
flushJobs @ runtime-core.esm-bundler.js?v=e57cfd2b:427
Promise.then
queueFlush @ runtime-core.esm-bundler.js?v=e57cfd2b:319
queueJob @ runtime-core.esm-bundler.js?v=e57cfd2b:314
effect2.scheduler @ runtime-core.esm-bundler.js?v=e57cfd2b:5543
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:235
endBatch @ reactivity.esm-bundler.js?v=e57cfd2b:293
notify @ reactivity.esm-bundler.js?v=e57cfd2b:568
trigger @ reactivity.esm-bundler.js?v=e57cfd2b:542
set value @ reactivity.esm-bundler.js?v=e57cfd2b:1421
finalizeNavigation @ vue-router.mjs?v=e57cfd2b:1190
(anonymous) @ vue-router.mjs?v=e57cfd2b:1128
Promise.then
pushWithRedirect @ vue-router.mjs?v=e57cfd2b:1115
push @ vue-router.mjs?v=e57cfd2b:1066
navigate @ vue-router.mjs?v=e57cfd2b:767
callWithErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:197
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js?v=e57cfd2b:204
invoker @ runtime-dom.esm-bundler.js?v=e57cfd2b:721
AlmacenView.vue:197 🔵 [AlmacenView] Ruta cambió: {newPath: Array(0), oldPath: Array(0)}
almacenamiento-http.repository.ts:59 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:60 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
almacenamiento-http.repository.ts:61 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:62 🔵 [AlmacenamientoHttp] sociedadId: 10
almacenamiento-http.repository.ts:63 🔵 [AlmacenamientoHttp] parentId: null
almacenamiento-http.repository.ts:71 🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)
repositorio-documentos-http.repository.ts:348 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:349 🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ
repositorio-documentos-http.repository.ts:350 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:351 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/10/nodes/root
repositorio-documentos-http.repository.ts:352 🔵 [RepositorioDocumentosHttp] structureId: 10
repositorio-documentos-http.repository.ts:363 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
repositorio-documentos-http.repository.ts:364 🔵 [RepositorioDocumentosHttp] ========================================
almacenamiento-http.repository.ts:91 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 39
repositorio-documentos-http.repository.ts:363 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
repositorio-documentos-http.repository.ts:364 🔵 [RepositorioDocumentosHttp] ========================================
useObtenerCarpetaDocumentosSocietarios.ts:36 🔵 [useObtenerCarpetaDocumentosSocietarios] Nodos raíz obtenidos: 2
useObtenerCarpetaDocumentosSocietarios.ts:45 🟢 [useObtenerCarpetaDocumentosSocietarios] Carpeta /core/ encontrada: {id: '39', name: 'core', path: '/', code: 'ee3fb899-00cb-4c26-b08a-589beedc688c'}
AlmacenView.vue:470 🔵 [AlmacenView] Carpeta /core/ obtenida: 39
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-node.mapper.ts:44 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
almacenamiento-http.repository.ts:112 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 2 elementos
almacenamiento-http.repository.ts:129 🔵 [AlmacenamientoHttp] Nodos obtenidos: 2
almacenamiento-http.repository.ts:130 🔵 [AlmacenamientoHttp] ========================================
repositorio-documentos-http.repository.ts:363 🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
repositorio-documentos-http.repository.ts:364 🔵 [RepositorioDocumentosHttp] ========================================
almacenamiento-http.repository.ts:91 🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada: {id: '39', name: 'core', path: '/'}
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/39
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 39
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 39, name: 'core', type: 1, childrenCount: 3, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-node.mapper.ts:44 🟡 [RepositorioNodeMapper] MIME type inferido desde nombre: {fileName: 'acta-junta-universal.docx', inferredMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
almacenamiento-http.repository.ts:112 🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado): 2 elementos
almacenamiento-http.repository.ts:129 🔵 [AlmacenamientoHttp] Nodos obtenidos: 2
almacenamiento-http.repository.ts:130 🔵 [AlmacenamientoHttp] ========================================
AlmacenView.vue:151 🔵 [AlmacenView] Navegando a carpeta: 78
AlmacenView.vue:163 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78
almacenamiento-http.repository.ts:59 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:60 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
almacenamiento-http.repository.ts:61 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:62 🔵 [AlmacenamientoHttp] sociedadId: 10
almacenamiento-http.repository.ts:63 🔵 [AlmacenamientoHttp] parentId: 78
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 78
AlmacenView.vue:197 🔵 [AlmacenView] Ruta cambió: {newPath: Array(1), oldPath: Array(0)}
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 78
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
almacenamiento-http.repository.ts:129 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
almacenamiento-http.repository.ts:130 🔵 [AlmacenamientoHttp] ========================================
AlmacenView.vue:454 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '78', structureId: '10'}
AlmacenView.vue:464 🔵 [AlmacenView] Usando carpeta actual: 78
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
almacenamiento-http.repository.ts:59 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:60 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
almacenamiento-http.repository.ts:61 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:62 🔵 [AlmacenamientoHttp] sociedadId: 10
almacenamiento-http.repository.ts:63 🔵 [AlmacenamientoHttp] parentId: 78
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/78
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 78
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 78, name: 'kkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
almacenamiento-http.repository.ts:129 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
almacenamiento-http.repository.ts:130 🔵 [AlmacenamientoHttp] ========================================
AlmacenView.vue:151 🔵 [AlmacenView] Navegando a carpeta: 79
AlmacenView.vue:163 🔵 [AlmacenView] Actualizando ruta a: /storage/almacen/10/78/79
almacenamiento-http.repository.ts:59 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:60 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
almacenamiento-http.repository.ts:61 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:62 🔵 [AlmacenamientoHttp] sociedadId: 10
almacenamiento-http.repository.ts:63 🔵 [AlmacenamientoHttp] parentId: 79
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 79
AlmacenView.vue:197 🔵 [AlmacenView] Ruta cambió: {newPath: Array(2), oldPath: Array(1)}
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 79
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
almacenamiento-http.repository.ts:129 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
almacenamiento-http.repository.ts:130 🔵 [AlmacenamientoHttp] ========================================
AlmacenView.vue:454 🔵 [AlmacenView] Watch parentNodeIdForUpload: {carpetaId: '79', structureId: '10'}
AlmacenView.vue:464 🔵 [AlmacenView] Usando carpeta actual: 79
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
almacenamiento-http.repository.ts:59 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:60 🔵 [AlmacenamientoHttp] LIST DOCUMENTOS
almacenamiento-http.repository.ts:61 🔵 [AlmacenamientoHttp] ========================================
almacenamiento-http.repository.ts:62 🔵 [AlmacenamientoHttp] sociedadId: 10
almacenamiento-http.repository.ts:63 🔵 [AlmacenamientoHttp] parentId: 79
repositorio-documentos-http.repository.ts:390 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:391 🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID
repositorio-documentos-http.repository.ts:392 🔵 [RepositorioDocumentosHttp] ========================================
repositorio-documentos-http.repository.ts:393 🔵 [RepositorioDocumentosHttp] URL: http://localhost:3000/api/v2/repository/society-profile/nodes/79
repositorio-documentos-http.repository.ts:394 🔵 [RepositorioDocumentosHttp] nodeId: 79
repositorio-documentos-http.repository.ts:405 🔵 [RepositorioDocumentosHttp] Nodo obtenido: {id: 79, name: 'kkkk', type: 1, childrenCount: 1, hasDocumentVersions: false, …}
repositorio-documentos-http.repository.ts:428 🔵 [RepositorioDocumentosHttp] ========================================
almacenamiento-http.repository.ts:129 🔵 [AlmacenamientoHttp] Nodos obtenidos: 1
almacenamiento-http.repository.ts:130 🔵 [AlmacenamientoHttp] ========================================
