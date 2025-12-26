export default defineAppConfig({
  icon: {
    // Tamaño por defecto de los iconos
    size: "1em",
    
    // Clase CSS por defecto aplicada a todos los iconos
    class: "icon",
    
    // Modo de renderizado: 'css' (más ligero) o 'svg' (más control)
    // CSS mode es compatible con TailwindCSS v4
    mode: "css",
    
    // Capa CSS para TailwindCSS v4 (requerido cuando usas modo CSS)
    cssLayer: "base",
    
    // Aliases: nombres cortos para iconos comunes
    // Ejemplo: <Icon name="nuxt" /> en lugar de <Icon name="logos:nuxt-icon" />
      aliases: {
      // Ejemplos (puedes agregar más según tus necesidades)
      // 'nuxt': 'logos:nuxt-icon',
      // 'github': 'uil:github',
    },
  },
});

