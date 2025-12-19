# 📋 Plan Frontend: Migración a ContributorPermission

**Fecha:** 2025-01-19  
**Objetivo:** Preparar el frontend para el cambio de `isContributor` (booleano) a `ContributorPermission` (tabla relacional)

---

## 🎯 RESUMEN EJECUTIVO

### **Cambio en Backend:**

- ❌ **Antes:** `isContributor: boolean` (global, no diferencia módulos)
- ✅ **Después:** `ContributorPermission[]` (tabla relacional, por módulo)
- ✅ **Compatibilidad:** Backend mantendrá `isContributor` calculado desde permisos

### **Estrategia Frontend:**

1. ✅ **Mantener compatibilidad:** Seguir usando `isContributor` (funciona igual)
2. ✅ **Preparar terreno:** Agregar interfaces y helpers para `contributorPermissions`
3. ✅ **Migración gradual:** Cuando backend esté listo, usar permisos directamente

---

## 📝 CAMBIOS NECESARIOS EN FRONTEND

### **1. Actualizar Interfaces TypeScript**

#### **1.1. Interface `Aportante` (Aporte Dinerario)**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`

**Cambios:**

```typescript
export interface ContributorPermission {
  id: string;
  shareholderId: string;
  module: "CASH" | "CREDIT" | "NON_CASH" | "ACCOUNTING";
  isContributor: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Aportante {
  id: string;
  personId?: string;
  typeShareholder: ContributorType | "NUEVO_APORTANTE_CASH" | "NUEVO_APORTANTE_CREDIT";
  isContributor: boolean; // ✅ MANTENER (compatibilidad)
  status?: boolean;
  contributionModule?: "CASH" | "CREDIT" | "BOTH" | ("CASH" | "CREDIT")[];
  contributorPermissions?: ContributorPermission[]; // ✅ NUEVO (opcional)
  person: Person;
  allocationShare?: Array<{...}>;
}
```

#### **1.2. Interface `Acreedor` (Capitalización)**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage.ts`

**Mismos cambios que `Aportante`**

---

### **2. Crear Helpers para Obtener Permisos por Módulo**

#### **2.1. Helper: `getIsContributorForModule()`**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`

**Función:**

```typescript
/**
 * Obtiene isContributor para un módulo específico
 * ✅ Compatible con ambos formatos (isContributor booleano o contributorPermissions)
 */
function getIsContributorForModule(
  participante: Aportante,
  module: "CASH" | "CREDIT"
): boolean {
  // Si tiene contributorPermissions, usar eso (nuevo formato)
  if (participante.contributorPermissions && participante.contributorPermissions.length > 0) {
    const permission = participante.contributorPermissions.find((p) => p.module === module);
    return permission?.isContributor ?? false;
  }

  // Si no, usar isContributor (formato antiguo, compatibilidad)
  return participante.isContributor;
}
```

#### **2.2. Helper: `getAllContributorPermissions()`**

**Función:**

```typescript
/**
 * Obtiene todos los permisos de contributor
 * Útil para debugging o mostrar información detallada
 */
function getAllContributorPermissions(participante: Aportante): ContributorPermission[] {
  return participante.contributorPermissions || [];
}
```

---

### **3. Actualizar Lógica de Filtrado**

#### **3.1. `useAportantesPage.ts` - Filtro por Módulo CASH**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`

**Cambios:**

- Usar `getIsContributorForModule(participante, "CASH")` en lugar de `participante.isContributor`
- Mantener compatibilidad con formato antiguo

#### **3.2. `useAcreedoresPage.ts` - Filtro por Módulo CREDIT**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage.ts`

**Cambios:**

- Usar `getIsContributorForModule(participante, "CREDIT")` en lugar de `participante.isContributor`
- Mantener compatibilidad con formato antiguo

---

### **4. Actualizar Componentes Visuales**

#### **4.1. `AportantesTable.vue` - Checkbox**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportantesTable.vue`

**Cambios:**

- Usar helper `getIsContributorForModule(aportante, "CASH")` para el checkbox
- Mantener `v-model` funcionando igual

**Código:**

```vue
<Checkbox
  :model-value="getIsContributorForModule(aportante, 'CASH')"
  :disabled="..."
  @update:model-value="..."
/>
```

---

### **5. Actualizar `useAportesPage.ts` (Página de Aportes)**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportesPage.ts`

**Cambios:**

- Actualizar filtro que usa `isContributor === true` para usar helper
- Mantener compatibilidad

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Interfaces y Helpers**

- [ ] Agregar interface `ContributorPermission`
- [ ] Agregar `contributorPermissions?` a `Aportante`
- [ ] Agregar `contributorPermissions?` a `Acreedor`
- [ ] Crear helper `getIsContributorForModule()`
- [ ] Crear helper `getAllContributorPermissions()`
- [ ] Exportar helpers para reutilización

### **Fase 2: Actualizar Lógica de Negocio**

- [ ] Actualizar `useAportantesPage.ts` para usar helper
- [ ] Actualizar `useAcreedoresPage.ts` para usar helper
- [ ] Actualizar `useAportesPage.ts` para usar helper
- [ ] Probar que funciona con formato antiguo (`isContributor`)

### **Fase 3: Actualizar Componentes**

- [ ] Actualizar `AportantesTable.vue` para usar helper
- [ ] Verificar que checkbox funciona correctamente
- [ ] Verificar que filtros funcionan correctamente

### **Fase 4: Testing**

- [ ] Probar con datos que tienen `isContributor` (formato antiguo)
- [ ] Probar con datos que tienen `contributorPermissions` (formato nuevo)
- [ ] Probar con datos que tienen ambos (compatibilidad)
- [ ] Verificar que no hay errores en consola

---

## 🔄 COMPATIBILIDAD

### **Escenarios de Compatibilidad:**

1. **Solo `isContributor` (formato antiguo):**

   ```json
   {
     "isContributor": true
   }
   ```

   ✅ Funciona: Helper usa `isContributor` directamente

2. **Solo `contributorPermissions` (formato nuevo):**

   ```json
   {
     "contributorPermissions": [{ "module": "CASH", "isContributor": true }]
   }
   ```

   ✅ Funciona: Helper usa `contributorPermissions`

3. **Ambos (transición):**
   ```json
   {
     "isContributor": true,
     "contributorPermissions": [{ "module": "CASH", "isContributor": true }]
   }
   ```
   ✅ Funciona: Helper prioriza `contributorPermissions`

---

## 📚 ARCHIVOS A MODIFICAR

### **Interfaces:**

1. `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`
2. `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage.ts`
3. `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/stores/useAportesManagerStore.ts`

### **Lógica:**

4. `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`
5. `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage.ts`
6. `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportesPage.ts`

### **Componentes:**

7. `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportantesTable.vue`

---

## 🎯 RESULTADO ESPERADO

Después de la implementación:

1. ✅ Frontend funciona con formato antiguo (`isContributor`)
2. ✅ Frontend funciona con formato nuevo (`contributorPermissions`)
3. ✅ Frontend funciona con ambos (compatibilidad total)
4. ✅ No hay breaking changes
5. ✅ Código preparado para usar permisos por módulo cuando backend esté listo

---

## ⚠️ NOTAS IMPORTANTES

1. **No romper compatibilidad:** El backend mantendrá `isContributor`, así que el frontend seguirá funcionando
2. **Migración gradual:** Podemos usar `contributorPermissions` cuando esté disponible, pero no es obligatorio
3. **Testing:** Probar con ambos formatos para asegurar compatibilidad
4. **Documentación:** Actualizar comentarios en código para explicar la compatibilidad

---

**✅ Plan listo para implementar.** 🚀
