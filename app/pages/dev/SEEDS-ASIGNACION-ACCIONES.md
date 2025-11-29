# Aislamiento de Código de Seeds - Asignación de Acciones

## 📋 Resumen

El código de **asignación de acciones** en el seeds page (`seeds-sociedades.vue`) está **aislado** del código de producción para evitar conflictos cuando tu compañero haga merge de sus cambios.

## ✅ Solución Implementada

En lugar de usar los use cases y repositorios de asignación de acciones (que tu compañero está desarrollando), el seeds page ahora usa una **función helper directa** que hace `$fetch` directamente al endpoint.

### Código Aislado

**Ubicación:** `app/pages/dev/seeds-sociedades.vue`

**Función helper:**
```typescript
const createAsignacionAccionesDirect = async (
  societyId: string,
  payload: { ... }
): Promise<void> => {
  // Usa $fetch directamente, sin depender de use cases
}
```

## 🗑️ Archivos que Pueden Eliminarse (Opcional)

Si tu compañero crea su propia implementación completa de asignación de acciones, estos archivos que creé **pueden eliminarse** sin afectar el seeds page:

### Archivos Creados por Seeds (Pueden Eliminarse):

1. `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/application/use-cases/create-asignacion-acciones.use-case.ts`
2. `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/infrastructure/repositories/asignacion-acciones.http.repository.ts`
3. `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/ports/asignacion-acciones.repository.ts`
4. `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/application/use-cases/index.ts`
5. `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/ports/index.ts`
6. `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/infrastructure/index.ts`
7. `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/application/index.ts`
8. `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/index.ts`

### ⚠️ IMPORTANTE

**NO elimines estos archivos si:**
- Tu compañero aún no ha creado su implementación
- Necesitas que el seeds page funcione mientras tanto

**SÍ puedes eliminarlos si:**
- Tu compañero ya tiene su implementación completa
- Quieres limpiar código duplicado

## 🔒 Protección Contra Conflictos

El seeds page **NO depende** de estos archivos, así que:

✅ Si tu compañero modifica/elimina los use cases → El seeds page sigue funcionando  
✅ Si tu compañero cambia la estructura → El seeds page no se rompe  
✅ Si hay conflictos de merge → Solo afecta a los archivos de asignación de acciones, no al seeds

## 📝 Nota para el Equipo

Cuando tu compañero termine su implementación de asignación de acciones:

1. **Revisar** si los archivos que creé son necesarios o pueden eliminarse
2. **Verificar** que el seeds page sigue funcionando (debería, porque está aislado)
3. **Actualizar** este documento si es necesario

---

**Última actualización:** 2025-01-29  
**Mantenedor:** Revisar cuando se complete la implementación de asignación de acciones

