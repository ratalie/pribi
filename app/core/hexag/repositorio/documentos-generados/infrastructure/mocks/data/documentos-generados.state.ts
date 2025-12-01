import type { DocumentosGenerados } from '../../../domain/entities/categoria-documentos.entity';
import type { DocumentoGenerado } from '../../../domain/entities/documento-generado.entity';

/**
 * Mock data estático para Documentos Generados
 * Basado en la documentación de probo-figma-ai
 */

/**
 * Obtiene la estructura completa de documentos generados
 */
export async function getDocumentosGeneradosMock(sociedadId: string): Promise<DocumentosGenerados> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  return {
    registros: {
      id: 'cat-registros',
      nombre: 'Registros',
      carpetas: {
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
                  tamaño: 245000,
                },
                {
                  id: 'gen-soc-2',
                  nombre: 'Holding ABC SpA - Escritura.pdf',
                  fecha: new Date('2024-09-28'),
                  tipo: 'PDF',
                  tamaño: 201000,
                },
              ],
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
                  tamaño: 223000,
                },
              ],
            },
          ],
        },
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
                  tamaño: 178000,
                },
              ],
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
                  tamaño: 165000,
                },
              ],
            },
          ],
        },
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
              tamaño: 189000,
            },
            {
              id: 'gen-dir-2',
              nombre: 'Acta Constitución Directorio.pdf',
              fecha: new Date('2024-08-22'),
              tipo: 'PDF',
              tamaño: 203000,
            },
            {
              id: 'gen-dir-3',
              nombre: 'Renuncia Director Juan Pérez.pdf',
              fecha: new Date('2024-07-15'),
              tipo: 'PDF',
              tamaño: 145000,
            },
          ],
        },
      },
    },
    operaciones: {
      id: 'cat-operaciones',
      nombre: 'Operaciones',
      carpetas: {
        juntaAccionistas: {
          id: 'gen-juntas',
          nombre: 'Junta de Accionistas',
          subcarpetas: [],
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
                  tamaño: 298000,
                },
                {
                  id: 'gen-junta-2',
                  nombre: 'Citación Junta Ordinaria.pdf',
                  fecha: new Date('2024-11-15'),
                  tipo: 'PDF',
                  tamaño: 156000,
                },
              ],
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
                  tamaño: 312000,
                },
              ],
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
                  tamaño: 287000,
                },
                {
                  id: 'gen-junta-5',
                  nombre: 'Modificación Estatutos.pdf',
                  fecha: new Date('2024-08-22'),
                  tipo: 'PDF',
                  tamaño: 234000,
                },
              ],
            },
          ],
        },
      },
    },
  };
}

/**
 * Busca un documento generado por ID en toda la estructura
 */
export async function findDocumentoGeneradoMock(
  sociedadId: string,
  documentoId: string
): Promise<DocumentoGenerado | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const estructura = await getDocumentosGeneradosMock(sociedadId);

  // Buscar en Registros
  for (const carpeta of Object.values(estructura.registros.carpetas)) {
    if (carpeta.subcarpetas && carpeta.subcarpetas.length > 0) {
      for (const sub of carpeta.subcarpetas) {
        const found = sub.documentos.find((d) => d.id === documentoId);
        if (found) return found;
      }
    } else if (carpeta.documentos) {
      const found = carpeta.documentos.find((d) => d.id === documentoId);
      if (found) return found;
    }
  }

  // Buscar en Operaciones (juntas)
  const juntaCarpeta = estructura.operaciones.carpetas.juntaAccionistas;
  if (juntaCarpeta.juntas) {
    for (const junta of juntaCarpeta.juntas) {
      const found = junta.documentos.find((d) => d.id === documentoId);
      if (found) return found;
    }
  }

  return null;
}

