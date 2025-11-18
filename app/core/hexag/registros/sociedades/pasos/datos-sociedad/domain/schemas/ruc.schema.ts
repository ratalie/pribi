import { z } from "zod";

export const rucSchema = z
  .string()
  .nonempty("El RUC es obligatorio")
  .length(11, "El RUC debe tener exactamente 11 dígitos")
  .regex(/^20\d{9}$/, "El RUC debe empezar con 20");
