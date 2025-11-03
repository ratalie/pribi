/**
 * Enums de Rutas: Junta de Accionistas
 *
 * Define todas las rutas (~87) para el flujo de Junta de Accionistas.
 * Organizadas por niveles (0-3) para mantener claridad.
 *
 * @module JuntaRoutes
 */

export enum JuntaRoutes {
  // ============================================
  // NIVEL 0: Pasos Principales (6 rutas)
  // ============================================

  /** Selección de puntos de agenda para la junta */
  SELECCION_AGENDA = "/operaciones/junta-accionistas/seleccion-agenda",

  /** Detalles de la junta (tipo, modo, fecha) */
  DETALLES = "/operaciones/junta-accionistas/detalles",

  /** Instalación de la junta (convocatoria, asistencia, mesa) */
  INSTALACION = "/operaciones/junta-accionistas/instalacion",

  /** Puntos de acuerdo (padre complejo) */
  PUNTOS_ACUERDO = "/operaciones/junta-accionistas/puntos-acuerdo",

  /** Resumen de la junta */
  RESUMEN = "/operaciones/junta-accionistas/resumen",

  /** Descarga de documentos */
  DESCARGAR = "/operaciones/junta-accionistas/descargar",

  // ============================================
  // NIVEL 2: Aumento de Capital (8 rutas)
  // ============================================

  // -- Aporte Dinerario --

  /** Página principal: Aporte Dinerario */
  APORTE_DINERARIO = "/operaciones/junta-accionistas/aporte-dinerario",

  /** Sub-página: Aportantes */
  APORTE_DINERARIO_APORTANTES = "/operaciones/junta-accionistas/aporte-dinerario/aportantes",

  /** Sub-página: Aportes */
  APORTE_DINERARIO_APORTES = "/operaciones/junta-accionistas/aporte-dinerario/aportes",

  /** Sub-página: Votación */
  APORTE_DINERARIO_VOTACION = "/operaciones/junta-accionistas/aporte-dinerario/votacion",

  // -- Capitalización de Créditos --

  /** Página principal: Capitalización de Créditos */
  CAPITALIZACION_CREDITOS = "/operaciones/junta-accionistas/capitalizacion-creditos",

  /** Sub-página: Acreedores */
  CAPITALIZACION_ACREEDORES = "/operaciones/junta-accionistas/capitalizacion-creditos/acreedores",

  /** Sub-página: Créditos */
  CAPITALIZACION_CREDITOS_DETALLE = "/operaciones/junta-accionistas/capitalizacion-creditos/creditos",

  /** Sub-página: Votación */
  CAPITALIZACION_VOTACION = "/operaciones/junta-accionistas/capitalizacion-creditos/votacion",

  // ============================================
  // NIVEL 2: Nombramiento (15 rutas)
  // ============================================

  // -- Nombramiento de Apoderados --

  /** Página principal: Nombramiento de Apoderados */
  NOMBRAMIENTO_APODERADOS = "/operaciones/junta-accionistas/nombramiento-apoderados",

  /** Sub-página: Nombramiento */
  NOMBRAMIENTO_APODERADOS_DETALLE = "/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento",

  /** Sub-página: Otorgamiento de Poderes (con scroll anchors nivel 4) */
  NOMBRAMIENTO_APODERADOS_OTORGAMIENTO = "/operaciones/junta-accionistas/nombramiento-apoderados/otorgamiento-poderes",

  /** Sub-página: Votación */
  NOMBRAMIENTO_APODERADOS_VOTACION = "/operaciones/junta-accionistas/nombramiento-apoderados/votacion",

  // -- Nombramiento de Gerente --

  /** Página principal: Nombramiento de Gerente */
  NOMBRAMIENTO_GERENTE = "/operaciones/junta-accionistas/nombramiento-gerente",

  /** Sub-página: Nombramiento */
  NOMBRAMIENTO_GERENTE_DETALLE = "/operaciones/junta-accionistas/nombramiento-gerente/nombramiento",

  /** Sub-página: Votación */
  NOMBRAMIENTO_GERENTE_VOTACION = "/operaciones/junta-accionistas/nombramiento-gerente/votacion",

  // -- Nombramiento de Directores --

  /** Página principal: Nombramiento de Directores */
  NOMBRAMIENTO_DIRECTORES = "/operaciones/junta-accionistas/nombramiento-directores",

  /** Sub-página: Nombramiento */
  NOMBRAMIENTO_DIRECTORES_DETALLE = "/operaciones/junta-accionistas/nombramiento-directores/nombramiento",

  /** Sub-página: Votación */
  NOMBRAMIENTO_DIRECTORES_VOTACION = "/operaciones/junta-accionistas/nombramiento-directores/votacion",

  // -- Nombramiento de Directorio --

  /** Página principal: Nombramiento de Directorio */
  NOMBRAMIENTO_DIRECTORIO = "/operaciones/junta-accionistas/nombramiento-directorio",

  /** Sub-página: Nombramiento */
  NOMBRAMIENTO_DIRECTORIO_DETALLE = "/operaciones/junta-accionistas/nombramiento-directorio/nombramiento",

  /** Sub-página: Votación */
  NOMBRAMIENTO_DIRECTORIO_VOTACION = "/operaciones/junta-accionistas/nombramiento-directorio/votacion",

  // -- Nombramiento de Auditores --

  /** Página principal: Nombramiento de Auditores */
  NOMBRAMIENTO_AUDITORES = "/operaciones/junta-accionistas/nombramiento-auditores",

  /** Sub-página: Nombramiento */
  NOMBRAMIENTO_AUDITORES_DETALLE = "/operaciones/junta-accionistas/nombramiento-auditores/nombramiento",

  /** Sub-página: Votación */
  NOMBRAMIENTO_AUDITORES_VOTACION = "/operaciones/junta-accionistas/nombramiento-auditores/votacion",

  // ============================================
  // NIVEL 2: Remociones (9 rutas)
  // ============================================

  // -- Remoción de Apoderados --

  /** Página principal: Remoción de Apoderados */
  REMOCION_APODERADOS = "/operaciones/junta-accionistas/remocion-apoderados",

  /** Sub-página: Remoción */
  REMOCION_APODERADOS_DETALLE = "/operaciones/junta-accionistas/remocion-apoderados/remocion",

  /** Sub-página: Votación */
  REMOCION_APODERADOS_VOTACION = "/operaciones/junta-accionistas/remocion-apoderados/votacion",

  // -- Remoción de Gerente --

  /** Página principal: Remoción de Gerente */
  REMOCION_GERENTE = "/operaciones/junta-accionistas/remocion-gerente",

  /** Sub-página: Remoción */
  REMOCION_GERENTE_DETALLE = "/operaciones/junta-accionistas/remocion-gerente/remocion",

  /** Sub-página: Votación */
  REMOCION_GERENTE_VOTACION = "/operaciones/junta-accionistas/remocion-gerente/votacion",

  // -- Remoción de Directores --

  /** Página principal: Remoción de Directores */
  REMOCION_DIRECTORES = "/operaciones/junta-accionistas/remocion-directores",

  /** Sub-página: Remoción */
  REMOCION_DIRECTORES_DETALLE = "/operaciones/junta-accionistas/remocion-directores/remocion",

  /** Sub-página: Votación */
  REMOCION_DIRECTORES_VOTACION = "/operaciones/junta-accionistas/remocion-directores/votacion",

  // ============================================
  // NIVEL 2: Gestión Social (12 rutas)
  // ============================================

  // -- Pronunciamiento sobre Gestión --

  /** Página principal: Pronunciamiento sobre Gestión */
  PRONUNCIAMIENTO_GESTION = "/operaciones/junta-accionistas/pronunciamiento-gestion",

  /** Sub-página: Pronunciamiento */
  PRONUNCIAMIENTO_DETALLE = "/operaciones/junta-accionistas/pronunciamiento-gestion/pronunciamiento",

  /** Sub-página: Votación */
  PRONUNCIAMIENTO_VOTACION = "/operaciones/junta-accionistas/pronunciamiento-gestion/votacion",

  // -- Aplicación de Resultados --

  /** Página principal: Aplicación de Resultados */
  APLICACION_RESULTADOS = "/operaciones/junta-accionistas/aplicacion-resultados",

  /** Sub-página: Aplicación */
  APLICACION_DETALLE = "/operaciones/junta-accionistas/aplicacion-resultados/aplicacion",

  /** Sub-página: Votación */
  APLICACION_VOTACION = "/operaciones/junta-accionistas/aplicacion-resultados/votacion",

  // -- Estados Financieros --

  /** Página principal: Estados Financieros */
  ESTADOS_FINANCIEROS = "/operaciones/junta-accionistas/estados-financieros",

  /** Sub-página: Estados */
  ESTADOS_DETALLE = "/operaciones/junta-accionistas/estados-financieros/estados",

  /** Sub-página: Votación */
  ESTADOS_VOTACION = "/operaciones/junta-accionistas/estados-financieros/votacion",

  // -- Reparto de Dividendos --

  /** Página principal: Reparto de Dividendos */
  REPARTO_DIVIDENDOS = "/operaciones/junta-accionistas/reparto-dividendos",

  /** Sub-página: Reparto */
  REPARTO_DETALLE = "/operaciones/junta-accionistas/reparto-dividendos/reparto",

  /** Sub-página: Votación */
  REPARTO_VOTACION = "/operaciones/junta-accionistas/reparto-dividendos/votacion",
}

/**
 * Helper: Obtener nombre legible de una ruta
 */
export function getJuntaRouteName(route: JuntaRoutes): string {
  const names: Record<JuntaRoutes, string> = {
    // Nivel 0
    [JuntaRoutes.SELECCION_AGENDA]: "Selección de Agenda",
    [JuntaRoutes.DETALLES]: "Detalles de la Junta",
    [JuntaRoutes.INSTALACION]: "Instalación",
    [JuntaRoutes.PUNTOS_ACUERDO]: "Puntos de Acuerdo",
    [JuntaRoutes.RESUMEN]: "Resumen",
    [JuntaRoutes.DESCARGAR]: "Descargar",

    // Aporte Dinerario
    [JuntaRoutes.APORTE_DINERARIO]: "Aporte Dinerario",
    [JuntaRoutes.APORTE_DINERARIO_APORTANTES]: "Aportantes",
    [JuntaRoutes.APORTE_DINERARIO_APORTES]: "Aportes",
    [JuntaRoutes.APORTE_DINERARIO_VOTACION]: "Votación",

    // Capitalización
    [JuntaRoutes.CAPITALIZACION_CREDITOS]: "Capitalización de Créditos",
    [JuntaRoutes.CAPITALIZACION_ACREEDORES]: "Acreedores",
    [JuntaRoutes.CAPITALIZACION_CREDITOS_DETALLE]: "Créditos",
    [JuntaRoutes.CAPITALIZACION_VOTACION]: "Votación",

    // Nombramiento Apoderados
    [JuntaRoutes.NOMBRAMIENTO_APODERADOS]: "Nombramiento de Apoderados",
    [JuntaRoutes.NOMBRAMIENTO_APODERADOS_DETALLE]: "Nombramiento",
    [JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO]: "Otorgamiento de Poderes",
    [JuntaRoutes.NOMBRAMIENTO_APODERADOS_VOTACION]: "Votación",

    // Nombramiento Gerente
    [JuntaRoutes.NOMBRAMIENTO_GERENTE]: "Nombramiento de Gerente",
    [JuntaRoutes.NOMBRAMIENTO_GERENTE_DETALLE]: "Nombramiento",
    [JuntaRoutes.NOMBRAMIENTO_GERENTE_VOTACION]: "Votación",

    // Nombramiento Directores
    [JuntaRoutes.NOMBRAMIENTO_DIRECTORES]: "Nombramiento de Directores",
    [JuntaRoutes.NOMBRAMIENTO_DIRECTORES_DETALLE]: "Nombramiento",
    [JuntaRoutes.NOMBRAMIENTO_DIRECTORES_VOTACION]: "Votación",

    // Nombramiento Directorio
    [JuntaRoutes.NOMBRAMIENTO_DIRECTORIO]: "Nombramiento de Directorio",
    [JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_DETALLE]: "Nombramiento",
    [JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_VOTACION]: "Votación",

    // Nombramiento Auditores
    [JuntaRoutes.NOMBRAMIENTO_AUDITORES]: "Nombramiento de Auditores",
    [JuntaRoutes.NOMBRAMIENTO_AUDITORES_DETALLE]: "Nombramiento",
    [JuntaRoutes.NOMBRAMIENTO_AUDITORES_VOTACION]: "Votación",

    // Remoción Apoderados
    [JuntaRoutes.REMOCION_APODERADOS]: "Remoción de Apoderados",
    [JuntaRoutes.REMOCION_APODERADOS_DETALLE]: "Remoción",
    [JuntaRoutes.REMOCION_APODERADOS_VOTACION]: "Votación",

    // Remoción Gerente
    [JuntaRoutes.REMOCION_GERENTE]: "Remoción de Gerente",
    [JuntaRoutes.REMOCION_GERENTE_DETALLE]: "Remoción",
    [JuntaRoutes.REMOCION_GERENTE_VOTACION]: "Votación",

    // Remoción Directores
    [JuntaRoutes.REMOCION_DIRECTORES]: "Remoción de Directores",
    [JuntaRoutes.REMOCION_DIRECTORES_DETALLE]: "Remoción",
    [JuntaRoutes.REMOCION_DIRECTORES_VOTACION]: "Votación",

    // Pronunciamiento
    [JuntaRoutes.PRONUNCIAMIENTO_GESTION]: "Pronunciamiento sobre Gestión",
    [JuntaRoutes.PRONUNCIAMIENTO_DETALLE]: "Pronunciamiento",
    [JuntaRoutes.PRONUNCIAMIENTO_VOTACION]: "Votación",

    // Aplicación
    [JuntaRoutes.APLICACION_RESULTADOS]: "Aplicación de Resultados",
    [JuntaRoutes.APLICACION_DETALLE]: "Aplicación",
    [JuntaRoutes.APLICACION_VOTACION]: "Votación",

    // Estados
    [JuntaRoutes.ESTADOS_FINANCIEROS]: "Estados Financieros",
    [JuntaRoutes.ESTADOS_DETALLE]: "Estados",
    [JuntaRoutes.ESTADOS_VOTACION]: "Votación",

    // Dividendos
    [JuntaRoutes.REPARTO_DIVIDENDOS]: "Reparto de Dividendos",
    [JuntaRoutes.REPARTO_DETALLE]: "Reparto",
    [JuntaRoutes.REPARTO_VOTACION]: "Votación",
  };

  return names[route] || route;
}

/**
 * Total de rutas definidas: 50
 *
 * Distribución:
 * - Nivel 0: 6 rutas
 * - Aumento Capital: 8 rutas
 * - Nombramiento: 15 rutas
 * - Remociones: 9 rutas
 * - Gestión Social: 12 rutas
 */
