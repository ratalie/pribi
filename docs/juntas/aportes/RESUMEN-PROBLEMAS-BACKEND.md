# 🐛 RESUMEN: Problemas de Votaciones - Preguntas para Backend

## 📋 Problema Principal: Error 422 al crear item

### **Request enviado:**
```json
PUT /api/v2/society-profile/5/register-assembly/2/votes

{
  "contexto": "APORTES_DINERARIOS",
  "items": [{
    "accion": "add",
    "id": "4d52510c-e6a9-4e8b-9646-78d768a11895",
    "orden": 0,
    "label": "Se aprueba el aumento de capital POR S/500.00 soles...",
    "descripción": "Votación sobre la aprobación de los aportes dinerarios propuestos",
    "tipoAprobacion": "APROBADO_POR_TODOS",
    "votos": []  // ❌ Backend rechaza esto
  }]
}
```

### **Error del backend:**
```json
{
  "success": false,
  "message": "Error de validación",
  "data": {
    "items.0.votos": "Array must contain at least 1 element(s)"
  },
  "code": 422
}
```

---

## ❓ PREGUNTA CRÍTICA PARA EL BACKEND

**Cuando se crea un item con `accion: "add"` y `tipoAprobacion: "APROBADO_POR_TODOS"` (unanimidad):**

### **¿Qué debe hacer el frontend?**

**Opción A:** No enviar el campo `votos` (omitir el campo)
```json
{
  "accion": "add",
  "tipoAprobacion": "APROBADO_POR_TODOS"
  // Sin campo votos
}
```

**Opción B:** Enviar `votos: []` y el backend debe aceptarlo para unanimidad
```json
{
  "accion": "add",
  "tipoAprobacion": "APROBADO_POR_TODOS",
  "votos": []  // Backend debe aceptar vacío para unanimidad
}
```

**Opción C:** Enviar al menos 1 voto dummy (no tiene sentido para unanimidad)
```json
{
  "accion": "add",
  "tipoAprobacion": "APROBADO_POR_TODOS",
  "votos": [{ ... }]  // ¿Obligatorio?
}
```

---

## 📝 Archivos Modificados en Frontend

1. **`app/core/hexag/juntas/infrastructure/mappers/vote.mapper.ts`**
   - Mapper que convierte Entity → DTO
   - Actualmente NO envía `votos` si es unanimidad y está vacío

2. **`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts`**
   - `addVoteItem()`: Crea item cuando sesión existe pero `items: []`
   - Actualmente NO envía `votos` si es unanimidad

3. **`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`**
   - Controller que orquesta la lógica
   - Carga asistentes, participantes, contribuciones
   - Maneja creación de item cuando `items: []`

4. **`app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario/votacion.vue`**
   - Página principal de votación
   - Pasa props a componentes hijos

5. **`app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue`**
   - Componente que maneja unanimidad/mayoría
   - Extrae valores de computed si es necesario

6. **`app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MayoriaVotacion.vue`**
   - Componente que muestra tabla de votación
   - Recibe `votantes` como prop

---

## 🔍 Logs Agregados para Debug

### **En `useVotacionController.ts`:**
- `[DEBUG][VotacionController] Cargando asistentes...`
- `[DEBUG][VotacionController] Asistentes cargados:`
- `[DEBUG][VotacionController] Asistentes que asistieron:`
- `[DEBUG][VotacionController] Cargando participantes...`
- `[DEBUG][VotacionController] Participantes cargados:`
- `[DEBUG][VotacionController] Cargando contribuciones...`
- `[DEBUG][VotacionController] Contribuciones cargadas:`
- `[DEBUG][VotacionController] Votantes filtrados:`
- `[DEBUG][VotacionController] Sesión existe pero sin items, creando item...`
- `[DEBUG][VotacionController] Estado final después de loadData:`

### **En `useVotacionStore.ts`:**
- `[Store][Votacion] Agregando item con payload:`
- `[Store][Votacion] Creando sesión con item:`

### **En `vote.http.repository.ts`:**
- `[Repository][VoteHttp] updateVoteSession() payload completo:`
- `[Repository][VoteHttp] createVoteSession() body:`

### **En `MayoriaVotacion.vue`:**
- `[MayoriaVotacion] Props recibidos (raw):`
- `[MayoriaVotacion] Votantes extraídos del computed:`
- `[MayoriaVotacion] Cantidad de votantes:`
- `[MayoriaVotacion] Votante X:`

---

## ✅ Cambios Realizados

1. ✅ Default cambiado a `APROBADO_POR_TODOS` (unanimidad)
2. ✅ `addVoteItem()` NO envía `votos` si es unanimidad
3. ✅ Mapper NO envía `votos` si es unanimidad y está vacío
4. ✅ Props corregidas en `MetodoVotacio` y `MayoriaVotacion`
5. ✅ Logs agregados en todos los puntos críticos
6. ✅ `cambiarTipoAprobacion` ahora es async y crea item si no existe

---

## 🚨 Problemas Pendientes

1. **Backend rechaza `votos: []`** - Necesito confirmación de qué hacer
2. **Accionistas no se muestran** - Puede ser problema de props (corregido)
3. **Cambiar unanimidad/mayoría no funciona** - Puede ser porque no hay item (corregido)

---

## 📞 Próximos Pasos

1. **Backend debe confirmar:** ¿Qué hacer con `votos` cuando es unanimidad?
2. **Probar con los nuevos logs** para ver dónde falla
3. **Verificar que los accionistas se muestren** con las correcciones de props

