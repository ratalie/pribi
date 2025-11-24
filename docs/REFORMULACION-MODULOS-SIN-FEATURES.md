# 🔄 REFORMULACIÓN: Módulos Sin Features

**Fecha:** Enero 2025  
**Objetivo:** Mover "Espacios de Trabajo" y "Chat IA" a módulos principales

---

## 🎯 CAMBIO CONCEPTUAL

### ❌ ANTES (Con Features):

```
Registros
Operaciones
Storage
Features
  ├── Chat IA
  └── Espacios de Trabajo
```

### ✅ AHORA (Sin Features):

```
Registros
Operaciones
Storage
Espacios de Trabajo (módulo principal)
Chat IA (módulo principal)
```

**Razón:** Ya no hay "features", todo es parte de la app como módulos principales.

---

## 📋 ESTRUCTURA FINAL DE MÓDULOS

### Módulos Principales (5):

1. **Registros**
   - Sociedades
   - Sucursales

2. **Operaciones**
   - Junta de Accionistas
   - Directorio

3. **Storage**
   - Almacén
   - Documentos Generados

4. **Espacios de Trabajo** ← Módulo principal (NO features)
   - Dashboard
   - Crear
   - Historial

5. **Chat IA** ← Módulo principal (NO features)
   - Iniciar Chat

---

## 🔄 CAMBIOS EN RUTAS

### Antes:

```
/features/espacios-trabajo/dashboard
/features/espacios-trabajo/crear
/features/espacios-trabajo/espacios
/features/chat-ia
```

### Ahora:

```
/espacios-trabajo/dashboard
/espacios-trabajo/crear
/espacios-trabajo/espacios
/chat-ia
```

---

## 📁 CAMBIOS EN ESTRUCTURA DE ARCHIVOS

### Mover Archivos:

```
app/pages/features/espacios-trabajo/
  → app/pages/espacios-trabajo/

app/pages/features/chat-ia.vue
  → app/pages/chat-ia.vue
```

---

## 🎨 IMPLICACIONES EN SIDEBAR

### Cambios en Navigation:

**Antes:**
```typescript
{
  id: "espacios-trabajo",
  title: "Espacios de Trabajo",
  items: [
    { href: "/features/espacios-trabajo/dashboard" },
    { href: "/features/espacios-trabajo/crear" },
  ]
}
```

**Ahora:**
```typescript
{
  id: "espacios-trabajo",
  title: "Espacios de Trabajo",
  items: [
    { href: "/espacios-trabajo/dashboard" },
    { href: "/espacios-trabajo/crear" },
  ]
}
```

### Estructura del Sidebar:

**Nivel 1: Secciones Principales**
- Registros
- Operaciones
- Storage
- Espacios de Trabajo ← Sección principal
- Chat IA ← Sección principal

**NO hay sección "Features"**

---

## ✅ CHECKLIST DE CAMBIOS

### Archivos a Mover:
- [ ] `app/pages/features/espacios-trabajo/` → `app/pages/espacios-trabajo/`
- [ ] `app/pages/features/chat-ia.vue` → `app/pages/chat-ia.vue`

### Archivos a Actualizar:
- [ ] `app/config/navigation.ts` - Actualizar rutas y estructura
- [ ] `app/types/modules.ts` - Actualizar rutas
- [ ] `app/core/shared/mappers/permissions.mapper.ts` - Actualizar mapeo
- [ ] Documentación - Actualizar todas las referencias

### Archivos a Eliminar:
- [ ] `app/pages/features/` (carpeta vacía después de mover)

---

## 📝 ACTUALIZACIÓN DE DOCUMENTACIÓN

### Documentos a Actualizar:
- [ ] `docs/GESTION-FINAL-MODULOS-PERMISOS.md`
- [ ] `docs/MENSAJE-BACKEND-MODULOS-PERMISOS.md`
- [ ] `docs/MAPEO-COMPLETO-MODULOS-ACCIONES.md`
- [ ] `docs/RUTAS-FINALES-CONSOLIDADAS.md`

---

**¿Listo para implementar?** 🚀


