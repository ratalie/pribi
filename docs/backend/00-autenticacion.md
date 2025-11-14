# Autenticación para Registro Societario v2

## Propósito
Describe cómo obtener el `access token` JWT requerido para consumir los endpoints protegidos del flujo **Registro de Sociedad v2**. El backend registra también información del dispositivo, por lo que es recomendable enviar un `User-Agent` válido.

## Endpoint
- **Método:** `POST`
- **Ruta:** `/api/v2/auth`
- **Autenticación previa:** No requiere

## Encabezados obligatorios
| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `User-Agent` | `<tu-aplicacion>/<versión>` *(recomendado)* |

## Body requerido
```json
{
  "email": "usuario101@gmail.com",
  "password": "#Admin2025-probo!"
}
```
### Validaciones (`LoginDto`)
| Campo | Tipo | Reglas |
| --- | --- | --- |
| `email` | string | Formato correo válido (Zod `email()`) |
| `password` | string | Obligatorio |

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
- Guarda el valor de `data.token`; se utilizará como `Bearer` en los demás endpoints.
- El token incluye `userId`, `studyId`, `email`, `role` y un `jti` para seguimiento; expira a los 7 días.

## Uso del token
En cada endpoint protegido agrega el header:
```
Authorization: Bearer <token>
```
Sustituye `<token>` por el JWT obtenido en este paso.

## Manejo de errores comunes
| Código | Motivo | Ejemplo |
| --- | --- | --- |
| `400` | Datos faltantes o inválidos | `email` sin formato válido |
| `401` | Credenciales inválidas (`Credenciales inválidas`) | Contraseña errónea |
| `429` | Demasiados intentos | Reintentar después del periodo indicado |
| `500` | Error interno | Contactar a backend |
