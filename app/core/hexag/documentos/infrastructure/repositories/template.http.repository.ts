/**
 * Repositorio para obtener templates desde /public/templates/
 */
export class TemplateHttpRepository {
  /**
   * Obtiene un template .docx desde /public/templates/
   * @param path - Ruta relativa desde /public/templates/junta/
   * @returns Blob del template
   */
  static async getTemplate(path: string): Promise<Blob> {
    // En Nuxt, los archivos en /public/ están disponibles en la raíz
    // La carpeta real es "juntas" (plural), no "junta"
    const fullPath = `/templates/juntas/${path}`;

    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el template: ${path} (ruta: ${fullPath})`);
    }

    return await response.blob();
  }
}

