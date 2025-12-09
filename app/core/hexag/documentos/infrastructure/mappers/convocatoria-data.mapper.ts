import type { DownloadDataDTO } from "../../application/dtos/download-data.dto";

/**
 * Formato de datos para el template de convocatoria
 * (Según TEMPLATES-ESTRUCTURA-EXACTA.md)
 */
export interface ConvocatoriaTemplateData {
  tipoJunta: "GENERAL" | "UNIVERSAL";
  razonSocial: string;
  ruc: string;
  fecha: string;
  hora: string;
  lugar: string;
  orden_dia: Array<{
    numero: number;
    titulo: string;
  }>;
  fecha_convocatoria: string;
}

/**
 * Mapper para transformar DownloadDataDTO a formato de template de convocatoria
 */
export class ConvocatoriaDataMapper {
  /**
   * Mapea DownloadDataDTO a formato de template de convocatoria
   */
  static map(
    downloadData: DownloadDataDTO,
    razonSocial: string,
    ruc: string
  ): ConvocatoriaTemplateData {
    const meetingDetails = downloadData.meetingDetails;
    const agendaItems = downloadData.agendaItems;
    const firstCall = meetingDetails.firstCall;

    const tipoJunta = meetingDetails.meetingType === "JUNTA_UNIVERSAL" ? "UNIVERSAL" : "GENERAL";
    const fecha = firstCall?.dateFormatted || "";
    const hora = firstCall?.timeFormatted || "";
    const lugar = firstCall?.place || "";

    // Construir orden del día desde agendaItems
    const ordenDia: Array<{ numero: number; titulo: string }> = [];
    let numero = 1;

    if (agendaItems.aumentoCapital.aportesDinerarios) {
      ordenDia.push({ numero: numero++, titulo: "Aporte Dinerario" });
    }
    if (agendaItems.aumentoCapital.capitalizacionDeCreditos) {
      ordenDia.push({ numero: numero++, titulo: "Capitalización de Créditos" });
    }
    if (agendaItems.nombramiento.nombramientoGerenteGeneral) {
      ordenDia.push({ numero: numero++, titulo: "Nombramiento de Gerente General" });
    }
    if (agendaItems.nombramiento.nombramientoDirectores) {
      ordenDia.push({ numero: numero++, titulo: "Nombramiento de Directores" });
    }
    // ... agregar más puntos según necesidad

    // Fecha de convocatoria (usar fecha de firstCall o fecha actual)
    const fechaConvocatoria = firstCall?.dateFormatted || new Date().toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      tipoJunta,
      razonSocial,
      ruc,
      fecha,
      hora,
      lugar,
      orden_dia: ordenDia,
      fecha_convocatoria: fechaConvocatoria,
    };
  }
}



