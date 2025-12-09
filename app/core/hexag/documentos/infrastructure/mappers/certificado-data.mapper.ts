import type { DownloadDataDTO } from "../../application/dtos/download-data.dto";

/**
 * Formato de datos para el template de certificado (aporte dinerario)
 * (Según TEMPLATES-ESTRUCTURA-EXACTA.md)
 */
export interface CertificadoTemplateData {
  aportante: {
    nombre: string;
    dni: string;
  };
  aporte: number;
  razonSocial: string;
  ruc: string;
  fecha: string;
  acciones_recibidas: number;
  valor_nominal: number;
  secretario: string;
}

/**
 * Mapper para transformar DownloadDataDTO a formato de template de certificado
 * Genera un certificado por cada aportante
 */
export class CertificadoDataMapper {
  /**
   * Mapea DownloadDataDTO a formato de template de certificado
   * Retorna un array porque hay un certificado por cada aportante
   */
  static map(
    downloadData: DownloadDataDTO,
    razonSocial: string,
    ruc: string
  ): CertificadoTemplateData[] {
    const aporteDinerario = downloadData.agendaItemsData?.aporteDinerario;
    if (!aporteDinerario) return [];

    const aportes = aporteDinerario.aportesData || [];
    const meetingDetails = downloadData.meetingDetails;
    const attendance = downloadData.attendance;

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

    // Obtener secretario
    const secretarioNombre = meetingDetails.secretary?.name || 
      (attendance.find(a => a.asistio && a.accionista.id === meetingDetails.secretary?.personId) 
        ? obtenerNombreCompleto(attendance.find(a => a.asistio && a.accionista.id === meetingDetails.secretary?.personId)!.accionista.person)
        : "");

    // Fecha de la junta
    const fecha = meetingDetails.firstCall?.dateFormatted || "";

    // Generar certificado por cada aporte
    return aportes.map((aporte) => {
      const aportante = aporteDinerario.aportanteData.find(
        (a) => a.id === aporte.shareholderId
      );

      const person = aportante?.person;
      const nombre = person ? obtenerNombreCompleto(person) : "";
      const dni = person?.numeroDocumento || "";

      return {
        aportante: {
          nombre,
          dni,
        },
        aporte: aporte.contributionAmount,
        razonSocial,
        ruc,
        fecha,
        acciones_recibidas: aporte.sharesToReceive,
        valor_nominal: aporte.pricePerShare,
        secretario: secretarioNombre,
      };
    });
  }
}



