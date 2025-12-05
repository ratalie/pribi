# 👔 Lógica de Presidente y Secretario en Instalación de Junta

> Documento que explica la lógica de negocio para designar Presidente y Secretario de la Junta durante la Instalación.

---

## 🎯 Contexto

Durante la **Instalación de la Junta de Accionistas** (Paso 3), se debe designar:
1. **Presidente de la Junta**
2. **Secretario de la Junta**

Estas designaciones tienen reglas específicas según:
- Tipo de sociedad
- Si tiene directorio o no
- Quién fue preconfigurado en el directorio
- Quiénes están presentes en la junta

---

## 📋 Reglas de Negocio

### 1️⃣ Obligatoriedad del Directorio por Tipo de Sociedad

| Tipo Sociedad | Directorio | Observación |
|---------------|------------|-------------|
| **SA** | ✅ OBLIGATORIO | Siempre tiene directorio |
| **SAA** | ✅ OBLIGATORIO | Siempre tiene directorio |
| **SAC** | ⚠️ OPCIONAL | Puede o no tener directorio |
| **SRL** | ❌ NO TIENE | No tiene directorio |
| **EIRL** | ❌ NO TIENE | No tiene directorio |

---

### 2️⃣ Fuentes de Presidente y Secretario

#### Si la sociedad **TIENE Directorio** (SA, SAA, SAC con directorio):

##### **Presidente de la Junta:**
El presidente puede ser:
1. **Presidente del Directorio** (preconfigurado en Paso 5 de Registro)
2. **Asistente de la Junta** (seleccionado manualmente)

##### **Secretario de la Junta:**
El secretario puede ser:
1. **Gerente General** (preconfigurado en Paso 5 de Registro)
2. **Asistente de la Junta** (seleccionado manualmente)

---

#### Si la sociedad **NO TIENE Directorio** (SRL, EIRL, SAC sin directorio):

##### **Presidente de la Junta:**
- **Solo puede ser:** Asistente de la Junta (selección manual)

##### **Secretario de la Junta:**
- **Solo puede ser:** Asistente de la Junta (selección manual)

---

### 3️⃣ Validación de Asistencia (Regla Crítica)

**⚠️ REGLA IMPORTANTE:**

Aunque en el Paso 5 (Directorio de Registro) se haya preconfigurado:
- Presidente del Directorio → Presidente de Junta
- Gerente General → Secretario de Junta

**ESTO NO GARANTIZA QUE VENGAN A LA JUNTA.**

Por lo tanto:

```
SI presidente_preconfigurado NO está en lista_asistentes:
  → Mostrar lista de asistentes para seleccionar nuevo presidente
  
SI secretario_preconfigurado NO está en lista_asistentes:
  → Mostrar lista de asistentes para seleccionar nuevo secretario
```

---

## 🔄 Flujo de Lógica

### Diagrama de Decisión:

```
INICIO: Instalación de Junta
  │
  ├─ ¿Tiene Directorio?
  │   │
  │   ├─ SÍ (SA, SAA, SAC con directorio)
  │   │   │
  │   │   ├─ Presidente de Junta:
  │   │   │   ├─ ¿Presidente Directorio está presente?
  │   │   │   │   ├─ SÍ → Asignar automáticamente (opcional: permitir cambiar)
  │   │   │   │   └─ NO → Seleccionar de lista de asistentes
  │   │   │   └─ O seleccionar manualmente de asistentes
  │   │   │
  │   │   └─ Secretario de Junta:
  │   │       ├─ ¿Gerente General está presente?
  │   │       │   ├─ SÍ → Asignar automáticamente (opcional: permitir cambiar)
  │   │       │   └─ NO → Seleccionar de lista de asistentes
  │   │       └─ O seleccionar manualmente de asistentes
  │   │
  │   └─ NO (SRL, EIRL, SAC sin directorio)
  │       │
  │       ├─ Presidente de Junta:
  │       │   └─ Seleccionar de lista de asistentes (OBLIGATORIO)
  │       │
  │       └─ Secretario de Junta:
  │           └─ Seleccionar de lista de asistentes (OBLIGATORIO)
  │
  ▼
CONTINUAR con Instalación
```

---

## 💻 Implementación Sugerida

### Entity: Instalación de Junta

```typescript
// domain/entities/instalacion-junta.entity.ts

export interface InstalacionJuntaEntity {
  id: string;
  juntaId: string;
  societyProfileId: string;
  
  // Configuración de directorio (viene de Paso 5 de Registro)
  tieneDirectorio: boolean;
  presidenteDirectorioId?: string; // Preconfigurado
  gerenteGeneralId?: string; // Preconfigurado
  
  // Asistencia
  fechaInstalacion: Date;
  tipoConvocatoria: "PRIMERA" | "SEGUNDA";
  accionistasPresentes: string[]; // IDs de accionistas presentes
  quorumPresente: number; // Porcentaje
  
  // Designaciones finales
  presidenteJuntaId: string; // ID del accionista designado como presidente
  secretarioJuntaId: string; // ID del accionista designado como secretario
  presidenteJuntaOrigen: "PRESIDENTE_DIRECTORIO" | "GERENTE_GENERAL" | "ASISTENTE"; // De dónde viene
  secretarioJuntaOrigen: "GERENTE_GENERAL" | "ASISTENTE"; // De dónde viene
  
  instalada: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Use Case: Validar y Designar Presidente/Secretario

```typescript
// application/use-cases/validar-designaciones-junta.use-case.ts

export class ValidarDesignacionesJuntaUseCase {
  constructor(
    private instalacionRepository: InstalacionJuntaRepositoryPort,
    private directorioRepository: DirectorioRepositoryPort
  ) {}

  async execute(data: {
    societyProfileId: string;
    tieneDirectorio: boolean;
    accionistasPresentes: string[];
    presidenteSeleccionado?: string; // Opcional si se autoasigna
    secretarioSeleccionado?: string; // Opcional si se autoasigna
  }): Promise<{
    presidenteId: string;
    presidenteOrigen: string;
    secretarioId: string;
    secretarioOrigen: string;
  }> {
    
    // ===== PRESIDENTE =====
    let presidenteId: string;
    let presidenteOrigen: string;

    if (data.tieneDirectorio) {
      // Obtener configuración del directorio
      const directorio = await this.directorioRepository.getConfig(data.societyProfileId);
      
      if (directorio.presidenteDirectorioId) {
        // Verificar si el presidente del directorio está presente
        const presidentePresente = data.accionistasPresentes.includes(
          directorio.presidenteDirectorioId
        );

        if (presidentePresente && !data.presidenteSeleccionado) {
          // Asignar automáticamente al presidente del directorio
          presidenteId = directorio.presidenteDirectorioId;
          presidenteOrigen = "PRESIDENTE_DIRECTORIO";
        } else if (!presidentePresente) {
          // Presidente del directorio NO está presente, seleccionar de asistentes
          if (!data.presidenteSeleccionado) {
            throw new Error(
              "El Presidente del Directorio no está presente. " +
              "Debe seleccionar un asistente como Presidente de la Junta."
            );
          }
          presidenteId = data.presidenteSeleccionado;
          presidenteOrigen = "ASISTENTE";
        } else {
          // Se seleccionó manualmente aunque el presidente estaba presente
          presidenteId = data.presidenteSeleccionado!;
          presidenteOrigen = "ASISTENTE";
        }
      } else {
        // No hay presidente del directorio preconfigurado, seleccionar de asistentes
        if (!data.presidenteSeleccionado) {
          throw new Error("Debe seleccionar un Presidente de la Junta de los asistentes.");
        }
        presidenteId = data.presidenteSeleccionado;
        presidenteOrigen = "ASISTENTE";
      }
    } else {
      // No tiene directorio, SIEMPRE seleccionar de asistentes
      if (!data.presidenteSeleccionado) {
        throw new Error(
          "La sociedad no tiene directorio. " +
          "Debe seleccionar un Presidente de la Junta de los asistentes."
        );
      }
      presidenteId = data.presidenteSeleccionado;
      presidenteOrigen = "ASISTENTE";
    }

    // ===== SECRETARIO =====
    let secretarioId: string;
    let secretarioOrigen: string;

    if (data.tieneDirectorio) {
      // Obtener configuración del directorio
      const directorio = await this.directorioRepository.getConfig(data.societyProfileId);
      
      if (directorio.gerenteGeneralId) {
        // Verificar si el gerente general está presente
        const gerentePresente = data.accionistasPresentes.includes(
          directorio.gerenteGeneralId
        );

        if (gerentePresente && !data.secretarioSeleccionado) {
          // Asignar automáticamente al gerente general
          secretarioId = directorio.gerenteGeneralId;
          secretarioOrigen = "GERENTE_GENERAL";
        } else if (!gerentePresente) {
          // Gerente general NO está presente, seleccionar de asistentes
          if (!data.secretarioSeleccionado) {
            throw new Error(
              "El Gerente General no está presente. " +
              "Debe seleccionar un asistente como Secretario de la Junta."
            );
          }
          secretarioId = data.secretarioSeleccionado;
          secretarioOrigen = "ASISTENTE";
        } else {
          // Se seleccionó manualmente aunque el gerente estaba presente
          secretarioId = data.secretarioSeleccionado!;
          secretarioOrigen = "ASISTENTE";
        }
      } else {
        // No hay gerente general preconfigurado, seleccionar de asistentes
        if (!data.secretarioSeleccionado) {
          throw new Error("Debe seleccionar un Secretario de la Junta de los asistentes.");
        }
        secretarioId = data.secretarioSeleccionado;
        secretarioOrigen = "ASISTENTE";
      }
    } else {
      // No tiene directorio, SIEMPRE seleccionar de asistentes
      if (!data.secretarioSeleccionado) {
        throw new Error(
          "La sociedad no tiene directorio. " +
          "Debe seleccionar un Secretario de la Junta de los asistentes."
        );
      }
      secretarioId = data.secretarioSeleccionado;
      secretarioOrigen = "ASISTENTE";
    }

    // Validar que presidente y secretario sean diferentes
    if (presidenteId === secretarioId) {
      throw new Error(
        "El Presidente y Secretario de la Junta deben ser personas diferentes."
      );
    }

    return {
      presidenteId,
      presidenteOrigen,
      secretarioId,
      secretarioOrigen,
    };
  }
}
```

---

## 🎨 Implementación UI

### Componente: Designación de Presidente

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

// Props
const props = defineProps<{
  tieneDirectorio: boolean;
  presidenteDirectorioId?: string;
  presidenteDirectorioNombre?: string;
  accionistasPresentes: Array<{ id: string; nombre: string }>;
}>();

// Estado
const modoSeleccion = ref<"AUTO" | "MANUAL">("AUTO");
const presidenteSeleccionado = ref<string | null>(null);

// Computed
const presidenteDirectorioPresente = computed(() => {
  if (!props.presidenteDirectorioId) return false;
  return props.accionistasPresentes.some(a => a.id === props.presidenteDirectorioId);
});

const puedeAutoAsignar = computed(() => {
  return props.tieneDirectorio && presidenteDirectorioPresente.value;
});

const mostrarSelector = computed(() => {
  return modoSeleccion.value === "MANUAL" || !puedeAutoAsignar.value;
});

// Valor final
const presidenteFinal = computed(() => {
  if (modoSeleccion.value === "AUTO" && puedeAutoAsignar.value) {
    return props.presidenteDirectorioId;
  }
  return presidenteSeleccionado.value;
});
</script>

<template>
  <div class="designacion-presidente">
    <h3>Presidente de la Junta</h3>

    <!-- Caso 1: Puede autoasignarse (tiene directorio y presidente presente) -->
    <div v-if="puedeAutoAsignar">
      <div class="opcion-recomendada">
        <label>
          <input type="radio" v-model="modoSeleccion" value="AUTO" />
          <strong>{{ presidenteDirectorioNombre }}</strong> (Presidente del Directorio)
        </label>
        <p class="ayuda">Recomendado: El presidente del directorio preside la junta</p>
      </div>

      <div class="opcion-manual">
        <label>
          <input type="radio" v-model="modoSeleccion" value="MANUAL" />
          Seleccionar otro asistente
        </label>
      </div>
    </div>

    <!-- Caso 2: Debe seleccionar manualmente -->
    <div v-else>
      <p v-if="tieneDirectorio && !presidenteDirectorioPresente" class="advertencia">
        ⚠️ El Presidente del Directorio no está presente.
        Debe seleccionar un asistente como Presidente de la Junta.
      </p>
      <p v-else-if="!tieneDirectorio" class="info">
        ℹ️ La sociedad no tiene directorio.
        Debe seleccionar un asistente como Presidente de la Junta.
      </p>
    </div>

    <!-- Selector de asistentes (solo si es manual o no puede autoasignar) -->
    <div v-if="mostrarSelector" class="selector-asistentes">
      <label>Seleccione el Presidente de la Junta:</label>
      <select v-model="presidenteSeleccionado" required>
        <option value="">-- Seleccione un asistente --</option>
        <option
          v-for="asistente in accionistasPresentes"
          :key="asistente.id"
          :value="asistente.id"
        >
          {{ asistente.nombre }}
        </option>
      </select>
    </div>

    <!-- Valor seleccionado -->
    <div v-if="presidenteFinal" class="seleccion-final">
      <strong>Presidente seleccionado:</strong> 
      {{ 
        modoSeleccion === "AUTO" 
          ? presidenteDirectorioNombre 
          : accionistasPresentes.find(a => a.id === presidenteSeleccionado)?.nombre 
      }}
    </div>
  </div>
</template>
```

---

### Componente: Designación de Secretario

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

// Props
const props = defineProps<{
  tieneDirectorio: boolean;
  gerenteGeneralId?: string;
  gerenteGeneralNombre?: string;
  accionistasPresentes: Array<{ id: string; nombre: string }>;
  presidenteSeleccionado: string | null; // Para validar que sean diferentes
}>();

// Estado
const modoSeleccion = ref<"AUTO" | "MANUAL">("AUTO");
const secretarioSeleccionado = ref<string | null>(null);

// Computed
const gerenteGeneralPresente = computed(() => {
  if (!props.gerenteGeneralId) return false;
  return props.accionistasPresentes.some(a => a.id === props.gerenteGeneralId);
});

const puedeAutoAsignar = computed(() => {
  return props.tieneDirectorio && gerenteGeneralPresente.value;
});

const mostrarSelector = computed(() => {
  return modoSeleccion.value === "MANUAL" || !puedeAutoAsignar.value;
});

// Filtrar asistentes (excluir presidente ya seleccionado)
const asistentesDisponibles = computed(() => {
  return props.accionistasPresentes.filter(
    a => a.id !== props.presidenteSeleccionado
  );
});

// Valor final
const secretarioFinal = computed(() => {
  if (modoSeleccion.value === "AUTO" && puedeAutoAsignar.value) {
    return props.gerenteGeneralId;
  }
  return secretarioSeleccionado.value;
});

// Validación: Presidente y Secretario deben ser diferentes
watch([secretarioSeleccionado, () => props.presidenteSeleccionado], () => {
  if (secretarioSeleccionado.value === props.presidenteSeleccionado) {
    console.error("Presidente y Secretario deben ser diferentes");
    secretarioSeleccionado.value = null;
  }
});
</script>

<template>
  <div class="designacion-secretario">
    <h3>Secretario de la Junta</h3>

    <!-- Caso 1: Puede autoasignarse (tiene directorio y gerente presente) -->
    <div v-if="puedeAutoAsignar">
      <div class="opcion-recomendada">
        <label>
          <input type="radio" v-model="modoSeleccion" value="AUTO" />
          <strong>{{ gerenteGeneralNombre }}</strong> (Gerente General)
        </label>
        <p class="ayuda">Recomendado: El gerente general actúa como secretario</p>
      </div>

      <div class="opcion-manual">
        <label>
          <input type="radio" v-model="modoSeleccion" value="MANUAL" />
          Seleccionar otro asistente
        </label>
      </div>
    </div>

    <!-- Caso 2: Debe seleccionar manualmente -->
    <div v-else>
      <p v-if="tieneDirectorio && !gerenteGeneralPresente" class="advertencia">
        ⚠️ El Gerente General no está presente.
        Debe seleccionar un asistente como Secretario de la Junta.
      </p>
      <p v-else-if="!tieneDirectorio" class="info">
        ℹ️ La sociedad no tiene directorio.
        Debe seleccionar un asistente como Secretario de la Junta.
      </p>
    </div>

    <!-- Selector de asistentes (excluir presidente ya seleccionado) -->
    <div v-if="mostrarSelector" class="selector-asistentes">
      <label>Seleccione el Secretario de la Junta:</label>
      <select v-model="secretarioSeleccionado" required>
        <option value="">-- Seleccione un asistente --</option>
        <option
          v-for="asistente in asistentesDisponibles"
          :key="asistente.id"
          :value="asistente.id"
        >
          {{ asistente.nombre }}
        </option>
      </select>
      <p v-if="asistentesDisponibles.length === 0" class="error">
        ❌ No hay asistentes disponibles (todos ya fueron asignados)
      </p>
    </div>

    <!-- Valor seleccionado -->
    <div v-if="secretarioFinal" class="seleccion-final">
      <strong>Secretario seleccionado:</strong> 
      {{ 
        modoSeleccion === "AUTO" 
          ? gerenteGeneralNombre 
          : accionistasPresentes.find(a => a.id === secretarioSeleccionado)?.nombre 
      }}
    </div>
  </div>
</template>
```

---

## 🎯 Casos de Uso

### Caso 1: SA con Directorio - Todos Presentes

**Datos:**
- Tipo: SA
- Tiene Directorio: ✅ SÍ
- Presidente Directorio: Juan Pérez (ID: 123) → ✅ PRESENTE
- Gerente General: María García (ID: 456) → ✅ PRESENTE

**Resultado:**
- Presidente Junta: Juan Pérez (autoasignado)
- Secretario Junta: María García (autoasignado)
- ✅ Sin selección manual requerida

---

### Caso 2: SA con Directorio - Presidente Ausente

**Datos:**
- Tipo: SA
- Tiene Directorio: ✅ SÍ
- Presidente Directorio: Juan Pérez (ID: 123) → ❌ AUSENTE
- Gerente General: María García (ID: 456) → ✅ PRESENTE

**Resultado:**
- Presidente Junta: ⚠️ Seleccionar de asistentes (MANUAL)
- Secretario Junta: María García (autoasignado)
- ⚠️ Requiere selección manual de presidente

---

### Caso 3: SRL sin Directorio

**Datos:**
- Tipo: SRL
- Tiene Directorio: ❌ NO

**Resultado:**
- Presidente Junta: ⚠️ Seleccionar de asistentes (MANUAL)
- Secretario Junta: ⚠️ Seleccionar de asistentes (MANUAL)
- ⚠️ Ambos requieren selección manual

---

### Caso 4: SAC con Directorio - Gerente Ausente

**Datos:**
- Tipo: SAC
- Tiene Directorio: ✅ SÍ (opcional pero configurado)
- Presidente Directorio: Juan Pérez (ID: 123) → ✅ PRESENTE
- Gerente General: María García (ID: 456) → ❌ AUSENTE

**Resultado:**
- Presidente Junta: Juan Pérez (autoasignado)
- Secretario Junta: ⚠️ Seleccionar de asistentes (MANUAL)
- ⚠️ Requiere selección manual de secretario

---

## ✅ Validaciones Requeridas

### Antes de guardar la instalación:

```typescript
// Validaciones obligatorias
const validaciones = {
  // 1. Presidente designado
  presidenteDesignado: presidenteFinal !== null,
  
  // 2. Secretario designado
  secretarioDesignado: secretarioFinal !== null,
  
  // 3. Presidente y secretario son diferentes
  sonDiferentes: presidenteFinal !== secretarioFinal,
  
  // 4. Ambos están en la lista de asistentes
  presidentePresente: accionistasPresentes.includes(presidenteFinal),
  secretarioPresente: accionistasPresentes.includes(secretarioFinal),
};

if (!validaciones.presidenteDesignado) {
  throw new Error("Debe designar un Presidente de la Junta");
}

if (!validaciones.secretarioDesignado) {
  throw new Error("Debe designar un Secretario de la Junta");
}

if (!validaciones.sonDiferentes) {
  throw new Error("El Presidente y Secretario deben ser personas diferentes");
}

if (!validaciones.presidentePresente || !validaciones.secretarioPresente) {
  throw new Error("Presidente y Secretario deben estar en la lista de asistentes");
}
```

---

## 📊 Resumen de Reglas

### Tabla de Decisión:

| Tipo | Tiene Directorio | Presidente Junta | Secretario Junta |
|------|------------------|------------------|------------------|
| SA | ✅ SÍ (obligatorio) | Presidente Directorio (si presente) o Asistente | Gerente General (si presente) o Asistente |
| SAA | ✅ SÍ (obligatorio) | Presidente Directorio (si presente) o Asistente | Gerente General (si presente) o Asistente |
| SAC | ⚠️ OPCIONAL | Si tiene: Presidente Directorio o Asistente<br>Si no tiene: Asistente | Si tiene: Gerente General o Asistente<br>Si no tiene: Asistente |
| SRL | ❌ NO | Asistente (obligatorio) | Asistente (obligatorio) |
| EIRL | ❌ NO | Asistente (obligatorio) | Asistente (obligatorio) |

---

## 🔗 Relación con Otros Pasos

### Paso 5 de Registro: Directorio

En el Paso 5 de Registro de Sociedades se configura:
- ✅ Si tiene directorio
- ✅ Presidente del Directorio
- ✅ Gerente General

**Estos datos se usan en Instalación de Junta para:**
- Preconfigurar presidente y secretario
- Validar si están presentes
- Autoasignar si es posible

### Paso 3 de Junta: Instalación

En el Paso 3 de Junta (Instalación) se valida:
- ✅ Asistencia de accionistas
- ✅ Si presidente/secretario preconfigurados están presentes
- ✅ Designación final de presidente y secretario

---

## 📝 Checklist de Implementación

Para implementar esta lógica correctamente:

- [ ] Obtener configuración del directorio (Paso 5 de Registro)
- [ ] Obtener lista de accionistas presentes (Paso 3 de Junta)
- [ ] Validar si presidente del directorio está presente
- [ ] Validar si gerente general está presente
- [ ] Mostrar opciones de selección según el caso
- [ ] Autoasignar si es posible
- [ ] Permitir selección manual siempre
- [ ] Validar que presidente ≠ secretario
- [ ] Validar que ambos estén en lista de asistentes

---

## 🎓 Glosario

| Término | Definición |
|---------|------------|
| **Presidente del Directorio** | Cargo designado en Paso 5 de Registro. Es uno de los directores. |
| **Gerente General** | Cargo administrativo designado en Paso 5 de Registro. Puede o no ser accionista. |
| **Presidente de la Junta** | Persona que preside la junta. Puede ser: Presidente Directorio o Asistente. |
| **Secretario de la Junta** | Persona que actúa como secretario en la junta. Puede ser: Gerente General o Asistente. |
| **Asistente de la Junta** | Cualquier accionista presente en la junta. |

---

## 📚 Referencias

- Ver: [../sociedades/02-domain.md](../sociedades/02-domain.md) - Entidades de Directorio
- Ver: [03-instalacion-junta.md](./03-instalacion-junta.md) - Paso de Instalación
- Ver código: `app/core/hexag/registros/sociedades/pasos/directorio/`

---

**Última actualización:** Diciembre 4, 2025  
**Autor:** Yull (feat/flujo-juntas)

