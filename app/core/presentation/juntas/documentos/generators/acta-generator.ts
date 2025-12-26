import { useDocumentosStore } from "../stores/documentos.store";
import { useActaDocumentStore } from "../stores/acta-document.store";
import { DocxtemplaterProcessor } from "~/core/hexag/documentos/infrastructure/processors/docxtemplater-processor";
import { TemplateHttpRepository } from "~/core/hexag/documentos/infrastructure/repositories/template.http.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { TipoDocumento } from "~/core/hexag/documentos/domain/enums/tipo-documento.enum";
import { CategoriaDocumento } from "~/core/hexag/documentos/domain/enums/categoria-documento.enum";

/**
 * Generador de Acta Completa
 *
 * Combina todos los puntos de agenda en una sola acta.
 * Usa el store ActaDocumentStore para obtener todas las variables.
 */
export class ActaGenerator {
  /**
   * Genera el acta completa de la junta
   * @returns Blob del documento generado
   */
  static async generate(): Promise<Documento> {
    const actaDocumentStore = useActaDocumentStore();
    const documentosStore = useDocumentosStore();

    // 1. Cargar todo antes de obtener variables
    actaDocumentStore.load();

    // 2. Construir variables completas desde el state
    const variablesCompletas = {
      ...actaDocumentStore.variablesBase,
      ...actaDocumentStore.variablesJunta,
      ...actaDocumentStore.variablesAsistencia,
      ...actaDocumentStore.variablesPresidenciaSecretaria,
      agenda: actaDocumentStore.variablesAgenda,
      quorum: actaDocumentStore.variablesQuorum,
      puntos_agenda_apertura: actaDocumentStore.variablesAperturaPuntos,
    };

    if (!variablesCompletas) {
      throw new Error("No hay datos suficientes para generar el acta");
    }

    // 2. Validar que se pueda abrir la junta
    if (!variablesCompletas.quorum.apertura_junta) {
      throw new Error(
        "No se puede generar el acta: ningún punto de agenda cumple el quórum requerido"
      );
    }

    // 3. Obtener variables de cada punto de agenda activo (para puntos_acuerdo)
    const puntosAcuerdo = this.buildPuntosAcuerdo(documentosStore);

    // 4. Agregar puntos_acuerdo a las variables completas
    const variablesFinales = {
      ...variablesCompletas,
      puntos_acuerdo: puntosAcuerdo,
      total_puntos_acuerdo: puntosAcuerdo.length,
    };

    // Log detallado para debugging
    const variablesFinalesAny = variablesFinales as any;
    console.log("📋 [ActaGenerator] Variables completas:", {
      // Variables base
      acta_label: variablesFinalesAny.acta_label,
      ciudad: variablesFinalesAny.ciudad,
      nombre_empresa: variablesFinalesAny.nombre_empresa,
      asistenciaCount: variablesFinalesAny.asistencia_lista?.length || 0,
      // Quórum
      apertura_junta: variablesFinales.quorum.apertura_junta,
      porcentaje_asistencia: variablesFinales.quorum.porcentaje_asistencia,
      puntosAperturaCount: variablesFinales.puntos_agenda_apertura?.length || 0,
      // Puntos de acuerdo
      puntosAcuerdoCount: puntosAcuerdo.length,
      puntosAcuerdo: puntosAcuerdo.map((p) => ({
        tipo: p.tipo,
        numero: p.numero,
        titulo: p.titulo,
        tieneVotacion: !!p.votacion,
        tieneDatos: !!p.datos,
      })),
    });

    // Log completo del primer punto (solo en desarrollo)
    if (puntosAcuerdo.length > 0 && process.env.NODE_ENV === "development") {
      console.log("📋 [ActaGenerator] Primer punto de acuerdo:", {
        tipo: puntosAcuerdo[0].tipo,
        votacion: puntosAcuerdo[0].votacion,
        datosKeys: Object.keys(puntosAcuerdo[0].datos || {}),
        aportantesCount: puntosAcuerdo[0].datos?.aportantes?.length || 0,
      });
    }

    // 5. Obtener template
    const templateBlob = await TemplateHttpRepository.getTemplate("acta/acta.docx");

    // 6. Procesar template con datos
    const documentoBlob = await DocxtemplaterProcessor.process(templateBlob, variablesFinales);

    // 7. Crear entidad Documento
    const documento: Documento = {
      id: crypto.randomUUID(),
      nombre: `acta-${documentosStore.datosJunta.tipoJunta
        .toLowerCase()
        .replace(/\s+/g, "-")}.docx`,
      tipo: TipoDocumento.ACTA,
      categoria: CategoriaDocumento.ACTA_PRINCIPAL,
      blob: documentoBlob,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tamano: documentoBlob.size,
      tamanoLegible: this.formatFileSize(documentoBlob.size),
    };

    return documento;
  }

  /**
   * Construye las variables base del acta (encabezado, instalación, quórum)
   * DEPRECADO: Ahora se usa actaDocumentStore.variablesCompletas
   * Se mantiene por compatibilidad temporal
   * @deprecated Usar actaDocumentStore.variablesCompletas en su lugar
   */
  private static buildBaseVariables(store: ReturnType<typeof useDocumentosStore>) {
    const datosSociedad = store.datosSociedad!;
    const datosJunta = store.datosJunta!;
    const asistentes = store.listaAccionistasAsistentes;
    const totalAcciones = store.totalAccionesConDerechoVoto;
    const porcentajeAsistencia = store.porcentajeAsistencia;

    // Helper para formatear asistencia
    const formatearAsistencia = (accionista: any): string => {
      const esPersonaNatural = accionista.tipo === "NATURAL";

      if (esPersonaNatural) {
        return `${accionista.nombre}, identificado con ${accionista.tipoDocumento} N° ${accionista.documento}, con ${accionista.acciones} acciones`;
      } else {
        const representante = accionista.representante;
        if (representante) {
          const nombreRepre = `${representante.nombre} ${representante.apellidoPaterno} ${
            representante.apellidoMaterno || ""
          }`.trim();
          return `${accionista.nombre}, representada por ${nombreRepre}, identificado con ${representante.tipoDocumento} N° ${representante.numeroDocumento}, con ${accionista.acciones} acciones`;
        }
        return `${accionista.nombre}, identificada con ${accionista.tipoDocumento} N° ${accionista.documento}, con ${accionista.acciones} acciones`;
      }
    };

    // Construir lista de agenda desde puntos activos
    const agenda: string[] = [];
    const puntosActivos = store.puntosAgendaActivos;

    if (puntosActivos.includes("aporteDinerario")) {
      agenda.push("Aumento de capital mediante nuevos aportes dinerarios");
    }
    if (puntosActivos.includes("capitalizacionCreditos")) {
      agenda.push("Aumento de capital mediante capitalización de créditos");
    }
    if (
      puntosActivos.includes("aporteDinerario") ||
      puntosActivos.includes("capitalizacionCreditos")
    ) {
      agenda.push("Modificación parcial del estatuto social de la Sociedad");
    }
    // TODO: Agregar más puntos de agenda según se implementen

    // Siempre agregar otorgamiento de facultades al final
    agenda.push("Otorgamiento de facultades para la formalización de acuerdos");

    return {
      // ============================================
      // ENCABEZADO
      // ============================================
      acta_label:
        datosJunta.tipoJunta === "UNIVERSAL"
          ? "ACTA DE JUNTA UNIVERSAL"
          : "ACTA DE JUNTA GENERAL",
      ciudad: datosSociedad.ciudad || "Lima",
      date:
        datosJunta.fecha ||
        new Date().toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      hours:
        datosJunta.hora ||
        new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      nombre_empresa: datosSociedad.razonSocial,
      direccion: datosSociedad.direccion || "",
      ruc: datosSociedad.ruc || "",

      // ============================================
      // ASISTENCIA
      // ============================================
      asistencia_lista: asistentes.map((a: any) => ({
        texto_asistencia: formatearAsistencia(a),
      })),
      total_acciones: totalAcciones.toLocaleString("es-PE"),
      porcentaje_acciones: porcentajeAsistencia.toFixed(2),
      valor_nominal: "1.00", // TODO: Obtener desde snapshot

      // ============================================
      // QUÓRUM
      // ============================================
      is_universal: datosJunta.tipoJunta === "UNIVERSAL",
      porcentaje_acciones_asistentes: porcentajeAsistencia.toFixed(2),

      // ============================================
      // MESA DIRECTIVA
      // ============================================
      presidente_junta: datosJunta.presidente?.nombre || "No especificado",
      secretario_junta: datosJunta.secretario?.nombre || "No especificado",

      // ============================================
      // AGENDA
      // ============================================
      agenda: agenda.map((titulo, index) => ({
        numero: index + 1,
        titulo,
      })),

      // ============================================
      // CIERRE
      // ============================================
      hora_acta: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),

      // ============================================
      // FIRMAS (solo para Junta Universal)
      // ============================================
      asistentes_firmas:
        datosJunta.tipoJunta === "UNIVERSAL"
          ? asistentes.map((a: any) => ({
              nombre_accionista: a.nombre,
            }))
          : [],
    };
  }

  /**
   * Construye los puntos de acuerdo según los puntos activos
   */
  private static buildPuntosAcuerdo(store: ReturnType<typeof useDocumentosStore>) {
    const puntos: any[] = [];
    const puntosActivos = store.puntosAgendaActivos; // Array de strings

    // 1. Aporte Dinerario
    if (puntosActivos.includes("aporteDinerario")) {
      const actaDocumentStore = useActaDocumentStore();
      const punto = actaDocumentStore.aporteDinerario; // Leer directamente del state

      if (punto) {
        // Crear copia para no modificar el state original
        const puntoCopia = JSON.parse(JSON.stringify(punto));
        puntoCopia.numero = puntos.length + 1; // Asignar número dinámico
        puntos.push(puntoCopia);
      }
    }

    // 2. Capitalización de Créditos
    if (puntosActivos.includes("capitalizacionCreditos")) {
      // TODO: Implementar cuando tengamos el composable
      puntos.push({
        tipo: "capitalizacion_creditos",
        titulo: "Capitalización de Créditos",
        // ... variables del composable
      });
    }

    // 3. Nombramiento de Directores
    if (puntosActivos.includes("nombramientoDirectores")) {
      // TODO: Implementar cuando tengamos el composable
      puntos.push({
        tipo: "nombramiento_directores",
        titulo: "Nombramiento de Directores",
        // ... variables del composable
      });
    }

    // 4. Nombramiento de Gerente
    if (puntosActivos.includes("nombramientoGerente")) {
      // TODO: Implementar cuando tengamos el composable
      puntos.push({
        tipo: "nombramiento_gerente",
        titulo: "Nombramiento de Gerente General",
        // ... variables del composable
      });
    }

    // 5. Remoción de Directores
    if (puntosActivos.includes("remocionDirectores")) {
      // TODO: Implementar cuando tengamos el composable
      puntos.push({
        tipo: "remocion_directores",
        titulo: "Remoción de Directores",
        // ... variables del composable
      });
    }

    // 6. Remoción de Gerente
    if (puntosActivos.includes("remocionGerente")) {
      // TODO: Implementar cuando tengamos el composable
      puntos.push({
        tipo: "remocion_gerente",
        titulo: "Remoción de Gerente General",
        // ... variables del composable
      });
    }

    // 7. Gestión Social
    if (puntosActivos.includes("gestionSocial")) {
      // TODO: Implementar cuando tengamos el composable
      puntos.push({
        tipo: "gestion_social",
        titulo: "Pronunciamiento sobre Gestión Social y Resultados Económicos",
        // ... variables del composable
      });
    }

    // 8. Aplicación de Resultados
    if (puntosActivos.includes("aplicacionResultados")) {
      // TODO: Implementar cuando tengamos el composable
      puntos.push({
        tipo: "aplicacion_resultados",
        titulo: "Aplicación de Resultados",
        // ... variables del composable
      });
    }

    // 9. Designación de Auditores
    if (puntosActivos.includes("designacionAuditores")) {
      // TODO: Implementar cuando tengamos el composable
      puntos.push({
        tipo: "designacion_auditores",
        titulo: "Designación de Auditores Externos",
        // ... variables del composable
      });
    }

    return puntos;
  }

  /**
   * Formatea el tamaño del archivo
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
}
