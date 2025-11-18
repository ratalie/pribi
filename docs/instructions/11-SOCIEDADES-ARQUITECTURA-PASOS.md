# Arquitectura – Flujo por pasos (Registros de Sociedades)

## Visión general
Cada paso del registro (Datos principales, Quórums, Accionistas, etc.) sigue el mismo patrón para evitar duplicar lógica y garantizar que se pueda entrar a cualquier ruta directamente.

```
Página (route) → Controller (ensure) → Store (Pinia options) → Form/composable → Repositorio HTTP → MSW
```

## 1. Página
- Ubicación: `app/pages/registro-societario/sociedades/{crear|editar}/[id]/<paso>.vue`.
- Responsabilidades:
  - Calcular `societyId` usando `useRoute`.
  - Invocar el controller del paso (`useDatosSociedadController`, `useQuorumController`, etc.).
  - Renderizar el componente UI (`DatosSociedadForm`, `QuorumMayoriasStep`, …).
  - Opcional: mostrar skeleton usando `isBootstrapping`.

## 2. Controller (`use<Step>Controller.ts`)
- Se define en `app/core/presentation/registros/sociedades/composables/`.
- Hace `ensureLoaded` desde el store específico.
- Eventos controlados:
  - `onMounted`: siempre intenta `ensure`.
  - `onActivated`: vuelve a validar cuando la página estaba en cache (keep-alive).
  - `watch(societyId)`: cuando cambia el ID, forza `ensure`.
  - `watch(store.datos)`: si el dato quedó `null` sin `lastFetchedAt`, llama `ensure` con `force`.
- Expone:
  - `isBootstrapping`, `isEnsuring`, `error`, `datos`, `status`.
- Logs (`console.log`) describen cada acción para facilitar debug.

## 3. Store (Pinia options)
- Ejemplo: `useDatosSociedadStore`.
- Reglas:
  - Sintaxis `defineStore("name", { state, getters, actions })`.
  - Estado incluye `datos`, `status`, `errorMessage`, `origin`, `lastFetchedAt`, `lastSocietyId`, `lastPayloadSignature`.
  - Acción clave: `async ensureLoaded(id, { ttlMs, force, source })`.
    - Si el ID cambió o `lastFetchedAt` es `null`, hace `load`.
    - Guarda metadatos con `markFetchMetadata`.
  - Otras acciones: `load`, `create`, `update`.
  - `persist: true` para mantener datos entre refrescos.

## 4. Form/composable
- `DatosSociedadForm.vue` + `useDatosSociedadForm.ts` (se replica la idea para cada paso).
- Responsabilidad:
  - Form UI + submit + reset + watchers de completitud.
  - No debe hacer fetch; sólo se alimenta de `store.datos`.
  - Normaliza enums antes de enviar payloads.

## 5. Repositorio y MSW
- Repos en `app/core/hexag/registros/sociedades/pasos/<paso>/infrastructure/repositories`.
  - Usan `$fetch` + `withAuthHeaders`.
  - Añaden logs de request/response/error.
- MSW en `.../mocks/handlers` + `.../mocks/data`.
  - Persisten data en IndexedDB para desarrollo.
  - Respaldan los mismos endpoints `/api/v2/society-profile`.

## Roadmap de adopción
- [x] Paso 1 (Datos principales) ya usa este patrón.
- [x] Quórums implementado (store + controller a replicar).
- [ ] Migrar los demás pasos (Accionistas, Acciones, etc.) para tener la misma experiencia.
- [ ] Extra: crear un `useSocietyStepController(stepId)` genérico para reducir boilerplate.

---

Última actualización: Noviembre 14, 2025

