# 📊 Análisis Inicial del Código - Registro de Sociedades

**Fecha:** 14 de Noviembre, 2025
**Objetivo:** Auditar código existente antes de refactorizar

---

## 🎯 Problemas Detectados

### 1. Imports Relativos Profundos (`../../..`)

**Cantidad encontrada:** ~100+ archivos

**Ubicaciones principales:**

- `app/modules/registro-sociedades/components/` → Muchos imports relativos
- `app/components/base/` → Algunos imports relativos entre componentes base
- `app/types/flows/` → Imports relativos entre niveles

**Ejemplo de problemas:**

```typescript
// ❌ Difícil de mantener
import { rucSchema } from "../../schemas/datosSociedad";
import CardTitle from "../../cards/CardTitle.vue";

// ✅ Solución
import { rucSchema } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/schemas";
import CardTitle from "~/components/base/cards/CardTitle.vue";
```

### 2. Schemas Dispersos

**Archivos encontrados:**

```
app/types/flow-system/schemas.ts                                    # FlowItems
app/modules/registro-sociedades/schemas/datosSociedad.ts           # Datos Sociedad
app/modules/registro-sociedades/schemas/modalAccionistas.ts        # Accionistas
app/modules/registro-sociedades/schemas/modalPersonaJuridica.ts    # Persona Jurídica
app/modules/registro-sociedades/schemas/FacultadApoderado.ts       # Apoderados
app/modules/registro-sociedades/schemas/directorio.ts              # Directorio
app/modules/registro-sociedades/schemas/quorumMayoria.ts           # Quorum
... y más
```

**Problema:** Schemas de dominio mezclados con módulo legacy.

**Solución:** Mover a `core/hexag/.../domain/schemas/`

### 3. Componentes Sin Organización Clara

**Componentes globales bien ubicados:** ✅

- `app/components/base/` → Inputs, buttons, cards, tables
- `app/components/ui/` → shadcn components

**Componentes específicos mal ubicados:** ❌

- `app/modules/registro-sociedades/components/` → Debería estar en presentation layer

**Componentes duplicados:** ⚠️

- DatosSociedadForm existe en múltiples versiones

---

## 📦 Catálogo de Componentes Reutilizables

### Componentes Base (Mantener en `app/components/`)

#### Inputs ✅

- `TextInputZod.vue`
- `SelectInputZod.vue`
- `DateInputZod.vue`
- `SearchInputZod.vue`
- `CheckboxInputZod.vue`
- `RadioInputZod.vue`
- `FileUploadZod.vue`

#### Buttons ✅

- `BaseButton.vue`
- `ActionButton.vue`

#### Cards ✅

- `CardTitle.vue`
- `CardDescription.vue`

#### Tables ✅

- `BaseTable.vue`
- Componentes específicos de tablas

### Componentes Específicos (Mover a Presentation Layer)

#### De `modules/registro-sociedades/components/`:

**Forms:**

- `forms/accionistas/AccionistaNaturalForm.vue` → `@presentation/pasos/accionistas/components/`
- `forms/accionistas/AccionistaJuridicoForm.vue` → `@presentation/pasos/accionistas/components/`

**Modals:**

- `modals/AccionistasModal.vue` → `@presentation/pasos/accionistas/components/`
- `modals/ClaseApoderadoModal.vue` → `@presentation/pasos/apoderados/components/`

**Steps:**

- `steps/DatosSociedadStep.vue` → ❌ ELIMINAR (crear nuevo en presentation)
- `steps/AccionistasStep.vue` → ❌ ELIMINAR (crear nuevo)
- `steps/AccionesStep.vue` → ❌ ELIMINAR (crear nuevo)

---

## 🗂️ Plan de Reorganización de Schemas

### Schemas por Paso

#### 1. Datos Sociedad

```
De: modules/registro-sociedades/schemas/datosSociedad.ts
A:  core/hexag/registros/sociedades/pasos/datos-sociedad/domain/schemas/

Dividir en:
- ruc.schema.ts
- razon-social.schema.ts
- tipo-sociedad.schema.ts
- nombre-comercial.schema.ts
- direccion.schema.ts
- distrito.schema.ts
- provincia.schema.ts
- departamento.schema.ts
- fechas.schema.ts
- oficina-registral.schema.ts
- partida-registral.schema.ts
- actividad-exterior.schema.ts
- index.ts (exporta todos)
```

#### 2. Accionistas

```
De: modules/registro-sociedades/schemas/modalAccionistas.ts
    modules/registro-sociedades/schemas/modalPersonaJuridica.ts
A:  core/hexag/registros/sociedades/pasos/accionistas/domain/schemas/

Dividir en:
- tipo-accionista.schema.ts
- tipo-documento.schema.ts
- numero-documento.schema.ts
- persona-natural.schema.ts
- persona-juridica.schema.ts
- fideicomiso.schema.ts
- sucursal.schema.ts
- index.ts
```

#### 3. Directorio

```
De: modules/registro-sociedades/schemas/directorio.ts
    modules/registro-sociedades/schemas/modalDirector.ts
A:  core/hexag/registros/sociedades/pasos/directorio/domain/schemas/
```

#### 4. Apoderados

```
De: modules/registro-sociedades/schemas/modalRegistroApoderados.ts
    modules/registro-sociedades/schemas/FacultadApoderado.ts
A:  core/hexag/registros/sociedades/pasos/apoderados/domain/schemas/
```

---

## 🔧 Aliases de Nuxt a Configurar

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  alias: {
    "@": "./app",
    "~": "./app",
    "@hexag": "./app/core/hexag",
    "@presentation": "./app/core/presentation",
    "@shared": "./app/core/shared",
    "@components": "./app/components",
  },
});
```

---

## 📋 Prioridades de Limpieza

### Alta Prioridad 🔴

1. Mover schemas a domain layer (bloquea todo lo demás)
2. Configurar aliases en Nuxt
3. Actualizar imports en archivos hexagonales existentes

### Media Prioridad 🟡

4. Reorganizar componentes de presentation
5. Eliminar componentes duplicados
6. Estandarizar nombres de archivos

### Baja Prioridad 🟢

7. Limpiar componentes legacy (después de migrar)
8. Optimizar imports en components/base/
9. Documentar convenciones

---

## 🎯 Métricas

### Archivos a Mover

- **Schemas:** ~15 archivos
- **Componentes:** ~30 archivos
- **Composables:** ~10 archivos

### Archivos a Actualizar (imports)

- **Estimado:** 100-150 archivos
- **Tiempo por archivo:** ~2-3 minutos
- **Total:** ~5-7 horas

### Archivos a Eliminar (después)

- **Módulo legacy completo:** ~50 archivos
- **Páginas legacy:** ~20 archivos

---

## ✅ Checklist de Auditoría

- [x] Generar reporte de imports relativos
- [x] Catalogar schemas existentes
- [x] Identificar componentes reutilizables
- [x] Planificar estructura de aliases
- [ ] Documentar decisiones de migración
- [ ] Crear guía de nomenclatura
- [ ] Definir orden de ejecución

---

## 🚀 Próximos Pasos

1. **Configurar aliases** en `nuxt.config.ts`
2. **Crear estructura de schemas** en domain layer
3. **Mover primer schema** como prueba de concepto
4. **Actualizar imports** en un componente de prueba
5. **Validar** que todo funciona
6. **Replicar** patrón para todos los schemas
7. **Continuar** con componentes

---

## 📝 Notas Importantes

- **NO eliminar** nada hasta migrar todo
- **Validar** después de cada cambio significativo
- **Documentar** decisiones importantes
- **Hacer commits** frecuentes con mensajes claros
- **Mantener MSW** funcionando en todo momento
