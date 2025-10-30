import { societyRegisterNavigation } from "./society-register-navigation";

export const routeMap = [
  {
    match: (path: string) => path.includes("/registro-societario/sociedades"),
    getSteps: (mode: string) => societyRegisterNavigation(mode),
  },

  /*agregar mas rutas aqui */
];
