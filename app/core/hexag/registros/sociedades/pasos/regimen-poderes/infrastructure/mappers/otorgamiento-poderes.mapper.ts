import type {
  FirmantesDTO,
  LimiteMonetarioDTO,
  TipoFirmaDTO,
} from "../../application/dtos/otorgamiento-poderes/base.dto";
import type {
  CreateOtorgamientoPoderDTO,
  CreateReglaMonetariaDTO,
} from "../../application/dtos/otorgamiento-poderes/create.dto";
import type { UpdateOtorgamientoPoderDTO } from "../../application/dtos/otorgamiento-poderes/update.dto";
import { TipoFirmaEnum } from "../../application/enums/tipo-firma.enum";
import { TipoLimiteEnum } from "../../application/enums/tipo-limite.enum";
import { TipoMonedaEnum } from "../../application/enums/tipo-moneda.enum";
import type {
  CreateOtorgamientoPoderPayload,
  CreateReglaMonetariaPayload,
} from "../../domain/entities/create-otorgamiento-poder.payload";
import type { Firmante } from "../../domain/entities/otorgamiento-poderes.entity";
import type { UpdateOtorgamientoPoderPayload } from "../../domain/entities/update-otorgamiento-poder.payload";
import { EntityCoinUIEnum } from "../../domain/enums/EntityCoinUIEnum";
import { TipoFirmasUIEnum } from "../../domain/enums/TipoFirmasUIEnum";
import { TipoMontoUIEnum } from "../../domain/enums/TipoMontoUIEnum";

export class OtorgamientoPoderesMapper {
  /**
   * Convierte un Payload de Create a DTO para el backend
   */
  static dePayloadACreateDTO(
    payload: CreateOtorgamientoPoderPayload
  ): CreateOtorgamientoPoderDTO {
    if (payload.tieneReglasFirma) {
      return {
        id: payload.id,
        poderId: payload.poderId,
        claseApoderadoId: payload.claseApoderadoId,
        esIrrevocable: payload.esIrrevocable,
        fechaInicio: payload.fechaInicio,
        fechaFin: payload.fechaFin,
        tieneReglasFirma: true,
        reglasMonetarias: payload.reglasMonetarias.map((regla) =>
          this.deReglaMonetariaPayloadADTO(regla)
        ),
      };
    }

    return {
      id: payload.id,
      poderId: payload.poderId,
      claseApoderadoId: payload.claseApoderadoId,
      esIrrevocable: payload.esIrrevocable,
      fechaInicio: payload.fechaInicio,
      fechaFin: payload.fechaFin,
      tieneReglasFirma: false,
    };
  }

  /**
   * Convierte un Payload de Update a DTO para el backend
   */
  static dePayloadAUpdateDTO(
    payload: UpdateOtorgamientoPoderPayload
  ): UpdateOtorgamientoPoderDTO {
    if (payload.tieneReglasFirma) {
      return {
        id: payload.id,
        esIrrevocable: payload.esIrrevocable,
        fechaInicio: payload.fechaInicio,
        fechaFin: payload.fechaFin,
        tieneReglasFirma: true,
        reglasMonetarias: payload.reglasMonetarias.map((regla) =>
          this.deUpdateReglaMonetariaPayloadADTO(regla)
        ),
      };
    }

    return {
      id: payload.id,
      esIrrevocable: payload.esIrrevocable,
      fechaInicio: payload.fechaInicio,
      fechaFin: payload.fechaFin,
      tieneReglasFirma: false,
    };
  }

  /**
   * Convierte una regla monetaria de Create Payload a DTO
   */
  private static deReglaMonetariaPayloadADTO(
    regla: CreateReglaMonetariaPayload
  ): CreateReglaMonetariaDTO {
    return {
      id: regla.id,
      tipoMoneda: this.mapearTipoMoneda(regla.tipoMoneda),
      montoDesde: regla.montoDesde,
      ...this.mapearLimiteMonetario(regla),
      ...this.mapearTipoFirma(regla),
    };
  }

  /**
   * Convierte una regla monetaria de Update Payload a DTO (con acciones)
   */
  private static deUpdateReglaMonetariaPayloadADTO(
    regla: Extract<
      UpdateOtorgamientoPoderPayload,
      { tieneReglasFirma: true }
    >["reglasMonetarias"][number]
  ): Extract<
    UpdateOtorgamientoPoderDTO,
    { tieneReglasFirma: true }
  >["reglasMonetarias"][number] {
    if (regla.accion === "add") {
      return {
        accion: "add",
        id: regla.id,
        tipoMoneda: this.mapearTipoMoneda(regla.tipoMoneda),
        montoDesde: regla.montoDesde,
        ...this.mapearLimiteMonetario(regla),
        ...this.mapearTipoFirma(regla),
      };
    }

    if (regla.accion === "update") {
      return {
        accion: "update",
        id: regla.id,
        tipoMoneda: this.mapearTipoMoneda(regla.tipoMoneda),
        montoDesde: regla.montoDesde,
        ...this.mapearLimiteMonetario(regla),
      };
    }

    if (regla.accion === "remove") {
      return {
        accion: "remove",
        reglaId: regla.reglaId,
      };
    }

    // accion === "updateSigners"
    return {
      accion: "updateSigners",
      reglaId: regla.reglaId,
      firmantes: regla.firmantes.map((firmante) => this.mapearFirmanteAccion(firmante)),
    };
  }

  /**
   * Mapea un Firmante con acción a FirmantesDTO con acción
   */
  private static mapearFirmanteAccion(
    firmante:
      | (Firmante & { accion: "add" | "update" })
      | { accion: "remove"; signerId: string }
  ): (FirmantesDTO & { accion: "add" | "update" }) | { accion: "remove"; signerId: string } {
    if (firmante.accion === "remove") {
      return {
        accion: "remove",
        signerId: firmante.signerId,
      };
    }

    return {
      accion: firmante.accion,
      id: firmante.id,
      claseApoderadoId: firmante.grupo, // grupo → claseApoderadoId
      cantidadMiembros: firmante.cantidad, // cantidad → cantidadMiembros
    };
  }

  /**
   * Mapea EntityCoinUIEnum a TipoMonedaEnum
   */
  private static mapearTipoMoneda(moneda: EntityCoinUIEnum): TipoMonedaEnum {
    switch (moneda) {
      case EntityCoinUIEnum.SOLES:
        return TipoMonedaEnum.PEN;
      case EntityCoinUIEnum.DOLARES:
        return TipoMonedaEnum.USD;
      default:
        throw new Error(`Tipo de moneda no soportado: ${moneda}`);
    }
  }

  /**
   * Mapea TipoMontoUIEnum a TipoLimiteEnum y construye LimiteMonetarioDTO
   */
  private static mapearLimiteMonetario(
    regla: CreateReglaMonetariaPayload | { tipoLimite: TipoMontoUIEnum; montoHasta?: number }
  ): LimiteMonetarioDTO {
    if (regla.tipoLimite === TipoMontoUIEnum.MONTO) {
      return {
        tipoLimite: TipoLimiteEnum.MONTO,
        montoHasta: regla.montoHasta ?? 0,
      };
    }

    return {
      tipoLimite: TipoLimiteEnum.SIN_LIMITE,
    };
  }

  /**
   * Mapea TipoFirmasUIEnum a TipoFirmaDTO
   */
  private static mapearTipoFirma(
    regla:
      | CreateReglaMonetariaPayload
      | { tipoFirma: TipoFirmasUIEnum; firmantes?: Firmante[] }
  ): TipoFirmaDTO {
    if (regla.tipoFirma === TipoFirmasUIEnum.SOLA_FIRMA) {
      return {
        tipoFirma: TipoFirmaEnum.SOLA_FIRMA,
      };
    }

    return {
      tipoFirma: TipoFirmaEnum.FIRMA_CONJUNTA,
      firmantes: (regla.firmantes ?? []).map((firmante) => ({
        id: firmante.id,
        claseApoderadoId: firmante.grupo, // grupo → claseApoderadoId
        cantidadMiembros: firmante.cantidad, // cantidad → cantidadMiembros
      })),
    };
  }
}
