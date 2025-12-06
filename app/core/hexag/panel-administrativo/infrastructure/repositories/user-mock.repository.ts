import type { UserRepository } from '../../domain/ports/user.repository';
import type { User } from '../../domain/entities/user.entity';
import type { RoleName } from '../../domain/entities/role.entity';
import type { UserFlowAccess } from '../../domain/entities/permission.entity';
import type { SocietyInfo } from '../../domain/entities/society-assignment.entity';
import { mockUsers, getUserPermissions as getMockUserPermissions } from '~/data/mockDataAdmin';
import { getAllRoutes } from '~/config/routes/permissions-map';

/**
 * Mock de sociedades disponibles
 */
const mockSocieties: SocietyInfo[] = [
  {
    id: 'society-1',
    name: 'Sociedad ABC S.A.C.',
    ruc: '20123456789',
    status: true,
  },
  {
    id: 'society-2',
    name: 'Sociedad XYZ E.I.R.L.',
    ruc: '20198765432',
    status: true,
  },
  {
    id: 'society-3',
    name: 'Sociedad DEF S.A.',
    ruc: '20111111111',
    status: true,
  },
];

/**
 * Mock de permisos de rutas por usuario
 * Por defecto, admin tiene todas las rutas, otros roles tienen algunas
 */
const mockUserRoutePermissions: Record<string, string[]> = {
  // Admin tiene todas las rutas
  'user-1': getAllRoutes().map((r) => r.route),
  // Usuario normal tiene algunas rutas
  'user-2': [
    '/registros/sociedades/historial',
    '/registros/sociedades/dashboard',
    '/operaciones/junta-accionistas/historial',
    '/repositorio-ai/dashboard',
  ],
  // Lector solo tiene rutas de lectura
  'user-3': [
    '/registros/sociedades/historial',
    '/operaciones/junta-accionistas/historial',
    '/repositorio-ai/dashboard',
  ],
};

/**
 * Mock de sociedades asignadas por usuario
 */
const mockUserAssignedSocieties: Record<string, string[]> = {
  'user-1': ['society-1', 'society-2', 'society-3'], // Admin tiene todas
  'user-2': ['society-1', 'society-2'], // Usuario tiene algunas
  'user-3': ['society-1'], // Lector solo una
};

/**
 * Implementación Mock del repositorio de usuarios
 * Para desarrollo y presentación
 */
export class UserMockRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Agregar routePermissions y assignedSocieties a los usuarios mock
    return mockUsers.map((user) => ({
      ...user,
      name: user.email.split('@')[0] || 'Usuario', // Generar nombre del email
      routePermissions:
        mockUserRoutePermissions[user.id] || [],
      assignedSocieties:
        mockUserAssignedSocieties[user.id] || [],
      updatedAt: user.createdAt, // Agregar updatedAt si no existe
    }));
  }

  async findById(id: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const user = mockUsers.find((u) => u.id === id);
    if (!user) return null;

    return {
      ...user,
      name: user.email.split('@')[0] || 'Usuario',
      routePermissions: mockUserRoutePermissions[user.id] || [],
      assignedSocieties: mockUserAssignedSocieties[user.id] || [],
      updatedAt: user.createdAt,
    };
  }

  async findByRole(roleName: RoleName): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUsers
      .filter((u) => u.role.name === roleName && u.status)
      .map((user) => ({
        ...user,
        name: user.email.split('@')[0] || 'Usuario',
        routePermissions: mockUserRoutePermissions[user.id] || [],
        assignedSocieties: mockUserAssignedSocieties[user.id] || [],
        updatedAt: user.createdAt,
      }));
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

  async getUserRoutePermissions(userId: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUserRoutePermissions[userId] || [];
  }

  async updateUserRoutePermissions(
    userId: string,
    routePermissions: string[]
  ): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Actualizar mock
    mockUserRoutePermissions[userId] = routePermissions;
    return routePermissions;
  }

  async getUserAssignedSocieties(userId: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUserAssignedSocieties[userId] || [];
  }

  async assignUserToSocieties(
    userId: string,
    societyIds: string[]
  ): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Actualizar mock
    mockUserAssignedSocieties[userId] = societyIds;
    return societyIds;
  }

  async getAllSocieties(): Promise<SocietyInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockSocieties;
  }

  async updateUserRole(
    userId: string,
    role: 'lector' | 'editor' | 'admin' | 'user'
  ): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Mapear rol simplificado a RoleName existente
    const roleNameMap: Record<
      'lector' | 'editor' | 'admin' | 'user',
      RoleName
    > = {
      lector: 'Lector',
      editor: 'Usuario',
      admin: 'Administrador',
      user: 'Usuario',
    };

    // Actualizar rol del usuario (en mock, solo actualizamos el objeto)
    const updatedUser: User = {
      ...user,
      role: {
        ...user.role,
        name: roleNameMap[role],
      },
      updatedAt: new Date(),
    };

    return updatedUser;
  }
}

