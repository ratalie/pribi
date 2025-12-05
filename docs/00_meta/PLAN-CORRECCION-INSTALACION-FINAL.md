# 📋 PLAN DE CORRECCIÓN - Vista de Instalación (Final)

**Fecha**: Diciembre 4, 2024  
**Objetivo**: Corregir vista según feedback del usuario

---

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. **Presidente y Secretario NO son el mismo componente**
**Actual**: Dos componentes separados dentro de MesaDirectivaSection  
**Debe ser**: Un componente reutilizable usado 2 veces

### 2. **Badge de la tabla está diferente**
**Verificar**: Estilos exactos de Sociedades

### 3. **Tabla falta 1 columna (Representado por)**
**Actual**: 1 columna con todo mezclado  
**Debe ser**: 2 columnas separadas
- **Columna 1**: "Requiere representante" / Nombre del representante
- **Columna 2**: Botón "+ Agregar" / Menú (⋮)

### 4. **Lógica Presidente/Secretario COMPLEJA**

#### **CASO A: Sociedad CON Directorio**

**Presidente:**
```typescript
// Del snapshot.directorio
if (directorio.presideJuntas === true) {
  // Jalar presidenteId del directorio
  presidenteId = directorio.presidenteId;
  presidenteNombre = "Nombre del directorio";
  // Input READONLY con nombre
}
```

**Secretario:**
```typescript
// Del snapshot.directorio
if (directorio.secretariaJuntas === "GERENTE_GENERAL") {
  // Jalar gerente general del snapshot
  secretarioId = snapshot.gerenteGeneral.id;
  secretarioNombre = snapshot.gerenteGeneral.nombre;
  // Input READONLY con nombre
} else if (directorio.secretariaJuntas === "JUNTA_DESIGNA") {
  // Input SELECTOR de asistentes
  secretarioId = ""; // Seleccionar de lista
}
```

#### **CASO B: Sociedad SIN Directorio**

**Presidente:**
```typescript
// Input SELECTOR de asistentes
presidenteId = ""; // Seleccionar de lista
```

**Secretario:**
```typescript
// Input SELECTOR de asistentes
secretarioId = ""; // Seleccionar de lista
```

### 5. **Backend espera (al guardar):**
```typescript
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
{
  presidenteId: "uuid",
  secretarioId: "uuid",
  presidenteAsistio: true,
  secretarioAsistio: true,
}
```

---

## ✅ PLAN DE CORRECCIÓN

### **PASO 1: Leer documentación del backend** ✅
- [x] GUIA-FRONTEND-SNAPSHOT.md
- [x] ARQUITECTURA-COMPLETA-JUNTAS.md
- [x] Entender estructura del snapshot

### **PASO 2: Corregir Tabla de Asistencia**
- [ ] Agregar columna adicional para botón/menú
- [ ] Separar "Representado por" en 2 columnas
- [ ] Verificar estilos de badges

### **PASO 3: Crear componente reutilizable PresidenteSecretarioCard**
- [ ] Props: rol, nombre, asistio, options
- [ ] Lógica: readonly vs selector
- [ ] Emits: update:asistio, update:id

### **PASO 4: Actualizar MesaDirectivaSection**
- [ ] Usar PresidenteSecretarioCard 2 veces
- [ ] Lógica para jalar datos del directorio
- [ ] Lógica para jalar gerente general

### **PASO 5: Conectar con snapshot**
- [ ] Obtener directorio del snapshot
- [ ] Obtener gerente general del snapshot
- [ ] Obtener asistentes presentes

### **PASO 6: Guardar en backend**
- [ ] Al cambiar switches → guardar en meeting-details
- [ ] Enviar presidenteId, secretarioId, presidenteAsistio, secretarioAsistio

---

## 📊 ESTRUCTURA DEL SNAPSHOT (del backend)

```typescript
{
  // Directorio (si existe)
  directorio: {
    id: "uuid",
    presidenteId: "uuid",
    presideJuntas: true,                    // ← CLAVE
    secretariaJuntas: "GERENTE_GENERAL" | "JUNTA_DESIGNA", // ← CLAVE
  },
  
  // Gerente General (si existe)
  gerenteGeneral: {
    id: "uuid",
    nombre: "Nombre Completo",
  },
  
  // Accionistas
  accionistas: [...],
}
```

---

## 🎯 LÓGICA FINAL

### **Presidente de la Junta:**

```typescript
if (snapshot.directorio && snapshot.directorio.presideJuntas) {
  // READONLY: Presidente del Directorio
  presidenteId.value = snapshot.directorio.presidenteId;
  presidenteNombre.value = getNombrePresidente(snapshot.directorio.presidenteId);
  inputType = "readonly";
} else {
  // SELECTOR: De asistentes presentes
  presidenteId.value = "";
  presidenteOptions = asistentesPresentes;
  inputType = "selector";
}
```

### **Secretario de la Junta:**

```typescript
if (snapshot.directorio) {
  if (snapshot.directorio.secretariaJuntas === "GERENTE_GENERAL") {
    // READONLY: Gerente General
    secretarioId.value = snapshot.gerenteGeneral.id;
    secretarioNombre.value = snapshot.gerenteGeneral.nombre;
    inputType = "readonly";
  } else {
    // SELECTOR: Junta lo designa
    secretarioId.value = "";
    secretarioOptions = asistentesPresentes;
    inputType = "selector";
  }
} else {
  // SIN DIRECTORIO: SELECTOR
  secretarioId.value = "";
  secretarioOptions = asistentesPresentes;
  inputType = "selector";
}
```

---

## 🚀 SIGUIENTE: Implementar correcciones

1. Leer docs del backend ✅
2. Crear plan completo ✅
3. Implementar correcciones paso a paso ⏳




