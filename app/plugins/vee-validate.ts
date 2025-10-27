import { localize } from "@vee-validate/i18n";
import es from "@vee-validate/i18n/dist/locale/es.json";
import * as AllRules from "@vee-validate/rules";
import { configure, defineRule } from "vee-validate";

// Registrar todas las reglas disponibles
Object.entries(AllRules).forEach(([name, rule]) => {
  defineRule(name, rule as any);
});

configure({
  generateMessage: localize({ es }), // mensajes en español
  validateOnInput: true, // valida al escribir
});
