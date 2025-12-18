import { localize } from "@vee-validate/i18n";
import es from "@vee-validate/i18n/dist/locale/es.json";
import { all } from "@vee-validate/rules";
import { configure, defineRule } from "vee-validate";

// Registrar todas las reglas disponibles
// Usamos 'all' que es un objeto que contiene todas las reglas como funciones
Object.entries(all).forEach(([name, rule]) => {
  // Solo registrar si es una función (filtro de seguridad)
  if (typeof rule === "function") {
    defineRule(name, rule);
  }
});

configure({
  generateMessage: localize({ es }), // mensajes en español
  validateOnInput: true, // valida al escribir
});

export default defineNuxtPlugin(() => {
  // Plugin ya configurado arriba, solo necesitamos exportar el plugin
});
