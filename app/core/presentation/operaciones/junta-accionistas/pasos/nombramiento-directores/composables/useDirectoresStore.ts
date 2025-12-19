import { defineStore } from "pinia";

export interface DirectorData {
  nombreCompleto: string;
  personaId?: string; // ✅ ID único de la persona (person.id) - usado para hacer match con votos
  tipoDirector: "titular" | "suplente" | "alterno";
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte?: string;
  reemplazaId?: string;
  candidato: boolean;
}

export interface VotoAsignado {
  candidatoNombreCompleto: string;
  candidatoPersonaId?: string; // ✅ ID único de la persona - usado para hacer match (más robusto que nombreCompleto)
  accionistaIndex: number;
  cantidad: number;
}

export const useDirectoresStore = defineStore("directores", {
  state: (): {
    directoresData: DirectorData[];
    cantidadDirectores: number;
    cuposDisponibles: number | null; // ✅ Cupos calculados correctamente (null = usar cálculo por defecto)
    votosAsignados: VotoAsignado[];
    hayEmpate: boolean;
    metodoVotacion: "unanimidad" | "mayoria";
    candidatosSeleccionadosUnanimidad: string[];
  } => ({
    directoresData: [],
    cantidadDirectores: 5,
    cuposDisponibles: null, // ✅ null = calcular automáticamente, o usar valor explícito
    votosAsignados: [],
    hayEmpate: false,
    metodoVotacion: "unanimidad",
    candidatosSeleccionadosUnanimidad: [],
  }),

  getters: {
    directoresTitulares: (state) =>
      state.directoresData.filter((d) => d.tipoDirector === "titular"),

    directoresTitularesCandidatos: (state) =>
      state.directoresData.filter((d) => d.tipoDirector === "titular" && d.candidato === true),

    directoresTitularesNoCandidatos: (state) =>
      state.directoresData.filter(
        (d) => d.tipoDirector === "titular" && d.candidato === false
      ),

    cantidadDisponibles: (state) => {
      // ✅ Si se estableció cuposDisponibles explícitamente, usarlo
      if (state.cuposDisponibles !== null) {
        return state.cuposDisponibles;
      }

      // ✅ Cálculo por defecto: cantidadDirectores - directoresNoCandidatos
      // (Este cálculo es incorrecto cuando hay directores del snapshot, pero se mantiene por compatibilidad)
      const cantidadNoCandidatos = state.directoresData.filter(
        (d) => d.tipoDirector === "titular" && d.candidato === false
      ).length;
      return state.cantidadDirectores - cantidadNoCandidatos;
    },

    // Obtener total de votos por candidato
    votosPorCandidato: (state) => {
      const votosMap = new Map<string, number>();
      state.votosAsignados.forEach((voto) => {
        const actual = votosMap.get(voto.candidatoNombreCompleto) || 0;
        votosMap.set(voto.candidatoNombreCompleto, actual + voto.cantidad);
      });
      return votosMap;
    },
  },

  actions: {
    setDirectoresData(data: DirectorData[]) {
      this.directoresData = data;
    },

    setCantidadDirectores(cantidad: number) {
      this.cantidadDirectores = cantidad;
    },

    /**
     * ✅ Establecer cupos disponibles explícitamente
     * (calculados correctamente considerando directores actuales del snapshot - removidos)
     */
    setCuposDisponibles(cupos: number) {
      this.cuposDisponibles = cupos;
    },

    setVotosAsignados(votos: VotoAsignado[]) {
      console.log("🔍 [DirectoresStore][setVotosAsignados] Recibiendo votos:", {
        count: votos.length,
        votos: votos.map((v) => ({
          candidatoNombreCompleto: v.candidatoNombreCompleto,
          candidatoPersonaId: v.candidatoPersonaId,
          accionistaIndex: v.accionistaIndex,
          cantidad: v.cantidad,
        })),
      });
      this.votosAsignados = votos;
      console.log(
        "✅ [DirectoresStore][setVotosAsignados] Votos asignados actualizados. Total:",
        this.votosAsignados.length
      );
    },

    agregarVotoAsignado(voto: VotoAsignado) {
      // Buscar si ya existe un voto para este candidato y accionista
      const index = this.votosAsignados.findIndex(
        (v) =>
          v.candidatoNombreCompleto === voto.candidatoNombreCompleto &&
          v.accionistaIndex === voto.accionistaIndex
      );

      if (index >= 0) {
        // Actualizar voto existente
        this.votosAsignados[index] = voto;
      } else {
        // Agregar nuevo voto
        this.votosAsignados.push(voto);
      }
    },

    verificarEmpate(): boolean {
      const candidatos = this.directoresTitularesCandidatos;
      const votosPorCandidato = this.votosPorCandidato;
      const plazasDisponibles = this.cantidadDisponibles;

      console.log("🔍 [store] verificarEmpate - candidatos:", candidatos.length);
      console.log("🔍 [store] verificarEmpate - plazasDisponibles:", plazasDisponibles);
      console.log(
        "🔍 [store] verificarEmpate - votosPorCandidato:",
        Array.from(votosPorCandidato.entries())
      );

      if (candidatos.length <= 1) {
        console.log("❌ [store] verificarEmpate - Menos de 2 candidatos, no hay empate");
        this.hayEmpate = false;
        return false;
      }

      // Crear array de candidatos con votos
      const candidatosConVotos = candidatos.map((candidato) => ({
        nombreCompleto: candidato.nombreCompleto,
        votos_asignados: votosPorCandidato.get(candidato.nombreCompleto) || 0,
      }));

      console.log("🔍 [store] verificarEmpate - candidatosConVotos:", candidatosConVotos);

      // Ordenar por votos
      const sorted = [...candidatosConVotos].sort(
        (a, b) => b.votos_asignados - a.votos_asignados
      );

      console.log("🔍 [store] verificarEmpate - sorted:", sorted);

      const primerVoto = sorted[0]?.votos_asignados;
      const segundoVoto = sorted[1]?.votos_asignados;
      const todosIguales = sorted.every((c) => c.votos_asignados === primerVoto);

      console.log("🔍 [store] verificarEmpate - primerVoto:", primerVoto);
      console.log("🔍 [store] verificarEmpate - segundoVoto:", segundoVoto);
      console.log("🔍 [store] verificarEmpate - todosIguales:", todosIguales);

      // Empate si todos tienen mismos votos y hay más candidatos que plazas
      if (todosIguales && sorted.length > plazasDisponibles) {
        console.log(
          "✅ [store] verificarEmpate - EMPATE: Todos tienen mismos votos y hay más candidatos que plazas"
        );
        this.hayEmpate = true;
        return true;
      }

      // Empate si hay empate en el límite de plazas disponibles
      if (sorted.length > plazasDisponibles) {
        const votoEnLimite = sorted[plazasDisponibles - 1]?.votos_asignados;
        const votoSiguiente = sorted[plazasDisponibles]?.votos_asignados;
        console.log("🔍 [store] verificarEmpate - votoEnLimite:", votoEnLimite);
        console.log("🔍 [store] verificarEmpate - votoSiguiente:", votoSiguiente);

        if (votoEnLimite !== undefined && votoEnLimite === votoSiguiente) {
          console.log(
            "✅ [store] verificarEmpate - EMPATE: Hay empate en el límite de plazas"
          );
          this.hayEmpate = true;
          return true;
        }
      }

      console.log("❌ [store] verificarEmpate - NO HAY EMPATE");
      this.hayEmpate = false;
      return false;
    },

    setHayEmpate(value: boolean) {
      this.hayEmpate = value;
    },

    setMetodoVotacion(metodo: "unanimidad" | "mayoria") {
      this.metodoVotacion = metodo;
    },

    setCandidatosSeleccionadosUnanimidad(candidatos: string[]) {
      this.candidatosSeleccionadosUnanimidad = candidatos;
    },
  },
});
