# 💾 DOCUMENTACIÓN DATA - REPOSITORIO PROBO
## Guía Completa de Estructuras de Datos y Mock Data

---

## 📋 ARCHIVO DE DATOS

**Archivo React:** `/data/mockDataRepository.ts`
**Archivo Nuxt:** `/data/mockDataRepository.ts` (o `.js` si prefieres)

---

## 🏗️ INTERFACES Y TIPOS

### Sociedad
```typescript
export interface Sociedad {
  id: string;
  nombre: string;
  tipo: 'SpA' | 'Ltda' | 'SA' | 'SRL';
  rut: string;
  activa: boolean;
}
```

**Ejemplo:**
```typescript
{
  id: 'soc-1',
  nombre: 'Tech Innovations SpA',
  tipo: 'SpA',
  rut: '76.123.456-7',
  activa: true
}
```

### Document (Documentos Societarios)
```typescript
export interface Document {
  id: string;
  name: string;
  type: 'folder' | 'file';
  mimeType?: string;
  owner: string;
  dateModified: Date;
  size?: number;
  parentId?: string | null;
}
```

**Ejemplo Carpeta:**
```typescript
{
  id: 'folder-1',
  name: 'Estatutos',
  type: 'folder',
  owner: 'Thomas Anree',
  dateModified: new Date('2024-11-20'),
  parentId: null
}
```

**Ejemplo Archivo:**
```typescript
{
  id: 'doc-1',
  name: 'Sociedad Tech SpA.pdf',
  type: 'file',
  mimeType: 'application/pdf',
  owner: 'Thomas Anree',
  dateModified: new Date('2024-11-20'),
  size: 245000,
  parentId: 'folder-1'
}
```

### EnlaceDocumento (Enlaces en Carpetas Personalizadas)
```typescript
export interface EnlaceDocumento {
  id: string;
  nombre: string;
  tipo: 'societario' | 'generado';
  origen: string; // Ruta del origen (ej: "Estatutos/Sociedad Tech SpA.pdf")
  fechaEnlace: Date;
  documentoId: string; // ID del documento original
}
```

**Ejemplo:**
```typescript
{
  id: 'enlace-1',
  nombre: 'Sociedad Tech SpA.pdf',
  tipo: 'societario',
  origen: 'Estatutos/Sociedad Tech SpA.pdf',
  fechaEnlace: new Date('2024-11-29'),
  documentoId: 'doc-1'
}
```

### PersonalFolder (Carpeta Personalizada)
```typescript
export interface PersonalFolder {
  id: string;
  name: string;
  documentCount: number;
  lastModified: Date;
  enlaces: EnlaceDocumento[];
}
```

**Ejemplo:**
```typescript
{
  id: 'personal-1',
  name: 'Due Diligence Cliente ABC',
  documentCount: 2,
  lastModified: new Date('2024-11-29'),
  enlaces: [
    // array de EnlaceDocumento
  ]
}
```

### DocumentoGeneradoItem
```typescript
export interface DocumentoGeneradoItem {
  id: string;
  nombre: string;
  fecha: Date;
  tipo: string;
  tamaño: number;
}
```

**Ejemplo:**
```typescript
{
  id: 'gen-junta-1',
  nombre: 'Acta Junta Ordinaria 2024.pdf',
  fecha: new Date('2024-11-29'),
  tipo: 'PDF',
  tamaño: 298000
}
```

### Subcarpeta (en Documentos Generados)
```typescript
export interface Subcarpeta {
  id: string;
  nombre: string;
  documentos: DocumentoGeneradoItem[];
}
```

**Ejemplo:**
```typescript
{
  id: 'sub-sociedades-spa',
  nombre: 'SpA',
  documentos: [
    // array de DocumentoGeneradoItem
  ]
}
```

### CarpetaPrincipal (nivel 2 en Documentos Generados)
```typescript
export interface CarpetaPrincipal {
  id: string;
  nombre: string;
  subcarpetas: Subcarpeta[];
  documentos?: DocumentoGeneradoItem[];
}
```

**Ejemplo - Con subcarpetas:**
```typescript
{
  id: 'gen-sociedades',
  nombre: 'Sociedades',
  subcarpetas: [
    { id: 'sub-spa', nombre: 'SpA', documentos: [...] },
    { id: 'sub-ltda', nombre: 'Ltda', documentos: [...] }
  ]
}
```

**Ejemplo - Sin subcarpetas:**
```typescript
{
  id: 'gen-juntas',
  nombre: 'Junta de Accionistas',
  subcarpetas: [],
  documentos: [
    // array de DocumentoGeneradoItem directamente
  ]
}
```

### CategoriaGenerados (nivel 1 en Documentos Generados)
```typescript
export interface CategoriaGenerados {
  id: string;
  nombre: string;
  carpetas: Record<string, CarpetaPrincipal>;
}
```

**Ejemplo:**
```typescript
{
  id: 'cat-registros',
  nombre: 'Registros',
  carpetas: {
    sociedades: {
      id: 'gen-sociedades',
      nombre: 'Sociedades',
      subcarpetas: [...]
    },
    sucursales: {
      id: 'gen-sucursales',
      nombre: 'Sucursales',
      subcarpetas: [...]
    }
  }
}
```

### DocumentosGenerados (estructura completa)
```typescript
export interface DocumentosGenerados {
  registros: CategoriaGenerados;
  operaciones: CategoriaGenerados;
}
```

---

## 📊 MOCK DATA COMPLETO

### Sociedades
```typescript
export const sociedades: Sociedad[] = [
  {
    id: 'soc-1',
    nombre: 'Tech Innovations SpA',
    tipo: 'SpA',
    rut: '76.123.456-7',
    activa: true
  },
  {
    id: 'soc-2',
    nombre: 'Holding ABC SpA',
    tipo: 'SpA',
    rut: '76.987.654-3',
    activa: true
  },
  {
    id: 'soc-3',
    nombre: 'Servicios XYZ Ltda',
    tipo: 'Ltda',
    rut: '77.456.789-0',
    activa: true
  },
  {
    id: 'soc-4',
    nombre: 'Inversiones DEF SA',
    tipo: 'SA',
    rut: '96.321.654-8',
    activa: true
  },
  {
    id: 'soc-5',
    nombre: 'Consultora GHI Ltda',
    tipo: 'Ltda',
    rut: '77.852.963-5',
    activa: false
  }
];
```

### Documentos Societarios
```typescript
export const documentosSocietarios: Document[] = [
  // ========== CARPETAS (type: 'folder') ==========
  {
    id: 'folder-1',
    name: 'Estatutos',
    type: 'folder',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-11-20'),
    parentId: null
  },
  {
    id: 'folder-2',
    name: 'Actas',
    type: 'folder',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-10-21'),
    parentId: null
  },
  {
    id: 'folder-3',
    name: 'Contratos',
    type: 'folder',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-09-15'),
    parentId: null
  },

  // ========== ARCHIVOS EN ESTATUTOS ==========
  {
    id: 'doc-1',
    name: 'Sociedad Tech SpA.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-11-20'),
    size: 245000,
    parentId: 'folder-1'
  },
  {
    id: 'doc-2',
    name: 'Holding ABC SpA.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'María García',
    dateModified: new Date('2024-09-28'),
    size: 201000,
    parentId: 'folder-1'
  },
  {
    id: 'doc-3',
    name: 'Servicios XYZ Ltda.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-09-30'),
    size: 223000,
    parentId: 'folder-1'
  },

  // ========== ARCHIVOS EN ACTAS ==========
  {
    id: 'doc-4',
    name: 'Acta Junta Ordinaria 2024.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-10-21'),
    size: 298000,
    parentId: 'folder-2'
  },
  {
    id: 'doc-5',
    name: 'Acta Junta Extraordinaria Oct 2024.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Carlos López',
    dateModified: new Date('2024-10-15'),
    size: 312000,
    parentId: 'folder-2'
  },
  {
    id: 'doc-6',
    name: 'Acta Sesión Directorio.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-11-22'),
    size: 187000,
    parentId: 'folder-2'
  },

  // ========== ARCHIVOS EN CONTRATOS ==========
  {
    id: 'doc-7',
    name: 'Contrato Arriendo Oficina Central.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'María García',
    dateModified: new Date('2024-09-15'),
    size: 421000,
    parentId: 'folder-3'
  },
  {
    id: 'doc-8',
    name: 'Contrato Prestación Servicios TI.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Carlos López',
    dateModified: new Date('2024-09-10'),
    size: 356000,
    parentId: 'folder-3'
  },
  {
    id: 'doc-9',
    name: 'Contrato Marco Proveedores.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-09-05'),
    size: 389000,
    parentId: 'folder-3'
  },

  // ========== ARCHIVOS EN RAÍZ (sin carpeta) ==========
  {
    id: 'doc-10',
    name: 'Certificado Vigencia.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Thomas Anree',
    dateModified: new Date('2024-11-01'),
    size: 156000,
    parentId: null
  },
  {
    id: 'doc-11',
    name: 'Registro Comercio.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'María García',
    dateModified: new Date('2024-10-28'),
    size: 278000,
    parentId: null
  },
  {
    id: 'doc-12',
    name: 'Poderes Representación.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    owner: 'Carlos López',
    dateModified: new Date('2024-10-15'),
    size: 189000,
    parentId: null
  }
];
```

### Documentos Generados (Estructura Completa)
```typescript
export const documentosGenerados: DocumentosGenerados = {
  // ========== CATEGORÍA 1: REGISTROS ==========
  registros: {
    id: 'cat-registros',
    nombre: 'Registros',
    carpetas: {
      // CARPETA: Sociedades (con subcarpetas)
      sociedades: {
        id: 'gen-sociedades',
        nombre: 'Sociedades',
        subcarpetas: [
          {
            id: 'sub-sociedades-spa',
            nombre: 'SpA',
            documentos: [
              {
                id: 'gen-soc-1',
                nombre: 'Tech Innovations SpA - Escritura.pdf',
                fecha: new Date('2024-11-20'),
                tipo: 'PDF',
                tamaño: 245000
              },
              {
                id: 'gen-soc-2',
                nombre: 'Holding ABC SpA - Escritura.pdf',
                fecha: new Date('2024-09-28'),
                tipo: 'PDF',
                tamaño: 201000
              }
            ]
          },
          {
            id: 'sub-sociedades-ltda',
            nombre: 'Ltda',
            documentos: [
              {
                id: 'gen-soc-3',
                nombre: 'Servicios XYZ Ltda - Escritura.pdf',
                fecha: new Date('2024-09-30'),
                tipo: 'PDF',
                tamaño: 223000
              }
            ]
          }
        ]
      },

      // CARPETA: Sucursales (con subcarpetas)
      sucursales: {
        id: 'gen-sucursales',
        nombre: 'Sucursales',
        subcarpetas: [
          {
            id: 'sub-sucursal-concepcion',
            nombre: 'Sucursal Concepción',
            documentos: [
              {
                id: 'gen-suc-1',
                nombre: 'Sucursal Concepción - Inscripción.pdf',
                fecha: new Date('2024-10-15'),
                tipo: 'PDF',
                tamaño: 178000
              }
            ]
          },
          {
            id: 'sub-sucursal-valpo',
            nombre: 'Sucursal Valparaíso',
            documentos: [
              {
                id: 'gen-suc-2',
                nombre: 'Sucursal Valparaíso - Inscripción.pdf',
                fecha: new Date('2024-09-20'),
                tipo: 'PDF',
                tamaño: 165000
              }
            ]
          }
        ]
      },

      // CARPETA: Directorio (SIN subcarpetas - documentos directos)
      directorio: {
        id: 'gen-directorio',
        nombre: 'Directorio',
        subcarpetas: [],
        documentos: [
          {
            id: 'gen-dir-1',
            nombre: 'Nombramiento Directores 2024.pdf',
            fecha: new Date('2024-11-10'),
            tipo: 'PDF',
            tamaño: 189000
          },
          {
            id: 'gen-dir-2',
            nombre: 'Acta Constitución Directorio.pdf',
            fecha: new Date('2024-08-22'),
            tipo: 'PDF',
            tamaño: 203000
          },
          {
            id: 'gen-dir-3',
            nombre: 'Renuncia Director Juan Pérez.pdf',
            fecha: new Date('2024-07-15'),
            tipo: 'PDF',
            tamaño: 145000
          }
        ]
      }
    }
  },

  // ========== CATEGORÍA 2: OPERACIONES ==========
  operaciones: {
    id: 'cat-operaciones',
    nombre: 'Operaciones',
    carpetas: {
      // CARPETA: Junta de Accionistas (estructura especial con juntas)
      juntaAccionistas: {
        id: 'gen-juntas',
        nombre: 'Junta de Accionistas',
        juntas: [
          {
            id: 'junta-1',
            nombre: 'Junta Ordinaria - 29 Nov 2024',
            fecha: new Date('2024-11-29'),
            documentos: [
              {
                id: 'gen-junta-1',
                nombre: 'Acta Junta Ordinaria 2024.pdf',
                fecha: new Date('2024-11-29'),
                tipo: 'PDF',
                tamaño: 298000
              },
              {
                id: 'gen-junta-2',
                nombre: 'Citación Junta Ordinaria.pdf',
                fecha: new Date('2024-11-15'),
                tipo: 'PDF',
                tamaño: 156000
              }
            ]
          },
          {
            id: 'junta-2',
            nombre: 'Junta Extraordinaria - 15 Oct 2024',
            fecha: new Date('2024-10-15'),
            documentos: [
              {
                id: 'gen-junta-3',
                nombre: 'Acta Junta Extraordinaria Oct 2024.pdf',
                fecha: new Date('2024-10-15'),
                tipo: 'PDF',
                tamaño: 312000
              }
            ]
          },
          {
            id: 'junta-3',
            nombre: 'Junta Extraordinaria - 22 Ago 2024',
            fecha: new Date('2024-08-22'),
            documentos: [
              {
                id: 'gen-junta-4',
                nombre: 'Acta Junta Extraordinaria Ago 2024.pdf',
                fecha: new Date('2024-08-22'),
                tipo: 'PDF',
                tamaño: 287000
              },
              {
                id: 'gen-junta-5',
                nombre: 'Modificación Estatutos.pdf',
                fecha: new Date('2024-08-22'),
                tipo: 'PDF',
                tamaño: 234000
              }
            ]
          }
        ]
      }
    }
  }
};
```

**⚠️ NOTA IMPORTANTE sobre Junta de Accionistas:**
Esta carpeta tiene una estructura especial con el campo `juntas` en vez de `subcarpetas`. Cada junta contiene sus propios documentos.

### Carpetas Personalizadas
```typescript
export const carpetasPersonalizadas: PersonalFolder[] = [
  {
    id: 'personal-1',
    name: 'Due Diligence Cliente ABC',
    documentCount: 2,
    lastModified: new Date('2024-11-29'),
    enlaces: [
      {
        id: 'enlace-1',
        nombre: 'Sociedad Tech SpA.pdf',
        tipo: 'societario',
        origen: 'Estatutos/Sociedad Tech SpA.pdf',
        fechaEnlace: new Date('2024-11-29'),
        documentoId: 'doc-1'
      },
      {
        id: 'enlace-2',
        nombre: 'Acta Junta Ordinaria 2024.pdf',
        tipo: 'generado',
        origen: 'Operaciones/Junta de Accionistas/Junta Ordinaria - 29 Nov 2024',
        fechaEnlace: new Date('2024-11-29'),
        documentoId: 'gen-junta-1'
      }
    ]
  },
  {
    id: 'personal-2',
    name: 'Proyecto Expansión Regional',
    documentCount: 2,
    lastModified: new Date('2024-11-25'),
    enlaces: [
      {
        id: 'enlace-3',
        nombre: 'Sucursal Concepción - Inscripción.pdf',
        tipo: 'generado',
        origen: 'Registros/Sucursales/Sucursal Concepción',
        fechaEnlace: new Date('2024-11-25'),
        documentoId: 'gen-suc-1'
      },
      {
        id: 'enlace-4',
        nombre: 'Contrato Arriendo Oficina Central.pdf',
        tipo: 'societario',
        origen: 'Contratos/Contrato Arriendo Oficina Central.pdf',
        fechaEnlace: new Date('2024-11-25'),
        documentoId: 'doc-7'
      }
    ]
  },
  {
    id: 'personal-3',
    name: 'Auditoría 2024',
    documentCount: 1,
    lastModified: new Date('2024-11-20'),
    enlaces: [
      {
        id: 'enlace-5',
        nombre: 'Certificado Vigencia.pdf',
        tipo: 'societario',
        origen: 'Raíz/Certificado Vigencia.pdf',
        fechaEnlace: new Date('2024-11-20'),
        documentoId: 'doc-10'
      }
    ]
  }
];
```

---

## 📈 ESTADÍSTICAS (Calculadas)

### Repository Stats
```typescript
export const repositoryStats = {
  documentosSocietarios: {
    totalDocuments: 12,
    totalFolders: 3,
    totalSize: 3244000 // bytes
  },
  documentosGenerados: {
    totalDocuments: 125, // calculado sumando todos
    totalJuntas: 3,
    totalSociedades: 3,
    totalSucursales: 2,
    totalDirectorio: 3
  },
  carpetasPersonalizadas: {
    totalFolders: 3,
    totalEnlaces: 5
  }
};
```

**Cómo calcular:**
```typescript
// Total de documentos societarios
const totalSocietarios = documentosSocietarios.filter(d => d.type === 'file').length;

// Total de documentos generados
let totalGenerados = 0;
// Suma documentos de Registros
Object.values(documentosGenerados.registros.carpetas).forEach(carpeta => {
  if (carpeta.subcarpetas && carpeta.subcarpetas.length > 0) {
    carpeta.subcarpetas.forEach(sub => {
      totalGenerados += sub.documentos.length;
    });
  } else if (carpeta.documentos) {
    totalGenerados += carpeta.documentos.length;
  }
});
// Suma documentos de Operaciones (juntas)
documentosGenerados.operaciones.carpetas.juntaAccionistas.juntas.forEach(junta => {
  totalGenerados += junta.documentos.length;
});
```

---

## 🔍 FUNCIONES ÚTILES

### Buscar Documento Societario
```typescript
export function findDocumentoSocietario(documentId: string): Document | null {
  return documentosSocietarios.find(d => d.id === documentId) || null;
}
```

### Obtener Documentos de una Carpeta
```typescript
export function getDocumentosPorCarpeta(carpetaId: string | null): Document[] {
  return documentosSocietarios.filter(d => d.parentId === carpetaId && d.type === 'file');
}
```

### Obtener Carpetas (solo carpetas, no archivos)
```typescript
export function getCarpetasSocietarios(): Document[] {
  return documentosSocietarios.filter(d => d.type === 'folder');
}
```

### Buscar Documento Generado (por ID)
```typescript
export function findDocumentoGenerado(documentId: string): DocumentoGeneradoItem | null {
  // Buscar en Registros
  for (const carpeta of Object.values(documentosGenerados.registros.carpetas)) {
    if (carpeta.subcarpetas && carpeta.subcarpetas.length > 0) {
      for (const sub of carpeta.subcarpetas) {
        const found = sub.documentos.find(d => d.id === documentId);
        if (found) return found;
      }
    } else if (carpeta.documentos) {
      const found = carpeta.documentos.find(d => d.id === documentId);
      if (found) return found;
    }
  }
  
  // Buscar en Operaciones (juntas)
  for (const junta of documentosGenerados.operaciones.carpetas.juntaAccionistas.juntas) {
    const found = junta.documentos.find(d => d.id === documentId);
    if (found) return found;
  }
  
  return null;
}
```

### Obtener Carpeta Personalizada por ID
```typescript
export function getCarpetaPersonalizada(carpetaId: string): PersonalFolder | null {
  return carpetasPersonalizadas.find(c => c.id === carpetaId) || null;
}
```

---

## 💡 NOTAS PARA NUXT

### Estado Reactivo
En Nuxt con Composition API:

```typescript
// composables/useRepositoryData.ts
import { ref, computed } from 'vue';
import { 
  sociedades, 
  documentosSocietarios, 
  documentosGenerados,
  carpetasPersonalizadas
} from '~/data/mockDataRepository';

export function useRepositoryData() {
  const selectedSociedad = ref(sociedades[0]);
  const searchQuery = ref('');
  
  const filteredDocs = computed(() => {
    if (!searchQuery.value) return documentosSocietarios;
    return documentosSocietarios.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  return {
    sociedades,
    selectedSociedad,
    searchQuery,
    filteredDocs,
    documentosGenerados,
    carpetasPersonalizadas
  };
}
```

### Formato de Fechas
```typescript
// utils/formatDate.ts
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('es-ES', options);
}

// Uso:
formatDate(new Date('2024-11-29')) // "29 nov 2024"
```

### Formato de Tamaño
```typescript
// utils/formatSize.ts
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Uso:
formatSize(245000) // "239.26 KB"
```

---

## ✅ CHECKLIST DE DATOS

Al implementar en Nuxt, verificar:

- [ ] Todas las interfaces están definidas
- [ ] Mock data de sociedades (5 items)
- [ ] Mock data de documentos societarios (12 items)
- [ ] Mock data de documentos generados (estructura completa)
- [ ] Mock data de carpetas personalizadas (3 items)
- [ ] Funciones de búsqueda implementadas
- [ ] Formato de fechas funciona
- [ ] Formato de tamaños funciona
- [ ] Enlaces entre documentos funcionan
- [ ] Estructura de Junta de Accionistas implementada correctamente

---

**Continúa en:** `DOCS_NUXT_INTERACTIONS.md` para interacciones y funcionalidades

