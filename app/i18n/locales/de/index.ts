// Importaciones de todas las traducciones en alemán
import { deCommon } from "./common";
import { deNavigation } from "./navigation";
import { deDashboard } from "./dashboard";
import { deConfig } from "./config";
import { deUser } from "./user";
import { deValidation } from "./validation";
import { deMessages } from "./messages";
import { deTime } from "./time";
import { deTheme } from "./theme";

// Exportaciones individuales
export { deCommon as common };
export { deNavigation as navigation };
export { deDashboard as dashboard };
export { deConfig as config };
export { deUser as user };
export { deValidation as validation };
export { deMessages as messages };
export { deTime as time };
export { deTheme as theme };

// Exportación por defecto con toda la estructura
export default {
  common: deCommon,
  navigation: deNavigation,
  dashboard: deDashboard,
  config: deConfig,
  user: deUser,
  validation: deValidation,
  messages: deMessages,
  time: deTime,
  theme: deTheme,
};
