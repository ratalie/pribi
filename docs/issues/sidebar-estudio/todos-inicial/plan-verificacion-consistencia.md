# 📋 Plan de Verificación de Consistencia - TODO-002

**Fecha:** 3 Noviembre 2025  
**Objetivo:** Verificar que TODOS los componentes del sistema estén correctamente alineados  
**Estado:** 📝 En Progreso

---

## 🎯 QUÉ VERIFICAMOS

Este plan verifica la **consistencia y completitud** entre 3 capas del sistema:

```
1. ENUMS (Rutas) ←→ 2. PÁGINAS (Vue) ←→ 3. FLOWITEMS (TypeScript)
```

**NO es un test automatizado**, es una verificación manual/semi-automatizada de que:

- ✅ Cada ENUM tiene su PÁGINA correspondiente
- ✅ Cada PÁGINA tiene su ENUM correspondiente
- ✅ Cada FLOWITEM usa ENUM correcto y apunta a PÁGINA correcta
- ✅ Nombres consistentes entre las 3 capas
- ✅ Estructura jerárquica correcta

---

## 📊 CAPA 1: ENUMS (Rutas TypeScript)

### **Archivo: `app/config/routes/junta-accionistas.routes.ts`**

**Total Rutas Definidas:** 50

**Verificación:**

```typescript
// Cada ruta debe tener:
✓ Nombre consistente en SCREAMING_SNAKE_CASE
✓ Path comenzando con /operaciones/junta-accionistas/
✓ JSDoc comment explicando su propósito
✓ Helper function getJuntaRouteName() incluye la ruta
```

**Categorías:**

- ✅ Nivel 0: 6 rutas (principales)
- ✅ Aumento Capital: 8 rutas (2 items × 4 sub-páginas)
- ✅ Nombramiento: 15 rutas (5 items × 3 sub-páginas)
- ✅ Remociones: 9 rutas (3 items × 3 sub-páginas)
- ✅ Gestión Social: 12 rutas (4 items × 3 sub-páginas)

---

### **Archivo: `app/config/routes/sucursales.routes.ts`**

**Total Rutas Definidas:** 6

**Verificación:**

```typescript
// Cada ruta debe tener:
✓ Nombre consistente en SCREAMING_SNAKE_CASE
✓ Path comenzando con /registro-societario/sucursales/
✓ JSDoc comment explicando su propósito
✓ Helper function getSucursalesRouteName() incluye la ruta
```

---

## 📄 CAPA 2: PÁGINAS (Vue Files)

### **Directorio: `app/pages/operaciones/junta-accionistas/`**

**Total Páginas a Crear:** ~50 páginas (match con enums)

**Estructura de Archivos:**

```
pages/operaciones/junta-accionistas/
├─ seleccion-agenda.vue                    ← NIVEL 0
├─ detalles.vue                            ← NIVEL 0 (rightSidebar)
├─ instalacion.vue                         ← NIVEL 0 (rightSidebar)
├─ puntos-acuerdo.vue                      ← NIVEL 0 (PADRE)
├─ resumen.vue                             ← NIVEL 0 (rightSidebar scroll)
├─ descargar.vue                           ← NIVEL 0 (rightSidebar lista)
│
├─ aporte-dinerario/                       ← NIVEL 2
│  ├─ index.vue                            (página principal)
│  ├─ aportantes.vue                       (nivel 3)
│  ├─ aportes.vue                          (nivel 3)
│  └─ votacion.vue                         (nivel 3)
│
├─ capitalizacion-creditos/                ← NIVEL 2
│  ├─ index.vue
│  ├─ acreedores.vue
│  ├─ creditos.vue
│  └─ votacion.vue
│
├─ nombramiento-apoderados/                ← NIVEL 2
│  ├─ index.vue
│  ├─ nombramiento.vue
│  ├─ otorgamiento-poderes.vue            (con scroll anchors)
│  └─ votacion.vue
│
├─ nombramiento-gerente/
│  ├─ index.vue
│  ├─ nombramiento.vue
│  └─ votacion.vue
│
├─ nombramiento-directores/
│  ├─ index.vue
│  ├─ nombramiento.vue
│  └─ votacion.vue
│
├─ nombramiento-directorio/
│  ├─ index.vue
│  ├─ nombramiento.vue
│  └─ votacion.vue
│
├─ nombramiento-auditores/
│  ├─ index.vue
│  ├─ nombramiento.vue
│  └─ votacion.vue
│
├─ remocion-apoderados/
│  ├─ index.vue
│  ├─ remocion.vue
│  └─ votacion.vue
│
├─ remocion-gerente/
│  ├─ index.vue
│  ├─ remocion.vue
│  └─ votacion.vue
│
├─ remocion-directores/
│  ├─ index.vue
│  ├─ remocion.vue
│  └─ votacion.vue
│
├─ pronunciamiento-gestion/
│  ├─ index.vue
│  ├─ pronunciamiento.vue
│  └─ votacion.vue
│
├─ aplicacion-resultados/
│  ├─ index.vue
│  ├─ aplicacion.vue
│  └─ votacion.vue
│
├─ estados-financieros/
│  ├─ index.vue
│  ├─ estados.vue
│  └─ votacion.vue
│
└─ reparto-dividendos/
   ├─ index.vue
   ├─ reparto.vue
   └─ votacion.vue
```

**Verificación por Página:**

```vue
// Cada página debe tener: ✓ Template con título correcto ✓ Comentario con nivel correcto (0,
2, 3, 4) ✓ Indicador visual si tiene rightSidebar o scroll anchors ✓ Path mostrado en pantalla
para debug ✓ Placeholder text descriptivo
```

---

### **Directorio: `app/pages/registro-societario/sucursales/`**

**Total Páginas a Crear:** 6 páginas

**Estructura de Archivos:**

```
pages/registro-societario/sucursales/
├─ datos-sociedad.vue
├─ datos-generales.vue
├─ capital-social.vue
├─ acciones.vue
├─ accionistas.vue
└─ asignacion-acciones.vue
```

---

## 🧩 CAPA 3: FLOWITEMS (TypeScript Objects)

### **Directorio: `app/modules/junta-accionistas/flow-items/`**

**Total FlowItems a Crear:** ~87 items

**Estructura de Archivos:**

```
modules/junta-accionistas/flow-items/
├─ nivel-0/                                (6 archivos)
│  ├─ seleccion-agenda.item.ts
│  ├─ detalles.item.ts
│  ├─ instalacion.item.ts
│  ├─ puntos-acuerdo.item.ts
│  ├─ resumen.item.ts
│  └─ descargar.item.ts
│
├─ nivel-1/                                (4 archivos .section.ts)
│  ├─ aumento-capital.section.ts
│  ├─ nombramiento.section.ts
│  ├─ remociones.section.ts
│  └─ gestion-social.section.ts
│
├─ nivel-2/                                (~17 archivos en subcarpetas)
│  ├─ aumento-capital/
│  │  ├─ aporte-dinerario.item.ts
│  │  └─ capitalizacion-creditos.item.ts
│  ├─ nombramiento/
│  │  ├─ nombramiento-apoderados.item.ts
│  │  ├─ nombramiento-gerente.item.ts
│  │  ├─ nombramiento-directores.item.ts
│  │  ├─ nombramiento-directorio.item.ts
│  │  └─ nombramiento-auditores.item.ts
│  ├─ remociones/
│  │  ├─ remocion-apoderados.item.ts
│  │  ├─ remocion-gerente.item.ts
│  │  └─ remocion-directores.item.ts
│  └─ gestion-social/
│     ├─ pronunciamiento.item.ts
│     ├─ aplicacion-resultados.item.ts
│     ├─ estados-financieros.item.ts
│     └─ reparto-dividendos.item.ts
│
├─ nivel-3/                                (~40 archivos en subcarpetas)
│  ├─ aporte-dinerario/
│  │  ├─ aportantes.item.ts
│  │  ├─ aportes.item.ts
│  │  └─ votacion.item.ts
│  └─ ... (más carpetas con estructura similar)
│
└─ nivel-4/                                (~20 archivos .anchor.ts)
   ├─ otorgamiento-poderes/
   │  ├─ persona-1.anchor.ts
   │  ├─ persona-2.anchor.ts
   │  └─ persona-3.anchor.ts
   └─ ... (más scroll anchors)
```

**Verificación por FlowItem:**

```typescript
// Cada FlowItem debe tener:
✓ identity.id único y descriptivo
✓ identity.type correcto (STEP, SECTION, ACTION)
✓ identity.label legible
✓ hierarchy.level correcto (0-4)
✓ hierarchy.parentId correcto (si aplica)
✓ hierarchy.children correcto (si aplica)
✓ navigation.route usando ENUM correcto
✓ navigation.behavior correcto (PUSH o SCROLL)
✓ navigation.hash si es scroll anchor
✓ rightSidebar.enabled si tiene hijos en sidebar
✓ rightSidebar.showChildrenInSidebar si corresponde
```

---

### **Directorio: `app/modules/sucursales/flow-items/`**

**Total FlowItems a Crear:** 6 items

**Estructura de Archivos:**

```
modules/sucursales/flow-items/
├─ datos-sociedad.item.ts
├─ datos-generales.item.ts
├─ capital-social.item.ts
├─ acciones.item.ts
├─ accionistas.item.ts
└─ asignacion-acciones.item.ts
```

---

## 🔍 MATRIZ DE VERIFICACIÓN

### **MATCH 1: ENUM ←→ PÁGINA**

| Enum Route                   | Página Existe        | Path Match                                      | ✓/✗ |
| ---------------------------- | -------------------- | ----------------------------------------------- | --- |
| JuntaRoutes.SELECCION_AGENDA | seleccion-agenda.vue | /operaciones/junta-accionistas/seleccion-agenda | ⬜  |
| JuntaRoutes.DETALLES         | detalles.vue         | /operaciones/junta-accionistas/detalles         | ⬜  |
| JuntaRoutes.INSTALACION      | instalacion.vue      | /operaciones/junta-accionistas/instalacion      | ⬜  |
| ...                          | ...                  | ...                                             | ⬜  |

**Total a verificar:** 56 matches (50 Juntas + 6 Sucursales)

---

### **MATCH 2: PÁGINA ←→ FLOWITEM**

| Página                     | FlowItem Existe     | ID Match         | Level Correcto | ✓/✗ |
| -------------------------- | ------------------- | ---------------- | -------------- | --- |
| seleccion-agenda.vue       | seleccionAgendaItem | seleccion-agenda | 0              | ⬜  |
| detalles.vue               | detallesItem        | detalles         | 0              | ⬜  |
| aporte-dinerario/index.vue | aporteDinerarioItem | aporte-dinerario | 2              | ⬜  |
| ...                        | ...                 | ...              | ...            | ⬜  |

**Total a verificar:** ~93 matches (87 Juntas + 6 Sucursales)

---

### **MATCH 3: FLOWITEM ←→ ENUM**

| FlowItem            | Enum Usado                              | Enum Existe | Path Correcto    | ✓/✗ |
| ------------------- | --------------------------------------- | ----------- | ---------------- | --- |
| seleccionAgendaItem | JuntaRoutes.SELECCION_AGENDA            | ✓           | /operaciones/... | ⬜  |
| aporteDinerarioItem | JuntaRoutes.APORTE_DINERARIO            | ✓           | /operaciones/... | ⬜  |
| aportantesItem      | JuntaRoutes.APORTE_DINERARIO_APORTANTES | ✓           | /operaciones/... | ⬜  |
| ...                 | ...                                     | ...         | ...              | ⬜  |

**Total a verificar:** ~93 matches

---

## 🔧 HERRAMIENTAS DE VERIFICACIÓN

### **Script 1: Verificar ENUM ←→ PÁGINA**

```typescript
// scripts/verify-enum-page-match.ts

import { JuntaRoutes } from "@/config/routes/junta-accionistas.routes";
import { SucursalesRoutes } from "@/config/routes/sucursales.routes";
import { existsSync } from "fs";
import { join } from "path";

// Para cada enum, verificar que exista la página
Object.values(JuntaRoutes).forEach((route) => {
  const pagePath = route.replace(
    "/operaciones/junta-accionistas",
    "app/pages/operaciones/junta-accionistas"
  );
  const vueFile = `${pagePath}.vue`;
  const indexFile = `${pagePath}/index.vue`;

  if (!existsSync(vueFile) && !existsSync(indexFile)) {
    console.error(`❌ MISSING PAGE: ${route} → ${vueFile}`);
  } else {
    console.log(`✅ ${route}`);
  }
});
```

---

### **Script 2: Verificar PÁGINA → ENUM**

```bash
#!/bin/bash
# scripts/verify-page-enum-match.sh

# Buscar todas las páginas .vue
find app/pages/operaciones/junta-accionistas -name "*.vue" | while read page; do
  # Extraer path de la página
  path=$(grep -o "/operaciones/junta-accionistas/[^\"]*" "$page" 2>/dev/null)

  # Buscar si existe en enum
  if grep -q "$path" app/config/routes/junta-accionistas.routes.ts; then
    echo "✅ $page → $path"
  else
    echo "❌ MISSING ENUM: $page → $path"
  fi
done
```

---

### **Script 3: Verificar FLOWITEM → ENUM**

```typescript
// scripts/verify-flowitem-enum-match.ts

import { juntaAccionistasFlowConfig } from "@/config/flows";
import { JuntaRoutes } from "@/config/routes";

juntaAccionistasFlowConfig.items.forEach((item) => {
  if (item.navigation?.route) {
    const enumExists = Object.values(JuntaRoutes).includes(item.navigation.route);

    if (!enumExists) {
      console.error(
        `❌ FLOWITEM ${item.identity.id} usa ruta NO EXISTENTE: ${item.navigation.route}`
      );
    } else {
      console.log(`✅ ${item.identity.id} → ${item.navigation.route}`);
    }
  }
});
```

---

## 📝 CHECKLIST DE VERIFICACIÓN MANUAL

### **PASO 1: Verificar Enums**

- [ ] Todos los enums tienen nombres consistentes (SCREAMING_SNAKE_CASE)
- [ ] Todos los paths comienzan con prefijo correcto
- [ ] Helper functions incluyen TODAS las rutas
- [ ] No hay rutas duplicadas
- [ ] JSDoc comments están presentes

### **PASO 2: Verificar Páginas**

- [ ] Todas las páginas existen en filesystem
- [ ] Todas las páginas muestran su ruta actual
- [ ] Páginas con rightSidebar tienen indicador visual
- [ ] Páginas con scroll anchors tienen secciones con IDs
- [ ] Estructura de carpetas refleja jerarquía
- [ ] Nombres de archivos son kebab-case consistentes

### **PASO 3: Verificar FlowItems**

- [ ] Todos los FlowItems tienen `identity.id` único
- [ ] Todos los FlowItems tienen `hierarchy.level` correcto
- [ ] Todos los FlowItems tienen `navigation.route` válido
- [ ] Items con hijos tienen `hierarchy.children` correcto
- [ ] Items con rightSidebar tienen config completa
- [ ] Scroll anchors usan `NavigationBehavior.SCROLL`
- [ ] Scroll anchors tienen `navigation.hash`

### **PASO 4: Verificar FlowConfigs**

- [ ] FlowConfig importa TODOS los FlowItems
- [ ] FlowConfig tiene items en orden correcto
- [ ] FlowConfig pasa validación Zod
- [ ] FlowConfig tiene metadata correcta (id, name, version)

### **PASO 5: Verificar Navegación**

- [ ] Navegar a cada ruta no da 404
- [ ] RightSidebar aparece cuando corresponde
- [ ] Scroll anchors funcionan correctamente
- [ ] Breadcrumbs muestran jerarquía correcta
- [ ] Active state se marca correctamente

---

## 🎯 CRITERIOS DE ÉXITO

### **100% Match Rate:**

✅ **ENUM ←→ PÁGINA:** 56/56 matches (50 Juntas + 6 Sucursales)  
✅ **PÁGINA ←→ FLOWITEM:** 93/93 matches (87 Juntas + 6 Sucursales)  
✅ **FLOWITEM ←→ ENUM:** 93/93 matches

### **0 Errores:**

✅ No hay páginas sin enum  
✅ No hay enums sin página  
✅ No hay FlowItems con rutas inválidas  
✅ No hay rutas duplicadas  
✅ No hay IDs duplicados

### **Navegación Funcional:**

✅ Todas las rutas responden (no 404)  
✅ RightSidebar funciona en items configurados  
✅ Scroll anchors funcionan correctamente  
✅ Navegación entre niveles fluida

---

## 📊 RESUMEN DE CANTIDADES

| Concepto        | Juntas | Sucursales | Total   |
| --------------- | ------ | ---------- | ------- |
| **Enums**       | 50     | 6          | **56**  |
| **Páginas**     | ~50    | 6          | **~56** |
| **FlowItems**   | 87     | 6          | **93**  |
| **FlowConfigs** | 1      | 1          | **2**   |

**Diferencia FlowItems vs Páginas:** +37 items (scroll anchors y secciones que no tienen página propia)

---

## 🚀 PRÓXIMOS PASOS

1. ✅ **Completar ISSUE 2.2:** Crear todas las páginas (~56 archivos)
2. ⬜ **Ejecutar Script 1:** Verificar ENUM ←→ PÁGINA
3. ⬜ **Completar ISSUE 2.4-2.9:** Crear todos los FlowItems (~93 archivos)
4. ⬜ **Ejecutar Script 2:** Verificar PÁGINA ←→ FLOWITEM
5. ⬜ **Ejecutar Script 3:** Verificar FLOWITEM ←→ ENUM
6. ⬜ **Completar ISSUE 2.10:** Crear FlowConfigs (2 archivos)
7. ⬜ **Verificación Manual:** Navegar todas las rutas
8. ⬜ **Tests:** Ejecutar tests automatizados
9. ⬜ **Documentar Resultados:** Generar reporte final

---

**Generado por:** GitHub Copilot  
**Fecha:** 3 Noviembre 2025  
**Archivo:** plan-verificacion-consistencia.md
