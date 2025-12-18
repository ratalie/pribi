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
  checked?: boolean; // Estado del checkbox (para nombramiento de apoderados)
  claseApoderadoNombre: string;
  nombre: string;
  tipoDocumento: TipoDocumentosEnum;
  numeroDocumento: string;
}
