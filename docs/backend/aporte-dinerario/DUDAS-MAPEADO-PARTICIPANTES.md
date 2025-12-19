# ❓ DUDAS COMPLETAS: Mapeado de Participantes

**Fecha:** 2025-01-19  
**Objetivo:** Identificar TODAS las dudas antes de implementar el mapeo de participantes

---

## 🔍 DUDAS SOBRE ESTRUCTURA DE DATOS DEL BACKEND

### **1. Estructura de `person`**

**❓ Duda 1.1:** ¿El backend SIEMPRE devuelve `person` con estructura anidada?

```json
{
  "person": {
    "id": "uuid",
    "type": "NATURAL", // ❓ ¿Siempre "type" o a veces "tipo"?
    "natural": {
      "firstName": "Juan", // ❓ ¿Siempre en inglés?
      "lastNamePaternal": "Pérez",
      "lastNameMaternal": "García",
      "typeDocument": "DNI",
      "documentNumber": "12345678"
    },
    "juridic": null
  }
}
```

**❓ Duda 1.2:** ¿O a veces viene en formato plano (ya mapeado)?

```json
{
  "person": {
    "id": "uuid",
    "tipo": "NATURAL", // ❓ ¿Puede venir en español?
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García"
  }
}
```

**❓ Duda 1.3:** ¿El backend usa `type: "JURIDIC"` o `type: "JURIDICA"`?

- Documentación dice: `"type": "NATURAL"` o `"type": "JURIDIC"`
- Pero otros mappers esperan: `"JURIDICA"` o `"JURIDIC"`
- ¿Cuál es el correcto?

**❓ Duda 1.4:** ¿Para persona jurídica, el campo es `businessName` o `reasonSocial`?

- Documentación muestra: `"businessName"` en `juridic`
- Pero otros mappers buscan: `reasonSocial` o `razonSocial`
- ¿Cuál es el correcto?

---

### **2. Campo `personId`**

**❓ Duda 2.1:** ¿El backend devuelve `personId` en el nivel raíz del participante?

```json
{
  "id": "uuid-participante",
  "personId": "uuid-persona", // ❓ ¿Viene este campo?
  "person": { "id": "uuid-persona" }
}
```

**❓ Duda 2.2:** ¿O solo viene `person.id` y debo extraerlo?

- Si solo viene `person.id`, ¿debo crear `personId` desde `person.id`?
- ¿O el backend ya lo incluye en el nivel raíz?

---

### **3. Campo `allocationShare`**

**❓ Duda 3.1:** ¿El backend devuelve `allocationShare` en la respuesta de participantes?

```json
{
  "id": "uuid",
  "person": { ... },
  "allocationShare": [  // ❓ ¿Viene este campo?
    {
      "id": "uuid",
      "action": { "id": "...", "name": "...", "type": "..." },
      "subscribedSharesQuantity": 100,
      "percentagePaidPerShare": 100
    }
  ]
}
```

**❓ Duda 3.2:** ¿O viene con otro nombre?

- ¿Puede ser `shareAllocations`?
- ¿O `allocations`?
- ¿O no viene en la respuesta de participantes?

**❓ Duda 3.3:** ¿Es necesario para mostrar la tabla?

- La tabla muestra "N.º de acciones" y "% Participación"
- ¿Necesito `allocationShare` para calcular esto?
- ¿O puedo mostrar 0 si no viene?

---

### **4. Campo `contributorPermissions`**

**❓ Duda 4.1:** ¿El backend SIEMPRE devuelve `contributorPermissions`?

```json
{
  "contributorPermissions": [
    // ❓ ¿Siempre viene?
    {
      "id": "uuid",
      "module": "CASH",
      "isContributor": false
    }
  ]
}
```

**❓ Duda 4.2:** ¿O puede venir `null` o `undefined`?

- Si no viene, ¿debo usar `isContributor` como fallback?
- ¿O siempre viene aunque esté vacío `[]`?

**❓ Duda 4.3:** ¿El campo `shareholderId` en `ContributorPermission` es necesario?

- La documentación muestra: `{ id, module, isContributor }`
- Pero la interface tiene: `shareholderId`
- ¿Viene en la respuesta o solo `id`?

---

### **5. Campo `contributionModule`**

**❓ Duda 5.1:** ¿El backend SIEMPRE devuelve `contributionModule` como array?

```json
{
  "contributionModule": ["CASH"] // ❓ ¿Siempre array?
}
```

**❓ Duda 5.2:** ¿O puede venir como string?

```json
{
  "contributionModule": "CASH" // ❓ ¿Puede venir así?
}
```

**❓ Duda 5.3:** ¿Puede venir como `null` o `undefined`?

- Si no viene, ¿qué hago?
- ¿Asumo que es del módulo actual (CASH o CREDIT)?

**❓ Duda 5.4:** ¿Puede venir vacío `[]`?

- Si viene vacío, ¿qué significa?
- ¿Es un participante sin módulo asignado?

---

### **6. Campo `typeShareholder`**

**❓ Duda 6.1:** ¿El backend devuelve `"NUEVO_APORTANTE_CASH"` o `"NUEVO_APORTANTE"`?

- Documentación muestra: `"NUEVO_APORTANTE_CASH"` y `"NUEVO_APORTANTE_CREDIT"`
- Pero el código busca: `"NUEVO_APORTANTE"` también
- ¿Cuál es el correcto?

**❓ Duda 6.2:** ¿Para accionistas clonados, siempre es `"ACCIONISTA"`?

- ¿O puede venir otro valor?

---

## 🔍 DUDAS SOBRE MAPEO

### **7. Función de Mapeo**

**❓ Duda 7.1:** ¿Debo crear un mapper similar a `SnapshotMapper.mapPersona()`?

- Ya existe `SnapshotMapper.mapPersona()` que mapea estructura anidada
- ¿Debo reutilizarlo o crear uno nuevo?
- ¿O mapear directamente en `fetchAportantes()`?

**❓ Duda 7.2:** ¿Dónde debo hacer el mapeo?

- ¿En `fetchAportantes()` después de recibir la respuesta?
- ¿O crear una función helper separada?
- ¿O crear un mapper en `infrastructure/mappers`?

**❓ Duda 7.3:** ¿Debo mapear TODOS los campos de `person`?

- ¿O solo los necesarios para mostrar la tabla?
- ¿Qué campos son críticos?

---

### **8. Campos Críticos para la Tabla**

**❓ Duda 8.1:** ¿Qué campos son MÍNIMOS para que la tabla funcione?

**Para mostrar nombre:**

- `person.tipo` (NATURAL o JURIDICA)
- `person.nombre` + `person.apellidoPaterno` + `person.apellidoMaterno` (si NATURAL)
- `person.razonSocial` (si JURIDICA)

**Para mostrar documento:**

- `person.tipoDocumento`
- `person.numeroDocumento`

**Para checkbox:**

- `isContributor` o `contributorPermissions`

**Para acciones:**

- `allocationShare` (¿es necesario?)

**❓ Duda 8.2:** ¿Qué pasa si falta algún campo?

- ¿Muestro "Sin nombre"?
- ¿O muestro error?

---

### **9. Tipos de Persona**

**❓ Duda 9.1:** ¿El backend puede devolver otros tipos además de NATURAL y JURIDICA?

- Documentación menciona: SUCURSAL, FONDO_INVERSION, FIDEICOMISO, SUCESION_INDIVISA
- ¿Vienen en participantes?
- ¿O solo en snapshot?

**❓ Duda 9.2:** ¿Cómo mapeo estos tipos?

- ¿Tienen estructura similar a JURIDICA?
- ¿Qué campos específicos tienen?

---

## 🔍 DUDAS SOBRE LA VISTA ANTERIOR

### **10. Estructura de la Vista**

**❓ Duda 10.1:** ¿Cómo estaba estructurada la vista antes?

- ¿Qué componentes usaba?
- ¿Qué datos mostraba en la tabla?
- ¿Cómo se veía visualmente?

**❓ Duda 10.2:** ¿La vista mostraba solo participantes o también otra información?

- ¿Mostraba resumen?
- ¿Mostraba totales?
- ¿Tenía filtros?

**❓ Duda 10.3:** ¿Cómo se manejaban los "nuevos participantes"?

- ¿Se mostraban de forma diferente?
- ¿Tenían acciones especiales (editar/eliminar)?

---

## 🔍 DUDAS SOBRE COMPATIBILIDAD

### **11. Compatibilidad con Código Existente**

**❓ Duda 11.1:** ¿El componente `AportantesTable.vue` espera estructura plana?

- La función `getNombre()` espera: `person.tipo`, `person.nombre`, `person.razonSocial`
- ¿Debo mapear antes de pasar a la tabla?
- ¿O el componente debe manejar ambos formatos?

**❓ Duda 11.2:** ¿Otros componentes usan la misma estructura?

- `AportesTable.vue` también usa `getNombreAportante()`
- ¿Debo mapear en ambos lugares?
- ¿O crear un mapper compartido?

---

## 🔍 DUDAS SOBRE VALIDACIONES

### **12. Validaciones Necesarias**

**❓ Duda 12.1:** ¿Debo validar que `person` existe antes de mapear?

- ¿Qué hago si `person` es `null` o `undefined`?
- ¿Muestro error o participante vacío?

**❓ Duda 12.2:** ¿Debo validar que `person.natural` o `person.juridic` existe?

- ¿Qué hago si `type: "NATURAL"` pero `natural` es `null`?
- ¿Muestro error o valores por defecto?

**❓ Duda 12.3:** ¿Debo validar campos requeridos?

- ¿Qué campos son obligatorios?
- ¿Qué hago si faltan?

---

## 🔍 DUDAS SOBRE PERSONID Y ASISTENCIA

### **13. Relación con Asistencias**

**❓ Duda 13.1:** ¿Cómo relaciono participantes con asistencias?

- El código actual busca: `participante.personId`
- Pero el backend puede devolver: `person.id`
- ¿Debo extraer `personId` desde `person.id`?

**❓ Duda 13.2:** ¿El `personId` del participante coincide con `accionista.id` de asistencias?

- ¿Son el mismo UUID?
- ¿O son diferentes?

---

## 🔍 DUDAS SOBRE NUEVOS PARTICIPANTES

### **14. Crear Nuevos Participantes**

**❓ Duda 14.1:** ¿El modal `AportanteModal` ya mapea correctamente?

- El modal usa `personaNaturalStore` y `personaJuridicaStore`
- ¿Estos stores ya tienen la estructura correcta para enviar al backend?
- ¿O necesito transformar antes de enviar?

**❓ Duda 14.2:** ¿El payload que envía el modal coincide con lo que espera el backend?

- Backend espera: `{ id, persona: { tipo, nombre, ... } }`
- ¿El modal ya envía así?
- ¿O necesito transformar?

---

## 🔍 DUDAS SOBRE TESTING

### **15. Datos de Prueba**

**❓ Duda 15.1:** ¿Tengo datos de prueba reales del backend?

- ¿Puedo ver una respuesta real de `GET /participants`?
- ¿O debo asumir la estructura de la documentación?

**❓ Duda 15.2:** ¿Hay casos edge que debo considerar?

- ¿Participantes sin `person`?
- ¿Participantes con `person` pero sin `natural` ni `juridic`?
- ¿Participantes con `contributionModule` vacío?

---

## 📋 RESUMEN DE DUDAS CRÍTICAS

### **🔴 CRÍTICAS (Deben resolverse antes de implementar):**

1. ❓ **Estructura de `person`:** ¿Siempre anidada o a veces plana?
2. ❓ **Mapeo de campos:** ¿`firstName` → `nombre` o ya viene mapeado?
3. ❓ **`personId`:** ¿Viene en raíz o solo `person.id`?
4. ❓ **`allocationShare`:** ¿Viene en respuesta o no?
5. ❓ **`contributorPermissions`:** ¿Siempre viene o puede ser `null`?

### **🟡 IMPORTANTES (Afectan funcionalidad):**

6. ❓ **`contributionModule`:** ¿Siempre array o puede ser string?
7. ❓ **`typeShareholder`:** ¿`NUEVO_APORTANTE_CASH` o `NUEVO_APORTANTE`?
8. ❓ **Mapper:** ¿Reutilizar `SnapshotMapper` o crear nuevo?
9. ❓ **Tipos de persona:** ¿Solo NATURAL/JURIDICA o más?

### **🟢 MENORES (Pueden resolverse después):**

10. ❓ **Validaciones:** ¿Qué hacer si faltan campos?
11. ❓ **Edge cases:** ¿Cómo manejar datos incompletos?
12. ❓ **Testing:** ¿Datos de prueba disponibles?

---

## 🎯 PRÓXIMOS PASOS

**Antes de implementar, necesito confirmar:**

1. ✅ Ver una respuesta REAL del backend de `GET /participants`
2. ✅ Confirmar estructura exacta de `person` (anidada vs plana)
3. ✅ Confirmar qué campos vienen siempre vs opcionales
4. ✅ Confirmar nombres exactos de campos (inglés vs español)
5. ✅ Confirmar si `allocationShare` viene en la respuesta

**Una vez resueltas estas dudas, puedo:**

- Crear el mapper correcto
- Mapear los datos en `fetchAportantes()`
- Asegurar que la tabla se carga correctamente

---

**❓ ¿Puedes ayudarme a resolver estas dudas, mi rey?** 🙏
