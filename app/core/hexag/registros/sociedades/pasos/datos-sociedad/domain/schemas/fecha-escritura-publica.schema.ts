import { optionalDateSchema } from "./helpers";

export const fechaEscrituraPublicaSchema = optionalDateSchema(
  "La fecha de escritura pública debe tener el formato YYYY-MM-DD"
);

