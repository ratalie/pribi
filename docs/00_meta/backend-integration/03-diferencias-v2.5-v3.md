# 🔄 Diferencias Backend v2.5 vs v3

> Comparación entre versión 2.5 (actual) y v3 (en desarrollo).

---

## 📊 Estado

| Versión | Estado | Frontend | Módulos Funcionales |
|---------|--------|----------|---------------------|
| v2.5 | ✅ Producción | `probo-version2.5` | Sociedades, Juntas, Repo, Chat IA |
| v3 | 🚧 Desarrollo | `probo-frontend-v3-area-2` | Sociedades (parcial), Juntas (parcial) |

---

## 🔑 Diferencias Principales

### Base URL:
- **v2.5:** `/api/v2`
- **v3:** `/api/v3` (pendiente)

### Arquitectura:
- **v2.5:** Monolítica
- **v3:** Modular + Hexagonal

### Autenticación:
- **v2.5:** JWT funcionando
- **v3:** Compatible con v2.5

---

## 🎯 Migración

**Estado actual:** Backend mantiene AMBAS versiones (v2 y v3).

El frontend v3 usa endpoints de v2 temporalmente hasta que v3 esté completo.

---

## 📚 Referencias

- Backend v2.5: `../probo-backend/src/v2/`
- Backend v3: `../probo-backend/src/v3/` (en desarrollo)
- Frontend v2.5: `../probo-version2.5/`
- Frontend v3: `../probo-frontend-v3-area-2/` (este proyecto)

---

**Última actualización:** Diciembre 3, 2025



