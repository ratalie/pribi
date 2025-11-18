# 👨‍💻 GUÍA DE DESARROLLO - INTERNACIONALIZACIÓN PROBO V3

## 🎯 **OBJETIVO DE ESTA GUÍA**

Esta guía te enseña **paso a paso** cómo trabajar con el sistema de internacionalización de PROBO V3, asegurando que **no haya problemas** al crear nuevos componentes y que **no se liste otro contenido** incorrectamente.

---

## 📋 **REGLAS FUNDAMENTALES**

### **🚨 REGLA #1: JAMÁS texto hardcodeado**
```vue
<!-- ❌ MALO: Nunca hagas esto -->
<h1>Dashboard</h1>
<Button>Guardar</Button>

<!-- ✅ BUENO: Siempre usar traducciones -->
<h1>{{ $t('dashboard.title') }}</h1>
<Button>{{ $t('common.save') }}</Button>
```

### **🚨 REGLA #2: Keys jerárquicas y descriptivas**
```typescript
// ❌ MALO: Keys ambiguas
'title'
'button'
'text'

// ✅ BUENO: Keys descriptivas
'dashboard.mainTitle'
'common.saveButton'
'navigation.sidebarLabel'
```

### **🚨 REGLA #3: Organización por contexto**
```typescript
// ✅ BUENO: Agrupar por funcionalidad
navigation.*    // Todo del sidebar
dashboard.*     // Dashboard específico
config.*        // Modal de configuración
common.*        // Elementos reutilizables
```

---

## 🏗️ **PROCESO PARA NUEVOS COMPONENTES**

### **Paso 1: Identificar Textos**
Antes de escribir el componente, identifica **todos** los textos:

```vue
<!-- Ejemplo: Nuevo componente UserProfile -->
<template>
  <div>
    <!-- ¿Qué textos necesito? -->
    <h2>Perfil de Usuario</h2>          <!-- userProfile.title -->
    <label>Nombre:</label>              <!-- userProfile.nameLabel -->
    <label>Email:</label>               <!-- userProfile.emailLabel -->
    <Button>Actualizar</Button>         <!-- common.update -->
    <Button>Cancelar</Button>           <!-- common.cancel -->
  </div>
</template>
```

### **Paso 2: Definir Keys de Traducción**
Crea la estructura de keys **antes** de implementar:

```typescript
// Planifica las keys necesarias:
userProfile: {
  title: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  updateSuccess: string;
  updateError: string;
}
```

### **Paso 3: Añadir Traducciones**
Añade las traducciones en **todos los idiomas**:

```typescript
// app/i18n/locales/es/userProfile.ts
export default {
  title: 'Perfil de Usuario',
  nameLabel: 'Nombre',
  emailLabel: 'Correo Electrónico',
  phoneLabel: 'Teléfono',
  updateSuccess: 'Perfil actualizado correctamente',
  updateError: 'Error al actualizar el perfil'
} as const;

// app/i18n/locales/en/userProfile.ts
export default {
  title: 'User Profile',
  nameLabel: 'Name',
  emailLabel: 'Email',
  phoneLabel: 'Phone',
  updateSuccess: 'Profile updated successfully',
  updateError: 'Error updating profile'
} as const;

// Y así para todos los idiomas...
```

### **Paso 4: Actualizar Tipos TypeScript**
```typescript
// app/i18n/types.ts
export interface TranslationGroup {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  dashboard: DashboardTranslations;
  config: ConfigTranslations;
  userProfile: UserProfileTranslations; // ✅ Añadir nueva sección
  // ... más secciones
}

export interface UserProfileTranslations {
  title: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  updateSuccess: string;
  updateError: string;
}
```

### **Paso 5: Actualizar Exportadores**
```typescript
// app/i18n/locales/es/index.ts
import common from './common';
import navigation from './navigation';
import dashboard from './dashboard';
import config from './config';
import userProfile from './userProfile'; // ✅ Importar nueva sección

export default {
  common,
  navigation,
  dashboard,
  config,
  userProfile, // ✅ Exportar nueva sección
} as const;
```

### **Paso 6: Implementar Componente**
```vue
<template>
  <div class="user-profile">
    <h2>{{ $t('userProfile.title') }}</h2>
    
    <form @submit="handleSubmit">
      <div class="field">
        <label>{{ $t('userProfile.nameLabel') }}</label>
        <input v-model="user.name" type="text" />
      </div>
      
      <div class="field">
        <label>{{ $t('userProfile.emailLabel') }}</label>
        <input v-model="user.email" type="email" />
      </div>
      
      <div class="actions">
        <Button type="submit">{{ $t('common.update') }}</Button>
        <Button @click="cancel">{{ $t('common.cancel') }}</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

// Resto de la lógica...
const handleSubmit = () => {
  try {
    // Lógica de actualización
    showMessage(t('userProfile.updateSuccess'));
  } catch (error) {
    showMessage(t('userProfile.updateError'));
  }
};
</script>
```

---

## 🔄 **PATRONES COMUNES**

### **1. Traducciones con Parámetros**
```vue
<template>
  <!-- Con parámetros dinámicos -->
  <p>{{ $t('messages.welcomeUser', { name: user.name }) }}</p>
  <p>{{ $t('stats.itemCount', { count: items.length }) }}</p>
</template>

<script setup lang="ts">
// En traducciones:
// 'welcomeUser': 'Bienvenido, {name}'
// 'itemCount': '{count} elementos encontrados'
</script>
```

### **2. Pluralización**
```vue
<template>
  <p>{{ $t('messages.fileCount', items.length) }}</p>
</template>

<script setup lang="ts">
// En traducciones:
// 'fileCount': '{n} archivo | {n} archivos'
</script>
```

### **3. Traducciones en Computed**
```vue
<script setup lang="ts">
const { t } = useI18n();

const statusText = computed(() => {
  switch (status.value) {
    case 'active': return t('status.active');
    case 'inactive': return t('status.inactive');
    default: return t('status.unknown');
  }
});
</script>
```

### **4. Validaciones con i18n**
```vue
<script setup lang="ts">
const { t } = useI18n();

const validationRules = {
  name: {
    required: { message: t('validation.required') },
    minLength: { value: 2, message: t('validation.minLength', { min: 2 }) }
  },
  email: {
    required: { message: t('validation.required') },
    email: { message: t('validation.email') }
  }
};
</script>
```

---

## 📁 **ORGANIZACIÓN DE TRADUCCIONES**

### **Por Contexto Funcional:**
```
app/i18n/locales/es/
├── common.ts           # Botones, acciones generales
├── navigation.ts       # Sidebar, menús, rutas
├── dashboard.ts        # Dashboard específico
├── config.ts          # Modal de configuración
├── userProfile.ts     # Perfil de usuario
├── documents.ts       # Gestión de documentos
├── companies.ts       # Gestión de sociedades
├── validation.ts      # Mensajes de validación
└── messages.ts        # Alertas, notificaciones
```

### **Estructura de Keys:**
```typescript
// ✅ BUENO: Jerárquico y claro
dashboard: {
  title: 'Dashboard PROBO',
  stats: {
    companies: 'Sociedades Registradas',
    documents: 'Documentos Generados',
    users: 'Usuarios Activos'
  },
  actions: {
    newCompany: 'Nueva Sociedad',
    viewReports: 'Ver Reportes'
  }
}

// ❌ MALO: Plano y confuso
dashboard_title: 'Dashboard PROBO',
dashboard_companies_stat: 'Sociedades Registradas',
dashboard_new_company_btn: 'Nueva Sociedad'
```

---

## 🧪 **TESTING DE TRADUCCIONES**

### **Verificar Todos los Idiomas:**
```vue
<script setup lang="ts">
const { locale, availableLocales, changeLocale } = useI18n();

// Test manual de todos los idiomas
const testAllLanguages = async () => {
  for (const lang of availableLocales.value) {
    await changeLocale(lang.code);
    await nextTick();
    console.log(`Testing ${lang.code}:`, document.title);
  }
};
</script>
```

### **Validar Keys Faltantes:**
```javascript
// Script de validación (npm script)
const fs = require('fs');
const path = require('path');

function validateTranslations() {
  const localesDir = './app/i18n/locales';
  const languages = ['es', 'en', 'zh', 'hi', 'de', 'fr'];
  
  // Comparar keys entre idiomas
  const esKeys = getKeysFromLocale('es');
  
  languages.forEach(lang => {
    if (lang === 'es') return;
    
    const langKeys = getKeysFromLocale(lang);
    const missingKeys = esKeys.filter(key => !langKeys.includes(key));
    
    if (missingKeys.length > 0) {
      console.error(`❌ ${lang} missing keys:`, missingKeys);
    } else {
      console.log(`✅ ${lang} complete`);
    }
  });
}
```

---

## 🚨 **ERRORES COMUNES Y SOLUCIONES**

### **Error #1: Key no existe**
```vue
<!-- ❌ Error: [vue-i18n] Not found 'dashboard.unknownKey' -->
<h1>{{ $t('dashboard.unknownKey') }}</h1>

<!-- ✅ Solución: Verificar que la key existe en todas las traducciones -->
<h1>{{ $t('dashboard.title') }}</h1>
```

### **Error #2: Parametros incorrectos**
```vue
<!-- ❌ Error: Parámetro no reemplazado -->
<p>{{ $t('messages.welcome', { user: 'Juan' }) }}</p>
<!-- Si la traducción es: 'welcome': 'Hola {name}' -->

<!-- ✅ Solución: Usar nombres consistentes -->
<p>{{ $t('messages.welcome', { name: 'Juan' }) }}</p>
```

### **Error #3: Traducción hardcodeada**
```vue
<!-- ❌ Error: Texto en español hardcodeado -->
<Button>Guardar Cambios</Button>

<!-- ✅ Solución: Siempre usar i18n -->
<Button>{{ $t('common.saveChanges') }}</Button>
```

### **Error #4: Importación incorrecta**
```typescript
// ❌ Error: Falta actualizar el exportador principal
// Agregaste userProfile.ts pero no lo exportas en index.ts

// ✅ Solución: Siempre actualizar index.ts
export default {
  common,
  navigation,
  userProfile, // ✅ No olvidar exportar
} as const;
```

---

## ✅ **CHECKLIST PARA NUEVOS COMPONENTES**

Antes de hacer commit, verifica:

- [ ] **Textos identificados**: Todos los textos están identificados
- [ ] **Keys definidas**: Keys jerárquicas y descriptivas
- [ ] **6 idiomas**: Traducciones en todos los idiomas soportados
- [ ] **Tipos actualizados**: TypeScript interfaces actualizadas
- [ ] **Exportadores actualizados**: index.ts actualizado en todos los idiomas
- [ ] **Componente implementado**: Usando $t() en lugar de texto hardcodeado
- [ ] **Testing manual**: Probado cambio de idiomas
- [ ] **Keys únicas**: No hay conflictos con keys existentes
- [ ] **Parámetros validados**: Parámetros dinámicos funcionan correctamente
- [ ] **Fallbacks verificados**: Funciona si una traducción falta

---

## 🛠️ **HERRAMIENTAS DE DESARROLLO**

### **VS Code Extensions Recomendadas:**
- `i18n Ally` - Gestión visual de traducciones
- `TypeScript Vue Plugin` - Type safety
- `Vue Language Features` - Vue 3 support

### **Scripts NPM Útiles:**
```json
{
  "scripts": {
    "i18n:validate": "node scripts/validate-translations.js",
    "i18n:extract": "node scripts/extract-keys.js",
    "i18n:missing": "node scripts/find-missing-keys.js"
  }
}
```

---

## 🎯 **EJEMPLOS COMPLETOS**

### **Componente Simple:**
```vue
<!-- components/SimpleCard.vue -->
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('cards.title') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{{ $t('cards.description') }}</p>
      <Button>{{ $t('common.readMore') }}</Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
// No lógica adicional necesaria para traducciones básicas
</script>
```

### **Componente con Lógica:**
```vue
<!-- components/UserForm.vue -->
<template>
  <form @submit="handleSubmit">
    <h2>{{ $t('userForm.title') }}</h2>
    
    <!-- Campos del formulario -->
    <div class="field">
      <label>{{ $t('userForm.nameLabel') }}</label>
      <input 
        v-model="form.name" 
        :placeholder="$t('userForm.namePlaceholder')"
        :class="{ error: errors.name }"
      />
      <span v-if="errors.name" class="error">
        {{ $t('userForm.nameError') }}
      </span>
    </div>
    
    <!-- Botones de acción -->
    <div class="actions">
      <Button type="submit" :disabled="loading">
        {{ loading ? $t('common.saving') : $t('common.save') }}
      </Button>
      <Button @click="cancel" variant="outline">
        {{ $t('common.cancel') }}
      </Button>
    </div>
    
    <!-- Mensaje de estado -->
    <div v-if="message" :class="messageClass">
      {{ message }}
    </div>
  </form>
</template>

<script setup lang="ts">
const { t } = useI18n();

const form = reactive({
  name: '',
  email: ''
});

const errors = reactive({
  name: false,
  email: false
});

const loading = ref(false);
const message = ref('');
const messageClass = ref('');

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    // Validación
    if (!form.name) {
      errors.name = true;
      message.value = t('userForm.nameRequired');
      messageClass.value = 'error';
      return;
    }
    
    // Lógica de guardado
    await saveUser(form);
    
    message.value = t('userForm.saveSuccess');
    messageClass.value = 'success';
    
  } catch (error) {
    message.value = t('userForm.saveError');
    messageClass.value = 'error';
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  // Lógica de cancelación
  emit('cancel');
};
</script>
```

---

## 📚 **RECURSOS ADICIONALES**

- 📖 [Arquitectura de Internacionalización](./INTERNATIONALIZATION_ARCHITECTURE.md)
- 🔧 [Scripts de Validación](./I18N_VALIDATION_SCRIPTS.md)
- 🌐 [Referencia de Traducciones](./I18N_TRANSLATIONS_REFERENCE.md)
- 🚀 [Guía de Deployment](./I18N_DEPLOYMENT_GUIDE.md)

---

**🎯 Siguiendo esta guía, JAMÁS tendrás problemas con traducciones y tu código será consistente y mantenible.**