# Autenticación para Registro Societario v2

## Propósito

Obtener el `access token` JWT que habilita todos los módulos del flujo. El backend también registra la IP y el `User-Agent`, por lo que conviene enviar valores reales.

## Endpoints disponibles

| Versión              | Método | Ruta           | Uso                                     |
| -------------------- | ------ | -------------- | --------------------------------------- |
| **v2 (recomendado)** | `POST` | `/api/v2/auth` | Nueva pila utilizada por los módulos v2 |
| Legacy               | `POST` | `/api/v1/auth` | Sólo para clientes heredados            |

> A menos que se indique lo contrario, usa el endpoint **v2**.

## Encabezados obligatorios

| Header         | Valor                                                  |
| -------------- | ------------------------------------------------------ |
| `Content-Type` | `application/json`                                     |
| `User-Agent`   | `<tu-aplicacion>/<versión>` _(capturado y almacenado)_ |

## Body requerido

```json
{
  "email": "usuario101@gmail.com",
  "password": "#Admin2025-probo!"
}
```

### Validaciones (`LoginDto`)

| Campo      | Tipo   | Reglas                                |
| ---------- | ------ | ------------------------------------- |
| `email`    | string | Formato correo válido (Zod `email()`) |
| `password` | string | Obligatorio                           |

## Respuesta exitosa (`200`)

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso.",
  "code": 200,
  "data": {
    "studyName": "Example Study",
    "roleName": "Administrador",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

- Conserva `data.token`; se utilizará como `Bearer` en los demás endpoints.
- El token incluye `userId`, `studyId`, `email`, `role` y un `jti`; expira a los 7 días.

## Uso del token

En cada request protegida añade:

```
Authorization: Bearer <token>
```

## Errores comunes

| Código | Motivo                                            | Ejemplo                              |
| ------ | ------------------------------------------------- | ------------------------------------ |
| `400`  | Datos faltantes o inválidos                       | `email` sin formato válido           |
| `401`  | Credenciales inválidas (`Credenciales inválidas`) | Contraseña errónea                   |
| `429`  | Demasiados intentos                               | Reintentar después del “retry-after” |
| `500`  | Error interno                                     | Contactar a backend                  |
