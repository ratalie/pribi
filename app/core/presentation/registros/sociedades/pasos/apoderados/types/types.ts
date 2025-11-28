import type { DocumentTypeUIEnum } from "./enums/DocumentTypeEnum";

export interface ClaseApoderadoRow {
  id: string;
  nombre: string;
  numeroApoderados: number;
}

export interface GerenteGeneralRow {
  id: string;
  nombre: string;
  tipoDocumento: DocumentTypeUIEnum;
  numeroDocumento: string;
}

export interface ApoderadoRow {
  id: string;
  claseApoderadoNombre: string;
  nombre: string;
  tipoDocumento: DocumentTypeUIEnum;
  numeroDocumento: string;
}
