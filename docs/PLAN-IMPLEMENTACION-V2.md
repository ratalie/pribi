# 📋 PLAN DE IMPLEMENTACIÓN - Endpoints v2 para Access Management

## ✅ ESTADO ACTUAL (Confirmado)

### Lo que SÍ existe:

- ✅ **Estructura V2 de Base de Datos** (tablas `UserV2`, `RoleV2`, etc.)
- ✅ **Sistema de Permisos V2** (granular, con áreas/rutas/módulos)
- ✅ **Lógica de negocio V2** (use cases, repositorios)
- ✅ **Configuración V2** (`PermissionsConfigV2`, `ModuleToFlowMap`)

### Lo que NO existe:

- ❌ **Endpoints v2** (`/v2/access-management/...`)
- ❌ **Controller v2** (`presentation/v2/access-management-v2.controller.ts`)

---

## 🎯 OBJETIVO

**Crear endpoints v2 que expongan la funcionalidad V2 existente.**

**Principio:** Reutilizar TODO lo existente, solo crear nuevas rutas.

---

## 📝 PLAN DE IMPLEMENTACIÓN

### FASE 1: Backend - Crear Controller v2

#### Paso 1.1: Crear estructura de carpetas

```
src/modules/access-management/
  └── presentation/
      ├── v1/  (mantener)
      │   ├── access-management.controller.ts
      │   └── superadmin.controller.ts
      └── v2/  (CREAR NUEVO)
          ├── access-management-v2.controller.ts
          └── superadmin-v2.controller.ts
```

#### Paso 1.2: Crear `access-management-v2.controller.ts`

**Estrategia:** Copiar estructura de v1, cambiar solo:

- `@Controller('v1/...')` → `@Controller('v2/...')`
- `@Auth()` → `@AuthV2()` (si aplica)
- Mantener TODOS los use cases existentes
- Mantener TODA la lógica existente

**Endpoints a crear (copiar de v1):**

1. ✅ `GET /v2/access-management/roles`
2. ✅ `POST /v2/access-management/users`
3. ✅ `GET /v2/access-management/users`
4. ✅ `GET /v2/access-management/users/:id`
5. ✅ `PATCH /v2/access-management/users/:id/role`
6. ✅ `PATCH /v2/access-management/users/:id/status`
7. ✅ `DELETE /v2/access-management/users/:id`
8. ✅ `GET /v2/access-management/users/:id/access`
9. ✅ `GET /v2/access-management/users/:id/access/full`
10. ✅ `PUT /v2/access-management/users/:id/access`
11. ✅ `GET /v2/access-management/me/access`
12. ✅ `GET /v2/access-management/users/:id/societies`
13. ✅ `POST /v2/access-management/users/:id/societies`

**Tiempo estimado:** 2-3 horas

#### Paso 1.3: Crear `superadmin-v2.controller.ts` (si aplica)

**Endpoints:**

- `POST /v2/superadmin/studies/:studyId/users`
- `PUT /v2/superadmin/studies/:id/modules`

**Tiempo estimado:** 30 minutos

#### Paso 1.4: Registrar en módulo

**Archivo:** `access-management.module.ts`

```typescript
@Module({
  controllers: [
    AccessManagementController,      // v1 (mantener)
    SuperadminController,             // v1 (mantener)
    AccessManagementV2Controller,     // v2 (NUEVO)
    SuperadminV2Controller,           // v2 (NUEVO, si aplica)
  ],
  // ... resto igual
})
```

**Tiempo estimado:** 5 minutos

#### Paso 1.5: Verificar autenticación v2

**Verificar:**

- ✅ `@AuthV2()` funciona correctamente
- ✅ `req.user` tiene estructura v2 (UUIDs)
- ✅ `userId` y `studyId` son UUIDs (no números)

**Tiempo estimado:** 30 minutos

#### Paso 1.6: Probar endpoints v2

**Probar cada endpoint:**

- ✅ Crear usuario
- ✅ Listar usuarios
- ✅ Obtener permisos
- ✅ Actualizar permisos
- ✅ Asignar sociedades

**Tiempo estimado:** 1 hora

**TOTAL BACKEND:** ~4-5 horas

---

### FASE 2: Frontend - Actualizar a v2

#### Paso 2.1: Actualizar `permissions.http.repository.ts`

**Cambio:**

```typescript
// De:
private readonly basePath = '/api/v1/access-management';

// A:
private readonly basePath = '/api/v2/access-management';
```

**Tiempo estimado:** 1 minuto

#### Paso 2.2: Actualizar `user-http.repository.ts`

**Cambio:**

```typescript
// De:
private readonly basePath = '/api/v1/access-management';

// A:
private readonly basePath = '/api/v2/access-management';
```

**Tiempo estimado:** 1 minuto

#### Paso 2.3: Verificar `societies-http.repository.ts`

**Verificar:**

- ¿Existe `/v2/society-profile/list`?
- Si NO existe, mantener v1
- Si SÍ existe, cambiar a v2

**Tiempo estimado:** 5 minutos

#### Paso 2.4: Probar frontend completo

**Probar:**

- ✅ Cargar usuarios
- ✅ Crear usuario (cuando esté implementado)
- ✅ Configurar permisos
- ✅ Asignar sociedades
- ✅ Ver permisos

**Tiempo estimado:** 30 minutos

**TOTAL FRONTEND:** ~40 minutos

---

## ✅ CHECKLIST COMPLETO

### Backend

- [ ] Crear carpeta `presentation/v2/`
- [ ] Crear `access-management-v2.controller.ts`
- [ ] Crear `superadmin-v2.controller.ts` (si aplica)
- [ ] Registrar controllers en módulo
- [ ] Verificar autenticación v2
- [ ] Probar todos los endpoints v2
- [ ] Documentar endpoints v2

### Frontend

- [ ] Actualizar `permissions.http.repository.ts`
- [ ] Actualizar `user-http.repository.ts`
- [ ] Verificar `societies-http.repository.ts`
- [ ] Probar todas las funcionalidades
- [ ] Verificar manejo de errores

---

## 🎯 ORDEN DE EJECUCIÓN

### 1. Backend primero (CRÍTICO)

```
Crear v2 → Probar v2 → Verificar que funciona
```

### 2. Frontend después

```
Actualizar rutas → Probar → Verificar que funciona
```

**NO cambiar frontend hasta que backend esté listo y probado.**

---

## ⚠️ RIESGOS Y MITIGACIÓN

### Riesgo 1: Autenticación v2 diferente

**Mitigación:** Verificar que `@AuthV2()` funciona igual que `@Auth()`

### Riesgo 2: Estructura de request diferente

**Mitigación:** Verificar que `req.user` tiene la misma estructura

### Riesgo 3: IDs diferentes (UUIDs vs números)

**Mitigación:** El código ya usa UUIDs (strings), debería funcionar

### Riesgo 4: Respuestas diferentes

**Mitigación:** Usar los mismos use cases, respuestas deberían ser iguales

---

## 📊 ESTIMACIÓN TOTAL

| Fase      | Tiempo         |
| --------- | -------------- |
| Backend   | 4-5 horas      |
| Frontend  | 40 minutos     |
| **TOTAL** | **~5-6 horas** |

---

## ✅ GARANTÍAS

### ¿Funcionará?

**SÍ, porque:**

1. ✅ **La lógica ya existe** - Solo creamos nuevas rutas
2. ✅ **Los use cases ya funcionan** - Los reutilizamos
3. ✅ **Las tablas V2 ya existen** - El repositorio ya las usa
4. ✅ **El frontend ya está preparado** - Solo cambiar rutas

### ¿Qué puede fallar?

**Muy poco, porque:**

- ✅ No cambiamos lógica de negocio
- ✅ No cambiamos base de datos
- ✅ No cambiamos use cases
- ✅ Solo creamos nuevas rutas HTTP

**Si algo falla:**

- Es fácil de debuggear (solo rutas)
- Es fácil de revertir (mantenemos v1)
- No rompe nada existente

---

## 🎯 CONCLUSIÓN

**Este es un cambio SEGURO porque:**

1. ✅ Reutilizamos TODO lo existente
2. ✅ Solo agregamos nuevas rutas
3. ✅ Mantenemos v1 funcionando
4. ✅ Cambios mínimos en frontend

**Confianza:** 🟢 **ALTA** - Es un cambio de rutas, no de lógica.

---

**Fecha:** $(date)  
**Estado:** 📋 PLAN LISTO PARA EJECUTAR
