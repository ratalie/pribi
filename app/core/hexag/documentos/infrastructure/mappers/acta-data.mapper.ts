import type { DownloadDataDTO } from "../../application/dtos/download-data.dto";

/**
 * Formato de datos para el template de acta
 * (Según TEMPLATES-ESTRUCTURA-EXACTA.md)
 */
export interface ActaTemplateData {
  encabezado: {
    tipoJunta: "GENERAL" | "UNIVERSAL";
    ciudad: string;
    hora: string;
    fecha: string;
    razonSocial: string;
    ruc: string;
  };
  instalacion: {
    asistencia: Array<{
      nombre: string;
      documento: string;
      acciones: number;
    }>;
    presidente: string;
    secretario: string;
    quorum: {
      porcentaje: number;
      cumple: string; // "cumple" | "no cumple"
    };
  };
  puntos_acuerdo: Array<{
    numero: number;
    titulo: string;
    datos: {
      aportantes?: Array<{
        nombre: string;
        aporte_soles: number;
      }>;
    };
    votacion: {
      porcentaje_aprobacion: number;
      accionistas_afavor: Array<{
        nombre: string;
        acciones: number;
      }>;
      accionistas_contra: Array<{
        nombre: string;
        acciones: number;
      }>;
    };
  }>;
  firmas: {
    presidente: string;
    secretario: string;
  };
}

/**
 * Mapper para transformar DownloadDataDTO a formato de template de acta
 */
export class ActaDataMapper {
  /**
   * Mapea DownloadDataDTO a formato de template de acta
   */
  static map(downloadData: DownloadDataDTO, razonSocial: string, ruc: string): ActaTemplateData {
    const meetingDetails = downloadData.meetingDetails;
    const attendance = downloadData.attendance;
    const aporteDinerario = downloadData.agendaItemsData?.aporteDinerario;

    // Helper para obtener nombre completo de persona
    const obtenerNombreCompleto = (person: any): string => {
      if (person.tipo === "NATURAL") {
        return `${person.nombre} ${person.apellidoPaterno} ${person.apellidoMaterno || ""}`.trim();
      }
      if (person.tipo === "JURIDICA") {
        return person.razonSocial || "";
      }
      return "";
    };

    // 1. Encabezado
    console.log("🔍 [ActaDataMapper] Mapeando encabezado...", {
      meetingType: meetingDetails.meetingType,
      firstCall: meetingDetails.firstCall,
      razonSocial,
      ruc,
    });
    
    const tipoJunta = meetingDetails.meetingType === "JUNTA_UNIVERSAL" ? "UNIVERSAL" : "GENERAL";
    const firstCall = meetingDetails.firstCall;
    const ciudad = firstCall?.place?.split(",")[0] || "Lima";
    const hora = firstCall?.timeFormatted || "";
    const fecha = firstCall?.dateFormatted || "";
    
    console.log("✅ [ActaDataMapper] Encabezado mapeado:", {
      tipoJunta,
      ciudad,
      hora,
      fecha,
      razonSocial,
      ruc,
    });

    // 2. Instalación - Asistencia
    const asistencia = attendance
      .filter((a) => a.asistio)
      .map((a) => ({
        nombre: obtenerNombreCompleto(a.accionista.person),
        documento: a.accionista.person.numeroDocumento || "",
        acciones: a.accionesConDerechoVoto || 0,
      }));

    // 3. Presidente y Secretario
    // Si name está vacío, buscar en attendance por personId
    let presidenteNombre = meetingDetails.president?.name || "";
    if (!presidenteNombre && meetingDetails.president?.personId) {
      const presidenteAsistencia = attendance.find(
        (a) => a.asistio && a.accionista.person.id === meetingDetails.president?.personId
      );
      if (presidenteAsistencia) {
        presidenteNombre = obtenerNombreCompleto(presidenteAsistencia.accionista.person);
      }
    }
    // Si aún no hay nombre, usar el primero que asistió
    if (!presidenteNombre && asistencia.length > 0) {
      presidenteNombre = asistencia[0].nombre;
    }

    let secretarioNombre = meetingDetails.secretary?.name || "";
    if (!secretarioNombre && meetingDetails.secretary?.personId) {
      const secretarioAsistencia = attendance.find(
        (a) => a.asistio && a.accionista.person.id === meetingDetails.secretary?.personId
      );
      if (secretarioAsistencia) {
        secretarioNombre = obtenerNombreCompleto(secretarioAsistencia.accionista.person);
      }
    }
    // Si aún no hay nombre, usar el segundo que asistió (diferente al presidente)
    if (!secretarioNombre && asistencia.length > 1) {
      secretarioNombre = asistencia[1].nombre;
    } else if (!secretarioNombre && asistencia.length === 1) {
      secretarioNombre = asistencia[0].nombre; // Mismo que presidente si solo hay uno
    }

    // 4. Quorum
    const totalAcciones = attendance.reduce((sum, a) => sum + (a.asistio ? a.accionesConDerechoVoto : 0), 0);
    const totalAccionesSociedad = attendance.reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
    const porcentajeQuorum = totalAccionesSociedad > 0 ? (totalAcciones / totalAccionesSociedad) * 100 : 0;
    const cumpleQuorum = porcentajeQuorum >= 50; // Valor por defecto, debería venir del snapshot

    // 5. Puntos de Acuerdo
    const puntosAcuerdo: ActaTemplateData["puntos_acuerdo"] = [];

    // Aporte Dinerario
    if (downloadData.agendaItems.aumentoCapital.aportesDinerarios && aporteDinerario) {
      const aportes = aporteDinerario.aportesData || [];
      const votacion = aporteDinerario.votacionData;

      // Calcular total de aumento
      const totalAumento = aportes.reduce((sum, a) => sum + a.contributionAmount, 0);

      // Obtener aportantes con nombres
      const aportantes = aportes.map((aporte) => {
        const aportante = aporteDinerario.aportanteData.find(
          (a) => a.id === aporte.shareholderId
        );
        return {
          nombre: aportante ? obtenerNombreCompleto(aportante.person) : "",
          aporte_soles: aporte.contributionAmount,
        };
      });

      // Obtener votación
      const votacionItem = votacion?.items?.[0];
      const votos = votacionItem?.votos || [];

      // Separar votos a favor y en contra
      const accionistasAfavor = votos
        .filter((v) => v.valor === "A_FAVOR")
        .map((v) => {
          const accionista = attendance.find((a) => a.accionista.id === v.accionistaId);
          return {
            nombre: accionista ? obtenerNombreCompleto(accionista.accionista.person) : "",
            acciones: accionista?.accionesConDerechoVoto || 0,
          };
        });

      const accionistasContra = votos
        .filter((v) => v.valor === "EN_CONTRA")
        .map((v) => {
          const accionista = attendance.find((a) => a.accionista.id === v.accionistaId);
          return {
            nombre: accionista ? obtenerNombreCompleto(accionista.accionista.person) : "",
            acciones: accionista?.accionesConDerechoVoto || 0,
          };
        });

      // Calcular porcentaje de aprobación
      const totalAccionesVotantes = accionistasAfavor.reduce((sum, a) => sum + a.acciones, 0) +
        accionistasContra.reduce((sum, a) => sum + a.acciones, 0);
      const porcentajeAprobacion = totalAccionesVotantes > 0
        ? Math.round((accionistasAfavor.reduce((sum, a) => sum + a.acciones, 0) / totalAccionesVotantes) * 100)
        : 100;

      puntosAcuerdo.push({
        numero: puntosAcuerdo.length + 1,
        titulo: "APORTE DINERARIO",
        datos: {
          aportantes,
        },
        votacion: {
          porcentaje_aprobacion: porcentajeAprobacion,
          accionistas_afavor: accionistasAfavor,
          accionistas_contra: accionistasContra,
        },
      });
    }

    const mappedData = {
      encabezado: {
        tipoJunta,
        ciudad,
        hora,
        fecha,
        razonSocial,
        ruc,
      },
      instalacion: {
        asistencia,
        presidente: presidenteNombre,
        secretario: secretarioNombre,
        quorum: {
          porcentaje: Math.round(porcentajeQuorum),
          cumple: cumpleQuorum ? "cumple" : "no cumple",
        },
      },
      puntos_acuerdo: puntosAcuerdo,
      firmas: {
        presidente: presidenteNombre,
        secretario: secretarioNombre,
      },
    };

    console.log("📊 [ActaDataMapper] Datos mapeados:", {
      encabezado: mappedData.encabezado,
      instalacion: {
        asistenciaCount: mappedData.instalacion.asistencia.length,
        presidente: mappedData.instalacion.presidente,
        secretario: mappedData.instalacion.secretario,
        quorum: mappedData.instalacion.quorum,
      },
      puntosAcuerdoCount: mappedData.puntos_acuerdo.length,
    });

    return mappedData;
  }
}

