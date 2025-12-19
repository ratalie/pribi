# Plan para Remover Todos los `console` de Juntas

## 📋 Resumen Ejecutivo

Este documento detalla el plan para remover todos los `console.log`, `console.error`, `console.warn`, `console.debug` y otros métodos de console de:

- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/`
- `app/core/presentation/juntas/`
- `app/core/hexag/juntas/`

**Total estimado:** ~751 ocurrencias de console en múltiples archivos.

---

## 🎯 Estrategia General

1. **Prioridad:** Remover primero los `console.log` y `console.debug` (debugging)
2. **Evaluar:** Revisar `console.error` y `console.warn` - algunos pueden ser útiles para producción
3. **Reemplazo:** Considerar usar un sistema de logging estructurado si es necesario
4. **Verificación:** Ejecutar búsqueda final para confirmar eliminación completa

---

## 📁 Fase 1: Pages - Junta Accionistas

### Archivos a procesar (20 archivos, ~88 ocurrencias)

#### 1.1. Páginas principales

- `crear.vue` - 2 console.error
- `historico.vue` - 1 console.error
- `historial.vue` - 1 console.error

#### 1.2. Páginas de flujo ([flowId])

- `detalles/index.vue` - 12 console (log + error)
- `descargar.vue` - 5 console.log
- `resumen/index.vue` - 5 console.log
- `nombramiento-directorio/nombramiento.vue` - 1 console.log
- `nombramiento-directorio/cantidad.vue` - 1 console.log
- `nombramiento-directorio/votacion.vue` - 5 console (log + warn + error)
- `nombramiento-directorio/presidente.vue` - 7 console.log
- `nombramiento-directores/votacion.vue` - 2 console.log
- `nombramiento-directores/presidente.vue` - 7 console.log
- `nombramiento-auditores/votacion.vue` - 1 console.error
- `nombramiento-gerente/otorgamiento.vue` - 1 console.error
- `aplicacion-resultados/utilidades-montos.vue` - 15 console (log + error)
- `aplicacion-resultados/votacion.vue` - 1 console.error
- `pronunciamiento-gestion/votacion.vue` - 1 console.error
- `aporte-dinerario/votacion.vue` - 8 console (log + warn)
- `remocion-gerente/votacion.vue` - 5 console (log + warn)
- `remocion-gerente/resumen.vue` - 1 console.error
- `remocion-apoderados/resumen.vue` - 1 console.error

**Total Fase 1:** ~88 ocurrencias

---

## 📁 Fase 2: Core/Presentation/Juntas

### Archivos a procesar (~426 ocurrencias)

#### 2.1. Stores principales

- `stores/agenda-items.store.ts` - 4 console (debug + error)
- `stores/asistencia.store.ts` - 20 console (debug + warn + error)
- `stores/snapshot.store.ts` - 8 console.log
- `stores/junta-historial.store.ts` - 15 console (debug + log + warn + error)
- `stores/download-data.store.ts` - 3 console (debug + error)

#### 2.2. Puntos de Acuerdo - Capitalización Créditos

- `puntos-acuerdo/capitalizacion-creditos/acreedores/stores/useAcreedoresStore.ts` - 8 console (log + error)
- `puntos-acuerdo/capitalizacion-creditos/acreedores/composables/useAcreedoresController.ts` - 4 console (warn + log + error)
- `puntos-acuerdo/capitalizacion-creditos/creditos/stores/useCapitalizacionesStore.ts` - 8 console (log + error)
- `puntos-acuerdo/capitalizacion-creditos/creditos/composables/useCapitalizacionesController.ts` - (verificar)
- `puntos-acuerdo/capitalizacion-creditos/votacion/composables/useVotacionCapitalizacionController.ts` - 6 console (log + error)

#### 2.3. Puntos de Acuerdo - Nombramiento Gerente

- `puntos-acuerdo/nombramiento-gerente/stores/useNombramientoGerenteStore.ts` - 12 console (warn + log + error)
- `puntos-acuerdo/nombramiento-gerente/composables/useNombramientoGerentePage.ts` - 5 console (log + error)

#### 2.4. Puntos de Acuerdo - Remoción Directores

- `puntos-acuerdo/remocion-directores/stores/useRemocionDirectoresStore.ts` - (verificar)
- `puntos-acuerdo/remocion-directores/votacion/stores/useVotacionRemocionDirectoresStore.ts` - 15 console (log + error)
- `puntos-acuerdo/remocion-directores/composables/useRemocionDirectoresPage.ts` - 6 console (warn + log + error)

#### 2.5. Puntos de Acuerdo - Remoción Apoderados

- `puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts` - ~50 console (log + warn + error)
- `puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts` - (verificar)
- `puntos-acuerdo/remocion-apoderados/votacion/components/ItemVotacionCompleto.vue` - (verificar)
- `puntos-acuerdo/remocion-apoderados/votacion/components/MayoriaVotacionItem.vue` - (verificar)

#### 2.6. Puntos de Acuerdo - Remoción Gerente

- `puntos-acuerdo/remocion-gerente/votacion/composables/useVotacionRemocionController.ts` - ~80 console (log + warn + error)

#### 2.7. Puntos de Acuerdo - Nombramiento Apoderados

- `puntos-acuerdo/nombramiento-apoderados/votacion/composables/useVotacionNombramientoApoderadosController.ts` - 8 console (log + warn + error)

#### 2.8. Puntos de Acuerdo - Aporte Dinerario

- `puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts` - (verificar)
- `puntos-acuerdo/aporte-dinerario/aportantes/components/AportanteModal.vue` - 1 console.warn

#### 2.9. Otros composables y stores

- `puntos-acuerdo/aplicacion-resultados/composables/useAplicacionResultadosInitialization.ts` - 1 console.error

**Total Fase 2:** ~426 ocurrencias

---

## 📁 Fase 3: Core/Hexag/Juntas

### Archivos a procesar (~237 ocurrencias)

#### 3.1. Repositorios HTTP

- `infrastructure/repositories/junta.http.repository.ts` - 18 console (debug + log + error)
- `infrastructure/repositories/agenda-items.http.repository.ts` - 6 console (debug + error)
- `infrastructure/repositories/asistencia.msw.repository.ts` - 6 console (debug + error)
- `infrastructure/repositories/designation-attorney.http.repository.ts` - 9 console (debug + error)
- `infrastructure/repositories/credit-capitalization.http.repository.ts` - 20 console (debug + warn + error)
- `infrastructure/repositories/creditor.http.repository.ts` - 20 console (debug + warn + error)
- `infrastructure/repositories/removal-director.http.repository.ts` - 12 console (debug + warn + error)
- `infrastructure/repositories/vote.http.repository.ts` - 9 console (debug + log + error)
- `infrastructure/repositories/application-of-results-http.repository.ts` - 9 console (debug + error)
- `infrastructure/repositories/financial-report-document-http.repository.ts` - 15 console (debug + error)

#### 3.2. Mocks y Handlers

- `infrastructure/mocks/handlers/snapshot.handlers.ts` - 2 console (warn + debug)
- `infrastructure/mocks/handlers/asistencia.handlers.ts` - 2 console.debug
- `infrastructure/mocks/handlers/meeting-details.handlers.ts` - 4 console (warn + debug)
- `infrastructure/mocks/data/agenda-items.state.ts` - 3 console.debug
- `infrastructure/mocks/data/juntas.state.ts` - 4 console (debug + warn)
- `infrastructure/mocks/data/meeting-details.state.ts` - 3 console.debug
- `infrastructure/mocks/data/snapshot.state.ts` - 2 console.debug

#### 3.3. Mappers

- `infrastructure/mappers/meeting-details.mapper.ts` - 2 console.log

#### 3.4. Use Cases

- `application/use-cases/asistencia/update-asistencia.use-case.ts` - 5 console (log + warn)

#### 3.5. Tests

- `infrastructure/repositories/__tests__/junta.repository.shared.test.ts` - 4 console (log + warn)
- `infrastructure/repositories/__tests__/junta-snapshot.test.ts` - 2 console.log

**Total Fase 3:** ~237 ocurrencias

---

## 🔍 Consideraciones Especiales

### Console que DEBEN mantenerse (evaluar caso por caso)

1. **Tests:** Los console en archivos de test pueden ser útiles para debugging
2. **Mocks:** Los console.debug en mocks pueden ser útiles durante desarrollo
3. **Errores críticos:** Algunos console.error pueden ser útiles para monitoreo

### Console que DEBEN removerse

1. **Console.log de debugging:** Todos los console.log con emojis y mensajes de debug
2. **Console.debug:** Todos los console.debug en código de producción
3. **Console.warn informativos:** Warnings que no aportan valor en producción

---

## ✅ Checklist de Ejecución

### Fase 1: Pages

- [ ] Procesar `crear.vue`
- [ ] Procesar `historico.vue` y `historial.vue`
- [ ] Procesar `detalles/index.vue`
- [ ] Procesar `descargar.vue`
- [ ] Procesar `resumen/index.vue`
- [ ] Procesar todas las páginas de nombramiento-directorio
- [ ] Procesar todas las páginas de nombramiento-directores
- [ ] Procesar todas las páginas de nombramiento-auditores
- [ ] Procesar todas las páginas de nombramiento-gerente
- [ ] Procesar todas las páginas de aplicacion-resultados
- [ ] Procesar todas las páginas de pronunciamiento-gestion
- [ ] Procesar todas las páginas de aporte-dinerario
- [ ] Procesar todas las páginas de remocion-gerente
- [ ] Procesar todas las páginas de remocion-apoderados

### Fase 2: Core/Presentation/Juntas

- [ ] Procesar todos los stores principales
- [ ] Procesar capitalizacion-creditos
- [ ] Procesar nombramiento-gerente
- [ ] Procesar remocion-directores
- [ ] Procesar remocion-apoderados
- [ ] Procesar remocion-gerente
- [ ] Procesar nombramiento-apoderados
- [ ] Procesar aporte-dinerario
- [ ] Procesar otros composables

### Fase 3: Core/Hexag/Juntas

- [ ] Procesar todos los repositorios HTTP
- [ ] Procesar todos los mocks y handlers
- [ ] Procesar mappers
- [ ] Procesar use cases
- [ ] Evaluar si mantener console en tests

### Verificación Final

- [ ] Ejecutar búsqueda: `grep -r "console\." app/pages/operaciones/sociedades/[societyId]/junta-accionistas`
- [ ] Ejecutar búsqueda: `grep -r "console\." app/core/presentation/juntas`
- [ ] Ejecutar búsqueda: `grep -r "console\." app/core/hexag/juntas`
- [ ] Verificar que no haya errores de compilación
- [ ] Ejecutar tests relacionados

---

## 📊 Métricas

- **Total estimado de console a remover:** ~751 ocurrencias
- **Archivos afectados:** ~100+ archivos
- **Tiempo estimado:** 2-3 horas (dependiendo de revisión de casos especiales)

---

## 🚀 Orden de Ejecución Recomendado

1. **Empezar por Pages** (más visible, menos crítico)
2. **Continuar con Presentation** (lógica de presentación)
3. **Finalizar con Hexag** (infraestructura, evaluar tests)

---

## 📝 Notas

- Algunos `console.error` pueden ser útiles para debugging en producción
- Considerar implementar un sistema de logging estructurado si se necesita tracking
- Los console en archivos de test pueden mantenerse si son útiles
- Verificar que la eliminación no rompa funcionalidad existente





