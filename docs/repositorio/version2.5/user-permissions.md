# Permisos de Usuario en Probo AI

## 📋 Resumen de Roles y Permisos

### 🔍 **Tipos de Roles**

1. **READ** - Solo lectura
2. **WRITE/USUARIO** - Lectura y escritura (Editor)
3. **ADMIN** - Administrador completo
4. **EXTERNO** - Usuario externo con acceso limitado

---

## 🔒 **Permisos por Rol**

### **ROL: READ**

#### ❌ **Botones/Funciones NO Disponibles:**

**En Index.vue:**

- ❌ "Crear Carpeta" (carpetas personalizadas)

**En Carpetas Personalizadas:**

- ❌ "Editar"
- ❌ "Compartir"
- ❌ "Eliminar"

**En Subcarpetas Personalizadas:**

- ❌ "Añadir Documento"
- ❌ "Crear carpeta"

**En FolderCard (menú):**

- ❌ "Editar"
- ❌ "Compartir"
- ❌ "Eliminar"
- ❌ "Agregar a carpeta personalizada"

**En FileCard:**

- ❌ Botón "Eliminar"
- ❌ Selección múltiple de archivos para linkear

#### ✅ **Funciones Disponibles:**

- ✅ Visualizar documentos
- ✅ Descargar archivos
- ✅ Navegar por carpetas
- ✅ Ver información de carpetas

---

### **ROL: WRITE/USUARIO (Editor)**

#### ✅ **Todas las Funciones Disponibles:**

- ✅ Todos los botones habilitados
- ✅ Todos los flujos habilitados
- ✅ Crear, editar, eliminar carpetas
- ✅ Subir, eliminar archivos
- ✅ Compartir carpetas
- ✅ Selección múltiple de archivos

---

### **ROL: ADMIN**

#### ✅ **Todas las Funciones Disponibles:**

- ✅ Todos los botones habilitados
- ✅ Todos los flujos habilitados
- ✅ Control total del sistema
- ✅ Gestión completa de usuarios y permisos

---

### **ROL: EXTERNO**

#### ❌ **Restricciones:**

- ❌ No puede acceder a carpetas del sistema
- ❌ Solo acceso a carpetas personalizadas compartidas
- ❌ No puede "Editar", "Compartir", "Eliminar" en carpetas compartidas
- ❌ No puede "Añadir Documentos" ni "Crear carpetas" en subcarpetas
- ❌ Mismas restricciones que READ en menús de archivos

#### ✅ **Funciones Disponibles:**

- ✅ Ver carpetas personalizadas compartidas
- ✅ Visualizar documentos en carpetas compartidas
- ✅ Descargar archivos
- ✅ Navegar por carpetas compartidas
