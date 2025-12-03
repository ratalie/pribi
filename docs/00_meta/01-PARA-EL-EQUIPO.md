# 🚨 PARA EL EQUIPO - LEE ESTO PRIMERO

> **⚠️ IMPORTANTE:** Este documento contiene información CRÍTICA que necesitas saber antes de continuar trabajando en el proyecto.

---

## 🎯 Resumen Ejecutivo

### Lo que necesitas saber YA:

1. **✅ TIENES ACCESO LIBRE AL BACKEND** - No necesitas permisos especiales
2. **✅ DEBES SEGUIR ARQUITECTURA HEXAGONAL** - No es opcional
3. **✅ DEBES USAR MSW + VITEST** - Para tests rápidos y confiables
4. **✅ LA RAMA `feat/flujo-juntas` TIENE TODO FUNCIONANDO** - Usa esa como referencia

---

## 🔌 1. Acceso al Backend (MUY IMPORTANTE)

### ❌ MITO: "No puedo tocar el backend"
### ✅ REALIDAD: "Tienes acceso TOTAL al backend"

El backend está en:
```
📂 /home/yull23/legal-factory/probo-backend
```

### Backend disponible para desarrollo:
- **URL:** `http://localhost:4000` (o el puerto configurado)
- **Versión 2.5:** Completamente funcional (sociedades, juntas, repo, chat IA)
- **Versión 3:** En desarrollo (misma estructura, nuevos endpoints)

### Endpoints disponibles:
```
API v2: http://localhost:4000/api/v2
```

### Credenciales de prueba:
```javascript
{
  email: "test@probo.com",
  password: "test123"
}
```

### ¿Cómo saber si el backend está corriendo?

```bash
# Navega al backend
cd ../probo-backend

# Verifica el estado
npm run start:dev

# O consulta al backend directamente
curl http://localhost:4000/api/v2/health
```

### 🎯 Acción requerida:
- **NO esperes permisos** para consultar el backend
- **INVESTIGA** los endpoints disponibles en el backend
- **DOCUMENTA** lo que encuentres en `docs/backend-integration/`

---

## 🏛️ 2. Arquitectura Hexagonal (OBLIGATORIA)

### ❌ NO hagas esto:
```
❌ Llamar HTTP directamente desde componentes Vue
❌ Poner lógica de negocio en stores
❌ Crear archivos sin seguir la estructura hexagonal
❌ Ignorar los mappers (DTO ↔ Entidad)
```

### ✅ SÍ haz esto:

```
app/core/hexag/[dominio]/
├── domain/
│   ├── entities/          # Entidades de negocio (OBLIGATORIO)
│   └── ports/             # Contratos/interfaces (OBLIGATORIO)
├── application/
│   ├── dtos/              # DTOs bidireccionales (OBLIGATORIO)
│   └── use-cases/         # Casos de uso (OBLIGATORIO)
└── infrastructure/
    ├── mappers/           # DTO ↔ Entidad (OBLIGATORIO)
    └── repositories/      # Implementaciones HTTP (OBLIGATORIO)
```

### Orden de implementación:
1. **Domain** (entidades, ports)
2. **Application** (DTOs, use-cases)
3. **Infrastructure** (mappers, repositories)
4. **Presentation** (stores, controllers, componentes)

### Ejemplo completo:
Ver: `app/core/hexag/registros/sociedades/` (implementación completa de referencia)

### 🎯 Acción requerida:
- Lee: `docs/00_meta/architecture/02-hexagonal-ddd-profundo.md`
- Revisa: `docs/00_meta/modules/sociedades/` (ejemplo completo)
- **NO rompas la arquitectura sin consultar primero**

---

## 🧪 3. Testing con MSW + Vitest (OBLIGATORIO)

### ¿Por qué MSW?

MSW (Mock Service Worker) permite:
- ✅ Tests **ultra rápidos** (sin esperar al backend)
- ✅ Tests **confiables** (no dependen de red)
- ✅ Tests **reproducibles** (mismo resultado siempre)
- ✅ Desarrollo **offline** (sin backend corriendo)

### ¿Cómo funciona?

```typescript
// 1. MSW intercepta las peticiones HTTP
// 2. Devuelve datos mockeados
// 3. El test valida la lógica sin depender del backend real

// Ejemplo:
test('Debe crear sociedad', async () => {
  // MSW intercepta POST /api/v2/society-profile
  // Devuelve: { id: 'mocked-id', razonSocial: 'Test SA' }
  
  const result = await createSociety({ razonSocial: 'Test SA' });
  
  expect(result.id).toBe('mocked-id');
});
```

### Tests disponibles:

#### Tests Unitarios (en `app/core/hexag/`)
```
app/core/hexag/registros/sociedades/pasos/
├── datos-principales/infrastructure/repositories/__tests__/
├── accionistas/infrastructure/repositories/__tests__/
├── acciones/infrastructure/repositories/__tests__/
├── asignacion-acciones/infrastructure/repositories/__tests__/
├── directorio/infrastructure/repositories/__tests__/
├── apoderados/infrastructure/repositories/__tests__/
└── quorum/infrastructure/repositories/__tests__/
```

#### Tests de Integración (en `tests/`)
```
tests/sociedades/
├── paso-1-datos-principales.test.ts
├── paso-2-accionistas.test.ts
├── paso-3-acciones.test.ts
├── paso-4-asignacion.test.ts
├── paso-5-directorio.test.ts
├── paso-6-apoderados.test.ts
└── paso-8-quorum.test.ts
```

### Cómo ejecutar tests:

```bash
# Tests con MSW (rápido, sin backend)
npm run test

# Tests contra backend real (lento, requiere backend)
npm run test:real
```

### 🎯 Acción requerida:
- Lee: `docs/00_meta/testing/01-msw-strategy.md`
- Ejecuta: `npm run test` para ver los 51 tests
- Revisa: `docs/00_meta/testing/04-testing-sociedades.md` (ejemplo completo)

---

## 🌳 4. La Rama `feat/flujo-juntas` (TU REFERENCIA)

### ¿Qué tiene esta rama que `main` NO tiene?

```
✅ Arquitectura hexagonal completa en Sociedades
✅ 51 tests (48 passing - 94.1%)
✅ MSW configurado y funcionando
✅ Helpers de testing reutilizables
✅ Documentación completa
✅ 5 layouts funcionando correctamente
✅ Flujo de Juntas en progreso
```

### ¿Qué tiene `main` que necesitas actualizar?

```
❌ Sin tests
❌ Sin MSW
❌ Sin mejoras de arquitectura
❌ Sin helpers
❌ Sin documentación completa
```

### 🎯 Acción requerida:
- **USA `feat/flujo-juntas`** como referencia para todo lo que hagas
- **NO trabajes en `main`** hasta que se haga el merge de `feat/flujo-juntas`
- **PREGUNTA** si algo no está claro en `feat/flujo-juntas`

---

## 📚 5. Estructura del Proyecto

### Layouts (5 layouts disponibles):

```
app/layouts/
├── default.vue              # Layout general con sidebar
├── registros.vue            # Layout para registros (sociedades)
├── flow-layout.vue          # Layout con progreso (sociedades)
├── flow-layout-juntas.vue   # Layout con progreso (juntas)
└── sidebar-general.vue      # Layout con sidebar dinámico
```

### Páginas principales:

```
app/pages/
├── operaciones/sociedades/  # Operaciones sobre sociedades existentes
├── registros/sociedades/    # Registro de nuevas sociedades (8 pasos)
├── panel-administrativo/    # Panel de administración
└── repositorio/             # Repositorio de documentos
```

### Hexagonal (donde va la lógica):

```
app/core/hexag/
├── registros/
│   └── sociedades/          # Ejemplo completo de arquitectura hexagonal
│       ├── datos-principales/
│       ├── accionistas/
│       ├── acciones/
│       ├── asignacion-acciones/
│       ├── directorio/
│       ├── apoderados/
│       ├── estatutos/
│       └── quorum/
└── operaciones/
    └── juntas/              # En progreso
```

---

## 🚦 6. Checklist Antes de Implementar CUALQUIER COSA

Antes de crear o modificar código, verifica:

- [ ] ¿Leí `01-PARA-EL-EQUIPO.md`? (este documento)
- [ ] ¿Sé que tengo acceso libre al backend?
- [ ] ¿Entiendo la arquitectura hexagonal?
- [ ] ¿Voy a seguir el orden: Domain → Application → Infrastructure → Presentation?
- [ ] ¿Voy a crear tests con MSW?
- [ ] ¿Revisé `feat/flujo-juntas` como referencia?
- [ ] ¿Consulté la documentación en `docs/00_meta/`?

---

## 🎯 7. ¿Por Dónde Empezar?

### Si eres nuevo:

1. **Lee este documento completo** (ya lo estás haciendo ✅)
2. **Lee:** `docs/00_meta/architecture/02-hexagonal-ddd-profundo.md`
3. **Explora:** `app/core/hexag/registros/sociedades/` (ejemplo completo)
4. **Ejecuta tests:** `npm run test`
5. **Lee:** `docs/00_meta/testing/01-msw-strategy.md`

### Si ya conoces el proyecto:

1. **Verifica:** ¿Estás en `feat/flujo-juntas`?
2. **Ejecuta:** `npm run test` para ver si todo pasa
3. **Lee:** `docs/00_meta/modules/[modulo-que-vas-a-trabajar]/`
4. **Implementa:** Siguiendo arquitectura hexagonal

---

## ❓ 8. FAQ (Preguntas Frecuentes)

### ¿Puedo consultar el backend?
**SÍ**, tienes acceso TOTAL. El backend está en `../probo-backend`.

### ¿Debo seguir arquitectura hexagonal?
**SÍ**, es OBLIGATORIO. No es opcional.

### ¿Debo crear tests?
**SÍ**, con MSW. Usa `app/core/hexag/registros/sociedades/` como referencia.

### ¿Puedo crear archivos fuera de `hexag/`?
**SÍ**, pero solo para:
- `presentation/` (stores, controllers, componentes Vue)
- `pages/` (páginas de Nuxt)
- `layouts/` (layouts de Nuxt)
- `components/` (componentes reutilizables)

**NO** para lógica de negocio. Eso va en `hexag/`.

### ¿Qué hago si algo no está claro?
1. Lee `docs/00_meta/`
2. Revisa `feat/flujo-juntas`
3. Consulta al equipo

---

## 🎯 9. Próximos Pasos

### Ahora que leíste esto:

1. **Lee:** `docs/00_meta/00-INDICE-GENERAL.md` (índice de toda la documentación)
2. **Explora:** `docs/00_meta/architecture/` (arquitectura completa)
3. **Revisa:** `docs/00_meta/modules/sociedades/` (ejemplo completo)
4. **Ejecuta:** `npm run test` (para ver los 51 tests)
5. **Pregunta:** Si algo no está claro

---

## 📞 10. Contacto

Si tienes dudas sobre:
- **Arquitectura:** Lee `docs/00_meta/architecture/`
- **Testing:** Lee `docs/00_meta/testing/`
- **Backend:** Lee `docs/00_meta/backend-integration/`
- **Módulos:** Lee `docs/00_meta/modules/`

---

**IMPORTANTE:** Este documento es tu NORTE. Si algo contradice esto, consulta primero antes de proceder.

**Última actualización:** Diciembre 3, 2025  
**Rama de referencia:** `feat/flujo-juntas`

