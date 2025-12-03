# 📋 Pages: Operaciones/Sociedades

> Páginas del módulo de Operaciones sobre Sociedades.

---

## 📍 Ruta Base

```
/operaciones/sociedades/[societyId]/
```

---

## 🗺️ Páginas

### Juntas de Accionistas:
```
/junta-accionistas/
├── dashboard            # Panel principal
├── crear                # Crear junta
├── historial            # Listado de juntas
├── historico            # Histórico
├── accionistas          # Gestión accionistas
└── [flowId]/            # Flujo de junta (~100 rutas)
    ├── seleccion-agenda
    ├── instalacion-junta (🚧)
    ├── puntos-acuerdo
    ├── nombramiento-directorio/
    ├── nombramiento-directores/
    ├── remocion-directores/
    ├── nombramiento-gerente/
    ├── remocion-gerente/
    ├── nombramiento-auditores/
    ├── nombramiento-apoderados/
    ├── reparto-dividendos/
    ├── pronunciamiento-gestion/
    └── resumen/
```

---

## 🎨 Layout

- **Layout principal:** `registros`
- **Layout anidado:** `flow-layout-juntas` (dentro del flujo)

---

## 📚 Ver También

- [../modules/juntas/](../modules/juntas/) - Documentación del módulo
- [../architecture/03-routing-completo.md](../architecture/03-routing-completo.md) - Rutas completas

---

**Última actualización:** Diciembre 3, 2025

