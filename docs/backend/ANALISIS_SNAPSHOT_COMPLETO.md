# 📊 Análisis: Snapshot Completo del Registro de Sociedad

## 🎯 Objetivo

El endpoint de snapshot debe devolver **TODOS los pasos del registro de sociedad** clonados cuando se crea una junta, para que el frontend tenga acceso completo a toda la información de la sociedad en ese momento.

---

## 📋 Pasos del Registro de Sociedad

Según la estructura del módulo `register-society-profile`, los pasos son:

1. ✅ **0. Initiate Registration** - Inicio del registro
2. ✅ **1. Define Society Details** - Detalles de la sociedad
3. ✅ **2. Shareholder** - Accionistas
4. ✅ **3. Capital Social** - Valor nominal y clases de acciones
5. ✅ **4. Share Assignment** - Asignación de acciones
6. ❌ **5. Directory** - Directorio
7. ❌ **6. Attorney Register** - Apoderados
8. ❌ **7. Powers Regime** - Régimen de poderes
9. ❌ **8. Quorums Majorities** - Quorums y mayorías
10. ❌ **9. Special Agreements** - Acuerdos societarios

---

## 🔍 Estado Actual: ¿Qué se Clona?

### ✅ **LO QUE SÍ SE CLONA** (en `CloneSocietyStructuresService`)

Cuando se crea una junta, actualmente se clonan:

1. **Shareholders (Accionistas)**
   - ✅ Estructura de accionistas (`ShareholderStructure`)
   - ✅ Todos los accionistas con sus datos de personas completos
   - ✅ Relaciones con personas (natural, jurídica, etc.)

2. **Capital Social**
   - ✅ Valor nominal (`NominalValue`)
   - ✅ Clases de acciones (`ShareClass`) con archivos

3. **Asignación de Acciones**
   - ✅ Estructura de asignaciones (`ShareAllocationStructure`)
   - ✅ Todas las asignaciones de acciones

4. **Configuración de Junta**
   - ✅ Configuración inicial (`GeneralMeetingConfigV2`)

### ❌ **LO QUE NO SE CLONA**

Los siguientes pasos **NO se están clonando** actualmente:

1. **Directory (Directorio)**
   - ❌ No se clona la estructura del directorio
   - ❌ No se clonan los directores
   - ⚠️ Hay un campo `designationRemovalDirectorId` en el schema pero no se usa en la clonación

2. **Attorney Register (Apoderados)**
   - ❌ No se clona el registro de apoderados
   - ❌ No se clonan los apoderados
   - ⚠️ Hay un campo `designationRemovalManagerId` en el schema pero no se usa en la clonación

3. **Powers Regime (Poderes)**
   - ❌ No se clona el régimen de poderes
   - ❌ No se clonan los poderes
   - ❌ No se clonan las concesiones de poderes
   - ⚠️ Hay un campo `powerRegimenFlowId` en el schema pero no se usa en la clonación

4. **Quorums Majorities (Quorums)**
   - ❌ No se clona la configuración de quorums
   - ⚠️ No hay campo en `SocietyGeneralFlowStructureV2` para quorums

5. **Special Agreements (Acuerdos Societarios)**
   - ❌ No se clonan los acuerdos societarios
   - ⚠️ No hay campo en `SocietyGeneralFlowStructureV2` para acuerdos societarios

---

## 📤 Estado Actual: ¿Qué Devuelve el Endpoint?

### ✅ **LO QUE SÍ DEVUELVE** (`GET /snapshot/complete`)

El endpoint actual devuelve:

```json
{
  "shareholderId": "uuid",
  "nominalValueId": "uuid",
  "shareAllocationId": "uuid",
  "meetingConfigId": "uuid",
  "nominalValue": 10.50,
  "shareClasses": [...],      // ✅ Clases de acciones
  "shareholders": [...],      // ✅ Accionistas
  "shareAllocations": [...],  // ✅ Asignaciones
  "meetingConfig": {...},     // ✅ Configuración de junta
  "flowInfo": {...}
}
```

### ❌ **LO QUE NO DEVUELVE**

El endpoint **NO devuelve**:

- ❌ **Directory** - Directorio y directores
- ❌ **Attorneys** - Apoderados
- ❌ **Powers** - Poderes y concesiones
- ❌ **Quorums** - Configuración de quorums
- ❌ **Special Agreements** - Acuerdos societarios

---

## 🔧 Solución Completa

Para que el endpoint devuelva **TODO el registro de sociedad**, necesitamos:

### **Fase 1: Extender la Clonación** ⚠️ **CRÍTICO**

Modificar `CloneSocietyStructuresService` para clonar también:

1. **Directory**
   - Clonar `DirectoryV2` con todos sus directores (`DirectorV2`)
   - Guardar el ID en `designationRemovalDirectorId` (o crear nuevo campo si es necesario)

2. **Attorney Registry**
   - Clonar `AttorneyRegistryV2` con todas las clases de apoderados (`AttorneyClass`)
   - Clonar todos los apoderados (`Attorney`) con sus relaciones
   - Guardar el ID en `designationRemovalManagerId` (o crear nuevo campo)

3. **Power Regime**
   - Clonar `PowerRegimen` con todos los poderes (`Power`)
   - Clonar todas las concesiones de poderes (`PowerGrant`)
   - Guardar el ID en `powerRegimenFlowId` (ya existe en el schema)

4. **Quorums**
   - Clonar `QuorumV2`
   - ⚠️ **Necesita nuevo campo** en `SocietyGeneralFlowStructureV2` (ej: `quorumId`)

5. **Special Agreements**
   - Clonar `SpecialAgreementsV2` con todos sus archivos
   - ⚠️ **Necesita nuevo campo** en `SocietyGeneralFlowStructureV2` (ej: `specialAgreementsId`)

### **Fase 2: Extender el Endpoint**

Modificar `GetSnapshotCompleteHandler` para obtener y devolver:

1. **Directory**
   - Obtener directorio usando el ID clonado
   - Obtener todos los directores del directorio clonado

2. **Attorneys**
   - Obtener registro de apoderados usando el ID clonado
   - Obtener todas las clases de apoderados
   - Obtener todos los apoderados

3. **Powers**
   - Obtener régimen de poderes usando el ID clonado
   - Obtener todos los poderes
   - Obtener todas las concesiones de poderes

4. **Quorums**
   - Obtener configuración de quorums usando el ID clonado

5. **Special Agreements**
   - Obtener acuerdos societarios usando el ID clonado

### **Fase 3: Actualizar el DTO**

Extender `SnapshotCompleteDto` para incluir:

```typescript
{
  // ... campos existentes
  directory: DirectoryDto | null;
  attorneys: AttorneyDto[];
  powers: PowerRegimeDto | null;
  quorums: QuorumDto | null;
  specialAgreements: SpecialAgreementDto | null;
}
```

---

## 📝 Resumen: Antes vs Ahora vs Solución

| Paso del Registro | ¿Se Clona? | ¿Se Devuelve? | Solución |
|-------------------|------------|---------------|----------|
| **Accionistas** | ✅ Sí | ✅ Sí | ✅ Completo |
| **Capital Social** | ✅ Sí | ✅ Sí | ✅ Completo |
| **Asignación Acciones** | ✅ Sí | ✅ Sí | ✅ Completo |
| **Directorio** | ❌ No | ❌ No | ⚠️ **Necesita clonación + endpoint** |
| **Apoderados** | ❌ No | ❌ No | ⚠️ **Necesita clonación + endpoint** |
| **Poderes** | ❌ No | ❌ No | ⚠️ **Necesita clonación + endpoint** |
| **Quorums** | ❌ No | ❌ No | ⚠️ **Necesita clonación + endpoint + campo en schema** |
| **Acuerdos Societarios** | ❌ No | ❌ No | ⚠️ **Necesita clonación + endpoint + campo en schema** |

---

## 🚀 Plan de Acción

### **Paso 1: Modificar el Schema** (si es necesario)

Agregar campos a `SocietyGeneralFlowStructureV2` si no existen:
- `quorumId` (String? @unique @db.Uuid)
- `specialAgreementsId` (String? @unique @db.Uuid)

### **Paso 2: Extender la Clonación**

Modificar `CloneSocietyStructuresService.cloneFromSocietyStructure()` para:
1. Cargar todos los datos de la sociedad (directory, attorneys, powers, quorums, agreements)
2. Clonar cada estructura con nuevos IDs
3. Retornar todos los IDs clonados

### **Paso 3: Actualizar el Handler de Creación**

Modificar `CreateFlowBaseHandler` para guardar todos los IDs clonados en `SocietyGeneralFlowStructure`.

### **Paso 4: Extender el Endpoint**

Modificar `GetSnapshotCompleteHandler` para:
1. Obtener todos los IDs del snapshot
2. Cargar todos los datos clonados en paralelo
3. Retornar todo en el DTO

### **Paso 5: Actualizar el DTO**

Extender `SnapshotCompleteDto` con todos los nuevos campos.

---

## ⚠️ Consideraciones Importantes

1. **Migración de Base de Datos**: Si agregamos campos al schema, necesitamos una migración.

2. **Datos Opcionales**: Algunos pasos pueden no estar completos en la sociedad original, por lo que pueden ser `null` en el snapshot.

3. **Relaciones Complejas**: Algunas estructuras tienen relaciones complejas (ej: poderes con concesiones, apoderados con clases) que deben clonarse correctamente.

4. **Performance**: Clonar más datos puede afectar el tiempo de creación de la junta. Considerar optimizaciones si es necesario.

---

## ✅ Conclusión

**Estado Actual:**
- Solo se clonan 4 de 10 pasos (40%)
- El endpoint solo devuelve 4 de 10 pasos (40%)

**Solución:**
- Extender la clonación para incluir todos los pasos
- Extender el endpoint para devolver todos los pasos
- Con esto, el frontend tendrá acceso completo al snapshot del registro de sociedad

**¿Quieres que implemente la solución completa?**

