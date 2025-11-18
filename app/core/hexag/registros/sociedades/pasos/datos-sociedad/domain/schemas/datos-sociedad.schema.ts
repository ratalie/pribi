import { z } from "zod";

import { actividadExteriorSchema } from "./actividad-exterior.schema";
import { departamentoSchema } from "./departamento.schema";
import { direccionSchema } from "./direccion.schema";
import { distritoSchema } from "./distrito.schema";
import { fechaEscrituraPublicaSchema } from "./fecha-escritura-publica.schema";
import { fechaInscripcionRucSchema } from "./fecha-inscripcion-ruc.schema";
import { fechaRegistrosPublicosSchema } from "./fecha-registros-publicos.schema";
import { nombreComercialSchema } from "./nombre-comercial.schema";
import { oficinaRegistralSchema } from "./oficina-registral.schema";
import { partidaRegistralSchema } from "./partida-registral.schema";
import { provinciaSchema } from "./provincia.schema";
import { razonSocialSchema } from "./razon-social.schema";
import { rucSchema } from "./ruc.schema";
import { tipoSociedadSchema } from "./tipo-sociedad.schema";

export const datosSociedadSchema = z.object({
  ruc: rucSchema,
  tipoSociedad: tipoSociedadSchema,
  razonSocial: razonSocialSchema,
  nombreComercial: nombreComercialSchema,
  direccion: direccionSchema,
  distrito: distritoSchema,
  provincia: provinciaSchema,
  departamento: departamentoSchema,
  fechaInscripcionRuc: fechaInscripcionRucSchema,
  actividadExterior: actividadExteriorSchema,
  fechaEscrituraPublica: fechaEscrituraPublicaSchema,
  fechaRegistrosPublicos: fechaRegistrosPublicosSchema,
  oficinaRegistral: oficinaRegistralSchema,
  partidaRegistral: partidaRegistralSchema,
});
