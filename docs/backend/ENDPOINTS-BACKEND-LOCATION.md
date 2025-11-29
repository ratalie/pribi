# Ubicación de Endpoints del Backend

## 📍 Ubicación Base

Todos los endpoints del flujo de **Registro de Sociedades (v2)** están ubicados en:

```
/home/yull23/legal-factory/backend/src/modules/flows-v2/register-society-profile
```

## 📂 Estructura de Pasos

Cada paso del registro de sociedades tiene su propia carpeta con arquitectura hexagonal:

```
register-society-profile/
├── 0.initiate-registration/     # Paso 0: Iniciar registro (POST /api/v2/society-profile)
├── 1.define-society-details/    # Paso 1: Datos principales (PUT /api/v2/society-profile/{id}/society)
├── 2.shareholder/               # Paso 2: Accionistas (POST /api/v2/society-profile/{id}/shareholder)
├── 3.capital-social/            # Paso 3: Acciones/Capital social (POST /api/v2/society-profile/{id}/acction)
├── 4.share-assignment/          # Paso 4: Asignación de acciones (POST /api/v2/society-profile/{id}/share-assignment)
├── 5.directory/                  # Paso 5: Directorio (POST /api/v2/society-profile/{id}/directory)
├── 6.attorney-register/         # Paso 6: Registro de apoderados (POST /api/v2/society-profile/{id}/attorney-register)
├── 7.powers-regime/             # Paso 7: Régimen de poderes
├── 8.quorums-majorities/        # Paso 8: Quórums y mayorías (PUT /api/v2/society-profile/{id}/quorum)
└── 9.special-agreements/        # Paso 9: Acuerdos especiales
```

## 🔍 Cómo Encontrar un Endpoint

1. **Identifica el paso** (0-9 según la lista anterior)
2. **Navega a la carpeta** correspondiente
3. **Busca el controlador** en: `presentation/controllers/*.controller.ts`
4. **Revisa el decorador** `@Controller()` para ver la ruta base

### Ejemplo: Asignación de Acciones

```typescript
// Ubicación del controlador:
/home/yull23/legal-factory/backend/src/modules/flows-v2/register-society-profile/4.share-assignment/presentation/controllers/share-assignment.controller.ts

// Decorador del controlador:
@Controller('v2/society-profile/:id/share-assignment')

// Endpoint completo (con prefijo /api):
POST /api/v2/society-profile/{id}/share-assignment
```

## 📋 Endpoints Principales

### Paso 0: Iniciar Registro
- **Ubicación:** `0.initiate-registration/`
- **Endpoint:** `POST /api/v2/society-profile`
- **Respuesta:** `{ structureId: number }`

### Paso 1: Datos Principales
- **Ubicación:** `1.define-society-details/`
- **Endpoint:** `PUT /api/v2/society-profile/{id}/society`
- **Nota:** Usa PUT porque la sociedad ya fue creada en el paso 0

### Paso 2: Accionistas
- **Ubicación:** `2.shareholder/`
- **Endpoint:** `POST /api/v2/society-profile/{id}/shareholder`
- **Nota:** Requiere UUIDs para `id` y `persona.id`

### Paso 3: Capital Social (Acciones)
- **Ubicación:** `3.capital-social/`
- **Endpoint:** `POST /api/v2/society-profile/{id}/acction`
- **Nota:** Requiere UUID para `id`

### Paso 4: Asignación de Acciones
- **Ubicación:** `4.share-assignment/`
- **Endpoint:** `POST /api/v2/society-profile/{id}/share-assignment`
- **Nota:** Requiere UUID para `id`, `accionId` y `accionistaId`

### Paso 5: Directorio
- **Ubicación:** `5.directory/`
- **Endpoint:** `POST /api/v2/society-profile/{id}/directory`
- **Nota:** Requiere UUIDs para `id` y `persona.id` de cada director

### Paso 6: Registro de Apoderados
- **Ubicación:** `6.attorney-register/`
- **Endpoint:** `POST /api/v2/society-profile/{id}/attorney-register`
- **Nota:** Requiere UUIDs para `id` y `persona.id`

### Paso 8: Quórums y Mayorías
- **Ubicación:** `8.quorums-majorities/`
- **Endpoint:** `PUT /api/v2/society-profile/{id}/quorum`
- **Nota:** Usa PUT (similar a datos principales)

## 🔐 Autenticación

Todos los endpoints requieren:
- **Header:** `Authorization: Bearer <token>`
- **Scope:** `ModuleAccess.SOCIETY` con acciones `WRITE`, `UPDATE`, `READ`

## 📝 Notas Importantes

1. **UUIDs generados en el cliente:** Muchos pasos requieren que el frontend genere UUIDs para `id` y sub-objetos (ej: `persona.id`)

2. **Métodos HTTP:**
   - `POST`: Para crear nuevos recursos (accionistas, acciones, directorio, etc.)
   - `PUT`: Para actualizar recursos existentes (datos principales, quórums)

3. **Validaciones del backend:**
   - DNI debe tener exactamente 8 dígitos
   - UUIDs deben ser válidos (v4 o v7)
   - IDs deben ser únicos

4. **Documentación adicional:** Ver archivos en `docs/backend/`:
   - `00-iniciar-registro-sociedad.md`
   - `01-detalles-sociedad.md`
   - `02-accionistas.md`
   - `03-capital-social.md`
   - `04-asignacion-acciones.md`
   - `06-registro-apoderados.md`

## 🚀 Uso Rápido

Para encontrar rápidamente un endpoint:

```bash
# Buscar controlador de un paso específico
find /home/yull23/legal-factory/backend/src/modules/flows-v2/register-society-profile -name "*.controller.ts" -type f

# Buscar por nombre de recurso
grep -r "share-assignment\|asignacion" /home/yull23/legal-factory/backend/src/modules/flows-v2/register-society-profile
```

---

**Última actualización:** 2025-01-29
**Mantenedor:** Revisar este archivo cuando se agreguen nuevos pasos o se modifiquen endpoints

