import type { UserRepository } from '../../domain/ports/user.repository';
import type { User } from '../../domain/entities/user.entity';
import type { RoleName } from '../../domain/entities/role.entity';
import type { UserFlowAccess } from '../../domain/entities/permission.entity';
import { mockUsers, getUserPermissions as getMockUserPermissions } from '~/data/mockDataAdmin';

/**
 * Implementación Mock del repositorio de usuarios
 * Para desarrollo y presentación
 */
export class UserMockRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockUsers;
  }

  async findById(id: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUsers.find((u) => u.id === id) || null;
  }

  async findByRole(roleName: RoleName): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUsers.filter((u) => u.role.name === roleName && u.status);
  }

  async getUserPermissions(userId: string): Promise<UserFlowAccess[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMockUserPermissions(userId);
  }

  async updateUserPermissions(
    userId: string,
    permissions: UserFlowAccess[]
  ): Promise<UserFlowAccess[]> {
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 500));
    // En producción, esto se guardaría en el backend
    return permissions;
  }
}

