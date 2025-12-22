# Estructura de Carpetas: Almacén y Documentos Generados

## 📁 Estructura de Almacén

### Nivel Raíz

```
/core/
```

**Descripción**: Carpeta raíz del almacén. Se obtiene de los nodos raíz (`/nodes/root`) buscando el nodo con `name === "core"`.

**Contenido**: Todas las carpetas y archivos EXCEPTO `documentos-generados`.

**Ruta en Backend**: `/core/`

**Ruta en Frontend**: `/storage/almacen/[idSociety]` (raíz muestra contenido de `/core/`)

---

## 📄 Estructura de Documentos Generados

### Nivel 0: Raíz

```
/core/documentos-generados/
```

**Descripción**: Carpeta raíz de documentos generados. Contiene las categorías principales.

### Nivel 1: Categorías (2 carpetas)

#### 1. Operaciones

```
/core/documentos-generados/operaciones/
```

**Descripción**: Documentos generados de operaciones (juntas y directorio).

**Subcarpetas** (2):

- `directorio/` - Documentos del directorio
- `juntas-accionistas/` - Carpetas de juntas individuales

#### 2. Registros

```
/core/documentos-generados/registros/
```

**Descripción**: Documentos generados de registros (sociedades y sucursales).

**Subcarpetas** (2):

- `sociedades/` - Documentos de sociedades
- `sucursales/` - Documentos de sucursales

---

## 📊 Estructura Completa Visual

```
/core/
├── [carpetas y archivos del almacén]
└── documentos-generados/
    ├── operaciones/
    │   ├── directorio/
    │   │   └── [documentos del directorio]
    │   └── juntas-accionistas/
    │       ├── junta del 11 de diciembre del 2025/
    │       │   └── documentos juntas: 11 de diciembre del 2025/
    │       │       └── [documentos de la junta]
    │       └── junta del 15 de enero del 2026/
    │           └── documentos juntas: 15 de enero del 2026/
    │               └── [documentos de la junta]
    └── registros/
        ├── sociedades/
        │   └── [subcarpetas y documentos]
        └── sucursales/
            └── [subcarpetas y documentos]
```

---

## 🗂️ Detalle de Carpetas por Categoría

### Operaciones (2 carpetas)

#### 1. Directorio

- **Ruta Backend**: `/core/documentos-generados/operaciones/directorio/`
- **Ruta Frontend**: `/storage/documentos-generados/[idSociety]/operaciones/directorio`
- **Contenido**: Documentos relacionados con el directorio (nombramientos, actas, renuncias, etc.)

#### 2. Juntas de Accionistas

- **Ruta Backend**: `/core/documentos-generados/operaciones/juntas-accionistas/`
- **Ruta Frontend**: `/storage/documentos-generados/[idSociety]/operaciones/junta-accionistas`
- **Contenido**: Carpetas de juntas individuales
  - Cada carpeta de junta tiene nombre: `"junta del {fecha}"` (ej: "junta del 11 de diciembre del 2025")
  - Dentro de cada carpeta de junta hay:
    - Carpetas de documentos: `"documentos juntas: {fecha}"`
    - Documentos directos

### Registros (2 carpetas)

#### 1. Sociedades

- **Ruta Backend**: `/core/documentos-generados/registros/sociedades/`
- **Ruta Frontend**: `/storage/documentos-generados/[idSociety]/registros/sociedades`
- **Contenido**: Documentos generados de sociedades
  - Subcarpetas por tipo: SpA, Ltda, etc.
  - Documentos: Escrituras, modificaciones, etc.

#### 2. Sucursales

- **Ruta Backend**: `/core/documentos-generados/registros/sucursales/`
- **Ruta Frontend**: `/storage/documentos-generados/[idSociety]/registros/sucursales`
- **Contenido**: Documentos generados de sucursales
  - Subcarpetas por sucursal: Sucursal Concepción, Sucursal Valparaíso, etc.
  - Documentos: Inscripciones, modificaciones, etc.

---

## 🔍 Resumen de Carpetas por Defecto

### Total: 4 carpetas principales

1. **Operaciones** (2 subcarpetas):

   - `directorio/`
   - `juntas-accionistas/`

2. **Registros** (2 subcarpetas):
   - `sociedades/`
   - `sucursales/`

---

## 📝 Notas Importantes

### Almacén

- La raíz de Almacén muestra el contenido de `/core/` EXCEPTO `documentos-generados`
- Las carpetas se crean dentro de `/core/`
- La carpeta `/core/` se obtiene de los nodos raíz

### Documentos Generados

- La estructura está en `/core/documentos-generados/`
- Tiene 2 categorías principales: `operaciones` y `registros`
- Cada categoría tiene 2 subcarpetas
- Las carpetas de juntas se crean dinámicamente cuando se genera una junta
- Los nombres de las carpetas de juntas siguen el formato: `"junta del {fecha}"`

### Rutas Frontend Actuales vs Esperadas

**Actual**:

- Documentos Generados: `/storage/documentos-generados/[idSociety]/operaciones/[...path]`
- Almacén: `/storage/almacen/[idSociety]/[...path]`

**Esperado** (para unificar):

- Documentos Generados: `/storage/documentos-generados/[idSociety]/[...path]`
- Almacén: `/storage/almacen/[idSociety]/[...path]` (ya está correcto)

---

## 🎯 Estructura Esperada en la Vista

### Raíz de Documentos Generados

Cuando el usuario está en `/storage/documentos-generados/[idSociety]`, debería ver:

```
Documentos Generados
├── Operaciones (carpeta)
└── Registros (carpeta)
```

### Dentro de Operaciones

Cuando el usuario está en `/storage/documentos-generados/[idSociety]/operaciones`, debería ver:

```
Documentos Generados > Operaciones
├── Directorio (carpeta)
└── Juntas de Accionistas (carpeta)
```

### Dentro de Registros

Cuando el usuario está en `/storage/documentos-generados/[idSociety]/registros`, debería ver:

```
Documentos Generados > Registros
├── Sociedades (carpeta)
└── Sucursales (carpeta)
```

---

## 🔧 Implementación Actual vs Esperada

### Implementación Actual

- ❌ Solo muestra `operaciones` (falta `registros`)
- ❌ Ruta incluye `/operaciones/` en el path
- ❌ No tiene el mismo diseño visual que Almacén
- ❌ Breadcrumb no funciona correctamente

### Implementación Esperada

- ✅ Mostrar `operaciones` y `registros` en la raíz
- ✅ Ruta sin `/operaciones/` en el path base
- ✅ Mismo diseño visual que Almacén
- ✅ Breadcrumb funcionando correctamente
- ✅ Navegación unificada desde Almacén y Sidebar

