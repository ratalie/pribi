import { societyRegisterNavigation } from "./society-register-navigation";
import { juntaNavigation } from "./junta-navigation";

export interface ProgressNavigationContext {
  societyId?: string;
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
    match: (path: string) => path.includes("/operaciones/junta-accionistas"),
    getSteps: (context) =>
      juntaNavigation({
        base: "operaciones",
        juntaId: context.juntaId,
        flow: context.flow,
      }),
  },

  /*agregar mas rutas aqui */
];
