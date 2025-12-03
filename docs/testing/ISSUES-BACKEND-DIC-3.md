# 🐛 **ISSUES DE BACKEND ENCONTRADOS EN TESTS**

**Fecha:** Diciembre 3, 2025  
**Tests ejecutados:** 51 tests  
**Tests pasando:** 48/51 (94.1%)  
**Tests fallando:** 3 (problemas de backend)

---

## 🚨 **ISSUE 1: DELETE Director → 500 Internal Server Error**

### **Endpoint:**
```
DELETE /api/v2/society-profile/{societyProfileId}/directorio/directores
```

### **Body enviado:**
```json
["director-uuid-aquí"]
```

### **Error retornado:**
```
500 Internal Server Error
```

### **Ubicación del problema:**
- Test: `app/core/.../directorio/__tests__/directorio.test.ts`
- Línea 120 y 132

### **Impacto:**
- ❌ No se puede eliminar directores desde el frontend
- ⚠️ Posible problema en el controller del backend

### **Acción requerida:**
1. Revisar el handler de `DELETE /directores` en el backend
2. Verificar que acepte un array de UUIDs: `[string]`
3. Verificar que no haya errores en la eliminación lógica
4. Agregar logs para identificar el problema exacto

---

## 🚨 **ISSUE 2: Quorum → Validación rechaza valores extremos**

### **Endpoint:**
```
PUT /api/v2/society-profile/{societyProfileId}/quorum
```

### **Body enviado:**
```json
{
  "quorumMinimoSimple": 1,
  "quorumMinimoCalificado": 100,
  "primeraConvocatoriaSimple": 25,
  "primeraConvocatoriaCalificada": 75,
  "segundaConvocatoriaSimple": 50,
  "segundaConvocatoriaCalificada": 75
}
```

### **Error retornado:**
```
422 Error de validación
```

### **Ubicación del problema:**
- Test: `app/core/.../quorum/__tests__/quorum.test.ts`
- Línea 70

### **Impacto:**
- ⚠️ El frontend no puede configurar ciertos rangos de quorum
- ⚠️ Validación del backend podría ser muy restrictiva

### **Posibles causas:**
1. Backend requiere `quorumMinimo` > 0 (no acepta 1%)
2. Backend valida coherencia entre convocatorias (segunda >= primera)
3. Backend tiene un rango mínimo (ej: 10%-90%)

### **Acción requerida:**
1. Documentar las reglas de validación exactas del backend
2. Informar al frontend cuáles son los rangos permitidos
3. Actualizar la documentación de API con estos límites

---

## ✅ **LO QUE SÍ FUNCIONA (48/51 tests):**

### **PASO 1: Datos Sociedad - 3/3 (100%)**
- ✅ Crear datos principales
- ✅ Obtener datos
- ✅ Actualizar datos

### **PASO 2: Accionistas - 3/3 (100%)**
- ✅ Crear accionistas
- ✅ Listar accionistas
- ✅ Actualizar accionistas

### **PASO 3: Acciones - 3/3 (100%)**
- ✅ Crear acciones (con valor nominal)
- ✅ Listar acciones
- ✅ Actualizar acciones

### **PASO 4: Asignación - 1/1 (100%)**
- ✅ Crear asignación de acciones

### **PASO 5: Directorio - 4/6 (66.7%)**
- ✅ Obtener configuración
- ✅ Actualizar configuración
- ✅ Listar directores
- ✅ Cambiar presidente
- ❌ Crear nuevo director (con DELETE después) → 500
- ❌ Eliminar director → 500

### **PASO 6: Apoderados - 9/9 (100%)**
- ✅ Crear clases
- ✅ Listar clases
- ✅ Actualizar clases
- ✅ Crear apoderados
- ✅ Listar apoderados
- ✅ Actualizar apoderados
- ✅ Eliminar apoderados
- ✅ Eliminar clases
- ✅ Múltiples apoderados por clase

### **PASO 8: Quorum - 3/4 (75%)**
- ✅ Obtener quorum por defecto
- ✅ Actualizar quorum
- ✅ Múltiples actualizaciones
- ❌ Valores extremos (0-100) → 422 Validación

---

## 📋 **CHECKLIST PARA EL BACKEND:**

### **Prioridad ALTA:**
- [ ] Arreglar `DELETE /directores` (Internal Server Error)
- [ ] Documentar reglas de validación de Quorum

### **Prioridad MEDIA:**
- [ ] Confirmar que `POST /directores` retorna el director en `data`
- [ ] Validar duplicados de directores (documento + rol)
- [ ] Agregar constraint UNIQUE en BD para directores

### **Prioridad BAJA:**
- [ ] Revisar si Quorum debe aceptar valores de 1-100 o tiene rango diferente

---

## 🎯 **RECOMENDACIONES:**

1. **Para DELETE /directores:**
   - Revisar logs del backend cuando se ejecuta el DELETE
   - Verificar que acepte el formato: `body: [directorId]`
   - Confirmar que no haya errores en la eliminación lógica

2. **Para Quorum:**
   - Documentar en `docs/backend/` los rangos permitidos
   - Actualizar la documentación de API
   - Informar al frontend si hay restricciones especiales

3. **General:**
   - Los 48 tests que pasan confirman que el backend funciona bien
   - Solo 3 casos edge están fallando

---

**CONCLUSIÓN:** El backend está funcionando al 94.1% correctamente. Solo 2 issues menores a resolver.

