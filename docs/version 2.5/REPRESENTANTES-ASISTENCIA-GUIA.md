# 📋 GUÍA COMPLETA: Agregar Representante a Accionista que Asistió

## 🎯 RESUMEN EJECUTIVO

**Tu caso:** Necesitas agregar un representante (Persona Natural) a un accionista que ya asistió a la junta.

**Respuesta corta:**
1. **Backend espera:** Solo el UUID de `PersonV2` (`representedById`)
2. **Problema:** Necesitas crear la persona primero antes de asignarla
3. **Solución:** Crear la persona usando `PersonCreatorService` (como en apoderados), luego asignar el UUID al attendance

---

## 🔍 PARTE 1: CÓMO FUNCIONA EL BACKEND

### **1.1 Endpoint de Asistencia**

**Endpoint:** `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance`

**Payload esperado:**

```typescript
{
  id: string;                    // UUID del registro de asistencia (MeetingAttendanceV2.id)
  attended: boolean;              // Si el accionista asistió
  representedById?: string;      // UUID de PersonV2 que representa al accionista (OPCIONAL)
  isRepresentative: boolean;      // Si el accionista ES representante de otro
}
```

**Ejemplo real:**

```json
{
  "id": "019aeedc-26aa-73ac-8ba0-xxxxx",
  "attended": true,
  "representedById": "019aeedc-26aa-73ac-8ba0-yyyyy",  // ← UUID de PersonV2
  "isRepresentative": false
}
```

### **1.2 Flujo en el Backend**

```
PUT /attendance
    ↓
UpdateAttendanceCommand
    ↓
UpdateAttendanceHandler.execute()
    ↓
attendance.asignarRepresentante(representedById)  // ← Solo necesita el UUID
    ↓
attendance.save() → Prisma.upsert()
    ↓
MeetingAttendanceV2.representedById = UUID
```

**⚠️ IMPORTANTE:** El backend **NO crea la persona**, solo asigna el UUID que ya existe en `PersonV2`.

---

## 🏗️ PARTE 2: ESTRUCTURA DE DATOS

### **2.1 Schema de Base de Datos**

```prisma
model MeetingAttendanceV2 {
  id              String @id @db.Uuid
  meetingConfigId String @db.Uuid
  shareholderId   String @db.Uuid
  
  attended         Boolean @default(false)
  representedById  String? @db.Uuid  // ← Relación con PersonV2
  isRepresentative Boolean @default(false)
  
  representedBy PersonV2? @relation(fields: [representedById], references: [id])
}

model PersonV2 {
  id        String @id @db.Uuid
  type      PersonType  // NATURAL, JURIDICA, etc.
  natural   NaturalV2?
  juridic   JuridicV2?
  
  attendanceRepresentations MeetingAttendanceV2[]  // ← Relación inversa
}

model NaturalV2 {
  id               String @id @db.Uuid
  firstName        String
  lastNamePaternal String
  lastNameMaternal String
  typeDocument     TypeDocument  // DNI, PASAPORTE, etc.
  documentNumber   String
  issuingCountry   String?
  
  person PersonV2? @relation(fields: [id], references: [id])
}
```

### **2.2 DTOs del Backend**

**Request DTO (`RegistroAsistenciaDto`):**

```typescript
{
  id: string;                    // UUID del attendance
  attended: boolean;
  representedById?: string;     // UUID de PersonV2 (OPCIONAL)
  isRepresentative: boolean;
}
```

**Response DTO (`AsistenciaJuntaQueryDto`):**

```typescript
{
  id: string;
  configJuntaId: string;
  accionista: ShareholderReadDto;
  accionesConDerechoVoto: number;
  porcentajeParticipacion: number;
  asistio: boolean;
  representadoPorId: string | null;  // ← UUID del representante
  esRepresentante: boolean;
}
```

---

## 🔄 PARTE 3: FLUJO COMPLETO (Frontend + Backend)

### **3.1 Flujo Actual (Como debería funcionar)**

```
Usuario hace click "Agregar Representante"
    ↓
Modal se abre (PersonaNaturalForm)
    ↓
Usuario llena: DNI, Nombre, Apellidos
    ↓
Usuario hace click "Guardar"
    ↓
Frontend:
  1. Crear PersonV2 + NaturalV2 (POST /api/v2/.../person o similar)
  2. Obtener UUID de la persona creada
  3. Actualizar attendance con representedById (PUT /attendance)
    ↓
Backend:
  1. Recibe representedById
  2. Asigna a MeetingAttendanceV2.representedById
  3. Guarda en BD
    ↓
Frontend:
  - Refresca lista de asistencias
  - Muestra representante asignado
```

### **3.2 Problema Actual**

**❌ NO existe endpoint público para crear PersonV2**

El backend tiene `PersonCreatorService`, pero solo se usa internamente en:
- Crear accionistas
- Crear apoderados
- Crear directores
- Crear participantes de aportes dinerarios

**No hay un endpoint HTTP directo** como `POST /api/v2/person` o similar.

---

## 💡 PARTE 4: SOLUCIONES POSIBLES

### **Opción A: Crear Endpoint para Personas (RECOMENDADO)**

**Ventajas:**
- ✅ Separación de responsabilidades
- ✅ Reutilizable para otros casos
- ✅ Arquitectura limpia

**Implementación:**

1. **Crear endpoint:** `POST /api/v2/person/natural`
2. **Payload:**
   ```json
   {
     "tipoDocumento": "DNI",
     "numeroDocumento": "12345678",
     "nombre": "Juan",
     "apellidoPaterno": "Pérez",
     "apellidoMaterno": "García",
     "paisEmision": "PE"
   }
   ```
3. **Response:**
   ```json
   {
     "id": "019aeedc-26aa-73ac-8ba0-yyyyy",
     "tipo": "NATURAL",
     ...
   }
   ```
4. **Luego:** Usar ese `id` en `PUT /attendance` con `representedById`

**Tiempo estimado:** 2-3 horas

---

### **Opción B: Extender Endpoint de Attendance (RÁPIDO)**

**Ventajas:**
- ✅ Rápido de implementar
- ✅ No requiere nuevo endpoint

**Implementación:**

1. **Modificar DTO de attendance:**
   ```typescript
   {
     id: string;
     attended: boolean;
     representedById?: string;  // Si existe, usar directamente
     representante?: {          // Si NO existe, crear persona
       tipoDocumento: string;
       numeroDocumento: string;
       nombre: string;
       apellidoPaterno: string;
       apellidoMaterno: string;
       paisEmision?: string;
     };
     isRepresentative: boolean;
   }
   ```

2. **En el handler:**
   ```typescript
   if (dto.representante && !dto.representedById) {
     // Crear persona primero
     const persona = await this.personCreatorService.createPerson([...]);
     dto.representedById = persona[0].id;
   }
   
   if (dto.representedById) {
     attendance.asignarRepresentante(dto.representedById);
   }
   ```

**Tiempo estimado:** 1-2 horas

---

### **Opción C: Reutilizar Endpoint de Apoderados (HACK)**

**Ventajas:**
- ✅ Ya existe
- ✅ Funciona

**Desventajas:**
- ❌ Crea un apoderado innecesario
- ❌ No es semánticamente correcto
- ❌ Puede causar confusión

**NO RECOMENDADO** ⚠️

---

## 📝 PARTE 5: RESPUESTAS A TUS PREGUNTAS

### **Pregunta 1: ¿Qué quieres hacer AHORA?**

**Respuesta recomendada:** **Opción A** (Crear endpoint para personas)

**Razón:** Es la solución más limpia y reutilizable. Otros módulos también podrían necesitar crear personas sin crear entidades relacionadas (accionistas, apoderados, etc.).

---

### **Pregunta 2: ¿Cómo maneja el backend los representantes?**

**Respuesta:**

**Endpoint:** `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance`

**Payload esperado:**

```json
{
  "id": "019aeedc-26aa-73ac-8ba0-xxxxx",  // UUID del attendance
  "attended": true,
  "representedById": "019aeedc-26aa-73ac-8ba0-yyyyy",  // ← Solo UUID de PersonV2
  "isRepresentative": false
}
```

**⚠️ IMPORTANTE:** El backend espera **solo el UUID** (`representedById`), NO la persona completa.

**Problema:** No hay endpoint público para crear `PersonV2`, solo se crea internamente cuando creas accionistas/apoderados/directores.

**Solución:** Necesitas crear la persona primero (Opción A o B), luego usar el UUID en `representedById`.

---

### **Pregunta 3: ¿Dónde quieres el modal?**

**Respuesta:** En `AsistenciaRepresentacionSection.vue` (tabla de asistentes)

**Razón:** El representante se asigna a un accionista específico que asistió, no al presidente/secretario.

---

## 🚀 PARTE 6: PLAN DE IMPLEMENTACIÓN (Opción A - Recomendada)

### **Paso 1: Crear Endpoint para Personas**

**Archivo:** `src/modules/flows-v2/shared/person/presentation/controller/person.controller.ts`

```typescript
@Controller('v2/person')
export class PersonController {
  @Post('natural')
  async createNatural(@Body() dto: CreateNaturalPersonDto) {
    // Crear PersonV2 + NaturalV2
    // Retornar UUID
  }
}
```

### **Paso 2: Crear Modal en Frontend**

**Archivo:** `app/core/presentation/registros/sociedades/pasos/juntas/components/modals/RepresentanteModal.vue`

- Reutilizar `PersonaNaturalForm.vue`
- Reutilizar `usePersonaNaturalStore`
- Al submit: Crear persona → Obtener UUID → Actualizar attendance

### **Paso 3: Integrar en AsistenciaRepresentacionSection**

- Agregar botón "Agregar Representante"
- Mostrar modal
- Recibir UUID → Llamar `PUT /attendance` con `representedById`

---

## 📚 PARTE 7: REFERENCIAS DE CÓDIGO

### **Backend - Handler de Attendance**

```typescript
// src/modules/flows-v2/register-assembly/3.attendance/application/commands/update-attendance/update-attendance.handler.ts

if (command.dto.representedById) {
  attendance.asignarRepresentante(command.dto.representedById);  // ← Solo UUID
}
```

### **Backend - Entity de Attendance**

```typescript
// src/modules/flows-v2/register-assembly/3.attendance/domain/entities/attendace.entity.ts

asignarRepresentante(personaId: string): void {
  this.representedId = UniqueEntityID.fromString(personaId);  // ← Solo UUID
}
```

### **Backend - PersonCreatorService (Referencia)**

```typescript
// src/modules/flows-v2/shared/person/commands/create-person/create-person.service.ts

async createPerson(dtos: PersonaDto[]): Promise<void> {
  const command = new CreatePersonCommand(data);
  await this.commandBus.execute(command);
}
```

---

## ✅ CONCLUSIÓN

**Resumen:**

1. ✅ **Backend está bien:** Solo necesita UUID de `PersonV2`
2. ❌ **Falta endpoint:** No hay forma pública de crear `PersonV2` sin crear entidad relacionada
3. ✅ **Solución:** Crear endpoint `POST /api/v2/person/natural` (Opción A)
4. ✅ **Frontend:** Reutilizar `PersonaNaturalForm` + crear persona → asignar UUID

**Próximos pasos:**

1. Decidir si implementar Opción A o B
2. Si Opción A: Crear endpoint de personas
3. Crear modal de representante en frontend
4. Integrar con `AsistenciaRepresentacionSection`

---

**¿Quieres que implemente la Opción A (endpoint de personas) ahora?** 🚀

