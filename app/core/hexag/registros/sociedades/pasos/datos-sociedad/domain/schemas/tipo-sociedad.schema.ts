import { z } from "zod";

export const tipoSociedadSchema = z.string().nonempty("El tipo de sociedad es obligatorio");
