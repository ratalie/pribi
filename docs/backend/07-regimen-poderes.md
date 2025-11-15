# Régimen de Poderes (v2)

## Contexto

Administra los **poderes corporativos** y sus **otorgamientos** (reglas de firma y límites monetarios). Depende de las clases de apoderados y apoderados creados en el paso anterior.

- **Base path:** `/api/v2/society-profile/{societyProfileId}/powers-regime`
- **Auth:** `Bearer <token>`
- **Permisos:** `ModuleAccess.SOCIETY`
- **IDs:** Los poderes y otorgamientos se crean sin enviar `id`. El backend los genera y los devuelve en las respuestas; sólo las reglas monetarias y los signers existentes conservan sus propios UUID cuando se actualizan.

---

## 1. Poderes (`/powers`)

### Crear poder

- **Método:** `POST /powers`
- **Body (`CrearPoderES`):**

```json
{
  "id": "019b3d90-aaaa-bbbb-cccc-1234567890ab",
  "nombre": "Facultad administrativa",
  "archivoId": "019b3d90-ffff-eeee-dddd-1234567890ab"
}
```

- Reglas:
  - `id` lo genera el frontend antes de enviar (para mantener trazabilidad e idempotencia).
  - `archivoId` sólo se envía cuando hay un archivo asociado; si el flujo actual omite anexos, puede eliminarse del payload.
- **Respuesta (`201`):** retorna confirmación y el `id` aceptado.

### Actualizar poder

- **Método:** `PUT /powers`
- **Body (`ActualizarPoderES`):** incluye `id` y campos opcionales (`nombre`, `archivoId`).
- **Respuesta (`200`):** mensaje de confirmación.

### Listar poderes

- **Método:** `GET /powers`
- **Respuesta (`200`):** arreglo con cada poder y sus metadatos.

```json
{
  "success": true,
  "data": [
    {
      "id": "019b3d90-...",
      "nombre": "Facultad administrativa",
      "archivo": {
        "id": "019b3d90-...",
        "version": 1
      }
    }
  ]
}
```

_(estructura referencial, puede ampliarse con campos adicionales según handler)_

---

## 2. Otorgamientos de poder (`/power-grants`)

Asocia un poder con reglas de firma y límites económicos.

### Crear otorgamiento

- **Método:** `POST /power-grants`
- **Body (`CrearOtorgamientoPoderES`):**

```json
{
  "poderId": "019b3d90-aaaa-bbbb-cccc-1234567890ab",
  "tieneReglasFirma": true,
  "reglasMonetarias": [
    {
      "tipoMoneda": "PEN",
      "montoDesde": 0,
      "tipoLimite": "MONTO",
      "montoHasta": 20000,
      "tipoFirma": "FIRMA_CONJUNTA"
    }
  ]
}
```

- **Validaciones:**
  - Si `tieneReglasFirma = true` debe enviarse al menos una `reglaMonetaria`.
  - `tipoMoneda`: `PEN` o `USD`.
  - `tipoLimite`: `MONTO` o `SIN_LIMITE`. Si es `MONTO`, se recomienda enviar `montoHasta`.
  - `tipoFirma`: `SOLA_FIRMA` o `FIRMA_CONJUNTA`.
- **Respuesta (`201`):** entrega estructura creada (id, reglas, etc.).

### Actualizar otorgamiento

- **Método:** `PUT /power-grants`
- **Body (`ActualizarOtorgamientoPoderES`):** similar a creación pero con `id` y campos opcionales.
- **Respuesta (`200`):** mensaje OK.

### Listar otorgamientos

- **Método:** `GET /power-grants`
- **Respuesta (`200`):** arreglo con cada otorgamiento, sus reglas y apoderados asignados.

```json
{
  "success": true,
  "data": [
    {
      "id": "019b3ecf-...",
      "poderId": "019b3d90-...",
      "tieneReglasFirma": true,
      "reglasMonetarias": [
        {
          "id": "019b3ed0-...",
          "tipoMoneda": "PEN",
          "montoDesde": 0,
          "montoHasta": 20000,
          "tipoLimite": "MONTO",
          "tipoFirma": "FIRMA_CONJUNTA",
          "signers": []
        }
      ]
    }
  ]
}
```

---

## 3. Reglas monetarias con firmantes (`/power-grants/{powerGrantId}/monetary-rules`)

Permite actualizar reglas existentes y asociar firmantes por clase de apoderado.

### Actualizar regla monetaria

- **Método:** `PUT`
- **Body (`ActualizarReglaMonetariaES`):**

```json
{
  "id": "019b3ed0-aaaa-bbbb-cccc-1234567890ab",
  "tipoMoneda": "USD",
  "montoDesde": 1000,
  "tipoLimite": "SIN_LIMITE",
  "tipoFirma": "FIRMA_CONJUNTA",
  "signers": [
    {
      "claseApoderadoId": "019b3a00-...",
      "cantidadMiembros": 2
    }
  ]
}
```

- `signers` requiere `claseApoderadoId` (creado en paso 6) y `cantidadMiembros` > 0.
- **Respuesta (`200`):** confirmación.

---

## Integración con otros módulos

- Las **clases de apoderados** y **apoderados** provienen del paso 6.
- Los **archivos (`archivoId`)** deben existir en el repositorio de documentos.
- `reglasMonetarias` enlazan con el flujo de **registro de apoderados** mediante `signers`, por lo que el frontend debe ofrecer selectores de clase y número de firmantes requeridos.

## Errores frecuentes

| Código | Motivo                                                                  | Recomendación                       |
| ------ | ----------------------------------------------------------------------- | ----------------------------------- |
| `400`  | Zod validation (sin reglas cuando `tieneReglasFirma`, montos negativos) | Validar formularios antes de enviar |
| `401`  | Token inválido                                                          | Reautenticar                        |
| `403`  | Falta permiso `WRITE/UPDATE`                                            | Revisar rol                         |
| `404`  | `poderId`/`powerGrantId` inexistente                                    | Refrescar catálogos                 |
| `409`  | Reglas duplicadas o inconsistentes                                      | Mostrar mensaje del backend         |

## Checklist Frontend

- Cargar ambos catálogos (`/powers`, `/power-grants`) al abrir la sección.
- Permitir adjuntar archivos y guardar `archivoId` antes de crear el poder.
- Validar que la suma de reglas cubra los casos de negocio (por ejemplo, límites por tramos).
- Mostrar tabla con reglas y opción de editar firmantes (`signers`).
- Controlar formatos numéricos (usar decimales en montos) y enumeraciones (`tipoFirma`, `tipoMoneda`).
