# 📘 Guía Frontend: Asistencia (Attendance)

## 🎯 Endpoints Disponibles

### **1. Actualizar Asistencia**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
```

**Autenticación:** Requiere JWT Bearer Token  
**Parámetros:**
- `societyId` (number): ID de la sociedad
- `flowId` (number): ID del flujo de junta

**Ejemplo:**
```http
PUT http://localhost:3000/api/v2/society-profile/3/register-assembly/1/attendance
Authorization: Bearer <tu-token-jwt>
Content-Type: application/json
```

### **2. Obtener Asistencia**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
```

**Autenticación:** Requiere JWT Bearer Token  
**Parámetros:**
- `societyId` (number): ID de la sociedad
- `flowId` (number): ID del flujo de junta

**Ejemplo:**
```http
GET http://localhost:3000/api/v2/society-profile/3/register-assembly/1/attendance
Authorization: Bearer <tu-token-jwt>
```

---

## 📋 Tipado TypeScript Completo

### **1. Tipos de Entrada (PUT)**

```typescript
// ============================================
// DTO DE ENTRADA
// ============================================

export interface RegistroAsistenciaDto {
  id: string; // UUID del registro de asistencia
  attended: boolean; // Si el accionista asistió
  representedById?: string; // UUID del accionista que lo representa (si aplica)
  isRepresentative: boolean; // Si este accionista está representando a otro
}
```

**Nota:** Este endpoint actualiza **un solo registro** de asistencia a la vez. Para actualizar múltiples, debes hacer múltiples llamadas.

### **2. Tipos de Salida (GET)**

```typescript
// ============================================
// DTO DE SALIDA
// ============================================

import { Shareholder } from './snapshot.types'; // Del snapshot

export interface AsistenciaJuntaQueryDto {
  // IDs base
  id: string; // UUID del registro de asistencia
  configJuntaId: string; // UUID del meetingConfigId (del snapshot)

  // Accionista (del snapshot)
  accionista: Shareholder;

  // Snapshot de participación (calculado al momento de crear la junta)
  accionesConDerechoVoto: number; // Cantidad de acciones con derecho a voto
  porcentajeParticipacion: number; // Porcentaje de participación (0-100)

  // Situación de asistencia
  asistio: boolean; // Si asistió a la junta
  representadoPorId: string | null; // UUID del accionista que lo representa
  esRepresentante: boolean; // Si está representando a otro accionista
}

// ============================================
// RESPUESTA DE LA API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}

export type AttendanceResponse = ApiResponse<AsistenciaJuntaQueryDto[]>;
```

---

## 💻 Ejemplo de Uso (React/TypeScript)

### **1. Servicio API**

```typescript
// services/attendance.service.ts
import axios from 'axios';
import { RegistroAsistenciaDto, AsistenciaJuntaQueryDto } from '../types/attendance.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export class AttendanceService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Actualiza un registro de asistencia
   */
  static async updateAttendance(
    societyId: number,
    flowId: number,
    dto: RegistroAsistenciaDto
  ): Promise<void> {
    const response = await axios.put<ApiResponse<void>>(
      `${API_BASE_URL}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/attendance`,
      dto,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  }

  /**
   * Actualiza múltiples registros de asistencia
   */
  static async updateMultipleAttendance(
    societyId: number,
    flowId: number,
    dtos: RegistroAsistenciaDto[]
  ): Promise<void> {
    // Hacer múltiples llamadas en paralelo
    await Promise.all(
      dtos.map(dto => this.updateAttendance(societyId, flowId, dto))
    );
  }

  /**
   * Obtiene todos los registros de asistencia
   */
  static async getAttendance(
    societyId: number,
    flowId: number
  ): Promise<AsistenciaJuntaQueryDto[]> {
    const response = await axios.get<AttendanceResponse>(
      `${API_BASE_URL}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/attendance`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  }
}
```

### **2. Hook Personalizado (React)**

```typescript
// hooks/useAttendance.ts
import { useState, useEffect } from 'react';
import { AttendanceService } from '../services/attendance.service';
import { AsistenciaJuntaQueryDto, RegistroAsistenciaDto } from '../types/attendance.types';

interface UseAttendanceResult {
  attendance: AsistenciaJuntaQueryDto[];
  loading: boolean;
  error: string | null;
  updateAttendance: (dto: RegistroAsistenciaDto) => Promise<void>;
  updateMultiple: (dtos: RegistroAsistenciaDto[]) => Promise<void>;
  refetch: () => void;
}

export function useAttendance(
  societyId: number | null,
  flowId: number | null
): UseAttendanceResult {
  const [attendance, setAttendance] = useState<AsistenciaJuntaQueryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    if (!societyId || !flowId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await AttendanceService.getAttendance(societyId, flowId);
      setAttendance(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener la asistencia');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async (dto: RegistroAsistenciaDto) => {
    if (!societyId || !flowId) {
      throw new Error('societyId y flowId son requeridos');
    }

    setLoading(true);
    setError(null);

    try {
      await AttendanceService.updateAttendance(societyId, flowId, dto);
      // Refrescar los datos después de actualizar
      await fetchAttendance();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la asistencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMultiple = async (dtos: RegistroAsistenciaDto[]) => {
    if (!societyId || !flowId) {
      throw new Error('societyId y flowId son requeridos');
    }

    setLoading(true);
    setError(null);

    try {
      await AttendanceService.updateMultipleAttendance(societyId, flowId, dtos);
      // Refrescar los datos después de actualizar
      await fetchAttendance();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la asistencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [societyId, flowId]);

  return {
    attendance,
    loading,
    error,
    updateAttendance,
    updateMultiple,
    refetch: fetchAttendance,
  };
}
```

### **3. Componente de Ejemplo**

```typescript
// components/AttendanceList.tsx
import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { RegistroAsistenciaDto } from '../types/attendance.types';

interface Props {
  societyId: number;
  flowId: number;
}

export const AttendanceList: React.FC<Props> = ({ societyId, flowId }) => {
  const { attendance, loading, error, updateAttendance } = useAttendance(societyId, flowId);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleToggleAttendance = async (item: AsistenciaJuntaQueryDto) => {
    setUpdating(item.id);
    try {
      const dto: RegistroAsistenciaDto = {
        id: item.id,
        attended: !item.asistio,
        representedById: item.representadoPorId || undefined,
        isRepresentative: item.esRepresentante,
      };
      await updateAttendance(dto);
    } catch (err) {
      alert('Error al actualizar: ' + (err as Error).message);
    } finally {
      setUpdating(null);
    }
  };

  const handleSetRepresentative = async (
    item: AsistenciaJuntaQueryDto,
    representedById: string
  ) => {
    setUpdating(item.id);
    try {
      const dto: RegistroAsistenciaDto = {
        id: item.id,
        attended: item.asistio,
        representedById,
        isRepresentative: false,
      };
      await updateAttendance(dto);
    } catch (err) {
      alert('Error al actualizar: ' + (err as Error).message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading && attendance.length === 0) return <div>Cargando asistencia...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalAsistieron = attendance.filter(a => a.asistio).length;
  const totalAcciones = attendance.reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
  const accionesAsistieron = attendance
    .filter(a => a.asistio)
    .reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
  const porcentajeAsistencia = totalAcciones > 0 
    ? (accionesAsistieron / totalAcciones) * 100 
    : 0;

  return (
    <div className="attendance-list">
      <h2>Asistencia a la Junta</h2>

      {/* Resumen */}
      <div className="attendance-summary">
        <p>
          <strong>Asistencia:</strong> {totalAsistieron} de {attendance.length} accionistas
        </p>
        <p>
          <strong>Acciones con derecho a voto:</strong> {accionesAsistieron} de {totalAcciones} 
          ({porcentajeAsistencia.toFixed(2)}%)
        </p>
      </div>

      {/* Lista de Asistencia */}
      <table>
        <thead>
          <tr>
            <th>Accionista</th>
            <th>Acciones</th>
            <th>Participación</th>
            <th>Asistió</th>
            <th>Representado Por</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((item) => {
            const persona = item.accionista.person;
            const nombre = persona.tipo === 'NATURAL'
              ? `${persona.nombre} ${persona.apellidoPaterno}`
              : persona.razonSocial;

            return (
              <tr key={item.id}>
                <td>{nombre}</td>
                <td>{item.accionesConDerechoVoto}</td>
                <td>{item.porcentajeParticipacion.toFixed(2)}%</td>
                <td>
                  <input
                    type="checkbox"
                    checked={item.asistio}
                    onChange={() => handleToggleAttendance(item)}
                    disabled={updating === item.id}
                  />
                </td>
                <td>
                  {item.representadoPorId ? (
                    <span>
                      {attendance.find(a => a.id === item.representadoPorId)?.accionista.person.tipo === 'NATURAL'
                        ? `${attendance.find(a => a.id === item.representadoPorId)?.accionista.person.nombre} ${attendance.find(a => a.id === item.representadoPorId)?.accionista.person.apellidoPaterno}`
                        : attendance.find(a => a.id === item.representadoPorId)?.accionista.person.razonSocial}
                    </span>
                  ) : (
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleSetRepresentative(item, e.target.value);
                        }
                      }}
                      disabled={updating === item.id || !item.asistio}
                    >
                      <option value="">Ninguno</option>
                      {attendance
                        .filter(a => a.id !== item.id && a.asistio)
                        .map(a => (
                          <option key={a.id} value={a.id}>
                            {a.accionista.person.tipo === 'NATURAL'
                              ? `${a.accionista.person.nombre} ${a.accionista.person.apellidoPaterno}`
                              : a.accionista.person.razonSocial}
                          </option>
                        ))}
                    </select>
                  )}
                </td>
                <td>
                  {updating === item.id ? 'Actualizando...' : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 📝 Ejemplo de Request (PUT)

```json
{
  "id": "019ad1d1-f27c-7264-bc29-be2d70a33cff",
  "attended": true,
  "representedById": "019ad1d1-f27c-7264-bc29-be2d70a33cfe",
  "isRepresentative": false
}
```

---

## 📝 Ejemplo de Response (GET)

```json
{
  "success": true,
  "message": "Asistencia obtenida correctamente",
  "code": 200,
  "data": [
    {
      "id": "019ad1d1-f27c-7264-bc29-be2d70a33cff",
      "configJuntaId": "019ad1d1-f27c-7264-bc29-be2d70a33cba",
      "accionista": {
        "id": "019ad1d1-f27c-7264-bc29-be2d70a33cb7",
        "person": {
          "id": "uuid-person-1",
          "tipo": "NATURAL",
          "nombre": "Juan",
          "apellidoPaterno": "Pérez",
          "apellidoMaterno": "González",
          "tipoDocumento": "CEDULA",
          "numeroDocumento": "1234567890",
          "paisEmision": "COLOMBIA"
        }
      },
      "accionesConDerechoVoto": 500,
      "porcentajeParticipacion": 50.0,
      "asistio": true,
      "representadoPorId": null,
      "esRepresentante": false
    },
    {
      "id": "019ad1d1-f27c-7264-bc29-be2d70a33cfe",
      "configJuntaId": "019ad1d1-f27c-7264-bc29-be2d70a33cba",
      "accionista": {
        "id": "019ad1d1-f27c-7264-bc29-be2d70a33cb8",
        "person": {
          "id": "uuid-person-2",
          "tipo": "JURIDICA",
          "tipoDocumento": "NIT",
          "numeroDocumento": "900123456-1",
          "razonSocial": "Empresa XYZ S.A.S.",
          "direccion": "Calle 456, Medellín",
          "constituida": true
        }
      },
      "accionesConDerechoVoto": 500,
      "porcentajeParticipacion": 50.0,
      "asistio": false,
      "representadoPorId": "019ad1d1-f27c-7264-bc29-be2d70a33cff",
      "esRepresentante": false
    }
  ]
}
```

---

## 🔗 Relación con el Snapshot

### **¿Cómo se relaciona con el snapshot?**

1. **Al crear una junta** (`POST /register-assembly`):
   - Se crea un `meetingConfigId` (UUID)
   - Se crean automáticamente registros de asistencia para **todos los accionistas** del snapshot
   - Cada registro tiene:
     - `id`: UUID único del registro
     - `configJuntaId`: El `meetingConfigId` del snapshot
     - `accionista`: Datos del accionista (del snapshot)
     - `accionesConDerechoVoto`: Calculado desde el snapshot
     - `porcentajeParticipacion`: Calculado desde el snapshot
     - `asistio`: `false` por defecto
     - `representadoPorId`: `null` por defecto
     - `esRepresentante`: `false` por defecto

2. **Los accionistas vienen del snapshot:**
   ```typescript
   const snapshot = await getSnapshotComplete(societyId, flowId);
   // Los accionistas están aquí:
   const shareholders = snapshot.shareholders;
   // Y cada registro de asistencia corresponde a uno de estos accionistas
   ```

3. **El `meetingConfigId` es el mismo:**
   ```typescript
   const snapshot = await getSnapshotComplete(societyId, flowId);
   const meetingConfigId = snapshot.meetingConfigId;
   
   const attendance = await getAttendance(societyId, flowId);
   // Todos los registros tienen configJuntaId === meetingConfigId
   ```

### **¿Hay endpoint para consultar por `meetingConfigId` directamente?**

**No.** El endpoint requiere `societyId` y `flowId` porque:
- Valida que el `meetingConfigId` pertenezca al flujo correcto
- Asegura que el usuario tenga permisos sobre la sociedad
- Mantiene la consistencia de datos

**Para obtener la asistencia, siempre usa:**
```typescript
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
```

### **Flujo de Trabajo Recomendado**

1. **Crear Junta** → `POST /register-assembly` → Obtienes `flowId`
2. **Obtener Snapshot** → `GET /snapshot/complete` → Ver accionistas y `meetingConfigId`
3. **Obtener Asistencia** → `GET /attendance` → Ver registros creados automáticamente
4. **Actualizar Asistencia** → `PUT /attendance` → Marcar quién asistió
5. **Configurar Representación** → `PUT /attendance` → Asignar representantes

---

## ⚠️ Notas Importantes

### **1. Registros Automáticos**
- Los registros de asistencia se crean **automáticamente** al crear la junta
- No necesitas crear registros manualmente
- Solo necesitas **actualizar** los existentes

### **2. Representación**
- Un accionista puede ser representado por otro
- El `representedById` debe ser el `id` de otro registro de asistencia
- Si un accionista está representado, `asistio` puede ser `false` pero aún cuenta para el quorum

### **3. Acciones con Derecho a Voto**
- Se calculan desde el snapshot al momento de crear la junta
- Solo cuentan las acciones que tienen `conDerechoVoto: true`
- El porcentaje se calcula sobre el total de acciones con derecho a voto

### **4. Actualización Individual**
- Cada llamada a `PUT /attendance` actualiza **un solo registro**
- Para actualizar múltiples, haz múltiples llamadas o usa `updateMultiple` del servicio

---

## 🆘 Manejo de Errores

```typescript
try {
  await AttendanceService.updateAttendance(societyId, flowId, dto);
} catch (error: any) {
  if (error.response?.status === 404) {
    console.error('Junta o registro de asistencia no encontrado');
  } else if (error.response?.status === 400) {
    console.error('Datos inválidos:', error.response.data);
  } else if (error.response?.status === 401) {
    console.error('No autorizado - token inválido');
  } else {
    console.error('Error desconocido:', error.message);
  }
}
```

---

## ✅ Checklist de Implementación

- [ ] Crear archivo de tipos TypeScript
- [ ] Implementar servicio API
- [ ] Crear hook personalizado (si usas React)
- [ ] Implementar lista de asistencia
- [ ] Manejar estados de carga y error
- [ ] Implementar toggle de asistencia
- [ ] Implementar selección de representante
- [ ] Calcular quorum y porcentajes
- [ ] Integrar con el snapshot para obtener accionistas
- [ ] Probar con diferentes escenarios de asistencia

---

**¡Listo para usar! 🎉**

