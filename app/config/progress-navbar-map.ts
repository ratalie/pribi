import { societyRegisterNavigation } from "./society-register-navigation";
import { juntaNavigation } from "./junta-navigation";

export interface ProgressNavigationContext {
  societyId?: string | number;
  flowId?: string | number;
  /** @deprecated Usar flowId en su lugar */
  juntaId?: string;
  flow?: "crear" | "editar";
}

type RouteRule = {
  match: (path: string) => boolean;
  getSteps: (
    context: ProgressNavigationContext
  ) =>
    | ReturnType<typeof societyRegisterNavigation>
    | ReturnType<typeof juntaNavigation>;
};

export const routeMap: RouteRule[] = [
  {
    match: (path: string) => path.includes("/registro-societario/sociedades"),
    getSteps: (context) =>
      societyRegisterNavigation({
        base: "registro-societario",
        societyId: context.societyId,
        flow: context.flow,
      }),
  },
  {
    match: (path: string) => path.includes("/registros/sociedades"),
    getSteps: (context) =>
      societyRegisterNavigation({
        base: "registros",
        societyId: context.societyId,
        flow: context.flow,
      }),
  },
  {
    match: (path: string) => path.includes("/operaciones/sociedades") && path.includes("/junta-accionistas"),
    getSteps: (context) =>
      juntaNavigation({
        base: "operaciones",
        societyId: context.societyId,
        flowId: context.flowId || context.juntaId, // Compatibilidad hacia atrás
        flow: context.flow,
      }),
  },

  /*agregar mas rutas aqui */
];
