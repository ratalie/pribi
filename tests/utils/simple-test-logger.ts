/**
 * Simple Test Logger - Versión ligera para tests individuales
 * 
 * Genera reportes automáticos en JSON y Markdown sin usar IntegrationTestBase
 */

import fs from "fs/promises";
import path from "path";

export interface SimpleTestLog {
  testName: string;
  timestamp: string;
  duration: number;
  backend: string;
  results: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  societies: {
    created: string[];
    deleted: string[];
  };
}

/**
 * Hook de Vitest para logging automático
 * Uso en cada archivo de test:
 * 
 * import { enableTestLogging } from "@tests/utils/simple-test-logger";
 * enableTestLogging("Nombre del Test");
 */
export function enableTestLogging(testName: string) {
  const startTime = Date.now();
  const societies = {
    created: [] as string[],
    deleted: [] as string[],
  };
  
  let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  // Hook global para capturar sociedades creadas/eliminadas
  if (typeof globalThis !== "undefined") {
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      const message = args.join(" ");
      
      // Capturar sociedades creadas
      if (message.includes("Sociedad creada:")) {
        const match = message.match(/Sociedad creada:\s*(\d+)/);
        if (match) societies.created.push(match[1]);
      }
      
      // Capturar sociedades eliminadas
      if (message.includes("Sociedad") && message.includes("eliminada")) {
        const match = message.match(/Sociedad\s*(\d+)\s*eliminada/);
        if (match) societies.deleted.push(match[1]);
      }
      
      originalConsoleLog(...args);
    };
  }

  // Hook afterAll para generar el log
  return {
    async saveLog(results: { total: number; passed: number; failed: number; skipped?: number }) {
      testResults = {
        total: results.total,
        passed: results.passed,
        failed: results.failed,
        skipped: results.skipped || 0,
      };
      
      const duration = (Date.now() - startTime) / 1000;
      const log: SimpleTestLog = {
        testName,
        timestamp: new Date().toISOString(),
        duration,
        backend: process.env.TEST_BACKEND_URL || "http://localhost:3000",
        results: testResults,
        societies,
      };

      try {
        const logsDir = path.join(process.cwd(), "logs", "tests");
        await fs.mkdir(logsDir, { recursive: true });

        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, "-")
          .slice(0, -5);
        const baseName = `${testName.toLowerCase().replace(/\s+/g, "-")}-${timestamp}`;

        // Guardar JSON
        const jsonPath = path.join(logsDir, `${baseName}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(log, null, 2), "utf-8");

        // Guardar Markdown
        const mdPath = path.join(logsDir, `${baseName}.md`);
        const mdContent = generateMarkdown(log);
        await fs.writeFile(mdPath, mdContent, "utf-8");

        console.log("\n📊 Log generado:");
        console.log(`   JSON: ${jsonPath}`);
        console.log(`   MD: ${mdPath}\n`);
      } catch (error) {
        console.error("Error al guardar log:", error);
      }
    },
    societies,
  };
}

function generateMarkdown(log: SimpleTestLog): string {
  const date = new Date(log.timestamp).toLocaleString("es-ES");
  const successRate = ((log.results.passed / log.results.total) * 100).toFixed(1);
  
  return `# Test Report: ${log.testName}

**Fecha**: ${date}
**Duración**: ${log.duration.toFixed(2)}s
**Backend**: ${log.backend}

## Resultados

- Total: ${log.results.total} tests
- ✅ Pasados: ${log.results.passed}
- ❌ Fallidos: ${log.results.failed}
- ⏭️  Skipped: ${log.results.skipped}
- 📊 Success Rate: ${successRate}%

## Sociedades

### Creadas (${log.societies.created.length})
${log.societies.created.map((id) => `- ${id}`).join("\n") || "- Ninguna"}

### Eliminadas (${log.societies.deleted.length})
${log.societies.deleted.map((id) => `- ${id}`).join("\n") || "- Ninguna"}

## Estado Final

${log.results.failed === 0 ? "✅ Todos los tests pasaron correctamente" : `⚠️ ${log.results.failed} tests fallaron`}
${log.societies.created.length === log.societies.deleted.length ? "✅ Todas las sociedades fueron eliminadas" : `⚠️ ${log.societies.created.length - log.societies.deleted.length} sociedades NO fueron eliminadas`}
`;
}

