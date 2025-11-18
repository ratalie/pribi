import type { LoginCredentialsDTO } from "../../application/dtos/login-credentials.dto";
import type { AuthSessionDTO } from "../../application/dtos/auth-session.dto";

export interface AuthRepository {
  login(credentials: LoginCredentialsDTO): Promise<AuthSessionDTO>;
}

