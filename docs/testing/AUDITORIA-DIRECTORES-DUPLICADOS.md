# 🔍 **AUDITORÍA: PROBLEMA DE DIRECTORES DUPLICADOS**

## 🚨 **PROBLEMA REPORTADO**

**Usuario reporta:** Al actualizar directores, se estaban creando dos veces.

**Fecha:** Diciembre 3, 2025

---

## 📊 **ANÁLISIS DEL CÓDIGO FRONTEND**

### **1. Método `create()` en Repository**

```typescript
// app/core/.../director.http.repository.ts (líneas 115-189)

async create(societyProfileId: string, payload: DirectorDTO): Promise<DirectorConfig> {
  // 1️⃣ Hace POST al backend
  const response = await $fetch<ApiResponse<any>>(url, config);
  
  // 2️⃣ Si el backend devuelve data, retorna el director
  if (response?.data) {
    const director = DirectorMapper.toDomain(response.data);
    if (director) {
      return director;  // ✅ CORRECTO
    }
  }
  
  // 3️⃣ Si NO devuelve data, hace GET (fallback)
  const list = await this.get(societyProfileId);  // ⚠️ PROBLEMA POTENCIAL
  
  // 4️⃣ Busca por documento y rol
  let fallback = list.find(
    (item) =>
      item.persona.numeroDocumento === payload.persona.numeroDocumento &&
      item.rolDirector === payload.rolDirector
  );
  
  // 5️⃣ Si no lo encuentra, usa el ÚLTIMO de la lista
  if (!fallback && list.length > 0) {
    fallback = list[list.length - 1];  // ⚠️ PELIGROSO
  }
  
  return fallback;
}
```

---

## ⚠️ **PROBLEMAS IDENTIFICADOS**

### **PROBLEMA 1: Race Condition en Fallback**

**¿Qué pasa?**

Si el backend NO devuelve `data` en la respuesta del POST:

1. El frontend hace un `GET` para listar todos los directores
2. Busca el director por `numeroDocumento` y `rolDirector`
3. Si **NO lo encuentra**, usa el **último de la lista**

**Escenario problemático:**

```typescript
// Usuario hace click rápido dos veces

// Request 1: POST director A
//   - Backend lo crea pero NO devuelve data
//   - Frontend hace GET → [director A]
//   - Retorna director A ✅

// Request 2: POST director A (duplicado)
//   - Backend lo crea de nuevo (si no valida duplicados)
//   - Frontend hace GET → [director A (1), director A (2)]
//   - Busca por documento → ¡Encuentra DOS directores!
//   - Usa el último → director A (2) ✅
//   - RESULTADO: 2 directores idénticos en la BD
```

---

### **PROBLEMA 2: Múltiples Llamadas desde UI**

**¿Dónde se llama `create()`?**

```typescript
// app/core/presentation/.../AgregarDirectorModal.vue (línea 196)

savedDirector = await create(directorDTO);
```

```typescript
// app/core/presentation/.../useDirectores.ts (línea 62-63)

const created = await createUseCase.execute(id, payload);
directores.value.push(created);  // ← Agrega al array local
```

**Escenario problemático:**

1. Usuario hace **doble click** en "Guardar"
2. Se ejecutan **2 llamadas simultáneas** a `create()`
3. Backend crea **2 directores** si no valida duplicados
4. Frontend agrega **2 veces** al array local

---

### **PROBLEMA 3: Sin Validación de Duplicados en Frontend**

El `CreateDirectorUseCase` **NO verifica** si ya existe un director con:
- Mismo `numeroDocumento`
- Mismo `rolDirector`

**Código actual:**

```typescript
// CreateDirectorUseCase (líneas 8-13)

async execute(societyProfileId: string, payload: DirectorDTO): Promise<DirectorConfig> {
  return await this.repository.create(societyProfileId, payload);
  // ❌ NO valida duplicados antes de crear
}
```

---

## 🎯 **PREGUNTAS PARA EL BACKEND**

### **1. ¿El POST `/directores` valida duplicados?**

**¿El backend verifica que NO exista un director con:**
- Mismo `numeroDocumento`
- Mismo `rolDirector`

**¿Antes de crear?**

**Si NO:** El backend permitirá crear directores duplicados.

**Si SÍ:** Debería retornar `409 Conflict` o similar.

---

### **2. ¿El POST devuelve el director creado en `data`?**

**¿La respuesta del POST incluye el director completo?**

```json
{
  "success": true,
  "message": "Director creado correctamente.",
  "code": 201,
  "data": {
    "id": "019b33dd-...",
    "personaId": "019aad12-...",
    "rolDirector": "TITULAR",
    ...
  }
}
```

**Si NO devuelve `data`:** El frontend debe hacer un GET adicional (más lento y propenso a race conditions).

**Si SÍ devuelve `data`:** El frontend puede usar directamente el valor retornado (más rápido y seguro).

---

### **3. ¿El backend acepta `id` en el payload del POST?**

**¿El frontend puede enviar el `id` (UUID) en el POST?**

```json
{
  "id": "019b3d90-aaaa-bbbb-cccc-1234567890ab",  // ← UUID generado en frontend
  "personaId": "019aad12-...",
  "rolDirector": "TITULAR"
}
```

**Ventaja:** Permite idempotencia (reintentos seguros).

**¿El backend acepta este `id` o genera uno nuevo?**

---

### **4. ¿Hay índice único en la BD para prevenir duplicados?**

**¿La base de datos tiene un constraint UNIQUE en:**
- `(societyProfileId, personaId, rolDirector)`
- O `(societyProfileId, numeroDocumento, rolDirector)`

**Si NO:** Permitirá insertar duplicados.

**Si SÍ:** Retornará error de BD y el backend debería manejarlo con `409 Conflict`.

---

## 🔧 **SOLUCIONES PROPUESTAS**

### **SOLUCIÓN 1: Backend retorne el director creado**

**Backend debe modificar:**

```typescript
// Backend (POST /directores)

async crearDirector(societyProfileId, payload) {
  const director = await this.directorService.create(payload);
  
  return {
    success: true,
    message: "Director creado correctamente.",
    code: 201,
    data: director  // ← AGREGAR ESTO
  };
}
```

**Beneficio:**
- ✅ Frontend usa directamente el valor retornado
- ✅ Elimina la necesidad del GET fallback
- ✅ Previene race conditions

---

### **SOLUCIÓN 2: Backend valide duplicados**

**Backend debe verificar ANTES de crear:**

```typescript
// Backend (antes del INSERT)

async crearDirector(societyProfileId, payload) {
  // ✅ Validar duplicado
  const existing = await this.directorRepo.findOne({
    societyProfileId,
    numeroDocumento: payload.persona.numeroDocumento,
    rolDirector: payload.rolDirector
  });
  
  if (existing) {
    throw new ConflictException(
      "Ya existe un director con ese documento y rol"
    );
  }
  
  // Crear director
  const director = await this.directorService.create(payload);
  return { success: true, data: director };
}
```

**Beneficio:**
- ✅ Previene duplicados en BD
- ✅ Retorna error claro al frontend (`409 Conflict`)

---

### **SOLUCIÓN 3: Frontend valide antes de enviar**

**Frontend debe modificar `CreateDirectorUseCase`:**

```typescript
// CreateDirectorUseCase

async execute(societyProfileId: string, payload: DirectorDTO): Promise<DirectorConfig> {
  // ✅ Validar duplicado ANTES de crear
  const existentes = await this.repository.get(societyProfileId);
  
  const duplicado = existentes.find(
    (item) =>
      item.persona.numeroDocumento === payload.persona.numeroDocumento &&
      item.rolDirector === payload.rolDirector
  );
  
  if (duplicado) {
    throw new Error(
      `Ya existe un director ${payload.rolDirector} con documento ${payload.persona.numeroDocumento}`
    );
  }
  
  // Crear director
  return await this.repository.create(societyProfileId, payload);
}
```

**Beneficio:**
- ✅ Previene duplicados desde el frontend
- ✅ Evita llamadas innecesarias al backend
- ⚠️ Requiere un GET previo (más lento)

---

### **SOLUCIÓN 4: Frontend prevenga doble click**

**Frontend debe deshabilitar el botón al guardar:**

```vue
<!-- AgregarDirectorModal.vue -->

<ActionButton
  type="submit"
  :is-disabled="isSubmitDisabled || isSaving"  <!-- ✅ YA ESTÁ IMPLEMENTADO -->
  :label="submitLabel"
/>
```

```typescript
// useDirectores.ts

const create = async (payload: DirectorDTO) => {
  isSaving.value = true;  // ✅ Deshabilita botón
  try {
    const created = await createUseCase.execute(id, payload);
    directores.value.push(created);
    return created;
  } finally {
    isSaving.value = false;  // ✅ Re-habilita botón
  }
};
```

**✅ YA ESTÁ IMPLEMENTADO** - El frontend ya previene doble click.

---

## 🎯 **RECOMENDACIONES FINALES**

### **Para el Backend:**

1. ✅ **CRÍTICO:** Retornar el director creado en `data` del POST
2. ✅ **CRÍTICO:** Validar duplicados antes de insertar
3. ✅ **RECOMENDADO:** Agregar constraint UNIQUE en BD
4. ✅ **RECOMENDADO:** Retornar `409 Conflict` si existe duplicado

---

### **Para el Frontend:**

1. ✅ **YA IMPLEMENTADO:** Prevenir doble click con `isSaving`
2. ⚠️ **CONSIDERAR:** Agregar validación de duplicados en `CreateDirectorUseCase`
3. ⚠️ **CONSIDERAR:** Mejorar el fallback del `create()` para que NO use "último de la lista"

---

## 📋 **CHECKLIST PARA EL BACKEND**

- [ ] ¿El POST `/directores` retorna el director creado en `data`?
- [ ] ¿El backend valida duplicados (documento + rol)?
- [ ] ¿Hay constraint UNIQUE en la BD?
- [ ] ¿Se retorna `409 Conflict` si existe duplicado?
- [ ] ¿El backend acepta `id` en el payload del POST (idempotencia)?

---

## 🔥 **SIGUIENTE PASO**

**Para reproducir el problema y confirmarlo con el backend:**

1. Ejecuta el test de directorio:
   ```bash
   npm run test:suite:directorio
   ```

2. Si el backend NO retorna `data`, verás este log:
   ```
   [Repository][DirectorHttp] create:using-last-from-list
   ```

3. Si ves ese log, **CONFIRMA** que el backend debe retornar `data` en el POST.

---

**¿Revisamos juntos el código del backend para confirmar estos puntos?** 🚀

