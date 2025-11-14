import { optionalStringSchema } from "./helpers";

export const partidaRegistralSchema = optionalStringSchema(
  "La partida registral debe tener al menos 2 caracteres"
);
