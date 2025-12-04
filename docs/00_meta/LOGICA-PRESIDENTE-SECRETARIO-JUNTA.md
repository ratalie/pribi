# 📋 LÓGICA: Presidente y Secretario de la Junta

**Fecha**: Diciembre 4, 2024  
**Contexto**: Paso 3 - Instalación de la Junta

---

## 🎯 FLUJO COMPLETO

### **ORIGEN: Directorio de la Empresa**

El presidente y secretario de una junta **PRIMERO se configura en el Directorio** de la empresa.

---

## 📊 TIPOS DE SOCIEDADES

### **1. S.A. y S.A.A.**
- ✅ **Directorio OBLIGATORIO**
- Siempre tienen directorio configurado

### **2. S.A.C.**
- ⚠️ **Directorio OPCIONAL**
- Puede o no tener directorio

### **3. Otras sociedades**
- ❌ **NO tienen directorio**

---

## 🏛️ CONFIGURACIÓN EN EL DIRECTORIO

### **PRESIDENTE DE LA JUNTA:**

En el Paso 5: Directorio, se configura:

**Pregunta:** "¿El presidente del directorio preside las juntas de accionistas?"

```typescript
if (directorio.presidentePreside === true) {
  // ✅ El presidente del directorio preside la junta
  // → En Instalación: Input READONLY con nombre del presidente del directorio
} else {
  // ❌ El presidente del directorio NO preside la junta
  // → En Instalación: SELECTOR de asistentes presentes
}
```

### **SECRETARIO DE LA JUNTA:**

En el Paso 5: Directorio, se configura:

**Pregunta:** "¿Quién ejercerá la secretaría de las juntas de accionistas?"

**Opciones:**
1. **Gerente General**
2. **La junta lo designa**

```typescript
if (directorio.secretarioAsignado === true) {
  // ✅ El gerente general es el secretario
  // → En Instalación: Input READONLY con nombre del gerente general
} else {
  // ❌ La junta lo designa
  // → En Instalación: SELECTOR de asistentes presentes
}
```

---

## 🎯 LÓGICA EN INSTALACIÓN DE LA JUNTA

### **CASO A: Sociedad CON Directorio**

#### **Presidente:**
```typescript
if (snapshot.directory.presidentePreside === true && snapshot.directory.presidenteId) {
  // READONLY: Presidente del Directorio
  mode = "readonly";
  nombre = snapshot.presidenteDirectorio.persona.nombreCompleto;
  presidenteId = snapshot.directory.presidenteId;
} else {
  // SELECTOR: De asistentes presentes
  mode = "selector";
  options = asistentesPresentes; // Accionistas + Representantes que asistieron
}
```

#### **Secretario:**
```typescript
if (snapshot.directory.secretarioAsignado === true && snapshot.gerenteGeneral) {
  // READONLY: Gerente General
  mode = "readonly";
  nombre = snapshot.gerenteGeneral.persona.nombreCompleto;
  secretarioId = snapshot.gerenteGeneral.id;
} else {
  // SELECTOR: De asistentes presentes
  mode = "selector";
  options = asistentesPresentes; // Accionistas + Representantes que asistieron
}
```

### **CASO B: Sociedad SIN Directorio**

```typescript
// Presidente: SELECTOR de asistentes
mode = "selector";
options = asistentesPresentes;

// Secretario: SELECTOR de asistentes
mode = "selector";
options = asistentesPresentes;
```

---

## 🔄 CAMBIO DE ASISTENCIA (Switch SI/NO)

### **Si marca "NO ASISTIÓ":**

```typescript
if (presidenteAsistio === false) {
  // SIEMPRE mostrar SELECTOR de reemplazo
  // Sin importar si es READONLY normalmente
  mode = "selector";
  options = asistentesPresentes;
  label = "Seleccionar reemplazo";
}
```

**Lo mismo aplica para Secretario.**

---

## 📦 DATOS DEL SNAPSHOT

### **Snapshot incluye:**

```typescript
{
  directory: {
    presidenteId: "uuid",           // ← ID del director que es presidente
    presidentePreside: true/false,  // ← Si preside las juntas
    secretarioAsignado: true/false, // ← Si gerente es secretario
  },
  directors: [...],                 // ← Lista de directores
  attorneys: [...],                 // ← Lista de apoderados (incluye gerente)
  shareholders: [...],              // ← Lista de accionistas
}
```

### **Getters del Snapshot Store:**

```typescript
snapshotStore.presidenteDirectorio  // Director que es presidente
snapshotStore.directores            // Array de directores
snapshotStore.snapshot.attorneys    // Array de attorneys (gerente)
```

---

## 🎯 VALIDACIONES

### **Al hacer click en "Siguiente":**

```typescript
// 1. Validar que haya presidente
if (!presidenteId) {
  throw new Error('Debe designar un presidente de la junta');
}

// 2. Validar que haya secretario
if (!secretarioId) {
  throw new Error('Debe designar un secretario de la junta');
}

// 3. Guardar en backend
await meetingDetailsStore.updateMeetingDetails({
  presidenteId,
  secretarioId,
  presidenteAsistio,
  secretarioAsistio,
});
```

---

## 📝 ENDPOINTS

```typescript
// Obtener snapshot (incluye directorio, directores, attorneys)
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete

// Guardar presidente y secretario
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
{
  presidenteId: "uuid",
  secretarioId: "uuid",
  presidenteAsistio: true,
  secretarioAsistio: true,
}
```

---

## ✅ RESUMEN

1. **Directorio configura** quién preside y quién es secretario
2. **Snapshot trae** los datos (presidente, gerente, directores, attorneys)
3. **Instalación muestra** readonly o selector según configuración
4. **Switch permite** cambiar si asistió o no
5. **Si no asistió**, siempre selector de reemplazo
6. **Guardar** presidenteId y secretarioId en meeting-details

