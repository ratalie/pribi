import { v4 as uuidv4 } from "uuid";
import type { TipoFacultad } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";

export const mapperTiposFacultadesAEntidad = (
  nombreFacultad: string,
  facultadId?: string
): TipoFacultad => {
  return {
    id: facultadId ?? uuidv4(),
    tipoFacultades: nombreFacultad,
  };
};
