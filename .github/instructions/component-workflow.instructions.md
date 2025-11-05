---
applyTo: "**/*.vue"
---

# 🏗️ Flujo de Trabajo para Creación de Componentes

## Principio fundamental

**SIEMPRE consultar antes de crear. NUNCA asumir.**

---

## 📋 Proceso obligatorio (5 fases)

### **FASE 1: Comprensión del contexto**

Antes de proponer soluciones:

1. **Si hay diseño (Figma/mockup):**

   - Obtener screenshots y contexto de diseño
   - Identificar: colores, espaciado, tipografía, estados (hover, focus, error)
   - Detectar comportamientos especiales (animaciones, interacciones)

2. **Revisar arquitectura existente:**

   - Leer `/docs/ARCHITECTURE.md`
   - Buscar componentes similares en el proyecto
   - Identificar patrones de naming, estructura de carpetas, convenciones

3. **Revisar sistema de diseño:**
   - Leer `app/assets/tailwind.css` para variables disponibles
   - Verificar tokens de color, tipografía, espaciado
   - Usar variables existentes, NO valores hardcoded

---

### **FASE 2: Evaluación de opciones**

NUNCA implementar directamente. SIEMPRE presentar opciones:

1. **Evaluar: ¿Adaptar existente vs crear nuevo?**

   - Presentar pros/contras de cada opción
   - Evaluar impacto en legibilidad, mantenibilidad, reutilización
   - **ESPERAR decisión del usuario**

2. **Si se crea nuevo: definir estructura de datos**
   - Presentar 2-3 opciones de interfaces/types
   - Mostrar ejemplos concretos de cada opción
   - **ESPERAR decisión del usuario**

---

### **FASE 3: Consultas específicas**

Hacer preguntas concretas antes de escribir código:

1. **Ubicación de archivos:**

   - ¿Dónde va el componente? (presentar opciones basadas en arquitectura)
   - ¿Dónde van los types/interfaces?

2. **Naming:**

   - ¿Qué nombre usar? (presentar 2-3 opciones)

3. **Comportamiento:**

   - ¿Cómo debe funcionar en casos edge? (ej: padre con hijos, estados disabled)

4. **Estilos:**
   - ¿Usar variables CSS o valores directos?
   - ¿Qué variantes necesita?

**REGLA:** Esperar respuestas a TODAS las consultas antes de crear archivos.

---

### **FASE 4: Implementación alineada**

Al crear componentes:

1. **Seguir patrones existentes:**

   ```
   ✅ Mismo orden de imports que componentes similares
   ✅ Misma estructura de Props
   ✅ Mismos nombres de eventos (update:modelValue, blur, etc.)
   ✅ Mismas convenciones de naming (camelCase, PascalCase)
   ```

2. **Mantener consistencia:**

   - Si otros inputs usan `isDisabled`, NO usar `disabled`
   - Si otros usan `variant?: "default" | "error"`, mantener exactamente eso
   - Si otros tienen estructura `<div class="flex flex-col gap-5">`, replicarla

3. **Usar recursos del proyecto:**

   - Variables CSS de `tailwind.css`
   - Types/interfaces existentes
   - Utilidades globales (`getIcon`, composables, etc.)

4. **Validar inmediatamente:**
   - Ejecutar linter después de cada creación
   - Corregir errores antes de continuar

---

### **FASE 5: Documentación (opcional)**

Solo si es complejo o reutilizable:

- Crear archivo de ejemplo `.example.vue`
- Crear constantes de ejemplo en `/constants`
- Actualizar `ARCHITECTURE.md` si es un nuevo patrón

---

## 🎯 Checklist antes de crear archivos

- [ ] ¿Leí el diseño en Figma/mockup?
- [ ] ¿Revisé componentes similares existentes?
- [ ] ¿Revisé `tailwind.css` para variables?
- [ ] ¿Presenté opciones técnicas al usuario?
- [ ] ¿Esperé decisión del usuario?
- [ ] ¿Hice consultas específicas (ubicación, naming, comportamiento)?
- [ ] ¿Esperé respuestas a TODAS las consultas?
- [ ] ¿Seguí exactamente los patrones existentes?

**Si NO cumples TODOS los items → NO CREAR ARCHIVOS AÚN**

---

## 🚫 Anti-patrones (NUNCA hacer)

❌ Crear componentes sin revisar similares existentes
❌ Asumir ubicación de archivos sin consultar
❌ Usar valores hardcoded (#4F4B5C) en lugar de variables (text-gray-700)
❌ Inventar nuevos patrones cuando ya existen
❌ Implementar sin presentar opciones
❌ Crear sin esperar confirmación del usuario

---

## ✅ Patrones aprobados (SIEMPRE hacer)

✅ Presentar 2-3 opciones técnicas con pros/contras
✅ Esperar decisión explícita del usuario
✅ Hacer consultas específicas (lista numerada clara)
✅ Replicar estructura exacta de componentes hermanos
✅ Usar variables CSS del proyecto
✅ Validar con linter inmediatamente
✅ Priorizar legibilidad > brevedad

---

## 📝 Plantilla de consulta (copy-paste)

Cuando necesites crear un componente nuevo, usa esta plantilla:

```
## Consultas antes de proceder:

### 1. Ubicación de archivos
¿Dónde prefieres el nuevo componente?

**Opción A:** [descripción + ruta]
**Opción B:** [descripción + ruta]

### 2. Types/Interfaces
¿Dónde guardamos el type/interface?

**Opción A:** Dentro del componente (como actual)
**Opción B:** En archivo separado (ej: app/types/inputs.ts)

### 3. Nombre del componente
¿Prefieres:
- NombreOpcion1 (ventaja X)
- NombreOpcion2 (ventaja Y)

### 4. Comportamiento
[Pregunta específica sobre edge case]

**Opción A:** [comportamiento]
**Opción B:** [comportamiento]

### 5. Estilos
¿Usar [variable CSS X] o [variable CSS Y]?

Por favor confirma TODAS las decisiones para proceder.
```

---

## 💡 Beneficios de este flujo

1. **Reducción de tokens (60-70%):**

   - Menos búsquedas exploratorias
   - Menos iteraciones/correcciones
   - Primera implementación correcta

2. **Código más limpio:**

   - Consistencia total con codebase
   - Sin deuda técnica
   - Mantenible a largo plazo

3. **Mejor comunicación:**
   - Usuario tiene control total
   - Decisiones informadas
   - Sin sorpresas

---

## 🔧 Aplicación en este proyecto

Este flujo se aplicó exitosamente en:

- ✅ Creación de `BaseModal.vue` y `BaseDialogContent.vue`
- ✅ Creación de `BaseCascadeSelect.vue` y `CascadeSelectInputZod.vue`
- ✅ Integración de validaciones con vee-validate

**Resultado:** Componentes consistentes, sin refactors, primera iteración exitosa.
