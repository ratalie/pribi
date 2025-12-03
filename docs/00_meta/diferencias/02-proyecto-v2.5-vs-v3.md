# 🔄 Diferencias: Proyecto v2.5 vs v3

> Comparación entre proyectos `probo-version2.5` y `probo-frontend-v3-area-2`.

---

## 📦 Proyectos en el Ecosistema

```
/home/yull23/legal-factory/
├── probo-backend              # Backend v2.5 + v3
├── probo-version2.5           # Frontend v2.5 (funcional completo)
├── probo-frontend-v3-area-1   # Frontend v3 área 1
├── probo-frontend-v3-area-2   # Frontend v3 área 2 (este proyecto)
├── probo-figma-ai             # Referencia de componentes visuales (React)
├── references-ai              # Referencias de IA
└── ... (otros proyectos)
```

---

## 🆚 Comparación

### `probo-version2.5` (Frontend v2.5)

**Estado:** ✅ Producción completa

**Funcionalidades:**
- ✅ Sociedades (completo)
- ✅ Juntas (completo)
- ✅ Repositorio (completo)
- ✅ Chat IA (completo)

**Arquitectura:**
- ⚠️ Monolítica
- ⚠️ Sin separación de capas
- ⚠️ Sin tests

**Backend:**
- ✅ Conecta a `/api/v2`

---

### `probo-frontend-v3-area-2` (Frontend v3)

**Estado:** 🚧 En desarrollo (rama `feat/flujo-juntas`)

**Funcionalidades:**
- ✅ Sociedades (completo con arquitectura hexagonal)
- 🚧 Juntas (95% completo, falta instalación)
- ⏳ Repositorio (UI creada, sin arquitectura)
- ⏳ Panel Admin (pendiente)

**Arquitectura:**
- ✅ Hexagonal + DDD
- ✅ Separación de capas (Domain → Application → Infrastructure → Presentation)
- ✅ Tests completos (51 tests, 94.1% passing)
- ✅ MSW configurado

**Backend:**
- ✅ Conecta a `/api/v2` (temporalmente)
- 🚧 Migrará a `/api/v3` cuando esté listo

---

## 🎯 Ventajas de v3

### 1. Arquitectura Profesional:
- ✅ Hexagonal + DDD
- ✅ Fácil de testear
- ✅ Fácil de mantener
- ✅ Fácil de escalar

### 2. Testing:
- ✅ 51 tests
- ✅ MSW (tests rápidos)
- ✅ Helpers reutilizables

### 3. Documentación:
- ✅ 36 documentos completos
- ✅ Guías para el equipo
- ✅ Arquitectura documentada

### 4. Código Limpio:
- ✅ Separación de concerns
- ✅ TypeScript strict
- ✅ Best practices

---

## 🔧 Backend Compartido

Ambos frontends usan el **mismo backend** (`probo-backend`):
- v2.5 frontend → `/api/v2`
- v3 frontend → `/api/v2` (temporalmente) → `/api/v3` (futuro)

---

## 📚 Referencias

- **Backend:** `../probo-backend/`
- **Frontend v2.5:** `../probo-version2.5/`
- **Frontend v3:** `../probo-frontend-v3-area-2/` (este proyecto)
- **Componentes visuales:** `../probo-figma-ai/`

---

## 🎯 Migración

**Estado:** v3 está reemplazando progresivamente a v2.5 con:
1. Arquitectura mejorada
2. Tests completos
3. Código mantenible
4. Documentación completa

---

**Última actualización:** Diciembre 3, 2025

