import { sociedadesHandlers } from "./handlers/sociedades.handlers";
import { datosSociedadHandlers } from "../../pasos/datos-sociedad/infrastructure/mocks/handlers/datos-sociedad.handlers";
import { quorumHandlers } from "../../pasos/quorum-mayorias/infrastructure/mocks/handlers/quorum.handlers";

export const registrosHandlers = [
  ...sociedadesHandlers,
  ...datosSociedadHandlers,
  ...quorumHandlers,
];

