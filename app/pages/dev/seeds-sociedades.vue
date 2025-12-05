<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Building2, CheckCircle2, LoaderCircle, XCircle } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

  // Datos Sociedad
  import type { DatosSociedadDTO } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/dtos/datos-sociedad.dto";
  import { CreateDatosSociedadUseCase } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/use-cases/create-datos-sociedad.use-case";
  import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/datos-sociedad.http.repository";

  // Accionistas
  import type { AccionistaDTO } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/dtos/accionista.dto";
  import { CreateAccionistaUseCase } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/use-cases/create-accionista.use-case";
  import type { Persona } from "~/core/hexag/registros/sociedades/pasos/accionistas/domain";
  import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/accionistas.http.repository";

  // Acciones
  import { CreateAccionUseCase } from "~/core/hexag/registros/sociedades/pasos/acciones/application/use-cases/create-accion.use-case";
  import type { AccionPayload } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
  import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain/enums/tipo-accion.enum";
  import { AccionesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/acciones/infrastructure/repositories/acciones.http.repository";

  // Quórums y Mayorías
  import type { QuorumDTO } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application/dtos/quorum.dto";
  import { CreateQuorumUseCase } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application/use-cases/create-quorum.use-case";
  import { QuorumHttpRepository } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/repositories/quorum.http.repository";

  // Directorio
  import type { DirectorDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/director.dto";
  import type { DirectorioDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/directorio.dto";
  import { CreateDirectorUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/create-director.use-case";
  import { UpdateDirectorioUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/directorio/update-directorio.use-case";
  import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
  import { DirectorHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/director.http.repository";
  import { DirectorioHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/directorio.http.repository";

  // Eliminar sociedades
  import { DeleteSociedadUseCase } from "~/core/hexag/registros/sociedades/application/use-cases/delete-sociedad.use-case";
  import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";

  // Apoderados
  import type { ApoderadoDTO } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/dtos/apoderado.dto";
  import type { ClaseApoderadoDTO } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/dtos/clase-apoderado.dto";
  import { CreateApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-apoderado.use-case";
  import { ListClasesApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/list-clases-apoderado.use-case";
  import { ApoderadosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/repositories/apoderados.http.repository";
  import { ClasesApoderadoEspecialesEnum } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/enums/ClasesApoderadoEspecialesEnum";

  // Valor Nominal
  import { UpdateValorNominalUseCase } from "~/core/hexag/registros/sociedades/application/use-cases/update-valor-nominal.use-case";
  import { ValorNominalHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/valor-nominal.http.repository";

  // Asignación de Acciones - Usamos $fetch directamente para no depender del código de producción
  // (su compañero está desarrollando este módulo, así que lo aislamos)

  // Para listar y obtener IDs
  import { ListAccionesUseCase } from "~/core/hexag/registros/sociedades/pasos/acciones/application/use-cases/list-acciones.use-case";
  import { ListAccionistasUseCase } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/use-cases/list-accionistas.use-case";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Seeds - Crear Sociedades de Prueba - PROBO",
  });

  const historialStore = useSociedadHistorialStore();

  // Repositorios y casos de uso
  const datosSociedadRepo = new DatosSociedadHttpRepository();
  const datosSociedadUseCase = new CreateDatosSociedadUseCase(datosSociedadRepo);

  const accionistasRepo = new AccionistasHttpRepository();
  const accionistasUseCase = new CreateAccionistaUseCase(accionistasRepo);

  const accionesRepo = new AccionesHttpRepository();
  const accionesUseCase = new CreateAccionUseCase(accionesRepo);

  const quorumRepo = new QuorumHttpRepository();
  const quorumUseCase = new CreateQuorumUseCase(quorumRepo);

  const directorioRepo = new DirectorioHttpRepository();
  const directorioUseCase = new UpdateDirectorioUseCase(directorioRepo);

  const sociedadRepo = new SociedadHttpRepository();
  const deleteSociedadUseCase = new DeleteSociedadUseCase(sociedadRepo);

  const directorRepo = new DirectorHttpRepository();
  const directorUseCase = new CreateDirectorUseCase(directorRepo);

  const apoderadosRepo = new ApoderadosHttpRepository();
  const listClasesApoderadoUseCase = new ListClasesApoderadoUseCase(apoderadosRepo);
  const apoderadoUseCase = new CreateApoderadoUseCase(apoderadosRepo);

  const valorNominalRepo = new ValorNominalHttpRepository();
  const valorNominalUseCase = new UpdateValorNominalUseCase(valorNominalRepo);

  // Helper para crear asignación de acciones directamente (aislado del código de producción)
  // Esto evita depender de los use cases que su compañero está desarrollando
  const createAsignacionAccionesDirect = async (
    societyId: string,
    payload: {
      id: string;
      accionId: string;
      accionistaId: string;
      cantidadSuscrita: number;
      precioPorAccion: number;
      porcentajePagadoPorAccion: number;
      totalDividendosPendientes: number;
      pagadoCompletamente: boolean;
      capitalSocial: number;  // ✅ Agregado
      prima: number;  // ✅ Agregado
    }
  ): Promise<void> => {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // Construir URL: /api/v2/society-profile/{societyId}/share-assignment
    const basePath = "/api/v2/society-profile";
    const candidates = [apiBase, origin, "http://localhost:3000"];

    let url = "";
    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        // Usar solo el origin del baseUrl, no la ruta completa
        const fullPath = `${basePath}/${societyId}/share-assignment`;
        url = new URL(fullPath, baseUrl.origin).toString();
        break;
      } catch {
        continue;
      }
    }

    // Fallback si no se pudo construir la URL
    if (!url) {
      url = `${basePath}/${societyId}/share-assignment`;
    }

    const authHeaders = withAuthHeaders({
      method: "POST" as const,
      body: payload,  // ✅ El payload ya incluye capitalSocial y prima
    });

    await $fetch(url, authHeaders);
  };

  const _listAccionistasUseCase = new ListAccionistasUseCase(accionistasRepo);
  const listAccionesUseCase = new ListAccionesUseCase(accionesRepo);

  // Estado
  const isCreating = ref(false);
  const createdSocieties = ref<
    Array<{
      id: string;
      name: string;
      steps: Record<string, { completed: boolean; error?: string }>;
    }>
  >([]);
  const currentStep = ref<string>("");
  const errorMessage = ref<string | null>(null);
  const currentSocietyIndex = ref<number | null>(null);

  // Función helper para generar UUIDs (igual que en AccionistaModal)
  const generateUUID = (): string => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Función helper para asegurar UUID (igual que en AccionistaModal)
  const _ensureUUID = (value?: string | null): string =>
    value && value.length > 0 ? value : generateUUID();

  // Datos de prueba
  const generateTestData = (index: number) => {
    const baseName = `Empresa Test ${index + 1}`;
    const ruc = `20${String(index + 1).padStart(7, "0")}${String(
      Math.floor(Math.random() * 100)
    ).padStart(2, "0")}`;

    return {
      datosSociedad: {
        numeroRuc: ruc,
        tipoSocietario: "S.A.C.",
        razonSocial: baseName,
        nombreComercial: `${baseName} S.A.C.`,
        direccion: `Av. Principal ${index + 1}`,
        distrito: "San Isidro",
        provincia: "Lima",
        departamento: "Lima",
        fechaInscripcionRuc: "01-01-2024",
        actividadExterior: "Comercio",
        fechaEscrituraPublica: "01-01-2024",
        fechaRegistrosPublicos: "01-01-2024",
        partidaRegistral: `1234${index}`,
        oficinaRegistral: "Lima",
      } as DatosSociedadDTO,

      accionistas: [
        {
          id: generateUUID(), // UUID para el accionista
          persona: {
            id: generateUUID(), // UUID para la persona
            tipo: "NATURAL",
            nombre: "Juan",
            apellidoPaterno: "Pérez",
            apellidoMaterno: "García",
            numeroDocumento: String(index * 2 + 1).padStart(8, "0"), // DNI con exactamente 8 dígitos
            tipoDocumento: "DNI",
            fechaNacimiento: "01-01-1990",
            nacionalidad: "Peruana",
            estadoCivil: "SOLTERO",
            direccion: "Av. Test 123",
            distrito: "San Isidro",
            provincia: "Lima",
            departamento: "Lima",
          } as Persona,
          participacionPorcentual: 60,
        },
        {
          id: generateUUID(), // UUID para el accionista
          persona: {
            id: generateUUID(), // UUID para la persona
            tipo: "NATURAL",
            nombre: "María",
            apellidoPaterno: "González",
            apellidoMaterno: "López",
            numeroDocumento: String(index * 2 + 2).padStart(8, "0"), // DNI con exactamente 8 dígitos
            tipoDocumento: "DNI",
            fechaNacimiento: "01-01-1992",
            nacionalidad: "Peruana",
            estadoCivil: "SOLTERO",
            direccion: "Av. Test 456",
            distrito: "Miraflores",
            provincia: "Lima",
            departamento: "Lima",
          } as Persona,
          participacionPorcentual: 40,
        },
      ] as AccionistaDTO[],

      // Valor nominal (debe crearse ANTES de las acciones)
      valorNominal: {
        valorNominal: 1.0, // Valor nominal por defecto para todas las sociedades de prueba
      },

      // Acción común (500 acciones)
      accion: {
        id: generateUUID(),
        tipo: TipoAccionEnum.COMUN,
        nombreAccion: "Acción Común",
        accionesSuscritas: 500,
        derechoVoto: true,
        redimible: false,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      } as AccionPayload,

      // Quórums y mayorías
      // Validaciones del backend:
      // - segundaConvocatoriaSimple >= quorumMinimoSimple
      // - segundaConvocatoriaCalificada >= quorumMinimoCalificado
      // - primeraConvocatoriaSimple >= quorumMinimoSimple
      // - primeraConvocatoriaCalificada >= quorumMinimoCalificado
      quorum: {
        quorumMinimoSimple: 50, // Mínimo para tomar acuerdos simples
        quorumMinimoCalificado: 60, // Mínimo para tomar acuerdos calificados
        primeraConvocatoriaSimple: 60, // >= quorumMinimoSimple (50) ✅
        primeraConvocatoriaCalificada: 60, // >= quorumMinimoCalificado (60) ✅
        segundaConvocatoriaSimple: 66, // >= quorumMinimoSimple (50) ✅
        segundaConvocatoriaCalificada: 66, // >= quorumMinimoCalificado (60) ✅
      } as QuorumDTO,

      // Directorio - Variar configuraciones según el índice
      // Empresa 0: cantidad fija (3), secretarioAsignado: true (junta designa), presidentePreside: true
      // Empresa 1: cantidad fija (3), secretarioAsignado: false (gerente general), presidentePreside: true
      // Empresa 2: cantidad personalizada (min: 3, max: 5), secretarioAsignado: true, presidentePreside: false
      // Empresa 3: cantidad personalizada (min: 3, max: 7), secretarioAsignado: false, presidentePreside: false
      // Empresa 4: cantidad fija (5), secretarioAsignado: true, presidentePreside: true
      ...(() => {
        const configs = [
          { cantidad: 3, personalizado: false, secretario: true, preside: true },
          { cantidad: 3, personalizado: false, secretario: false, preside: true },
          {
            cantidad: 3,
            personalizado: true,
            min: 3,
            max: 5,
            secretario: true,
            preside: false,
          },
          {
            cantidad: 3,
            personalizado: true,
            min: 3,
            max: 7,
            secretario: false,
            preside: false,
          },
          { cantidad: 5, personalizado: false, secretario: true, preside: true }, // ✅ EMPRESA 5: preside=true
        ];
        const config = configs[index % configs.length];
        if (!config) {
          throw new Error(`Config no encontrada para índice ${index}`);
        }
        const cantidadDirectores = config.cantidad;

        const nombres = ["Carlos", "Ana", "Luis", "María", "Pedro", "Laura", "Diego"];
        const apellidosP = [
          "Rodríguez",
          "Martínez",
          "Fernández",
          "García",
          "López",
          "Sánchez",
          "Torres",
        ];
        const apellidosM = [
          "Vargas",
          "Sánchez",
          "Torres",
          "González",
          "Pérez",
          "Ramírez",
          "Mendoza",
        ];

        return {
          directorio: {
            cantidadDirectores,
            conteoPersonalizado: config.personalizado,
            minimoDirectores: config.personalizado ? config.min ?? null : null,
            maximoDirectores: config.personalizado ? config.max ?? null : null,
            inicioMandato: "01-01-2025", // Formato dd-mm-aaaa
            finMandato: "01-01-2026", // Formato dd-mm-aaaa (exactamente 1 año después para periodo de 1 año)
            quorumMinimo: 2,
            mayoria: 2,
            presidenteDesignado: true,
            secretarioAsignado: config.secretario, // true = junta designa, false = gerente general
            reeleccionPermitida: true,
            presidentePreside: config.preside, // true = presidente del directorio preside la junta
            presidenteDesempata: true,
            periodo: "1", // El mapper convierte "1" -> "ONE_YEAR", "2" -> "TWO_YEARS", "3" -> "THREE_YEARS"
            // presidenteId se asignará después de crear los directores (usando el primer director titular)
            presidenteId: null, // Se actualizará con el ID del primer director titular en el paso 7
          } as DirectorioDTO,

          // Directores - Crear según la cantidad configurada
          directores: Array.from({ length: cantidadDirectores }, (_, i) => ({
            id: generateUUID(),
            persona: {
              id: generateUUID(),
              nombre: nombres[i % nombres.length],
              apellidoPaterno: apellidosP[i % apellidosP.length],
              apellidoMaterno: apellidosM[i % apellidosM.length],
              tipoDocumento: "DNI",
              numeroDocumento: String(index * 10 + i + 10).padStart(8, "0"), // DNI único
              paisEmision: "PE",
            },
            rolDirector: TipoDirector.TITULAR,
          })) as DirectorDTO[],
        };
      })(),

      // Apoderado (Gerente)
      claseApoderado: {
        id: generateUUID(),
        nombre: ClasesApoderadoEspecialesEnum.GERENTE_GENERAL, // ✅ Usar enum correcto: "Gerente General"
      } as ClaseApoderadoDTO,

      apoderado: {
        id: generateUUID(), // UUID para el apoderado
        claseApoderadoId: "", // Se llenará después de crear la clase
        persona: {
          id: generateUUID(), // UUID para la persona del apoderado
          tipo: "NATURAL",
          nombre: "Roberto",
          apellidoPaterno: "Silva",
          apellidoMaterno: "Mendoza",
          numeroDocumento: String(index * 6 + 6).padStart(8, "0"), // DNI con exactamente 8 dígitos
          tipoDocumento: "DNI",
          fechaNacimiento: "01-01-1985",
          nacionalidad: "Peruana",
          estadoCivil: "CASADO",
          direccion: "Av. Gerente 789",
          distrito: "San Isidro",
          provincia: "Lima",
          departamento: "Lima",
        } as Persona,
      } as ApoderadoDTO,
    };
  };

  const executeStep = async (
    stepName: string,
    stepKey: string,
    stepFn: () => Promise<void>
  ): Promise<{ completed: boolean; error?: string }> => {
    try {
      await stepFn();
      return { completed: true };
    } catch (error: any) {
      const errorMsg = error?.message || error?.data?.message || "Error desconocido";
      console.error(`[Seeds] Error en paso ${stepName}:`, error);
      return { completed: false, error: errorMsg };
    }
  };

  const createSociety = async (index: number) => {
    const testData = generateTestData(index);
    const steps: Record<string, { completed: boolean; error?: string }> = {};
    currentSocietyIndex.value = index;

    try {
      // Paso 0: Crear sociedad (root)
      currentStep.value = `[Sociedad ${index + 1}] Creando sociedad...`;
      const result0 = await executeStep("root", "root", async () => {
        const societyId = await historialStore.crearSociedad();
        if (!societyId) {
          throw new Error("No se pudo crear la sociedad");
        }
        // Guardar societyId para usar en los siguientes pasos
        (testData as any).societyId = societyId;
      });
      steps.root = result0;
      if (!result0.completed) {
        throw new Error(result0.error || "Error al crear la sociedad");
      }
      const societyId = (testData as any).societyId;

      // Paso 1: Datos principales
      currentStep.value = `[Sociedad ${index + 1}] Paso 1/8: Datos principales...`;
      steps.datosSociedad = await executeStep("datosSociedad", "datosSociedad", async () => {
        await datosSociedadUseCase.execute(societyId, testData.datosSociedad);
      });
      if (!steps.datosSociedad.completed) throw new Error(steps.datosSociedad.error);

      // Paso 2: Crear 2 accionistas naturales
      currentStep.value = `[Sociedad ${index + 1}] Paso 2/10: Accionistas...`;
      steps.accionistas = await executeStep("accionistas", "accionistas", async () => {
        const accionistasCreados: string[] = [];
        for (const accionista of testData.accionistas) {
          const creado = await accionistasUseCase.execute(societyId, accionista);
          accionistasCreados.push(creado.id);
        }
        // Guardar IDs de accionistas creados
        (testData as any).accionistasIds = accionistasCreados;
      });
      if (!steps.accionistas.completed) throw new Error(steps.accionistas.error);

      // Paso 2.5: Crear valor nominal (ANTES de las acciones)
      currentStep.value = `[Sociedad ${index + 1}] Paso 3/10: Valor nominal...`;
      steps.valorNominal = await executeStep("valorNominal", "valorNominal", async () => {
        await valorNominalUseCase.execute(societyId, testData.valorNominal);
      });
      if (!steps.valorNominal.completed) throw new Error(steps.valorNominal.error);

      // Paso 3: Crear 500 acciones comunes
      currentStep.value = `[Sociedad ${index + 1}] Paso 4/10: Acciones...`;
      let accionCreadaId: string | null = null;
      steps.acciones = await executeStep("acciones", "acciones", async () => {
        await accionesUseCase.execute(societyId, testData.accion);
        // Listar acciones para obtener el ID de la acción creada
        const acciones = await listAccionesUseCase.execute(societyId);
        const accionComun = acciones.find((a) => a.tipo === TipoAccionEnum.COMUN);
        if (!accionComun) {
          throw new Error("No se encontró la acción común creada");
        }
        accionCreadaId = accionComun.id;
        (testData as any).accionId = accionCreadaId;
      });
      if (!steps.acciones.completed) throw new Error(steps.acciones.error);

      // Paso 3.5: Asignar acciones a accionistas (300 para el primero, 200 para el segundo)
      currentStep.value = `[Sociedad ${index + 1}] Paso 5/10: Asignación de acciones...`;
      steps.asignacionAcciones = await executeStep(
        "asignacionAcciones",
        "asignacionAcciones",
        async () => {
          const accionistasIds = (testData as any).accionistasIds;
          const accionId = (testData as any).accionId;

          if (!accionistasIds || accionistasIds.length < 2 || !accionId) {
            throw new Error("Faltan IDs de accionistas o acción para asignar");
          }

          // Asignar 300 acciones al primer accionista (60%)
          await createAsignacionAccionesDirect(societyId, {
            id: generateUUID(),
            accionId,
            accionistaId: accionistasIds[0],
            cantidadSuscrita: 300,
            precioPorAccion: 1.0,
            porcentajePagadoPorAccion: 100,
            totalDividendosPendientes: 0,
            pagadoCompletamente: true,
            capitalSocial: 300 * 1.0,  // ✅ Campo requerido por backend
            prima: 0,  // ✅ Campo requerido por backend
          });

          // Asignar 200 acciones al segundo accionista (40%)
          await createAsignacionAccionesDirect(societyId, {
            id: generateUUID(),
            accionId,
            accionistaId: accionistasIds[1],
            cantidadSuscrita: 200,
            precioPorAccion: 1.0,
            porcentajePagadoPorAccion: 100,
            totalDividendosPendientes: 0,
            pagadoCompletamente: true,
            capitalSocial: 200 * 1.0,  // ✅ Campo requerido por backend
            prima: 0,  // ✅ Campo requerido por backend
          });
        }
      );
      // No lanzar error aquí, continuar con los siguientes pasos
      if (!steps.asignacionAcciones.completed) {
        console.warn(
          `[Seeds] Asignación de acciones falló pero continuamos: ${steps.asignacionAcciones.error}`
        );
      }

      // Paso 5: Quórums y mayorías
      currentStep.value = `[Sociedad ${index + 1}] Paso 6/10: Quórums y mayorías...`;
      steps.quorums = await executeStep("quorums", "quorums", async () => {
        await quorumUseCase.execute(societyId, testData.quorum);
      });
      if (!steps.quorums.completed) throw new Error(steps.quorums.error);

      // Paso 6: Crear directores PRIMERO (cantidad según configuración)
      // Necesitamos crear los directores antes de configurar el directorio para poder usar uno como presidente
      currentStep.value = `[Sociedad ${index + 1}] Paso 7/10: Creando ${
        testData.directores.length
      } directores...`;
      let primerDirectorId: string | null = null;
      steps.directores = await executeStep("directores", "directores", async () => {
        const directoresCreados: string[] = [];
        for (const director of testData.directores) {
          const directorCreado = await directorUseCase.execute(societyId, director);
          directoresCreados.push(directorCreado.id);
          // Guardar el ID del primer director titular como presidente
          if (!primerDirectorId && directorCreado.rolDirector === TipoDirector.TITULAR) {
            primerDirectorId = directorCreado.id;
            console.debug(
              `[Seeds] Primer director titular encontrado, ID: ${primerDirectorId}`
            );
          }
        }
        // Guardar IDs de directores creados
        (testData as any).directoresIds = directoresCreados;
        console.debug(
          `[Seeds] Directores creados: ${directoresCreados.length}, IDs:`,
          directoresCreados
        );
      });
      if (!steps.directores.completed) throw new Error(steps.directores.error);

      // Paso 7: Configurar directorio (PUT según el backend)
      // Ahora que tenemos los directores creados, podemos usar el primero como presidente
      currentStep.value = `[Sociedad ${index + 1}] Paso 8/10: Configuración del directorio...`;
      steps.directorio = await executeStep("directorio", "directorio", async () => {
        // Actualizar el directorio con el presidenteId del primer director titular
        const directorioConPresidente: DirectorioDTO = {
          ...testData.directorio,
          presidenteId: primerDirectorId, // Usar el ID del primer director titular como presidente
        };
        console.debug(`[Seeds] Configurando directorio para sociedad ${societyId}`, {
          ...directorioConPresidente,
          presidenteId: primerDirectorId,
        });
        await directorioUseCase.execute(societyId, directorioConPresidente);
        console.debug(
          `[Seeds] Directorio configurado exitosamente con presidenteId: ${primerDirectorId}`
        );
      });
      if (!steps.directorio.completed) {
        console.error(`[Seeds] Error configurando directorio: ${steps.directorio.error}`);
        // Continuar de todas formas
      }

      // Paso 8: Obtener clase "Gerente General" existente (se crea automáticamente al crear el perfil)
      currentStep.value = `[Sociedad ${index + 1}] Paso 9/10: Obteniendo clase Gerente General...`;
      let claseGerenteGeneral: any = null;
      const result8 = await executeStep("claseApoderado", "claseApoderado", async () => {
        console.debug(`[Seeds] Obteniendo clases de apoderado para sociedad ${societyId}`);
        const clases = await listClasesApoderadoUseCase.execute(societyId);
        console.debug(`[Seeds] Clases obtenidas:`, clases);
        
        // Buscar "Gerente General" en las clases existentes
        claseGerenteGeneral = clases.find(
          (clase) => clase.nombre === ClasesApoderadoEspecialesEnum.GERENTE_GENERAL
        );
        
        if (!claseGerenteGeneral) {
          throw new Error(
            `No se encontró la clase "Gerente General". Clases disponibles: ${clases.map((c) => c.nombre).join(", ")}`
          );
        }
        
        console.debug(`[Seeds] Clase "Gerente General" encontrada:`, claseGerenteGeneral);
      });
      steps.claseApoderado = result8;
      if (!result8.completed) {
        console.error(`[Seeds] Error obteniendo clase de apoderado: ${result8.error}`);
        // Continuar de todas formas, pero no podremos crear el apoderado sin la clase
      }

      // Paso 9: Crear apoderado (Gerente General)
      currentStep.value = `[Sociedad ${index + 1}] Paso 10/10: Gerente General...`;
      if (claseGerenteGeneral?.id) {
        testData.apoderado.claseApoderadoId = claseGerenteGeneral.id;
        steps.apoderado = await executeStep("apoderado", "apoderado", async () => {
          console.debug(
            `[Seeds] Creando gerente general para sociedad ${societyId}`,
            testData.apoderado
          );
          await apoderadoUseCase.execute(societyId, testData.apoderado);
          console.debug(`[Seeds] Gerente general creado exitosamente`);
        });
        if (!steps.apoderado.completed) {
          console.error(`[Seeds] Error creando gerente general: ${steps.apoderado.error}`);
        }
      } else {
        steps.apoderado = {
          completed: false,
          error: "No se pudo obtener la clase 'Gerente General'",
        };
        console.warn(`[Seeds] No se puede crear gerente general sin la clase`);
      }

      createdSocieties.value.push({
        id: societyId,
        name: testData.datosSociedad.razonSocial,
        steps,
      });

      return { success: true, societyId };
    } catch (error: any) {
      console.error(`[Seeds] Error creando sociedad ${index + 1}:`, error);
      const errorMsg = error?.message || "Error desconocido";
      errorMessage.value = `Error en sociedad ${index + 1}: ${errorMsg}`;

      // Agregar la sociedad incluso si falló, para mostrar qué pasos se completaron
      if (!createdSocieties.value.find((s) => s.id === (testData as any).societyId)) {
        createdSocieties.value.push({
          id: (testData as any).societyId || `error-${index}`,
          name: testData.datosSociedad.razonSocial,
          steps,
        });
      }

      return { success: false, error: errorMsg };
    } finally {
      if (currentSocietyIndex.value === index) {
        currentSocietyIndex.value = null;
      }
    }
  };

  const createMultipleSocieties = async (count: number = 5) => {
    isCreating.value = true;
    errorMessage.value = null;
    createdSocieties.value = [];
    currentStep.value = "";

    try {
      for (let i = 0; i < count; i++) {
        await createSociety(i);
        // Pequeña pausa entre creaciones
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Recargar historial
      await historialStore.cargarHistorial();
    } catch (error: any) {
      console.error("[Seeds] Error general:", error);
      errorMessage.value = error?.message || "Error desconocido";
    } finally {
      isCreating.value = false;
      currentStep.value = "";
    }
  };

  const totalSteps = computed(() => {
    return createdSocieties.value.reduce((acc, society) => {
      return acc + Object.keys(society.steps).length;
    }, 0);
  });

  const completedSteps = computed(() => {
    return createdSocieties.value.reduce((acc, society) => {
      return acc + Object.values(society.steps).filter((step) => step.completed).length;
    }, 0);
  });

  const failedSteps = computed(() => {
    return createdSocieties.value.reduce((acc, society) => {
      return (
        acc +
        Object.values(society.steps).filter((step) => !step.completed && step.error).length
      );
    }, 0);
  });

  // Función para eliminar todas las sociedades creadas desde el test
  const deleteAllCreatedSocieties = async () => {
    if (createdSocieties.value.length === 0) {
      return;
    }

    const confirmed = confirm(
      `¿Estás seguro de eliminar las ${createdSocieties.value.length} sociedades creadas desde este test?`
    );
    if (!confirmed) {
      return;
    }

    isCreating.value = true;
    currentStep.value = "Eliminando sociedades...";
    const errors: string[] = [];

    try {
      for (const society of createdSocieties.value) {
        try {
          await deleteSociedadUseCase.execute(society.id);
          console.debug(`[Seeds] Sociedad ${society.id} eliminada`);
        } catch (error: any) {
          const errorMsg = error?.message || "Error desconocido";
          errors.push(`${society.name} (${society.id}): ${errorMsg}`);
          console.error(`[Seeds] Error eliminando sociedad ${society.id}:`, error);
        }
      }

      // Limpiar el array de sociedades creadas
      createdSocieties.value = [];

      // Recargar historial
      await historialStore.cargarHistorial();

      if (errors.length > 0) {
        errorMessage.value = `Algunas sociedades no se pudieron eliminar:\n${errors.join(
          "\n"
        )}`;
      } else {
        errorMessage.value = null;
      }
    } catch (error: any) {
      console.error("[Seeds] Error general al eliminar:", error);
      errorMessage.value = error?.message || "Error desconocido al eliminar";
    } finally {
      isCreating.value = false;
      currentStep.value = "";
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="t-h3 font-primary font-bold text-primary-800">
          Seeds - Crear Sociedades de Prueba
        </h1>
        <p class="mt-2 t-t1 font-secondary text-gray-600">
          Página de desarrollo para crear sociedades completas automáticamente con datos de
          prueba.
        </p>
      </div>
    </div>

    <!-- Panel de Control -->
    <Card class="border border-primary-400/40 bg-primary-75/20">
      <CardHeader>
        <CardTitle class="t-h6 font-primary font-semibold text-primary-800">
          Panel de Control
        </CardTitle>
        <CardDescription class="t-t1 font-secondary text-gray-600 max-w-2xl">
          Crea múltiples sociedades con datos completos para testing. Los datos se generan
          automáticamente. Cada empresa tiene configuraciones diferentes de directorio para
          probar todos los escenarios.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-4 flex-wrap">
          <Button
            variant="primary"
            size="lg"
            :disabled="isCreating"
            @click="createMultipleSocieties(5)"
          >
            <LoaderCircle v-if="isCreating" class="mr-2 h-4 w-4 animate-spin" />
            <Building2 v-else class="mr-2 h-4 w-4" />
            Crear 5 Sociedades de Prueba
          </Button>

          <Button
            variant="outline"
            size="lg"
            :disabled="isCreating"
            @click="createMultipleSocieties(1)"
          >
            Crear 1 Sociedad
          </Button>

          <Button
            v-if="createdSocieties.length > 0"
            variant="destructive"
            size="lg"
            :disabled="isCreating"
            @click="deleteAllCreatedSocieties"
          >
            <XCircle class="mr-2 h-4 w-4" />
            Eliminar Todas las Sociedades ({{ createdSocieties.length }})
          </Button>
        </div>

        <div v-if="currentStep" class="rounded-lg bg-primary-50 border border-primary-200 p-4">
          <p class="t-t2 font-secondary font-medium text-primary-800">{{ currentStep }}</p>
        </div>

        <div v-if="errorMessage" class="rounded-lg bg-red-50 border border-red-200 p-4">
          <p class="t-t2 font-secondary font-medium text-red-800">{{ errorMessage }}</p>
        </div>

        <div v-if="createdSocieties.length > 0" class="mt-4 space-y-2">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="t-t2 font-secondary font-medium text-gray-700">Progreso:</span>
              <span
                class="inline-flex items-center rounded-full bg-green-100 border border-green-200 px-3 py-1 t-t2 font-secondary font-medium text-green-700"
              >
                {{ completedSteps }} / {{ totalSteps }} completados
              </span>
            </div>
            <div v-if="failedSteps > 0" class="flex items-center gap-2">
              <span class="t-t2 font-secondary font-medium text-gray-700">Errores:</span>
              <span
                class="inline-flex items-center rounded-full bg-red-100 border border-red-200 px-3 py-1 t-t2 font-secondary font-medium text-red-700"
              >
                {{ failedSteps }} fallidos
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Lista de Sociedades Creadas -->
    <Card v-if="createdSocieties.length > 0" class="border border-primary-400/40">
      <CardHeader>
        <CardTitle class="t-h6 font-primary font-semibold text-primary-800">
          Sociedades Creadas ({{ createdSocieties.length }})
        </CardTitle>
        <CardDescription class="t-t1 font-secondary text-gray-600">
          Lista de sociedades creadas con sus pasos completados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="society in createdSocieties"
            :key="society.id"
            class="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <Building2 class="h-5 w-5 text-primary-600 shrink-0" />
                  <h3 class="t-h6 font-primary font-semibold text-gray-900">
                    {{ society.name }}
                  </h3>
                  <span
                    class="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 t-t2 font-secondary font-medium text-gray-700"
                  >
                    ID: {{ society.id }}
                  </span>
                </div>

                <div class="mt-3 space-y-2">
                  <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
                    <div
                      v-for="stepInfo in [
                        { key: 'root', label: 'Root', step: society.steps.root },
                        {
                          key: 'datosSociedad',
                          label: 'Datos',
                          step: society.steps.datosSociedad,
                        },
                        {
                          key: 'accionistas',
                          label: 'Accionistas',
                          step: society.steps.accionistas,
                        },
                        { key: 'acciones', label: 'Acciones', step: society.steps.acciones },
                        {
                          key: 'asignacionAcciones',
                          label: 'Asignación',
                          step: society.steps.asignacionAcciones,
                        },
                        { key: 'quorums', label: 'Quórums', step: society.steps.quorums },
                        {
                          key: 'directorio',
                          label: 'Directorio',
                          step: society.steps.directorio,
                        },
                        {
                          key: 'directores',
                          label: 'Directores',
                          step: society.steps.directores,
                        },
                        {
                          key: 'claseApoderado',
                          label: 'Clase Apoderado',
                          step: society.steps.claseApoderado,
                        },
                        { key: 'apoderado', label: 'Gerente', step: society.steps.apoderado },
                      ]"
                      :key="stepInfo.key"
                      class="flex items-center gap-2 rounded-md p-2 transition-colors"
                      :class="{
                        'bg-green-50': stepInfo.step?.completed,
                        'bg-red-50':
                          stepInfo.step && !stepInfo.step.completed && stepInfo.step.error,
                        'bg-gray-50':
                          !stepInfo.step || (!stepInfo.step.completed && !stepInfo.step.error),
                      }"
                    >
                      <CheckCircle2
                        v-if="stepInfo.step?.completed"
                        class="h-4 w-4 text-green-500"
                      />
                      <XCircle v-else-if="stepInfo.step?.error" class="h-4 w-4 text-red-500" />
                      <XCircle v-else class="h-4 w-4 text-gray-300" />
                      <span
                        class="text-sm font-medium"
                        :class="{
                          'text-green-700': stepInfo.step?.completed,
                          'text-red-700':
                            stepInfo.step && !stepInfo.step.completed && stepInfo.step.error,
                          'text-gray-600':
                            !stepInfo.step ||
                            (!stepInfo.step.completed && !stepInfo.step.error),
                        }"
                      >
                        {{ stepInfo.label }}
                      </span>
                    </div>
                  </div>

                  <!-- Mostrar errores de pasos fallidos -->
                  <div
                    v-if="Object.values(society.steps).some((step) => step?.error)"
                    class="mt-3 space-y-1 rounded-md bg-red-50 border border-red-200 p-3"
                  >
                    <p class="t-t2 font-secondary font-semibold text-red-800">
                      Errores encontrados:
                    </p>
                    <template v-for="(step, stepKey) in society.steps" :key="stepKey">
                      <div v-if="step?.error" class="t-t2 font-secondary text-red-700">
                        <span class="font-semibold">{{ stepKey }}:</span>
                        {{ step.error }}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
