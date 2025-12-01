import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';
import type { Role, RoleName } from '~/core/hexag/panel-administrativo/domain/entities/role.entity';
import type { Study } from '~/core/hexag/panel-administrativo/domain/entities/study.entity';
import type { UserFlowAccess, ActionType, FlowCode } from '~/core/hexag/panel-administrativo/domain/entities/permission.entity';

/**
 * ROLES DEL SISTEMA
 */
export const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Administrador',
    status: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'role-2',
    name: 'Usuario',
    status: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'role-3',
    name: 'Lector',
    status: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'role-4',
    name: 'Externo',
    status: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

/**
 * ESTUDIOS JURÍDICOS
 */
export const mockStudies: Study[] = [
  {
    id: 'study-1',
    name: 'Corporate Solutions',
    limit: 50,
    status: true,
  },
  {
    id: 'study-2',
    name: 'Legal Partners',
    limit: 30,
    status: true,
  },
  {
    id: 'study-3',
    name: 'Business Law Group',
    limit: 25,
    status: true,
  },
];

/**
 * CONFIGURACIÓN DE ACCIONES
 */
export interface ActionConfig {
  code: ActionType;
  name: string;
  description: string;
  color: string;
}

export const actionsConfig: ActionConfig[] = [
  {
    code: 'read',
    name: 'Leer',
    description: 'Ver y consultar información',
    color: '#10B981',
  },
  {
    code: 'write',
    name: 'Escribir',
    description: 'Crear nuevos registros',
    color: '#3B82F6',
  },
  {
    code: 'update',
    name: 'Actualizar',
    description: 'Modificar registros existentes',
    color: '#F59E0B',
  },
  {
    code: 'delete',
    name: 'Eliminar',
    description: 'Eliminar registros',
    color: '#EF4444',
  },
  {
    code: 'file',
    name: 'Archivos',
    description: 'Gestionar archivos',
    color: '#8B5CF6',
  },
];

/**
 * PERMISOS POR DEFECTO SEGÚN ROL
 */
export const rolePermissionsConfig: Record<RoleName, ActionType[]> = {
  Administrador: ['read', 'write', 'update', 'delete', 'file'],
  Usuario: ['read', 'write', 'update', 'file'],
  Lector: ['read'],
  Externo: ['read'],
};

/**
 * CONFIGURACIÓN DE FLUJOS Y MÓDULOS
 */
export interface FlowConfig {
  code: FlowCode;
  name: string;
  description: string;
  modules: ModuleConfig[];
}

export interface ModuleConfig {
  code: string;
  name: string;
  description: string;
}

export const flowsConfig: FlowConfig[] = [
  {
    code: 'SOCIETY_PROFILE',
    name: 'Perfil de Sociedad',
    description: 'Gestión de información societaria completa',
    modules: [
      { code: 'general_data', name: 'Datos Generales', description: 'Razón social, RUT, tipo de sociedad' },
      { code: 'address', name: 'Dirección', description: 'Domicilio legal de la sociedad' },
      { code: 'capital', name: 'Capital', description: 'Capital autorizado, suscrito, pagado' },
      { code: 'apoderados', name: 'Apoderados', description: 'Representantes legales y facultades' },
      { code: 'socios', name: 'Socios', description: 'Accionistas y participación' },
      { code: 'directores', name: 'Directores', description: 'Miembros del directorio' },
      { code: 'gerente', name: 'Gerente', description: 'Gerente general y facultades' },
      { code: 'contactos', name: 'Contactos', description: 'Contactos administrativos' },
      { code: 'documentos', name: 'Documentos', description: 'Archivos societarios' },
    ],
  },
  {
    code: 'AUMENTO_DINERARIO',
    name: 'Aumento Dinerario de Capital',
    description: 'Proceso de aumento de capital mediante aporte en efectivo',
    modules: [
      { code: 'datos_aumento', name: 'Datos del Aumento', description: 'Monto, moneda, fecha' },
      { code: 'suscriptores', name: 'Suscriptores', description: 'Socios que suscriben el aumento' },
      { code: 'documentacion', name: 'Documentación', description: 'Acuerdos y comprobantes' },
      { code: 'inscripcion', name: 'Inscripción', description: 'Trámite registral' },
    ],
  },
  {
    code: 'CAPITALIZACION_CREDITOS',
    name: 'Capitalización de Créditos',
    description: 'Conversión de pasivos en capital social',
    modules: [
      { code: 'creditos', name: 'Créditos a Capitalizar', description: 'Detalle de créditos' },
      { code: 'conversion', name: 'Conversión', description: 'Ratio de conversión y cálculos' },
      { code: 'documentacion', name: 'Documentación', description: 'Constancias y acuerdos' },
    ],
  },
  {
    code: 'DESIGNAR_DIRECTORES',
    name: 'Designación de Directores',
    description: 'Nombramiento y remoción de directores',
    modules: [
      { code: 'miembros', name: 'Miembros', description: 'Listado de directores' },
      { code: 'acuerdos', name: 'Acuerdos', description: 'Actas de designación' },
    ],
  },
  {
    code: 'DESIGNAR_GERENTE',
    name: 'Designación de Gerente',
    description: 'Nombramiento del gerente general',
    modules: [
      { code: 'datos_gerente', name: 'Datos del Gerente', description: 'Información personal y facultades' },
      { code: 'nombramiento', name: 'Nombramiento', description: 'Acuerdo de designación' },
    ],
  },
  {
    code: 'ESTADOS_FINANCIEROS',
    name: 'Estados Financieros',
    description: 'Gestión de información financiera y contable',
    modules: [
      { code: 'balance', name: 'Balance General', description: 'Activos, pasivos, patrimonio' },
      { code: 'resultados', name: 'Estado de Resultados', description: 'Ingresos, gastos, utilidades' },
      { code: 'flujo_efectivo', name: 'Flujo de Efectivo', description: 'Movimientos de caja' },
      { code: 'notas', name: 'Notas', description: 'Notas explicativas' },
      { code: 'auditoria', name: 'Auditoría', description: 'Informes de auditoría' },
    ],
  },
  {
    code: 'SUNAT',
    name: 'SUNAT',
    description: 'Gestión de obligaciones tributarias',
    modules: [
      { code: 'declaraciones', name: 'Declaraciones', description: 'Presentación de declaraciones' },
      { code: 'comprobantes', name: 'Comprobantes', description: 'Facturas, boletas, guías' },
      { code: 'constancias', name: 'Constancias', description: 'Certificados tributarios' },
    ],
  },
  {
    code: 'ARCHIVES',
    name: 'Archivos',
    description: 'Gestión del repositorio de documentos',
    modules: [
      { code: 'societarios', name: 'Societarios', description: 'Documentos societarios oficiales' },
      { code: 'generados', name: 'Generados', description: 'Documentos generados por el sistema' },
      { code: 'personalizados', name: 'Personalizados', description: 'Carpetas y documentos personalizados' },
    ],
  },
  {
    code: 'SHARED_FLOW',
    name: 'Flujos Compartidos',
    description: 'Gestión de espacios de trabajo colaborativos',
    modules: [
      { code: 'configuracion', name: 'Configuración', description: 'Ajustes del espacio' },
      { code: 'miembros', name: 'Miembros', description: 'Usuarios del espacio' },
      { code: 'herramientas', name: 'Herramientas', description: 'Widgets y funcionalidades' },
      { code: 'documentos', name: 'Documentos', description: 'Archivos compartidos' },
      { code: 'chat_ia', name: 'Chat IA', description: 'Asistente inteligente' },
      { code: 'calendario', name: 'Calendario', description: 'Eventos y recordatorios' },
      { code: 'tareas', name: 'Tareas', description: 'Gestión de pendientes' },
    ],
  },
];

/**
 * USUARIOS MOCK
 */
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@probo.com',
    roleId: 'role-1',
    studyId: 'study-1',
    status: true,
    createdAt: new Date('2024-01-15'),
    role: mockRoles[0]!,
    study: mockStudies[0]!,
  },
  {
    id: 'user-2',
    email: 'maria.garcia@probo.com',
    roleId: 'role-2',
    studyId: 'study-1',
    status: true,
    createdAt: new Date('2024-02-20'),
    role: mockRoles[1]!,
    study: mockStudies[0]!,
  },
  {
    id: 'user-3',
    email: 'carlos.rodriguez@probo.com',
    roleId: 'role-2',
    studyId: 'study-1',
    status: true,
    createdAt: new Date('2024-03-10'),
    role: mockRoles[1]!,
    study: mockStudies[0]!,
  },
  {
    id: 'user-4',
    email: 'ana.silva@probo.com',
    roleId: 'role-3',
    studyId: 'study-1',
    status: true,
    createdAt: new Date('2024-04-05'),
    role: mockRoles[2]!,
    study: mockStudies[0]!,
  },
  {
    id: 'user-5',
    email: 'juan.perez@probo.com',
    roleId: 'role-2',
    studyId: 'study-2',
    status: true,
    createdAt: new Date('2024-05-12'),
    role: mockRoles[1]!,
    study: mockStudies[1]!,
  },
  {
    id: 'user-6',
    email: 'laura.martinez@probo.com',
    roleId: 'role-1',
    studyId: 'study-2',
    status: true,
    createdAt: new Date('2024-06-18'),
    role: mockRoles[0]!,
    study: mockStudies[1]!,
  },
  {
    id: 'user-7',
    email: 'pedro.gonzalez@probo.com',
    roleId: 'role-2',
    studyId: 'study-2',
    status: true,
    createdAt: new Date('2024-07-22'),
    role: mockRoles[1]!,
    study: mockStudies[1]!,
  },
  {
    id: 'user-8',
    email: 'sofia.lopez@probo.com',
    roleId: 'role-3',
    studyId: 'study-2',
    status: false,
    createdAt: new Date('2024-08-30'),
    role: mockRoles[2]!,
    study: mockStudies[1]!,
  },
  {
    id: 'user-9',
    email: 'diego.fernandez@probo.com',
    roleId: 'role-4',
    studyId: 'study-3',
    status: true,
    createdAt: new Date('2024-09-15'),
    role: mockRoles[3]!,
    study: mockStudies[2]!,
  },
  {
    id: 'user-10',
    email: 'carmen.ruiz@probo.com',
    roleId: 'role-2',
    studyId: 'study-3',
    status: true,
    createdAt: new Date('2024-10-20'),
    role: mockRoles[1]!,
    study: mockStudies[2]!,
  },
  {
    id: 'user-11',
    email: 'fernando.torres@probo.com',
    roleId: 'role-1',
    studyId: 'study-3',
    status: true,
    createdAt: new Date('2024-11-05'),
    role: mockRoles[0]!,
    study: mockStudies[2]!,
  },
  {
    id: 'user-12',
    email: 'isabel.morales@probo.com',
    roleId: 'role-3',
    studyId: 'study-1',
    status: true,
    createdAt: new Date('2024-11-25'),
    role: mockRoles[2]!,
    study: mockStudies[0]!,
  },
  {
    id: 'user-13',
    email: 'roberto.vargas@probo.com',
    roleId: 'role-2',
    studyId: 'study-1',
    status: true,
    createdAt: new Date('2024-12-01'),
    role: mockRoles[1]!,
    study: mockStudies[0]!,
  },
  {
    id: 'user-14',
    email: 'patricia.castro@probo.com',
    roleId: 'role-2',
    studyId: 'study-2',
    status: true,
    createdAt: new Date('2024-12-10'),
    role: mockRoles[1]!,
    study: mockStudies[1]!,
  },
  {
    id: 'user-15',
    email: 'miguel.ramirez@probo.com',
    roleId: 'role-3',
    studyId: 'study-3',
    status: true,
    createdAt: new Date('2024-12-15'),
    role: mockRoles[2]!,
    study: mockStudies[2]!,
  },
];

/**
 * FUNCIONES HELPER
 */

/**
 * Obtiene usuarios por rol
 */
export function getUsersByRole(roleName: RoleName): User[] {
  return mockUsers.filter((user) => user.role.name === roleName && user.status);
}

/**
 * Obtiene permisos de un usuario según su rol
 */
export function getUserPermissions(userId: string): UserFlowAccess[] {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return [];

  const roleDefaultActions = rolePermissionsConfig[user.role.name];

  return flowsConfig.map((flow) => ({
    code: flow.code,
    flowName: flow.name,
    modules: flow.modules.map((module) => ({
      name: module.code,
      displayName: module.name,
      actions: [...roleDefaultActions], // Permisos por defecto según rol
    })),
  }));
}

/**
 * Obtiene color del badge según rol
 */
export function getRoleBadgeColor(role: RoleName): {
  bg: string;
  text: string;
  border: string;
  lightBg: string;
} {
  switch (role) {
    case 'Administrador':
      return {
        bg: '#3C28A4',
        text: '#FFFFFF',
        border: '#A78BFA',
        lightBg: '#EDE9FE',
      };
    case 'Usuario':
      return {
        bg: '#10B981',
        text: '#FFFFFF',
        border: '#6EE7B7',
        lightBg: '#D1FAE5',
      };
    case 'Lector':
      return {
        bg: '#F59E0B',
        text: '#FFFFFF',
        border: '#FCD34D',
        lightBg: '#FEF3C7',
      };
    case 'Externo':
      return {
        bg: '#6B7280',
        text: '#FFFFFF',
        border: '#D1D5DB',
        lightBg: '#F3F4F6',
      };
  }
}

/**
 * Obtiene color de acción
 */
export function getActionColor(action: ActionType): string {
  switch (action) {
    case 'read':
      return '#10B981';
    case 'write':
      return '#3B82F6';
    case 'update':
      return '#F59E0B';
    case 'delete':
      return '#EF4444';
    case 'file':
      return '#8B5CF6';
  }
}

