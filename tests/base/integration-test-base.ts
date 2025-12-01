/**
 * Base class para tests de integración
 * 
 * Proporciona funcionalidad común para todos los tests de integración:
 * - Setup y cleanup de repositorios
 * - Logging de eventos
 * - Gestión de IDs creados
 * - Generación de resúmenes
 */

import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { getTestConfig } from "@tests/config/test-config";
import { TestLogger } from "@tests/utils/test-logger";
import { clearAllSocieties } from "@tests/helpers/seed-helpers";

export interface TestResults {
  total: number;
  passed: number;
  failed: number;
}

export abstract class IntegrationTestBase {
  protected sociedadRepository: SociedadHttpRepository;
  protected createdSocietyIds: string[] = [];
  protected logger: TestLogger;
  protected testResults: TestResults = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  protected readonly testConfig = getTestConfig();
  protected readonly shouldRun = !this.testConfig.useMsw;

  constructor(protected readonly testSuiteName: string) {
    this.sociedadRepository = new SociedadHttpRepository();
    this.logger = new TestLogger(this.testSuiteName, {
      backendUrl: this.testConfig.backendUrl,
      useMsw: this.testConfig.useMsw,
      email: this.testConfig.credentials.email,
    });
  }

  /**
   * Setup inicial - debe ser llamado en beforeAll
   */
  async setup(): Promise<void> {
    if (this.testConfig.useMsw) {
      console.warn(`⚠️ Estos tests requieren TEST_USE_MSW=false`);
    }

    // 🧹 Limpiar todas las sociedades del backend antes de empezar los tests
    await clearAllSocieties();

    // Setup específico del test (si es necesario)
    await this.setupSpecific();
  }

  /**
   * Setup específico del test - puede ser sobrescrito
   */
  protected async setupSpecific(): Promise<void> {
    // Override en subclases si es necesario
  }

  /**
   * Cleanup final - debe ser llamado en afterAll
   */
  async cleanup(): Promise<void> {
    // Limpiar solo las sociedades que ESTE test suite creó
    for (const id of this.createdSocietyIds) {
      try {
        await this.sociedadRepository.delete(id);
        this.logger.logDelete(id, true);
      } catch (error: any) {
        // Si la sociedad ya fue eliminada (404), es normal
        const statusCode = error?.statusCode ?? error?.response?.status ?? null;
        if (statusCode === 404) {
          console.log(`ℹ️  Sociedad ${id} ya fue eliminada (probablemente por otro test)`);
          this.logger.logDelete(id, true); // Considerarlo como éxito
        } else {
          console.warn(`⚠️ No se pudo eliminar sociedad ${id}:`, error);
          this.logger.logDelete(id, false);
          this.logger.logError(`Error al eliminar sociedad ${id}`, error);
        }
      }
    }

    // Generar y guardar resumen
    try {
      const summary = this.logger.generateSummary(this.testResults);
      const { jsonPath, mdPath } = await this.logger.saveSummary(summary);
      console.log("\n📊 Resumen de tests generado:");
      console.log(`   JSON: ${jsonPath}`);
      console.log(`   Markdown: ${mdPath}\n`);
    } catch (error) {
      console.error("Error al generar resumen:", error);
    }
  }

  /**
   * Helper para crear una sociedad de prueba
   */
  protected async createTestSociety(): Promise<string> {
    const societyId = await this.sociedadRepository.create();
    this.logger.logCreate(societyId);
    this.createdSocietyIds.push(societyId);
    return societyId;
  }

  /**
   * Helper para generar UUID
   */
  protected generateUUID(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

