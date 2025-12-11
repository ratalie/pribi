# 🔧 Corrección: Filtro de Carpetas de Juntas

## ❌ Problema Identificado

El filtro en `obtenerCarpetasJuntas` solo aceptaba carpetas con **nombres numéricos** (flowId):

```typescript
// ❌ ANTES: Solo aceptaba nombres numéricos
return /^\d+$/.test(node.name);  // "4", "8", "3" ✅ | "11 de diciembre del 2025" ❌
```

**Resultado**: Las carpetas nuevas con nombres legibles (ej: "11 de diciembre del 2025") **NO aparecían** en la lista, aunque sí existían en el backend.

---

## ✅ Solución

Actualizar el filtro para aceptar **ambos tipos** de nombres:

1. **Nombres numéricos** (carpetas antiguas): `"4"`, `"8"`, `"3"`
2. **Nombres legibles** (carpetas nuevas con `folderName`): `"11 de diciembre del 2025"`

### Código Actualizado

```typescript
// ✅ AHORA: Acepta nombres numéricos Y nombres legibles (fechas)
const esNumerico = /^\d+$/.test(node.name);  // "4", "8", "3"
const esFechaLegible = /^\d+\s+de\s+\w+\s+del\s+\d{4}$/.test(node.name);  // "11 de diciembre del 2025"
return esNumerico || esFechaLegible;
```

### Exclusión de Carpetas del Sistema

También se excluyen carpetas del sistema que NO son juntas individuales:

```typescript
const carpetasSistema = [
  "aumento capital",
  "designación y/o remoción",
  "estados financieros y reparto de dividendos",
];
```

---

## 📋 Patrones de Nombres Aceptados

| Tipo | Patrón | Ejemplo | ¿Se muestra? |
|------|--------|---------|--------------|
| **Numérico (antiguo)** | `^\d+$` | `"4"`, `"8"`, `"3"` | ✅ Sí |
| **Fecha legible (nuevo)** | `^\d+\s+de\s+\w+\s+del\s+\d{4}$` | `"11 de diciembre del 2025"` | ✅ Sí |
| **Carpeta sistema** | - | `"aumento capital"` | ❌ No |
| **Carpeta sistema** | - | `"designación y/o remoción"` | ❌ No |

---

## ✅ Resultado Esperado

Después de esta corrección:

1. ✅ Carpetas con nombres numéricos (antiguas) se muestran: "Junta #4", "Junta #8"
2. ✅ Carpetas con nombres legibles (nuevas) se muestran: "11 de diciembre del 2025"
3. ✅ Carpetas del sistema NO se muestran como juntas individuales
4. ✅ La UI muestra todas las carpetas de juntas correctamente

---

## 🧪 Prueba

1. Crear una carpeta de junta con `folderName`: "11 de diciembre del 2025"
2. Subir documentos a esa carpeta
3. Navegar a `/storage/documentos-generados/5/operaciones/junta-accionistas`
4. Verificar que la carpeta "11 de diciembre del 2025" aparece en la lista
5. Verificar que al hacer clic, muestra los documentos subidos

