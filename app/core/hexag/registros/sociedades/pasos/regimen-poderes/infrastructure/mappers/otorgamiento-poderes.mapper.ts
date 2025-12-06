import type {
  FirmantesDTO,
  LimiteMonetarioDTO,
  TipoFirmaDTO,
} from "../../application/dtos/otorgamiento-poderes/base.dto";
import type {
  CreateOtorgamientoPoderDTO,
  CreateReglaMonetariaDTO,
} from "../../application/dtos/otorgamiento-poderes/create.dto";
import type { OtorgamientoPoderResponseDTO } from "../../application/dtos/otorgamiento-poderes/response.dto";
import type { UpdateOtorgamientoPoderDTO } from "../../application/dtos/otorgamiento-poderes/update.dto";
import { TipoFirmaEnum } from "../../application/enums/tipo-firma.enum";
import { TipoLimiteEnum } from "../../application/enums/tipo-limite.enum";
import { TipoMonedaEnum } from "../../application/enums/tipo-moneda.enum";
import type {
  CreateOtorgamientoPoderPayload,
  CreateReglaMonetariaPayload,
} from "../../domain/entities/create-otorgamiento-poder.payload";
import type { Facultad, Firmante } from "../../domain/entities/otorgamiento-poderes.entity";
import type {
  ActualizarReglaMonetariaPayload,
  UpdateOtorgamientoPoderPayload,
} from "../../domain/entities/update-otorgamiento-poder.payload";

import { EntityCoinUIEnum } from "../../domain/enums/EntityCoinUIEnum";
import { TiempoVigenciaUIEnum } from "../../domain/enums/TiempoVigenciaUIEnum";
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
        // Para update, solo mapear tipoFirma sin firmantes (se manejan en updateSigners)
        ...this.mapearTipoFirmaActualizar(regla),
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
   * Mapea TipoFirmasUIEnum a TipoFirmaDTO (con firmantes)
   * NOTA: No acepta ActualizarReglaMonetariaPayload porque ese tipo no incluye firmantes.
   * Para actualizar, usar mapearTipoFirmaActualizar.
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

    // TypeScript sabe que aquí regla.tipoFirma es FIRMA_CONJUNTA
    // y que el tipo incluye firmantes (CreateReglaMonetariaPayload o el objeto con firmantes)
    const reglaConFirmantes = regla as {
      tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA;
      firmantes?: Firmante[];
    };

    return {
      tipoFirma: TipoFirmaEnum.FIRMA_CONJUNTA,
      firmantes: (reglaConFirmantes.firmantes ?? []).map((firmante: Firmante) => ({
        id: firmante.id,
        claseApoderadoId: firmante.grupo, // grupo → claseApoderadoId
        cantidadMiembros: firmante.cantidad, // cantidad → cantidadMiembros
      })),
    };
  }

  /**
   * Mapea TipoFirmasUIEnum a TipoFirmaActualizarDTO (sin firmantes, para acción update)
   */
  private static mapearTipoFirmaActualizar(regla: ActualizarReglaMonetariaPayload): {
    tipoFirma: TipoFirmaEnum;
  } {
    if (regla.tipoFirma === TipoFirmasUIEnum.SOLA_FIRMA) {
      return {
        tipoFirma: TipoFirmaEnum.SOLA_FIRMA,
      };
    }

    // Para FIRMA_CONJUNTA en update, solo retornar tipoFirma sin firmantes
    return {
      tipoFirma: TipoFirmaEnum.FIRMA_CONJUNTA,
    };
  }

  /**
   * Convierte un ResponseDTO a Facultad (entidad de dominio)
   */
  static deResponseDTOAFacultad(response: OtorgamientoPoderResponseDTO): Facultad {
    const baseFacultad = {
      id: response.id,
      tipoFacultadId: response.poder.id,
      tipoFacultadNombre: response.poder.name,
    };

    // Construir tipo de vigencia
    const tieneFechaFin = !!response.fechaFin;
    const tipoVigencia = tieneFechaFin
      ? {
          esIrrevocable: response.esIrrevocable as true,
          vigencia: TiempoVigenciaUIEnum.DETERMIADO,
          fecha_inicio: this.formatearFecha(response.fechaInicio),
          fecha_fin: this.formatearFecha(response.fechaFin!),
        }
      : {
          esIrrevocable: response.esIrrevocable as false,
          vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
        };

    // Si no tiene reglas, retornar sin reglas
    if (!response.tieneReglasFirma || response.reglasMonetarias.length === 0) {
      return {
        ...baseFacultad,
        ...tipoVigencia,
        reglasYLimites: false,
      } as Facultad;
    }

    // Obtener la primera regla monetaria para el tipoMoneda (todas deberían tener el mismo)
    const primeraRegla = response.reglasMonetarias[0];
    if (!primeraRegla) {
      // Si no hay reglas, retornar sin reglas
      return {
        ...baseFacultad,
        ...tipoVigencia,
        reglasYLimites: false,
      } as Facultad;
    }

    const tipoMoneda = this.mapearTipoMonedaDesdeDTO(primeraRegla.tipoMoneda);

    // Convertir todas las reglas monetarias a LimiteMonetario
    const limiteMonetario = response.reglasMonetarias.map((regla) =>
      this.deReglaMonetariaResponseADominio(regla)
    );

    return {
      ...baseFacultad,
      ...tipoVigencia,
      reglasYLimites: true,
      tipoMoneda,
      limiteMonetario,
    } as Facultad;
  }

  /**
   * Convierte una regla monetaria de ResponseDTO a LimiteMonetario (Domain)
   */
  private static deReglaMonetariaResponseADominio(
    regla: OtorgamientoPoderResponseDTO["reglasMonetarias"][number]
  ): Extract<Facultad, { reglasYLimites: true }>["limiteMonetario"][number] {
    type LimiteMonetarioType = Extract<
      Facultad,
      { reglasYLimites: true }
    >["limiteMonetario"][number];
    const base: Omit<LimiteMonetarioType, "tipoFirma"> = {
      id: regla.id,
      desde: regla.montoDesde,
      tipoMonto:
        regla.tipoLimite === TipoLimiteEnum.MONTO
          ? TipoMontoUIEnum.MONTO
          : TipoMontoUIEnum.SIN_LIMITE,
      hasta: regla.montoHasta ?? 0,
    };

    if (regla.tipoFirma === TipoFirmaEnum.SOLA_FIRMA) {
      return {
        ...base,
        tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
      };
    }

    return {
      ...base,
      tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
      firmantes: regla.firmantes.map((signer) => ({
        id: signer.id,
        cantidad: signer.cantidadMiembros,
        grupo: signer.claseApoderado.name, // name de la clase → grupo
      })),
    };
  }

  /**
   * Mapea TipoMonedaEnum (Application) a EntityCoinUIEnum (Domain)
   */
  private static mapearTipoMonedaDesdeDTO(moneda: TipoMonedaEnum): EntityCoinUIEnum {
    switch (moneda) {
      case TipoMonedaEnum.PEN:
        return EntityCoinUIEnum.SOLES;
      case TipoMonedaEnum.USD:
        return EntityCoinUIEnum.DOLARES;
      default:
        throw new Error(`Tipo de moneda no soportado: ${moneda}`);
    }
  }

  /**
   * Formatea una fecha Date o string ISO a string YYYY-MM-DD
   */
  private static formatearFecha(fecha: Date | string): string {
    if (typeof fecha === "string") {
      // Si es string ISO, extraer solo la parte de fecha (YYYY-MM-DD)
      const dateObj = new Date(fecha);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
