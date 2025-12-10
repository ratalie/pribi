import type {
  Accion,
  AcuerdoEspecial,
  Apoderado,
  AsignacionAccion,
  Director,
  Directorio,
  Persona,
  PersonaNatural,
  Quorum,
  RegimenPoderes,
  Shareholder,
  SnapshotCompleteDTO,
} from "../../application/dtos/snapshot-complete.dto";

/**
 * Mapper para transformar la respuesta del backend al DTO de Snapshot Completo
 *
 * El backend envía la estructura en inglés y con campos anidados,
 * este mapper los transforma al formato esperado por el frontend.
 */
export class SnapshotMapper {
  /**
   * Transforma la respuesta del backend a SnapshotCompleteDTO
   */
  static backendResponseToDTO(backendData: any): SnapshotCompleteDTO {
    return {
      // IDs del snapshot (se mantienen igual)
      shareholderId: backendData.shareholderId || "",
      nominalValueId: backendData.nominalValueId || "",
      shareAllocationId: backendData.shareAllocationId || "",
      meetingConfigId: backendData.meetingConfigId || "",
      directoryId: backendData.directoryId || undefined,
      attorneyRegistryId: backendData.attorneyRegistryId || undefined,
      powerRegimenId: backendData.powerRegimenId || undefined,
      quorumId: backendData.quorumId || undefined,
      specialAgreementsId: backendData.specialAgreementsId || undefined,

      // Valor nominal (se mantiene igual)
      nominalValue: Number(backendData.nominalValue) || 0,

      // Clases de acciones (transformar)
      shareClasses: this.mapShareClasses(backendData.shareClasses || []),

      // Accionistas (transformar persona)
      shareholders: this.mapShareholders(backendData.shareholders || []),

      // Asignaciones (transformar campos)
      shareAllocations: this.mapShareAllocations(backendData.shareAllocations || []),

      // Directorio (transformar campos)
      directory: backendData.directory ? this.mapDirectory(backendData.directory) : null,

      // Directores (transformar persona)
      directors: backendData.directors
        ? this.mapDirectors(backendData.directors || [])
        : undefined,

      // Apoderados (transformar persona)
      attorneys: backendData.attorneys
        ? this.mapAttorneys(backendData.attorneys || [])
        : undefined,

      // Poderes (transformar estructura)
      powers: backendData.powers ? this.mapPowers(backendData.powers) : null,

      // Quorums (transformar campos)
      quorums: backendData.quorums ? this.mapQuorums(backendData.quorums) : null,

      // Acuerdos especiales (se mantiene igual)
      specialAgreements: backendData.specialAgreements
        ? this.mapSpecialAgreements(backendData.specialAgreements)
        : null,

      // Datos de la sociedad (transformar campo)
      societyData: backendData.societyData
        ? this.mapSocietyData(backendData.societyData)
        : undefined,

      // Configuración de junta (se mantiene igual)
      meetingConfig: backendData.meetingConfig || {
        id: "",
        meetingType: "",
        isAnnualMandatory: false,
      },

      // Información del flujo (se mantiene igual)
      flowInfo: backendData.flowInfo || {
        flowStructureId: 0,
        currentStep: "",
        statusProgression: "",
      },
    };
  }

  /**
   * Transforma shareClasses del backend al formato del DTO
   */
  private static mapShareClasses(backendShareClasses: any[]): Accion[] {
    return backendShareClasses.map((sc) => ({
      id: sc.id || "",
      tipo: this.mapAccionType(sc.type || sc.tipo || "COMUN"),
      nombre: sc.className || sc.nombre || undefined,
      cantidadSuscrita: Number(sc.subscribedQuantity || sc.cantidadSuscrita || 0),
      redimible: Boolean(sc.isRedeemable ?? sc.redimible ?? false),
      conDerechoVoto: Boolean(sc.hasVotingRight ?? sc.conDerechoVoto ?? false),
      archivoOtrosDerechos: sc.otherRightFiles
        ? this.mapArchivosAccion(sc.otherRightFiles)
        : sc.archivoOtrosDerechos || undefined,
      archivoObligaciones: sc.additionalObligationFiles
        ? this.mapArchivosAccion(sc.additionalObligationFiles)
        : sc.archivoObligaciones || undefined,
      comentariosAdicionales: sc.additionalComments || sc.comentariosAdicionales || undefined,
    }));
  }

  /**
   * Mapea el tipo de acción del backend al formato del DTO
   */
  private static mapAccionType(backendType: string): "COMUN" | "CLASE" | "PREFERENTE_NO_VOTO" {
    const typeMap: Record<string, "COMUN" | "CLASE" | "PREFERENTE_NO_VOTO"> = {
      COMMON: "COMUN",
      COMUN: "COMUN",
      CLASS: "CLASE",
      CLASE: "CLASE",
      PREFERRED_NO_VOTE: "PREFERENTE_NO_VOTO",
      PREFERENTE_NO_VOTO: "PREFERENTE_NO_VOTO",
    };
    return typeMap[backendType.toUpperCase()] || "COMUN";
  }

  /**
   * Transforma archivos de acciones
   */
  private static mapArchivosAccion(archivos: any[]): any[] {
    return archivos.map((archivo) => ({
      archivoId: archivo.archivoId || archivo.fileId || "",
      version: archivo.version || "",
      tipoMino: archivo.tipoMino || archivo.mimeType || "",
      nombreOriginal: archivo.nombreOriginal || archivo.originalName || "",
      tamaño: Number(archivo.tamaño || archivo.size || 0),
    }));
  }

  /**
   * Transforma shareholders del backend al formato del DTO
   */
  private static mapShareholders(backendShareholders: any[]): Shareholder[] {
    return backendShareholders.map((sh) => ({
      id: sh.id || "",
      person: this.mapPersona(sh.person || {}),
    }));
  }

  /**
   * Transforma una persona del backend al formato del DTO
   */
  private static mapPersona(backendPerson: any): Persona {
    const personType = backendPerson.type || backendPerson.tipo || "NATURAL";

    // Si ya está en formato del DTO, retornarlo directamente
    if (backendPerson.tipo && !backendPerson.natural && !backendPerson.juridic) {
      return backendPerson as Persona;
    }

    // Transformar desde formato anidado del backend
    switch (personType.toUpperCase()) {
      case "NATURAL":
        const natural = backendPerson.natural || {};
        return {
          id: backendPerson.id || "",
          tipo: "NATURAL",
          nombre: natural.firstName || natural.nombre || "",
          apellidoPaterno: natural.lastNamePaternal || natural.apellidoPaterno || "",
          apellidoMaterno: natural.lastNameMaternal || natural.apellidoMaterno || "",
          tipoDocumento: natural.typeDocument || natural.tipoDocumento || "",
          numeroDocumento: natural.documentNumber || natural.numeroDocumento || "",
          paisEmision: natural.issuingCountry || natural.paisEmision || undefined,
        } as PersonaNatural;

      case "JURIDICA":
      case "JURIDIC":
        const juridic = backendPerson.juridic || {};
        return {
          id: backendPerson.id || "",
          tipo: "JURIDICA",
          tipoDocumento: juridic.typeDocument || juridic.tipoDocumento || "",
          numeroDocumento: juridic.documentNumber || juridic.numeroDocumento || "",
          razonSocial: juridic.reasonSocial || juridic.razonSocial || "",
          direccion: juridic.address || juridic.direccion || "",
          constituida: Boolean(juridic.constituted ?? juridic.constituida ?? false),
          nombreComercial: juridic.commercialName || juridic.nombreComercial || undefined,
          distrito: juridic.district || juridic.distrito || undefined,
          provincia: juridic.province || juridic.provincia || undefined,
          departamento: juridic.department || juridic.departamento || undefined,
          pais: juridic.country || juridic.pais || undefined,
        };

      // TODO: Agregar otros tipos de persona si es necesario
      default:
        // Por defecto, intentar como natural
        return {
          id: backendPerson.id || "",
          tipo: "NATURAL",
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          tipoDocumento: "",
          numeroDocumento: "",
        } as PersonaNatural;
    }
  }

  /**
   * Transforma shareAllocations del backend al formato del DTO
   */
  private static mapShareAllocations(backendAllocations: any[]): AsignacionAccion[] {
    return backendAllocations.map((alloc) => ({
      id: alloc.id || "",
      accionId: alloc.shareClassId || alloc.accionId || "",
      accionistaId: alloc.shareholderId || alloc.accionistaId || "",
      cantidadSuscrita: Number(alloc.subscribedSharesQuantity || alloc.cantidadSuscrita || 0),
      precioPorAccion: Number(alloc.pricePerShare || alloc.precioPorAccion || 0),
      porcentajePagadoPorAccion: Number(
        alloc.percentagePaidPerShare || alloc.porcentajePagadoPorAccion || 0
      ),
      totalDividendosPendientes: Number(
        alloc.unpaidDividendTotal ||
          alloc.dividendoPasivoTotal ||
          alloc.totalDividendosPendientes ||
          0
      ),
      pagadoCompletamente: Boolean(alloc.fullyPaid ?? alloc.pagadoCompletamente ?? false),
      fechaCreacion: alloc.createdAt || alloc.fechaCreacion || new Date().toISOString(),
      fechaActualizacion:
        alloc.updatedAt || alloc.fechaActualizacion || new Date().toISOString(),
    }));
  }

  /**
   * Transforma directory del backend al formato del DTO
   */
  private static mapDirectory(backendDirectory: any): Directorio {
    return {
      cantidadDirectores: Number(
        backendDirectory.directorCount || backendDirectory.cantidadDirectores || 0
      ),
      conteoPersonalizado: Boolean(
        backendDirectory.customCount ?? backendDirectory.conteoPersonalizado ?? false
      ),
      minimoDirectores:
        backendDirectory.minDirectors !== undefined
          ? Number(backendDirectory.minDirectors)
          : backendDirectory.minimoDirectores !== undefined
          ? Number(backendDirectory.minimoDirectores)
          : undefined,
      maximoDirectores:
        backendDirectory.maxDirectors !== undefined
          ? Number(backendDirectory.maxDirectors)
          : backendDirectory.maximoDirectores !== undefined
          ? Number(backendDirectory.maximoDirectores)
          : undefined,
      inicioMandato: backendDirectory.termStart || backendDirectory.inicioMandato || null,
      finMandato: backendDirectory.termEnd || backendDirectory.finMandato || null,
      quorumMinimo: Number(backendDirectory.minQuorum || backendDirectory.quorumMinimo || 0),
      mayoria: Number(backendDirectory.majority || backendDirectory.mayoria || 0),
      presidenteDesignado: Boolean(
        backendDirectory.presidentAppointed ?? backendDirectory.presidenteDesignado ?? false
      ),
      secretarioAsignado: Boolean(
        backendDirectory.secretaryAssigned ?? backendDirectory.secretarioAsignado ?? false
      ),
      reeleccionPermitida: Boolean(
        backendDirectory.reelectionAllowed ?? backendDirectory.reeleccionPermitida ?? false
      ),
      presidentePreside: Boolean(
        backendDirectory.presidentChairs ?? backendDirectory.presidentePreside ?? false
      ),
      presidenteDesempata: Boolean(
        backendDirectory.presidentTiebreak ?? backendDirectory.presidenteDesempata ?? false
      ),
      periodo: backendDirectory.term || backendDirectory.periodo || undefined,
      presidenteId: backendDirectory.presidentId || backendDirectory.presidenteId || undefined,
    };
  }

  /**
   * Transforma directors del backend al formato del DTO
   */
  private static mapDirectors(backendDirectors: any[]): Director[] {
    return backendDirectors.map((dir) => {
      const backendPerson = dir.person || {};
      const natural = backendPerson.natural || {};

      return {
        id: dir.id || "",
        persona: {
          id: backendPerson.id || "",
          nombre: natural.firstName || natural.nombre || "",
          apellidoPaterno: natural.lastNamePaternal || natural.apellidoPaterno || "",
          apellidoMaterno: natural.lastNameMaternal || natural.apellidoMaterno || "",
          tipoDocumento: natural.typeDocument || natural.tipoDocumento || "",
          numeroDocumento: natural.documentNumber || natural.numeroDocumento || "",
          paisEmision: natural.issuingCountry || natural.paisEmision || undefined,
        },
        rolDirector: dir.directorRole || dir.rolDirector || "",
        reemplazaId: dir.replacesId || dir.reemplazaId || undefined,
      };
    });
  }

  /**
   * Transforma attorneys del backend al formato del DTO
   */
  private static mapAttorneys(backendAttorneys: any[]): Apoderado[] {
    return backendAttorneys.map((att) => {
      const backendPerson = att.person || {};
      const personType = backendPerson.type || backendPerson.tipo || "NATURAL";

      return {
        id: att.id || "",
        claseApoderadoId: att.attorneyClassId || att.claseApoderadoId || "",
        persona: this.mapPersona(backendPerson) as PersonaNatural,
        poderId: att.powerId || att.poderId || null,
      };
    });
  }

  /**
   * Transforma powers del backend al formato del DTO
   */
  private static mapPowers(backendPowers: any): RegimenPoderes {
    // Si backendPowers es un array, convertirlo a estructura RegimenPoderes
    if (Array.isArray(backendPowers)) {
      return {
        id: "",
        powers: backendPowers.map((p) => ({
          id: p.id || "",
          name: p.name || "",
          fileId: p.fileId || undefined,
        })),
        powerGrants: [],
      };
    }

    // Si ya es un objeto con estructura RegimenPoderes
    if (backendPowers.powers && Array.isArray(backendPowers.powers)) {
      return {
        id: backendPowers.id || "",
        powers: backendPowers.powers.map((p: any) => ({
          id: p.id || "",
          name: p.name || "",
          fileId: p.fileId || undefined,
        })),
        powerGrants: backendPowers.powerGrants || [],
      };
    }

    // Si es un objeto simple con array de powers
    return {
      id: backendPowers.id || "",
      powers: (backendPowers.powers || []).map((p: any) => ({
        id: p.id || "",
        name: p.name || "",
        fileId: p.fileId || undefined,
      })),
      powerGrants: backendPowers.powerGrants || [],
    };
  }

  /**
   * Transforma quorums del backend al formato del DTO
   */
  private static mapQuorums(backendQuorums: any): Quorum {
    return {
      primeraConvocatoriaSimple: Number(
        backendQuorums.simpleFirstCall || backendQuorums.primeraConvocatoriaSimple || 0
      ),
      primeraConvocatoriaCalificada: Number(
        backendQuorums.qualifiedFirstCall || backendQuorums.primeraConvocatoriaCalificada || 0
      ),
      segundaConvocatoriaSimple: Number(
        backendQuorums.simpleSecondCall || backendQuorums.segundaConvocatoriaSimple || 0
      ),
      segundaConvocatoriaCalificada: Number(
        backendQuorums.qualifiedSecondCall || backendQuorums.segundaConvocatoriaCalificada || 0
      ),
      quorumMinimoSimple: Number(
        backendQuorums.simpleQuorumMinimum || backendQuorums.quorumMinimoSimple || 0
      ),
      quorumMinimoCalificado: Number(
        backendQuorums.qualifiedQuorumMinimum || backendQuorums.quorumMinimoCalificado || 0
      ),
    };
  }

  /**
   * Transforma specialAgreements del backend al formato del DTO
   */
  private static mapSpecialAgreements(backendAgreements: any): AcuerdoEspecial {
    return {
      derechoPreferencia: Boolean(
        backendAgreements.prefRight ?? backendAgreements.derechoPreferencia ?? false
      ),
      archivoEstatutos: backendAgreements.bylaws || backendAgreements.archivoEstatutos || null,
      archivoAccionistas:
        backendAgreements.shareholders || backendAgreements.archivoAccionistas || null,
      archivoTerceros:
        backendAgreements.thirdParties || backendAgreements.archivoTerceros || null,
    };
  }

  /**
   * Transforma societyData del backend al formato del DTO
   */
  private static mapSocietyData(backendSocietyData: any): SnapshotCompleteDTO["societyData"] {
    return {
      ruc: backendSocietyData.ruc || "",
      reasonSocial: backendSocietyData.reasonSocial || "",
      typeSociety:
        backendSocietyData.typeSocietyAcronimo || backendSocietyData.typeSociety || "",
      commercialName: backendSocietyData.commercialName || "",
      address: backendSocietyData.address || "",
      district: backendSocietyData.district || "",
      province: backendSocietyData.province || "",
      department: backendSocietyData.department || "",
      registrationDate: backendSocietyData.registrationDate || "",
      foreignActivity: backendSocietyData.foreignActivity || "",
      publicDeedDate: backendSocietyData.publicDeedDate || "",
      registryOffice: backendSocietyData.registryOffice || "",
      registrationRecord: backendSocietyData.registrationRecord || "",
    };
  }
}

