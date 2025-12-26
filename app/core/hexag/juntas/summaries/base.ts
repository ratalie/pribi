import { JuntaRoutes } from "@/config/routes";
import type { SummarySection } from "./types";

export const baseSummarySections: SummarySection[] = [
  {
    id: "seleccion-agenda",
    title: "Selección de Agenda",
    route: JuntaRoutes.SELECCION_AGENDA,
    order: 1,
    blocks: [
      {
        id: "resumen-general",
        title: "Resumen General",
        description:
          "Síntesis de los puntos propuestos y seleccionados para la agenda de la junta de accionistas.",
        highlights: [
          {
            id: "puntos-evaluados",
            label: "Puntos evaluados",
            value: "—",
            description: "Cantidad de temas analizados por los organizadores.",
            status: "pending",
          },
          {
            id: "puntos-aprobados",
            label: "Puntos aprobados",
            value: "—",
            description: "Temas que se incluirán formalmente en la agenda.",
            status: "pending",
          },
        ],
        notes: [
          "Actualiza este bloque cuando la selección esté completa para reflejar los puntos o acuerdos concretos.",
        ],
      },
      {
        id: "validaciones",
        title: "Validaciones y Documentación",
        description:
          "Checklist de requisitos previos y documentación soporte que respalda la inclusión de cada punto.",
        highlights: [
          {
            id: "requisitos",
            label: "Requisitos completos",
            value: "— / —",
            status: "pending",
          },
          {
            id: "documentos",
            label: "Documentación cargada",
            value: "—",
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    id: "detalles",
    title: "Detalles de la Junta",
    route: JuntaRoutes.DETALLES,
    order: 2,
    blocks: [
      {
        id: "datos-generales",
        title: "Datos Generales",
        description:
          "Información operativa de la junta: fecha, horario, modalidad, quórum esperado y responsables.",
        highlights: [
          { id: "fecha", label: "Fecha de la junta", value: "—", status: "pending" },
          { id: "modalidad", label: "Modalidad", value: "—", status: "pending" },
          { id: "quorum", label: "Quórum objetivo", value: "—", status: "pending" },
        ],
      },
      {
        id: "participantes",
        title: "Participantes y Roles",
        description:
          "Resumen de socios, directores y asesores confirmados, incluyendo su rol y documentación acreditada.",
        highlights: [
          { id: "socios", label: "Socios confirmados", value: "—", status: "pending" },
          { id: "directores", label: "Directores confirmados", value: "—", status: "pending" },
          { id: "asesores", label: "Asesores invitados", value: "—", status: "optional" },
        ],
      },
    ],
  },
  {
    id: "instalacion",
    title: "Instalación",
    route: JuntaRoutes.INSTALACION,
    order: 3,
    blocks: [
      {
        id: "constitucion",
        title: "Constitución de la Junta",
        description:
          "Estado del acta de instalación, verificación de quórum y designación de presidente y secretario.",
        highlights: [
          { id: "acta", label: "Acta de instalación", value: "—", status: "pending" },
          { id: "quorum-verificado", label: "Quórum verificado", value: "—", status: "pending" },
          { id: "mesa-directiva", label: "Mesa directiva confirmada", value: "—", status: "pending" },
        ],
      },
      {
        id: "protocolos",
        title: "Protocolos y Normas",
        description:
          "Checklist de protocolos adoptados (orden del día, reglas de votación, manejo de conflictos).",
        highlights: [
          { id: "orden-dia", label: "Orden del día aprobado", value: "—", status: "pending" },
          { id: "reglas-votacion", label: "Reglas de votación", value: "—", status: "pending" },
        ],
      },
    ],
  },
  {
    id: "resumen",
    title: "Resumen General",
    route: JuntaRoutes.RESUMEN,
    order: 4,
    blocks: [
      {
        id: "estado-flujo",
        title: "Estado del Flujo",
        description:
          "Visión consolidada del avance global del proceso de junta, destacando acuerdos críticos y pendientes.",
        highlights: [
          { id: "acuerdos-aprobados", label: "Acuerdos aprobados", value: "—", status: "pending" },
          { id: "acuerdos-pendientes", label: "Acuerdos pendientes", value: "—", status: "pending" },
          { id: "documentos", label: "Documentos generados", value: "—", status: "pending" },
        ],
      },
    ],
  },
];

