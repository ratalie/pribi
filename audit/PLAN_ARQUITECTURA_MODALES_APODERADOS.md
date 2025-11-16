# 📋 PLAN: Arquitectura de Modales de Apoderados

**Fecha:** 15 de Noviembre, 2025  
**Objetivo:** Diseñar e implementar la arquitectura correcta de modales según tipo de apoderado

---

## 🎯 Arquitectura Definida

### **3 Tipos de Apoderados (3 Modales Diferentes)**

```
┌─────────────────────────────────────────────────────────┐
│                    APODERADOS                            │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐   ┌──────────┐
    │ GERENTE  │    │ APODE-   │   │  OTROS   │
    │ GENERAL  │    │ RADOS    │   │ APODE-   │
    │          │    │          │   │ RADOS    │
    └──────────┘    └──────────┘   └──────────┘
         │               │               │
         │               │               │
         ▼               ▼               ▼
```

---

## 📊 Comparación de Modales

| Característica      | Gerente General             | Apoderados                                  | Otros Apoderados         |
| ------------------- | --------------------------- | ------------------------------------------- | ------------------------ |
| **Clase Apoderado** | Fija: "Gerente General"     | **Selector de clases** (excluye especiales) | Fija: "Otros Apoderados" |
| **Tipo Persona**    | Natural O Jurídica (switch) | **Solo Natural**                            | **Solo Natural**         |
| **Representante**   | Sí (si es jurídica)         | No aplica                                   | No aplica                |
| **Campos**          | Completos según tipo        | Solo persona natural                        | Solo persona natural     |
| **Cantidad**        | Exactamente 1               | Múltiples                                   | Múltiples                |

---

## 🔧 Implementación Detallada

### **1. GerenteGeneralModal.vue** ✅ (Ya existe, correcto)

**Props:**

```typescript
{
  modelValue: boolean;
  gerenteClassId: string; // ← ID fijo de clase "Gerente General"
  mode: "create" | "edit";
  isSaving: boolean;
  initialApoderado: Apoderado | null;
}
```

**Funcionalidad:**

- ✅ Switch para elegir: Persona Natural o Persona Jurídica
- ✅ Si es Natural: formulario de persona natural
- ✅ Si es Jurídica:
  - ✅ Switch: ¿Constituida en Perú?
  - ✅ Formulario persona jurídica (peruana/extranjera)
  - ✅ Switch: ¿Tiene representante?
  - ✅ Si tiene representante: formulario persona natural (representante)
- ✅ Envía ApoderadoDTO con `claseApoderadoId` = `gerenteClassId`

**Estado:** ✅ **COMPLETO** - No requiere cambios

---

### **2. RegistroApoderadoModal.vue** ⚠️ (Requiere cambios)

**Props actuales:**

```typescript
{
  modelValue: boolean;
  mode: "create" | "edit";
  isSaving: boolean;
  initialValue: ApoderadoForm | null;
  claseOptions: SelectOption[];  // ← Recibe opciones de clases
}
```

**Problema actual:**

- ❌ Solo maneja Persona Natural
- ❌ No tiene switch para tipo de persona
- ❌ No maneja Persona Jurídica

**Funcionalidad requerida:**

- ⚠️ **Selector de clase de apoderado** (excluye "Gerente General" y "Otros Apoderados")
- ⚠️ **Switch para tipo de persona:** Natural o Jurídica
- ⚠️ Si es Natural: formulario persona natural (actual)
- ⚠️ Si es Jurídica:
  - Switch: ¿Constituida en Perú?
  - Formulario persona jurídica
  - Switch: ¿Tiene representante?
  - Si tiene representante: formulario persona natural
- ✅ Envía ApoderadoDTO con `claseApoderadoId` seleccionado

**Cambios necesarios:**

1. Agregar switch de tipo de persona
2. Importar PersonaJuridicaForm y PersonaJuridicaExtranjeraForm
3. Usar useRegistroApoderadoModalStore para manejar estado
4. Implementar lógica similar a GerenteGeneralModal
5. Actualizar buildDTO para manejar ambos tipos

---

### **3. OtroApoderadoModal.vue** ✅ (Requiere ajuste menor)

**Props actuales:**

```typescript
{
  modelValue: boolean;
  mode: "create" | "edit";
  isSaving: boolean;
  initialPersona: PersonaNatural | null; // ← ⚠️ Cambiar a Apoderado
}
```

**Funcionalidad actual:**

- ✅ Solo Persona Natural
- ✅ Formulario persona natural
- ⚠️ Envía ApoderadoDTO con `claseApoderadoId` vacío (❌ incorrecto)

**Cambios necesarios:**

1. Cambiar prop `initialPersona` → `initialApoderado`
2. Recibir prop `otrosClassId: string`
3. Enviar `claseApoderadoId` = `otrosClassId` (no vacío)
4. Ajustar inicialización desde `initialApoderado.persona`

**Estado:** ⚠️ **REQUIERE AJUSTES MENORES**

---

## 🔄 Flujo de Datos

### **Gerente General**

```
Usuario → [Gerente General Modal]
          │
          ├─ Tipo: Natural/Jurídica (switch)
          │
          ├─ Si Natural:
          │  └─ PersonaNaturalForm
          │
          └─ Si Jurídica:
             ├─ PersonaJuridicaForm
             └─ Si tiene representante:
                └─ PersonaNaturalForm (representante)
          │
          ▼
       ApoderadoDTO {
         id: string,
         claseApoderadoId: gerenteClassId,  ← Fijo
         persona: Persona (Natural | Jurídica)
       }
          │
          ▼
       Backend → Attorney Table
```

---

### **Apoderados (con clase)**

```
Usuario → [Registro Apoderado Modal]
          │
          ├─ Selector: Clase de Apoderado
          │  (opciones sin Gerente ni Otros)
          │
          ├─ Tipo: Natural/Jurídica (switch)
          │
          ├─ Si Natural:
          │  └─ PersonaNaturalForm
          │
          └─ Si Jurídica:
             ├─ PersonaJuridicaForm
             └─ Si tiene representante:
                └─ PersonaNaturalForm (representante)
          │
          ▼
       ApoderadoDTO {
         id: string,
         claseApoderadoId: [SELECCIONADO],  ← Variable
         persona: Persona (Natural | Jurídica)
       }
          │
          ▼
       Backend → Attorney Table
```

---

### **Otros Apoderados**

```
Usuario → [Otro Apoderado Modal]
          │
          └─ PersonaNaturalForm  ← Solo Natural
          │
          ▼
       ApoderadoDTO {
         id: string,
         claseApoderadoId: otrosClassId,  ← Fijo
         persona: PersonaNatural
       }
          │
          ▼
       Backend → Attorney Table
```

---

## 📦 Componentes Reutilizados

```
PersonaNaturalForm.vue
  ├─ Usado en: GerenteGeneralModal (principal y representante)
  ├─ Usado en: RegistroApoderadoModal (principal y representante)
  └─ Usado en: OtroApoderadoModal (principal)

PersonaJuridicaForm.vue
  ├─ Usado en: GerenteGeneralModal (peruana)
  └─ Usado en: RegistroApoderadoModal (peruana)

PersonaJuridicaExtranjeraForm.vue
  ├─ Usado en: GerenteGeneralModal (extranjera)
  └─ Usado en: RegistroApoderadoModal (extranjera)
```

---

## 🎨 UI de Modales

### **GerenteGeneralModal**

```
┌─────────────────────────────────────────┐
│ Gerente General                         │
│ Registra al representante principal...  │
├─────────────────────────────────────────┤
│                                         │
│ ○ Persona Natural  ● Persona Jurídica  │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ PersonaJuridicaForm                 │ │
│ │ (RUC, Razón Social, etc.)           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ □ Registrar representante               │
│                                         │
│ ▼ Datos del representante               │
│ ┌─────────────────────────────────────┐ │
│ │ PersonaNaturalForm                  │ │
│ │ (DNI, Nombres, etc.)                │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│         [Cancelar]  [Guardar]          │
└─────────────────────────────────────────┘
```

---

### **RegistroApoderadoModal** (Nuevo diseño)

```
┌─────────────────────────────────────────┐
│ Registrar apoderado                     │
│ Completa la información solicitada      │
│                                         │
│ Actions slot:                           │
│ ┌───────────────────────────────────┐   │
│ │ Clase de apoderado: [Selector ▼] │   │
│ └───────────────────────────────────┘   │
├─────────────────────────────────────────┤
│                                         │
│ ● Persona Natural  ○ Persona Jurídica  │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Datos personales                    │ │
│ │ PersonaNaturalForm                  │ │
│ │ (DNI, Nombres, Apellidos)           │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│         [Cancelar]  [Guardar]          │
└─────────────────────────────────────────┘
```

**Si selecciona Persona Jurídica:**

```
┌─────────────────────────────────────────┐
│ Registrar apoderado                     │
│ Completa la información solicitada      │
│                                         │
│ Actions slot:                           │
│ ┌───────────────────────────────────┐   │
│ │ Clase de apoderado: [Gerente A. ▼]│   │
│ └───────────────────────────────────┘   │
├─────────────────────────────────────────┤
│                                         │
│ ○ Persona Natural  ● Persona Jurídica  │
│                                         │
│ □ Empresa constituida en Perú           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Datos de la empresa                 │ │
│ │ PersonaJuridicaExtranjeraForm       │ │
│ │ (País, RUC/ID, Razón Social)        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ☑ Registrar representante               │
│                                         │
│ ▼ Datos del representante               │
│ ┌─────────────────────────────────────┐ │
│ │ PersonaNaturalForm                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│         [Cancelar]  [Guardar]          │
└─────────────────────────────────────────┘
```

---

### **OtroApoderadoModal** (Ya correcto, solo ajustar backend)

```
┌─────────────────────────────────────────┐
│ Registrar otro apoderado                │
│ Completa la información del apoderado   │
│ sin cargo específico.                   │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Datos personales                    │ │
│ │ PersonaNaturalForm                  │ │
│ │ (DNI, Nombres, Apellidos)           │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│         [Cancelar]  [Guardar]          │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist de Implementación

### **Fase 1: OtroApoderadoModal (simple)**

- [ ] Cambiar prop `initialPersona` → `initialApoderado: Apoderado | null`
- [ ] Agregar prop `otrosClassId: string`
- [ ] Ajustar inicialización para extraer persona de `initialApoderado.persona`
- [ ] Corregir `handleSubmit` para usar `otrosClassId` en lugar de string vacío
- [ ] Ajustar ApoderadosManager para pasar `otrosClassId` al modal

### **Fase 2: RegistroApoderadoModal (complejo)**

- [ ] Importar stores: `useRegistroApoderadoModalStore`, `usePersonaJuridicaStore`
- [ ] Importar componentes: `PersonaJuridicaForm`, `PersonaJuridicaExtranjeraForm`
- [ ] Importar switches: `CustomSwitch`, `LabeledCardSwitch`, `SimpleCardDropDown`
- [ ] Cambiar estructura de formulario de `ApoderadoForm` (solo natural) a DTO completo
- [ ] Agregar switch de tipo de persona (Natural/Jurídica)
- [ ] Implementar lógica condicional para mostrar forms según tipo
- [ ] Agregar switches para:
  - ¿Empresa constituida en Perú?
  - ¿Tiene representante?
- [ ] Implementar inicialización desde `initialValue` (puede ser natural o jurídica)
- [ ] Implementar `buildDTO` que maneja ambos tipos de persona
- [ ] Actualizar validaciones y errores

### **Fase 3: ApoderadosManager (ajustes)**

- [ ] Actualizar llamada a `OtroApoderadoModal` para pasar `otrosClassId`
- [ ] Verificar que `claseSelectOptions` excluye correctamente ambas clases especiales
- [ ] Probar flujo completo: crear/editar/eliminar en cada modal

### **Fase 4: Testing**

- [ ] Crear Gerente General (Natural y Jurídica con/sin representante)
- [ ] Crear Apoderados normales (Natural y Jurídica con/sin representante)
- [ ] Crear Otros Apoderados (solo Natural)
- [ ] Editar cada tipo
- [ ] Eliminar cada tipo
- [ ] Verificar que datos se guardan correctamente en backend
- [ ] Verificar que al editar, se cargan datos correctos

---

## 🚨 Puntos Críticos

1. **RegistroApoderadoModal es el más complejo:**

   - Actualmente solo maneja Persona Natural
   - Debe soportar Natural Y Jurídica (como GerenteGeneralModal)
   - Debe incluir selector de clase de apoderado en actions slot
   - Requiere cambio de arquitectura de formulario

2. **Clases especiales deben excluirse:**

   - `claseSelectOptions` debe filtrar "Gerente General" y "Otros Apoderados"
   - Ya implementado en ApoderadosManager

3. **Todos envían a mismo backend:**
   - Todos usan `ApoderadoDTO`
   - Todos van a tabla `Attorney`
   - Diferencia está en `claseApoderadoId` y tipo de `persona`

---

## 📝 Estructura de Datos

### **ApoderadoDTO** (común para todos)

```typescript
interface ApoderadoDTO {
  id: string;
  claseApoderadoId: string; // ← Gerente, Clase Normal, u Otros
  persona: Persona; // ← Natural O Jurídica
}

type Persona = PersonaNatural | PersonaJuridica;

interface PersonaNatural {
  tipo: "NATURAL";
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  paisEmision?: string;
}

interface PersonaJuridica {
  tipo: "JURIDICA";
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial?: string;
  jurisdiccion: "peruana" | "extranjera";
  pais?: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  representadoPor?: PersonaNatural; // ← Opcional
}
```

---

## 🎯 Resumen Ejecutivo

**3 modales, 3 comportamientos:**

1. **GerenteGeneralModal** ✅

   - Clase fija
   - Natural O Jurídica (switch)
   - Con representante opcional si es jurídica

2. **RegistroApoderadoModal** ⚠️ **REQUIERE REFACTORIZACIÓN**

   - Selector de clase (sin especiales)
   - Natural O Jurídica (switch) ← **AGREGAR**
   - Con representante opcional si es jurídica ← **AGREGAR**

3. **OtroApoderadoModal** ⚠️ **AJUSTES MENORES**
   - Clase fija
   - Solo Natural
   - Sin representante

---

**Siguiente paso:** Implementar en orden: Fase 1 → Fase 2 → Fase 3 → Fase 4
