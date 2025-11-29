import type { DocumentTypeEnum, PersonTypeEnum } from "..";

interface PersonaBase {
  id: string;
  tipo: PersonTypeEnum;
}

export interface PersonaNatural extends PersonaBase {
  tipo: PersonTypeEnum.NATURAL;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: DocumentTypeEnum;
  numeroDocumento: string;
  paisEmision?: string;
}

export interface PersonaJuridica extends PersonaBase {
  tipo: PersonTypeEnum.JURIDICA;
  tipoDocumento: DocumentTypeEnum | string;
  numeroDocumento: string;
  razonSocial: string;
  direccion?: string;
  constituida: boolean;
  nombreComercial?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  pais?: string;
}
