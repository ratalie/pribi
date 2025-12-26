import { nanoid } from 'nanoid';
import type { DocumentoSocietario } from '../../../domain/entities/documento-societario.entity';
import type { CarpetaSistema } from '../../../domain/entities/carpeta-sistema.entity';

const now = () => new Date();

function ensureId(value?: string): string {
  if (value && value.length > 0) return value;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return nanoid();
}

// Mock data en memoria - basado en la documentación
const documentosMock: Map<string, DocumentoSocietario> = new Map();

// Inicializar con datos de ejemplo
const initMockData = () => {
  // Carpetas
  const folder1: DocumentoSocietario = {
    id: 'folder-1',
    nombre: 'Estatutos',
    tipo: 'folder',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-11-20'),
    parentId: null,
  };

  const folder2: DocumentoSocietario = {
    id: 'folder-2',
    nombre: 'Actas',
    tipo: 'folder',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-10-21'),
    parentId: null,
  };

  const folder3: DocumentoSocietario = {
    id: 'folder-3',
    nombre: 'Contratos',
    tipo: 'folder',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-09-15'),
    parentId: null,
  };

  // Archivos en Estatutos
  const doc1: DocumentoSocietario = {
    id: 'doc-1',
    nombre: 'Sociedad Tech SpA.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-11-20'),
    tamaño: 245000,
    parentId: 'folder-1',
  };

  const doc2: DocumentoSocietario = {
    id: 'doc-2',
    nombre: 'Holding ABC SpA.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'María García',
    fechaModificacion: new Date('2024-09-28'),
    tamaño: 201000,
    parentId: 'folder-1',
  };

  const doc3: DocumentoSocietario = {
    id: 'doc-3',
    nombre: 'Servicios XYZ Ltda.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-09-30'),
    tamaño: 223000,
    parentId: 'folder-1',
  };

  // Archivos en Actas
  const doc4: DocumentoSocietario = {
    id: 'doc-4',
    nombre: 'Acta Junta Ordinaria 2024.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-10-21'),
    tamaño: 298000,
    parentId: 'folder-2',
  };

  const doc5: DocumentoSocietario = {
    id: 'doc-5',
    nombre: 'Acta Junta Extraordinaria Oct 2024.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Carlos López',
    fechaModificacion: new Date('2024-10-15'),
    tamaño: 312000,
    parentId: 'folder-2',
  };

  const doc6: DocumentoSocietario = {
    id: 'doc-6',
    nombre: 'Acta Sesión Directorio.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-11-22'),
    tamaño: 187000,
    parentId: 'folder-2',
  };

  // Archivos en Contratos
  const doc7: DocumentoSocietario = {
    id: 'doc-7',
    nombre: 'Contrato Arriendo Oficina Central.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'María García',
    fechaModificacion: new Date('2024-09-15'),
    tamaño: 421000,
    parentId: 'folder-3',
  };

  const doc8: DocumentoSocietario = {
    id: 'doc-8',
    nombre: 'Contrato Prestación Servicios TI.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Carlos López',
    fechaModificacion: new Date('2024-09-10'),
    tamaño: 356000,
    parentId: 'folder-3',
  };

  const doc9: DocumentoSocietario = {
    id: 'doc-9',
    nombre: 'Contrato Marco Proveedores.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-09-05'),
    tamaño: 389000,
    parentId: 'folder-3',
  };

  // Archivos en raíz
  const doc10: DocumentoSocietario = {
    id: 'doc-10',
    nombre: 'Certificado Vigencia.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Thomas Anree',
    fechaModificacion: new Date('2024-11-01'),
    tamaño: 156000,
    parentId: null,
  };

  const doc11: DocumentoSocietario = {
    id: 'doc-11',
    nombre: 'Registro Comercio.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'María García',
    fechaModificacion: new Date('2024-10-28'),
    tamaño: 278000,
    parentId: null,
  };

  const doc12: DocumentoSocietario = {
    id: 'doc-12',
    nombre: 'Poderes Representación.pdf',
    tipo: 'file',
    mimeType: 'application/pdf',
    propietario: 'Carlos López',
    fechaModificacion: new Date('2024-10-15'),
    tamaño: 189000,
    parentId: null,
  };

  // Guardar todos
  [
    folder1,
    folder2,
    folder3,
    doc1,
    doc2,
    doc3,
    doc4,
    doc5,
    doc6,
    doc7,
    doc8,
    doc9,
    doc10,
    doc11,
    doc12,
  ].forEach((doc) => documentosMock.set(doc.id, doc));
};

// Inicializar al cargar el módulo
initMockData();

/**
 * Lista documentos de una carpeta (o raíz)
 */
export async function listDocumentosMock(
  sociedadId: string,
  parentId: string | null
): Promise<DocumentoSocietario[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const documentos = Array.from(documentosMock.values());
  return documentos.filter((doc) => doc.parentId === parentId);
}

/**
 * Obtiene un documento por ID
 */
export async function getDocumentoMock(
  sociedadId: string,
  documentoId: string
): Promise<DocumentoSocietario | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return documentosMock.get(documentoId) || null;
}

/**
 * Crea una nueva carpeta
 */
export async function createCarpetaMock(
  sociedadId: string,
  nombre: string,
  parentId: string | null
): Promise<CarpetaSistema> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const id = ensureId();
  const carpeta: CarpetaSistema = {
    id,
    nombre,
    tipo: 'folder',
    propietario: 'Thomas Anree', // Mock user
    fechaModificacion: now(),
    parentId,
    contenido: [],
  };

  documentosMock.set(id, carpeta);
  return carpeta;
}

/**
 * Sube un documento (simulado)
 */
export async function uploadDocumentoMock(
  sociedadId: string,
  file: File,
  parentId: string | null
): Promise<DocumentoSocietario> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const id = ensureId();
  const documento: DocumentoSocietario = {
    id,
    nombre: file.name,
    tipo: 'file',
    mimeType: file.type || 'application/octet-stream',
    propietario: 'Thomas Anree', // Mock user
    fechaModificacion: now(),
    tamaño: file.size,
    parentId,
  };

  documentosMock.set(id, documento);
  return documento;
}

/**
 * Descarga un documento (simulado)
 */
export async function downloadDocumentoMock(sociedadId: string, documentoId: string): Promise<Blob> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const documento = documentosMock.get(documentoId);
  if (!documento || documento.tipo === 'folder') {
    throw new Error(`Documento con id ${documentoId} no encontrado`);
  }

  // Simular descarga creando un blob vacío
  return new Blob(['Contenido simulado'], { type: documento.mimeType || 'application/pdf' });
}

/**
 * Elimina un documento
 */
export async function deleteDocumentoMock(sociedadId: string, documentoId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (!documentosMock.has(documentoId)) {
    throw new Error(`Documento con id ${documentoId} no encontrado`);
  }

  // Eliminar también todos los documentos hijos si es una carpeta
  const documento = documentosMock.get(documentoId);
  if (documento?.tipo === 'folder') {
    const hijos = Array.from(documentosMock.values()).filter((doc) => doc.parentId === documentoId);
    hijos.forEach((hijo) => documentosMock.delete(hijo.id));
  }

  documentosMock.delete(documentoId);
}

/**
 * Navega a una carpeta (obtiene su contenido)
 */
export async function navigateCarpetaMock(
  sociedadId: string,
  carpetaId: string
): Promise<DocumentoSocietario[]> {
  return listDocumentosMock(sociedadId, carpetaId);
}

