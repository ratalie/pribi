/**
 * Test Logger - Genera resúmenes de ejecución de tests
 * 
 * Captura eventos durante los tests y genera reportes en JSON y Markdown
 */

export interface TestLogEvent {
  type: "create" | "list" | "delete" | "error";
  timestamp: string;
  societyId?: string;
  message?: string;
  error?: string;
}

export interface TestLogSummary {
  testSuite: string;
  timestamp: string;
  duration: string;
  config: {
    backendUrl: string;
    useMsw: boolean;
    email?: string;
  };
  results: {
    total: number;
    passed: number;
    failed: number;
  };
  societies: {
    created: string[];
    deleted: string[];
    failedToDelete: string[];
  };
  events: TestLogEvent[];
  errors: string[];
}

export class TestLogger {
  private events: TestLogEvent[] = [];
  private startTime: number;
  private testSuite: string;
  private config: TestLogSummary["config"];
  private createdIds: Set<string> = new Set();
  private deletedIds: Set<string> = new Set();
  private failedToDeleteIds: Set<string> = new Set();
  private errors: string[] = [];

  constructor(testSuite: string, config: TestLogSummary["config"]) {
    this.testSuite = testSuite;
    this.config = config;
    this.startTime = Date.now();
  }

  logCreate(societyId: string) {
    this.createdIds.add(societyId);
    this.events.push({
      type: "create",
      timestamp: new Date().toISOString(),
      societyId,
      message: `Sociedad ${societyId} creada`,
    });
  }

  logList() {
    this.events.push({
      type: "list",
      timestamp: new Date().toISOString(),
      message: "Listado de sociedades obtenido",
    });
  }

  logDelete(societyId: string, success: boolean) {
    if (success) {
      this.deletedIds.add(societyId);
      this.events.push({
        type: "delete",
        timestamp: new Date().toISOString(),
        societyId,
        message: `Sociedad ${societyId} eliminada`,
      });
    } else {
      this.failedToDeleteIds.add(societyId);
      this.events.push({
        type: "delete",
        timestamp: new Date().toISOString(),
        societyId,
        message: `Fallo al eliminar sociedad ${societyId}`,
      });
    }
  }

  logError(message: string, error?: any) {
    const errorMsg = error?.message || String(error) || message;
    this.errors.push(errorMsg);
    this.events.push({
      type: "error",
      timestamp: new Date().toISOString(),
      message,
      error: errorMsg,
    });
  }

  generateSummary(results: { total: number; passed: number; failed: number }): TestLogSummary {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2) + "s";

    return {
      testSuite: this.testSuite,
      timestamp: new Date().toISOString(),
      duration,
      config: this.config,
      results,
      societies: {
        created: Array.from(this.createdIds),
        deleted: Array.from(this.deletedIds),
        failedToDelete: Array.from(this.failedToDeleteIds),
      },
      events: this.events,
      errors: this.errors,
    };
  }

  async saveSummary(summary: TestLogSummary): Promise<{ jsonPath: string; mdPath: string }> {
    const fs = await import("fs/promises");
    const path = await import("path");

    // Crear directorio si no existe
    const logsDir = path.resolve(process.cwd(), "logs", "tests");
    await fs.mkdir(logsDir, { recursive: true });

    // Generar nombre de archivo con timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5); // YYYY-MM-DD-HH-MM-SS
    const baseName = `sociedad-integration-${timestamp}`;

    // Guardar JSON
    const jsonPath = path.join(logsDir, `${baseName}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(summary, null, 2), "utf-8");

    // Guardar Markdown
    const mdPath = path.join(logsDir, `${baseName}.md`);
    const mdContent = this.generateMarkdown(summary);
    await fs.writeFile(mdPath, mdContent, "utf-8");

    return { jsonPath, mdPath };
  }

  private generateMarkdown(summary: TestLogSummary): string {
    const date = new Date(summary.timestamp).toLocaleString("es-ES");
    const { results, societies, config } = summary;

    let md = `# Test Report: ${summary.testSuite}\n\n`;
    md += `**Fecha**: ${date}\n`;
    md += `**Duración**: ${summary.duration}\n`;
    md += `**Backend**: ${config.backendUrl}\n`;
    md += `**Modo**: ${config.useMsw ? "MSW (Mock)" : "Backend Real"}\n\n`;

    // Resultados
    md += `## Resultados\n\n`;
    md += `- ${results.failed === 0 ? "✅" : "❌"} Total: ${results.total} tests\n`;
    md += `- ${results.passed > 0 ? "✅" : "❌"} Pasados: ${results.passed}\n`;
    md += `- ${results.failed === 0 ? "✅" : "❌"} Fallidos: ${results.failed}\n\n`;

    // Sociedades
    md += `## Sociedades\n\n`;

    if (societies.created.length > 0) {
      md += `### Creadas (${societies.created.length})\n`;
      societies.created.forEach((id) => {
        md += `- ${id}\n`;
      });
      md += `\n`;
    }

    if (societies.deleted.length > 0) {
      md += `### Eliminadas (${societies.deleted.length})\n`;
      societies.deleted.forEach((id) => {
        md += `- ${id}\n`;
      });
      md += `\n`;
    }

    if (societies.failedToDelete.length > 0) {
      md += `### ⚠️ No Eliminadas (${societies.failedToDelete.length})\n`;
      societies.failedToDelete.forEach((id) => {
        md += `- ${id}\n`;
      });
      md += `\n`;
    }

    // Errores
    if (summary.errors.length > 0) {
      md += `## Errores\n\n`;
      summary.errors.forEach((error) => {
        md += `- ${error}\n`;
      });
      md += `\n`;
    }

    // Estado Final
    md += `## Estado Final\n\n`;
    const allDeleted = societies.created.length === societies.deleted.length;
    const hasErrors = summary.errors.length > 0 || societies.failedToDelete.length > 0;

    if (results.failed === 0 && allDeleted && !hasErrors) {
      md += `✅ Todos los tests pasaron correctamente\n`;
      md += `✅ Todas las sociedades fueron eliminadas\n`;
    } else {
      if (results.failed > 0) {
        md += `❌ ${results.failed} test(s) fallaron\n`;
      }
      if (!allDeleted) {
        md += `⚠️ ${societies.failedToDelete.length} sociedad(es) no fueron eliminadas\n`;
      }
      if (hasErrors) {
        md += `⚠️ Se encontraron ${summary.errors.length} error(es)\n`;
      }
    }

    return md;
  }
}

