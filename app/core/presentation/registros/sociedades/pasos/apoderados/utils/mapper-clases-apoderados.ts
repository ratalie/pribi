import { v4 as uuidv4 } from "uuid";
import type { ClaseApoderado } from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";

export const mapperNombreAEntidad = (
  nombre: string,
  id: string | null = null
): ClaseApoderado => {
  return {
    id: id ?? uuidv4(),
    nombre,
  };
};
