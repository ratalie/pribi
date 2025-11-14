# Política de UUID en el módulo de Sociedades

## 1. Reglas generales

| Escenario | Ejemplos | ¿Enviamos `id`/`uuid` al backend? | Motivo |
| --- | --- | --- | --- |
| **Registros únicos por sociedad (uno-a-uno)** | Datos principales, Quórums y Mayorías, Directorio, Régimen de poderes, Registro de apoderados, etc. | **No** | El backend infiere el recurso usando `societyProfileId` y crea/actualiza el registro único sin requerir `id` adicional. |
| **Colecciones (uno-a-muchos)** | Accionistas, Poderes individuales, Apoderados, Clases de acciones, Documentos adjuntos, etc. | **Sí** (UUID generado en frontend o devuelto por backend) | Se necesita identificar elementos individuales para editar/eliminar. |

## 2. Implementación en frontend

1. **Formularios de pasos únicos**
   - No generar UUID locales (evitar `crypto.randomUUID()`).
   - Los DTO pueden conservar `id` opcional para lectura (el backend lo devolverá), pero `toPayload` debe omitirlo.
   - Ejemplo aplicado en `DatosSociedadMapper.toPayload`: siempre retorna sólo los campos de negocio.

2. **Colecciones**
   - Cada elemento debe tener un `id` y, cuando corresponda, `idPersona`.
   - El modal debe manejar:
     - `create`: generar uuid local y enviarlo (para trabajar offline/MSW).
     - `update`: reutilizar el uuid existente.
   - El backend responderá con `success/message/code`; el store debe actualizar la lista con los datos retornados.

3. **MSW**
   - Debe seguir las mismas reglas:
     - Pasos únicos: el handler ignora cualquier `id` que llegue y persiste usando `societyProfileId`.
     - Colecciones: el handler guarda cada elemento con su `id` y permite CRUD completo.

## 3. Checklist al implementar un paso nuevo

1. ¿El recurso es único por sociedad?  
   - ✅ Sí → El payload no debe incluir `id`.
   - ❌ No → Asegúrate de tener `uuid` por elemento.
2. ¿El store/controller están usando `ensureLoaded` con `societyProfileId`?
3. ¿MSW replica el mismo contrato (sin id en pasos únicos, con id en colecciones)?
4. ¿La documentación del paso (README) indica si necesita UUID?

## 4. Casos especiales

- **Migraciones antiguas**: si encuentras algún paso único que todavía envía `id`, actualiza su mapper y store para alinearlo con esta política.
- **Accionistas & personas relacionadas**: cada persona y accionista debe mantener su uuid. Usa los ejemplos del backend como referencia para armar los DTOs.

---

Última actualización: Noviembre 14, 2025

