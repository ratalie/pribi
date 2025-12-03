# 📋 TODO: Sección Presidente y Secretario de la Junta

**Fecha:** 3 de Diciembre 2025  
**Estado:** 📋 PENDIENTE  
**Prioridad:** Alta  
**Tiempo Estimado:** 4-6 horas

---

## 🎯 OBJETIVO

Implementar la sección de selección de **Presidente** y **Secretario** de la junta en el Paso 3 (Instalación).

---

## 📊 LÓGICA DE NEGOCIO

### **Presidente de la Junta**

**Fuente de datos:**
1. **SI la sociedad TIENE DIRECTORIO:**
   - El presidente del directorio es automáticamente el presidente de la junta
   - Viene de: `snapshot.directorio.presidente`
   - Si el presidente NO asiste → Permitir seleccionar sustituto de los presentes
   - Si ningún director asiste → Permitir agregar externo (input de nombre)

2. **SI la sociedad NO TIENE DIRECTORIO:**
   - Selector con los accionistas presentes
   - Opción: "Otro (externo)" → Input de nombre

### **Secretario de la Junta**

**Fuente de datos:**
1. **SI la sociedad TIENE DIRECTORIO:**
   - Puede ser un director que asista
   - Selector con directores presentes
   - Opción: "Otro (externo)" → Input de nombre

2. **SI la sociedad NO TIENE DIRECTORIO:**
   - Selector con los accionistas presentes
   - Opción: "Otro (externo)" → Input de nombre

---

## 📐 ESTRUCTURA DE DATOS

### **En MeetingDetails Entity:**

```typescript
export interface MeetingDetails {
  // ... otros campos
  
  // Autoridades
  presidenteId?: string;          // UUID del accionista/director
  secretarioId?: string;          // UUID del accionista/director
  presidenteAsistio: boolean;     // Si el presidente del directorio asistió
  secretarioAsistio: boolean;     // Si el secretario asistió (no usado actualmente)
  nombreOtroPresidente?: string;  // Nombre si es externo
  nombreOtroSecretario?: string;  // Nombre si es externo
}
```

### **Backend Response:**

```typescript
export interface GeneralMeetingConfigDto {
  // ... otros campos
  
  presidentId?: string;
  secretaryId?: string;
  presidentAttended: boolean;
  secretaryAttended: boolean;
  otherPresidentName?: string;
  otherSecretaryName?: string;
}
```

---

## 🏗️ COMPONENTE A CREAR

### **Ubicación:**
`app/components/juntas/instalacion/AutoridadesSection.vue`

### **Estructura del componente:**

```vue
<template>
  <div class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200">
    <TitleH4
      title="Autoridades de la junta"
      subtitle="Selecciona el presidente y secretario que dirigirán la junta"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />
    
    <div class="grid grid-cols-2 gap-6">
      <!-- PRESIDENTE -->
      <div class="flex flex-col gap-3">
        <label class="t-t2 font-secondary font-bold text-gray-800">
          Presidente de la Junta
        </label>
        
        <!-- SI TIENE DIRECTORIO -->
        <div v-if="tieneDirectorio" class="flex flex-col gap-2">
          <!-- Info: Presidente del Directorio -->
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="t-b3 font-secondary text-blue-700">
              <strong>Presidente del Directorio:</strong>
              {{ nombrePresidenteDirectorio }}
            </p>
          </div>
          
          <!-- Checkbox: ¿Asistió? -->
          <label class="flex items-center gap-2">
            <input
              v-model="presidenteAsistio"
              type="checkbox"
              class="w-4 h-4"
            />
            <span class="t-b2 font-secondary text-gray-700">
              El presidente del directorio asistió a la junta
            </span>
          </label>
          
          <!-- SI NO ASISTIÓ: Selector de sustituto -->
          <div v-if="!presidenteAsistio" class="flex flex-col gap-2">
            <label class="t-b3 font-secondary text-gray-700">
              Seleccionar sustituto:
            </label>
            <select
              v-model="presidenteSeleccionado"
              class="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Seleccionar --</option>
              <option
                v-for="director in directoresPresentes"
                :key="director.id"
                :value="director.id"
              >
                {{ director.nombre }}
              </option>
              <option value="EXTERNO">Otro (externo)</option>
            </select>
            
            <!-- Input si es externo -->
            <TextInputZod
              v-if="presidenteSeleccionado === 'EXTERNO'"
              v-model="nombreOtroPresidente"
              name="nombreOtroPresidente"
              label="Nombre del presidente externo"
              placeholder="Ej: Juan Pérez García"
              :schema="z.string()"
            />
          </div>
        </div>
        
        <!-- SI NO TIENE DIRECTORIO -->
        <div v-else class="flex flex-col gap-2">
          <select
            v-model="presidenteSeleccionado"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Seleccionar accionista --</option>
            <option
              v-for="accionista in accionistasPresentes"
              :key="accionista.id"
              :value="accionista.id"
            >
              {{ accionista.nombre }}
            </option>
            <option value="EXTERNO">Otro (externo)</option>
          </select>
          
          <!-- Input si es externo -->
          <TextInputZod
            v-if="presidenteSeleccionado === 'EXTERNO'"
            v-model="nombreOtroPresidente"
            name="nombreOtroPresidente"
            label="Nombre del presidente externo"
            placeholder="Ej: Juan Pérez García"
            :schema="z.string()"
          />
        </div>
      </div>
      
      <!-- SECRETARIO (similar estructura) -->
      <div class="flex flex-col gap-3">
        <label class="t-t2 font-secondary font-bold text-gray-800">
          Secretario de la Junta
        </label>
        
        <div class="flex flex-col gap-2">
          <select
            v-model="secretarioSeleccionado"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Seleccionar --</option>
            <option
              v-for="persona in personasDisponibles"
              :key="persona.id"
              :value="persona.id"
            >
              {{ persona.nombre }}
            </option>
            <option value="EXTERNO">Otro (externo)</option>
          </select>
          
          <TextInputZod
            v-if="secretarioSeleccionado === 'EXTERNO'"
            v-model="nombreOtroSecretario"
            name="nombreOtroSecretario"
            label="Nombre del secretario externo"
            placeholder="Ej: María López Torres"
            :schema="z.string()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { z } from 'zod';
import TitleH4 from '~/components/titles/TitleH4.vue';
import TextInputZod from '~/components/base/inputs/text/ui/TextInputZod.vue';
import Titles from '~/types/enums/Titles.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';
import { useSnapshotStore } from '~/core/presentation/juntas/stores/snapshot.store';
import { useAsistenciaStore } from '~/core/presentation/juntas/stores/asistencia.store';

const meetingDetailsStore = useMeetingDetailsStore();
const snapshotStore = useSnapshotStore();
const asistenciaStore = useAsistenciaStore();

// ¿Tiene directorio?
const tieneDirectorio = computed(() => snapshotStore.snapshot?.directorio !== null);

// ... resto de lógica
</script>
```

---

## 📂 DATOS NECESARIOS

### **1. Directorio (del Snapshot)**

```typescript
export interface Directorio {
  presidente: Director;
  directores: Director[];
}

export interface Director {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  // ... otros campos
}
```

### **2. Accionistas Presentes (de Asistencia)**

```typescript
// Del store de asistencia
const accionistasPresentes = computed(() => {
  return asistenciaStore.asistencias
    .filter(a => a.asistio)
    .map(a => ({
      id: a.accionista.id,
      nombre: getNombreCompleto(a.accionista),
    }));
});
```

---

## 🔄 FLUJO DE GUARDADO

### **Al hacer click en "Siguiente":**

```typescript
// En instalacion/index.vue
useJuntasFlowNext(async () => {
  // Validar que haya presidente y secretario
  if (!meetingDetailsStore.meetingDetails?.presidenteId && 
      !meetingDetailsStore.meetingDetails?.nombreOtroPresidente) {
    toast.showError('Debes seleccionar un presidente');
    return false;
  }
  
  if (!meetingDetailsStore.meetingDetails?.secretarioId && 
      !meetingDetailsStore.meetingDetails?.nombreOtroSecretario) {
    toast.showError('Debes seleccionar un secretario');
    return false;
  }
  
  // Guardar en backend
  await meetingDetailsStore.updateMeetingDetails(
    meetingDetailsStore.meetingDetails
  );
  
  return true;
});
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Domain Layer**
- [ ] Validar que entidades ya tengan los campos necesarios
- [ ] Verificar que `Directorio` esté en el `SnapshotCompleteDTO`

### **Presentation Layer**
- [ ] Crear `AutoridadesSection.vue`
- [ ] Implementar lógica de selección
- [ ] Conectar con `meetingDetailsStore`
- [ ] Manejar caso "externo" con input

### **Integración**
- [ ] Agregar `AutoridadesSection` a `instalacion/index.vue`
- [ ] Agregar validaciones en el handler de "Siguiente"
- [ ] Probar con sociedad CON directorio
- [ ] Probar con sociedad SIN directorio
- [ ] Probar con presidente que NO asiste

### **Testing**
- [ ] Test: Seleccionar presidente del directorio
- [ ] Test: Seleccionar sustituto si presidente no asiste
- [ ] Test: Agregar presidente externo
- [ ] Test: Seleccionar secretario
- [ ] Test: Validaciones

---

## 📚 REFERENCIAS

- **Backend Swagger:** Ver endpoints de `meeting-details`
- **V2.5:** Revisar cómo estaba implementado
- **Documentación:** `docs/juntas/FRONTEND_ATTENDANCE_GUIDE.md`

---

**Estado:** 📋 Documentado y listo para implementar  
**Próximo Paso:** Implementar `AutoridadesSection.vue`

