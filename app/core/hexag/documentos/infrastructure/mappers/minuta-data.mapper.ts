import type { DownloadDataDTO } from "../../application/dtos/download-data.dto";

/**
 * Formato de datos para el template de minuta (aporte dinerario)
 * (Según TEMPLATES-ESTRUCTURA-EXACTA.md)
 */
export interface MinutaTemplateData {
  total_aumento: number;
  aportantes: Array<{
    nombre: string;
    aporte: number;
  }>;
  cantidad_acciones: number;
  valor_nominal: number;
  capital_antes: number;
  acciones_antes: number;
  capital_despues: number;
  acciones_despues: number;
}

/**
 * Mapper para transformar DownloadDataDTO a formato de template de minuta
 */
export class MinutaDataMapper {
  /**
   * Mapea DownloadDataDTO a formato de template de minuta
   */
  static map(downloadData: DownloadDataDTO): MinutaTemplateData | null {
    const aporteDinerario = downloadData.agendaItemsData?.aporteDinerario;
    if (!aporteDinerario) return null;

    const aportes = aporteDinerario.aportesData || [];

    // Helper para obtener nombre completo
    const obtenerNombreCompleto = (person: any): string => {
      if (person.tipo === "NATURAL") {
        return `${person.nombre} ${person.apellidoPaterno} ${person.apellidoMaterno || ""}`.trim();
      }
      if (person.tipo === "JURIDICA") {
        return person.razonSocial || "";
      }
      return "";
    };

    // Calcular total de aumento
    const totalAumento = aportes.reduce((sum, a) => sum + a.contributionAmount, 0);

    // Obtener aportantes
    const aportantes = aportes.map((aporte) => {
      const aportante = aporteDinerario.aportanteData.find(
        (a) => a.id === aporte.shareholderId
      );
      return {
        nombre: aportante ? obtenerNombreCompleto(aportante.person) : "",
        aporte: aporte.contributionAmount,
      };
    });

    // Calcular cantidad de acciones
    const cantidadAcciones = aportes.reduce((sum, a) => sum + a.sharesToReceive, 0);

    // Valor nominal (tomar del primer aporte)
    const valorNominal = aportes[0]?.pricePerShare || 1;

    // Capital antes y después
    // Calcular desde los aportes (capital antes = suma de socialCapital de todos los aportes antes del aumento)
    // Por ahora, usar valores calculados desde los aportes
    // TODO: Obtener del snapshot cuando esté disponible para mayor precisión
    const capitalAntes = aportes[0]?.socialCapital || 0; // Capital antes del aporte
    const accionesAntes = 0; // Se calcularía desde snapshot
    const capitalDespues = capitalAntes + totalAumento;
    const accionesDespues = cantidadAcciones; // Total de acciones después del aumento

    return {
      total_aumento: totalAumento,
      aportantes,
      cantidad_acciones: cantidadAcciones,
      valor_nominal: valorNominal,
      capital_antes: capitalAntes,
      acciones_antes: accionesAntes,
      capital_despues: capitalDespues,
      acciones_despues: accionesDespues,
    };
  }
}

