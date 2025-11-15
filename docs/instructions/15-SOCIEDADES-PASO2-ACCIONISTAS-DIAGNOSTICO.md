# Diagnóstico Paso Accionistas (Migración Hexagonal)

## 1. Fuente de verdad funcional
- **UI y UX válidos hoy**: `app/modules/registro-sociedades` (legacy). Ahí están los formularios correctos, validaciones por tipo de persona y flujos de creación/edición ya aprobados.
- **Contratos backend**: `docs/backend/02-accionistas.md` describe endpoints, payloads y reglas, incluyendo ejemplos como los que compartiste (IDs obligatorios en edición, estructura de `persona`, requerimientos para representantes/fiduciarios).
- **Política de UUID**: `docs/instructions/14-SOCIEDADES-UUID-POLICY.md`. Para colecciones (accionistas) el backend exige `id` en el miembro y `persona.id` cuando se actualiza; en creación los omite.

## 2. Qué debe traer el nuevo flujo
1. **Componentes UI**  
   - Reutilizar las vistas aprobadas del legacy: `AccionistasModal.vue` + formularios por tipo (`AccionistaNaturalForm`, `AccionistaJuridicoForm`, etc.).  
   - Cada formulario sólo debe exponer campos definidos en el backend; cualquier campo “extra” en la versión hexagonal debe eliminarse o esconderse.
   - El campo `participacionPorcentual` se mantiene, porque el backend lo exige y se usa en pasos posteriores (asignación de acciones). Si la UI final no lo muestra en este paso, hay que moverlo junto con el contrato completo.

2. **Capa de aplicación (DDD)**  
   - `useAccionistasController` (núcleo hexagonal) debe seguir siendo la única fuente de datos.  
   - Los DTO deben mapear 1:1 a las interfaces de `@hexag/registros/sociedades/pasos/accionistas/domain`.  
   - Para edición, el controller debe inyectar los IDs (`accionista.id`, `persona.id`) antes de enviar el payload al repositorio.

3. **Integraciones con backend/MSW**  
   - Endpoints descritos en `docs/backend/02-accionistas.md` deben estar mockeados en MSW (`app/mocks/msw/registros/...`).  
   - Respetar validaciones del backend: por ejemplo, error 422 cuando falta `persona.id` al actualizar.  
   - Confirmar headers de autenticación (`00-autenticacion.md`) y formatos de error para no “inventar” respuestas.

## 3. Brecha actual en la carpeta `registros`
| Área | Estado | Qué falta |
| --- | --- | --- |
| Modal + formularios | Se migró parcialmente pero arrastra campos default y lógica de Pinia legacy | Volver a hidratar con stores propios del legacy (prop drilling solo para datos iniciales), eliminar campos sobrantes, respetar condicionales reales. |
| DTOs / mapping | `AccionistasManager` y `AccionistaModal` ajustados para compilar | Falta reflejar los contratos completos (IDs, representantes, fiducios) y validar antes de enviar. |
| Rutas | Progreso actualizado (`societyRegisterNavigation`) | Asegurar que todos los pasos usan `/registros` y `EntityModeEnum` en el store global. |
| Documentación | Esta guía | Mantenerla sincronizada cuando cierre la migración. |

## 4. Plan para igualar al registro societario
1. **Clonar lógica aprobada**  
   - Copiar desde `app/modules/registro-sociedades/components/modals/AccionistasModal.vue` y los formularios relacionados.  
   - Convertirlos en componentes puramente presentacionales (prop `initialValues`, eventos `submit/close`) respetando los mismos campos.

2. **Reescribir la capa de estado**  
   - Pinia stores en `app/core/presentation/registros/.../stores/forms` deben replicar exactamente los estados del legacy.  
   - Controlador `useAccionistasController` sigue manejando fetch/save/delete usando `accionsitas.repository`.

3. **Contratos backend**  
   - Leer `docs/backend/02-accionistas.md` para confirmar payload final de cada tipo.  
   - Incluir siempre `id` y `persona.id` en edición (según UUID Policy).  
   - Validar `participacionPorcentual` (0–100) y reglas específicas (p.ej. `tieneRuc` para fideicomisos).

- **Regla transversal de IDs**  
  - Cada CRUD de colecciones con sub-objetos (accionistas, directores, apoderados, etc.) debe reenviar *el mismo* `id` del elemento y los `id` de sus entidades hijas (`persona.id`, `representante.id` si aplica) cuando el backend los genere.  
  - En **creación** se genera localmente un uuid tanto para el accionista como para `persona.id` (mismas reglas que MSW); en edición se reutilizan los uuid recibidos.  
  - Documentar esta regla en cada fetch para evitar errores 422 como “persona.id required”.

4. **MSW / pruebas**  
   - Actualizar los handlers MSW con ejemplos reales (los JSON que facilitaste).  
   - Validar con `npm run typecheck` + pruebas manuales en `/registros/sociedades/:id/accionistas`.

## 5. Resumen de dependencias antes de mover más UI
- `docs/backend/02-accionistas.md` – único contrato válido.
- Componentes legacy bajo `app/modules/registro-sociedades` – copiar UI/UX exacta.
- `docs/instructions/13-SOCIEDADES-PASO2-ACCIONISTAS.md` – reglas de negocio generales.
- `docs/instructions/14-SOCIEDADES-UUID-POLICY.md` – IDs obligatorios.

Con esto podemos reconstruir el modal (y stores) dentro de `app/core/presentation/registros/sociedades/pasos/accionistas` sin depender de hacks del legacy, pero manteniendo funcionalidad idéntica a la que ya está en producción en `registro-societario`.

