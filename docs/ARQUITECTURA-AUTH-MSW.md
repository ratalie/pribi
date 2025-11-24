# 🏗️ ARQUITECTURA: Autenticación con MSW

**Fecha:** Enero 2025  
**Estrategia:** Desarrollo Frontend Completo con MSW, Migración Fácil a Backend Real

---

## 🎯 FILOSOFÍA

### ¿Por qué MSW?

1. **Desarrollo Paralelo:** Frontend y Backend pueden trabajar simultáneamente
2. **Contratos Claros:** Definimos exactamente qué esperamos del backend
3. **Testing Completo:** Podemos probar todos los flujos sin backend
4. **Migración Fácil:** Solo cambiamos la URL cuando backend esté listo

### ¿Es Posible Lograr Todo con MSW?

**✅ SÍ, absolutamente.** MSW puede simular:
- ✅ Autenticación completa (login, logout, refresh)
- ✅ Permisos y roles
- ✅ CRUD de usuarios
- ✅ Workspaces y recursos
- ✅ Admin panel completo

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
app/
├── core/
│   ├── hexag/
│   │   └── auth/
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   │   └── User.ts
│   │       │   └── ports/
│   │       │       └── AuthRepository.ts
│   │       ├── application/
│   │       │   ├── dtos/
│   │       │   │   ├── LoginCredentialsDTO.ts
│   │       │   │   ├── AuthSessionDTO.ts
│   │       │   │   └── UserDTO.ts
│   │       │   └── use-cases/
│   │       │       ├── LoginUseCase.ts
│   │       │       ├── GetCurrentUserUseCase.ts
│   │       │       └── RefreshTokenUseCase.ts
│   │       └── infrastructure/
│   │           ├── repositories/
│   │           │   └── AuthHttpRepository.ts
│   │           ├── mocks/
│   │           │   ├── handlers/
│   │           │   │   ├── auth.handlers.ts      ← MSW handlers
│   │           │   │   └── user.handlers.ts
│   │           │   └── data/
│   │           │       ├── users.state.ts        ← Estado mock
│   │           │       └── permissions.state.ts
│   │           └── mappers/
│   │               └── UserMapper.ts
│   └── presentation/
│       ├── auth/
│       │   └── stores/
│       │       └── auth.store.ts
│       └── user/
│           └── stores/
│               └── user.store.ts
│
├── composables/
│   ├── useUser.ts
│   ├── usePermissions.ts
│   └── useAuth.ts
│
├── middleware/
│   ├── auth.global.ts
│   └── permissions.ts
│
├── plugins/
│   └── auth-refresh.client.ts
│
└── types/
    ├── user.ts
    └── permissions.ts
```

---

## 🔄 FLUJO DE AUTENTICACIÓN

### 1. Login

```
Usuario → LoginForm
  ↓
auth.store.login(credentials)
  ↓
LoginUseCase.execute()
  ↓
AuthHttpRepository.login()
  ↓
MSW Handler intercepta
  ↓
Devuelve token + user
  ↓
auth.store.session = token
  ↓
user.store.fetchUser() (obtener permisos)
  ↓
Redirigir a dashboard
```

### 2. Verificación de Token

```
Cualquier Request
  ↓
withAuthHeaders()
  ↓
Verificar token no expirado
  ↓
Si expirado → logout → redirect login
  ↓
Agregar Authorization header
  ↓
Enviar request
```

### 3. Refresh Token

```
Plugin auth-refresh.client.ts
  ↓
Cada 5 minutos
  ↓
Verificar si token expira pronto
  ↓
RefreshTokenUseCase.execute()
  ↓
MSW Handler intercepta
  ↓
Devuelve nuevo token
  ↓
Actualizar auth.store.session
```

---

## 📦 IMPLEMENTACIÓN CON MSW

### 1. MSW Handlers

**Archivo:** `app/core/hexag/auth/infrastructure/mocks/handlers/auth.handlers.ts`

```typescript
import { http, HttpResponse } from "msw";
import { mockUsers, mockTokens } from "../data/users.state";

export const authHandlers = [
  // Login
  http.post("*/api/v2/auth", async ({ request }) => {
    const { email, password } = await request.json();
    
    // Buscar usuario mock
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || password !== "password123") {
      return HttpResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }
    
    // Generar token mock
    const token = mockTokens.generate(user.id);
    
    return HttpResponse.json({
      success: true,
      data: {
        token: token.accessToken,
        refreshToken: token.refreshToken,
        expiresIn: 3600,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  }),
  
  // Obtener usuario actual
  http.get("*/api/v2/user/me", ({ request }) => {
    const token = extractToken(request);
    const userId = mockTokens.validate(token);
    
    if (!userId) {
      return HttpResponse.json(
        { success: false, message: "Token inválido" },
        { status: 401 }
      );
    }
    
    const user = mockUsers.find(u => u.id === userId);
    const permissions = getPermissionsForUser(userId);
    
    return HttpResponse.json({
      success: true,
      data: {
        user,
        permissions,
      },
    });
  }),
  
  // Refresh token
  http.post("*/api/v2/auth/refresh", async ({ request }) => {
    const { refreshToken } = await request.json();
    const userId = mockTokens.validateRefresh(refreshToken);
    
    if (!userId) {
      return HttpResponse.json(
        { success: false, message: "Refresh token inválido" },
        { status: 401 }
      );
    }
    
    const newToken = mockTokens.generate(userId);
    
    return HttpResponse.json({
      success: true,
      data: {
        token: newToken.accessToken,
        refreshToken: newToken.refreshToken,
        expiresIn: 3600,
      },
    });
  }),
];
```

### 2. Estado Mock

**Archivo:** `app/core/hexag/auth/infrastructure/mocks/data/users.state.ts`

```typescript
export const mockUsers = [
  {
    id: "admin-1",
    email: "admin@probo.com",
    name: "Administrador",
    role: { id: "admin", name: "Administrador" },
  },
  {
    id: "user-1",
    email: "user@probo.com",
    name: "Usuario Estándar",
    role: { id: "user", name: "Usuario" },
  },
];

export const mockPermissions = {
  "admin-1": {
    systemFeatures: {
      societies: { create: true, read: true, update: true, delete: true },
      // ... todos los permisos
    },
    repositoryAccess: {
      fullAccess: true,
    },
  },
  "user-1": {
    systemFeatures: {
      societies: { create: false, read: true, update: false, delete: false },
      // ... permisos limitados
    },
    repositoryAccess: {
      fullAccess: false,
      permissions: {
        view: true,
        download: false,
        upload: true,
        delete: false,
        search: true,
      },
    },
  },
};

export const mockTokens = {
  tokens: new Map<string, { userId: string; expiresAt: number }>(),
  
  generate(userId: string) {
    const accessToken = `mock-access-${userId}-${Date.now()}`;
    const refreshToken = `mock-refresh-${userId}-${Date.now()}`;
    
    this.tokens.set(accessToken, {
      userId,
      expiresAt: Date.now() + 3600000, // 1 hora
    });
    
    return { accessToken, refreshToken };
  },
  
  validate(token: string) {
    const tokenData = this.tokens.get(token);
    if (!tokenData) return null;
    if (Date.now() > tokenData.expiresAt) return null;
    return tokenData.userId;
  },
  
  validateRefresh(refreshToken: string) {
    // Lógica similar
    return "admin-1"; // Mock
  },
};
```

### 3. Repositorio HTTP (Funciona con MSW)

**Archivo:** `app/core/hexag/auth/infrastructure/repositories/auth.http.repository.ts`

```typescript
export class AuthHttpRepository implements AuthRepository {
  async login(credentials: LoginCredentialsDTO): Promise<AuthSessionDTO> {
    // MSW interceptará esta llamada
    const response = await $fetch("/api/v2/auth", {
      method: "POST",
      body: credentials,
    });
    
    return {
      token: response.data.token,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    };
  }
  
  async getCurrentUser(): Promise<UserDTO> {
    // MSW interceptará esta llamada
    const response = await $fetch("/api/v2/user/me", {
      headers: withAuthHeaders().headers,
    });
    
    return response.data.user;
  }
}
```

---

## 🔄 MIGRACIÓN A BACKEND REAL

### Paso 1: Cambiar URL Base

**Archivo:** `nuxt.config.ts`

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3000",
    // En desarrollo: MSW intercepta
    // En producción: Backend real
  },
}
```

### Paso 2: Deshabilitar MSW

**Archivo:** `nuxt.config.ts`

```typescript
runtimeConfig: {
  public: {
    mswDisabled: process.env.MSW_DISABLED === "true",
  },
}
```

### Paso 3: Actualizar Repositorio (Si es necesario)

**Archivo:** `app/core/hexag/auth/infrastructure/repositories/auth.http.repository.ts`

```typescript
// Solo cambiar la URL si es diferente
const response = await $fetch(`${config.public.apiBase}/api/v2/auth`, {
  // ... resto igual
});
```

**✅ Eso es todo.** El resto del código sigue igual.

---

## ✅ VENTAJAS DE ESTA ARQUITECTURA

1. **Separación de Responsabilidades:**
   - Domain: Lógica de negocio
   - Application: Casos de uso
   - Infrastructure: HTTP + MSW

2. **Fácil Testing:**
   - MSW simula backend
   - Podemos probar todos los flujos

3. **Migración Sin Dolor:**
   - Solo cambiamos URL
   - El resto sigue igual

4. **Contratos Claros:**
   - Definimos exactamente qué esperamos
   - Backend sabe qué implementar

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: MSW Setup
- [x] MSW instalado y configurado
- [ ] Handlers de auth creados
- [ ] Estado mock de usuarios
- [ ] Estado mock de permisos

### Fase 2: Integración
- [ ] Repositorio HTTP usando MSW
- [ ] Store de usuario obteniendo datos de MSW
- [ ] Composable de permisos funcionando

### Fase 3: Migración
- [ ] Cambiar URL a backend real
- [ ] Deshabilitar MSW
- [ ] Verificar que todo funciona

---

**¿Listo para implementar con MSW?** 🚀


