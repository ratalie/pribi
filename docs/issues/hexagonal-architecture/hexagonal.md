# Guía Completa de la Arquitectura Hexagonal en Next.js

Este documento es una guía de referencia completa que detalla la implementación de la Arquitectura Hexagonal (también conocida como Puertos y Adaptadores) en este proyecto de Next.js. El objetivo es proporcionar una visión clara de la estructura, responsabilidades y el código de cada componente.

## 1. Conceptos Fundamentales

La Arquitectura Hexagonal busca aislar la lógica de negocio principal de la aplicación (el **Dominio**) de las dependencias externas como la UI, bases de datos o APIs (la **Infraestructura**).

- **Hexágono (Núcleo de la Aplicación)**: Contiene la lógica de negocio.
  - **Capa de Dominio**: El corazón de la aplicación. Define las entidades (`Person`) y las reglas de negocio más puras. No sabe nada del mundo exterior.
  - **Capa de Aplicación**: Orquesta la lógica. Contiene los **Casos de Uso** (`CreatePerson`, `GetPersons`, etc.) que definen las acciones que el sistema puede realizar.

- **Puertos**: Son interfaces definidas en el núcleo de la aplicación (generalmente en el dominio). Definen un contrato que la infraestructura *debe* implementar. Un ejemplo es `PersonRepository`.

- **Adaptadores**: Son las implementaciones concretas de los puertos. Se encuentran en la capa de infraestructura y "adaptan" la tecnología externa (una API REST, una base de datos, etc.) al lenguaje que entiende el dominio. Ejemplos: `FetchPersonRepository`, `ApiV2PersonRepository`.

- **Infraestructura**: Contiene todo lo que interactúa con el mundo exterior: la UI (componentes de React), las implementaciones de los repositorios, la configuración de `msw` para mocks, etc.

## 2. Estructura de Carpetas

Todo el código del núcleo de la aplicación se encuentra encapsulado dentro de `src/hexagon` para mantenerlo aislado del framework Next.js.

```
src
├── app
│   └── page.tsx      # (Adaptador de UI) El componente de React que consume los casos de uso.
└── hexagon
    ├── application
    │   ├── dtos
    │   │   └── create-person-dto.ts
    │   └── use-cases
    │       ├── create-person.ts
    │       ├── delete-person.ts
    │       ├── get-persons.ts
    │       └── update-person.ts
    ├── domain
    │   ├── entities
    │   │   └── person.ts
    │   └── ports
    │       └── person-repository.ts
    └── infrastructure
        ├── data
        │   └── mock-data.ts
        ├── mocks
        │   ├── browser.ts
        │   └── handlers.ts
        └── repositories
            ├── api-v2-person-repository.ts
            └── fetch-person-repository.ts
```

---

## 3. Código Fuente Detallado

A continuación se muestra el código completo de cada archivo relevante.

### 3.1. Capa de Dominio (El "Qué")

El núcleo de la lógica de negocio.

#### **`src/hexagon/domain/entities/person.ts`**
Define la estructura fundamental de una `Person` en toda la aplicación.

```ts
/**
 * @fileoverview Define la entidad de dominio `Person`.
 *
 * Las entidades representan los objetos de negocio fundamentales del sistema.
 * Son el núcleo del dominio y contienen la lógica de negocio más pura.
 * No deben tener dependencias de frameworks o librerías externas.
 *
 * Esta interfaz define la "forma" que debe tener cualquier objeto `Person`
 * en toda la aplicación.
 */

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}
```

#### **`src/hexagon/domain/ports/person-repository.ts`**
Define el "contrato" (puerto) que cualquier repositorio de personas debe seguir.

```ts
import type { Person } from '../entities/person';
import type { CreatePersonDTO } from '@/hexagon/application/dtos/create-person-dto';

/**
 * @fileoverview Define el Puerto del Repositorio de Personas.
 *
 * En la arquitectura hexagonal, un "puerto" es una interfaz que define
 * cómo la capa de aplicación se comunica con el mundo exterior (la infraestructura).
 *
 * `PersonRepository` es un contrato que cualquier adaptador de persistencia
 * (como una base de datos, una API externa, o un mock) debe implementar.
 * La capa de aplicación y de dominio dependen de esta interfaz, no de una
 * implementación concreta. Esto nos permite cambiar la fuente de datos
 * sin modificar la lógica de negocio.
 */
export interface PersonRepository {
  /**
   * Obtiene todas las entidades Person.
   * @returns {Promise<Person[]>} Una promesa que resuelve a un array de personas.
   */
  getAll(): Promise<Person[]>;

  /**
   * Obtiene una persona por su ID.
   * @param {string} id - El ID de la persona a buscar.
   * @returns {Promise<Person | null>} La persona encontrada o null si no existe.
   */
  getById(id: string): Promise<Person | null>;
  
  /**
   * Crea una nueva persona.
   * @param {CreatePersonDTO} person - Los datos para crear la persona.
   * @returns {Promise<Person>} La persona recién creada, incluyendo su nuevo ID.
   */
  create(person: CreatePersonDTO): Promise<Person>;
  
  /**
   * Actualiza una persona existente.
   * @param {Person} person - La entidad persona con los datos actualizados.
   * @returns {Promise<Person | null>} La persona actualizada o null si no se encontró.
   */
  update(person: Person): Promise<Person | null>;

  /**
   * Elimina una persona por su ID.
   * @param {string} id - El ID de la persona a eliminar.
   * @returns {Promise<boolean>} Verdadero si la eliminación fue exitosa.
   */
  delete(id: string): Promise<boolean>;
}
```

### 3.2. Capa de Aplicación (El "Cómo")

Orquesta el flujo de datos y contiene la lógica específica de la aplicación.

#### **`src/hexagon/application/dtos/create-person-dto.ts`**
Data Transfer Object para la creación de una persona.

```ts
import type { Person } from "@/hexagon/domain/entities/person";

/**
 * @fileoverview Define el Data Transfer Object (DTO) para crear una persona.
 *
 * Un DTO es un objeto simple que se utiliza para transferir datos entre capas,
 * en este caso, desde la capa de UI/API hacia la capa de aplicación.
 *
 * Este DTO omite el `id` porque es generado por el sistema de persistencia (backend)
 * y no por el cliente.
 */

export type CreatePersonDTO = Omit<Person, 'id'>;
```

#### **`src/hexagon/application/use-cases/*.ts`**
Implementaciones de los casos de uso. Cada clase tiene una única responsabilidad.

**`create-person.ts`**
```ts
import type { PersonRepository } from '@/hexagon/domain/ports/person-repository';
import type { Person } from '@/hexagon/domain/entities/person';
import type { CreatePersonDTO } from '../dtos/create-person-dto';

/**
 * @fileoverview Caso de Uso para Crear una Persona.
 *
 * La capa de aplicación contiene la lógica de negocio específica de la aplicación.
 * Orquesta el flujo de datos entre la UI y el dominio.
 *
 * La clase `CreatePerson` tiene una única responsabilidad: manejar la creación de una persona.
 * Depende de una abstracción (el puerto `PersonRepository`) en lugar de una implementación concreta.
 * Esto se conoce como Inversión de Dependencias.
 */
export class CreatePerson {
  /**
   * El constructor recibe una implementación del `PersonRepository`.
   * @param {PersonRepository} personRepository - Una instancia que cumple con la interfaz del repositorio.
   */
  constructor(private personRepository: PersonRepository) {}

  /**
   * Ejecuta el caso de uso.
   * Toma los datos de entrada (DTO), los pasa al repositorio para su persistencia
   * y devuelve la entidad `Person` creada.
   * @param {CreatePersonDTO} personData - Los datos para crear la nueva persona.
   * @returns {Promise<Person>} La persona recién creada.
   */
  async execute(personData: CreatePersonDTO): Promise<Person> {
    // La lógica de negocio podría ir aquí (validaciones, etc.)
    // antes de llamar al repositorio.
    return this.personRepository.create(personData);
  }
}
```

**`get-persons.ts`**
```ts
import type { PersonRepository } from '@/hexagon/domain/ports/person-repository';
import type { Person } from '@/hexagon/domain/entities/person';

/**
 * @fileoverview Caso de Uso para Obtener todas las Personas.
 */
export class GetPersons {
    /**
     * @param {PersonRepository} personRepository - Una implementación del puerto del repositorio.
     */
  constructor(private personRepository: PersonRepository) {}

  /**
   * Ejecuta la lógica para obtener una lista de todas las personas.
   * @returns {Promise<Person[]>} Un array de entidades Person.
   */
  async execute(): Promise<Person[]> {
    return this.personRepository.getAll();
  }
}
```

**`update-person.ts`**
```ts
import type { PersonRepository } from '@/hexagon/domain/ports/person-repository';
import type { Person } from '@/hexagon/domain/entities/person';

/**
 * @fileoverview Caso de Uso para Actualizar una Persona.
 */
export class UpdatePerson {
  /**
   * @param {PersonRepository} personRepository - Una implementación del puerto del repositorio.
   */
  constructor(private personRepository: PersonRepository) {}

  /**
   * Ejecuta la lógica para actualizar una persona existente.
   * @param {Person} person - La entidad Person con los datos actualizados.
   * @returns {Promise<Person | null>} La persona actualizada, o null si no se encontró.
   */
  async execute(person: Person): Promise<Person | null> {
    return this.personRepository.update(person);
  }
}
```

**`delete-person.ts`**
```ts
import type { PersonRepository } from '@/hexagon/domain/ports/person-repository';

/**
 * @fileoverview Caso de Uso para Eliminar una Persona.
 */
export class DeletePerson {
  /**
   * @param {PersonRepository} personRepository - Una implementación del puerto del repositorio.
   */
  constructor(private personRepository: PersonRepository) {}

  /**
   * Ejecuta la lógica para eliminar una persona por su ID.
   * @param {string} id - El ID de la persona a eliminar.
   * @returns {Promise<boolean>} Verdadero si la eliminación fue exitosa.
   */
  async execute(id: string): Promise<boolean> {
    return this.personRepository.delete(id);
  }
}
```

### 3.3. Capa de Infraestructura (Los "Adaptadores")

Implementaciones concretas que conectan el núcleo con el mundo exterior.

#### **`src/hexagon/infrastructure/repositories/fetch-person-repository.ts`**
Implementación (adaptador) del repositorio para la API v1.

```ts
import type { PersonRepository } from '@/hexagon/domain/ports/person-repository';
import type { Person } from '@/hexagon/domain/entities/person';
import type { CreatePersonDTO } from '@/hexagon/application/dtos/create-person-dto';

/**
 * @fileoverview Implementación del repositorio que se comunica con la API v1.
 *
 * Esta clase es otro "Adaptador" en la arquitectura hexagonal.
 * Implementa el puerto `PersonRepository` para interactuar con la primera
 * versión de nuestra API simulada (`/api/persons`).
 *
 * En este caso, el DTO de la API v1 coincide exactamente con nuestra entidad
 * de dominio `Person`, por lo que no se necesitan métodos de "traducción"
 * como en el `ApiV2PersonRepository`.
 */
export class FetchPersonRepository implements PersonRepository {
  private apiUrl = '/api/persons';

  async getAll(): Promise<Person[]> {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error('Fallo al obtener personas');
    }
    return response.json();
  }

  async getById(id: string): Promise<Person | null> {
    const response = await fetch(`${this.apiUrl}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Fallo al obtener persona');
    }
    return response.json();
  }

  async create(personData: CreatePersonDTO): Promise<Person> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personData),
    });
    if (!response.ok) {
      throw new Error('Fallo al crear persona');
    }
    return response.json();
  }

  async update(personToUpdate: Person): Promise<Person | null> {
    const response = await fetch(`${this.apiUrl}/${personToUpdate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personToUpdate),
    });
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Fallo al actualizar persona');
    }
    return response.json();
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
}
```

#### **`src/hexagon/infrastructure/repositories/api-v2-person-repository.ts`**
Implementación (adaptador) del repositorio para la API v2. Fíjate en los métodos de traducción `toDomain` y `fromDomain`.

```ts
import type { PersonRepository } from '@/hexagon/domain/ports/person-repository';
import type { Person } from '@/hexagon/domain/entities/person';
import type { CreatePersonDTO } from '@/hexagon/application/dtos/create-person-dto';

/**
 * @fileoverview Implementación del repositorio que se comunica con la API v2.
 *
 * Esta clase es un "Adaptador" en la arquitectura hexagonal. Su responsabilidad es
 * conectar la capa de aplicación (a través del puerto PersonRepository) con una
 * tecnología externa específica (la API REST v2).
 *
 * La característica clave aquí es que esta clase "traduce" entre el
 * modelo de dominio (`Person`) y el Data Transfer Object (DTO) específico de la API v2.
 */

// DTO para la API V2. Nótese los nombres de campo diferentes (givenName, familyName).
// Esto simula una API externa sobre la cual no tenemos control.
type PersonV2DTO = {
  id: string;
  givenName: string;
  familyName: string;
  age: number;
};

// Esta implementación del repositorio se comunica con nuestro segundo backend simulado.
export class ApiV2PersonRepository implements PersonRepository {
  private apiUrl = '/api/v2/people';

  // --- Métodos Adaptadores (privados) ---

  /**
   * Convierte un DTO de la API v2 a una entidad de dominio `Person`.
   * @param {PersonV2DTO} dto - El objeto de datos de la API.
   * @returns {Person} La entidad de dominio.
   */
  private toDomain(dto: PersonV2DTO): Person {
    return {
      id: dto.id,
      firstName: dto.givenName,
      lastName: dto.familyName,
      age: dto.age,
    };
  }

  /**
   * Convierte una entidad de dominio `Person` (o un DTO de creación)
   * a un DTO compatible con la API v2.
   * @param {Person | CreatePersonDTO} person - La entidad de dominio.
   * @returns {Omit<PersonV2DTO, 'id'>} El objeto de datos para la API.
   */
  private fromDomain(person: Person | CreatePersonDTO): Omit<PersonV2DTO, 'id'> {
    return {
      givenName: person.firstName,
      familyName: person.lastName,
      age: person.age,
    };
  }
  // ------------------------------------


  async getAll(): Promise<Person[]> {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error('Fallo al obtener personas de la API v2');
    }
    const dtos: PersonV2DTO[] = await response.json();
    return dtos.map(this.toDomain); // Adapta DTO a entidad de dominio
  }

  async getById(id: string): Promise<Person | null> {
    const response = await fetch(`${this.apiUrl}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Fallo al obtener persona de la API v2');
    }
    const dto: PersonV2DTO = await response.json();
    return this.toDomain(dto); // Adapta DTO a entidad de dominio
  }

  async create(personData: CreatePersonDTO): Promise<Person> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.fromDomain(personData)), // Adapta dominio a DTO
    });
    if (!response.ok) {
      throw new Error('Fallo al crear persona en la API v2');
    }
    const dto: PersonV2DTO = await response.json();
    return this.toDomain(dto); // Adapta DTO a entidad de dominio
  }

  async update(personToUpdate: Person): Promise<Person | null> {
    const response = await fetch(`${this.apiUrl}/${personToUpdate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.fromDomain(personToUpdate)), // Adapta dominio a DTO
    });
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Fallo al actualizar persona en la API v2');
    }
    const dto: PersonV2DTO = await response.json();
    return this.toDomain(dto); // Adapta DTO a entidad de dominio
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
}
```

#### **`src/hexagon/infrastructure/mocks/*`**
Configuración de Mock Service Worker (MSW) para simular las APIs.

**`data/mock-data.ts`**
```ts
import type { Person } from '@/hexagon/domain/entities/person';

/**
 * @fileoverview Contiene los datos mock para simular los backends.
 * Estos datos son utilizados por los handlers de MSW.
 */

// Datos para el primer backend simulado (API v1)
export let mockPersonsApi1: Person[] = [
    { id: '1', firstName: 'Juan', lastName: 'Perez', age: 28 },
    { id: '2', firstName: 'Maria', lastName: 'Gomez', age: 34 },
    { id: '3', firstName: 'Carlos', lastName: 'Lopez', age: 45 },
];

// Datos para el segundo backend simulado (API v2)
// Nótese los nombres de propiedad diferentes (givenName, familyName)
export let mockPersonsApi2 = [
    { id: '101', givenName: 'Ana', familyName: 'Garcia', age: 22 },
    { id: '102', givenName: 'Luis', familyName: 'Rodriguez', age: 40 },
];
```

**`mocks/handlers.ts`**
```ts
import { http, HttpResponse } from 'msw';
import { mockPersonsApi1, mockPersonsApi2 } from '@/hexagon/infrastructure/data/mock-data';
import type { Person } from '@/hexagon/domain/entities/person';

/**
 * @fileoverview Define los "handlers" de MSW para simular las APIs.
 *
 * Un "handler" (manejador) define cómo MSW debe responder a una petición
 * para una ruta específica (ej. GET /api/persons).
 * Aquí simulamos dos versiones de la API.
 */

// Contadores para generar IDs únicos para cada API simulada.
let nextIdApi1 = mockPersonsApi1.length > 0 ? Math.max(...mockPersonsApi1.map(p => parseInt(p.id))) + 1 : 1;
let nextIdApi2 = mockPersonsApi2.length > 0 ? Math.max(...mockPersonsApi2.map(p => parseInt(p.id))) + 1 : 101;


// --- Handlers para API v1 (/api/persons) ---
const api1Handlers = [
  // GET /api/persons
  http.get('/api/persons', () => {
    console.log('[MSW] Interceptado: GET /api/persons');
    return HttpResponse.json(mockPersonsApi1);
  }),

  // POST /api/persons
  http.post('/api/persons', async ({ request }) => {
    const newPersonData = await request.json() as Omit<Person, 'id'>;
    const newPerson: Person = { id: (nextIdApi1++).toString(), ...newPersonData };
    mockPersonsApi1.push(newPerson);
    console.log('[MSW] Interceptado: POST /api/persons, nuevo dato:', newPerson);
    return HttpResponse.json(newPerson, { status: 201 });
  }),

  // PUT /api/persons/:id
  http.put<{ id: string }>('/api/persons/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json() as Person;
    const index = mockPersonsApi1.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPersonsApi1[index] = { ...mockPersonsApi1[index], ...updatedData };
      console.log('[MSW] Interceptado: PUT /api/persons/:id, dato actualizado:', mockPersonsApi1[index]);
      return HttpResponse.json(mockPersonsApi1[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // DELETE /api/persons/:id
  http.delete<{ id: string }>('/api/persons/:id', ({ params }) => {
    const { id } = params;
    const initialLength = mockPersonsApi1.length;
    mockPersonsApi1 = mockPersonsApi1.filter(p => p.id !== id);
    if (mockPersonsApi1.length < initialLength) {
      console.log('[MSW] Interceptado: DELETE /api/persons/:id, ID eliminado:', id);
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),
];


// --- Handlers para API v2 (/api/v2/people) ---
const api2Handlers = [
    // GET /api/v2/people
    http.get('/api/v2/people', () => {
        console.log('[MSW] Interceptado: GET /api/v2/people');
        return HttpResponse.json(mockPersonsApi2);
    }),
    
    // POST /api/v2/people
    http.post('/api/v2/people', async ({ request }) => {
        const newPersonData = await request.json() as any;
        const newPerson = { id: (nextIdApi2++).toString(), ...newPersonData };
        mockPersonsApi2.push(newPerson);
        console.log('[MSW] Interceptado: POST /api/v2/people, nuevo dato:', newPerson);
        return HttpResponse.json(newPerson, { status: 201 });
    }),

    // PUT /api/v2/people/:id
    http.put<{ id: string }>('/api/v2/people/:id', async ({ params, request }) => {
        const { id } = params;
        const updatedData = await request.json() as any;
        const index = mockPersonsApi2.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPersonsApi2[index] = { ...mockPersonsApi2[index], ...updatedData };
          console.log('[MSW] Interceptado: PUT /api/v2/people/:id, dato actualizado:', mockPersonsApi2[index]);
          return HttpResponse.json(mockPersonsApi2[index]);
        }
        return new HttpResponse(null, { status: 404 });
    }),

    // DELETE /api/v2/people/:id
    http.delete<{ id: string }>('/api/v2/people/:id', ({ params }) => {
        const { id } = params;
        const initialLength = mockPersonsApi2.length;
        mockPersonsApi2 = mockPersonsApi2.filter(p => p.id !== id);
        if (mockPersonsApi2.length < initialLength) {
          console.log('[MSW] Interceptado: DELETE /api/v2/people/:id, ID eliminado:', id);
          return new HttpResponse(null, { status: 204 });
        }
        return new HttpResponse(null, { status: 404 });
    }),
];

// Exporta todos los handlers combinados para ser usados por MSW.
export const handlers = [
  ...api1Handlers,
  ...api2Handlers,
];
```

**`mocks/browser.ts`**
```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * @fileoverview Configura e inicia el Service Worker de MSW para el navegador.
 *
 * MSW (Mock Service Worker) intercepta las peticiones de red a nivel de red,
 * lo que permite simular APIs de forma realista sin modificar el código de la aplicación.
 * Este archivo es específico para el entorno del navegador.
 */

// Se configura un Service Worker con los 'handlers' (manejadores de rutas) definidos.
export const worker = setupWorker(...handlers)

// Inicia el service worker en el navegador.
// onUnhandledRequest: 'bypass' significa que si una petición no tiene un handler definido,
// se dejará pasar y se ejecutará de forma normal.
worker.start({
  onUnhandledRequest: 'bypass',
});
```

### 3.4. Adaptador de UI (El "Consumidor")

#### **`src/app/page.tsx`**
El componente de React que actúa como el punto de entrada de la UI. Orquesta la inyección de dependencias y consume los casos de uso para mostrar los datos.

```tsx
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { PageHeader } from "@/components/page-header";
import { Icons } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { Person } from "@/hexagon/domain/entities/person";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Casos de Uso (Application Layer)
// Estos casos de uso orquestan la lógica de negocio. No saben nada sobre la UI o la base de datos.
import { CreatePerson } from "@/hexagon/application/use-cases/create-person";
import { GetPersons } from "@/hexagon/application/use-cases/get-persons";
import { UpdatePerson } from "@/hexagon/application/use-cases/update-person";
import { DeletePerson } from "@/hexagon/application/use-cases/delete-person";

// Repositorios (Infrastructure Layer)
// Estas son implementaciones concretas del puerto del repositorio.
// Cada clase sabe cómo comunicarse con un backend específico.
import { FetchPersonRepository } from "@/hexagon/infrastructure/repositories/fetch-person-repository";
import { ApiV2PersonRepository } from "@/hexagon/infrastructure/repositories/api-v2-person-repository";
import type { PersonRepository } from "@/hexagon/domain/ports/person-repository";

/**
 * Componente principal de la página.
 * Actúa como el "inyector" de dependencias y el orquestador de la UI.
 * 
 * 1. Inicializa los repositorios (infraestructura).
 * 2. Selecciona el repositorio a usar basado en el estado de la UI (el switch).
 * 3. Inyecta el repositorio seleccionado en los casos de uso (aplicación).
 * 4. Llama a los casos de uso para interactuar con la lógica de negocio.
 * 5. Gestiona el estado de la UI (modales, datos de la tabla, etc.).
 */
export default function Home() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [newPerson, setNewPerson] = useState({ firstName: '', lastName: '', age: 0 });
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Este estado determina qué implementación de repositorio se usará.
  const [useApiV2, setUseApiV2] = useState(false);

  // Inicializa MSW solo en el lado del cliente.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('@/hexagon/infrastructure/mocks/browser');
    }
  }, []);

  // ¡La magia de la arquitectura hexagonal!
  // Usamos useMemo para cambiar dinámicamente la implementación del repositorio
  // que se inyectará en los casos de uso, basándonos en el switch de la UI.
  // La UI y los casos de uso no necesitan saber qué backend se está utilizando.
  const personRepository: PersonRepository = useMemo(() => {
    console.log(useApiV2 ? "Cambiando a API V2" : "Cambiando a API V1");
    return useApiV2 ? new ApiV2PersonRepository() : new FetchPersonRepository();
  }, [useApiV2]);

  // Se instancian los casos de uso con la implementación del repositorio seleccionada.
  const createPersonUseCase = new CreatePerson(personRepository);
  const getPersonsUseCase = new GetPersons(personRepository);
  const updatePersonUseCase = new UpdatePerson(personRepository);
  const deletePersonUseCase = new DeletePerson(personRepository);
  
  // Carga las personas cuando el componente se monta o cuando el repositorio cambia.
  useEffect(() => {
    loadPersons();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personRepository]);
  
  const loadPersons = async () => {
    try {
        const allPersons = await getPersonsUseCase.execute();
        console.log("Personas cargadas:", allPersons);
        setPersons(allPersons);
    } catch (error) {
        console.error("Fallo al cargar personas:", error);
        setPersons([]); // Limpia los datos en caso de error
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPerson(prev => ({...prev, [name]: name === 'age' ? parseInt(value) || 0 : value}));
  }
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingPerson) return;
    const { name, value } = e.target;
    setEditingPerson(prev => prev ? ({...prev, [name]: name === 'age' ? parseInt(value) || 0 : value}) : null);
  }

  const handleAddPerson = async () => {
    console.log("Enviando para crear:", newPerson);
    await createPersonUseCase.execute(newPerson);
    await loadPersons();
    setIsCreateModalOpen(false);
    setNewPerson({ firstName: '', lastName: '', age: 0 });
  }
  
  const handleUpdatePerson = async () => {
    if (!editingPerson) return;
    console.log("Enviando para actualizar:", editingPerson);
    await updatePersonUseCase.execute(editingPerson);
    await loadPersons();
    setIsEditModalOpen(false);
    setEditingPerson(null);
  }
  
  const handleDeletePerson = async (id: string) => {
    console.log("Enviando para eliminar:", id);
    await deletePersonUseCase.execute(id);
    await loadPersons();
  }
  
  const openEditModal = (person: Person) => {
    setEditingPerson({...person});
    setIsEditModalOpen(true);
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Icons.Logo className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold font-headline">HexaView</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <PageHeader title="Dashboard" />
        <main className="p-4 lg:p-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="font-headline">Personas</CardTitle>
                    <CardDescription>
                      Una lista de personas registradas.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="api-switch">Usar Backend V2</Label>
                    <Switch id="api-switch" checked={useApiV2} onCheckedChange={setUseApiV2} />
                  </div>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                      <PlusCircle className="mr-2" />
                      Registrar Persona
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {persons.length > 0 ? persons.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.firstName}</TableCell>
                      <TableCell>{person.lastName}</TableCell>
                      <TableCell>{person.age}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(person)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePerson(person.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            No hay datos disponibles para la API seleccionada.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
      
       {/* Create Modal */}
       <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Persona</DialogTitle>
            <DialogDescription>
              Completa los detalles a continuación para agregar una nueva persona.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Nombre
              </Label>
              <Input id="firstName" name="firstName" value={newPerson.firstName} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Apellido
              </Label>
              <Input id="lastName" name="lastName" value={newPerson.lastName} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Edad
              </Label>
              <Input id="age" name="age" type="number" value={newPerson.age === 0 ? '' : newPerson.age} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAddPerson}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Persona</DialogTitle>
            <DialogDescription>
              Actualiza los detalles de la persona.
            </DialogDescription>
          </DialogHeader>
          {editingPerson && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editFirstName" className="text-right">
                  Nombre
                </Label>
                <Input id="editFirstName" name="firstName" value={editingPerson.firstName} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editLastName" className="text-right">
                  Apellido
                </Label>
                <Input id="editLastName" name="lastName" value={editingPerson.lastName} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editAge" className="text-right">
                  Edad
                </Label>
                <Input id="editAge" name="age" type="number" value={editingPerson.age} onChange={handleEditInputChange} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleUpdatePerson}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
```