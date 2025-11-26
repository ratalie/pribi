# 📋 Pasos 3-10: Documentación Resumida

## 🎯 Objetivo

Documentar los pasos restantes (3-10) de forma resumida, identificando patrones comunes y diferencias específicas. La mayoría siguen el mismo patrón que el **Paso 2 (Accionistas)**: Tabla + Modal con CRUD completo.

---

## 📊 Resumen de Patrones

### **Patrón 1: Tabla + Modal (Pasos 2, 3, 4, 5, 6, 8, 9)**
- **Estructura**: Similar a Accionistas
- **Componentes**: Manager → List → Modal → Form
- **Store**: Pinia con Option API
- **CRUD**: List, Create, Update, Delete

### **Patrón 2: Formulario Complejo (Paso 7)**
- **Estructura**: Similar a Datos Sociedad (Paso 1)
- **Componentes**: Form con múltiples sub-secciones
- **Store**: Opcional (puede usar composable directo)

### **Patrón 3: Vista de Solo Lectura (Paso 10)**
- **Estructura**: Componente reutilizable
- **Componentes**: Muestra todos los pasos anteriores
- **Sin Store**: Solo lectura, no necesita estado

---

## 📋 Paso 3: Acciones (Capital Social y Acciones)

**Tipo**: Tabla + Modal (múltiples registros)

**Estructura**:
```
app/core/hexag/registros/sociedades/pasos/acciones/
├── domain/          # (Pendiente de implementación completa)
├── application/     # (Pendiente de implementación completa)
└── infrastructure/ # (Pendiente de implementación completa)

app/core/presentation/registros/sociedades/pasos/acciones/
├── AccionesManager.vue
├── components/
│   ├── modals/
│   │   ├── AccionesModal.vue
│   │   └── ValorNominalModal.vue
│   └── forms/
├── composable/
│   └── useAccionesComputed.ts
└── stores/
    └── useAccionesComunesStore.ts
```

**Características Especiales**:
- ✅ Tiene **Valor Nominal** global (configuración general)
- ✅ Múltiples tipos de acciones (comunes, preferenciales, etc.)
- ✅ Cálculos automáticos (capital total, total acciones)

**Reutilización para Juntas**:
- ✅ Patrón tabla + modal
- ✅ Componentes base (Modal, Form)
- ❌ Lógica específica de acciones (no aplica a juntas)

---

## 📋 Paso 4: Asignación de Acciones

**Tipo**: Tabla + Modal (múltiples registros)

**Estructura**:
```
app/core/hexag/registros/sociedades/pasos/asignacion-acciones/
├── domain/
├── application/
└── infrastructure/

app/core/presentation/registros/sociedades/pasos/asignacion-acciones/
├── AsignacionAccionesManager.vue
├── components/
│   ├── SharesCard.vue
│   ├── tables/
│   │   └── AsignationTable.vue
│   ├── modals/
│   │   └── AsignarAccionesModal.vue
│   └── forms/
│       └── AsignaAccionesForm.vue
```

**Características Especiales**:
- ✅ Asigna acciones a accionistas
- ✅ Relación: Accionista → Tipo de Acción → Cantidad
- ✅ Validaciones: Total no puede exceder acciones disponibles

**Reutilización para Juntas**:
- ✅ Patrón tabla + modal
- ✅ Componentes base
- ❌ Lógica específica de asignación (no aplica a juntas)

---

## 📋 Paso 5: Directorio

**Tipo**: Tabla + Modal (múltiples registros)

**Estructura**:
```
app/core/presentation/registros/sociedades/pasos/directorio/
├── DirectorioManager.vue
├── components/
│   └── AgregarDirectorModal.vue
```

**Características Especiales**:
- ✅ Lista de directores
- ✅ Puede usar entidad Persona (similar a Accionistas)
- ✅ Campos específicos: cargo, fecha nombramiento, etc.

**Reutilización para Juntas**:
- ✅ **MUY REUTILIZABLE**: Juntas también tiene directores
- ✅ Entidad Persona reutilizable
- ✅ Patrón tabla + modal
- ⚠️ Campos específicos pueden variar

---

## 📋 Paso 6: Registro de Apoderados

**Tipo**: Tabla + Modal (múltiples registros)

**Estructura**:
```
app/core/hexag/registros/sociedades/pasos/apoderados/
├── domain/
├── application/
└── infrastructure/

app/core/presentation/registros/sociedades/pasos/apoderados/
├── ApoderadosManager.vue
├── components/
│   ├── ApoderadosTable.vue
│   ├── ClasesApoderadoTable.vue
│   └── modals/
│       ├── RegistroApoderadoModal.vue
│       ├── ClaseApoderadoModal.vue
│       ├── OtroApoderadoModal.vue
│       └── GerenteGeneralModal.vue
```

**Características Especiales**:
- ✅ Múltiples tipos de apoderados (Gerente General, Clases, Otros)
- ✅ Clases de apoderado (categorías)
- ✅ Puede usar entidad Persona

**Reutilización para Juntas**:
- ✅ **REUTILIZABLE**: Juntas puede tener apoderados
- ✅ Entidad Persona reutilizable
- ✅ Patrón tabla + modal
- ⚠️ Tipos específicos pueden variar

---

## 📋 Paso 7: Régimen de Poderes

**Tipo**: Formulario Complejo (1 registro con sub-secciones)

**Estructura**:
```
app/core/presentation/registros/sociedades/pasos/regimen-poderes/
├── RegimenFacultadesManager.vue
├── components/
│   ├── IrrevocableCard.vue
│   ├── PoderesApoderado.vue
│   ├── FacultadesApoderados.vue
│   ├── ReglasLimitesCard.vue
│   └── modals/
│       ├── FacultadApoderadoModal.vue
│       └── TipoFacultadesModal.vue
```

**Características Especiales**:
- ✅ Formulario complejo con múltiples secciones
- ✅ Sub-formularios (facultades, poderes, límites)
- ✅ Similar a Paso 1 (Datos Sociedad) pero más complejo

**Reutilización para Juntas**:
- ✅ Patrón de formulario complejo
- ✅ Componentes de secciones
- ❌ Lógica específica de poderes (no aplica a juntas)

---

## 📋 Paso 8: Quórums y Mayorías

**Tipo**: Tabla + Modal (múltiples registros)

**Estructura**:
```
app/core/hexag/registros/sociedades/pasos/quorum-mayorias/
├── domain/
├── application/
└── infrastructure/

app/core/presentation/registros/sociedades/pasos/quorum/
├── QuorumMayoriaManager.vue
├── components/
│   └── table/
│       ├── QuorumTable.vue
│       └── QuorumRow.vue
```

**Características Especiales**:
- ✅ Configuración de quórums para diferentes decisiones
- ✅ Porcentajes de mayoría requeridos
- ✅ Tipos de decisiones (ordinarias, extraordinarias, etc.)

**Reutilización para Juntas**:
- ✅ **MUY REUTILIZABLE**: Juntas también tiene quórums
- ✅ Lógica de cálculo de quórum
- ✅ Patrón tabla + modal
- ⚠️ Reglas específicas pueden variar

---

## 📋 Paso 9: Acuerdos Societarios

**Tipo**: Tabla + Modal (múltiples registros)

**Estructura**:
```
app/core/hexag/registros/sociedades/pasos/acuerdos-societarios/
├── domain/
├── application/
└── infrastructure/

app/core/presentation/registros/sociedades/pasos/acuerdos-societarios/
├── AcuerdosSocietariosManager.vue
└── components/
```

**Características Especiales**:
- ✅ Lista de acuerdos especiales
- ✅ Descripción, fecha, vigencia
- ✅ Patrón tabla + modal estándar

**Reutilización para Juntas**:
- ✅ **REUTILIZABLE**: Juntas puede tener acuerdos
- ✅ Patrón tabla + modal
- ⚠️ Campos específicos pueden variar

---

## 📋 Paso 10: Resumen

**Tipo**: Vista de Solo Lectura (componente reutilizable)

**Estructura**:
```
app/core/presentation/registros/sociedades/pasos/resumen/
└── ResumenManager.vue  # (Implementación básica actual)
```

**Características Especiales**:
- ✅ Muestra todos los pasos anteriores
- ✅ Vista de solo lectura
- ✅ Componente reutilizable (usado en Preview y Resumen)
- ⚠️ **PENDIENTE**: Implementación completa

**Reutilización para Juntas**:
- ✅ **MUY REUTILIZABLE**: Patrón de resumen
- ✅ Componente reutilizable
- ✅ Estructura de mostrar todos los pasos
- ⚠️ Contenido específico de cada paso

**Ideal**:
```vue
<!-- Componente reutilizable -->
<SociedadContenidoCompleto 
  :datos="formData" 
  :show-header="true" 
/>

<!-- Usado en: -->
<!-- 1. Paso 10: Resumen -->
<!-- 2. Vista Preview: VisualizarSociedad -->
```

---

## 🔄 Resumen de Reutilización por Paso

| Paso | Tipo | Reutilizable para Juntas | Notas |
|------|------|-------------------------|-------|
| **1. Datos Sociedad** | Formulario único | ⚠️ Parcial | Patrón de formulario, pero campos diferentes |
| **2. Accionistas** | Tabla + Modal | ✅ **MUY** | Entidad Persona, patrón CRUD completo |
| **3. Acciones** | Tabla + Modal | ❌ No | Lógica específica de acciones |
| **4. Asignación** | Tabla + Modal | ❌ No | Lógica específica de asignación |
| **5. Directorio** | Tabla + Modal | ✅ **MUY** | Juntas también tiene directores |
| **6. Apoderados** | Tabla + Modal | ✅ **SÍ** | Juntas puede tener apoderados |
| **7. Régimen Poderes** | Formulario complejo | ⚠️ Parcial | Patrón de formulario complejo |
| **8. Quórums** | Tabla + Modal | ✅ **MUY** | Juntas también tiene quórums |
| **9. Acuerdos** | Tabla + Modal | ✅ **SÍ** | Juntas puede tener acuerdos |
| **10. Resumen** | Vista solo lectura | ✅ **MUY** | Patrón de resumen reutilizable |

---

## 📝 Patrones Clave para Juntas

### **1. Patrón Tabla + Modal (Más Común)**
```
Manager.vue
  ├── List.vue (tabla)
  ├── Modal.vue
  │   └── Form.vue
  └── Store (Pinia Option API)
```

**Reutilizable**: ✅ Estructura completa

### **2. Patrón Formulario Único**
```
Form.vue
  ├── Secciones (CardTitle)
  └── Composable (useXxx)
```

**Reutilizable**: ✅ Estructura completa

### **3. Patrón Vista Resumen**
```
ResumenManager.vue
  └── ContenidoCompleto.vue (reutilizable)
```

**Reutilizable**: ✅ Estructura completa

---

## 🎯 Componentes Altamente Reutilizables

1. **Entidad Persona** (Paso 2)
   - ✅ 6 tipos de persona
   - ✅ Representantes
   - ✅ Usado en: Accionistas, Directores, Apoderados

2. **Store Pattern** (Paso 2)
   - ✅ Option API
   - ✅ Cache con TTL
   - ✅ CRUD completo

3. **Controller Pattern** (Paso 2)
   - ✅ ensureLoaded()
   - ✅ Gestión de ciclo de vida

4. **Componentes Base**
   - ✅ Modal, Form, Table
   - ✅ CardTitle, ActionButton
   - ✅ Inputs (Text, Date, Select)

---

**Siguiente**: Documentar flow-layout-juntas (análisis de probo-figma-ai)

