## Plan Integral de Limpieza y Reorganización

> **Contexto**  
> Historia de 4 equipos, múltiples sidebars y capas mezcladas. Objetivo actual: consolidar la arquitectura hexagonal (core + hexagon + presentation) como versión oficial, preservando la lógica del Equipo 1 como “Versión 1” dentro de `registro-societarios`.

---

### 1. Estudio (Inventario Dirigido)

1. **Mapa de rutas**  
   - Catalogar todas las entradas en `app/pages/**`.  
   - Campos mínimos: `Ruta`, `Layout`, `Composable`, `Store`, `Estado (v1/v4)`.  
   - Herramienta sugerida: hoja compartida o Notion.

2. **Censo de capas**  
   - Clasificar carpetas top-level (`app/components`, `app/modules`, `app/presentation`, etc.) indicando naturaleza: `UI genérica`, `Legacy`, `Hexagonal`.  
   - Marcar si dependen de Tailwind viejo, shadcn, o estilos custom.

3. **Dependencias y uso real**  
   - Ejecutar `npx depcruise app/pages/registro-societario` para detectar archivos sin consumidores.  
   - Complementar con `rg "defineStore\(" app/stores -n` para identificar stores sin uso.

4. **Infraestructura y mocks**  
   - Verificar `app/infra/**` y `app/application/**` para entender qué repositorios son activos.  
   - Revisar los handlers MSW (`app/infra/mocks/msw`) y anotar cuáles siguen vigentes.

**Entregables del Estudio**  
- Tabla de rutas y componentes.  
- Lista de carpetas con etiqueta `mantener`, `migrar`, `archivar`.  
- Reporte rápido de dependencias huérfanas.  
- Nota en `PLAN_MIGRACION.md` indicando fecha de cierre del inventario.

---

### 2. Diagnóstico (Decisiones Sobre El Código)

1. **Rutas duplicadas / playgrounds**  
   - `app/pages/indiceSidebarsPruebas.vue`, `app/pages/test/**`, `debug-theme.vue`, `viewComponents.vue`.  
   - Clasificar como `laboratorio` y mover a `app/_playground` o eliminar.

2. **Capas mezcladas**  
   - Formularios y wizards antiguos viven en `app/components/**` y `app/modules/**`.  
   - Decidir si migran a `app/presentation/registros/sociedades/**` o se congelan como legacy.

3. **Stores y composables**  
   - Para cada store en `app/stores/**`, anotar vista que lo consume.  
   - Si no hay consumidor en la tabla de rutas, marcar como `candidato a legacy`.

4. **Infra duplicada**  
   - Confirmar que solo exista un repositorio por caso de uso (HTTP vs mocks).  
   - Si hay versiones viejas, etiquetar para mover a legacy.

5. **UI del Equipo 1**  
   - Es la referencia visual oficial.  
   - Guardar componentes originales como `legacy-ui` para reutilizar estilos mientras se limpian reglas de negocio.

**Salida del Diagnóstico**  
- Diagrama simple que muestre flujo ideal (presentation → application → hexag → infra).  
- Lista priorizada de carpetas/archivos para mover, refactorizar o eliminar.  
- Riesgos identificados (ej.: “Form Accionistas usa store antiguo”).

---

### 3. Limpieza y Reorganización

1. **Contenedor Legacy**  
   - Crear `app/legacy/registro-societarios/v1/{pages,presentation,stores,infra}`.  
   - Mover ahí todo lo que mantendremos como referencia funcional (UI final + lógica del Equipo 1).

2. **Rutas controladas**  
   - Montar `app/pages/legacy/registro-societarios/**` apuntando al legacy.  
   - Eliminar rutas duplicadas en `app/pages/registro-societario/**`.  
   - Sidebar: agregar entrada explícita “Versión 1 (solo referencia)”.

3. **Normalizar arquitectura hexagonal**  
   - Asegurar que cada feature siga patrón:  
     `presentation → application → hexag → infra`.  
   - Si falta alguna carpeta (ej. servicios en `app/application/registros`), crearla antes de mover código.

4. **Refactor UI**  
   - Reutilizar componentes del Equipo 1 dentro de `app/presentation/registros/sociedades/components/legacy-ui`.  
   - Crear wrappers tipados que adapten las reglas nuevas sin reescribir todo.

5. **Documentación viva**  
   - Actualizar `PLAN_MIGRACION.md` y crear README dentro de `app/legacy/registro-societarios` explicando: alcance, cómo migrar, cuándo se elimina.

6. **Automatizar limpieza**  
   - Registrar cada movimiento en `SCRIPT-LIMPIEZA.sh`.  
   - Opcional: crear script `npm run clean:legacy` que borre carpetas ya migradas.

---

### 4. Verificación y Pruebas

1. **Smoke tests manuales**  
   - Flujo moderno: `/registros/sociedades/...`  
   - Flujo legacy: `/legacy/registro-societarios/...`

2. **Regresiones automatizadas**  
   - Si hay tiempo, crear suites Playwright/Cypress para: apoderado, accionistas, datos principales.  
   - Documentar casos mínimos en `docs/roadmaps/testing.md`.

3. **Linter y tipos**  
   - Después de cada bloque grande: `npm run lint`, `npm run typecheck`.

4. **Checklist antes de eliminar**  
   - `rg "ruta/legacy"` confirma que ya no hay imports.  
   - Nota en docs actualizada.  
   - Nueva ruta funcionando.

---

### 5. Roadmap Sugerido

| Sprint | Objetivo | Entregables |
| --- | --- | --- |
| S1 | Estudio completo | Tabla de rutas, censo de capas, reporte dependencias |
| S2 | Diagnóstico consolidado | Lista priorizada de movimientos, riesgos |
| S3 | Limpieza lote 1 | Contenedor legacy creado, rutas legacy operativas |
| S4 | Limpieza lote 2 | UI del Equipo 1 encapsulada, stores viejos migrados |
| S5 | Documentación + pruebas | README legacy, scripts limpieza, smoke tests |

Cada sprint debe cerrar con actualización de `PLAN_MIGRACION.md` y checklist en `VALIDACION_MIGRACION.md`.

---

### 6. Reglas Operativas

- **No borrar lógica del registro hasta tener la versión hexagonal alineada**.  
- **Todo cambio debe pasar por pull request con checklist**: inventario actualizado, docs, pruebas.  
- **Legacy vive aislado**; la nueva arquitectura no importa módulos desde legacy.  
- **Documentar decisiones** en `docs/roadmaps` para evitar que el Equipo 5 repita la historia.

---

### 7. Próximos Pasos Inmediatos

1. Cerrar inventario de `app/pages` y `app/presentation`.  
2. Completar tabla de rutas y stores (incluye flujo `dual-panel`).  
3. Crear estructura `app/legacy/registro-societarios/v1`.  
4. Registrar avances en `PLAN_MIGRACION.md`.

Con esto tendrás control del desorden acumulado y una ruta clara para mantener la funcionalidad del registro mientras el Equipo 4 consolida la arquitectura definitiva.



