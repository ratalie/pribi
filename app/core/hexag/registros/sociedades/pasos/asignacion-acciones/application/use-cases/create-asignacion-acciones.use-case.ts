import type {
  AsignacionAccionesDTO,
  AsignacionAccionesRepository,
} from "../../domain/ports/asignacion-acciones.repository";

export class CreateAsignacionAccionesUseCase {
  constructor(private readonly repository: AsignacionAccionesRepository) {}

  async execute(societyProfileId: string, payload: AsignacionAccionesDTO): Promise<string> {
    return this.repository.create(societyProfileId, payload);
  }
}
