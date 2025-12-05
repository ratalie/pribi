# ⚙️ Vitest Configuration

> Configuración de Vitest en el proyecto.

---

## 📍 Archivo de Configuración

```
vitest.config.ts
```

---

## 🔧 Configuración Actual

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    pool: "threads",
    testTimeout: 10000,
    include: ["**/*.{test,spec}.{js,ts,tsx}"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
      "@": resolve(__dirname, "./app"),
      "@hexag": resolve(__dirname, "./app/core/hexag"),
      "~/tests": resolve(__dirname, "./tests"),
      "@tests": resolve(__dirname, "./tests"),
    },
  },
});
```

---

## 🎯 Comandos

```bash
npm run test          # MSW (rápido)
npm run test:real     # Backend real
npm run test:watch    # Watch mode
npm run test:coverage # Cobertura
```

---

## 📚 Recursos

- [../architecture/04-patron-testing.md](../architecture/04-patron-testing.md) - Estrategia completa
- Vitest Docs: https://vitest.dev/

---

**Última actualización:** Diciembre 3, 2025



