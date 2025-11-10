import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import { EntityCoinEnum } from "~/types/enums/EntityCoinEnum";
import { TiemposVigenciaEnum } from "~/types/enums/TiemposVigenciaEnum";
import { TipoFirmasEnum } from "~/types/enums/TipoFirmasEnum";
import { TipoMontoEnum } from "~/types/enums/TipoMontoEnum";
import type {
  ApoderadoFacultad,
  ApoderadoFacultadRow,
  Facultad,
} from "../types/apoderadosFacultades";
import type { TipoFacultad, TipoFacultadRow } from "../types/facultades";

export const useRegimenFacultadesStore = defineStore("regimenFacultades", {
  state: (): State => ({
    tipoFacultades: [
      { id: "1", tipoFacultades: "Facultades Administrativas" },
      { id: "2", tipoFacultades: "Facultades Bancarias" },
    ],
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
            vigencia: TiemposVigenciaEnum.INDEFINIDO,
            reglasYLimites: false,
          },
          // Indefinido + Con reglas (Sola firma)
          {
            id: "f2",
            nombre: "Facultades Bancarias",
            esIrrevocable: false,
            vigencia: TiemposVigenciaEnum.INDEFINIDO,
            reglasYLimites: true,
            tipoMoneda: EntityCoinEnum.SOLES,
            limiteMonetario: [
              {
                id: "l1",
                desde: 0,
                tipoMonto: TipoMontoEnum.MONTO,
                hasta: 50000,
                tipoFirma: TipoFirmasEnum.SOLA_FIRMA,
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
            vigencia: TiemposVigenciaEnum.DETERMIADO,
            fecha_inicio: "2024-01-01",
            fecha_fin: "2024-12-31",
            reglasYLimites: true,
            tipoMoneda: EntityCoinEnum.DOLARES,
            limiteMonetario: [
              {
                id: "l2",
                desde: 10000,
                tipoMonto: TipoMontoEnum.MONTO,
                hasta: 50000,
                tipoFirma: TipoFirmasEnum.FIRMA_CONJUNTA,
                firmantes: [
                  { id: "f1", cantidad: 1, grupo: "Apoderado Grupo A" },
                  { id: "f2", cantidad: 2, grupo: "Apoderado Grupo B" },
                ],
              },
              {
                id: "l3",
                desde: 50000,
                tipoMonto: TipoMontoEnum.SIN_LIMITE,
                hasta: 0,
                tipoFirma: TipoFirmasEnum.FIRMA_CONJUNTA,
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
            vigencia: TiemposVigenciaEnum.DETERMIADO,
            fecha_inicio: "2024-06-01",
            fecha_fin: "2025-06-01",
            reglasYLimites: false,
          },
          // Indefinido + Con reglas complejas
          {
            id: "f5",
            nombre: "Facultades Mineras",
            esIrrevocable: false,
            vigencia: TiemposVigenciaEnum.INDEFINIDO,
            reglasYLimites: true,
            tipoMoneda: EntityCoinEnum.SOLES,
            limiteMonetario: [
              {
                id: "l4",
                desde: 0,
                tipoMonto: TipoMontoEnum.MONTO,
                hasta: 100000,
                tipoFirma: TipoFirmasEnum.SOLA_FIRMA,
              },
              {
                id: "l5",
                desde: 100000,
                tipoMonto: TipoMontoEnum.MONTO,
                hasta: 500000,
                tipoFirma: TipoFirmasEnum.FIRMA_CONJUNTA,
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
            vigencia: TiemposVigenciaEnum.DETERMIADO,
            fecha_inicio: "2024-03-15",
            fecha_fin: "2026-03-15",
            reglasYLimites: true,
            tipoMoneda: EntityCoinEnum.DOLARES,
            limiteMonetario: [
              {
                id: "l6",
                desde: 0,
                tipoMonto: TipoMontoEnum.MONTO,
                hasta: 5000,
                tipoFirma: TipoFirmasEnum.SOLA_FIRMA,
              },
              {
                id: "l7",
                desde: 5000,
                tipoMonto: TipoMontoEnum.MONTO,
                hasta: 25000,
                tipoFirma: TipoFirmasEnum.FIRMA_CONJUNTA,
                firmantes: [{ id: "f6", cantidad: 2, grupo: "Apoderado Grupo B" }],
              },
              {
                id: "l8",
                desde: 25000,
                tipoMonto: TipoMontoEnum.SIN_LIMITE,
                hasta: 0,
                tipoFirma: TipoFirmasEnum.FIRMA_CONJUNTA,
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
            vigencia: TiemposVigenciaEnum.INDEFINIDO,
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
            facultad.vigencia === TiemposVigenciaEnum.INDEFINIDO
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
                  limite.tipoMonto === TipoMontoEnum.SIN_LIMITE
                    ? "Sin límite"
                    : String(limite.hasta),
                tipo_firma: limite.tipoFirma,
                firmantes:
                  limite.tipoFirma === TipoFirmasEnum.FIRMA_CONJUNTA ? limite.firmantes : [],
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
    //tipo facultad
    agregarTipoFacultad(tipoFacultad: TipoFacultad) {
      this.tipoFacultades.push(tipoFacultad);
    },

    editarTipoFacultad(tipoFacultad: TipoFacultad) {
      const index = this.tipoFacultades.findIndex(
        (facultad) => facultad.id === tipoFacultad.id
      );

      if (index !== -1) {
        this.tipoFacultades[index] = tipoFacultad;
      }
    },

    eliminarTipoFacultad(id: string) {
      this.tipoFacultades = this.tipoFacultades.filter((facultad) => facultad.id !== id);
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
  },
});

interface State {
  tipoFacultades: TipoFacultad[];
  apoderadosFacultades: ApoderadoFacultad[];
}
