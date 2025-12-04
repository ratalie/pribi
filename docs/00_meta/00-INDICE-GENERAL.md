# 📚 Índice General - Documentación Probo Frontend v3

**Última actualización**: Diciembre 4, 2024

---

## 🎯 Documentación por Categoría

### 🏛️ Arquitectura

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [ARQUITECTURA-GENERAL-COMPLETA.md](architecture/ARQUITECTURA-GENERAL-COMPLETA.md) | Visión general de toda la arquitectura | ✅ Completo |
| [JUNTAS-ARQUITECTURA-HEXAGONAL.md](architecture/JUNTAS-ARQUITECTURA-HEXAGONAL.md) | Arquitectura hexagonal de Juntas | ✅ Completo |
| [JUNTAS-EJEMPLO-COMPLETO.md](architecture/JUNTAS-EJEMPLO-COMPLETO.md) | Ejemplo paso a paso de implementación | ✅ Completo |
| [JUNTAS-FLUJO-COMPLETO.md](architecture/JUNTAS-FLUJO-COMPLETO.md) | Flujo completo de una junta | ✅ Completo |

### 🧪 Testing

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [GUIA-TESTING-JUNTAS.md](testing/GUIA-TESTING-JUNTAS.md) | Guía completa de testing para Juntas | ✅ Completo |
| [06-MSW-ESTADO-Y-CONFIGURACION.md](testing/06-MSW-ESTADO-Y-CONFIGURACION.md) | Estado de MSW | ✅ Completo |
| [07-PLAN-MSW-COMPLETO.md](testing/07-PLAN-MSW-COMPLETO.md) | Plan de MSW | ✅ Completo |
| [08-RESULTADO-MSW-FINAL.md](testing/08-RESULTADO-MSW-FINAL.md) | Resultado final MSW (100% passing) | ✅ Completo |
| [PLAN-PLAYWRIGHT-E2E.md](../juntas/PLAN-PLAYWRIGHT-E2E.md) | Plan para E2E con Playwright | 📋 Planeado |

### 📊 Reportes de Testing

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [RESUMEN-TESTING-SOCIEDADES-DIC-3.md](testing/RESUMEN-TESTING-SOCIEDADES-DIC-3.md) | Resumen de tests de Sociedades | ✅ 100% |
| [REPORTE-SOCIEDADES-BACKEND-DIC-3.md](testing/REPORTE-SOCIEDADES-BACKEND-DIC-3.md) | Reporte para backend de Sociedades | ✅ Resuelto |
| [REPORTE-INTEGRACION-BACKEND-DIC-3.md](../juntas/REPORTE-INTEGRACION-BACKEND-DIC-3.md) | Reporte integración Juntas | 📋 Pendiente |

### 🔧 Backend Integration

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [AUDITORIA-DIRECTORES-DUPLICADOS.md](testing/AUDITORIA-DIRECTORES-DUPLICADOS.md) | Auditoría de directores duplicados | ✅ Documentado |
| [REPORTE-TECNICO-BACKEND-REPRODUCIR.md](../juntas/REPORTE-TECNICO-BACKEND-REPRODUCIR.md) | Reporte técnico con cURL | ✅ Completo |
| [CHECKLIST-PARA-BACKEND.md](../juntas/CHECKLIST-PARA-BACKEND.md) | Checklist de bugs para backend | ✅ Completo |

### 📦 Por Módulo

| Módulo | README Principal | Estado |
|--------|-----------------|--------|
| **Sociedades** | [app/core/hexag/registros/sociedades/README.md](../../app/core/hexag/registros/sociedades/README.md) | ✅ Completo |
| **Juntas** | [app/core/hexag/juntas/README.md](../../app/core/hexag/juntas/README.md) | ✅ Completo |
| **Presentation - Juntas** | [app/core/presentation/operaciones/junta-accionistas/README.md](../../app/core/presentation/operaciones/junta-accionistas/README.md) | ✅ Completo |

---

## 🗺️ Mapa de Navegación

### Si eres nuevo en el proyecto:

1. **Empieza aquí**: [ARQUITECTURA-GENERAL-COMPLETA.md](architecture/ARQUITECTURA-GENERAL-COMPLETA.md)
2. **Luego lee**: [app/core/hexag/registros/sociedades/README.md](../../app/core/hexag/registros/sociedades/README.md)
3. **Para implementar algo nuevo**: [JUNTAS-EJEMPLO-COMPLETO.md](architecture/JUNTAS-EJEMPLO-COMPLETO.md)
4. **Para testing**: [GUIA-TESTING-JUNTAS.md](testing/GUIA-TESTING-JUNTAS.md)

### Si quieres implementar un nuevo paso en Juntas:

1. **Lee el ejemplo**: [JUNTAS-EJEMPLO-COMPLETO.md](architecture/JUNTAS-EJEMPLO-COMPLETO.md)
2. **Entiende el flujo**: [JUNTAS-FLUJO-COMPLETO.md](architecture/JUNTAS-FLUJO-COMPLETO.md)
3. **Sigue la arquitectura**: [JUNTAS-ARQUITECTURA-HEXAGONAL.md](architecture/JUNTAS-ARQUITECTURA-HEXAGONAL.md)
4. **Escribe tests**: [GUIA-TESTING-JUNTAS.md](testing/GUIA-TESTING-JUNTAS.md)

### Si hay un bug en integración con backend:

1. **Documenta el bug**: Ver plantilla en [REPORTE-TECNICO-BACKEND-REPRODUCIR.md](../juntas/REPORTE-TECNICO-BACKEND-REPRODUCIR.md)
2. **Crea checklist**: Ver plantilla en [CHECKLIST-PARA-BACKEND.md](../juntas/CHECKLIST-PARA-BACKEND.md)
3. **Reporta al equipo backend**

---

## 📊 Estado del Proyecto

### ✅ Módulo: Registro de Sociedades

**Progreso**: 100% Completo

- [x] Domain Layer
- [x] Application Layer
- [x] Infrastructure Layer (HTTP + MSW)
- [x] Presentation Layer
- [x] Testing (29/29 tests passing)
- [x] Documentación completa

**Tests:**
```
✅ MSW: 29/29 passing (100%)
✅ Backend: 29/29 passing (100%)
⏱️ Duración: ~2s (MSW) | ~5s (Backend)
```

**Comandos:**
```bash
npm run test:core:all:msw      # Con MSW
npm run test:core:all          # Con backend
```

### ✅ Módulo: Juntas de Accionistas

**Progreso**: 70% Completo

- [x] Domain Layer
- [x] Application Layer
- [x] Infrastructure Layer (HTTP + MSW)
- [x] Presentation Layer (Pasos 1-3)
- [ ] Testing (pendiente)
- [x] Documentación completa

**Pasos Implementados:**
- [x] Paso 1: Selección de Agenda (store + controller)
- [x] Paso 2: Detalles (store + controller)
- [x] Paso 3: Instalación (store + controller)
- [ ] Paso 4-18: Puntos de agenda específicos (pendiente)

**Tests:**
```
⏳ MSW: Handlers listos, tests pendientes
⏳ Backend: Repos listos, tests pendientes
```

**Comandos (cuando se implementen tests):**
```bash
npm run test:juntas:all:msw    # Con MSW
npm run test:juntas:all        # Con backend
```

---

## 🔑 Conceptos Clave

### Arquitectura Hexagonal

```
Domain (núcleo) ← Application ← Infrastructure (adaptadores)
                                      ↑
                                Presentation (UI)
```

### Pinia Stores - SIEMPRE Option API

```typescript
// ✅ CORRECTO
export const useXStore = defineStore("x", {
  state: () => ({ ... }),
  actions: { ... },
  getters: { ... }
});

// ❌ INCORRECTO (NO usar)
export const useXStore = defineStore("x", () => {
  const data = ref([]);
  return { data };
});
```

### Controllers (Composables)

Gestionan el **ciclo de vida** de los componentes:

```typescript
export function useXController(societyId, flowId) {
  const store = useXStore();

  onMounted(async () => {
    await store.load(societyId, flowId);
  });

  return { ... };
}
```

### Mappers

**Infrastructure Mappers**: DTO ↔ Entity (OBLIGATORIO)
```typescript
// infrastructure/mappers/junta.mapper.ts
static toDomain(dto: JuntaDTO): Junta { ... }
static toDTO(entity: Junta): JuntaDTO { ... }
```

**Presentation Mappers**: FormData ↔ DTO/Entity (OPCIONAL)
```typescript
// presentation/mappers/junta-ui.mapper.ts
static toFormData(dto: JuntaDTO): JuntaFormData { ... }
static toDTO(formData: JuntaFormData): JuntaDTO { ... }
```

---

## 🚀 Quick Commands

### Desarrollo

```bash
npm run dev                    # Frontend (localhost:3001)
npm run build                  # Build para producción
npm run preview                # Preview del build
```

### Testing

```bash
# Sociedades
npm run test:core:all:msw      # Con MSW (rápido)
npm run test:core:all          # Con backend (completo)

# Juntas (cuando se implementen)
npm run test:juntas:all:msw
npm run test:juntas:all

# Todo
npm run test:all

# Cleanup
npm run test:cleanup           # Limpia DB de test
```

### Type Checking

```bash
npm run typecheck              # App
npm run typecheck:tests        # Tests
npm run typecheck:all          # App + Tests
```

### Linting

```bash
npm run lint                   # Check
npm run lint:fix               # Auto-fix
```

---

## 📖 Estructura de Documentación

```
docs/
├── 00_meta/                           ← Meta-documentación
│   ├── 00-INDICE-GENERAL.md          ← ESTE ARCHIVO
│   ├── 01-PARA-EL-EQUIPO.md          ← Guía para el equipo
│   ├── architecture/
│   │   ├── ARQUITECTURA-GENERAL-COMPLETA.md
│   │   ├── JUNTAS-ARQUITECTURA-HEXAGONAL.md
│   │   ├── JUNTAS-EJEMPLO-COMPLETO.md
│   │   └── JUNTAS-FLUJO-COMPLETO.md
│   ├── testing/
│   │   ├── GUIA-TESTING-JUNTAS.md
│   │   ├── RESUMEN-TESTING-SOCIEDADES-DIC-3.md
│   │   └── ...
│   └── backend-integration/
│       └── ...
│
├── general/                           ← Documentación general
│   ├── ARCHITECTURE.md
│   └── examples/
│       └── producto-example.md
│
├── juntas/                            ← Específico de Juntas
│   ├── PLAN-PLAYWRIGHT-E2E.md
│   ├── REPORTE-INTEGRACION-BACKEND-DIC-3.md
│   └── ...
│
└── reglas-cursor/                     ← Reglas para Cursor AI
    └── REGLAS-PRINCIPALES.md
```

---

## 🤝 Para el Equipo

**¿Nuevo en el equipo?** → Lee [01-PARA-EL-EQUIPO.md](01-PARA-EL-EQUIPO.md)

**¿Vas a implementar algo?** → Sigue [JUNTAS-EJEMPLO-COMPLETO.md](architecture/JUNTAS-EJEMPLO-COMPLETO.md)

**¿Hay un bug?** → Reporta usando [REPORTE-TECNICO-BACKEND-REPRODUCIR.md](../juntas/REPORTE-TECNICO-BACKEND-REPRODUCIR.md) como plantilla

**¿Necesitas ayuda?** → Pregunta al equipo, todo está documentado! 🚀

---

## 🏆 Logros Recientes

### ✅ Diciembre 3-4, 2024

- [x] **Sociedades**: 100% tests passing (MSW + Backend)
- [x] **MSW**: Configurado y funcionando al 100%
- [x] **Juntas**: Arquitectura hexagonal completa
- [x] **Juntas**: Presentation Layer para Pasos 1-3
- [x] **Documentación**: Guías completas de arquitectura y testing
- [x] **Package.json**: Comandos organizados por sistema

**Resultado:**
```
Test Files:  7/7 passed (100%) - Sociedades
Tests:       29/29 passed (100%) - Sociedades
MSW:         100% funcional
Juntas:      Arquitectura lista, testing pendiente
```

---

## 📖 Lectura Recomendada (Orden)

### Para Entender el Proyecto

1. [ARQUITECTURA-GENERAL-COMPLETA.md](architecture/ARQUITECTURA-GENERAL-COMPLETA.md) (15 min)
2. [app/core/hexag/registros/sociedades/README.md](../../app/core/hexag/registros/sociedades/README.md) (10 min)
3. [app/core/hexag/juntas/README.md](../../app/core/hexag/juntas/README.md) (10 min)

### Para Implementar

1. [JUNTAS-EJEMPLO-COMPLETO.md](architecture/JUNTAS-EJEMPLO-COMPLETO.md) (20 min)
2. [JUNTAS-FLUJO-COMPLETO.md](architecture/JUNTAS-FLUJO-COMPLETO.md) (15 min)

### Para Testing

1. [GUIA-TESTING-JUNTAS.md](testing/GUIA-TESTING-JUNTAS.md) (20 min)
2. [tests/sociedades/README.md](../../tests/sociedades/README.md) (15 min)
3. [06-MSW-ESTADO-Y-CONFIGURACION.md](testing/06-MSW-ESTADO-Y-CONFIGURACION.md) (10 min)

**Total**: ~2 horas de lectura para dominar toda la arquitectura 📚

---

## 🎯 Roadmap

### ✅ Completado

- [x] Arquitectura Hexagonal (Sociedades)
- [x] Arquitectura Hexagonal (Juntas - Base)
- [x] Testing con MSW (Sociedades)
- [x] Testing con Backend (Sociedades)
- [x] Presentation Layer (Juntas - Pasos 1-3)
- [x] Documentación completa

### 🔄 En Progreso

- [ ] Testing de Juntas (Pasos 1-3)
- [ ] Presentation Layer (Juntas - Pasos 4-18)

### 📋 Planeado

- [ ] E2E con Playwright
- [ ] CI/CD Pipeline
- [ ] Performance Optimization
- [ ] Accessibility Audit

---

## 💡 Tips Rápidos

### ¿Dónde está X?

**Entidades de negocio** → `app/core/hexag/[modulo]/domain/entities/`  
**Contratos (Ports)** → `app/core/hexag/[modulo]/domain/ports/`  
**DTOs** → `app/core/hexag/[modulo]/application/dtos/`  
**Use Cases** → `app/core/hexag/[modulo]/application/use-cases/`  
**Repositories** → `app/core/hexag/[modulo]/infrastructure/repositories/`  
**Stores** → `app/core/presentation/[area]/[modulo]/[paso]/stores/`  
**Controllers** → `app/core/presentation/[area]/[modulo]/[paso]/composables/`  
**Components** → `app/core/presentation/[area]/[modulo]/[paso]/components/`  
**Pages** → `app/pages/[area]/[modulo]/`

### ¿Cómo implemento X?

1. **Nuevo paso en módulo existente** → [JUNTAS-EJEMPLO-COMPLETO.md](architecture/JUNTAS-EJEMPLO-COMPLETO.md)
2. **Nuevo módulo completo** → Replicar estructura de `sociedades/` o `juntas/`
3. **Nuevo test** → [GUIA-TESTING-JUNTAS.md](testing/GUIA-TESTING-JUNTAS.md)

### ¿Por qué no funciona MSW?

Ver: [06-MSW-ESTADO-Y-CONFIGURACION.md](testing/06-MSW-ESTADO-Y-CONFIGURACION.md)

Checklist:
- [ ] Handler existe en `infrastructure/mocks/handlers/`
- [ ] Handler está registrado en `register-handlers.ts`
- [ ] Handler usa `*/api/v2/...` (con wildcard)
- [ ] State existe en `infrastructure/mocks/data/`

---

## 🎓 Recursos Externos

### Arquitectura

- **Hexagonal Architecture**: https://alistair.cockburn.us/hexagonal-architecture/
- **DDD**: https://www.domainlanguage.com/ddd/
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

### Vue 3 + TypeScript

- **Vue 3**: https://vuejs.org/
- **Pinia**: https://pinia.vuejs.org/
- **Nuxt 3**: https://nuxt.com/
- **Vee-Validate**: https://vee-validate.logaretm.com/

### Testing

- **Vitest**: https://vitest.dev/
- **MSW**: https://mswjs.io/
- **Vue Test Utils**: https://test-utils.vuejs.org/

---

## 📞 Contacto

**Documentación actualizada por**: Yull23 & Cursor AI  
**Fecha**: Diciembre 4, 2024  
**Versión**: 3.0.0

---

**¡Bienvenido al proyecto! 🚀**
