import type {
  SubModuleDefinition,
  SubModuleConfig,
} from "../types/configurar-permisos.types";

/**
 * Definiciones de sub-módulos por área
 * Mapea sub-módulos del frontend a módulos del backend
 */
export const SUBMODULE_DEFINITIONS: Record<string, SubModuleDefinition[]> = {
  REGISTROS: [
    {
      key: "society",
      displayName: "Sociedades",
      description: "Datos generales de la sociedad",
      backendModules: ["SOCIETY"],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        file: false,
      },
    },
    {
      key: "shareholder",
      displayName: "Accionistas",
      description: "Accionistas y asignación de acciones",
      backendModules: ["SHAREHOLDER", "SHARES_ALLOCATION"],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        file: false,
      },
    },
    {
      key: "capital",
      displayName: "Capital",
      description: "Acciones de capital",
      backendModules: ["CAPITAL_ACTIONS"],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: false,
      },
    },
    {
      key: "directors",
      displayName: "Directorio",
      description: "Gestión del directorio",
      backendModules: ["BOARD_OF_DIRECTORS"],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        file: false,
      },
    },
    {
      key: "attorneys",
      displayName: "Apoderados",
      description: "Registro de apoderados y régimen de poderes",
      backendModules: ["ATTORNEY_REGISTRY", "GENERAL_POWER_REGIME"],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        file: false,
      },
    },
    {
      key: "agreements",
      displayName: "Acuerdos",
      description: "Quórums, mayorías y acuerdos especiales",
      backendModules: ["QUORUMS_AND_MAJORITY", "SPECIAL_AGREEMENTS"],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: true, // SPECIAL_AGREEMENTS puede tener file
      },
    },
  ],

  OPERACIONES: [
    {
      key: "junta",
      displayName: "Juntas de Accionistas",
      description: "Gestión básica de juntas",
      backendModules: [
        "MEETING_TYPE",
        "MEETING_DETAILS",
        "REPRESENTATION_POWERS",
        "DESIGNATION_SECRETARY_DESIGNATION",
        "ASSISTANCE",
        "POWER_REPRESENTATION",
        "ASSISTANCE_SHAREHOLDERS",
        "HISTORY_SOCIETY",
      ],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: false,
      },
    },
    {
      key: "aumento-capital",
      displayName: "Aumento de Capital",
      description: "Aportes dinerarios y aumento de capital",
      backendModules: [
        "CAPITAL_INCREASE_CASH_CONTRIBUTION",
        "CONTRIBUTORS",
        "CONTRIBUTIONS",
        "AGREEMENT_VOTING",
      ],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: false,
      },
    },
    {
      key: "capitalizacion",
      displayName: "Capitalización de Créditos",
      description: "Capitalización de créditos y acreedores",
      backendModules: [
        "CREDITORS",
        "CREDIT_CAPITALIZATION",
        "AGREEMENT_CAPITALIZATION_VOTING",
      ],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: false,
      },
    },
    {
      key: "directores",
      displayName: "Directores",
      description: "Designación y remoción de directores",
      backendModules: [
        "DIRECTORS_QUANTITY_VOTING",
        "DIRECTORS_APPOINTMENT_REMOVAL",
        "DIRECTORS_REMOVAL_VOTING",
        "DIRECTORS_APPOINTMENT_VOTING",
      ],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: false,
      },
    },
    {
      key: "gerentes",
      displayName: "Gerentes y Apoderados",
      description: "Designación y remoción de gerentes",
      backendModules: [
        "MANAGERS_APPOINTMENT_REMOVAL",
        "POWER_GRANTING",
        "MANAGERS_REMOVAL_VOTING",
        "MANAGERS_APPOINTMENT_VOTING",
      ],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: false,
      },
    },
    {
      key: "financieros",
      displayName: "Estados Financieros",
      description: "Estados financieros y reparto de dividendos",
      backendModules: [
        "FINANCIAL_STATEMENTS",
        "FINANCIAL_STATEMENTS_VOTING",
        "DIVIDENDS_DISTRIBUTION",
        "DIVIDENDS_DISTRIBUTION_VOTING",
      ],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: false,
      },
    },
  ],

  REPOSITORIO_AI: [
    {
      key: "archivos",
      displayName: "Archivos",
      description: "Gestión de archivos del repositorio",
      backendModules: ["ARCHIVES"],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        file: true,
      },
    },
  ],

  SUNAT: [
    {
      key: "sunat",
      displayName: "SUNAT",
      description: "Integración con SUNAT",
      backendModules: ["SUNAT"],
      defaultActions: {
        view: true,
        create: true,
        update: false,
        delete: false,
        file: false,
      },
    },
  ],

  ARCHIVES: [
    {
      key: "archivos",
      displayName: "Archivos",
      description: "Archivos generales",
      backendModules: ["ARCHIVES"],
      defaultActions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        file: true,
      },
    },
  ],
};

/**
 * Obtiene las definiciones de sub-módulos para un área específica
 * @param area - Área del sistema (REGISTROS, OPERACIONES, etc.)
 * @returns Array de definiciones de sub-módulos para esa área
 */
export function getSubmodulesForArea(area: string): SubModuleDefinition[] {
  return SUBMODULE_DEFINITIONS[area] || [];
}

/**
 * Obtiene una definición de sub-módulo por su clave
 * @param area - Área del sistema
 * @param key - Clave del sub-módulo
 * @returns Definición del sub-módulo o undefined si no existe
 */
export function getSubmoduleByKey(
  area: string,
  key: string
): SubModuleDefinition | undefined {
  const definitions = getSubmodulesForArea(area);
  return definitions.find((def) => def.key === key);
}

/**
 * Crea una configuración de sub-módulo desde una definición
 * @param definition - Definición del sub-módulo
 * @param enabled - Si el sub-módulo está habilitado por defecto
 * @returns Configuración del sub-módulo
 */
export function createSubmoduleConfigFromDefinition(
  definition: SubModuleDefinition,
  enabled: boolean = true
): SubModuleConfig {
  return {
    key: definition.key,
    displayName: definition.displayName,
    description: definition.description,
    enabled,
    backendModules: [...definition.backendModules],
    actions: { ...definition.defaultActions },
  };
}

