export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  role: UserRole;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  action: string;
}

/**
 * Temas disponibles en PROBO
 * - light: Tema claro (blanco)
 * - dark: Tema oscuro (negro)
 * - purple: Tema morado (personalizado)
 * - system: Sigue la preferencia del sistema operativo (light/dark)
 */
export type Theme = "light" | "dark" | "purple" | "system";

export type Language = "es" | "en" | "pt" | "fr" | "de";

export type Font =
  | "Inter"
  | "Roboto"
  | "Open Sans"
  | "Fira Code"
  | "JetBrains Mono"
  | "Cascadia Code";
