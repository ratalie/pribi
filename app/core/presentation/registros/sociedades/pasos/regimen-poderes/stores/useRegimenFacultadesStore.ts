import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import {
  CreateTiposFacultadesUseCase,
  DeleteTiposFacultadesUseCase,
  ListTiposFacultadesUseCase,
  UpdateTiposFacultadesUseCase,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/application";
import {
  EntityCoinUIEnum,
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  TipoMontoUIEnum,
  type ApoderadoFacultad,
  type Facultad,
  type TipoFacultad,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import { TiposFacultadesMapper } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/mappers/tipos-facultades.mapper";
import { RegimenFacultadesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/repository/regimen-facultades.http.repository";
import type { ApoderadoFacultadRow } from "../types/apoderadosFacultades";
import type { TipoFacultadRow } from "../types/facultades";

const repository = new RegimenFacultadesHttpRepository();

const listTipoFacultadesUseCase = new ListTiposFacultadesUseCase(repository);
const createTipoFacultadUseCase = new CreateTiposFacultadesUseCase(repository);
const updateTipoFacultadUseCase = new UpdateTiposFacultadesUseCase(repository);
const deleteTipoFacultadUseCase = new DeleteTiposFacultadesUseCase(repository);

export const useRegimenFacultadesStore = defineStore("regimenFacultades", {
  state: (): State => ({
    tipoFacultades: [],
    apoderadosFacultades: [
      {
        id: "1",
        nombre: "Gerente General",
        facultades: [
          // Indefinido + Sin reglas
          {
            id: "f1",
            nombre: "Facultades Administrativas",
            esIrrevocable: false,
            vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
            reglasYLimites: false,
          },
          // Indefinido + Con reglas (Sola firma)
          {
            id: "f2",
            nombre: "Facultades Bancarias",
            esIrrevocable: false,
            vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
            reglasYLimites: true,
            tipoMoneda: EntityCoinUIEnum.SOLES,
            limiteMonetario: [
              {
                id: "l1",
                desde: 0,
                tipoMonto: TipoMontoUIEnum.MONTO,
                hasta: 50000,
                tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
              },
            ],
          },
        ],
      },
      {
        id: "2",
        nombre: "Apoderado de Grupo A",
        facultades: [
          // Determinado + Con reglas (Firma conjunta)
          {
            id: "f3",
            nombre: "Facultades Comerciales",
            esIrrevocable: true,
            vigencia: TiempoVigenciaUIEnum.DETERMINADO,  // ✅ Typo corregido
            fecha_inicio: "2024-01-01",
            fecha_fin: "2024-12-31",
            reglasYLimites: true,
            tipoMoneda: EntityCoinUIEnum.DOLARES,
            limiteMonetario: [
              {
                id: "l2",
                desde: 10000,
                tipoMonto: TipoMontoUIEnum.MONTO,
                hasta: 50000,
                tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                firmantes: [
                  { id: "f1", cantidad: 1, grupo: "Apoderado Grupo A" },
                  { id: "f2", cantidad: 2, grupo: "Apoderado Grupo B" },
                ],
              },
              {
                id: "l3",
                desde: 50000,
                tipoMonto: TipoMontoUIEnum.SIN_LIMITE,
                hasta: 0,
                tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                firmantes: [
                  { id: "f3", cantidad: 2, grupo: "Apoderado Grupo A" },
                  { id: "f4", cantidad: 1, grupo: "Gerente General" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "3",
        nombre: "Apoderado de Grupo B",
        facultades: [
          // Determinado + Sin reglas
          {
            id: "f4",
            nombre: "Facultades Industriales",
            esIrrevocable: true,
            vigencia: TiempoVigenciaUIEnum.DETERMINADO,  // ✅ Typo corregido
            fecha_inicio: "2024-06-01",
            fecha_fin: "2025-06-01",
            reglasYLimites: false,
          },
          // Indefinido + Con reglas complejas
          {
            id: "f5",
            nombre: "Facultades Mineras",
            esIrrevocable: false,
            vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
            reglasYLimites: true,
            tipoMoneda: EntityCoinUIEnum.SOLES,
            limiteMonetario: [
              {
                id: "l4",
                desde: 0,
                tipoMonto: TipoMontoUIEnum.MONTO,
                hasta: 100000,
                tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
              },
              {
                id: "l5",
                desde: 100000,
                tipoMonto: TipoMontoUIEnum.MONTO,
                hasta: 500000,
                tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                firmantes: [{ id: "f5", cantidad: 1, grupo: "Apoderado Grupo A" }],
              },
            ],
          },
        ],
      },
      {
        id: "4",
        nombre: "Apoderado de Grupo C",
        facultades: [
          // Determinado + Con reglas (múltiples escalas)
          {
            id: "f6",
            nombre: "Facultades Forestales",
            esIrrevocable: true,
            vigencia: TiempoVigenciaUIEnum.DETERMINADO,  // ✅ Typo corregido
            fecha_inicio: "2024-03-15",
            fecha_fin: "2026-03-15",
            reglasYLimites: true,
            tipoMoneda: EntityCoinUIEnum.DOLARES,
            limiteMonetario: [
              {
                id: "l6",
                desde: 0,
                tipoMonto: TipoMontoUIEnum.MONTO,
                hasta: 5000,
                tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
              },
              {
                id: "l7",
                desde: 5000,
                tipoMonto: TipoMontoUIEnum.MONTO,
                hasta: 25000,
                tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                firmantes: [{ id: "f6", cantidad: 2, grupo: "Apoderado Grupo B" }],
              },
              {
                id: "l8",
                desde: 25000,
                tipoMonto: TipoMontoUIEnum.SIN_LIMITE,
                hasta: 0,
                tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                firmantes: [
                  { id: "f7", cantidad: 1, grupo: "Gerente General" },
                  { id: "f8", cantidad: 2, grupo: "Apoderado Grupo A" },
                  { id: "f9", cantidad: 1, grupo: "Apoderado Grupo B" },
                  { id: "f10", cantidad: 1, grupo: "Apoderado Grupo B" },
                ],
              },
            ],
          },
          // Indefinido + Sin reglas
          {
            id: "f7",
            nombre: "Facultades Agrícolas",
            esIrrevocable: false,
            vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
            reglasYLimites: false,
          },
        ],
      },
    ],
    otrosApoderados: [
      {
        id: "o1",
        nombre: "María Elena Rodríguez López",
        facultades: [
          {
            id: "fo1",
            nombre: "Facultades Administrativas",
            esIrrevocable: false,
            vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
            reglasYLimites: false,
          },
        ],
      },
      {
        id: "o2",
        nombre: "Carlos Alberto Mendoza Quispe",
        facultades: [
          {
            id: "fo2",
            nombre: "Facultades Bancarias",
            esIrrevocable: true,
            vigencia: TiempoVigenciaUIEnum.DETERMINADO,  // ✅ Typo corregido
            fecha_inicio: "2024-01-15",
            fecha_fin: "2025-01-15",
            reglasYLimites: true,
            tipoMoneda: EntityCoinUIEnum.SOLES,
            limiteMonetario: [
              {
                id: "lo1",
                desde: 0,
                tipoMonto: TipoMontoUIEnum.MONTO,
                hasta: 30000,
                tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
              },
              {
                id: "lo2",
                desde: 30000,
                tipoMonto: TipoMontoUIEnum.SIN_LIMITE,
                hasta: 0,
                tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                firmantes: [{ id: "fo1", cantidad: 1, grupo: "Gerente General" }],
              },
            ],
          },
        ],
      },
      {
        id: "o3",
        nombre: "Ana Patricia Flores Vargas",
        facultades: [
          {
            id: "fo3",
            nombre: "Facultades Comerciales",
            esIrrevocable: true,
            vigencia: TiempoVigenciaUIEnum.DETERMINADO,  // ✅ Typo corregido
            fecha_inicio: "2024-06-01",
            fecha_fin: "2024-12-31",
            reglasYLimites: true,
            tipoMoneda: EntityCoinUIEnum.DOLARES,
            limiteMonetario: [
              {
                id: "lo3",
                desde: 0,
                tipoMonto: TipoMontoUIEnum.MONTO,
                hasta: 10000,
                tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
              },
            ],
          },
          {
            id: "fo4",
            nombre: "Facultades Administrativas",
            esIrrevocable: false,
            vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
            reglasYLimites: false,
          },
        ],
      },
    ],
  }),

  getters: {
    tablaTipoFacultades(): TipoFacultadRow[] {
      return this.tipoFacultades.map((facultad, index) => ({
        id: facultad.id,
        table_id: index + 1,
        tipo_facultades: facultad.tipoFacultades,
        numero_apoderados: 0,
      }));
    },

    tablaApoderadosFacultades(): ApoderadoFacultadRow[] {
      return this.apoderadosFacultades.map((apoderado) => ({
        id: apoderado.id,
        nombre: apoderado.nombre,
        facultades: apoderado.facultades.map((facultad) => {
          // Vigencia
          const vigencia =
            facultad.vigencia === TiempoVigenciaUIEnum.INDEFINIDO
              ? "Indefinido"
              : `${facultad.fecha_inicio} - ${facultad.fecha_fin}`;

          // Reglas de Firma
          const reglas_firma = facultad.reglasYLimites ? facultad.limiteMonetario.length : 0;

          // Reglas y Límites
          const reglas_y_limites = facultad.reglasYLimites
            ? facultad.limiteMonetario.map((limite, index) => ({
                id: limite.id,
                table_id: index + 1,
                desde: String(limite.desde),
                hasta:
                  limite.tipoMonto === TipoMontoUIEnum.SIN_LIMITE
                    ? "Sin límite"
                    : String(limite.hasta),
                tipo_firma: limite.tipoFirma,
                firmantes:
                  limite.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA ? limite.firmantes : [],
              }))
            : [];

          return {
            id: facultad.id,
            facultad: facultad.nombre,
            vigencia: vigencia,
            reglas_firma: reglas_firma,
            reglas_y_limites: reglas_y_limites,
          };
        }),
      }));
    },

    tablaOtrosApoderadosFacultades(): ApoderadoFacultadRow[] {
      return this.otrosApoderados.map((apoderado) => ({
        id: apoderado.id,
        nombre: apoderado.nombre,
        facultades: apoderado.facultades.map((facultad) => {
          const vigencia =
            facultad.vigencia === TiempoVigenciaUIEnum.INDEFINIDO
              ? "Indefinido"
              : `${facultad.fecha_inicio} - ${facultad.fecha_fin}`;

          const reglas_firma = facultad.reglasYLimites ? facultad.limiteMonetario.length : 0;

          const reglas_y_limites = facultad.reglasYLimites
            ? facultad.limiteMonetario.map((limite, index) => ({
                id: limite.id,
                table_id: index + 1,
                desde: String(limite.desde),
                hasta:
                  limite.tipoMonto === TipoMontoUIEnum.SIN_LIMITE
                    ? "Sin límite"
                    : String(limite.hasta),
                tipo_firma: limite.tipoFirma,
                firmantes:
                  limite.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA ? limite.firmantes : [],
              }))
            : [];

          return {
            id: facultad.id,
            facultad: facultad.nombre,
            vigencia: vigencia,
            reglas_firma: reglas_firma,
            reglas_y_limites: reglas_y_limites,
          };
        }),
      }));
    },

    listaFacultadesOptions(): BaseSelectOption[] {
      return this.tipoFacultades.map((facultad) => ({
        id: facultad.id,
        value: facultad.id,
        label: facultad.tipoFacultades,
      }));
    },
  },

  actions: {
    //tipo
    async loadTipoFacultades(profileId: string) {
      try {
        const tiposFacultades = await listTipoFacultadesUseCase.execute(profileId);

        this.tipoFacultades = tiposFacultades;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async agregarTipoFacultad(profileId: string, tipoFacultad: TipoFacultad) {
      try {
        const payload = TiposFacultadesMapper.deEntityAPayload(tipoFacultad);

        await createTipoFacultadUseCase.execute(profileId, payload);

        this.tipoFacultades.push(tipoFacultad);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async editarTipoFacultad(profileId: string, tipoFacultad: TipoFacultad) {
      try {
        const payload = TiposFacultadesMapper.deEntityAPayload(tipoFacultad);

        await updateTipoFacultadUseCase.execute(profileId, payload);

        const index = this.tipoFacultades.findIndex(
          (facultad) => facultad.id === tipoFacultad.id
        );

        if (index !== -1) {
          this.tipoFacultades[index] = tipoFacultad;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async eliminarTipoFacultad(profileId: string, id: string) {
      try {
        await deleteTipoFacultadUseCase.execute(profileId, [id]);

        this.tipoFacultades = this.tipoFacultades.filter((facultad) => facultad.id !== id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    //apoderado facultad
    agregarFacultadApoderado(idApoderado: string, nuevaFacultad: Facultad) {
      const apoderado = this.apoderadosFacultades.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el apoderado con id: ${idApoderado}`);
        return;
      }

      apoderado.facultades.push(nuevaFacultad);
    },

    editarFacultadApoderado(
      idApoderado: string,
      idFacultad: string,
      facultadActualizada: Facultad
    ) {
      const apoderado = this.apoderadosFacultades.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el apoderado con id: ${idApoderado}`);
        return;
      }

      const index = apoderado.facultades.findIndex((f) => f.id === idFacultad);

      if (index === -1) {
        console.error(`No se encontró la facultad con id: ${idFacultad}`);
        return;
      }

      apoderado.facultades[index] = facultadActualizada;
    },

    eliminarFacultadApoderado(idApoderado: string, idFacultad: string) {
      const apoderado = this.apoderadosFacultades.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el apoderado con id: ${idApoderado}`);
        return;
      }

      apoderado.facultades = apoderado.facultades.filter((f) => f.id !== idFacultad);
    },

    //otros apoderados facultad
    agregarFacultadOtroApoderado(idApoderado: string, nuevaFacultad: Facultad) {
      const apoderado = this.otrosApoderados.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el otro apoderado con id: ${idApoderado}`);
        return;
      }

      apoderado.facultades.push(nuevaFacultad);
    },

    editarFacultadOtroApoderado(
      idApoderado: string,
      idFacultad: string,
      facultadActualizada: Facultad
    ) {
      const apoderado = this.otrosApoderados.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el otro apoderado con id: ${idApoderado}`);
        return;
      }

      const index = apoderado.facultades.findIndex((f) => f.id === idFacultad);

      if (index === -1) {
        console.error(`No se encontró la facultad con id: ${idFacultad}`);
        return;
      }

      apoderado.facultades[index] = facultadActualizada;
    },

    eliminarFacultadOtroApoderado(idApoderado: string, idFacultad: string) {
      const apoderado = this.otrosApoderados.find((a) => a.id === idApoderado);

      if (!apoderado) {
        console.error(`No se encontró el otro apoderado con id: ${idApoderado}`);
        return;
      }

      apoderado.facultades = apoderado.facultades.filter((f) => f.id !== idFacultad);
    },
  },
});

interface State {
  tipoFacultades: TipoFacultad[];
  apoderadosFacultades: ApoderadoFacultad[];
  otrosApoderados: ApoderadoFacultad[];
}
