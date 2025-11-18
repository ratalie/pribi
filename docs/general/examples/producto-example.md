# 📦 Ejemplo Práctico: Gestión de Productos

Este documento muestra un ejemplo completo de cómo implementar un flujo usando arquitectura hexagonal, desde la definición de tipos hasta el componente Vue que lo consume.

## 🎯 Objetivo

Crear un sistema para gestionar productos (listar, crear, actualizar, eliminar) siguiendo la arquitectura hexagonal del proyecto.

---

## 📁 Estructura Completa

```
app/core/hexag/productos/
├── domain/
│   ├── entities/
│   │   └── producto.entity.ts          # Entidad de negocio
│   └── ports/
│       └── productos.repository.ts      # Contrato del repositorio
├── application/
│   ├── dtos/
│   │   └── producto.dto.ts            # Tipo para backend
│   └── use-cases/
│       ├── list-productos.use-case.ts
│       ├── create-producto.use-case.ts
│       ├── update-producto.use-case.ts
│       └── delete-producto.use-case.ts
└── infrastructure/
    ├── mappers/
    │   └── productos.mapper.ts          # Transforma DTO ↔ Entidad
    └── repositories/
        └── productos.http.repository.ts # Implementación HTTP
```

---

## 1️⃣ Capa de Dominio (Domain)

### Entidad: `domain/entities/producto.entity.ts`

Define cómo es un producto dentro de tu aplicación:

```typescript
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Contrato: `domain/ports/productos.repository.ts`

Define QUÉ operaciones se pueden hacer (sin decir CÓMO):

```typescript
import type { Producto } from "../entities/producto.entity";
import type { ProductoDTO } from "../../application/dtos/producto.dto";

export interface ProductosRepository {
  list(): Promise<Producto[]>;
  getById(id: string): Promise<Producto | null>;
  create(payload: ProductoDTO): Promise<Producto>;
  update(id: string, payload: ProductoDTO): Promise<Producto>;
  delete(id: string): Promise<void>;
}
```

---

## 2️⃣ Capa de Aplicación (Application)

### DTO: `application/dtos/producto.dto.ts`

Define el formato que espera el backend:

```typescript
export interface ProductoDTO {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
}
```

**Nota:** El DTO es más simple que la Entidad (no tiene `createdAt`, `updatedAt`) porque el backend no siempre los envía o los maneja internamente.

### Caso de Uso: `application/use-cases/list-productos.use-case.ts`

Orquesta la operación de listar productos:

```typescript
import type { Producto } from "../../domain";
import type { ProductosRepository } from "../../domain/ports/productos.repository";

export class ListProductosUseCase {
  constructor(private readonly repository: ProductosRepository) {}

  execute(): Promise<Producto[]> {
    return this.repository.list();
  }
}
```

### Caso de Uso: `application/use-cases/create-producto.use-case.ts`

Orquesta la creación de un producto:

```typescript
import type { Producto } from "../../domain";
import type { ProductosRepository } from "../../domain/ports/productos.repository";
import type { ProductoDTO } from "../dtos/producto.dto";

export class CreateProductoUseCase {
  constructor(private readonly repository: ProductosRepository) {}

  async execute(payload: ProductoDTO): Promise<Producto> {
    // Aquí podrías agregar validaciones de negocio
    // Por ejemplo: verificar que el precio sea positivo
    if (payload.precio <= 0) {
      throw new Error("El precio debe ser mayor a cero");
    }

    return this.repository.create(payload);
  }
}
```

---

## 3️⃣ Capa de Infraestructura (Infrastructure)

### Mapper: `infrastructure/mappers/productos.mapper.ts`

Transforma entre DTO (backend) y Entidad (interno):

```typescript
import type { Producto } from "../../domain/entities/producto.entity";
import type { ProductoDTO } from "../../application/dtos/producto.dto";

export const ProductosMapper = {
  // Convierte respuesta del backend (DTO) a Entidad
  toDomain(data: ProductoDTO & { createdAt?: string; updatedAt?: string }): Producto {
    return {
      id: data.id ?? "",
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      stock: data.stock,
      categoria: data.categoria,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },

  // Convierte lista de DTOs a lista de Entidades
  toDomainList(list: ProductoDTO[]): Producto[] {
    return list.map((item) => ProductosMapper.toDomain(item));
  },

  // Convierte Entidad a DTO para enviar al backend
  toPayload(entity: Producto): ProductoDTO {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      precio: entity.precio,
      stock: entity.stock,
      categoria: entity.categoria,
    };
  },
};
```

### Repositorio HTTP: `infrastructure/repositories/productos.http.repository.ts`

Implementa el contrato usando peticiones HTTP:

```typescript
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { ProductosRepository, Producto } from "../../domain";
import type { ProductoDTO } from "../../application/dtos/producto.dto";
import { ProductosMapper } from "../mappers/productos.mapper";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export class ProductosHttpRepository implements ProductosRepository {
  private readonly baseUrl = "/api/v1/productos";

  async list(): Promise<Producto[]> {
    const response = await $fetch<ApiResponse<ProductoDTO[]>>(
      this.baseUrl,
      withAuthHeaders({ method: "GET" })
    );

    const data = response?.data ?? [];
    return ProductosMapper.toDomainList(data);
  }

  async getById(id: string): Promise<Producto | null> {
    const response = await $fetch<ApiResponse<ProductoDTO>>(
      `${this.baseUrl}/${id}`,
      withAuthHeaders({ method: "GET" })
    );

    if (!response?.data) return null;
    return ProductosMapper.toDomain(response.data);
  }

  async create(payload: ProductoDTO): Promise<Producto> {
    const response = await $fetch<ApiResponse<ProductoDTO>>(
      this.baseUrl,
      withAuthHeaders({
        method: "POST",
        body: ProductosMapper.toPayload(payload as Producto),
      })
    );

    if (!response?.data) {
      throw new Error("No se pudo crear el producto");
    }

    return ProductosMapper.toDomain(response.data);
  }

  async update(id: string, payload: ProductoDTO): Promise<Producto> {
    const response = await $fetch<ApiResponse<ProductoDTO>>(
      `${this.baseUrl}/${id}`,
      withAuthHeaders({
        method: "PUT",
        body: ProductosMapper.toPayload(payload as Producto),
      })
    );

    if (!response?.data) {
      throw new Error("No se pudo actualizar el producto");
    }

    return ProductosMapper.toDomain(response.data);
  }

  async delete(id: string): Promise<void> {
    await $fetch(`${this.baseUrl}/${id}`, withAuthHeaders({ method: "DELETE" }));
  }
}
```

---

## 4️⃣ Capa de Presentación (Presentation)

### Tipos del Formulario: `presentation/productos/types/producto-form.types.ts`

Define la estructura de los datos del formulario (UI):

```typescript
export interface ProductoFormData {
  nombre: string;
  precioFormateado: string; // "$99.99" - formateado para mostrar
  descripcion: string;
  stock: string; // "10" - string del input
  categoriaId: string; // ID del select, no el nombre
  isValid?: boolean; // Solo para validación UI
  touched?: boolean; // Solo para UI
}
```

### Mapper de Formulario: `presentation/productos/mappers/producto-form.mapper.ts`

Transforma entre FormData (UI) y DTO (backend):

```typescript
import type { ProductoDTO } from "~/core/hexag/productos/application/dtos/producto.dto";
import type { Producto } from "~/core/hexag/productos/domain";
import type { ProductoFormData } from "../types/producto-form.types";

// Helper para obtener nombre de categoría por ID
function getCategoriaName(categoriaId: string): string {
  const categorias: Record<string, string> = {
    "cat-1": "Electrónica",
    "cat-2": "Ropa",
    "cat-3": "Hogar",
  };
  return categorias[categoriaId] ?? "General";
}

// Helper para obtener ID de categoría por nombre
function getCategoriaId(categoria: string): string {
  const categorias: Record<string, string> = {
    Electrónica: "cat-1",
    Ropa: "cat-2",
    Hogar: "cat-3",
  };
  return categorias[categoria] ?? "cat-1";
}

export const ProductoFormMapper = {
  // Convierte FormData (UI) → DTO (backend) - Para enviar
  toDTO(formData: ProductoFormData): ProductoDTO {
    return {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precioFormateado.replace(/[^0-9.]/g, "")),
      stock: parseInt(formData.stock),
      categoria: getCategoriaName(formData.categoriaId),
    };
  },

  // Convierte Entidad → FormData (UI) - Para llenar formulario al editar
  toFormData(entity: Producto): ProductoFormData {
    return {
      nombre: entity.nombre,
      precioFormateado: `$${entity.precio.toFixed(2)}`,
      descripcion: entity.descripcion,
      stock: entity.stock.toString(),
      categoriaId: getCategoriaId(entity.categoria),
      isValid: true,
      touched: false,
    };
  },
};
```

### Store: `presentation/productos/stores/productos.store.ts`

Gestiona el estado y llama a los casos de uso:

```typescript
import { defineStore } from "pinia";
import { ProductosHttpRepository } from "~/core/hexag/productos/infrastructure/repositories/productos.http.repository";
import {
  ListProductosUseCase,
  CreateProductoUseCase,
} from "~/core/hexag/productos/application";
import type { Producto } from "~/core/hexag/productos/domain";
import type { ProductoDTO } from "~/core/hexag/productos/application/dtos/producto.dto";

export const useProductosStore = defineStore("productos", {
  state: () => ({
    productos: [] as Producto[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadProductos() {
      this.loading = true;
      this.error = null;

      const repository = new ProductosHttpRepository();
      const listUseCase = new ListProductosUseCase(repository);

      try {
        this.productos = await listUseCase.execute();
      } catch (err: any) {
        this.error = err.message ?? "Error al cargar productos";
      } finally {
        this.loading = false;
      }
    },

    async createProducto(payload: ProductoDTO) {
      this.loading = true;
      this.error = null;

      const repository = new ProductosHttpRepository();
      const createUseCase = new CreateProductoUseCase(repository);

      try {
        const nuevo = await createUseCase.execute(payload);
        this.productos.push(nuevo);
        return nuevo;
      } catch (err: any) {
        this.error = err.message ?? "Error al crear producto";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
```

### Controller: `presentation/productos/composables/useProductosController.ts`

Controlador reactivo que gestiona la carga automática y transformaciones:

```typescript
import { onMounted, computed } from "vue";
import { useProductosStore } from "../stores/productos.store";
import { ProductoFormMapper } from "../mappers/producto-form.mapper";
import type { ProductoFormData } from "../types/producto-form.types";

export function useProductosController() {
  const store = useProductosStore();

  // Cargar productos automáticamente al montar
  onMounted(() => {
    if (store.productos.length === 0) {
      store.loadProductos();
    }
  });

  // Crear producto: FormData → DTO → Store
  async function createProducto(formData: ProductoFormData) {
    const dto = ProductoFormMapper.toDTO(formData);
    return store.createProducto(dto);
  }

  // Actualizar producto: FormData → DTO → Store
  async function updateProducto(id: string, formData: ProductoFormData) {
    const dto = ProductoFormMapper.toDTO(formData);
    return store.updateProducto(id, dto);
  }

  // Cargar producto para editar: Entidad → FormData
  async function loadProductoForEdit(id: string): Promise<ProductoFormData> {
    const producto = await store.getProductoById(id);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    return ProductoFormMapper.toFormData(producto);
  }

  return {
    productos: computed(() => store.productos),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    loadProductos: store.loadProductos,
    createProducto,
    updateProducto,
    loadProductoForEdit,
  };
}
```

### Componente Vue: `presentation/productos/ProductosList.vue`

Componente que muestra la lista de productos y permite crear/editar:

```vue
<script setup lang="ts">
  import { ref } from "vue";
  import { useProductosController } from "./composables/useProductosController";
  import type { ProductoFormData } from "./types/producto-form.types";

  const { productos, loading, error, createProducto, updateProducto, loadProductoForEdit } =
    useProductosController();

  const formData = ref<ProductoFormData>({
    nombre: "",
    precioFormateado: "",
    descripcion: "",
    stock: "",
    categoriaId: "",
    isValid: false,
    touched: false,
  });

  const editingId = ref<string | null>(null);

  // Crear producto: FormData → Controller (que convierte a DTO)
  async function handleCreate() {
    try {
      await createProducto(formData.value);
      resetForm();
      // Mostrar toast de éxito
    } catch (err) {
      // Mostrar toast de error
    }
  }

  // Cargar producto para editar: Controller convierte Entidad → FormData
  async function handleEdit(id: string) {
    try {
      const form = await loadProductoForEdit(id);
      formData.value = form;
      editingId.value = id;
    } catch (err) {
      // Mostrar toast de error
    }
  }

  // Actualizar producto: FormData → Controller (que convierte a DTO)
  async function handleUpdate() {
    if (!editingId.value) return;

    try {
      await updateProducto(editingId.value, formData.value);
      resetForm();
      // Mostrar toast de éxito
    } catch (err) {
      // Mostrar toast de error
    }
  }

  function resetForm() {
    formData.value = {
      nombre: "",
      precioFormateado: "",
      descripcion: "",
      stock: "",
      categoriaId: "",
      isValid: false,
      touched: false,
    };
    editingId.value = null;
  }
</script>

<template>
  <div>
    <h1>Productos</h1>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="producto in productos" :key="producto.id">
        <h3>{{ producto.nombre }}</h3>
        <p>{{ producto.descripcion }}</p>
        <p>Precio: ${{ producto.precio }}</p>
        <p>Stock: {{ producto.stock }}</p>
        <button @click="handleEdit(producto.id)">Editar</button>
      </li>
    </ul>

    <!-- Formulario -->
    <form @submit.prevent="editingId ? handleUpdate() : handleCreate()">
      <input v-model="formData.nombre" placeholder="Nombre" />
      <input v-model="formData.precioFormateado" placeholder="Precio ($99.99)" />
      <textarea v-model="formData.descripcion" placeholder="Descripción"></textarea>
      <input v-model="formData.stock" placeholder="Stock" />
      <select v-model="formData.categoriaId">
        <option value="cat-1">Electrónica</option>
        <option value="cat-2">Ropa</option>
        <option value="cat-3">Hogar</option>
      </select>
      <button type="submit">{{ editingId ? "Actualizar" : "Crear" }} Producto</button>
      <button v-if="editingId" type="button" @click="resetForm">Cancelar</button>
    </form>
  </div>
</template>
```

---

## 5️⃣ Página Vue: `pages/productos/index.vue`

Página que renderiza el componente:

```vue
<script setup lang="ts">
  import ProductosList from "~/core/presentation/productos/ProductosList.vue";
</script>

<template>
  <ProductosList />
</template>
```

---

## 🔄 Flujo Completo Paso a Paso

### Escenario 1: Usuario visita la página de productos (Listar)

```
1. Usuario navega a /productos
   ↓
2. pages/productos/index.vue se monta
   ↓
3. Renderiza ProductosList.vue
   ↓
4. ProductosList usa useProductosController()
   ↓
5. Controller llama a useProductosStore()
   ↓
6. Store ejecuta loadProductos()
   ↓
7. Store instancia ListProductosUseCase(repository)
   ↓
8. Caso de uso ejecuta repository.list()
   ↓
9. ProductosHttpRepository hace GET /api/v1/productos
   ↓
10. Backend responde con array de ProductoDTO[]
    ↓
11. Repository usa ProductosMapper.toDomainList() (Infrastructure)
    ↓
12. Mapper convierte cada DTO a Entidad Producto
    ↓
13. Store recibe Producto[] y actualiza el estado
    ↓
14. Componente Vue se re-renderiza con los productos
```

### Escenario 2: Usuario crea un producto (FormData → DTO)

```
1. Usuario llena formulario → ProductoFormData (UI)
   ↓
2. Usuario hace clic en "Crear"
   ↓
3. Componente llama controller.createProducto(formData)
   ↓
4. Controller usa ProductoFormMapper.toDTO() (Presentation)
   ↓
5. Mapper convierte FormData → DTO
   - precioFormateado: "$99.99" → precio: 99.99
   - stock: "10" → stock: 10
   - categoriaId: "cat-1" → categoria: "Electrónica"
   ↓
6. Controller llama store.createProducto(dto)
   ↓
7. Store llama useCase.execute(dto)
   ↓
8. UseCase llama repository.create(dto)
   ↓
9. Repository usa ProductosMapper.toPayload() (Infrastructure)
   ↓
10. Mapper prepara payload final
    ↓
11. POST /api/v1/productos con DTO
    ↓
12. Backend responde con ProductoDTO
    ↓
13. Repository convierte DTO → Entidad (Infrastructure Mapper)
    ↓
14. Store actualiza estado con nueva Entidad
    ↓
15. Componente se re-renderiza
```

### Escenario 3: Usuario edita un producto (Entidad → FormData)

```
1. Usuario hace clic en "Editar" → ID del producto
   ↓
2. Componente llama controller.loadProductoForEdit(id)
   ↓
3. Controller llama store.getProductoById(id)
   ↓
4. Store carga producto (si no está en cache)
   ↓
5. Store retorna Entidad Producto
   ↓
6. Controller usa ProductoFormMapper.toFormData() (Presentation)
   ↓
7. Mapper convierte Entidad → FormData
   - precio: 99.99 → precioFormateado: "$99.99"
   - stock: 10 → stock: "10"
   - categoria: "Electrónica" → categoriaId: "cat-1"
   ↓
8. Controller retorna ProductoFormData
   ↓
9. Componente llena formulario con FormData
   ↓
10. Usuario modifica datos
    ↓
11. Usuario guarda → Sigue flujo del Escenario 2 (FormData → DTO)
```

---

## 📊 Tabla: Quién usa qué

| Capa               | Contiene                     | Usado por       | Ejemplo de código                                                                        |
| ------------------ | ---------------------------- | --------------- | ---------------------------------------------------------------------------------------- |
| **Domain**         | Entidades, Contratos         | Casos de Uso    | `Producto`, `ProductosRepository`                                                        |
| **Application**    | DTOs, Casos de Uso           | Stores          | `ProductoDTO`, `ListProductosUseCase`                                                    |
| **Infrastructure** | Mappers, Repositorios        | Casos de Uso    | `ProductosMapper` (DTO ↔ Entidad)                                                        |
| **Presentation**   | Stores, Controllers, Mappers | Componentes Vue | `useProductosStore()`, `useProductosController()`, `ProductoFormMapper` (FormData ↔ DTO) |

## 📋 Resumen de Mappers

| Mapper                 | Ubicación      | Convierte                | Propósito              |
| ---------------------- | -------------- | ------------------------ | ---------------------- |
| **ProductosMapper**    | Infrastructure | DTO ↔ Entidad            | Backend ↔ Dominio      |
| **ProductoFormMapper** | Presentation   | FormData ↔ DTO / Entidad | UI ↔ Backend / Dominio |

### Funciones de cada Mapper:

**Infrastructure Mapper (`productos.mapper.ts`):**

- `toDomain()`: DTO → Entidad (al recibir del backend)
- `toPayload()`: Entidad → DTO (al enviar al backend)

**Presentation Mapper (`producto-form.mapper.ts`):**

- `toDTO()`: FormData → DTO (al enviar desde formulario)
- `toFormData()`: Entidad → FormData (al llenar formulario para editar)

---

## ✅ Resumen

1. **Domain**: Define QUÉ es un producto y QUÉ operaciones se pueden hacer
2. **Application**: Define CÓMO se comunican con el backend (DTOs) y orquesta operaciones (casos de uso)
3. **Infrastructure**: Implementa CÓMO se obtienen los datos (HTTP) y transforma formatos (mappers)
4. **Presentation**: Conecta todo con Vue usando stores y controllers

---

## 🎯 Ventajas de esta Arquitectura

- **Intercambiable**: Puedes cambiar `ProductosHttpRepository` por `ProductosMockRepository` sin tocar el resto
- **Testeable**: Puedes testear casos de uso sin necesidad de API real
- **Mantenible**: Cada capa tiene una responsabilidad clara
- **Escalable**: Fácil agregar nuevos casos de uso o repositorios

---

[← Volver a Arquitectura](../ARCHITECTURE.md)
