# Next.js a Nuxt - Guía de Migración

Esta guía cubre las equivalencias fundamentales para migrar de Next.js a Nuxt.

## 📋 Tabla de Contenidos

- [Equivalencias Fundamentales](#equivalencias-fundamentales)
- [Estructura de Proyecto](#estructura-de-proyecto)
- [Sistema de Enrutamiento](#sistema-de-enrutamiento)
- [Hooks y APIs](#hooks-y-apis)
- [Data Fetching](#data-fetching)
- [Configuración](#configuración)
- [Scripts y Comandos](#scripts-y-comandos)

---

## Equivalencias Fundamentales

### Frameworks Core

| Concepto      | Next.js 13+             | Nuxt 3                    |
| ------------- | ----------------------- | ------------------------- |
| **Base**      | React 18/19             | Vue 3                     |
| **Router**    | App Router (file-based) | Pages Router (file-based) |
| **Rendering** | SSR + Server Components | SSR + Server Composables  |
| **Config**    | `next.config.js`        | `nuxt.config.ts`          |
| **Package**   | `next`                  | `nuxt`                    |

---

## Estructura de Proyecto

### Next.js (App Router)

```
my-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── (group)/            # Route group
│   └── api/                # API routes
├── components/
├── lib/
├── public/
└── next.config.js
```

### Nuxt 3

```
my-app/
├── pages/
│   ├── index.vue           # Home page
│   └── about.vue           # /about
├── layouts/
│   └── default.vue         # Default layout
├── components/             # Auto-imported
├── composables/            # Auto-imported
├── server/
│   └── api/                # API routes
├── public/
└── nuxt.config.ts
```

### Equivalencias de Carpetas

| Next.js          | Nuxt                      | Propósito              |
| ---------------- | ------------------------- | ---------------------- |
| `app/`           | `pages/`                  | Rutas de la aplicación |
| `app/layout.tsx` | `layouts/*.vue`           | Layouts                |
| `app/api/`       | `server/api/`             | API endpoints          |
| `components/`    | `components/`             | Componentes            |
| `lib/`           | `composables/` o `utils/` | Utilidades             |
| `public/`        | `public/`                 | Assets estáticos       |

---

## Sistema de Enrutamiento

### Páginas

#### ❌ Next.js

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return <div>About</div>;
}
```

#### ✅ Nuxt

```vue
<!-- pages/about.vue -->
<template>
  <div>About</div>
</template>
```

### Layouts

#### ❌ Next.js

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

#### ✅ Nuxt

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <header>Header</header>
    <slot />
    <footer>Footer</footer>
  </div>
</template>
```

### Route Groups (Next.js) → Layouts (Nuxt)

#### ❌ Next.js

```
app/
├── (auth)/
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
```

#### ✅ Nuxt

```
pages/
├── login.vue
└── register.vue

layouts/
└── auth.vue
```

```vue
<!-- pages/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div>Login</div>
</template>
```

### Rutas Dinámicas

#### ❌ Next.js

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  return <div>Post: {params.slug}</div>;
}
```

#### ✅ Nuxt

```vue
<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug;
</script>

<template>
  <div>Post: {{ slug }}</div>
</template>
```

### Rutas Catch-All

#### ❌ Next.js

```typescript
// app/blog/[...slug]/page.tsx
export default function BlogPost({ params }) {
  // params.slug es array: ['2024', '01', 'post']
}
```

#### ✅ Nuxt

```vue
<!-- pages/blog/[...slug].vue -->
<script setup lang="ts">
const route = useRoute();
// route.params.slug es array
</script>
```

---

## Hooks y APIs

### Navegación

| Next.js             | Nuxt                             | Uso                     |
| ------------------- | -------------------------------- | ----------------------- |
| `useRouter()`       | `useRouter()`                    | Router instance         |
| `usePathname()`     | `useRoute().path`                | Ruta actual             |
| `useSearchParams()` | `useRoute().query`               | Query params            |
| `useParams()`       | `useRoute().params`              | Route params            |
| `<Link>`            | `<NuxtLink>`                     | Componente de link      |
| `router.push()`     | `navigateTo()`                   | Navegación programática |
| `redirect()`        | `navigateTo(, { redirectCode })` | Redirects               |

#### ❌ Next.js

```typescript
"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

function MyComponent() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <p>Current: {pathname}</p>
      <Link href="/about">About</Link>
      <button onClick={() => router.push("/dashboard")}>Go to Dashboard</button>
    </>
  );
}
```

#### ✅ Nuxt

```vue
<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const goToDashboard = () => {
  navigateTo("/dashboard");
  // o router.push('/dashboard')
};
</script>

<template>
  <div>
    <p>Current: {{ route.path }}</p>
    <NuxtLink to="/about">About</NuxtLink>
    <button @click="goToDashboard">Go to Dashboard</button>
  </div>
</template>
```

### Metadata y SEO

#### ❌ Next.js

```typescript
// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "Welcome",
};
```

#### ✅ Nuxt

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
useHead({
  title: "My App",
  meta: [{ name: "description", content: "Welcome" }],
});

// O con useSeoMeta (más simple)
useSeoMeta({
  title: "My App",
  description: "Welcome",
  ogTitle: "My App",
  ogDescription: "Welcome",
});
</script>
```

---

## Data Fetching

### Server Components vs Composables

#### ❌ Next.js (Server Component)

```typescript
// app/page.tsx
async function getData() {
  const res = await fetch("https://api.example.com/data");
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

#### ✅ Nuxt (useFetch)

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
const { data } = await useFetch("https://api.example.com/data");
</script>

<template>
  <div>{{ data?.title }}</div>
</template>
```

### Client-Side Fetching

#### ❌ Next.js

```typescript
"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
}
```

#### ✅ Nuxt

```vue
<script setup lang="ts">
const { data, refresh } = await useFetch("/api/data", {
  lazy: true, // No bloquea la navegación
});

// O con $fetch para client-side puro
// const data = ref(null)
// onMounted(async () => {
//   data.value = await $fetch('/api/data')
// })
</script>

<template>
  <div>
    {{ data?.title }}
    <button @click="refresh">Refresh</button>
  </div>
</template>
```

---

## Configuración

### next.config.js → nuxt.config.ts

#### ❌ Next.js

```javascript
// next.config.js
export default {
  images: {
    domains: ["example.com"],
  },
  env: {
    API_URL: process.env.API_URL,
  },
  redirects: async () => [
    {
      source: "/old",
      destination: "/new",
      permanent: true,
    },
  ],
};
```

#### ✅ Nuxt

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    domains: ["example.com"],
  },
  runtimeConfig: {
    // Private (solo servidor)
    apiSecret: process.env.API_SECRET,

    // Public (cliente + servidor)
    public: {
      apiUrl: process.env.API_URL,
    },
  },
  routeRules: {
    "/old": { redirect: { to: "/new", statusCode: 301 } },
  },
});
```

### Variables de Entorno

#### ❌ Next.js

```bash
# .env
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET=secret123
```

```typescript
// Uso
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

#### ✅ Nuxt

```bash
# .env
NUXT_PUBLIC_API_URL=https://api.example.com
NUXT_API_SECRET=secret123
```

```typescript
// Uso
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const secret = config.apiSecret; // Solo en servidor
```

---

## Scripts y Comandos

| Tarea        | Next.js      | Nuxt                  |
| ------------ | ------------ | --------------------- |
| **Dev**      | `next dev`   | `nuxt dev`            |
| **Build**    | `next build` | `nuxt build`          |
| **Start**    | `next start` | `nuxt preview`        |
| **Lint**     | `next lint`  | Configura ESLint      |
| **Generate** | `next build` | `nuxt generate` (SSG) |

---

## Middleware

### ❌ Next.js

```typescript
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  if (!request.cookies.get("auth")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/dashboard/:path*",
};
```

### ✅ Nuxt

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authCookie = useCookie("auth");

  if (!authCookie.value) {
    return navigateTo("/login");
  }
});
```

```vue
<!-- pages/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
```

---

## Resumen de Migración

### Checklist

- [ ] Renombrar `app/` a `pages/`
- [ ] Convertir `.tsx` a `.vue`
- [ ] Cambiar `layout.tsx` a `layouts/*.vue`
- [ ] Actualizar imports de hooks
- [ ] Reemplazar `Link` con `NuxtLink`
- [ ] Convertir Server Components a `useFetch`
- [ ] Migrar metadata a `useHead`
- [ ] Actualizar configuración
- [ ] Ajustar middleware
- [ ] Verificar variables de entorno

---

**Siguiente**: [02-REACT-TO-VUE-PATTERNS.md](./02-REACT-TO-VUE-PATTERNS.md) para convertir componentes.

---

**Última actualización**: Octubre 30, 2025
