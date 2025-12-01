import { defineStore } from "pinia";

import {
  CreateJuntaUseCase,
  DeleteJuntaUseCase,
  ListJuntasUseCase,
  GetSnapshotUseCase,
} from "~/core/hexag/juntas/application/use-cases";
import type { JuntaResumenDTO, SnapshotCompleteDTO } from "~/core/hexag/juntas/application/dtos";
import { JuntaHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories";

type Status = "idle" | "loading" | "error";

export const useJuntaHistorialStore = defineStore("juntas-historial", {
  state: () => ({
    juntas: [] as JuntaResumenDTO[],
    status: "idle" as Status,
    errorMessage: null as string | null,
    selectedSocietyId: null as number | null,
  }),

  getters: {
    totalJuntas: (state) => state.juntas.length,

    juntasPorEstado: (state) => {
      return state.juntas.reduce<Record<string, JuntaResumenDTO[]>>(
        (acc, junta) => {
          const estado = junta.estado ?? "BORRADOR";
          if (!acc[estado]) {
            acc[estado] = [];
          }
          acc[estado].push(junta);
          return acc;
        },
        {}
      );
    },

    juntasEnProgreso: (state) =>
      state.juntas.filter((junta) => junta.estado !== "FINALIZADO"),

    juntasFinalizadas: (state) =>
      state.juntas.filter((junta) => junta.estado === "FINALIZADO"),
  },

  actions: {
      setSelectedSocietyId(societyId: number | null) {
        this.selectedSocietyId = societyId;
      },

      async cargarHistorial(societyId: number) {
        if (!societyId) {
          this.errorMessage = "Debes seleccionar una sociedad primero.";
          return;
        }

        this.status = "loading";
        this.errorMessage = null;

        const repository = new JuntaHttpRepository();
        const listUseCase = new ListJuntasUseCase(repository);

        try {
          const result = await listUseCase.execute(societyId);
          console.debug("[Store][JuntaHistorial] Juntas obtenidas", result);
          this.juntas = result;
          this.status = "idle";
        } catch (error) {
          const statusCode =
            (error as any)?.statusCode ?? (error as any)?.response?.status ?? null;
          const message =
            (error as any)?.data?.message ??
            (error as any)?.response?._data?.message ??
            (error as any)?.message ??
            "Error desconocido";
          console.error("[JuntaHistorialStore] Error al cargar juntas:", {
            statusCode,
            message,
          });
          this.status = "error";
          this.errorMessage =
            statusCode === 401
              ? "Tu sesión expiró o el token no es válido. Inicia sesión nuevamente."
              : "No pudimos obtener el historial de juntas.";
        }
      },

      async crearJunta(societyId: number): Promise<string | null> {
        if (!societyId) {
          this.errorMessage = "Debes seleccionar una sociedad primero.";
          return null;
        }

        // Guardar el societyId seleccionado
        this.setSelectedSocietyId(societyId);

        const repository = new JuntaHttpRepository();
        const createUseCase = new CreateJuntaUseCase(repository);

        try {
          const id = await createUseCase.execute(societyId);
          console.debug("[Store][JuntaHistorial] Junta creada con id", id);

          // 🎯 OBTENER SNAPSHOT DESPUÉS DE CREAR LA JUNTA
          try {
            const flowIdNumber = parseInt(id, 10);
            if (!Number.isNaN(flowIdNumber)) {
              const getSnapshotUseCase = new GetSnapshotUseCase(repository);
              const snapshot = await getSnapshotUseCase.execute(societyId, flowIdNumber);

              // 📊 MOSTRAR SNAPSHOT POR CONSOLA (formateado)
              console.log("\n" + "=".repeat(80));
              console.log("📸 SNAPSHOT COMPLETO DE JUNTA");
              console.log("=".repeat(80));
              console.log(`Sociedad ID: ${societyId}`);
              console.log(`Flow ID: ${flowIdNumber}`);
              console.log("\n📋 RESUMEN:");
              console.log(`  • Accionistas: ${snapshot.shareholders.length}`);
              console.log(`  • Clases de Acciones: ${snapshot.shareClasses.length}`);
              console.log(`  • Asignaciones: ${snapshot.shareAllocations.length}`);
              console.log(`  • Directores: ${snapshot.directors?.length || 0}`);
              console.log(`  • Apoderados: ${snapshot.attorneys?.length || 0}`);
              console.log(`  • Valor Nominal: $${snapshot.nominalValue.toLocaleString()}`);
              console.log(`  • Tiene Directorio: ${snapshot.directory ? "Sí" : "No"}`);
              console.log(`  • Tiene Quorums: ${snapshot.quorums ? "Sí" : "No"}`);
              console.log("\n📦 DATOS COMPLETOS:");
              console.log(JSON.stringify(snapshot, null, 2));
              console.log("=".repeat(80) + "\n");
            }
          } catch (snapshotError) {
            console.warn("[Store][JuntaHistorial] Error al obtener snapshot:", snapshotError);
            // No fallar la creación si el snapshot falla
          }

          // Recargar el historial después de crear
          await this.cargarHistorial(societyId);
          return id;
        } catch (error) {
          console.error("[JuntaHistorialStore] Error al crear junta:", error);
          this.errorMessage = "No pudimos crear una nueva junta.";
          return null;
        }
      },

      async eliminarJunta(societyId: number, flowId: string) {
        if (!societyId || !flowId) {
          this.errorMessage = "Parámetros inválidos para eliminar la junta.";
          return;
        }

        const repository = new JuntaHttpRepository();
        const deleteUseCase = new DeleteJuntaUseCase(repository);

        try {
          const flowIdNumber = parseInt(flowId, 10);
          if (Number.isNaN(flowIdNumber)) {
            throw new Error("El flowId debe ser un número válido");
          }
          await deleteUseCase.execute(societyId, flowIdNumber);
          console.debug("[Store][JuntaHistorial] Junta eliminada", { societyId, flowId });
          // Recargar el historial después de eliminar
          await this.cargarHistorial(societyId);
        } catch (error) {
          console.error("[JuntaHistorialStore] Error al eliminar junta:", error);
          this.errorMessage = "No pudimos eliminar la junta seleccionada.";
        }
      },
    },
  }
);

