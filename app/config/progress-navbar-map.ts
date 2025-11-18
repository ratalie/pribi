import { societyRegisterNavigation } from "./society-register-navigation";

export interface ProgressNavigationContext {
  societyId?: string;
  flow?: "crear" | "editar";
}

type RouteRule = {
  match: (path: string) => boolean;
  getSteps: (context: ProgressNavigationContext) => ReturnType<typeof societyRegisterNavigation>;
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

  /*agregar mas rutas aqui */
];
