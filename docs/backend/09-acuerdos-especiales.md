# Acuerdos Especiales (v2)

## Contexto
Registra disposiciones especiales pactadas entre accionistas (derecho de preferencia, restricciones a terceros, etc.). Normalmente se alimenta con archivos de respaldo.

- **Base path:** `/api/v2/society-profile/{societyProfileId}/special-agreements`
- **Auth:** `Bearer <token>`
- **Permisos:** `ModuleAccess.SOCIETY`

---

## Crear acuerdo especial
- **Método:** `POST`
- **Body (`crearAcuerdoEspecialSchema`):**
```json
{
  "derechoPreferencia": true,
  "archivoEstatutos": "019b4011-aaaa-bbbb-cccc-1234567890ab",
  "archivoAccionistas": "019b4011-dead-beef-cafe-1234567890ac",
  "archivoTerceros": null
}
```

### Validaciones
| Campo | Tipo | Descripción |
| --- | --- | --- |
| `derechoPreferencia` | boolean | Obligatorio. Indica si existe pacto de preferencia. |
| `archivoEstatutos` | uuid? | Documenta versión de estatutos; opcional. |
| `archivoAccionistas` | uuid? | Documentación dirigida a accionistas; opcional. |
| `archivoTerceros` | uuid? | Documentación para terceros; opcional. |

- **Respuesta (`201`):** sin payload; confirmar con `GET`.

---

## Actualizar acuerdo
- **Método:** `PUT`
- **Body (`actualizarAcuerdoEspecialSchema`):** campos opcionales (misma semántica que creación).
- **Respuesta (`200`):** confirmación.

> El backend sobrescribe únicamente los campos enviados. Envía `null` explícito si deseas limpiar una referencia de archivo.

---

## Consultar acuerdo vigente
- **Método:** `GET`
- **Respuesta (`200`):**
```json
{
  "derechoPreferencia": true,
  "archivoEstatutos": {
    "id": "019b4011-aaaa-bbbb-cccc-1234567890ab",
    "version": 2
  },
  "archivoAccionistas": null,
  "archivoTerceros": null
}
```
*(La estructura exacta depende del mapper; los archivos suelen incluir metadatos como `id` y `version`.)*

---

## Errores frecuentes
| Código | Motivo | Recomendación |
| --- | --- | --- |
| `400` | Payload inválido (sin `derechoPreferencia`) | Validar formulario antes de enviar |
| `401` | Token inválido | Reautenticar |
| `403` | Falta de permisos | Verificar rol |
| `404` | `societyProfileId` inexistente o sin registro previo | Crear primero con `POST` |

## Checklist Frontend
- Confirmar existencia del registro mediante `GET`; si responde `404`, mostrar formulario de alta.
- Gestionar uploads antes de llamar al endpoint y guardar los `fileId` devueltos.
- Permitir limpiar archivos enviando `null` explícito en el campo correspondiente.
- Mostrar indicador del estado de `derechoPreferencia` y vincularlo con la UI de acciones.
- Mantener `societyProfileId` en el estado de la vista para reutilizar en otros módulos.
