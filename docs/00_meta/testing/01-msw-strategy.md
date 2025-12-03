# 🌐 MSW Strategy

> Estrategia de uso de MSW (Mock Service Worker) en el proyecto.

---

## 🎯 ¿Qué es MSW?

MSW intercepta peticiones HTTP y devuelve respuestas mockeadas.

**Ver documentación completa:** [../architecture/04-patron-testing.md](../architecture/04-patron-testing.md)

---

## 📂 Estructura de Handlers

```
app/core/hexag/mocks/
├── handlers/
│   ├── sociedades/
│   │   ├── datos-principales.handlers.ts
│   │   ├── accionistas.handlers.ts
│   │   └── ... (8 archivos)
│   └── juntas/
│       └── ... (pendiente)
└── register-handlers.ts
```

---

## ✅ Ventajas

- ⚡ Tests ultra rápidos
- 🔄 Reproducibles
- 🚫 Sin backend requerido
- 📦 Mocks centralizados

---

## 📚 Recursos

- [../architecture/04-patron-testing.md](../architecture/04-patron-testing.md) - Documentación completa
- MSW Docs: https://mswjs.io/

---

**Última actualización:** Diciembre 3, 2025

