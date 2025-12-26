/**
 * Vitest Reporter Plugin - Logging automático para todos los tests
 * 
 * Se agrega en vitest.config.ts para generar logs automáticamente
 */

import type { Reporter, File } from "vitest";
import fs from "fs/promises";
import path from "path";

export class VitestLoggerReporter implements Reporter {
  private startTime: number = 0;
  private societies: { created: string[]; deleted: string[] } = {
    created: [],
    deleted: [],
  };

  onInit() {
    this.startTime = Date.now();
  }

  onCollected() {
    // Hook para cuando los tests son collected
  }

  async onFinished(files?: File[]) {
    if (!files || files.length === 0) return;

    const duration = (Date.now() - this.startTime) / 1000;
    const timestamp = new Date().toISOString();

    // Calcular resultados totales
    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    files.forEach((file) => {
      file.tasks.forEach((task) => {
        total++;
        if (task.result?.state === "pass") passed++;
        if (task.result?.state === "fail") failed++;
        if (task.mode === "skip") skipped++;
      });
    });

    // Generar log
    const log = {
      timestamp,
      duration: `${duration.toFixed(2)}s`,
      backend: process.env.TEST_BACKEND_URL || "http://localhost:3000",
      results: { total, passed, failed, skipped },
      successRate: total > 0 ? ((passed / total) * 100).toFixed(1) + "%" : "N/A",
      files: files.map((f) => ({
        name: path.basename(f.filepath),
        tests: f.tasks.length,
        passed: f.tasks.filter((t) => t.result?.state === "pass").length,
        failed: f.tasks.filter((t) => t.result?.state === "fail").length,
      })),
      societies: this.societies,
    };

    // Guardar logs
    await this.saveLogs(log);
  }

  private async saveLogs(log: any) {
    try {
      const logsDir = path.join(process.cwd(), "logs", "tests");
      await fs.mkdir(logsDir, { recursive: true });

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      const baseName = `test-run-${timestamp}`;

      // JSON
      const jsonPath = path.join(logsDir, `${baseName}.json`);
      await fs.writeFile(jsonPath, JSON.stringify(log, null, 2), "utf-8");

      // Markdown
      const mdPath = path.join(logsDir, `${baseName}.md`);
      const mdContent = this.generateMarkdown(log);
      await fs.writeFile(mdPath, mdContent, "utf-8");

      console.log("\n📊 Logs generados:");
      console.log(`   JSON: ${jsonPath}`);
      console.log(`   MD: ${mdPath}\n`);
    } catch (error) {
      console.error("⚠️ Error al guardar logs:", error);
    }
  }

  private generateMarkdown(log: any): string {
    const date = new Date(log.timestamp).toLocaleString("es-ES");
    
    return `# Test Report - Ejecución Completa

**Fecha**: ${date}
**Duración**: ${log.duration}
**Backend**: ${log.backend}

## 📊 Resultados

- **Total**: ${log.results.total} tests
- ✅ **Pasados**: ${log.results.passed}
- ❌ **Fallidos**: ${log.results.failed}
- ⏭️  **Skipped**: ${log.results.skipped}
- 📈 **Success Rate**: ${log.successRate}

## 📁 Archivos de Test

${log.files.map((f: any) => `
### ${f.name}
- Total: ${f.tests} tests
- ✅ Pasados: ${f.passed}
- ❌ Fallidos: ${f.failed}
`).join("\n")}

## 🏢 Sociedades

### Creadas (${log.societies.created.length})
${log.societies.created.map((id: string) => `- ${id}`).join("\n") || "- Ninguna"}

### Eliminadas (${log.societies.deleted.length})
${log.societies.deleted.map((id: string) => `- ${id}`).join("\n") || "- Ninguna"}

## ✅ Estado Final

${log.results.failed === 0 ? "✅ **Todos los tests pasaron correctamente**" : `⚠️ **${log.results.failed} tests fallaron**`}

${log.societies.created.length === log.societies.deleted.length ? "✅ **Todas las sociedades fueron eliminadas**" : `⚠️ **${log.societies.created.length - log.societies.deleted.length} sociedades NO fueron eliminadas**`}
`;
  }
}

