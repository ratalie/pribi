import { nanoid } from 'nanoid';
import type { CarpetaPersonalizada } from '../../../domain/entities/carpeta-personalizada.entity';
import type { EnlaceDocumento } from '../../../domain/entities/enlace-documento.entity';

const now = () => new Date();

function ensureId(value?: string): string {
  if (value && value.length > 0) return value;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return nanoid();
}

// Mock data en memoria
const carpetasMock: Map<string, CarpetaPersonalizada> = new Map();
const enlacesMock: Map<string, EnlaceDocumento[]> = new Map();

// Inicializar con datos de ejemplo
const initMockData = () => {
  const carpeta1: CarpetaPersonalizada = {
    id: 'personal-1',
    nombre: 'Due Diligence Cliente ABC',
    descripcion: 'Documentos relacionados con due diligence del cliente ABC',
    fechaCreacion: new Date('2024-11-20'),
    fechaModificacion: new Date('2024-11-29'),
    creadorId: 'user-1',
    creadorNombre: 'Thomas Anree',
    totalEnlaces: 2,
  };

  const carpeta2: CarpetaPersonalizada = {
    id: 'personal-2',
    nombre: 'Proyecto Expansión Regional',
    descripcion: 'Documentos del proyecto de expansión regional',
    fechaCreacion: new Date('2024-11-15'),
    fechaModificacion: new Date('2024-11-25'),
    creadorId: 'user-1',
    creadorNombre: 'Thomas Anree',
    totalEnlaces: 2,
  };

  const carpeta3: CarpetaPersonalizada = {
    id: 'personal-3',
    nombre: 'Auditoría 2024',
    descripcion: 'Documentos de auditoría anual 2024',
    fechaCreacion: new Date('2024-11-10'),
    fechaModificacion: new Date('2024-11-20'),
    creadorId: 'user-2',
    creadorNombre: 'María García',
    totalEnlaces: 1,
  };

  carpetasMock.set('personal-1', carpeta1);
  carpetasMock.set('personal-2', carpeta2);
  carpetasMock.set('personal-3', carpeta3);

  enlacesMock.set('personal-1', [
    {
      id: 'enlace-1',
      nombre: 'Sociedad Tech SpA.pdf',
      tipo: 'societario',
      origen: 'Estatutos/Sociedad Tech SpA.pdf',
      fechaEnlace: new Date('2024-11-29'),
      documentoId: 'doc-1',
      carpetaId: 'personal-1',
    },
    {
      id: 'enlace-2',
      nombre: 'Acta Junta Ordinaria 2024.pdf',
      tipo: 'generado',
      origen: 'Operaciones/Junta de Accionistas/Junta Ordinaria - 29 Nov 2024',
      fechaEnlace: new Date('2024-11-29'),
      documentoId: 'gen-junta-1',
      carpetaId: 'personal-1',
    },
  ]);

  enlacesMock.set('personal-2', [
    {
      id: 'enlace-3',
      nombre: 'Sucursal Concepción - Inscripción.pdf',
      tipo: 'generado',
      origen: 'Registros/Sucursales/Sucursal Concepción',
      fechaEnlace: new Date('2024-11-25'),
      documentoId: 'gen-suc-1',
      carpetaId: 'personal-2',
    },
    {
      id: 'enlace-4',
      nombre: 'Contrato Arriendo Oficina Central.pdf',
      tipo: 'societario',
      origen: 'Contratos/Contrato Arriendo Oficina Central.pdf',
      fechaEnlace: new Date('2024-11-25'),
      documentoId: 'doc-7',
      carpetaId: 'personal-2',
    },
  ]);

  enlacesMock.set('personal-3', [
    {
      id: 'enlace-5',
      nombre: 'Acta Sesión Directorio.pdf',
      tipo: 'societario',
      origen: 'Actas/Acta Sesión Directorio.pdf',
      fechaEnlace: new Date('2024-11-20'),
      documentoId: 'doc-6',
      carpetaId: 'personal-3',
    },
  ]);
};

// Inicializar al cargar el módulo
initMockData();

/**
 * Lista todas las carpetas personalizadas de una sociedad
 */
export async function listCarpetasMock(sociedadId: string): Promise<CarpetaPersonalizada[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Array.from(carpetasMock.values());
}

/**
 * Obtiene una carpeta por ID
 */
export async function getCarpetaMock(
  sociedadId: string,
  carpetaId: string
): Promise<CarpetaPersonalizada | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return carpetasMock.get(carpetaId) || null;
}

/**
 * Crea una nueva carpeta personalizada
 */
export async function createCarpetaMock(
  sociedadId: string,
  nombre: string,
  descripcion?: string
): Promise<CarpetaPersonalizada> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const id = ensureId();
  const carpeta: CarpetaPersonalizada = {
    id,
    nombre,
    descripcion,
    fechaCreacion: now(),
    fechaModificacion: now(),
    creadorId: 'user-1', // Mock user
    creadorNombre: 'Thomas Anree',
    totalEnlaces: 0,
  };

  carpetasMock.set(id, carpeta);
  enlacesMock.set(id, []);

  return carpeta;
}

/**
 * Actualiza una carpeta personalizada
 */
export async function updateCarpetaMock(
  sociedadId: string,
  carpetaId: string,
  nombre: string,
  descripcion?: string
): Promise<CarpetaPersonalizada> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const carpeta = carpetasMock.get(carpetaId);
  if (!carpeta) {
    throw new Error(`Carpeta con id ${carpetaId} no encontrada`);
  }

  const updated: CarpetaPersonalizada = {
    ...carpeta,
    nombre,
    descripcion,
    fechaModificacion: now(),
  };

  carpetasMock.set(carpetaId, updated);
  return updated;
}

/**
 * Elimina una carpeta personalizada
 */
export async function deleteCarpetaMock(sociedadId: string, carpetaId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (!carpetasMock.has(carpetaId)) {
    throw new Error(`Carpeta con id ${carpetaId} no encontrada`);
  }

  carpetasMock.delete(carpetaId);
  enlacesMock.delete(carpetaId);
}

/**
 * Lista los enlaces de una carpeta
 */
export async function listEnlacesMock(
  sociedadId: string,
  carpetaId: string
): Promise<EnlaceDocumento[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return enlacesMock.get(carpetaId) || [];
}

/**
 * Agrega un enlace a una carpeta
 */
export async function addEnlaceMock(
  sociedadId: string,
  carpetaId: string,
  documentoId: string,
  tipo: 'societario' | 'generado',
  origen: string
): Promise<EnlaceDocumento> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const carpeta = carpetasMock.get(carpetaId);
  if (!carpeta) {
    throw new Error(`Carpeta con id ${carpetaId} no encontrada`);
  }

  const enlaces = enlacesMock.get(carpetaId) || [];
  const nombre = origen.split('/').pop() || 'Documento';

  const enlace: EnlaceDocumento = {
    id: ensureId(),
    nombre,
    tipo,
    origen,
    fechaEnlace: now(),
    documentoId,
    carpetaId,
  };

  enlaces.push(enlace);
  enlacesMock.set(carpetaId, enlaces);

  // Actualizar total de enlaces en la carpeta
  const updated: CarpetaPersonalizada = {
    ...carpeta,
    totalEnlaces: enlaces.length,
    fechaModificacion: now(),
  };
  carpetasMock.set(carpetaId, updated);

  return enlace;
}

/**
 * Elimina un enlace de una carpeta
 */
export async function removeEnlaceMock(
  sociedadId: string,
  carpetaId: string,
  enlaceId: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const enlaces = enlacesMock.get(carpetaId) || [];
  const index = enlaces.findIndex((e) => e.id === enlaceId);

  if (index === -1) {
    throw new Error(`Enlace con id ${enlaceId} no encontrado`);
  }

  enlaces.splice(index, 1);
  enlacesMock.set(carpetaId, enlaces);

  // Actualizar total de enlaces en la carpeta
  const carpeta = carpetasMock.get(carpetaId);
  if (carpeta) {
    const updated: CarpetaPersonalizada = {
      ...carpeta,
      totalEnlaces: enlaces.length,
      fechaModificacion: now(),
    };
    carpetasMock.set(carpetaId, updated);
  }
}

