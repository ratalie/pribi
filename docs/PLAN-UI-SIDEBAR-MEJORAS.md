# 🎨 PLAN: Mejoras UI del Sidebar

**Fecha:** Enero 2025  
**Estado:** Plan de Implementación  
**Objetivo:** Mejorar la UI del sidebar según especificaciones

---

## 📋 TAREAS A IMPLEMENTAR

### a. Línea de separación entre items de primer nivel
- Agregar línea de 1px entre secciones de primer nivel
- Color: `rgba(255, 255, 255, 0.1)`

### b. Configuración de usuario
- Ocultar "Profile" del dropdown
- Ocultar "Settings" del dropdown
- Configurar por defecto: Español
- Configurar por defecto: Color claro (light)

### c. Scroll que no distorsione el contenedor
- Ajustar scrollbar para que no afecte el ancho del contenedor
- Usar scrollbar overlay o ajustar padding

### d. Iconos en items de primer nivel
- Agregar iconos a todas las secciones de primer nivel
- Mapear iconos según especificación

### e. Modo colapsable mejorado
- Cuando está contraído: solo iconos (primer y segundo nivel)
- Ancho del div colapsable: tamaño de icono + padding 8px
- Items de primer nivel aún colapsables cuando está contraído
- Items de segundo nivel: click directo a dashboard por defecto

---

## 🎯 MAPEO DE ICONOS

### 1. Registro Societario
- **Icono principal:** `Building` (edificio)
- **Sub-items:**
  - Sociedades: `Building2` (edificio modelo X)
  - Sucursales: `Building` (edificio modelo Y)

### 2. Operaciones
- **Icono principal:** `Briefcase` (maletín)
- **Corregir nombre:** "Operaciones" (no "Operaciones de Órgano de Control")
- **Sub-items:**
  - Directorio: `Users` (users juntos)
  - Junta de Accionistas: `Users2` o `Crown` (verificar)

### 3. Repositorio (Storage)
- **Icono principal:** `HardDrive` (disco duro)
- **Sub-items:**
  - Almacén: `Database` o `Archive` (base de datos, varias pizzas apiladas)
  - Documentos Generados: `FileText` (documento)

### 4. Espacios de Trabajo
- **Icono principal:** `FolderKanban` o `Briefcase` (verificar)

### 5. Chat IA
- **Icono principal:** `Bot` (chat con AI)

---

## 📝 PLAN DE IMPLEMENTACIÓN PASO A PASO

### **PASO 1: Línea de separación (a)**
**Archivo:** `app/components/ProboSidebar.vue`

**Cambios:**
- Agregar `border-bottom: 1px solid rgba(255, 255, 255, 0.1)` a `.probo-section-wrapper`
- Aplicar solo entre secciones (no en la última)

**Tiempo:** 15 minutos

---

### **PASO 2: Configuración de usuario (b)**
**Archivos:**
- `app/components/UserDropdownMenu.vue`
- `app/composables/useTheme.ts`
- `app/composables/useProboI18n.ts` o similar

**Cambios:**
1. Ocultar items "Profile" y "Settings" del dropdown
2. Configurar idioma por defecto: Español
3. Configurar tema por defecto: Light

**Tiempo:** 30 minutos

---

### **PASO 3: Scroll mejorado (c)**
**Archivo:** `app/components/ProboSidebar.vue`

**Cambios:**
- Ajustar scrollbar para que sea overlay
- O ajustar padding para compensar ancho del scrollbar
- Usar `scrollbar-gutter: stable` si es posible

**Tiempo:** 20 minutos

---

### **PASO 4: Iconos en primer nivel (d)**
**Archivos:**
- `app/config/navigation.ts`
- `app/utils/iconMapper.ts`
- `app/components/ProboSidebar.vue`

**Cambios:**
1. Agregar iconos a secciones en `navigation.ts`
2. Agregar iconos faltantes a `iconMapper.ts` (Database, HardDrive, etc.)
3. Mostrar iconos en `.probo-section-title`

**Tiempo:** 45 minutos

---

### **PASO 5: Modo colapsable mejorado (e)**
**Archivo:** `app/components/ProboSidebar.vue`

**Cambios:**
1. Crear estado para sidebar contraído
2. Cuando está contraído:
   - Ancho: `icono (16px) + padding (8px) * 2 = 32px`
   - Mostrar solo iconos
   - Items de primer nivel aún colapsables
   - Items de segundo nivel: click directo a dashboard
3. Ajustar estilos para modo contraído

**Tiempo:** 2 horas

---

## ✅ CHECKLIST

### Fase 1: Cambios Simples
- [ ] Paso 1: Línea de separación
- [ ] Paso 2: Configuración de usuario
- [ ] Paso 3: Scroll mejorado

### Fase 2: Iconos
- [ ] Paso 4: Agregar iconos a primer nivel
- [ ] Verificar todos los iconos funcionan

### Fase 3: Modo Colapsable
- [ ] Paso 5: Implementar modo colapsable mejorado
- [ ] Probar comportamiento cuando está contraído
- [ ] Verificar que items de segundo nivel naveguen correctamente

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Paso 1** (15 min) - Línea de separación
2. **Paso 2** (30 min) - Configuración de usuario
3. **Paso 3** (20 min) - Scroll mejorado
4. **Paso 4** (45 min) - Iconos
5. **Paso 5** (2 horas) - Modo colapsable

**Total estimado: ~3.5 horas**

---

## 📝 NOTAS TÉCNICAS

### Iconos a agregar a iconMapper:
- `Database` (para Almacén)
- `HardDrive` (para Repositorio)
- `Bot` (ya existe para Chat IA)
- Verificar si `FolderKanban` existe o usar `Folder`

### Modo colapsable:
- Usar `isCollapsed` prop existente
- Crear clases CSS condicionales
- Ajustar ancho dinámicamente

---

**¿Listo para empezar?** 🚀

