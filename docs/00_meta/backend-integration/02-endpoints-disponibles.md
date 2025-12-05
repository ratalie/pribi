# 📡 Endpoints Disponibles

> Lista de endpoints del backend disponibles para desarrollo.

---

## 🌐 Base URL

```
http://localhost:4000/api/v2
```

---

## 📦 Sociedades - `/society-profile`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crear sociedad |
| GET | `/:id` | Obtener sociedad |
| PUT | `/:id` | Actualizar sociedad |
| DELETE | `/:id` | Eliminar sociedad |
| POST | `/:id/accionistas` | Crear accionistas |
| GET | `/:id/accionistas` | Listar accionistas |
| POST | `/:id/acciones` | Crear acciones |
| GET | `/:id/acciones` | Listar acciones |
| POST | `/:id/asignacion-acciones` | Asignar acciones |
| GET | `/:id/directorio/config` | Config directorio |
| POST | `/:id/directorio/directores` | Crear directores |
| GET | `/:id/directorio/directores` | Listar directores |
| DELETE | `/:id/directorio/directores` | Eliminar directores |
| POST | `/:id/apoderados/clases` | Crear clases |
| GET | `/:id/apoderados/clases` | Listar clases |
| POST | `/:id/apoderados` | Crear apoderados |
| GET | `/:id/apoderados` | Listar apoderados |
| GET | `/:id/quorum` | Obtener quorum |
| PUT | `/:id/quorum` | Actualizar quorum |

---

## 📋 Juntas (Pendiente Documentar)

```
/api/v2/juntas/...
```

---

## 📂 Repositorio (Pendiente Documentar)

```
/api/v2/storage/...
```

---

## 🔍 Cómo Explorar Endpoints

1. **Revisar código backend:** `../probo-backend/src/`
2. **Usar Postman/Insomnia:** Probar endpoints manualmente
3. **Consultar Swagger (si existe):** `/api/docs`

---

**Última actualización:** Diciembre 3, 2025



