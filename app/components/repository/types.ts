export type SearchScope =
  | "all"
  | "dashboard"
  | "societarios"
  | "generados"
  | "personalizadas"
  | "historial";

export interface AdvancedFilters {
  scope: SearchScope;
  dateRange?: { from?: Date; to?: Date };
  fileTypes?: string[]; // ['pdf', 'docx', 'xlsx', 'pptx', 'img']
  categories?: string[]; // ['acciones', 'acuerdos', 'actas', ...]
  societies?: string[];
  tags?: string[];
  status?: string[]; // ['PENDIENTE', 'EN_PROCESO', 'FINALIZADO']
  privacy?: "all" | "public" | "private";
  owner?: string;
  dateModified?: "today" | "week" | "month" | "year" | "custom";
}


























