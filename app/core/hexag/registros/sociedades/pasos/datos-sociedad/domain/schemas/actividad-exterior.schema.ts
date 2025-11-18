import { optionalStringSchema } from "./helpers";

export const actividadExteriorSchema = optionalStringSchema(
  "La actividad exterior debe tener al menos 2 caracteres"
);
