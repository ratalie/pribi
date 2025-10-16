// Importaciones de todas las traducciones en francés
import { frCommon } from "./common";
import { frNavigation } from "./navigation";
import { frDashboard } from "./dashboard";
import { frConfig } from "./config";
import { frUser } from "./user";
import { frValidation } from "./validation";
import { frMessages } from "./messages";
import { frTime } from "./time";
import { frTheme } from "./theme";

// Exportaciones individuales
export { frCommon as common };
export { frNavigation as navigation };
export { frDashboard as dashboard };
export { frConfig as config };
export { frUser as user };
export { frValidation as validation };
export { frMessages as messages };
export { frTime as time };
export { frTheme as theme };

// Exportación por defecto con toda la estructura
export default {
  common: frCommon,
  navigation: frNavigation,
  dashboard: frDashboard,
  config: frConfig,
  user: frUser,
  validation: frValidation,
  messages: frMessages,
  time: frTime,
  theme: frTheme,
};
