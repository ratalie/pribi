# 🔍 Plan de Auditoría - Migración Login PROBO a Nuxt 4

## 📋 Información del Proyecto

**Proyecto:** Vista de Login PROBO  
**Framework Origen:** React 18 + Motion + Tailwind CSS  
**Framework Destino:** Nuxt 4 + Vue 3 + @vueuse/motion + Tailwind CSS  
**Fecha Inicio Auditoría:** 2025-01-25  
**Responsable:** Equipo Frontend PROBO

---

## 🎯 Objetivos de la Auditoría

1. ✅ Verificar paridad visual 1:1 entre React y Nuxt
2. ✅ Validar funcionalidad de animaciones
3. ✅ Comprobar responsive en todos los dispositivos
4. ✅ Verificar integración con sistema de autenticación
5. ✅ Optimizar performance y tiempos de carga
6. ✅ Asegurar accesibilidad (WCAG 2.1 AA)

---

## 📊 Checklist de Auditoría

### 1. Estructura y Arquitectura

#### 1.1 Componentes

- [ ] LoginView.vue creado y funcional
- [ ] LeftSection.vue migrado correctamente
- [ ] RightSection.vue con formulario funcional
- [ ] HeaderSection.vue con contenido dinámico
- [ ] VisibilitySection.vue con carousel operativo
- [ ] BackgroundPattern.vue con animaciones fluidas

#### 1.2 Organización

- [ ] Carpeta `/components/login/` creada
- [ ] Imports relativos funcionando
- [ ] Composables creados si necesarios
- [ ] Types/interfaces definidos (TypeScript)

#### 1.3 Routing

- [ ] Ruta `/login` configurada
- [ ] Redirección si usuario autenticado
- [ ] Redirección post-login funcional
- [ ] Guards de navegación implementados

---

### 2. Estilos y Diseño Visual

#### 2.1 Variables CSS

- [ ] Todas las variables `--primary-*` definidas
- [ ] Todas las variables `--gray-*` definidas
- [ ] Variables `--radius-*` configuradas
- [ ] Variables `--shadow-*` aplicadas
- [ ] Variables accesibles en todos los componentes

#### 2.2 Colores

- [ ] Paleta PROBO implementada correctamente
- [ ] Gradientes del background idénticos a React
- [ ] Colores de texto con contraste adecuado
- [ ] Estados hover/focus con colores correctos
- [ ] Transparencias (white/10, white/20) funcionando

#### 2.3 Tipografía

- [ ] Tamaños de fuente responsive (text-4xl, text-5xl, etc.)
- [ ] Pesos de fuente consistentes
- [ ] Line-height apropiados
- [ ] Fuentes Gabarito/Manrope cargadas (si aplica)

#### 2.4 Layout

- [ ] Split 50/50 en desktop (lg:)
- [ ] Split 60/40 en XL (xl:)
- [ ] Mobile fullscreen funcionando
- [ ] Padding responsive correcto (p-12, p-16, p-20)
- [ ] Max-widths respetados (max-w-md, max-w-2xl)

#### 2.5 Efectos Visuales

- [ ] Backdrop-blur funcionando en todos los navegadores
- [ ] Border-radius consistentes
- [ ] Shadows (shadow-lg, shadow-xl) aplicadas
- [ ] Transitions suaves (duration-300)
- [ ] Opacity layers correctas

---

### 3. Animaciones y Motion

#### 3.1 BackgroundPattern

- [ ] Gradiente base renderizado correctamente
- [ ] Gradiente animado con transición suave (10s loop)
- [ ] Forma geométrica 1 (superior izquierda) animándose
- [ ] Forma geométrica 2 (inferior derecha) animándose
- [ ] Grid pattern visible con opacity correcta
- [ ] Partículas flotantes (20) moviéndose aleatoriamente
- [ ] Performance: FPS > 30 en dispositivos medios

#### 3.2 Entrada de Secciones

- [ ] LeftSection: fade + slide desde izquierda (x: -50)
- [ ] RightSection: fade + slide desde derecha (x: 50)
- [ ] Duración 0.8s respetada
- [ ] Delays escalonados funcionando (0.2s, 0.4s)

#### 3.3 HeaderSection (X)

- [ ] Logo/brand: fade + slide (y: -20, delay: 0.2s)
- [ ] Título principal: fade + slide (y: 20, delay: 0.4s)
- [ ] Features list: animación escalonada (delay incremental)
- [ ] Checkmarks con SVG animándose

#### 3.4 VisibilitySection (Y)

- [ ] Carousel cambia automáticamente cada 5s
- [ ] Transiciones entre slides suaves (0.5s)
- [ ] Animación de opacity (0 → 1)
- [ ] Animación de scale (0.9 → 1)
- [ ] Animación de x (-50/50 → 0)
- [ ] Botones prev/next funcionan
- [ ] Hover en botones con scale (1.1)
- [ ] Dots indicadores actualizan correctamente
- [ ] Dot activo con width animado (2.5 → 10)

#### 3.5 RightSection (B)

- [ ] Formulario: fade + slide (y: 20, delay: 0.5s)
- [ ] Loading spinner: rotación infinita (360deg, 1s)
- [ ] Spinner visible durante isLoading
- [ ] Transitions en inputs (focus states)

---

### 4. Funcionalidad

#### 4.1 Formulario de Login

- [ ] Input email: validación HTML5 type="email"
- [ ] Input password: toggle show/hide funcional
- [ ] Iconos lucide-react/vue correctos (Mail, Lock, Eye)
- [ ] Checkbox "Recordarme" funcional
- [ ] Button "Olvidaste contraseña" con action
- [ ] Submit button dispara handleSubmit
- [ ] Estado isLoading bloquea submit
- [ ] Formulario no envía si campos vacíos

#### 4.2 Estado del Formulario

- [ ] formData.email actualiza correctamente
- [ ] formData.password actualiza correctamente
- [ ] formData.remember actualiza correctamente
- [ ] Estado persiste durante interacción
- [ ] Limpieza de estado post-submit

#### 4.3 Integración Backend

- [ ] Función handleSubmit llama a API/composable
- [ ] Manejo de errores implementado
- [ ] Mensajes de error mostrados al usuario
- [ ] Success redirect funcional
- [ ] Token guardado correctamente (httpOnly cookie)
- [ ] Session management configurado

#### 4.4 Carousel

- [ ] Estado currentIndex actualiza
- [ ] Auto-advance: interval configurado y limpiado
- [ ] Click en dots cambia slide
- [ ] Click en arrows cambia slide
- [ ] Loop infinito funcional (última → primera)

---

### 5. Responsive y Compatibilidad

#### 5.1 Breakpoints

- [ ] Mobile (< 1024px): Layout apilado, B arriba, A oculto
- [ ] Tablet/Desktop (≥ 1024px): Split 50/50
- [ ] XL (≥ 1280px): Split 60/40
- [ ] Transiciones suaves entre breakpoints

#### 5.2 Mobile

- [ ] Formulario ocupa 100% ancho
- [ ] Padding apropiado en mobile (p-8)
- [ ] Background visible en mobile (absolute -z-10)
- [ ] Touch events funcionan (carousel swipe si implementado)
- [ ] Inputs accesibles en teclados móviles
- [ ] Virtual keyboard no rompe layout

#### 5.3 Desktop

- [ ] LeftSection visible con background animado
- [ ] Split screen balanceado
- [ ] Hover states funcionan (botones, links)
- [ ] Cursor pointer en elementos interactivos

#### 5.4 Navegadores

- [ ] Chrome/Chromium (últimas 2 versiones)
- [ ] Firefox (últimas 2 versiones)
- [ ] Safari (últimas 2 versiones)
- [ ] Edge (últimas 2 versiones)
- [ ] Backdrop-blur polyfill si necesario

---

### 6. Performance

#### 6.1 Métricas

- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] First Input Delay (FID) < 100ms

#### 6.2 Optimizaciones

- [ ] Lazy loading de componentes no críticos
- [ ] CSS crítico inline
- [ ] Animaciones con GPU (transform, opacity)
- [ ] Debounce en inputs si necesario
- [ ] Imágenes optimizadas (si se usan)
- [ ] No memory leaks (intervals limpiados)

#### 6.3 Bundle Size

- [ ] Tamaño JS < 200kb (gzipped)
- [ ] Tamaño CSS < 50kb (gzipped)
- [ ] Tree-shaking efectivo
- [ ] Code-splitting implementado
- [ ] Dependencies auditadas (no duplicados)

---

### 7. Accesibilidad (a11y)

#### 7.1 Semántica HTML

- [ ] Uso correcto de `<form>`
- [ ] Labels asociados a inputs (htmlFor/for)
- [ ] Buttons con type apropiado (submit/button)
- [ ] Headings jerárquicos (h1 → h2)
- [ ] Landmarks ARIA si necesarios

#### 7.2 Keyboard Navigation

- [ ] Tab order lógico
- [ ] Focus visible en todos los elementos
- [ ] Enter dispara submit en formulario
- [ ] Esc cierra modales (si aplica)
- [ ] Arrow keys en carousel (opcional)

#### 7.3 Screen Readers

- [ ] aria-label en iconos sin texto
- [ ] aria-live para mensajes de error
- [ ] sr-only para texto descriptivo
- [ ] Alt text en imágenes (si aplica)
- [ ] Roles ARIA apropiados

#### 7.4 Contraste

- [ ] Ratio texto/fondo ≥ 4.5:1 (WCAG AA)
- [ ] Ratio headings/fondo ≥ 3:1
- [ ] Estados focus con outline visible
- [ ] Links diferenciados del texto normal

---

### 8. Seguridad

#### 8.1 Formulario

- [ ] No autocomplete en password (opcional)
- [ ] CSRF token implementado
- [ ] Rate limiting en intentos de login
- [ ] Captcha si múltiples fallos (opcional)
- [ ] Mensajes de error genéricos (no revelar info)

#### 8.2 Datos

- [ ] Passwords nunca en localStorage
- [ ] Tokens en httpOnly cookies
- [ ] HTTPS obligatorio en producción
- [ ] Content Security Policy configurada
- [ ] XSS protection headers

#### 8.3 Validación

- [ ] Frontend: Validación básica
- [ ] Backend: Validación estricta (principal)
- [ ] Sanitización de inputs
- [ ] SQL injection prevention (backend)

---

### 9. Testing

#### 9.1 Unit Tests

- [ ] HeaderSection renderiza correctamente
- [ ] VisibilitySection cambia slides
- [ ] RightSection valida inputs
- [ ] BackgroundPattern no causa leaks
- [ ] Composables retornan valores esperados

#### 9.2 Integration Tests

- [ ] Flujo completo de login
- [ ] Navegación entre slides del carousel
- [ ] Toggle password visibility
- [ ] Submit con campos vacíos
- [ ] Submit con datos válidos

#### 9.3 E2E Tests

- [ ] Usuario entra a /login
- [ ] Usuario completa formulario
- [ ] Usuario hace clic en submit
- [ ] Usuario es redirigido a dashboard
- [ ] Usuario intenta acceder a /login autenticado (redirect)

#### 9.4 Visual Regression

- [ ] Screenshots baseline generados
- [ ] Comparación React vs Nuxt
- [ ] Diferencias pixel-perfect < 0.1%
- [ ] Mobile screenshots
- [ ] Desktop screenshots

---

### 10. Documentación

#### 10.1 Código

- [ ] Comentarios en componentes complejos
- [ ] JSDoc/TSDoc en funciones públicas
- [ ] README con instrucciones de setup
- [ ] CHANGELOG con versiones

#### 10.2 Técnica

- [ ] LOGIN_DOCUMENTATION.md completo
- [ ] Guía de migración incluida
- [ ] Especificaciones de diseño
- [ ] Diagramas de arquitectura

#### 10.3 Usuario

- [ ] Manual de uso (si aplica)
- [ ] FAQ de errores comunes
- [ ] Troubleshooting guide

---

## 🚨 Issues Críticos

### Bloqueadores

- [ ] Animaciones con jank (< 30 FPS)
- [ ] Layout roto en mobile
- [ ] Formulario no envía datos
- [ ] Background no se renderiza
- [ ] Imports/dependencias faltantes

### High Priority

- [ ] Colores no coinciden exactamente
- [ ] Espaciamientos ligeramente diferentes
- [ ] Animaciones no fluidas
- [ ] Performance degradada
- [ ] Accesibilidad keyboard incompleta

### Medium Priority

- [ ] Hover states no perfectos
- [ ] Transiciones timing diferente
- [ ] Dots indicadores posición
- [ ] Loading spinner design

### Low Priority

- [ ] Comentarios de código
- [ ] Optimizaciones menores
- [ ] Refactoring código
- [ ] Tests coverage < 80%

---

## 📝 Matriz de Comparación React vs Nuxt

| Aspecto                     | React | Nuxt | Status | Notas |
| --------------------------- | ----- | ---- | ------ | ----- |
| Layout Split 50/50          | ✅    |      |        |       |
| Layout Split 60/40          | ✅    |      |        |       |
| BackgroundPattern gradiente | ✅    |      |        |       |
| BackgroundPattern shapes    | ✅    |      |        |       |
| BackgroundPattern particles | ✅    |      |        |       |
| HeaderSection animaciones   | ✅    |      |        |       |
| VisibilitySection carousel  | ✅    |      |        |       |
| Carousel auto-advance       | ✅    |      |        |       |
| RightSection formulario     | ✅    |      |        |       |
| Toggle password visibility  | ✅    |      |        |       |
| Loading spinner             | ✅    |      |        |       |
| Responsive mobile           | ✅    |      |        |       |
| Paleta colores PROBO        | ✅    |      |        |       |
| Tailwind classes            | ✅    |      |        |       |
| Motion animations           | ✅    |      |        |       |
| Performance FPS             | ✅    |      |        |       |

**Leyenda:**

- ✅ Implementado y funcional
- ⚠️ Implementado con issues
- ❌ No funcional
- 🚧 En progreso
- - No aplica

---

## 🔄 Proceso de Auditoría

### Fase 1: Setup (Día 1)

1. Clonar proyecto Nuxt 4
2. Instalar dependencias
3. Configurar Tailwind + Motion
4. Copiar variables CSS
5. Crear estructura de carpetas

### Fase 2: Desarrollo (Día 2-3)

1. Migrar BackgroundPattern
2. Migrar HeaderSection
3. Migrar VisibilitySection
4. Migrar RightSection
5. Migrar LeftSection
6. Integrar LoginView

### Fase 3: Testing (Día 4)

1. Tests visuales (comparación screenshots)
2. Tests funcionales (formulario, carousel)
3. Tests de animaciones (timing, smoothness)
4. Tests responsive (mobile, tablet, desktop)
5. Tests navegadores (Chrome, Firefox, Safari)

### Fase 4: Optimización (Día 5)

1. Performance audit con Lighthouse
2. Accesibilidad audit con axe
3. Code review y refactoring
4. Bundle size optimization
5. Documentation final

### Fase 5: Entrega (Día 6)

1. Demo funcional
2. Documentación completa
3. Handoff a equipo backend
4. Training session
5. Deploy a staging

---

## 📊 Métricas de Éxito

### Mínimo Viable (Must Have)

- ✅ Paridad visual 95%+ con React
- ✅ Formulario funcional 100%
- ✅ Animaciones fluidas (> 30 FPS)
- ✅ Responsive en mobile/desktop
- ✅ Integración auth funcional

### Target (Should Have)

- 🎯 Paridad visual 99%+ con React
- 🎯 Performance Lighthouse > 90
- 🎯 Accesibilidad score > 95
- 🎯 Test coverage > 80%
- 🎯 Bundle size < 150kb

### Stretch Goals (Nice to Have)

- 🌟 Paridad visual 100% pixel-perfect
- 🌟 Performance Lighthouse 100
- 🌟 Accesibilidad 100 (WCAG AAA)
- 🌟 Test coverage 100%
- 🌟 Bundle size < 100kb
- 🌟 Animaciones con 60 FPS constantes

---

## 🛠️ Herramientas de Auditoría

### Performance

- [ ] Lighthouse (Chrome DevTools)
- [ ] WebPageTest
- [ ] Bundle Analyzer
- [ ] Performance profiler (DevTools)

### Accesibilidad

- [ ] axe DevTools
- [ ] WAVE
- [ ] Screen reader (NVDA/JAWS/VoiceOver)
- [ ] Keyboard-only navigation

### Visual

- [ ] Percy (visual regression)
- [ ] Chromatic (Storybook)
- [ ] Browser Screenshots (manual)
- [ ] Device testing (BrowserStack)

### Funcional

- [ ] Playwright/Cypress (E2E)
- [ ] Vitest (unit tests)
- [ ] Testing Library (component tests)
- [ ] Manual QA checklist

---

## 📅 Timeline Estimado

| Fase            | Duración     | Responsable         |
| --------------- | ------------ | ------------------- |
| Setup           | 1 día        | Frontend Lead       |
| Desarrollo      | 2-3 días     | Frontend Developers |
| Testing         | 1 día        | QA + Frontend       |
| Optimización    | 1 día        | Frontend Lead       |
| Review & Deploy | 1 día        | Full Team           |
| **TOTAL**       | **6-7 días** |                     |

---

## 📞 Contactos y Escalaciones

**Frontend Lead:** [Nombre]  
**Backend Lead:** [Nombre]  
**QA Lead:** [Nombre]  
**Product Owner:** [Nombre]

**Canales:**

- Slack: #probo-frontend
- Issues: GitHub/GitLab Issues
- Emergencias: [Email/Teléfono]

---

## ✅ Sign-off

### Auditoría Completada Por:

- [ ] **Frontend Developer:** ******\_\_\_****** Fecha: **_/_**/\_\_\_
- [ ] **QA Engineer:** ******\_\_\_****** Fecha: **_/_**/\_\_\_
- [ ] **Tech Lead:** ******\_\_\_****** Fecha: **_/_**/\_\_\_
- [ ] **Product Owner:** ******\_\_\_****** Fecha: **_/_**/\_\_\_

### Aprobación para Producción:

- [ ] **Stakeholder:** ******\_\_\_****** Fecha: **_/_**/\_\_\_

---

**Versión del Plan:** 1.0.0  
**Última Actualización:** 2025-01-25  
**Próxima Revisión:** Post-migración  
**Estado:** 🟡 Pendiente de Inicio

# 📋 Documentación Técnica - Vista de Login PROBO

## 🎯 Resumen Ejecutivo

Vista de login profesional dividida en dos secciones principales (A/B) con arquitectura modular hexagonal, diseñada para fácil migración a Nuxt 4.

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Componentes

```
/components/login/
├── LoginView.tsx          # Componente principal (orquestador)
├── LeftSection.tsx        # Sección A - Contenedor izquierdo
├── RightSection.tsx       # Sección B - Formulario de login
├── HeaderSection.tsx      # X - Título y descripción
├── VisibilitySection.tsx  # Y - Carousel de features
└── BackgroundPattern.tsx  # Fondo animado con Motion
```

### Jerarquía Visual

```
LoginView (Principal)
│
├── SECCIÓN A (Izquierda - 50% lg / 60% xl)
│   ├── BackgroundPattern (fondo animado)
│   └── LeftSection
│       ├── HeaderSection (X) - Parte superior
│       └── VisibilitySection (Y) - Parte inferior
│
└── SECCIÓN B (Derecha - 50% lg / 40% xl)
    └── RightSection (formulario)
```

---

## 🎨 Paleta de Colores PROBO

### Variables CSS (`:root`)

```css
/* Primary Purple */
--primary-25:  #F9F8FF
--primary-50:  #F1EEFF
--primary-100: #C6BBFF
--primary-200: #BCAFFF
--primary-300: #A797FF
--primary-400: #8B75FF
--primary-500: #7357FF
--primary-600: #6347F4
--primary-700: #553ADE
--primary-800: #3C28A4  /* 🎯 COLOR PRINCIPAL */
--primary-900: #21194D

/* Grays Corporate */
--gray-25:  #F8F8F8
--gray-50:  #F3F3F4
--gray-100: #E2E2E4
--gray-200: #D9D8DC
--gray-300: #C6C5CA
--gray-400: #B3B1B8
--gray-500: #8D8A95
--gray-600: #676472
--gray-700: #4F4B5C
--gray-800: #2E293D
--gray-900: #110C22

/* Border Radius */
--radius-large:  24px
--radius-medium: 16px
--radius-small:  8px

/* Shadows */
--shadow-card:  0 2px 8px rgba(17, 12, 34, 0.04)
--shadow-hover: 0 4px 16px rgba(17, 12, 34, 0.08)
--shadow-modal: 0 8px 24px rgba(17, 12, 34, 0.12)
```

---

## 🧩 Componentes Detallados

### 1. LoginView.tsx (Principal)

**Propósito:** Orquestador principal que ensambla las secciones A y B.

**Layout:**

- Grid de 2 columnas en desktop (`lg:flex`)
- Columna única en mobile
- Responsivo con breakpoints `lg:` y `xl:`

**Clases Tailwind clave:**

```jsx
// Container principal
className = "min-h-screen flex";

// Sección A (izquierda)
className = "hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden";

// Sección B (derecha)
className = "w-full lg:w-1/2 xl:w-2/5";
```

---

### 2. BackgroundPattern.tsx (Fondo Animado)

**Propósito:** Patrón de fondo animado con Motion para la sección izquierda.

**Elementos:**

1. **Gradiente base:**

```jsx
className =
  "absolute inset-0 bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)]";
```

2. **Gradiente animado overlay:**

```jsx
<motion.div
  className="absolute inset-0 opacity-30"
  animate={{
    background: [
      "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
      "radial-gradient(circle at 80% 50%, var(--primary-400) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 80%, var(--primary-600) 0%, transparent 50%)",
      "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
    ],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
    ease: "linear",
  }}
/>
```

3. **Formas geométricas flotantes:**

**Forma 1 (superior izquierda):**

```jsx
<motion.div
  className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[var(--primary-400)] opacity-10 blur-3xl"
  animate={{
    scale: [1, 1.2, 1],
    x: [0, 30, 0],
    y: [0, -20, 0],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
```

**Forma 2 (inferior derecha):**

```jsx
<motion.div
  className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[var(--primary-300)] opacity-10 blur-3xl"
  animate={{
    scale: [1, 1.3, 1],
    x: [0, -40, 0],
    y: [0, 30, 0],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1,
  }}
/>
```

4. **Grid pattern overlay:**

```jsx
<div
  className="absolute inset-0 opacity-[0.02]"
  style={{
    backgroundImage: `
      linear-gradient(var(--primary-25) 1px, transparent 1px),
      linear-gradient(90deg, var(--primary-25) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
  }}
/>
```

5. **Partículas flotantes (20 elementos):**

```jsx
{
  [...Array(20)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full opacity-30"
      initial={{
        x: Math.random() * window.innerWidth * 0.5,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        y: [null, Math.random() * window.innerHeight],
        x: [null, Math.random() * window.innerWidth * 0.5],
        opacity: [0.1, 0.5, 0.1],
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 5,
      }}
    />
  ));
}
```

**Clases clave:**

- `absolute inset-0` - Posicionamiento absoluto cubriendo todo
- `overflow-hidden pointer-events-none` - Sin interacción, evita scroll
- `blur-3xl` - Blur para efectos glassmorphism
- `opacity-10`, `opacity-30` - Transparencias sutiles

---

### 3. LeftSection.tsx (Sección A)

**Propósito:** Contenedor que estructura HeaderSection (X) y VisibilitySection (Y) verticalmente.

**Layout:**

```jsx
className = "flex flex-col h-full p-12 lg:p-16 xl:p-20 relative z-10";
```

**Distribución vertical:**

```jsx
// X: Header en la parte superior
<div className="flex-shrink-0 mb-auto">
  <HeaderSection />
</div>

// Spacer flexible
<div className="flex-grow min-h-[60px]" />

// Y: Carousel en la parte inferior
<div className="flex-shrink-0 w-full max-w-2xl mx-auto">
  <VisibilitySection />
</div>

// Spacer inferior
<div className="h-12" />
```

**Animación Motion:**

```jsx
initial={{ opacity: 0, x: -50 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.8, ease: "easeOut" }}
```

---

### 4. HeaderSection.tsx (X)

**Propósito:** Sección superior con logo, título, descripción y features.

**Estructura:**

1. **Logo/Brand:**

```jsx
<div className="inline-flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--primary-200)] to-white" />
  </div>
  <span className="text-white/90 text-lg">PROBO</span>
</div>
```

2. **Título principal:**

```jsx
<h1 className="text-white text-5xl xl:text-6xl leading-tight max-w-xl">
  Bienvenido de vuelta
</h1>
<p className="text-[var(--primary-100)] text-lg xl:text-xl max-w-lg leading-relaxed">
  Accede a tu cuenta y continúa gestionando tus proyectos de manera profesional
</p>
```

3. **Features list (3 items):**

```jsx
{
  [
    "Gestión avanzada de proyectos",
    "Colaboración en tiempo real",
    "Seguridad de nivel empresarial",
  ].map((feature, index) => (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
        {/* SVG checkmark */}
      </div>
      <span className="text-white/85 text-base">{feature}</span>
    </div>
  ));
}
```

**Espaciamiento:**

- `space-y-8` - Entre secciones principales
- `space-y-5` - Entre título y descripción
- `space-y-4` - Entre items de features

**Animaciones escalonadas:**

```jsx
// Logo
delay: 0.2

// Título
delay: 0.4

// Features
delay: 0.6 + (0.8 + index * 0.1 por cada item)
```

---

### 5. VisibilitySection.tsx (Y)

**Propósito:** Carousel interactivo con features de la app.

**Data estructura:**

```jsx
const APP_FEATURES = [
  {
    id: 1,
    title: "Dashboard Intuitivo",
    description: "Visualiza todos tus proyectos en un solo lugar",
    color: "from-purple-400 to-blue-400",
  },
  // ... más features
];
```

**Elementos principales:**

1. **Container del carousel:**

```jsx
className =
  "relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 lg:p-10";
```

2. **Área de contenido:**

```jsx
className = "relative min-h-[380px] lg:min-h-[420px]";
```

3. **Animación de slides:**

```jsx
<motion.div
  animate={{
    opacity: currentIndex === index ? 1 : 0,
    scale: currentIndex === index ? 1 : 0.9,
    x: currentIndex === index ? 0 : currentIndex > index ? -50 : 50,
  }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
/>
```

4. **Botones de navegación:**

```jsx
// Izquierda
className =
  "absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white border border-white/10 hover:scale-110";

// Derecha (similar)
className = "absolute right-4...";
```

5. **Indicadores (dots):**

```jsx
// Activo
className = "w-10 h-2.5 bg-white rounded-full shadow-lg";

// Inactivo
className = "w-2.5 h-2.5 bg-white/30 rounded-full hover:bg-white/50";
```

**Auto-advance:**

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % APP_FEATURES.length);
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

---

### 6. RightSection.tsx (B)

**Propósito:** Formulario de login con validación y estados.

**Layout principal:**

```jsx
className = "h-full flex items-center justify-center p-8 lg:p-16 bg-[var(--gray-25)]";
```

**Elementos del formulario:**

1. **Header:**

```jsx
<h2 className="text-[var(--gray-900)] text-4xl mb-3">
  Iniciar Sesión
</h2>
<p className="text-[var(--gray-500)]">
  Ingresa tus credenciales para acceder
</p>
```

2. **Campo Email:**

```jsx
<div className="relative">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
  <Input className="pl-10 h-12 bg-white border-[var(--gray-200)] focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)]" />
</div>
```

3. **Campo Password (con toggle):**

```jsx
<div className="relative">
  <Lock className="absolute left-3..." />
  <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10..." />
  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3...">
    {showPassword ? <EyeOff /> : <Eye />}
  </button>
</div>
```

4. **Recordarme / Olvidar contraseña:**

```jsx
<div className="flex items-center justify-between">
  <div className="flex items-center space-x-2">
    <Checkbox id="remember" />
    <label>Recordarme</label>
  </div>
  <button className="text-sm text-[var(--primary-600)] hover:text-[var(--primary-700)]">
    ¿Olvidaste tu contraseña?
  </button>
</div>
```

5. **Botón submit:**

```jsx
<Button className="w-full h-12 bg-[var(--primary-800)] hover:bg-[var(--primary-700)] text-white transition-all duration-300 shadow-lg hover:shadow-xl">
  {isLoading ? (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      />
      Iniciando sesión...
    </div>
  ) : (
    "Iniciar Sesión"
  )}
</Button>
```

**Estado del formulario:**

```jsx
const [formData, setFormData] = useState({
  email: "",
  password: "",
  remember: false,
});
```

---

## 🎭 Animaciones Motion (Framer Motion)

### Importación

```jsx
import { motion } from "motion/react";
```

### Patrones usados

#### 1. Fade + Slide (entrada de secciones)

```jsx
initial={{ opacity: 0, x: -50 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.8, ease: "easeOut" }}
```

#### 2. Fade + Scale (elementos internos)

```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.4 }}
```

#### 3. Loop continuo (gradientes de fondo)

```jsx
animate={{ background: [...array] }}
transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
```

#### 4. Floating shapes (formas geométricas)

```jsx
animate={{
  scale: [1, 1.2, 1],
  x: [0, 30, 0],
  y: [0, -20, 0],
}}
transition={{
  duration: 8,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

#### 5. Rotate infinito (spinner de loading)

```jsx
animate={{ rotate: 360 }}
transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
```

#### 6. Carousel transitions

```jsx
animate={{
  opacity: currentIndex === index ? 1 : 0,
  scale: currentIndex === index ? 1 : 0.9,
  x: currentIndex === index ? 0 : currentIndex > index ? -50 : 50,
}}
transition={{ duration: 0.5, ease: "easeInOut" }}
```

---

## 🎨 Clases Tailwind Utilizadas

### Layout & Spacing

```css
/* Containers */
min-h-screen
h-full
w-full
max-w-md
max-w-2xl

/* Flexbox */
flex
flex-col
items-center
justify-center
justify-between
gap-2, gap-3, gap-4

/* Grid */
grid
grid-cols-2

/* Spacing */
p-8, p-12, p-16, p-20
space-y-2, space-y-3, space-y-4, space-y-5, space-y-6, space-y-8
mb-3, mb-6, mb-8, mb-auto
mt-6, mt-8

/* Sizing */
lg:w-1/2
xl:w-3/5
xl:w-2/5
```

### Colores (usando variables CSS)

```css
/* Backgrounds */
bg-[var(--gray-25)]
bg-[var(--primary-800)]
bg-white
bg-white/5
bg-white/10
bg-white/20

/* Text */
text-white
text-white/85
text-white/90
text-[var(--gray-900)]
text-[var(--gray-700)]
text-[var(--gray-500)]
text-[var(--primary-100)]
text-[var(--primary-600)]

/* Borders */
border
border-[var(--gray-200)]
border-white/10
focus:border-[var(--primary-500)]
```

### Effects

```css
/* Backdrop */
backdrop-blur-sm
backdrop-blur-md
backdrop-blur-xl

/* Opacity */
opacity-10
opacity-30
opacity-[0.02]

/* Blur */
blur-3xl

/* Shadows */
shadow-lg
shadow-xl
shadow-2xl

/* Borders */
rounded-lg
rounded-xl
rounded-2xl
rounded-3xl
rounded-full

/* Transitions */
transition-colors
transition-all
duration-300
ease-linear
ease-easeOut
ease-easeInOut

/* Hover */
hover:bg-white/20
hover:text-[var(--primary-700)]
hover:scale-110
hover:shadow-xl
```

### Positioning

```css
relative
absolute
inset-0
top-20, bottom-20
left-3, left-4, left-10
right-3, right-4, right-10
top-1/2
-translate-y-1/2
z-10
```

### Typography

```css
text-base
text-lg
text-xl
text-2xl
text-3xl
text-4xl
text-5xl
text-6xl
leading-tight
leading-relaxed
```

### Responsive

```css
hidden
lg:flex
lg:p-16
lg:w-1/2
xl:text-6xl
xl:w-3/5
xl:p-20
```

---

## 📦 Dependencias Requeridas

### React + Motion

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "motion": "latest"
}
```

### Componentes UI (ShadCN)

```
- Button
- Input
- Label
- Checkbox
```

### Iconos

```
lucide-react:
  - Eye
  - EyeOff
  - Lock
  - Mail
  - ChevronLeft
  - ChevronRight
```

---

## 🔄 Migración a Nuxt 4

### Paso 1: Estructura de archivos

```
/components/login/
├── LoginView.vue
├── LeftSection.vue
├── RightSection.vue
├── HeaderSection.vue
├── VisibilitySection.vue
└── BackgroundPattern.vue
```

### Paso 2: Reemplazos necesarios

| React          | Nuxt 4 Vue             |
| -------------- | ---------------------- |
| `motion/react` | `@vueuse/motion`       |
| `useState`     | `ref()` / `reactive()` |
| `useEffect`    | `onMounted` / `watch`  |
| `className`    | `:class`               |
| `onClick`      | `@click`               |
| `onChange`     | `@change` / `v-model`  |
| JSX `{}`       | Template `{{ }}`       |

### Paso 3: CSS Variables

**Mantener idénticas** las variables CSS de `globals.css` en Nuxt:

```
/assets/css/main.css
```

Importar en `nuxt.config.ts`:

```ts
css: ["~/assets/css/main.css"];
```

### Paso 4: Composables Nuxt

Crear composables para lógica reutilizable:

```ts
// composables/useLoginForm.ts
export const useLoginForm = () => {
  const formData = ref({
    email: "",
    password: "",
    remember: false,
  });

  const isLoading = ref(false);

  const handleSubmit = async () => {
    isLoading.value = true;
    // Lógica de auth
  };

  return { formData, isLoading, handleSubmit };
};
```

### Paso 5: Motion en Vue

**BackgroundPattern equivalente en Vue:**

```vue
<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      class="absolute inset-0 bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)]"
    />

    <div
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 0.3 }"
      class="absolute inset-0"
    />
  </div>
</template>

<script setup lang="ts">
  // Lógica de animaciones con @vueuse/motion
</script>
```

---

## ✅ Checklist de Migración

### Pre-migración

- [ ] Copiar estructura de carpetas a Nuxt
- [ ] Instalar `@vueuse/motion`
- [ ] Configurar Tailwind CSS en Nuxt
- [ ] Migrar variables CSS a `/assets/css/main.css`
- [ ] Instalar componentes UI equivalentes

### Durante migración

- [ ] Convertir componentes React a Vue SFC
- [ ] Reemplazar hooks de React por Composition API
- [ ] Adaptar animaciones Motion a @vueuse/motion
- [ ] Configurar imports de componentes UI
- [ ] Probar responsive en todos los breakpoints

### Post-migración

- [ ] Verificar animaciones funcionan correctamente
- [ ] Comprobar estilos idénticos a versión React
- [ ] Integrar con sistema de autenticación Nuxt
- [ ] Testing en diferentes navegadores
- [ ] Optimización de performance

---

## 🎯 Notas Importantes

### 1. BackgroundPattern

**CRÍTICO:** Las partículas flotantes usan `window.innerWidth/innerHeight`. En Nuxt, usar dentro de `onMounted`:

```ts
onMounted(() => {
  // Inicializar partículas con dimensiones del viewport
});
```

### 2. Carousel Auto-advance

Limpiar interval en `onUnmounted`:

```ts
const interval = ref<NodeJS.Timeout>();

onMounted(() => {
  interval.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % features.length;
  }, 5000);
});

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
});
```

### 3. Formulario

Usar `useAuth` composable de Nuxt para integración con backend:

```ts
const { login } = useAuth();

const handleSubmit = async () => {
  await login(formData.value);
};
```

### 4. Responsive

Mantener exactamente los mismos breakpoints:

- Mobile: < 1024px (toda la pantalla)
- Desktop: ≥ 1024px (split 50/50)
- XL: ≥ 1280px (split 60/40)

---

## 📊 Especificaciones Técnicas

### Dimensiones

| Elemento              | Mobile      | Desktop (lg)  | Desktop (xl) |
| --------------------- | ----------- | ------------- | ------------ |
| Sección A (izquierda) | Hidden      | 50%           | 60%          |
| Sección B (derecha)   | 100%        | 50%           | 40%          |
| Form max-width        | -           | 28rem (448px) | 28rem        |
| Carousel max-width    | -           | 42rem (672px) | 42rem        |
| Padding LeftSection   | 3rem (p-12) | 4rem (p-16)   | 5rem (p-20)  |

### Animación Timings

| Elemento           | Duration | Delay  | Repeat   |
| ------------------ | -------- | ------ | -------- |
| Sección entrada    | 0.8s     | 0-0.2s | -        |
| Elementos internos | 0.6s     | 0.4s+  | -        |
| Gradiente BG       | 10s      | -      | Infinite |
| Formas geométricas | 8-10s    | 0-1s   | Infinite |
| Carousel slide     | 0.5s     | -      | -        |
| Carousel auto      | 5s       | -      | Infinite |
| Spinner loading    | 1s       | -      | Infinite |

### Z-Index Layers

| Layer              | z-index |
| ------------------ | ------- |
| Background pattern | 0       |
| LeftSection        | 10      |
| RightSection       | 1       |

---

## 🎨 Guía de Personalización

### Cambiar colores del tema

Editar variables en `/styles/globals.css`:

```css
:root {
  --primary-800: #TU_COLOR;
  /* ... */
}
```

### Modificar contenido

**HeaderSection (X):**

- Línea 24: Cambiar logo/brand
- Línea 36: Editar título principal
- Línea 40: Modificar descripción
- Línea 50: Actualizar lista de features

**VisibilitySection (Y):**

- Línea 14: Editar array `APP_FEATURES`
- Línea 47: Ajustar duración del auto-advance (5000ms)

**RightSection (B):**

- Línea 56: Modificar título del formulario
- Línea 60: Cambiar descripción
- Línea 139: Actualizar texto del botón

### Ajustar animaciones

**Velocidad de entrada:**

```jsx
transition={{ duration: 0.8 }} // Cambiar el valor
```

**Delays escalonados:**

```jsx
delay: 0.4 + index * 0.1; // Ajustar multiplicador
```

**Auto-advance del carousel:**

```jsx
setInterval(() => {...}, 5000) // Cambiar 5000ms
```

---

## 🔒 Seguridad

### Formulario

- Validación HTML5 con `required`
- Type `email` para validación de formato
- Password oculto por defecto
- TODO: Implementar validación backend

### Estado

- Datos sensibles nunca en localStorage
- Token de sesión vía httpOnly cookies
- Rate limiting en intentos de login

---

## 📚 Recursos Adicionales

### Motion (Framer Motion)

- Docs: https://motion.dev/docs
- Migración a Vue: https://motion.vueuse.org/

### Tailwind CSS v4

- Docs: https://tailwindcss.com/docs

### Nuxt 4

- Migration guide: https://nuxt.com/docs/getting-started/upgrade

---

**Versión:** 1.0.0  
**Última actualización:** 2025-01-25  
**Autor:** PROBO Team  
**Framework:** React → Nuxt 4 Migration Ready
