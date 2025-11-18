# Arquitectura – Vistas iniciales de Sociedades

## Alcance
Describe cómo funcionan las vistas *previas* al flujo paso a paso:

1. `historial` – listado y creación de perfiles.
2. `agregar` – botón/CTA que crea un perfil nuevo y redirige al flujo.
3. `preview` – vista de solo lectura para revisar datos.

## 1. Historial (`app/pages/registro-societario/sociedades/historial.vue`)

- **Store principal**: `useSociedadHistorialStore`
  - Instancia `SociedadHttpRepository`.
  - `cargarHistorial()` llama `ListSociedadesUseCase`.
  - `crearSociedad()` ejecuta `CreateSociedadUseCase` y, si tiene éxito, redirige al paso `datos-sociedad`.
  - Maneja mensajes de error (incluye logs de statusCode).
- **UI**: tarjetas por paso (`SocietyRegisterStep`) y botones para eliminar o continuar.
- **Consideraciones**:
  - Asegurarse de que `withAuthHeaders` encuentre un token (session o `NUXT_PUBLIC_DEFAULT_AUTH_TOKEN`).
  - Cuando se crea una sociedad, guardar el `structureId` devuelto por `/api/v2/society-profile` para usarlo en la URL del flujo.

## 2. Agregar (CTA inicial)

- Puede ser un botón en el historial o una página dedicada (`agregar.vue`).
- Reutiliza el store anterior para crear el perfil.
- Después de crear, `router.push("/registro-societario/sociedades/editar/" + id + "/datos-sociedad")`.
- **Regla**: no debe cargar datos del paso; simplemente crea y redirige. Toda la carga se delega al controller del paso.

## 3. Vista Previa (`app/pages/registros/sociedades/[id]/preview.vue`)

- Usa `useDatosSociedadForm` en modo `PREVISUALIZAR`.
- Hace `datosForm.load("external")` en `bootstrap()` para poblar el formulario en lectura.
- No usa el controller porque sólo necesita una lectura puntual (puede mantenerse así), pero es importante que siga el formato `/api/v2/society-profile/{id}/society`.

## Recomendaciones generales

- **Desacoplar**: las vistas iniciales sólo deberían encargarse de iniciar el flujo o listar entidades. La sincronización real de cada paso debe vivir en los controllers específicos.
- **Tokens**: si se trabaja contra backend, confirmar que `localStorage.pinia.auth.session.token` contiene el JWT. En modo MSW se puede configurar `NUXT_PUBLIC_DEFAULT_AUTH_TOKEN`.
- **Logs**: en `SociedadHttpRepository` se agregaron logs (`list():request`, `list():response`, `list():error`) para validar rápidamente si el token se envía.

---

Última actualización: Noviembre 14, 2025

