/**
 * Utilidades para navegación en el flujo de Juntas
 */

import {
  getParentSectionForAnchor,
  getSectionRoutesForSubStep,
} from "~/config/juntas/navigation-routes.config";
import { getBaseSectionsForSubStep } from "~/config/juntas/sections.config";
import { buildBasePath } from "./route-detection.utils";

/**
 * Tipo para información de navegación
 */
export type NavigationInfo = {
  type: "route" | "anchor";
  target: string;
};

/**
 * Obtiene la información de navegación para una sección
 */
export function getSectionNavigation(
  sectionId: string,
  subStepId: string | undefined,
  societyId?: string | null,
  flowId?: string | null
): NavigationInfo | null {
  if (!subStepId) return null;

  const basePath = buildBasePath(societyId, flowId);
  const sectionRoutes = getSectionRoutesForSubStep(subStepId, basePath);

  if (sectionRoutes) {
    const route = sectionRoutes[sectionId];
    if (route) {
      // Verificar si es una ancla especial (utilidades-montos es una ruta pero también tiene anclas dentro)
      if (sectionId === "utilidades-montos") {
        return { type: "route", target: route };
      }
      return { type: "route", target: route };
    }

    // Si es una ancla (ancla-1, ancla-2, ancla-3), retornar como anchor
    if (sectionId.startsWith("ancla-")) {
      return { type: "anchor", target: sectionId };
    }

    // Verificar si es una sub-sección de utilidades-montos (anclas dentro de la página)
    const utilidadesMontosAnchors = [
      "valores-preliminares",
      "calculo-utilidad-antes-reserva",
      "calculo-reserva-legal",
      "valores-utilidad-distribuible",
    ];
    if (utilidadesMontosAnchors.includes(sectionId)) {
      return { type: "anchor", target: sectionId };
    }
  }

  return null;
}

/**
 * Encuentra la sección padre de una ancla
 */
export function findParentSectionForAnchor(
  anchorId: string,
  subStepId: string | undefined,
  societyId?: string | null,
  flowId?: string | null
): { parentId: string; parentRoute: string } | null {
  if (!subStepId) return null;

  const basePath = buildBasePath(societyId, flowId);
  const sections = getBaseSectionsForSubStep(subStepId);

  return getParentSectionForAnchor(anchorId, subStepId, basePath, sections);
}

/**
 * Detecta la sección actual basándose en la ruta y hash
 */
export function detectCurrentSection(
  path: string,
  hash: string,
  subStepId: string | undefined
): string {
  // Si hay hash, es probablemente un ancla
  if (hash) {
    return hash;
  }

  if (subStepId === "aporte-dinerarios") {
    if (path.includes("/aporte-dinerario/aportantes")) return "seleccion-aportantes";
    if (path.includes("/aporte-dinerario/aportes")) return "aportes-dinerarios";
    if (path.includes("/aporte-dinerario/votacion")) return "votacion";
    if (path.includes("/aporte-dinerario/resumen")) return "resumen";
    if (path.includes("/aporte-dinerario") && !path.includes("/aporte-dinerario/")) {
      return "aporte-dinerario";
    }
  }

  if (subStepId === "aplicacion-resultados") {
    if (path.includes("/aplicacion-resultados/utilidades-montos")) {
      // Si hay hash, es una ancla dentro de utilidades-montos
      if (hash) return hash;
      return "utilidades-montos";
    }
    if (path.includes("/aplicacion-resultados/votacion")) return "votacion";
    if (path.includes("/aplicacion-resultados/resumen")) return "resumen";
    if (path.includes("/aplicacion-resultados") && !path.includes("/aplicacion-resultados/")) {
      return "aplicacion-resultados";
    }
  }

  if (subStepId === "pronunciamiento-gestion") {
    if (path.includes("/pronunciamiento-gestion/pronunciamiento")) return "pronunciamiento";
    if (path.includes("/pronunciamiento-gestion/votacion")) return "votacion";
    if (path.includes("/pronunciamiento-gestion/resumen")) return "resumen";
    if (
      path.includes("/pronunciamiento-gestion") &&
      !path.includes("/pronunciamiento-gestion/")
    ) {
      return "pronunciamiento-gestion";
    }
  }

  if (subStepId === "delegacion-auditores") {
    if (path.includes("/nombramiento-auditores/nombramiento")) return "nombramiento";
    if (path.includes("/nombramiento-auditores/votacion")) return "votacion";
    if (path.includes("/nombramiento-auditores/resumen")) return "resumen";
    if (
      path.includes("/nombramiento-auditores") &&
      !path.includes("/nombramiento-auditores/")
    ) {
      return "nombramiento-auditores";
    }
  }

  if (subStepId === "nombramiento-directores") {
    if (path.includes("/nombramiento-directores/votacion-cantidad"))
      return "votacion-cantidad";
    if (path.includes("/nombramiento-directores/cantidad")) return "cantidad";
    if (path.includes("/nombramiento-directores/presidente")) return "presidente";
    if (path.includes("/nombramiento-directores/nombramiento")) return "nombramiento";
    if (path.includes("/nombramiento-directores/votacion")) return "votacion";
    if (path.includes("/nombramiento-directores/resumen")) return "resumen";
    if (
      path.includes("/nombramiento-directores") &&
      !path.includes("/nombramiento-directores/")
    ) {
      return "nombramiento-directores";
    }
  }

  if (subStepId === "nombramiento-directorio") {
    if (path.includes("/nombramiento-directorio/cantidad")) return "cantidad";
    if (path.includes("/nombramiento-directorio/nombramiento")) return "nombramiento";
    if (path.includes("/nombramiento-directorio/directores")) return "directores";
    if (path.includes("/nombramiento-directorio/votacion")) return "votacion";
    if (path.includes("/nombramiento-directorio/presidente")) return "presidente";
    if (path.includes("/nombramiento-directorio/resumen")) return "resumen";
    if (
      path.includes("/nombramiento-directorio") &&
      !path.includes("/nombramiento-directorio/")
    ) {
      return "nombramiento-directorio";
    }
  }

  // Remociones
  if (subStepId === "remocion-gerente") {
    if (path.includes("/remocion-gerente/remocion")) return "remocion";
    if (path.includes("/remocion-gerente/votacion")) return "votacion";
    if (path.includes("/remocion-gerente/resumen")) return "resumen";
    if (path.includes("/remocion-gerente") && !path.includes("/remocion-gerente/")) {
      return "remocion-gerente";
    }
  }

  if (subStepId === "remocion-apoderados") {
    if (path.includes("/remocion-apoderados/remocion")) return "remocion";
    if (path.includes("/remocion-apoderados/votacion")) return "votacion";
    if (path.includes("/remocion-apoderados/resumen")) return "resumen";
    if (path.includes("/remocion-apoderados") && !path.includes("/remocion-apoderados/")) {
      return "remocion-apoderados";
    }
  }

  if (subStepId === "remocion-directores") {
    if (path.includes("/remocion-directores/remocion")) return "remocion";
    if (path.includes("/remocion-directores/votacion")) return "votacion";
    if (path.includes("/remocion-directores/resumen")) return "resumen";
    if (path.includes("/remocion-directores") && !path.includes("/remocion-directores/")) {
      return "remocion-directores";
    }
  }

  // Nombramientos
  if (subStepId === "nombramiento-gerente") {
    if (path.includes("/nombramiento-gerente/nombramiento")) return "nombramiento";
    if (path.includes("/nombramiento-gerente/otorgamiento")) return "otorgamiento";
    if (path.includes("/nombramiento-gerente/votacion")) return "votacion";
    if (path.includes("/nombramiento-gerente/resumen")) return "resumen";
    if (path.includes("/nombramiento-gerente") && !path.includes("/nombramiento-gerente/")) {
      return "nombramiento-gerente";
    }
  }

  if (subStepId === "nombramiento-apoderados") {
    if (path.includes("/nombramiento-apoderados/nombramiento")) return "nombramiento";
    if (path.includes("/nombramiento-apoderados/otorgamiento-poderes"))
      return "otorgamiento-poderes";
    if (path.includes("/nombramiento-apoderados/votacion")) return "votacion";
    if (path.includes("/nombramiento-apoderados/resumen")) return "resumen";
    if (
      path.includes("/nombramiento-apoderados") &&
      !path.includes("/nombramiento-apoderados/")
    ) {
      return "nombramiento-apoderados";
    }
  }

  if (subStepId === "nombramiento-directores") {
    if (path.includes("/nombramiento-directores/nombramiento")) return "nombramiento";
    if (path.includes("/nombramiento-directores/cantidad")) return "cantidad";
    if (path.includes("/nombramiento-directores/votacion")) return "votacion";
    if (path.includes("/nombramiento-directores/resumen")) return "resumen";
    if (
      path.includes("/nombramiento-directores") &&
      !path.includes("/nombramiento-directores/")
    ) {
      return "nombramiento-directores";
    }
  }

  if (subStepId === "nombramiento-nuevo-directorio") {
    if (path.includes("/nombramiento-directorio/cantidad")) return "cantidad";
    if (path.includes("/nombramiento-directorio/nombramiento")) return "nombramiento";
    if (path.includes("/nombramiento-directorio/votacion")) return "votacion";
    if (path.includes("/nombramiento-directorio/resumen")) return "resumen";
    if (
      path.includes("/nombramiento-directorio") &&
      !path.includes("/nombramiento-directorio/")
    ) {
      return "nombramiento-directorio";
    }
  }

  if (subStepId === "capitalizacion-creditos") {
    if (path.includes("/capitalizacion-creditos/acreedores")) return "acreedores";
    if (path.includes("/capitalizacion-creditos/creditos")) return "creditos";
    if (path.includes("/capitalizacion-creditos/votacion")) return "votacion";
    if (path.includes("/capitalizacion-creditos/resumen")) return "resumen";
    if (
      path.includes("/capitalizacion-creditos") &&
      !path.includes("/capitalizacion-creditos/")
    ) {
      return "capitalizacion-creditos";
    }
  }

  return "";
}
