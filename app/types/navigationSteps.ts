export interface NavigationStep {
  title: string;
  description: string;
  status: "completed" | "current" | "empty";
  route: string;
  isCategory?: boolean;  // Indica si es un separador de categoría (sin círculo)
  level?: number;  // Nivel del item (para determinar tamaño de círculo)
}
