import { optionalDateSchema } from "./helpers";

export const fechaInscripcionRucSchema = optionalDateSchema(
  "La fecha de inscripción de RUC debe tener el formato YYYY-MM-DD"
);
