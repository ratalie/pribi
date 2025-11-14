import { optionalDateSchema } from "./helpers";

export const fechaRegistrosPublicosSchema = optionalDateSchema(
  "La fecha de registros públicos debe tener el formato YYYY-MM-DD"
);
