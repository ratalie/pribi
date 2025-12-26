/**
 * Helper para limpiar el backend antes de tests
 */

import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";

/**
 * Elimina TODAS las sociedades del backend
 * Útil para limpiar antes de correr tests
 */
export async function cleanupAllSociedades() {
  const repo = new SociedadHttpRepository();
  
  try {
    console.log('🧹 [Cleanup] Obteniendo lista de sociedades...');
    const sociedades = await repo.list();
    console.log(`🧹 [Cleanup] Encontradas ${sociedades.length} sociedades`);
    
    if (sociedades.length === 0) {
      console.log('✅ [Cleanup] No hay sociedades para eliminar');
      return;
    }
    
    console.log(`🧹 [Cleanup] Eliminando ${sociedades.length} sociedades...`);
    
    // Eliminar todas en paralelo
    await Promise.all(
      sociedades.map(async (s) => {
        try {
          await repo.delete(s.idSociety);
          console.log(`  ✅ Eliminada: ${s.idSociety} - ${s.razonSocial}`);
        } catch (error: any) {
          console.warn(`  ⚠️  No se pudo eliminar ${s.idSociety}:`, error.message);
        }
      })
    );
    
    console.log('✅ [Cleanup] Limpieza completada');
  } catch (error: any) {
    console.error('❌ [Cleanup] Error al limpiar sociedades:', error.message);
    throw error;
  }
}

