import type { AuthRepository } from "../../domain/ports/auth.repository";
import type { LoginCredentialsDTO } from "../dtos/login-credentials.dto";
import type { AuthSessionDTO } from "../dtos/auth-session.dto";

export class LoginUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(credentials: LoginCredentialsDTO): Promise<AuthSessionDTO> {
    return this.repository.login(credentials);
  }
}

