import { sociedadesHandlers } from "./handlers/sociedades.handlers";
import { datosSociedadHandlers } from "../../pasos/datos-sociedad/infrastructure/mocks/handlers/datos-sociedad.handlers";
import { quorumHandlers } from "../../pasos/quorum-mayorias/infrastructure/mocks/handlers/quorum.handlers";
import { accionistasHandlers } from "../../pasos/accionistas/infrastructure/mocks/handlers/accionistas.handlers";
import { accionesHandlers } from "../../pasos/acciones/infrastructure/mocks/handlers/acciones.handlers";
import { asignacionAccionesHandlers } from "../../pasos/asignacion-acciones/infrastructure/mocks/handlers/asignacion-acciones.handlers";
import { directorioHandlers } from "../../pasos/directorio/infrastructure/mocks/handlers/directorio.handlers";
import { directoresHandlers } from "../../pasos/directorio/infrastructure/mocks/handlers/directores.handlers";
import { apoderadosHandlers } from "../../pasos/apoderados/infrastructure/mocks/handlers/apoderados.handlers";

export const registrosHandlers = [
  ...sociedadesHandlers,
  ...datosSociedadHandlers,
  ...quorumHandlers,
  ...accionistasHandlers,
  ...accionesHandlers,
  ...asignacionAccionesHandlers,
  ...directorioHandlers,
  ...directoresHandlers,
  ...apoderadosHandlers,
];

