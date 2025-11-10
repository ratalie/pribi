export interface ClaseApoderado {
  id: string;
  nombre: string;
}

export interface ClaseApoderadoRow {
  id: string;
  clase_apoderado: string;
  numero_apoderados: number;
}

export interface RegistroApoderado {
  id: string;
  claseApoderadoId: string;
  nombreRazonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface RegistroApoderadoRow {
  id: string;
  clase_apoderado: string;
  nombre_razon_social: string;
  tipo_documento: string;
  numero_documento: string;
}

export interface OtroApoderado {
  id: string;
  nombreRazonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface OtroApoderadoRow {
  id: string;
  nombre_razon_social: string;
  tipo_documento: string;
  numero_documento: string;
}

