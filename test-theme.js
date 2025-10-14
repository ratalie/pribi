// Test simple para verificar funcionamiento de temas
console.log("Testing theme functionality...");

// Verificar si existe useTheme en el contexto
if (typeof window !== "undefined") {
  console.log("Window object available");

  // Verificar clases en el documentElement
  console.log("Current classes on html:", document.documentElement.className);

  // Verificar localStorage
  console.log("Theme in localStorage:", localStorage.getItem("probo-theme"));

  // Simular cambio de tema
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add("dark");
  console.log(
    "Applied dark theme, classes now:",
    document.documentElement.className
  );
}
