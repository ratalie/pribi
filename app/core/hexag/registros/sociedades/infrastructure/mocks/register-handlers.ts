import { sociedadesHandlers } from "./handlers/sociedades.handlers";
import { datosSociedadHandlers } from "../../pasos/datos-sociedad/infrastructure/mocks/handlers/datos-sociedad.handlers";

export const registrosHandlers = [...sociedadesHandlers, ...datosSociedadHandlers];

