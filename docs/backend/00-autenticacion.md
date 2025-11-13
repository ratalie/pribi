# Autenticación para Registro Societario v2

## Propósito

Este documento describe cómo obtener el `access token` JWT necesario para consumir los endpoints protegidos del flujo de **Registro de Sociedad**.

## Endpoint

- **Método:** `POST`
- **Ruta:** `/api/v1/auth`
- **Autenticación previa:** No requiere

## Encabezados obligatorios

| Header         | Valor              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

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
  "message": "Authentication successful",
  "code": 200,
  "data": {
    "studyName": "Example Study",
    "roleName": "Administrador",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

- Guarda el valor de `data.token`; se utiliza como `Bearer token` en los demás endpoints.

## Manejo de errores comunes

| Código | Motivo                      | Ejemplo                                 |
| ------ | --------------------------- | --------------------------------------- |
| `400`  | Datos faltantes o inválidos | `email` sin formato válido              |
| `401`  | Credenciales incorrectas    | Contraseña errónea                      |
| `429`  | Demasiados intentos         | Reintentar después del periodo indicado |
| `500`  | Error interno               | Contactar a backend                     |

## Uso del token

En cada endpoint protegido agrega el header:

```
Authorization: Bearer <token>
```

Sustituye `<token>` por el JWT obtenido en este paso.
