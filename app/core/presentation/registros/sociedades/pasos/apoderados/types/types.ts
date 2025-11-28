import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export interface ClaseApoderadoRow {
  id: string;
  nombre: string;
  numeroApoderados: number;
}

export interface GerenteGeneralRow {
  id: string;
  nombre: string;
  tipoDocumento: TipoDocumentosEnum;
  numeroDocumento: string;
}

export interface ApoderadoRow {
  id: string;
  claseApoderadoNombre: string;
  nombre: string;
  tipoDocumento: TipoDocumentosEnum;
  numeroDocumento: string;
}
