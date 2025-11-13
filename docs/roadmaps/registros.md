## Roadmap - Dominio `@registros`

> Documento vivo. Actualizar en cada iteración para mantener trazabilidad del trabajo en Registro de Sociedades/Sucursales sin afectar `@registro-societario`.

### Estado Actual (13 Nov 2025)
- Layout dedicado `registros` activo y aplicado a las vistas de sociedades y sucursales.
- Sidebar muestra nueva sección `Registros` con submenús para Sociedades y Sucursales.
- Páginas base creadas:
  - `sociedades`: dashboard, agregar, historial + flujos crear/editar existentes apuntando al layout.
  - `sucursales`: dashboard, agregar, historial (placeholder UI en progreso).
- Documentación inicial de arquitectura hexagonal (`docs/architecture/registro-sociedades.md`).

### Próximos Pasos Propuestos
1. **Infraestructura Hexagonal**
   - [ ] Crear skeleton `app/hexag/registro-sociedades` (entidades, repositorios, casos de uso).
   - [ ] Configurar `app/infra/http/registros/sociedades` y mocks MSW.
2. **Capa Aplicación**
   - [ ] Implementar store Pinia `sociedadVista.store.ts`.
   - [ ] Composable `useSociedadVista` con init/hydrate y banderas `source`.
3. **UI & Flujos**
   - [ ] Conectar página `agregar sociedad` al flujo hexagonal (submit → mock POST).
   - [ ] Diseñar placeholders funcionales para formulario sucursales (similar a sociedades).
4. **Documentación**
   - [ ] Registrar decisiones y endpoints simulados en este roadmap.
   - [ ] Añadir diagrama de flujo en `docs/architecture/registro-sociedades.md`.

### Consideraciones
- Mantener aislados `@registros` y `@registro-societario` hasta que el nuevo dominio esté estable.
- `junta-accionistas` tendrá su propio layout y roadmap independiente (no abordado en esta fase).
- Todas las pruebas y mocks deben activarse vía MSW para no tocar backend real durante refactor.

### Registro de Cambios
- **13/11/2025**: Sección `Registros` habilitada en sidebar; páginas base para sociedades y sucursales conectadas al layout. Documento creado.

