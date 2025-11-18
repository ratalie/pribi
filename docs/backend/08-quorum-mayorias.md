# Quórum y Mayorías (v2)

## Contexto
Define los porcentajes requeridos para instalar y aprobar acuerdos de junta en primera y segunda convocatoria. Este módulo es obligatorio antes de generar actas o flujos de votación.

- **Base path:** `/api/v2/society-profile/{societyProfileId}/quorum`
- **Auth:** `Bearer <token>`
- **Permisos:** `ModuleAccess.SOCIETY`
- **IDs:** Al ser un recurso tabular, el backend genera el identificador y sólo devuelve el `id` en las respuestas.

---

## Crear configuración inicial
- **Método:** `POST`
- **Body (`CrearQuorumSchema`):**
```json
{
  "primeraConvocatoriaSimple": 51,
  "primeraConvocatoriaCalificada": 67,
  "segundaConvocatoriaSimple": 40,
  "segundaConvocatoriaCalificada": 60,
  "quorumMinimoSimple": 10,
  "quorumMinimoCalificado": 20
}
```

### Validaciones
- Cada campo es un número entre `0` y `100`.
- Reglas de negocio aplicadas por Zod:
  - `primeraConvocatoriaSimple >= quorumMinimoSimple`
  - `primeraConvocatoriaCalificada >= quorumMinimoCalificado`
  - `segundaConvocatoriaSimple >= quorumMinimoSimple`
  - `segundaConvocatoriaCalificada >= quorumMinimoCalificado`
- **Respuesta (`201`):** devuelve `id` de la configuración.

---

## Actualizar porcentajes
- **Método:** `PUT`
- **Body (`ActualizarQuorumSchema`):** todos los campos son opcionales pero deben respetar el rango 0–100. El backend volverá a validar las desigualdades mínimas.
- **Respuesta (`200`):** mensaje de confirmación.

---

## Consultar configuración actual
- **Método:** `GET`
- **Respuesta (`200`):** objeto con los valores vigentes.
```json
{
  "success": true,
  "data": {
    "id": "019b3fe1-...",
    "primeraConvocatoriaSimple": 51,
    "primeraConvocatoriaCalificada": 67,
    "segundaConvocatoriaSimple": 40,
    "segundaConvocatoriaCalificada": 60,
    "quorumMinimoSimple": 10,
    "quorumMinimoCalificado": 20
  }
}
```

---

## Errores frecuentes
| Código | Motivo | Recomendación |
| --- | --- | --- |
| `400` | Porcentajes fuera de rango o reglas incumplidas (ej. 5 < quorum mínimo) | Validar formularios en UI; mostrar mensaje exacto |
| `401` | Token inválido | Reautenticar |
| `403` | Falta permiso `WRITE/UPDATE` | Revisar rol | 
| `404` | Configuración inexistente al hacer `GET/PUT` | Asegurar que se haya creado previamente |

## Checklist Frontend
- Utilizar sliders o inputs con restricción `0-100`.
- Aplicar validaciones cruzadas (≥ quórum mínimo) antes de enviar.
- Guardar `societyProfileId` en el estado global.
- Mostrar confirmaciones claras cuando se actualicen valores.
- Considerar tooltips para explicar qué representa cada porcentaje (simple vs calificado).
