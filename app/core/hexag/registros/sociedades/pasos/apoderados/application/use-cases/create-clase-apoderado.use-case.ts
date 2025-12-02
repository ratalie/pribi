import type { ApoderadosRepository, ClaseApoderado, ClaseApoderadoPayload } from "../../domain";

export class CreateClaseApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  async execute(profileId: string, payload: ClaseApoderadoPayload): Promise<ClaseApoderado> {
    await this.repository.createClase(profileId, payload);
    
    // El backend no retorna la clase creada en el POST
    // Hacemos un GET para obtener todas las clases y buscar la que acabamos de crear
    const clases = await this.repository.listClases(profileId);
    const claseCreada = clases.find(c => c.id === payload.id || c.nombre === payload.nombre);
    
    if (!claseCreada) {
      throw new Error(`No se encontró la clase de apoderado creada: ${payload.nombre}`);
    }
    
    return claseCreada;
  }
}
