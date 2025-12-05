# 📚 CATÁLOGO COMPLETO DE COMPONENTES - REGISTRO DE SOCIEDADES

> **Propósito:** Documentar TODOS los componentes reutilizables de cada paso del flujo de Registro de Sociedades.
> 
> **Fecha:** Diciembre 4, 2025
> 
> **Para:** Implementación del paso de Instalación de Juntas

---

## 📋 TABLA DE CONTENIDOS

1. [Paso 1: Datos de la Sociedad](#paso-1-datos-de-la-sociedad)
2. [Paso 2: Acciones (Capital y Clases)](#paso-2-acciones-capital-y-clases)
3. [Paso 3: Accionistas](#paso-3-accionistas)
4. [Paso 4: Asignación de Acciones](#paso-4-asignación-de-acciones)
5. [Paso 5: Directorio](#paso-5-directorio)
6. [Paso 6: Registro de Apoderados](#paso-6-registro-de-apoderados)
7. [Paso 7: Quórums y Mayorías](#paso-7-quórums-y-mayorías)
8. [Paso 8: Régimen de Poderes](#paso-8-régimen-de-poderes)
9. [Catálogo Global de Componentes](#catálogo-global-de-componentes)

---

## 🎯 PASO 1: DATOS DE LA SOCIEDAD

### 📁 Ubicación
```
app/pages/registros/sociedades/[id]/datos-sociedad.vue
app/core/presentation/registros/sociedades/pasos/datos-sociedad/DatosSociedadForm.vue
```

### 🧩 Componentes Utilizados

#### **Inputs (Shadcn + Zod)**
- `TextInputZod` - Input de texto con validación
- `SelectInputZod` - Select con validación
- `SearchInputZod` - Input con botón de búsqueda
- `DateInputZod` - Selector de fecha

#### **Layout**
- `CardTitle` - Título de sección con descripción
- `Form` (vee-validate) - Formulario con validación

#### **UI**
- `Button` - Botón de guardar/restablecer

### 📊 Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ 📄 Datos principales                                    │
│ Complete todos los datos requeridos.                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────────┐  ┌──────────────────┐            │
│ │ Número de RUC 🔍 │  │ Tipo de sociedad │            │
│ │ [12345678901]    │  │ [S.A.C.      ▼] │            │
│ └──────────────────┘  └──────────────────┘            │
│                                                         │
│ ┌──────────────────┐  ┌──────────────────┐            │
│ │ Razón social     │  │ Nombre comercial │            │
│ │ [Mi Sociedad]    │  │ [Comercial X]    │            │
│ └──────────────────┘  └──────────────────┘            │
│                                                         │
│ ┌──────────────────┐  ┌──────────────────┐            │
│ │ Dirección        │  │ Distrito         │            │
│ └──────────────────┘  └──────────────────┘            │
│                                                         │
│                 [Restablecer]  [Guardar cambios] ✅    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO 2: ACCIONES (CAPITAL Y CLASES)

### 📁 Ubicación
```
app/pages/registros/sociedades/[id]/acciones.vue
app/core/presentation/registros/sociedades/pasos/acciones/AccionesManager.vue
```

### 🧩 Componentes Utilizados

#### **Cards**
- `CardTitle` - Título con acciones
- `OutLineCard` - Card con borde para métricas
- `SimpleCard` - Card simple

#### **Buttons**
- `BaseButton` - Botón con ícono (Valor Nominal)
- `ActionButton` - Botón de acción (Agregar)

#### **Tables**
- `SimpleTable` - Tabla con dropdown de acciones
  - Columnas: Clase, Acciones Suscritas, Valor Total
  - Acciones: Editar, Eliminar (menú 3 puntos)

#### **Modals**
- `AccionesModal` - Modal para crear/editar acciones
- `ValorNominalModal` - Modal para valor nominal

### 📊 Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ 💰 Capital Social y Acciones    [Valor Nominal] [Agregar +] │
│ Complete todos los campos requeridos.                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────────────┐  ┌──────────────────────┐   │
│ │ Tipo de acciones     │  │ 💰 Valor Nominal:    │   │
│ │ Clases de Acciones   │  │ S/ 1.00              │   │
│ └──────────────────────┘  └──────────────────────┘   │
│                                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│ │ Total   │ │Cantidad │ │Capital  │                   │
│ │ 10,000  │ │   2     │ │S/ 10K   │                   │
│ └─────────┘ └─────────┘ └─────────┘                   │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Clase        │ Acciones │ Valor Total │   ⋮      │   │
│ ├─────────────────────────────────────────────────┤   │
│ │ Comunes      │ 8,000    │ S/ 8,000   │  [...]   │   │
│ │ Sin Voto     │ 2,000    │ S/ 2,000   │  [...]   │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO 3: ACCIONISTAS

### 📁 Ubicación
```
app/pages/registros/sociedades/[id]/accionistas.vue
app/core/presentation/registros/sociedades/pasos/accionistas/AccionistasManager.vue
```

### 🧩 Componentes Utilizados

#### **Cards**
- `CardTitle` - Título con botón agregar

#### **Tables**
- `AccionistasList` (Table de Shadcn)
  - `Table` - Componente tabla base
  - `TableHeader` - Header de tabla
  - `TableBody` - Body de tabla
  - `TableRow` - Fila de tabla
  - `TableCell` - Celda de tabla
  - Botones: Editar, Eliminar (inline, no dropdown)

#### **Modals**
- `AccionistaModal` - Modal para crear/editar accionista

#### **Buttons**
- `ActionButton` - Botón agregar
- `Button` - Botones de editar/eliminar

### 📊 Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ 👥 Accionistas                        [Agregar +]      │
│ Complete todos los campos requeridos.                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │Accionista   │Tipo    │Documento  │Particip│Acciones││
│ ├─────────────────────────────────────────────────────┤│
│ │Juan Pérez   │Natural │DNI·12345  │60.00%  │[Editar]││
│ │             │        │           │        │[Eliminar]│
│ ├─────────────────────────────────────────────────────┤│
│ │ABC S.A.     │Jurídica│RUC·2034567│40.00%  │[Editar]││
│ │             │        │           │        │[Eliminar]│
│ └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO 4: ASIGNACIÓN DE ACCIONES

### 📁 Ubicación
```
app/pages/registros/sociedades/[id]/asignacion-acciones.vue
app/core/presentation/registros/sociedades/pasos/asignacion-acciones/AsignacionAccionesManager.vue
```

### 🧩 Componentes Utilizados

#### **Cards**
- `CardTitle` - Título con valor nominal
- `OutLineCard` - Cards de métricas
- `SharesCard` - Card personalizado de acciones disponibles

#### **Buttons**
- `BaseButton` - Botón valor nominal
- `ActionButton` - Botón agregar

#### **Tables**
- `AsignationTable` - Tabla expandible con sub-filas
  - **Fila padre:** Accionista
  - **Fila hija:** Asignaciones por clase
  - Acciones: Editar, Eliminar (dropdown)
  - Componente: `DataTableDropDown` (menú 3 puntos)

### 📊 Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Asignación de Acciones          [Valor Nominal: S/1]│
│ Distribuye las acciones entre los accionistas.          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────┐  ┌──────────────┐                    │
│ │Clase Comunes │  │Clase Sin Voto│                    │
│ │Asignadas:8000│  │Asignadas:2000│                    │
│ │Suscritas:8000│  │Suscritas:2000│                    │
│ └──────────────┘  └──────────────┘                    │
│                                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│ │Total    │ │Total    │ │Capital  │                   │
│ │Sociedad │ │Asignadas│ │Social   │                   │
│ │10,000   │ │10,000   │ │S/ 10K   │                   │
│ └─────────┘ └─────────┘ └─────────┘                   │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Accionista    │ Particip │ Acciones │    ⋮      │   │
│ ├─────────────────────────────────────────────────┤   │
│ │▼ Juan Pérez   │ 60.00%   │ 6,000    │  [...]   │   │
│ │  ├─ Comunes   │   -      │ 5,000    │  [Editar]│   │
│ │  └─ Sin Voto  │   -      │ 1,000    │  [Elim]  │   │
│ ├─────────────────────────────────────────────────┤   │
│ │▼ ABC S.A.     │ 40.00%   │ 4,000    │  [...]   │   │
│ │  └─ Comunes   │   -      │ 4,000    │  [Editar]│   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO 5: DIRECTORIO

### 📁 Ubicación
```
app/pages/registros/sociedades/[id]/directorio.vue
app/core/presentation/registros/sociedades/pasos/directorio/DirectorioManager.vue
```

### 🧩 Componentes Utilizados

#### **Cards**
- `CardTitle` - Título con switch
- `SimpleCard` - Card contenedor

#### **Forms**
- `DirectorioConfigForm` - Formulario de configuración
- `PresidenteDirectorioForm` - Formulario de presidente

#### **Tables**
- `SimpleTable` - Tabla de directores
  - Componente: `DataTableDropDown` (menú 3 puntos)
  - Columnas: Nombre, Rol, Documento, Suplente
  - Acciones: Editar, Eliminar

#### **Modals**
- `AgregarDirectorModal` - Modal crear/editar director

#### **UI**
- `Switch` - Switch para activar/desactivar directorio
- `VDropdownComponent` - Tooltip informativo

#### **Buttons**
- `ActionButton` - Botón agregar director

### 📊 Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ 🏛️ Directorio  [ON] [?]          Complete todos los   │
│                                   campos requeridos.     │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │ CONFIGURACIÓN DEL DIRECTORIO                        ││
│ ├─────────────────────────────────────────────────────┤│
│ │ Cantidad de directores: [3 ▼]                       ││
│ │ Duración del mandato: [1 año ▼]                     ││
│ │ Fecha inicio: [01/01/2025]                          ││
│ │ Fecha fin: [31/12/2025]                             ││
│ │ Quórum mínimo: [2]                                  ││
│ │ Mayoría: [50%]                                      ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ PRESIDENTE DEL DIRECTORIO                           ││
│ ├─────────────────────────────────────────────────────┤│
│ │ ○ Lo nombra el directorio                          ││
│ │ ● Lo designa el estatuto: [Juan Pérez ▼]          ││
│ │                                                     ││
│ │ ☑ El presidente preside las juntas                ││
│ │ ☑ Tiene voto dirimente                            ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ 👥 Directores                 [Agregar Director +] ││
│ ├─────────────────────────────────────────────────────┤│
│ │Nombre      │Rol     │Documento  │Suplente│    ⋮    ││
│ ├─────────────────────────────────────────────────────┤│
│ │Juan Pérez  │Titular │DNI·12345  │   -    │  [...]  ││
│ │Ana García  │Titular │DNI·67890  │Pedro L.│  [...]  ││
│ │Luis Torres │Titular │DNI·11111  │   -    │  [...]  ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO 6: REGISTRO DE APODERADOS

### 📁 Ubicación
```
app/pages/registros/sociedades/[id]/registro-apoderados.vue
app/core/presentation/registros/sociedades/pasos/apoderados/ApoderadosManager.vue
```

### 🧩 Componentes Utilizados

#### **Cards**
- `CardTitle` - Título de sección
- `SimpleCard` - Card contenedor

#### **Tables (4 tablas diferentes)**
1. `ClasesApoderadoTable` - Tabla de clases
2. `GerenteGeneralTable` - Tabla de gerente
3. `ApoderadosTable` - Tabla de apoderados con clase
4. `OtrosApoderadosTable` - Tabla de otros apoderados

**Todas las tablas usan:**
- Componente: `DataTableDropDown` (menú 3 puntos)
- Acciones: Editar, Eliminar

#### **Modals**
- `ClaseApoderadoModal` - Modal crear/editar clase
- `GerenteGeneralModal` - Modal crear/editar gerente
- `RegistroApoderadoModal` - Modal crear/editar apoderado

#### **Buttons**
- `ActionButton` - Botones agregar

### 📊 Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ 📝 Registro de Apoderados                               │
│ Complete todos los campos requeridos.                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ CLASES DE APODERADO           [Agregar clase +]    ││
│ ├─────────────────────────────────────────────────────┤│
│ │  #  │ Nombre              │ N° Apoderados │   ⋮    ││
│ ├─────────────────────────────────────────────────────┤│
│ │  1  │ Gerente General     │      1        │ (fijo) ││
│ │  2  │ Apoderado Legal     │      2        │ [...]  ││
│ │  3  │ Otros Apoderados    │      1        │ (fijo) ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ GERENTE GENERAL              [Agregar gerente +]   ││
│ ├─────────────────────────────────────────────────────┤│
│ │Nombre      │Tipo Doc│Nro Doc    │           ⋮      ││
│ ├─────────────────────────────────────────────────────┤│
│ │Juan Pérez  │DNI     │12345678   │         [...]    ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ APODERADOS                   [Agregar apoderado +] ││
│ ├─────────────────────────────────────────────────────┤│
│ │Clase      │Nombre     │Tipo Doc│Nro Doc  │    ⋮    ││
│ ├─────────────────────────────────────────────────────┤│
│ │Apod Legal │Ana García │DNI     │87654321 │  [...]  ││
│ │Apod Legal │Luis Gómez │DNI     │11111111 │  [...]  ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ OTROS APODERADOS             [Agregar apoderado +] ││
│ ├─────────────────────────────────────────────────────┤│
│ │Nombre      │Tipo Doc│Nro Doc    │           ⋮      ││
│ ├─────────────────────────────────────────────────────┤│
│ │Pedro Silva │DNI     │22222222   │         [...]    ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO 7: QUÓRUMS Y MAYORÍAS

### 📁 Ubicación
```
app/pages/registros/sociedades/[id]/quorums-mayorias.vue
app/core/presentation/registros/sociedades/pasos/quorum/QuorumMayoriaManager.vue
```

### 🧩 Componentes Utilizados

#### **Cards**
- `CardTitle` - Título de sección
- `SimpleCard` - Card contenedor

#### **Tables**
- `QuorumTable` - Tabla personalizada de quórums
- `QuorumRowTable` - Fila de quórum con input numérico

**Estructura especial:**
- No usa `SimpleTable` ni `DataTableDropDown`
- Usa tablas personalizadas con inputs inline
- Validaciones en tiempo real

### 📊 Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Quórums y Mayorías para Adopción de Acuerdos        │
│ Ingrese los porcentajes mínimos requeridos.            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ QUÓRUM MÍNIMO PARA INSTALAR LA JUNTA               ││
│ ├─────────────────────────────────────────────────────┤│
│ │Convocatoria│Tipo Quórum  │Reglas                   ││
│ ├─────────────────────────────────────────────────────┤│
│ │Primera     │Simple       │Mínimo [50.00]% de acc.  ││
│ │Primera     │Calificado   │Mínimo [66.67]% de acc.  ││
│ │Segunda     │Simple       │Mínimo [25.00]% de acc.  ││
│ │Segunda     │Calificado   │Mínimo [33.34]% de acc.  ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ QUÓRUM MÍNIMO PARA TOMAR ACUERDOS                  ││
│ ├─────────────────────────────────────────────────────┤│
│ │Tipo Quórum │Reglas                                  ││
│ ├─────────────────────────────────────────────────────┤│
│ │Simple      │Más del [50.00]% de acc. presentes      ││
│ │Calificado  │Más del [66.67]% de acc. presentes      ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO 8: RÉGIMEN DE PODERES

### 📁 Ubicación
```
app/pages/registros/sociedades/[id]/regimen-poderes.vue
app/core/presentation/registros/sociedades/pasos/regimen-poderes/RegimenFacultadesManager.vue
```

### 🧩 Componentes Utilizados

#### **Cards**
- `CardTitle` - Título de sección
- `SimpleCard` - Card contenedor

#### **Tables**
- `SimpleTable` - Tabla de tipos de facultades
  - Componente: `DataTableDropDown` (menú 3 puntos **vertical**)
  - Acciones: Editar, Eliminar

#### **Components**
- `FacultadesApoderados` - Componente personalizado para mostrar facultades de cada apoderado
  - Lista de facultades asignadas
  - Acciones: Agregar, Eliminar

#### **Modals**
- `TipoFacultadesModal` - Modal crear/editar tipo de facultad
- `FacultadApoderadoModal` - Modal asignar facultades

#### **Buttons**
- `ActionButton` - Botones agregar

### 📊 Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ ⚖️ Régimen General de Poderes                          │
│ Complete todos los campos requeridos.                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ TIPO DE PODERES          [Agregar tipo de Poder +] ││
│ ├─────────────────────────────────────────────────────┤│
│ │ Tipo de Poder              │ Descripción │    ⋮     ││
│ ├─────────────────────────────────────────────────────┤│
│ │ Poder General              │ ...         │   [⋮]    ││
│ │ Poder Especial             │ ...         │   [⋮]    ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ PODERES DE LOS APODERADOS                          ││
│ ├─────────────────────────────────────────────────────┤│
│ │ 👤 Juan Pérez (Gerente General)                    ││
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ Facultades:                        [Agregar +]  │││
│ │ │ ✓ Poder General                      [Eliminar] │││
│ │ │ ✓ Representación legal               [Eliminar] │││
│ │ │ ✓ Firmar contratos                   [Eliminar] │││
│ │ └─────────────────────────────────────────────────┘││
│ │                                                     ││
│ │ 👤 Ana García (Apoderado Legal)                    ││
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ Facultades:                        [Agregar +]  │││
│ │ │ ✓ Poder Especial                     [Eliminar] │││
│ │ └─────────────────────────────────────────────────┘││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ FACULTADES DE OTROS APODERADOS                     ││
│ │ (Igual estructura que arriba)                       ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 CATÁLOGO GLOBAL DE COMPONENTES

### 🎨 **CARDS Y CONTENEDORES**

| Componente | Ubicación | Uso |
|-----------|-----------|-----|
| `CardTitle` | `~/components/base/cards/CardTitle.vue` | ✅ **MUY USADO** - Título de sección con descripción y slot para acciones |
| `SimpleCard` | `~/components/base/cards/SimpleCard.vue` | ✅ **MUY USADO** - Card contenedor básico |
| `OutLineCard` | `~/components/base/cards/OutLineCard.vue` | Card con borde para métricas (title + value) |
| `SharesCard` | - | Card personalizado para acciones disponibles |

---

### 📋 **TABLAS**

| Componente | Ubicación | Uso |
|-----------|-----------|-----|
| `SimpleTable` | `~/components/base/tables/simple-table/SimpleTable.vue` | ✅ **MUY USADO** - Tabla genérica con dropdown de acciones |
| `Table` (Shadcn) | `~/components/ui/table` | Tabla base de Shadcn (usado en Accionistas) |
| `DataTableDropDown` | `~/components/base/tables/DataTableDropDown.vue` | ✅ **MUY USADO** - Menú de 3 puntos (vertical/horizontal) |
| `QuorumTable` | - | Tabla personalizada para quórums |
| `QuorumRowTable` | - | Fila de quórum con input |
| `AsignationTable` | - | Tabla expandible con sub-filas |

**Estructura de `SimpleTable`:**
```vue
<SimpleTable
  :columns="columns"           // Array de columnas
  :data="data"                 // Array de filas
  title-menu="Acciones"        // Título del dropdown
  :actions="actions"           // Array de acciones
  icon-type="horizontal"       // vertical | horizontal
/>
```

**Estructura de `DataTableDropDown`:**
```vue
<DataTableDropDown
  :item-id="item.id"
  title-menu="Acciones"
  :actions="[
    {
      label: 'Editar',
      icon: 'SquarePen',
      onClick: (id: string) => handleEdit(id)
    },
    {
      label: 'Eliminar',
      icon: 'Trash2',
      onClick: (id: string) => handleDelete(id)
    }
  ]"
  icon-type="horizontal"
/>
```

---

### 🔘 **BOTONES**

| Componente | Ubicación | Uso |
|-----------|-----------|-----|
| `Button` (Shadcn) | `~/components/ui/button` | Botón base de Shadcn |
| `BaseButton` | `~/components/base/buttons/BaseButton.vue` | Botón con variantes (pill, etc.) |
| `ActionButton` | `~/components/base/buttons/composite/ActionButton.vue` | ✅ **MUY USADO** - Botón de acción con ícono |

**Estructura de `ActionButton`:**
```vue
<ActionButton
  variant="secondary"          // primary | secondary
  label="Agregar"              // Texto del botón
  size="md"                    // sm | md | lg | xl | large
  icon="Plus"                  // Nombre del ícono (lucide)
  :is-disabled="false"         // Deshabilitar
  @click="handleClick"         // Handler de click
/>
```

---

### 📝 **INPUTS (CON VALIDACIÓN ZOD)**

| Componente | Ubicación | Uso |
|-----------|-----------|-----|
| `TextInputZod` | `~/components/base/inputs/text/ui/TextInputZod.vue` | ✅ **MUY USADO** - Input de texto |
| `SelectInputZod` | `~/components/base/inputs/text/ui/SelectInputZod.vue` | ✅ **MUY USADO** - Select dropdown |
| `DateInputZod` | `~/components/base/inputs/text/ui/DateInputZod.vue` | Selector de fecha |
| `SearchInputZod` | `~/components/base/inputs/text/ui/SearchInputZod.vue` | Input con botón de búsqueda |

**Estructura de inputs:**
```vue
<TextInputZod
  v-model="form.field"
  name="field-name"
  label="Etiqueta"
  placeholder="Placeholder"
  :schema="zodSchema"          // z.string().min(1)
  :disabled="false"
/>

<SelectInputZod
  v-model="form.field"
  :options="[
    { id: 1, value: 'val1', label: 'Opción 1' },
    { id: 2, value: 'val2', label: 'Opción 2' }
  ]"
  name="field-name"
  label="Etiqueta"
  placeholder="Seleccionar"
  :schema="zodSchema"
/>
```

---

### 🎛️ **UI COMPONENTS**

| Componente | Ubicación | Uso |
|-----------|-----------|-----|
| `Switch` | `~/components/ui/switch/Switch.vue` | Switch on/off |
| `VDropdownComponent` | `~/components/VDropdownComponent.vue` | Tooltip informativo (?) |
| `Form` (vee-validate) | `vee-validate` | Formulario con validación |

---

### 🪟 **MODALS**

Cada paso tiene sus propios modals personalizados. Estructura común:
```vue
<script setup>
interface Props {
  modelValue: boolean;         // v-model para abrir/cerrar
  mode: 'create' | 'edit';     // Modo del modal
  isSaving?: boolean;           // Estado de guardado
  // ... otros props específicos
}
</script>

<template>
  <Modal v-model="modelValue" @close="$emit('close')">
    <!-- Formulario -->
    <Form @submit="handleSubmit">
      <!-- Inputs -->
    </Form>
  </Modal>
</template>
```

---

## 🎯 **PATRÓN DE IMPLEMENTACIÓN COMÚN**

### **Estructura de un Manager component:**

```vue
<script setup lang="ts">
import { computed } from "vue";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
import DataTableDropDown from "~/components/base/tables/DataTableDropDown.vue";
import MiModal from "./components/MiModal.vue";

interface Props {
  societyId: string;
  mode?: EntityModeEnum;
}

const props = defineProps<Props>();

// Store
const store = useMiStore();

// Modal state
const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');

// Acciones de la tabla
const actions = [
  {
    label: "Editar",
    icon: "SquarePen",
    onClick: (id: string) => handleEdit(id)
  },
  {
    label: "Eliminar",
    icon: "Trash2",
    onClick: (id: string) => handleDelete(id)
  }
];

// Handlers
const handleEdit = (id: string) => {
  modalMode.value = 'edit';
  // Lógica...
  isModalOpen.value = true;
};

const handleDelete = async (id: string) => {
  const confirmed = window.confirm("¿Deseas eliminar?");
  if (!confirmed) return;
  await store.delete(props.societyId, id);
};

const handleModalSubmit = async (payload) => {
  // Lógica de guardado...
  isModalOpen.value = false;
};
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle title="Mi Paso" body="Descripción">
      <template #actions>
        <ActionButton
          variant="secondary"
          label="Agregar"
          size="md"
          icon="Plus"
          @click="isModalOpen = true"
        />
      </template>
    </CardTitle>

    <SimpleTable
      :columns="columns"
      :data="store.data"
      title-menu="Acciones"
      :actions="actions"
    />

    <MiModal
      v-model="isModalOpen"
      :mode="modalMode"
      @close="isModalOpen = false"
      @submit="handleModalSubmit"
    />
  </div>
</template>
```

---

## 📋 **RESUMEN DE COMPONENTES MÁS USADOS**

### ✅ **TOP 10 COMPONENTES PARA REUTILIZAR:**

1. **`CardTitle`** - Título de sección con descripción y acciones
2. **`SimpleCard`** - Card contenedor básico
3. **`ActionButton`** - Botón de acción con ícono
4. **`SimpleTable`** - Tabla genérica con acciones
5. **`DataTableDropDown`** - Menú de 3 puntos
6. **`TextInputZod`** - Input de texto con validación
7. **`SelectInputZod`** - Select con validación
8. **`Button` (Shadcn)** - Botón base
9. **`OutLineCard`** - Card para métricas
10. **`Switch`** - Switch on/off

---

## 🎨 **PALETA DE COLORES Y ESTILOS**

### **Clases de Tailwind más usadas:**

- **Padding contenedor:** `p-14` (padding general del paso)
- **Gap entre secciones:** `gap-12` (gap entre cards)
- **Gap dentro de cards:** `gap-8` o `gap-6`
- **Bordes:** `border border-gray-200` o `border-2`
- **Background:** `bg-white`, `bg-gray-25`, `bg-gray-50`
- **Radius:** `rounded-lg`, `rounded-xl`
- **Grid:** `grid grid-cols-2 gap-6` o `grid-cols-3`

---

## ✅ **CHECKLIST PARA IMPLEMENTAR UN NUEVO PASO**

1. ☑ Usar `<div class="p-14 flex flex-col gap-12">` como contenedor principal
2. ☑ Usar `CardTitle` para el título principal
3. ☑ Usar `SimpleCard` para agrupar secciones
4. ☑ Usar `SimpleTable` para tablas con acciones
5. ☑ Usar `DataTableDropDown` para menú de 3 puntos
6. ☑ Usar `ActionButton` para botones de agregar
7. ☑ Usar `*InputZod` para inputs con validación
8. ☑ Crear un modal personalizado para crear/editar
9. ☑ Implementar actions con handlers (edit, delete)
10. ☑ Usar `useFlowLayoutNext()` para navegación

---

## 📚 **REFERENCIAS**

- **Shadcn UI:** https://ui.shadcn.com/
- **Lucide Icons:** https://lucide.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **vee-validate:** https://vee-validate.logaretm.com/
- **Zod:** https://zod.dev/

---

**📅 Última actualización:** Diciembre 4, 2025  
**👤 Creado para:** Implementación del paso de Instalación de Juntas de Accionistas




