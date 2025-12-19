🎯 [useJuntasFlowNext] onClickNext ejecutado desde el botón
useJuntasFlowNext.ts:105 🎯 [useJuntasFlowNext] Ruta actual: /operaciones/sociedades/11/junta-accionistas/8/capitalizacion-creditos/votacion
useJuntasFlowNext.ts:108 ⏳ [useJuntasFlowNext] Loading activado
useJuntasFlowNext.ts:111 ▶️ [useJuntasFlowNext] Ejecutando handleNext...
useVotacionCapitaliz…onController.ts:346 [DEBUG][VotacionCapitalizacionController] guardarVotacion() ejecutado - Iniciando guardado...
useVotacionCapitaliz…onController.ts:398 [DEBUG][VotacionCapitalizacionController] Estado antes de guardar: 
{tipoAprobacion: 'SOMETIDO_A_VOTACION', votosActuales: 2, votantesDisponibles: 2}
useVotacionCapitaliz…onController.ts:427 [DEBUG][VotacionCapitalizacionController] Es sometida a votos - usando votos del usuario: 2
installHook.js:1 [VotacionCapitalizacionController] Error al guardar votación: TypeError: votacionStore.saveVotacion is not a function
    at Object.guardarVotacion (useVotacionCapitaliz…ontroller.ts:445:27)
    at votacion.vue:107:22
    at Proxy.handler (useJuntasFlowNext.ts:112:13)
    at _createVNode.onClick._cache.<computed>._cache.<computed> (FooterNavigationButtons.vue:48:279)
installHook.js:1 ❌ [useJuntasFlowNext] Error: TypeError: votacionStore.saveVotacion is not a function
    at Object.guardarVotacion (useVotacionCapitaliz…ontroller.ts:445:27)
    at votacion.vue:107:22
    at Proxy.handler (useJuntasFlowNext.ts:112:13)
    at _createVNode.onClick._cache.<computed>._cache.<computed> (FooterNavigationButtons.vue:48:279)
useJuntasFlowNext.ts:268 ⏳ [useJuntasFlowNext] Loading desactivado
useJuntasFlowNext.ts:270 Uncaught (in promise) TypeError: votacionStore.saveVotacion is not a function
    at Object.guardarVotacion (useVotacionCapitaliz…ontroller.ts:445:27)
    at votacion.vue:107:22
    at Proxy.handler (useJuntasFlowNext.ts:112:13)
    at _createVNode.onClick._cache.<computed>._cache.<computed> (FooterNavigationButtons.vue:48:279)

