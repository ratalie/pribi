# 📋 DOCUMENTACIÓN VISUAL COMPLETA: CREAR SOCIEDADES Y CREAR JUNTAS
**Sistema de Wizards de Creación - PROBO**

---

## 📑 ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura General del Sistema de Wizards](#2-arquitectura-general-del-sistema-de-wizards)
3. [Crear Sociedades - Estructura Visual](#3-crear-sociedades---estructura-visual)
4. [Crear Junta - Estructura Visual](#4-crear-junta---estructura-visual)
5. [Componentes Compartidos](#5-componentes-compartidos)
6. [Sistema de Tokens CSS PROBO](#6-sistema-de-tokens-css-probo)
7. [Componentes shadcn/ui Utilizados](#7-componentes-shadcnui-utilizados)
8. [Clases de Tailwind CSS](#8-clases-de-tailwind-css)
9. [Interacciones del Usuario](#9-interacciones-del-usuario)
10. [Estados Visuales](#10-estados-visuales)
11. [Checklist de Migración a Nuxt 4](#11-checklist-de-migración-a-nuxt-4)

---

## 1. RESUMEN EJECUTIVO

### 🎯 Propósito
Este documento proporciona la documentación visual completa de los **dos flujos principales de creación en PROBO**:
- **Crear Sociedades**: Wizard de 10 pasos para crear una nueva sociedad
- **Crear Junta**: Wizard de 6 pasos con sub-steps dinámicos para crear juntas de accionistas

### 📦 Archivos Principales Involucrados

**Componente Base del Wizard:**
```
/components/FlujoWizardView.tsx (370 líneas)
```

**Sidebar del Wizard:**
```
/components/SingleWizardSidebar.tsx
```

**Pasos de Crear Sociedades:**
```
/components/flujo-steps/SociedadDatosPrincipalesNew.tsx
/components/flujo-steps/SociedadAccionistasNew.tsx
/components/flujo-steps/SociedadCapitalAccionesNew.tsx
/components/flujo-steps/SociedadAsignacionAccionesNew.tsx
/components/flujo-steps/SociedadDirectorio.tsx
/components/flujo-steps/SociedadApoderados.tsx
/components/flujo-steps/SociedadRegimenFacultades.tsx
/components/flujo-steps/SociedadQuorums.tsx
/components/flujo-steps/SociedadAcuerdosEspeciales.tsx
/components/flujo-steps/SociedadResumen.tsx
```

**Pasos de Crear Junta:**
```
/components/flujo-steps/JuntaPuntosAgendaNew.tsx
/components/flujo-steps/JuntaDetallesNew.tsx
/components/flujo-steps/JuntaInstalacionNew.tsx
/components/AporteDinerarioFlow.tsx
/components/GenericSubStepFlow.tsx
/components/JuntaResumenFinal.tsx
```

**Configuración de Steps:**
```
/data/flujoSteps.ts
```

**Contexto del Flujo:**
```
/contexts/FlujoContext.tsx
```

---

## 2. ARQUITECTURA GENERAL DEL SISTEMA DE WIZARDS

### 🏗️ Estructura de Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FlujoWizardView                           │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                      HEADER                           │
│             ├───────────────────────────────────────────────────────┤
│             │   [← Salir]  │  Título del Paso                      │
│  SIDEBAR    │               │  Descripción del paso                 │
│             │               │                    [Guardar] [Reset]  │
│             ├───────────────────────────────────────────────────────┤
│             │                                                       │
│   Steps     │                                                       │
│   List      │                  CONTENIDO DEL PASO                   │
│             │                  (Scrollable)                         │
│   Progress  │                                                       │
│   Bar       │                                                       │
│             │                                                       │
│             ├───────────────────────────────────────────────────────┤
│             │                      FOOTER                           │
│             │   [← Anterior]    Paso X de Y    [Siguiente →]       │
└─────────────┴───────────────────────────────────────────────────────┘
```

### 📐 Dimensiones del Layout

| Elemento | Ancho | Alto | Observaciones |
|----------|-------|------|---------------|
| **Sidebar Izquierdo** | `320px` (`w-80`) | `100vh` | Fijo, scrollable |
| **Header** | `flex-1` | Auto (`py-4`) | Sticky top |
| **Content Area** | `flex-1` | `flex-1` | Scrollable |
| **Footer** | `flex-1` | Auto (`py-4`) | Sticky bottom |
| **Max Width Content** | `1280px` (`max-w-5xl`) | - | Centrado con `mx-auto` |

### 🎨 Paleta de Colores Utilizada

```css
/* Fondo General */
background: var(--bg-muted) = #F8F8F8

/* Tarjetas y Elementos */
background: var(--bg-default) = #FFFFFF
border: var(--border-default) = #D9D8DC
border-radius: var(--radius-large) = 24px

/* Botón Primario (Siguiente) */
background: var(--primary-800) = #3C28A4
hover: var(--primary-900) = #21194D

/* Botón Finalizar */
background: #10B981 (verde success)
hover: #059669
```

---

## 3. CREAR SOCIEDADES - ESTRUCTURA VISUAL

### 📋 Configuración de los 10 Pasos

**Archivo:** `/data/flujoSteps.ts`

```typescript
export const sociedadSteps: WizardStep[] = [
  {
    id: 'datos-principales',
    title: 'Datos Principales',
    description: 'Completa todos los datos de la Sociedad',
    status: 'upcoming'
  },
  {
    id: 'accionistas',
    title: 'Accionistas',
    description: 'Previo a los Accionistas de la Sociedad',
    status: 'upcoming'
  },
  {
    id: 'acciones',
    title: 'Capital Social y Acciones',
    description: 'Completa información sobre las Acciones',
    status: 'upcoming'
  },
  {
    id: 'asignacion-acciones',
    title: 'Asignación de Acciones',
    description: 'Distribuye Tipos de Acciones entre los Accionistas',
    status: 'upcoming'
  },
  {
    id: 'directorio',
    title: 'Directorio',
    description: 'Configura el directorio y designa directores',
    status: 'upcoming'
  },
  {
    id: 'apoderados',
    title: 'Registro de Apoderados',
    description: 'Define quiénes serán los apoderados',
    status: 'upcoming'
  },
  {
    id: 'regimen-facultades',
    title: 'Régimen General de Poderes',
    description: 'Define las reglas integras para el ejercicio de poderes',
    status: 'upcoming'
  },
  {
    id: 'quorums-mayorias',
    title: 'Quórums y Mayorías para Adopción de Acuerdos',
    description: 'Asigna porcentajes para varios casos según corresponda',
    status: 'upcoming'
  },
  {
    id: 'acuerdos-especiales',
    title: 'Acuerdos Societarios Especiales',
    description: 'Completa la información según corresponda',
    status: 'upcoming'
  },
  {
    id: 'resumen',
    title: 'Resumen',
    description: 'Visualiza toda la información antes de finalizar',
    status: 'upcoming'
  }
];
```

### 🎯 PASO 1: Datos Principales

**Componente:** `SociedadDatosPrincipalesNew.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Datos Principales de la Sociedad                              │
│  Completa la información básica de identificación y contacto   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Identificación de la Sociedad                          │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │  Denominación / Razón Social *                          │  │
│  │  [                                              ]        │  │
│  │                                                         │  │
│  │  Nombre de Fantasía                                     │  │
│  │  [                                              ]        │  │
│  │                                                         │  │
│  │  RUC *                  │  Tipo de Sociedad *          │  │
│  │  [            ]         │  [▼ S.A.C.         ]         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Ubicación y Contacto                                   │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │  Dirección Legal *                                      │  │
│  │  [                                              ]        │  │
│  │                                                         │  │
│  │  Departamento *         │  Provincia *                  │  │
│  │  [▼ Lima       ]        │  [▼ Lima            ]         │  │
│  │                                                         │  │
│  │  Distrito *                                              │  │
│  │  [▼ Miraflores          ]                               │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Objeto Social                                          │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │  Objeto Social *                                        │  │
│  │  [                                              ]        │  │
│  │  [                                              ]        │  │
│  │  [                                              ]        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Plazo de Duración                                      │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │  Duración *                                              │  │
│  │  ○ Indeterminada    ○ Determinada                       │  │
│  │                                                         │  │
│  │  [Si Determinada]: Fecha de Término                     │  │
│  │  [📅 DD/MM/AAAA    ]                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### Elementos HTML/React

```tsx
// Contenedor Principal
<div className="bg-white border rounded-xl p-8" style={{
  borderColor: 'var(--border-default)',
  borderRadius: 'var(--radius-large)'
}}>

// Título Principal
<h3 className="text-xl mb-2" style={{
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-primary)',
  fontWeight: 600
}}>
  Datos Principales de la Sociedad
</h3>

// Descripción
<p className="text-sm mb-8" style={{
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-secondary)'
}}>
  Completa la información básica...
</p>

// Sección con Borde
<div className="space-y-4 pb-8 border-b" style={{
  borderColor: 'var(--border-light)'
}}>

// Título de Sección
<h4 className="text-base mb-4" style={{
  color: 'var(--primary-800)',
  fontFamily: 'var(--font-primary)',
  fontWeight: 600
}}>
  Identificación de la Sociedad
</h4>

// Grid de 2 Columnas
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// Label
<Label htmlFor="denominacion" className="mb-2 block" style={{
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-secondary)',
  fontWeight: 500
}}>
  Denominación / Razón Social <span className="text-red-500">*</span>
</Label>

// Input (shadcn/ui)
<Input
  id="denominacion"
  placeholder="Ej: Tech Solutions S.A.C."
  value={localData.denominacion || ''}
  onChange={(e) => updateField('denominacion', e.target.value)}
  required
  style={{
    fontFamily: 'var(--font-secondary)',
    borderRadius: 'var(--radius-medium)'
  }}
/>

// Select Nativo
<select
  id="tipoSociedad"
  value={localData.tipoSociedad || ''}
  onChange={(e) => updateField('tipoSociedad', e.target.value)}
  required
  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
  style={{
    borderColor: 'var(--border-default)',
    fontFamily: 'var(--font-secondary)',
    borderRadius: 'var(--radius-medium)'
  }}
>
  <option value="">Seleccione...</option>
  <option value="SAC">Sociedad Anónima Cerrada (S.A.C.)</option>
  <option value="SA">Sociedad Anónima (S.A.)</option>
  <option value="SRL">Sociedad de Responsabilidad Limitada (S.R.L.)</option>
</select>

// Textarea (shadcn/ui)
<Textarea
  id="objetoSocial"
  placeholder="Describe el objeto social..."
  value={localData.objetoSocial || ''}
  onChange={(e) => updateField('objetoSocial', e.target.value)}
  rows={4}
  required
  style={{
    fontFamily: 'var(--font-secondary)',
    borderRadius: 'var(--radius-medium)'
  }}
/>
```

#### Campos del Formulario

| Campo | Tipo | Requerido | Observaciones |
|-------|------|-----------|---------------|
| **Denominación / Razón Social** | Input text | ✅ | Campo ancho completo |
| **Nombre de Fantasía** | Input text | ❌ | Campo ancho completo |
| **RUC** | Input text | ✅ | 50% width (grid) |
| **Tipo de Sociedad** | Select | ✅ | 50% width (grid) |
| **Dirección Legal** | Input text | ✅ | Campo ancho completo |
| **Departamento** | Select | ✅ | 50% width (grid) |
| **Provincia** | Select | ✅ | 50% width (grid) |
| **Distrito** | Select | ✅ | Campo ancho completo |
| **Teléfono** | Input tel | ❌ | 50% width (grid) |
| **Email** | Input email | ❌ | 50% width (grid) |
| **Objeto Social** | Textarea | ✅ | 4 filas, ancho completo |
| **Duración** | Radio group | ✅ | Indeterminada/Determinada |
| **Fecha de Término** | Input date | Condicional | Solo si duración determinada |

#### Lógica del Componente

```typescript
// Estado local con inicialización desde mock data
const [localData, setLocalData] = useState(getInitialData);

// Función helper para inicializar
const getInitialData = () => {
  // Si hay datos en formData (modo EDITAR), usarlos
  if (formData.datosPrincipales && Object.keys(formData.datosPrincipales).length > 0) {
    return formData.datosPrincipales;
  }
  // Si no, usar mock data (modo CREAR)
  return MOCK_DATOS_PRINCIPALES;
};

// Sincronización en mount
useEffect(() => {
  if (!formData.datosPrincipales || Object.keys(formData.datosPrincipales).length === 0) {
    setFormData({ ...formData, datosPrincipales: localData });
  }
}, []);

// Función de actualización
const updateField = (field: string, value: any) => {
  const newData = { ...localData, [field]: value };
  setLocalData(newData);
  setFormData({ ...formData, datosPrincipales: newData });
};
```

---

### 🎯 PASO 2: Accionistas

**Componente:** `SociedadAccionistasNew.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Accionistas                                                    │
│  Agrega los accionistas de la sociedad                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [+] Agregar Accionista                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Accionista 1                                      [···] │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  👤 Juan Pérez García                                    │  │
│  │  📄 DNI: 12345678                                        │  │
│  │  📧 juan.perez@email.com                                 │  │
│  │  📞 999 888 777                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Accionista 2                                      [···] │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  🏢 Tech Ventures S.A.C.                                 │  │
│  │  📄 RUC: 20123456789                                     │  │
│  │  👤 Rep. Legal: María López                              │  │
│  │  📧 contacto@techventures.com                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Total: 2 accionistas                                           │
└────────────────────────────────────────────────────────────────┘
```

#### Modal de Agregar Accionista

```
┌─────────────────────────────────────────────────────────────┐
│  Agregar Accionista                                    [×]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tipo de Accionista                                         │
│  ○ Persona Natural    ● Persona Jurídica                   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Razón Social / Nombre *                             │ │
│  │  [                                          ]         │ │
│  │                                                       │ │
│  │  RUC *                                                │ │
│  │  [                                          ]         │ │
│  │                                                       │ │
│  │  Representante Legal *                                │ │
│  │  [                                          ]         │ │
│  │                                                       │ │
│  │  DNI del Representante *                              │ │
│  │  [                                          ]         │ │
│  │                                                       │ │
│  │  Email                                                │ │
│  │  [                                          ]         │ │
│  │                                                       │ │
│  │  Teléfono                                             │ │
│  │  [                                          ]         │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│                          [Cancelar]  [Agregar Accionista]  │
└─────────────────────────────────────────────────────────────┘
```

---

### 🎯 PASO 3: Capital Social y Acciones

**Componente:** `SociedadCapitalAccionesNew.tsx`

#### Secciones

1. **Capital Social Total**
   - Monto del capital social (input number)
   - Moneda (select: PEN, USD, EUR)

2. **Configuración de Tipos de Acciones**
   - Tabla con tipos de acciones creados
   - Botón "Agregar Tipo de Acción"
   - Campos: Nombre, Cantidad, Valor Nominal, Derechos Especiales

---

### 🎯 PASO 4: Asignación de Acciones

**Componente:** `SociedadAsignacionAccionesNew.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Asignación de Acciones                                        │
│  Distribuye los tipos de acciones entre los accionistas        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Accionista: Juan Pérez García                           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Tipo de Acción     │  Cantidad  │  Valor  │  Total     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Acciones Comunes   │  [   500]  │  S/ 10  │  S/ 5,000 │  │
│  │  Acciones Clase A   │  [     0]  │  S/ 15  │  S/     0 │  │
│  │                                                          │  │
│  │  Total Invertido: S/ 5,000                               │  │
│  │  % Participación: 25.00%                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Accionista: Tech Ventures S.A.C.                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Tipo de Acción     │  Cantidad  │  Valor  │  Total     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Acciones Comunes   │  [ 1,500]  │  S/ 10  │ S/ 15,000 │  │
│  │  Acciones Clase A   │  [     0]  │  S/ 15  │  S/     0 │  │
│  │                                                          │  │
│  │  Total Invertido: S/ 15,000                              │  │
│  │  % Participación: 75.00%                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RESUMEN TOTAL                                           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Capital Total Asignado: S/ 20,000                       │  │
│  │  Capital Social: S/ 20,000                               │  │
│  │  ✅ La asignación está completa                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

### 🎯 PASO 5: Directorio

**Componente:** `SociedadDirectorio.tsx`

#### Funcionalidad

- Lista de directores asignados
- Modal para agregar director
- Campos: Nombre, DNI, Email, Cargo (Presidente, Director, Suplente)
- Opción de marcar como accionista existente

---

### 🎯 PASO 6: Apoderados

**Componente:** `SociedadApoderados.tsx`

#### Funcionalidad

- Lista de apoderados registrados
- Modal para agregar apoderado
- Campos: Nombre, DNI, Email, Tipo de Poder
- Asignación de poderes existentes

---

### 🎯 PASO 7: Régimen de Facultades

**Componente:** `SociedadRegimenFacultades.tsx`

#### Funcionalidad

- Configuración de reglas para poderes
- Definición de facultades por tipo de poder
- Restricciones y limitaciones

---

### 🎯 PASO 8: Quórums y Mayorías

**Componente:** `SociedadQuorums.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Quórums y Mayorías para Adopción de Acuerdos                 │
│  Define los porcentajes necesarios para diferentes escenarios │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Junta General de Accionistas                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Quórum en Primera Convocatoria        [  50  ] %       │  │
│  │  Quórum en Segunda Convocatoria        [  25  ] %       │  │
│  │  Mayoría para Acuerdos Ordinarios      [  50  ] %       │  │
│  │  Mayoría para Acuerdos Extraordinarios [  66  ] %       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Sesiones de Directorio                                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Quórum                                 [  50  ] %       │  │
│  │  Mayoría para Acuerdos                 [  50  ] %       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

### 🎯 PASO 9: Acuerdos Especiales

**Componente:** `SociedadAcuerdosEspeciales.tsx`

#### Funcionalidad

- Lista de acuerdos societarios especiales
- Modal para agregar nuevo acuerdo
- Campos: Título, Descripción, Condiciones

---

### 🎯 PASO 10: Resumen

**Componente:** `SociedadResumen.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Resumen de la Sociedad                                        │
│  Revisa toda la información antes de finalizar                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📄 DATOS PRINCIPALES                              [✏️]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Denominación: Tech Solutions S.A.C.                     │  │
│  │  RUC: 20123456789                                        │  │
│  │  Tipo: Sociedad Anónima Cerrada (S.A.C.)                │  │
│  │  Dirección: Av. Larco 1234, Miraflores, Lima            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  👥 ACCIONISTAS (2)                                [✏️]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • Juan Pérez García (25%)                               │  │
│  │  • Tech Ventures S.A.C. (75%)                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  💰 CAPITAL SOCIAL                                 [✏️]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Capital Total: S/ 20,000.00                             │  │
│  │  Acciones Comunes: 2,000 (S/ 10 c/u)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🏛️ DIRECTORIO (3)                                 [✏️]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • María López - Presidente                              │  │
│  │  • Carlos Ruiz - Director                                │  │
│  │  • Ana Torres - Director Suplente                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📊 QUÓRUMS Y MAYORÍAS                             [✏️]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Junta 1ª Conv: 50% | Junta 2ª Conv: 25%                │  │
│  │  Acuerdos Ordinarios: 50% | Extraordinarios: 66%        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ☑️ Opciones Finales                                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ✅ Enviar documentos al Repositorio                     │  │
│  │  ✅ Notificar a los accionistas por email               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. CREAR JUNTA - ESTRUCTURA VISUAL

### 📋 Configuración de los 6 Pasos

**Archivo:** `/data/flujoSteps.ts`

```typescript
export const juntaSteps: WizardStep[] = [
  {
    id: 'puntos-agenda',
    title: 'Puntos de Agenda',
    description: 'Selecciona los puntos a incluir en la junta',
    status: 'upcoming'
  },
  {
    id: 'detalles-junta',
    title: 'Detalles de la Junta',
    description: 'Completa la información de la Junta',
    status: 'upcoming'
  },
  {
    id: 'instalacion',
    title: 'Instalación de la Junta',
    description: 'Registra representante, asistencia y autoridades',
    status: 'upcoming'
  },
  {
    id: 'puntos-acuerdo',
    title: 'Puntos de Acuerdo',
    description: 'Completa las acciones y decisiones adoptadas',
    status: 'upcoming',
    subSteps: [
      // 13 sub-steps dinámicos organizados en 4 categorías
    ]
  },
  {
    id: 'resumen',
    title: 'Resumen',
    description: 'Visualiza un resumen de los datos',
    status: 'upcoming'
  },
  {
    id: 'documentos-generados',
    title: 'Documentos Generados',
    description: 'Visualiza o descarga los documentos finales',
    status: 'upcoming'
  }
];
```

### 🎯 PASO 1: Puntos de Agenda

**Componente:** `JuntaPuntosAgendaNew.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Puntos de Agenda                                              │
│  Selecciona los puntos que se tratarán en esta junta           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🔵 Aumento de Capital                                   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ☑️ Aporte Dinerario                                     │  │
│  │  ☑️ Aporte no Dinerario                                  │  │
│  │  ☐ Capitalización de Créditos                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🟣 Remoción                                             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ☐ Remoción de Gerente General                           │  │
│  │  ☑️ Remoción de Apoderados                               │  │
│  │  ☐ Remoción de Directores                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🟢 Nombramiento                                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ☐ Nombramiento de Gerente General                       │  │
│  │  ☑️ Nombramiento de Apoderados                           │  │
│  │  ☑️ Nombramiento de Directores                           │  │
│  │  ☐ Nombramiento del Nuevo Directorio                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🟠 Gestión Social y Resultados Económicos              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ☐ Pronunciamiento de la Gestión Social                 │  │
│  │  ☐ Aplicación de Resultados                              │  │
│  │  ☐ Designación de Auditores Externos                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Puntos seleccionados: 5                                        │
└────────────────────────────────────────────────────────────────┘
```

#### Elementos React

```tsx
// Checkbox de shadcn/ui
<Checkbox
  id={`punto-${punto.id}`}
  checked={selectedPuntos.includes(punto.id)}
  onCheckedChange={(checked) => handleTogglePunto(punto.id, checked)}
/>

// Label asociado
<label
  htmlFor={`punto-${punto.id}`}
  className="text-sm cursor-pointer"
  style={{
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-secondary)'
  }}
>
  {punto.title}
</label>
```

#### Lógica del Componente

```typescript
const [selectedPuntos, setSelectedPuntos] = useState<string[]>([]);

const handleTogglePunto = (puntoId: string, checked: boolean) => {
  if (checked) {
    setSelectedPuntos([...selectedPuntos, puntoId]);
  } else {
    setSelectedPuntos(selectedPuntos.filter(id => id !== puntoId));
  }
  
  // Actualizar formData y FlujoStore
  setFormData({ ...formData, puntosAgenda: newSelectedPuntos });
  setDynamicSubSteps(newSelectedPuntos); // Actualiza sub-steps del Paso 4
};
```

---

### 🎯 PASO 2: Detalles de la Junta

**Componente:** `JuntaDetallesNew.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Detalles de la Junta                                          │
│  Complete la información de la junta                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tipo de Junta                                           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ⚪ Junta Universal    ⚫ Junta General                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🔵 Primera Convocatoria                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Modalidad                                               │  │
│  │  ⚫ Presencial    ⚪ Virtual                              │  │
│  │                                                          │  │
│  │  Fecha y Hora                                            │  │
│  │  [📅 15/12/2024]  [🕐 10:00]                            │  │
│  │                                                          │  │
│  │  Dirección                              [🔄 Restablecer] │  │
│  │  [Av. Larco 1234, Miraflores, Lima              ]       │  │
│  │  💡 Dirección original de la sociedad                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🟣 Segunda Convocatoria                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Modalidad                                               │  │
│  │  ⚫ Presencial    ⚪ Virtual                              │  │
│  │                                                          │  │
│  │  Fecha y Hora                                            │  │
│  │  [📅 22/12/2024]  [🕐 10:00]                            │  │
│  │                                                          │  │
│  │  Dirección                              [🔄 Restablecer] │  │
│  │  [Av. Larco 1234, Miraflores, Lima              ]       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### Elementos React

```tsx
// Radio Button Custom (Tipo de Junta)
<button
  onClick={() => handleTipoJuntaChange('UNIVERSAL')}
  className="relative flex items-center justify-center gap-[8px] px-[20px] py-[10px] rounded-[8px] border border-solid transition-all"
  style={{
    borderColor: tipoJunta === 'UNIVERSAL' ? 'var(--primary-800)' : '#C6C5CA',
    backgroundColor: tipoJunta === 'UNIVERSAL' ? 'rgba(99, 71, 244, 0.05)' : 'white'
  }}
>
  {tipoJunta === 'UNIVERSAL' && (
    <Check className="w-4 h-4" style={{ color: 'var(--primary-800)' }} />
  )}
  <span className="font-['Manrope',sans-serif] text-[14px] font-medium">
    Junta Universal
  </span>
</button>

// Input con botón de restablecer
<div className="flex gap-2 items-start">
  <Input
    value={formData.primeraConvocatoria?.direccion || ''}
    onChange={(e) => updateField('primeraConvocatoria.direccion', e.target.value)}
    className="flex-1"
  />
  {direccionPrimeraModificada && (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleRestablecerDireccion('primera')}
      className="shrink-0"
    >
      <RotateCcw className="w-4 h-4" />
    </Button>
  )}
</div>

// Alert informativo
{!direccionPrimeraModificada && (
  <div className="flex items-center gap-2 p-3 rounded-lg" style={{
    backgroundColor: 'var(--primary-50)',
    borderLeft: '3px solid var(--primary-800)'
  }}>
    <Info className="w-4 h-4" style={{ color: 'var(--primary-800)' }} />
    <span className="text-sm" style={{
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-secondary)'
    }}>
      Dirección original de la sociedad
    </span>
  </div>
)}
```

#### Funcionalidad de Snapshot

```typescript
const { juntas } = useFlujoStore();

// Obtener la junta y su snapshot
const junta = juntas.find(j => j.id === juntaId);
const snapshot = junta?.referenceData;

// Dirección original del snapshot
const direccionOriginal = snapshot?.datosPrincipales?.direccion || '';

// Inicializar dirección desde el snapshot
useEffect(() => {
  if (direccionOriginal) {
    if (tipoJunta === 'UNIVERSAL' && !formData.detallesReunion?.direccion) {
      setFormData({
        ...formData,
        detallesReunion: {
          ...formData.detallesReunion,
          direccion: direccionOriginal
        }
      });
    }
  }
}, [direccionOriginal, tipoJunta]);

// Restablecer direcciones
const handleRestablecerDireccion = (tipo: 'primera' | 'segunda' | 'universal') => {
  if (tipo === 'primera') {
    setFormData({
      ...formData,
      primeraConvocatoria: {
        ...formData.primeraConvocatoria,
        direccion: direccionOriginal
      }
    });
  }
  // ... similar para segunda y universal
};

// Detectar modificaciones
const direccionPrimeraModificada = formData.primeraConvocatoria?.direccion && 
  formData.primeraConvocatoria?.direccion !== direccionOriginal;
```

---

### 🎯 PASO 3: Instalación de la Junta

**Componente:** `JuntaInstalacionNew.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Instalación de la Junta                                       │
│  Registra representantes, asistencia y autoridades             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🗂️ ASISTENCIA DE ACCIONISTAS                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Accionista              │ Asiste │ Representado │ Rep.  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Juan Pérez (25%)        │   ✅   │      ❌      │  -    │  │
│  │  Tech Ventures (75%)     │   ❌   │      ✅      │ [▼]   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  TOTAL PRESENTE: 100%                                    │  │
│  │  ✅ Quórum alcanzado (requiere 50%)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  👨‍⚖️ AUTORIDADES DE LA JUNTA                              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Presidente                                              │  │
│  │  [▼ María López                              ]           │  │
│  │                                                          │  │
│  │  Secretario                                              │  │
│  │  [▼ Carlos Ruiz                              ]           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📝 OBSERVACIONES                                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  [                                              ]         │  │
│  │  [                                              ]         │  │
│  │  [                                              ]         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

### 🎯 PASO 4: Puntos de Acuerdo (Sub-Steps Dinámicos)

**Componentes:** 
- `AporteDinerarioFlow.tsx` (para Aporte Dinerario)
- `GenericSubStepFlow.tsx` (para los demás puntos)

#### Sub-Steps Seleccionados Dinámicamente

El Paso 4 muestra **solo los sub-steps que fueron seleccionados en el Paso 1**.

#### Lógica de Filtrado en FlujoWizardView

```typescript
// Obtener sub-steps dinámicos desde FlujoStore
const dynamicSubSteps = getDynamicSubSteps?.() || [];

// Filtrar steps para incluir solo sub-steps seleccionados
const stepsWithDynamicSubSteps = config.steps.map(step => {
  if (step.id === 'puntos-acuerdo' && step.subSteps) {
    // Si NO hay puntos seleccionados, devolver paso sin sub-steps
    if (dynamicSubSteps.length === 0) {
      return {
        ...step,
        subSteps: []
      };
    }
    
    // Si hay puntos seleccionados, filtrar
    return {
      ...step,
      subSteps: step.subSteps.filter(subStep => 
        dynamicSubSteps.includes(subStep.id)
      )
    };
  }
  return step;
});
```

#### Anatomía del Sidebar con Sub-Steps

```
┌────────────────────────┐
│  Crear Junta           │
│  Paso 4 de 6           │
│  ━━━━━━━━━━━━━━━ 67%  │
│                        │
│  1 Puntos de Agenda ✓  │
│  2 Detalles Junta   ✓  │
│  3 Instalación      ✓  │
│  4 Puntos de Acuerdo ● │
│    ▼                   │
│    🔵 Aumento Capital  │
│    ● Aporte Dinerario  │
│    - Aporte no Diner.  │
│    🟣 Remoción         │
│    - Remoc. Apoderad.  │
│    🟢 Nombramiento     │
│    - Nomb. Apoderad.   │
│    - Nomb. Director    │
│  5 Resumen             │
│  6 Documentos          │
└────────────────────────┘
```

#### Sub-Step: Aporte Dinerario

**Componente:** `AporteDinerarioFlow.tsx`

Tiene **4 secciones internas** con sidebar derecho propio:

1. **Selección de Aportantes**
2. **Configuración de Aportes**
3. **Votación**
4. **Resumen**

```
┌──────────┬─────────────────────────────────────────┬──────────┐
│          │                                         │          │
│          │  Aporte Dinerario                       │  SIDEBAR │
│  MAIN    │                                         │  DERECHO │
│  SIDEBAR │  [Contenido de la sección actual]      │          │
│          │                                         │  1 Selecc│
│          │                                         │  ● Config│
│          │                                         │  3 Votac │
│          │                                         │  4 Resum │
└──────────┴─────────────────────────────────────────┴──────────┘
```

##### Sección 1: Selección de Aportantes

```
┌────────────────────────────────────────────────────────────────┐
│  Selección de Aportantes                                       │
│  Selecciona quiénes realizarán aportes dinerarios              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Accionistas Disponibles                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ☑️ Juan Pérez García (25%)                              │  │
│  │     Acciones actuales: 500                               │  │
│  │                                                          │  │
│  │  ☑️ Tech Ventures S.A.C. (75%)                           │  │
│  │     Acciones actuales: 1,500                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Aportantes seleccionados: 2                                    │
└────────────────────────────────────────────────────────────────┘
```

##### Sección 2: Configuración de Aportes

```
┌────────────────────────────────────────────────────────────────┐
│  Configuración de Aportes                                      │
│  Define el monto y cantidad de acciones por aportante          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Juan Pérez García                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Monto a Aportar (S/)                                    │  │
│  │  [                10,000                        ]         │  │
│  │                                                          │  │
│  │  Nuevas Acciones a Recibir                               │  │
│  │  [                1,000                         ]         │  │
│  │                                                          │  │
│  │  Valor Nominal por Acción: S/ 10.00                      │  │
│  │  % Participación después del aporte: 35.71%              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tech Ventures S.A.C.                                    │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Monto a Aportar (S/)                                    │  │
│  │  [                15,000                        ]         │  │
│  │                                                          │  │
│  │  Nuevas Acciones a Recibir                               │  │
│  │  [                1,500                         ]         │  │
│  │                                                          │  │
│  │  Valor Nominal por Acción: S/ 10.00                      │  │
│  │  % Participación después del aporte: 64.29%              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RESUMEN DEL AUMENTO DE CAPITAL                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Capital Actual: S/ 20,000.00                            │  │
│  │  Aumento de Capital: S/ 25,000.00                        │  │
│  │  Nuevo Capital Social: S/ 45,000.00                      │  │
│  │  Nuevas Acciones Totales: 2,500                          │  │
│  │  Total Acciones Después: 4,500                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

##### Sección 3: Votación

```
┌────────────────────────────────────────────────────────────────┐
│  Votación                                                      │
│  Registra los votos de los accionistas                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Accionista          │ Acciones │ Voto         │  %      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Juan Pérez          │    500   │ [▼ A Favor] │  25.00% │  │
│  │  Tech Ventures       │  1,500   │ [▼ A Favor] │  75.00% │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  RESULTADO DE LA VOTACIÓN                                │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  A Favor: 100.00% (2,000 acciones)                       │  │
│  │  En Contra: 0.00% (0 acciones)                           │  │
│  │  Abstenciones: 0.00% (0 acciones)                        │  │
│  │                                                          │  │
│  │  ✅ APROBADO (requiere mayoría simple)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

##### Sección 4: Resumen

```
┌────────────────────────────────────────────────────────────────┐
│  Resumen del Aporte Dinerario                                  │
│  Revisa toda la información antes de continuar                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📊 DATOS DEL APORTE                                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Monto Total del Aporte: S/ 25,000.00                    │  │
│  │  Nuevas Acciones Emitidas: 2,500                         │  │
│  │  Valor Nominal: S/ 10.00                                 │  │
│  │                                                          │  │
│  │  Capital Anterior: S/ 20,000.00                          │  │
│  │  Nuevo Capital Social: S/ 45,000.00                      │  │
│  │  Incremento: +125%                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  👥 APORTANTES (2)                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • Juan Pérez: S/ 10,000 → 1,000 acciones               │  │
│  │    Participación: 25% → 35.71%                           │  │
│  │                                                          │  │
│  │  • Tech Ventures: S/ 15,000 → 1,500 acciones            │  │
│  │    Participación: 75% → 64.29%                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🗳️ RESULTADO DE LA VOTACIÓN                             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ✅ APROBADO por unanimidad (100%)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### Sub-Steps Genéricos

**Componente:** `GenericSubStepFlow.tsx`

Los demás sub-steps (Aporte no Dinerario, Capitalización, Remociones, Nombramientos, etc.) usan una estructura genérica con **3 secciones**:

1. **Configuración**
2. **Votación**
3. **Resumen**

```
┌──────────┬─────────────────────────────────────────┬──────────┐
│          │                                         │          │
│  MAIN    │  [Título del Sub-Step]                  │  SIDEBAR │
│  SIDEBAR │                                         │  DERECHO │
│          │  [Contenido específico del punto]      │          │
│          │                                         │  ● Config│
│          │                                         │  2 Votac │
│          │                                         │  3 Resum │
└──────────┴─────────────────────────────────────────┴──────────┘
```

---

### 🎯 PASO 5: Resumen

**Componente:** `JuntaResumenFinal.tsx`

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  Resumen de la Junta                                           │
│  Revisa toda la información antes de finalizar                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📅 DETALLES DE LA JUNTA                           [✏️]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Tipo: Junta General de Accionistas                      │  │
│  │  Sociedad: Tech Solutions S.A.C.                         │  │
│  │  Primera Convocatoria: 15/12/2024 10:00 - Presencial    │  │
│  │  Segunda Convocatoria: 22/12/2024 10:00 - Presencial    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  👥 INSTALACIÓN                                    [✏️]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Quórum: 100% (2,000 acciones)                           │  │
│  │  Presidente: María López                                 │  │
│  │  Secretario: Carlos Ruiz                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📋 PUNTOS ACORDADOS (5)                           [✏️]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ✅ Aporte Dinerario                                     │  │
│  │     Aumento: S/ 25,000 → Capital nuevo: S/ 45,000       │  │
│  │     Aprobado por unanimidad                              │  │
│  │                                                          │  │
│  │  ✅ Aporte no Dinerario                                  │  │
│  │     Bien aportado: Inmueble (Valor: S/ 80,000)          │  │
│  │     Aprobado: 100%                                       │  │
│  │                                                          │  │
│  │  ✅ Remoción de Apoderados                               │  │
│  │     Removido: Luis Martínez                              │  │
│  │     Aprobado: 85%                                        │  │
│  │                                                          │  │
│  │  ✅ Nombramiento de Apoderados                           │  │
│  │     Nuevo apoderado: Ana Torres                          │  │
│  │     Aprobado: 100%                                       │  │
│  │                                                          │  │
│  │  ✅ Nombramiento de Directores                           │  │
│  │     Nuevo director: Roberto Gómez                        │  │
│  │     Aprobado: 90%                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

### 🎯 PASO 6: Documentos Generados

**Componente:** `DocumentosGenerados.tsx`

Ver documentación completa en `/DOCS_VISUAL_DESCARGA_DOCUMENTOS_JUNTAS.md`

---

## 5. COMPONENTES COMPARTIDOS

### 🧩 SingleWizardSidebar

**Archivo:** `/components/SingleWizardSidebar.tsx`

#### Anatomía Visual

```
┌────────────────────────┐
│  🏢                    │
│  Crear Sociedad        │
│  Paso 3 de 10          │
│                        │
│  ━━━━━━━━━━━━━━━ 30%  │
│  30% completado        │
│                        │
│  ✓ 1 Datos Principales │
│  ✓ 2 Accionistas       │
│  ● 3 Capital y Acciones│
│  4 Asignación          │
│  5 Directorio          │
│  6 Apoderados          │
│  7 Régimen Facultades  │
│  8 Quórums             │
│  9 Acuerdos Especiales │
│  10 Resumen            │
└────────────────────────┘
```

#### Elementos React

```tsx
// Header del Sidebar
<div className="flex items-center gap-3 mb-6">
  <div 
    className="w-10 h-10 rounded-lg flex items-center justify-center"
    style={{ 
      background: 'linear-gradient(135deg, var(--primary-700), var(--primary-500))',
      borderRadius: 'var(--radius-medium)'
    }}
  >
    <Icon className="w-5 h-5 text-white" />
  </div>
  <div>
    <h3 className="text-sm" style={{
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-primary)',
      fontWeight: 600
    }}>
      {title}
    </h3>
    <p className="text-xs" style={{
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-secondary)'
    }}>
      Paso {progress.current} de {progress.total}
    </p>
  </div>
</div>

// Progress Bar
<div className="mb-6">
  <div 
    className="h-2 rounded-full overflow-hidden"
    style={{ backgroundColor: 'var(--gray-200)' }}
  >
    <div
      className="h-full transition-all duration-300"
      style={{
        width: `${(progress.current / progress.total) * 100}%`,
        backgroundColor: 'var(--primary-700)'
      }}
    />
  </div>
  <p className="text-xs mt-2 text-right" style={{
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-secondary)'
  }}>
    {Math.round((progress.current / progress.total) * 100)}% completado
  </p>
</div>

// Step Item
<button
  onClick={() => onStepClick?.(step.id)}
  disabled={step.status === 'upcoming'}
  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
  style={{
    backgroundColor: isCurrent ? 'var(--primary-50)' : 'transparent',
    cursor: step.status === 'upcoming' ? 'not-allowed' : 'pointer',
    opacity: step.status === 'upcoming' ? 0.5 : 1
  }}
>
  {/* Indicador de estado */}
  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
    backgroundColor: step.status === 'completed' 
      ? 'var(--primary-800)' 
      : isCurrent 
        ? 'var(--primary-800)' 
        : 'var(--gray-200)',
    color: step.status === 'completed' || isCurrent ? 'white' : 'var(--text-muted)'
  }}>
    {step.status === 'completed' ? (
      <Check className="w-3 h-3" />
    ) : isCurrent ? (
      <div className="w-2 h-2 rounded-full bg-white" />
    ) : (
      <span className="text-xs">{index + 1}</span>
    )}
  </div>
  
  {/* Título del paso */}
  <span className="text-sm text-left flex-1" style={{
    color: isCurrent ? 'var(--primary-800)' : 'var(--text-secondary)',
    fontFamily: 'var(--font-secondary)',
    fontWeight: isCurrent ? 600 : 400
  }}>
    {step.title}
  </span>
  
  {/* Indicador de sub-steps */}
  {hasSubSteps && (
    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
  )}
</button>

// Sub-Steps (collapsed/expanded)
{hasSubSteps && isExpanded && (
  <div className="ml-8 mt-1 space-y-1">
    {step.subSteps?.map((subStep) => {
      const isSubStepCurrent = subStep.id === currentSubStepId;
      
      return (
        <button
          key={subStep.id}
          onClick={() => onSubStepClick?.(subStep.id)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-all"
          style={{
            backgroundColor: isSubStepCurrent ? 'var(--primary-50)' : 'transparent'
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
            backgroundColor: isSubStepCurrent ? 'var(--primary-800)' : 'var(--gray-300)'
          }} />
          <span className="text-sm flex-1" style={{
            color: isSubStepCurrent ? 'var(--primary-800)' : 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
            fontWeight: isSubStepCurrent ? 600 : 400
          }}>
            {subStep.title}
          </span>
        </button>
      );
    })}
  </div>
)}
```

#### Estados del Step

| Estado | Color Indicador | Icono | Clickeable | Opacidad |
|--------|----------------|-------|------------|----------|
| **completed** | `var(--primary-800)` | ✓ Check | ✅ | 1.0 |
| **current** | `var(--primary-800)` | ● Dot | ✅ | 1.0 |
| **upcoming** | `var(--gray-200)` | Número | ❌ | 0.5 |

---

### 🧩 FlujoWizardView - Header

**Archivo:** `/components/FlujoWizardView.tsx` (líneas 215-278)

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  [← Salir]  │  Datos Principales                               │
│              │  Completa todos los datos de la Sociedad         │
│              │                        [💾 Guardar] [🔄 Reset]   │
└────────────────────────────────────────────────────────────────┘
```

#### Elementos React

```tsx
<div 
  className="bg-white border-b px-8 py-4"
  style={{ 
    borderColor: 'var(--border-light)',
    boxShadow: 'var(--shadow-card)'
  }}
>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      {/* Botón Salir */}
      <Button
        variant="ghost"
        size="sm"
        onClick={config.onBack}
        className="flex items-center gap-2"
        style={{ fontFamily: 'var(--font-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Salir
      </Button>
      
      {/* Separador */}
      <div className="h-8 w-px bg-gray-200"></div>
      
      {/* Título y Descripción */}
      <div>
        <h1 className="text-xl mb-0.5" style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-primary)',
          fontWeight: 600
        }}>
          {currentStep.title}
        </h1>
        <p className="text-sm" style={{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-secondary)'
        }}>
          {currentStep.description}
        </p>
      </div>
    </div>
    
    {/* Botones de Acción */}
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleSave}
        className="flex items-center gap-2"
        style={{ fontFamily: 'var(--font-secondary)' }}
      >
        <Save className="w-4 h-4" />
        Guardar Cambios
      </Button>
      <Button
        variant="outline"
        onClick={handleReset}
        className="flex items-center gap-2"
        style={{ fontFamily: 'var(--font-secondary)' }}
      >
        <RotateCcw className="w-4 h-4" />
        Restablecer
      </Button>
    </div>
  </div>
</div>
```

---

### 🧩 FlujoWizardView - Footer

**Archivo:** `/components/FlujoWizardView.tsx` (líneas 316-366)

#### Anatomía Visual

```
┌────────────────────────────────────────────────────────────────┐
│  [← Anterior]          Paso 3 de 10          [Siguiente →]    │
└────────────────────────────────────────────────────────────────┘
```

#### Elementos React

```tsx
<div 
  className="bg-white border-t px-8 py-4"
  style={{ borderColor: 'var(--border-light)' }}
>
  <div className="flex items-center justify-between max-w-5xl mx-auto">
    {/* Botón Anterior */}
    <Button
      variant="outline"
      onClick={handlePrev}
      disabled={isFirstStep}
      className="flex items-center gap-2"
      style={{ fontFamily: 'var(--font-secondary)' }}
    >
      <ArrowLeft className="w-4 h-4" />
      Anterior
    </Button>

    {/* Indicador de Progreso */}
    <div className="text-sm" style={{
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-secondary)'
    }}>
      Paso {currentStepIndex + 1} de {config.steps.length}
    </div>

    {/* Botón Siguiente o Finalizar */}
    {!isLastStep ? (
      <Button
        onClick={handleNext}
        className="flex items-center gap-2 text-white"
        style={{ 
          backgroundColor: 'var(--primary-800)',
          fontFamily: 'var(--font-secondary)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-900)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-800)'}
      >
        Siguiente
        <ArrowRight className="w-4 h-4" />
      </Button>
    ) : (
      <Button
        onClick={handleComplete}
        className="flex items-center gap-2 text-white"
        style={{ 
          backgroundColor: '#10B981',
          fontFamily: 'var(--font-secondary)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
      >
        <Check className="w-4 h-4" />
        Finalizar
      </Button>
    )}
  </div>
</div>
```

---

## 6. SISTEMA DE TOKENS CSS PROBO

**Archivo:** `/styles/globals.css`

### 🎨 Tipografías

```css
/* Fuentes importadas de Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

/* Variables */
--font-primary: 'Gabarito', sans-serif;   /* Títulos y headers */
--font-secondary: 'Manrope', sans-serif;  /* Cuerpo y descripciones */
```

#### Uso en Componentes

```tsx
// Títulos principales
style={{ fontFamily: 'var(--font-primary)', fontWeight: 600 }}

// Textos de cuerpo, labels, descripciones
style={{ fontFamily: 'var(--font-secondary)' }}
```

---

### 🌈 Paleta de Colores

#### Colores Primarios PROBO (Purple)

```css
--primary-25: #F9F8FF;
--primary-50: #F1EEFF;
--primary-75: #E2DCFF;
--primary-100: #C6BBFF;
--primary-200: #BCAFFF;
--primary-300: #A797FF;
--primary-400: #8B75FF;
--primary-500: #7357FF;
--primary-600: #6347F4;
--primary-700: #553ADE;
--primary-800: #3C28A4;  /* ⭐ Color predominante */
--primary-900: #21194D;
```

#### Grises Corporativos

```css
--gray-25: #F8F8F8;
--gray-50: #F3F3F4;
--gray-75: #ECECED;
--gray-100: #E2E2E4;
--gray-200: #D9D8DC;  /* Bordes default */
--gray-300: #C6C5CA;
--gray-400: #B3B1B8;
--gray-500: #8D8A95;  /* Texto muted */
--gray-600: #676472;
--gray-700: #4F4B5C;  /* Texto secondary */
--gray-800: #2E293D;
--gray-900: #110C22;  /* Texto primary */
```

---

### 🎨 Tokens Semánticos

#### Fondos

```css
--bg-default: #FFFFFF;
--bg-muted: var(--gray-25);      /* #F8F8F8 */
--bg-card: #FFFFFF;
--bg-secondary: var(--gray-50);
```

#### Bordes

```css
--border-default: var(--gray-200);  /* #D9D8DC */
--border-light: var(--gray-100);    /* #E2E2E4 */
--border-heavy: var(--gray-300);    /* #C6C5CA */
```

#### Textos

```css
--text-primary: var(--gray-900);    /* #110C22 */
--text-secondary: var(--gray-700);  /* #4F4B5C */
--text-muted: var(--gray-500);      /* #8D8A95 */
--text-disabled: var(--gray-400);   /* #B3B1B8 */
--text-inverse: #FFFFFF;
```

#### Bordes Redondeados

```css
--radius-large: 24px;   /* Tarjetas principales */
--radius-medium: 16px;  /* Inputs, selects */
--radius-small: 8px;    /* Botones pequeños */
```

#### Sombras

```css
--shadow-card: 0 2px 8px rgba(17, 12, 34, 0.04);
--shadow-hover: 0 4px 16px rgba(17, 12, 34, 0.08);
--shadow-modal: 0 8px 24px rgba(17, 12, 34, 0.12);
```

---

### 📊 Tabla de Uso de Tokens

| Elemento | Token CSS | Valor Real | Observaciones |
|----------|-----------|------------|---------------|
| **Fondo general** | `var(--bg-muted)` | `#F8F8F8` | Fondo de toda la vista |
| **Tarjetas** | `var(--bg-default)` | `#FFFFFF` | Contenedores de formularios |
| **Bordes tarjetas** | `var(--border-default)` | `#D9D8DC` | 1px solid |
| **Border radius tarjetas** | `var(--radius-large)` | `24px` | Esquinas redondeadas |
| **Títulos principales** | `var(--text-primary)` | `#110C22` | h1, h2, h3 |
| **Descripciones** | `var(--text-muted)` | `#8D8A95` | Textos secundarios |
| **Botón primario** | `var(--primary-800)` | `#3C28A4` | Siguiente, Guardar |
| **Botón hover** | `var(--primary-900)` | `#21194D` | Estado hover |
| **Inputs** | `var(--radius-medium)` | `16px` | Border radius |
| **Progress bar** | `var(--primary-700)` | `#553ADE` | Barra de progreso |

---

## 7. COMPONENTES SHADCN/UI UTILIZADOS

### 📦 Listado de Componentes

| Componente | Archivo | Uso |
|------------|---------|-----|
| **Button** | `/components/ui/button.tsx` | Todos los botones del wizard |
| **Input** | `/components/ui/input.tsx` | Campos de texto, números, emails |
| **Label** | `/components/ui/label.tsx` | Etiquetas de formularios |
| **Textarea** | `/components/ui/textarea.tsx` | Campos de texto multilínea |
| **Checkbox** | `/components/ui/checkbox.tsx` | Selección de puntos de agenda |
| **Select** | `/components/ui/select.tsx` | Selectores desplegables |
| **Dialog** | `/components/ui/dialog.tsx` | Modales (agregar accionista, etc.) |
| **Card** | `/components/ui/card.tsx` | Tarjetas de resumen |
| **Badge** | `/components/ui/badge.tsx` | Etiquetas de estado |
| **Separator** | `/components/ui/separator.tsx` | Líneas divisorias |
| **Alert** | `/components/ui/alert.tsx` | Mensajes informativos |

---

### 🔍 Detalles de Implementación

#### Button

```tsx
import { Button } from './ui/button';

// Variantes usadas:
<Button variant="outline">Guardar</Button>
<Button variant="ghost">Salir</Button>
<Button>Siguiente</Button>  // default = filled

// Tamaños:
<Button size="sm">Pequeño</Button>
<Button size="default">Normal</Button>
```

#### Input

```tsx
import { Input } from './ui/input';

<Input
  id="denominacion"
  type="text"
  placeholder="Ej: Tech Solutions S.A.C."
  value={localData.denominacion || ''}
  onChange={(e) => updateField('denominacion', e.target.value)}
  required
  style={{
    fontFamily: 'var(--font-secondary)',
    borderRadius: 'var(--radius-medium)'
  }}
/>
```

**Clases del Input (built-in):**
```
border-input
bg-input-background
rounded-md
px-3 py-1
h-9
focus-visible:border-ring
focus-visible:ring-ring/50
```

#### Textarea

```tsx
import { Textarea } from './ui/textarea';

<Textarea
  id="objetoSocial"
  placeholder="Describe el objeto social..."
  value={localData.objetoSocial || ''}
  onChange={(e) => updateField('objetoSocial', e.target.value)}
  rows={4}
  style={{
    fontFamily: 'var(--font-secondary)',
    borderRadius: 'var(--radius-medium)'
  }}
/>
```

#### Checkbox

```tsx
import { Checkbox } from './ui/checkbox';

<Checkbox
  id={`punto-${punto.id}`}
  checked={selectedPuntos.includes(punto.id)}
  onCheckedChange={(checked) => handleTogglePunto(punto.id, checked)}
/>
```

#### Label

```tsx
import { Label } from './ui/label';

<Label 
  htmlFor="denominacion"
  className="mb-2 block"
  style={{
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-secondary)',
    fontWeight: 500
  }}
>
  Denominación / Razón Social <span className="text-red-500">*</span>
</Label>
```

#### Dialog (Modal)

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Agregar Accionista</DialogTitle>
    </DialogHeader>
    {/* Contenido del modal */}
  </DialogContent>
</Dialog>
```

---

## 8. CLASES DE TAILWIND CSS

### 📐 Layout Classes

```css
/* Flexbox */
flex
flex-col
flex-1
items-center
items-start
justify-between
gap-2, gap-4, gap-6, gap-8

/* Grid */
grid
grid-cols-1
md:grid-cols-2
gap-6

/* Spacing */
p-4, p-6, p-8
px-3, px-8
py-2, py-4
mb-2, mb-4, mb-6, mb-8
space-y-4, space-y-6, space-y-8

/* Sizing */
w-full
w-80
h-full
h-screen
max-w-5xl
```

---

### 🎨 Visual Classes

```css
/* Background */
bg-white
bg-gray-50
bg-transparent

/* Border */
border
border-b
border-t
border-solid
rounded-lg
rounded-xl
rounded-full

/* Shadow */
shadow-sm
shadow-md

/* Text */
text-sm
text-base
text-xl
text-center
text-left
text-white
text-red-500

/* Font Weight */
font-medium
font-semibold
font-bold

/* Opacity */
opacity-50
opacity-100
```

---

### 🎯 Interactive Classes

```css
/* Hover */
hover:bg-gray-100
hover:opacity-80

/* Focus */
focus:ring-2
focus:border-transparent

/* Disabled */
disabled:opacity-50
disabled:cursor-not-allowed
disabled:pointer-events-none

/* Transitions */
transition-all
transition-colors
transition-opacity
duration-200
duration-300
```

---

### 📱 Responsive Classes

```css
/* Mobile-first breakpoints */
md:grid-cols-2     /* ≥ 768px */
md:col-span-2
lg:max-w-4xl      /* ≥ 1024px */
```

---

## 9. INTERACCIONES DEL USUARIO

### 🖱️ Navegación entre Pasos

#### Flujo Normal

1. Usuario hace clic en **"Siguiente"** en el footer
2. `handleNext()` se ejecuta
3. `currentStepIndex` se incrementa
4. Vista se desplaza al inicio (`window.scrollTo`)
5. Sidebar actualiza el indicador de progreso

```typescript
const handleNext = () => {
  if (!isLastStep) {
    setCurrentStepIndex(currentStepIndex + 1);
    setCurrentSubStepId(undefined); // Reset sub-step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
```

#### Navegación desde Sidebar

1. Usuario hace clic en un paso **completado** en el sidebar
2. `handleStepClick(stepId)` se ejecuta
3. Encuentra el índice del paso
4. Actualiza `currentStepIndex`
5. Solo permite navegar a pasos ya visitados o anteriores

```typescript
const handleStepClick = (stepId: string) => {
  const index = config.steps.findIndex(s => s.id === stepId);
  if (index !== -1 && index <= currentStepIndex) {
    setCurrentStepIndex(index);
    setCurrentSubStepId(undefined);
  }
};
```

---

### 💾 Guardar y Restablecer

#### Guardar Cambios

```typescript
const handleSave = () => {
  setSavedFormData({ ...formData }); // Snapshot
  toast.success('Cambios guardados correctamente');
};
```

#### Restablecer

```typescript
const handleReset = () => {
  setFormData({ ...savedFormData }); // Restaurar snapshot
  toast.info('Formulario restablecido al último guardado');
};
```

---

### ✅ Finalizar Flujo

```typescript
const handleComplete = () => {
  const finalData = {
    ...formData,
    sendToRepository,
    completedAt: new Date().toISOString()
  };
  
  const registroId = config.modo === 'EDITAR' && config.registroId
    ? actualizarSociedad(config.registroId, finalData)
    : crearSociedad(finalData);
    
  config.onComplete(registroId);
  toast.success('Flujo completado y guardado exitosamente');
};
```

---

### 🔄 Actualización de Campos

Todos los componentes de pasos usan el patrón:

```typescript
// Estado local
const [localData, setLocalData] = useState(initialData);

// Función de actualización
const updateField = (field: string, value: any) => {
  const newData = { ...localData, [field]: value };
  setLocalData(newData);
  setFormData({ ...formData, [sectionKey]: newData });
};

// En el input
<Input
  value={localData.denominacion || ''}
  onChange={(e) => updateField('denominacion', e.target.value)}
/>
```

---

### 📋 Selección de Puntos de Agenda (Junta)

```typescript
const [selectedPuntos, setSelectedPuntos] = useState<string[]>([]);

const handleTogglePunto = (puntoId: string, checked: boolean) => {
  const newSelectedPuntos = checked
    ? [...selectedPuntos, puntoId]
    : selectedPuntos.filter(id => id !== puntoId);
    
  setSelectedPuntos(newSelectedPuntos);
  setFormData({ ...formData, puntosAgenda: newSelectedPuntos });
  
  // ⭐ Actualizar sub-steps dinámicos en FlujoStore
  setDynamicSubSteps(newSelectedPuntos);
};
```

---

### 🎯 Navegación en Sub-Steps

```typescript
const handleSubStepClick = (subStepId: string) => {
  // Verificar que estemos en el paso correcto
  const puntosAcuerdoIndex = config.steps.findIndex(s => s.id === 'puntos-acuerdo');
  
  if (puntosAcuerdoIndex !== -1 && currentStepIndex !== puntosAcuerdoIndex) {
    // Navegar primero al paso principal
    setCurrentStepIndex(puntosAcuerdoIndex);
  }
  
  // Establecer el sub-step
  setCurrentSubStepId(subStepId);
};
```

---

## 10. ESTADOS VISUALES

### 🎨 Estados de los Steps en Sidebar

#### Estado "Upcoming" (Pendiente)

```tsx
// No se ha completado aún, no clickeable
style={{
  opacity: 0.5,
  cursor: 'not-allowed'
}}

// Indicador: Número en gris
<div style={{ backgroundColor: 'var(--gray-200)', color: 'var(--text-muted)' }}>
  {index + 1}
</div>
```

#### Estado "Current" (Actual)

```tsx
// Paso activo, fondo morado claro
style={{
  backgroundColor: 'var(--primary-50)',
  cursor: 'pointer',
  opacity: 1
}}

// Indicador: Dot blanco en fondo morado
<div style={{ backgroundColor: 'var(--primary-800)' }}>
  <div className="w-2 h-2 rounded-full bg-white" />
</div>

// Título en morado bold
style={{
  color: 'var(--primary-800)',
  fontWeight: 600
}}
```

#### Estado "Completed" (Completado)

```tsx
// Paso completado, clickeable
style={{
  backgroundColor: 'transparent',
  cursor: 'pointer',
  opacity: 1
}}

// Indicador: Check en fondo morado
<div style={{ backgroundColor: 'var(--primary-800)', color: 'white' }}>
  <Check className="w-3 h-3" />
</div>

// Título en gris
style={{
  color: 'var(--text-secondary)',
  fontWeight: 400
}}
```

---

### 🔘 Estados de Botones

#### Botón "Siguiente" (Primario)

```tsx
// Normal
style={{
  backgroundColor: 'var(--primary-800)', // #3C28A4
  color: 'white'
}}

// Hover
onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-900)'}
// #21194D

// Disabled
disabled={true}
className="opacity-50 cursor-not-allowed"
```

#### Botón "Finalizar" (Success)

```tsx
// Normal
style={{
  backgroundColor: '#10B981', // Verde
  color: 'white'
}}

// Hover
onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
```

#### Botón "Anterior" / "Guardar" (Outline)

```tsx
<Button variant="outline">
  {/* Borde gris, fondo blanco */}
</Button>

// Hover: fondo gris claro
```

---

### 📝 Estados de Inputs

#### Normal

```tsx
<Input />
// border: var(--border-default) = #D9D8DC
// background: var(--bg-muted) = #F8F8F8
```

#### Focus

```tsx
// focus-visible:border-ring
// focus-visible:ring-ring/50
// focus-visible:ring-[3px]

// Borde morado, ring morado con 50% opacidad
```

#### Error (aria-invalid)

```tsx
<Input aria-invalid="true" />

// aria-invalid:ring-destructive/20
// aria-invalid:border-destructive

// Borde y ring rojos
```

#### Disabled

```tsx
<Input disabled />

// disabled:opacity-50
// disabled:cursor-not-allowed
```

---

### ✅ Estados de Checkbox

#### Unchecked

```tsx
<Checkbox checked={false} />
// Cuadrado con borde gris
```

#### Checked

```tsx
<Checkbox checked={true} />
// Cuadrado morado con checkmark blanco
// backgroundColor: var(--primary-800)
```

---

### 🎯 Estados de Radio Buttons Personalizados

#### No seleccionado

```tsx
style={{
  borderColor: '#C6C5CA',
  backgroundColor: 'white'
}}
```

#### Seleccionado

```tsx
style={{
  borderColor: 'var(--primary-800)',
  backgroundColor: 'rgba(99, 71, 244, 0.05)'
}}

// Icono Check visible
<Check className="w-4 h-4" style={{ color: 'var(--primary-800)' }} />
```

---

### 📊 Estados del Progress Bar

```tsx
// Contenedor gris claro
<div style={{ backgroundColor: 'var(--gray-200)' }}>
  
  // Barra de progreso morado
  <div style={{
    width: `${(progress.current / progress.total) * 100}%`,
    backgroundColor: 'var(--primary-700)',
    transition: 'all 0.3s'
  }} />
</div>
```

---

### 🔔 Estados de Alert/Info

#### Info (dirección original)

```tsx
<div style={{
  backgroundColor: 'var(--primary-50)',
  borderLeft: '3px solid var(--primary-800)'
}}>
  <Info className="w-4 h-4" style={{ color: 'var(--primary-800)' }} />
  <span style={{ color: 'var(--text-secondary)' }}>
    Dirección original de la sociedad
  </span>
</div>
```

#### Success (quórum alcanzado)

```tsx
<div style={{
  backgroundColor: '#D1FAE5',
  borderLeft: '3px solid #10B981'
}}>
  <Check className="w-4 h-4" style={{ color: '#10B981' }} />
  <span>Quórum alcanzado (requiere 50%)</span>
</div>
```

#### Warning

```tsx
<div style={{
  backgroundColor: '#FEF3C7',
  borderLeft: '3px solid #F59E0B'
}}>
  <AlertTriangle className="w-4 h-4" style={{ color: '#F59E0B' }} />
  <span>Advertencia...</span>
</div>
```

---

## 11. CHECKLIST DE MIGRACIÓN A NUXT 4

### ✅ Estructura de Archivos

#### React (Actual)

```
/components/
  FlujoWizardView.tsx
  SingleWizardSidebar.tsx
  flujo-steps/
    SociedadDatosPrincipalesNew.tsx
    JuntaDetallesNew.tsx
    ...
  ui/
    button.tsx
    input.tsx
    ...
/contexts/
  FlujoContext.tsx
/data/
  flujoSteps.ts
```

#### Nuxt 4 (Propuesto)

```
/components/
  wizard/
    WizardLayout.vue
    WizardSidebar.vue
    WizardHeader.vue
    WizardFooter.vue
  sociedad/
    DatosPrincipales.vue
    Accionistas.vue
    ...
  junta/
    PuntosAgenda.vue
    DetallesJunta.vue
    ...
  ui/
    UiButton.vue
    UiInput.vue
    ...
/composables/
  useFlujo.ts
  useWizardNavigation.ts
/data/
  flujoSteps.ts
```

---

### 📋 Checklist Detallado

#### 1. Componentes Base

- [ ] Convertir `FlujoWizardView.tsx` a `WizardLayout.vue`
  - [ ] Migrar lógica de navegación a composable `useWizardNavigation.ts`
  - [ ] Usar `ref` y `computed` de Vue
  - [ ] Implementar `provide/inject` para pasar datos a hijos

- [ ] Convertir `SingleWizardSidebar.tsx` a `WizardSidebar.vue`
  - [ ] Migrar estado de steps expandidos
  - [ ] Implementar emits para navegación
  - [ ] Usar `v-for` para renderizar steps

- [ ] Crear `WizardHeader.vue` separado
  - [ ] Extraer lógica del header
  - [ ] Props: `currentStep`, `onBack`, `onSave`, `onReset`

- [ ] Crear `WizardFooter.vue` separado
  - [ ] Extraer lógica del footer
  - [ ] Props: `currentStepIndex`, `totalSteps`, `isFirstStep`, `isLastStep`
  - [ ] Emits: `next`, `prev`, `complete`

---

#### 2. Pasos de Sociedades

- [ ] `SociedadDatosPrincipalesNew.tsx` → `sociedad/DatosPrincipales.vue`
  - [ ] Convertir `useState` a `ref`
  - [ ] Convertir `useEffect` a `watch` / `onMounted`
  - [ ] Migrar `updateField` a función del composable

- [ ] `SociedadAccionistasNew.tsx` → `sociedad/Accionistas.vue`
  - [ ] Migrar lógica de modales
  - [ ] Usar `v-model` para formularios

- [ ] `SociedadCapitalAccionesNew.tsx` → `sociedad/CapitalAcciones.vue`

- [ ] `SociedadAsignacionAccionesNew.tsx` → `sociedad/AsignacionAcciones.vue`
  - [ ] Migrar cálculos de porcentajes a `computed`

- [ ] `SociedadDirectorio.tsx` → `sociedad/Directorio.vue`

- [ ] `SociedadApoderados.tsx` → `sociedad/Apoderados.vue`

- [ ] `SociedadRegimenFacultades.tsx` → `sociedad/RegimenFacultades.vue`

- [ ] `SociedadQuorums.tsx` → `sociedad/Quorums.vue`

- [ ] `SociedadAcuerdosEspeciales.tsx` → `sociedad/AcuerdosEspeciales.vue`

- [ ] `SociedadResumen.tsx` → `sociedad/Resumen.vue`

---

#### 3. Pasos de Juntas

- [ ] `JuntaPuntosAgendaNew.tsx` → `junta/PuntosAgenda.vue`
  - [ ] Migrar selección de checkboxes a `v-model`
  - [ ] Actualizar dinámicamente sub-steps en store

- [ ] `JuntaDetallesNew.tsx` → `junta/DetallesJunta.vue`
  - [ ] Migrar lógica de snapshot
  - [ ] Migrar función de restablecer dirección

- [ ] `JuntaInstalacionNew.tsx` → `junta/InstalacionJunta.vue`
  - [ ] Migrar lógica de asistencia
  - [ ] Migrar cálculo de quórum a `computed`

- [ ] `AporteDinerarioFlow.tsx` → `junta/AporteDinerarioFlow.vue`
  - [ ] Migrar sidebar derecho
  - [ ] Migrar 4 secciones internas

- [ ] `GenericSubStepFlow.tsx` → `junta/GenericSubStepFlow.vue`
  - [ ] Migrar estructura genérica de 3 secciones

- [ ] `JuntaResumenFinal.tsx` → `junta/ResumenFinal.vue`

---

#### 4. Componentes UI

- [ ] `ui/button.tsx` → `ui/UiButton.vue`
  - [ ] Mantener variantes: `default`, `outline`, `ghost`
  - [ ] Props: `variant`, `size`, `disabled`

- [ ] `ui/input.tsx` → `ui/UiInput.vue`
  - [ ] Soporte para `v-model`
  - [ ] Props: `type`, `placeholder`, `disabled`, `required`

- [ ] `ui/label.tsx` → `ui/UiLabel.vue`

- [ ] `ui/textarea.tsx` → `ui/UiTextarea.vue`
  - [ ] Soporte para `v-model`

- [ ] `ui/checkbox.tsx` → `ui/UiCheckbox.vue`
  - [ ] Soporte para `v-model`

- [ ] `ui/select.tsx` → `ui/UiSelect.vue`
  - [ ] Componente personalizado o nativo

- [ ] `ui/dialog.tsx` → `ui/UiDialog.vue`
  - [ ] Usar `Teleport` para renderizar en body
  - [ ] Soporte para `v-model:open`

---

#### 5. Contexto y Estado

- [ ] `FlujoContext.tsx` → `/stores/flujo.ts` (Pinia)
  - [ ] Migrar `useState` a `ref` en Pinia
  - [ ] Migrar funciones a `actions`
  - [ ] Crear `getters` para datos computados

```typescript
// stores/flujo.ts
import { defineStore } from 'pinia';

export const useFlujoStore = defineStore('flujo', {
  state: () => ({
    sociedades: [],
    juntas: [],
    dynamicSubSteps: []
  }),
  
  getters: {
    obtenerSociedad: (state) => (id: string) => {
      return state.sociedades.find(s => s.id === id);
    }
  },
  
  actions: {
    crearSociedad(data: Partial<SociedadData>): string {
      const nuevoId = `SOC-${Date.now()}`;
      const nuevaSociedad = {
        id: nuevoId,
        estado: 'BORRADOR',
        ...data
      };
      this.sociedades.push(nuevaSociedad);
      return nuevoId;
    },
    
    setDynamicSubSteps(subSteps: string[]) {
      this.dynamicSubSteps = subSteps;
    }
  }
});
```

---

#### 6. Composables

- [ ] Crear `useWizardNavigation.ts`

```typescript
// composables/useWizardNavigation.ts
export function useWizardNavigation(steps: Ref<WizardStep[]>) {
  const currentStepIndex = ref(0);
  const currentSubStepId = ref<string | undefined>();
  
  const currentStep = computed(() => steps.value[currentStepIndex.value]);
  const isFirstStep = computed(() => currentStepIndex.value === 0);
  const isLastStep = computed(() => currentStepIndex.value === steps.value.length - 1);
  
  const handleNext = () => {
    if (!isLastStep.value) {
      currentStepIndex.value++;
      currentSubStepId.value = undefined;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrev = () => {
    if (!isFirstStep.value) {
      currentStepIndex.value--;
      currentSubStepId.value = undefined;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleStepClick = (stepId: string) => {
    const index = steps.value.findIndex(s => s.id === stepId);
    if (index !== -1 && index <= currentStepIndex.value) {
      currentStepIndex.value = index;
      currentSubStepId.value = undefined;
    }
  };
  
  return {
    currentStepIndex,
    currentSubStepId,
    currentStep,
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleStepClick
  };
}
```

- [ ] Crear `useFormData.ts`

```typescript
// composables/useFormData.ts
export function useFormData<T>(initialData: T) {
  const formData = ref<T>(initialData);
  const savedFormData = ref<T>(initialData);
  
  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    let current = formData.value;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  };
  
  const save = () => {
    savedFormData.value = JSON.parse(JSON.stringify(formData.value));
  };
  
  const reset = () => {
    formData.value = JSON.parse(JSON.stringify(savedFormData.value));
  };
  
  return {
    formData,
    updateField,
    save,
    reset
  };
}
```

---

#### 7. Estilos

- [ ] Migrar `/styles/globals.css` a Nuxt
  - [ ] Mover a `/assets/css/main.css`
  - [ ] Importar en `nuxt.config.ts`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css']
});
```

- [ ] Verificar Tailwind CSS config
  - [ ] Instalar `@nuxtjs/tailwindcss`
  - [ ] Migrar `tailwind.config.js` si existe

---

#### 8. Routing

- [ ] Crear páginas en `/pages`

```
/pages/
  sociedades/
    crear.vue      → Llama a <WizardLayout> con configSociedad
    editar/[id].vue → Llama a <WizardLayout> en modo EDITAR
  juntas/
    crear.vue      → Llama a <WizardLayout> con configJunta
    editar/[id].vue → Llama a <WizardLayout> en modo EDITAR
```

Ejemplo `/pages/sociedades/crear.vue`:

```vue
<template>
  <WizardLayout :config="sociedadConfig" />
</template>

<script setup lang="ts">
import { sociedadSteps } from '~/data/flujoSteps';
import { Building2 } from 'lucide-vue-next';

const router = useRouter();
const flujoStore = useFlujoStore();

const sociedadConfig = {
  title: 'Crear Nueva Sociedad',
  icon: Building2,
  steps: sociedadSteps,
  modo: 'CREAR',
  onBack: () => router.push('/sociedades'),
  onComplete: (registroId: string) => {
    router.push(`/sociedades/${registroId}`);
  }
};
</script>
```

---

#### 9. Testing

- [ ] Migrar tests a Vitest
- [ ] Crear tests para composables
- [ ] Tests de componentes con `@vue/test-utils`

---

#### 10. Iconos

- [ ] Migrar de `lucide-react` a `lucide-vue-next`

```bash
npm install lucide-vue-next
```

```vue
<script setup lang="ts">
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-vue-next';
</script>

<template>
  <ArrowLeft :size="16" />
</template>
```

---

#### 11. Toasts/Notificaciones

- [ ] Migrar `sonner` a `@nuxtjs/toast` o `vue-toastification`

```bash
npm install vue-toastification@next
```

```typescript
// plugins/toast.ts
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast);
});
```

```vue
<script setup lang="ts">
import { useToast } from 'vue-toastification';

const toast = useToast();

const handleSave = () => {
  toast.success('Cambios guardados correctamente');
};
</script>
```

---

### 📊 Tabla de Equivalencias React → Vue 3

| React | Vue 3 Composition API |
|-------|----------------------|
| `useState(value)` | `ref(value)` |
| `useEffect(() => {}, [])` | `onMounted(() => {})` |
| `useEffect(() => {}, [dep])` | `watch(dep, () => {})` |
| `useContext` | `inject/provide` o Pinia |
| `useMemo` | `computed` |
| `useCallback` | `computed` (para funciones) |
| `props.onChange` | `emit('update:modelValue', value)` |
| `<>{children}</>` | `<slot />` |
| `className` | `class` |
| `style={{ ... }}` | `:style="{ ... }"` |
| `onClick={fn}` | `@click="fn"` |
| `{condition && <Component />}` | `<Component v-if="condition" />` |
| `{items.map(item => ...)}` | `<div v-for="item in items">` |

---

### 🎯 Prioridades de Migración

#### Fase 1: Infraestructura (Semana 1)
1. ✅ Configurar Nuxt 4
2. ✅ Migrar estilos globales
3. ✅ Crear store Pinia
4. ✅ Crear composables base

#### Fase 2: Componentes UI (Semana 2)
5. ✅ Migrar Button, Input, Label
6. ✅ Migrar Checkbox, Select, Textarea
7. ✅ Migrar Dialog, Alert

#### Fase 3: Layout del Wizard (Semana 3)
8. ✅ Migrar WizardLayout
9. ✅ Migrar WizardSidebar
10. ✅ Migrar WizardHeader y Footer

#### Fase 4: Pasos de Sociedades (Semana 4-5)
11. ✅ Migrar 10 pasos de Sociedades

#### Fase 5: Pasos de Juntas (Semana 6-7)
12. ✅ Migrar 6 pasos de Juntas
13. ✅ Migrar sub-steps dinámicos

#### Fase 6: Testing y Refinamiento (Semana 8)
14. ✅ Tests unitarios
15. ✅ Tests de integración
16. ✅ Optimización de rendimiento

---

## 📚 REFERENCIAS Y RECURSOS

### Documentación Oficial

- **Nuxt 4**: https://nuxt.com/docs
- **Vue 3**: https://vuejs.org/guide
- **Pinia**: https://pinia.vuejs.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn-vue**: https://www.shadcn-vue.com

### Archivos Relacionados

- `/DOCS_VISUAL_DESCARGA_DOCUMENTOS_JUNTAS.md` - Documentación del último paso
- `/DOCS_COMPLETA_REPOSITORIO_FINAL.md` - Sistema completo de repositorio
- `/DOCS_SISTEMA_ADMIN_USUARIOS.md` - Sistema de administración

### Tipografías

- **Gabarito**: https://fonts.google.com/specimen/Gabarito
- **Manrope**: https://fonts.google.com/specimen/Manrope

---

## 🎉 CONCLUSIÓN

Este documento proporciona una **documentación visual completa y exhaustiva** de los flujos de creación de Sociedades y Juntas en PROBO, incluyendo:

✅ **Anatomía visual completa** de cada paso
✅ **Código exacto** de componentes React
✅ **Sistema de tokens CSS** PROBO
✅ **Componentes shadcn/ui** utilizados
✅ **Clases de Tailwind** aplicadas
✅ **Interacciones del usuario** documentadas
✅ **Estados visuales** detallados
✅ **Checklist completo** para migración a Nuxt 4

Esta documentación permitirá **replicar perfectamente** la funcionalidad visual en Nuxt 4 o cualquier otro framework, manteniendo la consistencia del diseño PROBO.

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
**Autor:** Sistema PROBO
