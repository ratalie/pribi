// Casos de uso del paso "Acuerdos societarios".

export type {
  AcuerdoSocietarioDataDTO,
  AcuerdoSocietarioResponseDTO,
  ArchivoMetadataDTO,
} from "./dtos/acuerdo-societario-response.dto";
export type { AcuerdoSocietarioDTO } from "./dtos/acuerdo-societario.dto";
export { CreateAcuerdosSocietariosUseCase } from "./use-cases/create-acuerdos-societarios.use-case";
export { GetAcuerdosSocietariosUseCase } from "./use-cases/get-acuerdos-societarios.use-case";
export { UpdateAcuerdosSocietariosUseCase } from "./use-cases/update-acuerdos-societarios.use-case";
