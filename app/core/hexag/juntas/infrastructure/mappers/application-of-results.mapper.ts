import type { ApplicationOfResults } from "../../domain/entities/application-of-results.entity";
import type { ApplicationOfResultsDTO } from "../../application/dtos/application-of-results.dto";

/**
 * Mapper: ApplicationOfResults
 * 
 * Convierte entre DTO (formato del backend) y Entity (formato del dominio)
 * 
 * En este caso, el DTO y la Entity tienen la misma estructura,
 * por lo que el mapper es una simple copia de campos
 */
export class ApplicationOfResultsMapper {
  /**
   * Convertir DTO a Entity
   */
  static toEntity(dto: ApplicationOfResultsDTO): ApplicationOfResults {
    return {
      capitalSocialPagadoInicial: dto.capitalSocialPagadoInicial,
      utilidadPerdidaAcumuladaInicial: dto.utilidadPerdidaAcumuladaInicial,
      resultadoEjercicioInicial: dto.resultadoEjercicioInicial,
      patrimonioNetoInicial: dto.patrimonioNetoInicial,
      diferenciaPatrimonioCapitalPagado: dto.diferenciaPatrimonioCapitalPagado,
      utilidadDistribuibleAntesReservaLegal: dto.utilidadDistribuibleAntesReservaLegal,
      capitalSocialSuscrito: dto.capitalSocialSuscrito,
      reservaLegalActual: dto.reservaLegalActual,
      porcentajeReservaLegal: dto.porcentajeReservaLegal,
      montoReservaLegal: dto.montoReservaLegal,
      nuevaReservaLegal: dto.nuevaReservaLegal,
      capitalSocialPagadoFinal: dto.capitalSocialPagadoFinal,
      utilidadPerdidaAcumuladaFinal: dto.utilidadPerdidaAcumuladaFinal,
      resultadoEjercicioFinal: dto.resultadoEjercicioFinal,
      patrimonioNetoFinal: dto.patrimonioNetoFinal,
      utilidadDistribuibleFinal: dto.utilidadDistribuibleFinal,
      utilidadNoDistribuida: dto.utilidadNoDistribuida,
      utilidadADistribuir: dto.utilidadADistribuir,
    };
  }

  /**
   * Convertir Entity a DTO
   */
  static toDTO(entity: ApplicationOfResults): ApplicationOfResultsDTO {
    return {
      capitalSocialPagadoInicial: entity.capitalSocialPagadoInicial,
      utilidadPerdidaAcumuladaInicial: entity.utilidadPerdidaAcumuladaInicial,
      resultadoEjercicioInicial: entity.resultadoEjercicioInicial,
      patrimonioNetoInicial: entity.patrimonioNetoInicial,
      diferenciaPatrimonioCapitalPagado: entity.diferenciaPatrimonioCapitalPagado,
      utilidadDistribuibleAntesReservaLegal: entity.utilidadDistribuibleAntesReservaLegal,
      capitalSocialSuscrito: entity.capitalSocialSuscrito,
      reservaLegalActual: entity.reservaLegalActual,
      porcentajeReservaLegal: entity.porcentajeReservaLegal,
      montoReservaLegal: entity.montoReservaLegal,
      nuevaReservaLegal: entity.nuevaReservaLegal,
      capitalSocialPagadoFinal: entity.capitalSocialPagadoFinal,
      utilidadPerdidaAcumuladaFinal: entity.utilidadPerdidaAcumuladaFinal,
      resultadoEjercicioFinal: entity.resultadoEjercicioFinal,
      patrimonioNetoFinal: entity.patrimonioNetoFinal,
      utilidadDistribuibleFinal: entity.utilidadDistribuibleFinal,
      utilidadNoDistribuida: entity.utilidadNoDistribuida,
      utilidadADistribuir: entity.utilidadADistribuir,
    };
  }
}


