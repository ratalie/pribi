# 📘 Guía Frontend: Detalles de Junta (Meeting Details)

## 🎯 Endpoints Disponibles

### **1. Actualizar Detalles de Junta**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
```

**Autenticación:** Requiere JWT Bearer Token  
**Parámetros:**
- `societyId` (number): ID de la sociedad
- `flowId` (number): ID del flujo de junta

**Ejemplo:**
```http
PUT http://localhost:3000/api/v2/society-profile/3/register-assembly/1/meeting-details
Authorization: Bearer <tu-token-jwt>
Content-Type: application/json
```

### **2. Obtener Detalles de Junta**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
```

**Autenticación:** Requiere JWT Bearer Token  
**Parámetros:**
- `societyId` (number): ID de la sociedad
- `flowId` (number): ID del flujo de junta

**Ejemplo:**
```http
GET http://localhost:3000/api/v2/society-profile/3/register-assembly/1/meeting-details
Authorization: Bearer <tu-token-jwt>
```

---

## 📋 Tipado TypeScript Completo

### **1. Tipos de Entrada (PUT)**

```typescript
// ============================================
// ENUMS
// ============================================

export type ModoReunion = 'PRESENCIAL' | 'VIRTUAL';
export type TipoJunta = 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL';
export type OrdenConvocatoria = 'PRIMERA' | 'SEGUNDA';

// ============================================
// DTOs DE ENTRADA
// ============================================

export interface ConvocatoriaDto {
  direccion: string; // Dirección física si es PRESENCIAL, o link si es VIRTUAL
  modo: ModoReunion;
  fecha: string; // ISO Date string (ej: "2025-01-15T00:00:00.000Z")
  hora: string; // ISO Date string (ej: "2025-01-15T14:00:00.000Z")
}

export interface DetallesJuntaDto {
  tipoJunta: TipoJunta;
  esAnualObligatoria: boolean;
  primeraConvocatoria?: ConvocatoriaDto;
  segundaConvocatoria?: ConvocatoriaDto;
  instaladaEnConvocatoria: OrdenConvocatoria;
  presidenteId?: string; // UUID del director que será presidente
  secretarioId?: string; // UUID del director que será secretario
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  nombreOtroPresidente?: string; // Si el presidente no es un director registrado
  nombreOtroSecretario?: string; // Si el secretario no es un director registrado
}
```

### **2. Tipos de Salida (GET)**

```typescript
// ============================================
// VALUE OBJECTS
// ============================================

export interface MeetingCall {
  address: string;
  mode: 'IN_PERSON' | 'VIRTUAL';
  date: Date;
  time: Date;
}

// ============================================
// ENTIDAD DE RESPUESTA
// ============================================

export interface GeneralMeetingConfig {
  id: string; // UUID del meetingConfigId del snapshot
  meetingType: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL';
  isAnnualMandatory: boolean;
  firstCall?: MeetingCall;
  secondCall?: MeetingCall;
  heldAtCall?: 'FIRST' | 'SECOND';
  presidentId?: string; // UUID del director presidente
  secretaryId?: string; // UUID del director secretario
  presidentAttended: boolean;
  secretaryAttended: boolean;
  otherPresidentName?: string;
  otherSecretaryName?: string;
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

export type MeetingDetailsResponse = ApiResponse<GeneralMeetingConfig>;
```

---

## 💻 Ejemplo de Uso (React/TypeScript)

### **1. Servicio API**

```typescript
// services/meeting-details.service.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export class MeetingDetailsService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Actualiza los detalles de la junta
   */
  static async updateMeetingDetails(
    societyId: number,
    flowId: number,
    dto: DetallesJuntaDto
  ): Promise<void> {
    const response = await axios.put<ApiResponse<void>>(
      `${API_BASE_URL}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/meeting-details`,
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
   * Obtiene los detalles de la junta
   */
  static async getMeetingDetails(
    societyId: number,
    flowId: number
  ): Promise<GeneralMeetingConfig> {
    const response = await axios.get<MeetingDetailsResponse>(
      `${API_BASE_URL}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/meeting-details`,
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
// hooks/useMeetingDetails.ts
import { useState, useEffect } from 'react';
import { MeetingDetailsService } from '../services/meeting-details.service';
import { GeneralMeetingConfig, DetallesJuntaDto } from '../types/meeting-details.types';

interface UseMeetingDetailsResult {
  meetingDetails: GeneralMeetingConfig | null;
  loading: boolean;
  error: string | null;
  updateDetails: (dto: DetallesJuntaDto) => Promise<void>;
  refetch: () => void;
}

export function useMeetingDetails(
  societyId: number | null,
  flowId: number | null
): UseMeetingDetailsResult {
  const [meetingDetails, setMeetingDetails] = useState<GeneralMeetingConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!societyId || !flowId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await MeetingDetailsService.getMeetingDetails(societyId, flowId);
      setMeetingDetails(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener los detalles de la junta');
    } finally {
      setLoading(false);
    }
  };

  const updateDetails = async (dto: DetallesJuntaDto) => {
    if (!societyId || !flowId) {
      throw new Error('societyId y flowId son requeridos');
    }

    setLoading(true);
    setError(null);

    try {
      await MeetingDetailsService.updateMeetingDetails(societyId, flowId, dto);
      // Refrescar los datos después de actualizar
      await fetchDetails();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar los detalles de la junta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [societyId, flowId]);

  return {
    meetingDetails,
    loading,
    error,
    updateDetails,
    refetch: fetchDetails,
  };
}
```

### **3. Componente de Ejemplo**

```typescript
// components/MeetingDetailsForm.tsx
import React, { useState } from 'react';
import { useMeetingDetails } from '../hooks/useMeetingDetails';
import { DetallesJuntaDto, ModoReunion, TipoJunta, OrdenConvocatoria } from '../types/meeting-details.types';

interface Props {
  societyId: number;
  flowId: number;
}

export const MeetingDetailsForm: React.FC<Props> = ({ societyId, flowId }) => {
  const { meetingDetails, loading, error, updateDetails } = useMeetingDetails(societyId, flowId);
  const [formData, setFormData] = useState<DetallesJuntaDto>({
    tipoJunta: 'JUNTA_UNIVERSAL',
    esAnualObligatoria: false,
    instaladaEnConvocatoria: 'PRIMERA',
    presidenteAsistio: false,
    secretarioAsistio: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDetails(formData);
      alert('Detalles actualizados correctamente');
    } catch (err) {
      alert('Error al actualizar: ' + (err as Error).message);
    }
  };

  if (loading && !meetingDetails) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="meeting-details-form">
      <h2>Detalles de la Junta</h2>

      {/* Tipo de Junta */}
      <div>
        <label>
          Tipo de Junta:
          <select
            value={formData.tipoJunta}
            onChange={(e) => setFormData({ ...formData, tipoJunta: e.target.value as TipoJunta })}
          >
            <option value="JUNTA_UNIVERSAL">Junta Universal</option>
            <option value="JUNTA_GENERAL">Junta General</option>
          </select>
        </label>
      </div>

      {/* Es Anual Obligatoria */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.esAnualObligatoria}
            onChange={(e) => setFormData({ ...formData, esAnualObligatoria: e.target.checked })}
          />
          Es Anual Obligatoria
        </label>
      </div>

      {/* Primera Convocatoria */}
      <fieldset>
        <legend>Primera Convocatoria</legend>
        <div>
          <label>
            Modo:
            <select
              value={formData.primeraConvocatoria?.modo || 'PRESENCIAL'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primeraConvocatoria: {
                    ...formData.primeraConvocatoria,
                    modo: e.target.value as ModoReunion,
                    direccion: '',
                    fecha: '',
                    hora: '',
                  } as any,
                })
              }
            >
              <option value="PRESENCIAL">Presencial</option>
              <option value="VIRTUAL">Virtual</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            {formData.primeraConvocatoria?.modo === 'PRESENCIAL' ? 'Dirección' : 'Link'}:
            <input
              type="text"
              value={formData.primeraConvocatoria?.direccion || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primeraConvocatoria: {
                    ...formData.primeraConvocatoria,
                    direccion: e.target.value,
                    modo: formData.primeraConvocatoria?.modo || 'PRESENCIAL',
                    fecha: formData.primeraConvocatoria?.fecha || '',
                    hora: formData.primeraConvocatoria?.hora || '',
                  } as any,
                })
              }
            />
          </label>
        </div>
        <div>
          <label>
            Fecha:
            <input
              type="date"
              value={formData.primeraConvocatoria?.fecha?.split('T')[0] || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primeraConvocatoria: {
                    ...formData.primeraConvocatoria,
                    fecha: new Date(e.target.value).toISOString(),
                    modo: formData.primeraConvocatoria?.modo || 'PRESENCIAL',
                    direccion: formData.primeraConvocatoria?.direccion || '',
                    hora: formData.primeraConvocatoria?.hora || '',
                  } as any,
                })
              }
            />
          </label>
        </div>
        <div>
          <label>
            Hora:
            <input
              type="time"
              value={formData.primeraConvocatoria?.hora?.split('T')[1]?.slice(0, 5) || ''}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const date = new Date();
                date.setHours(parseInt(hours), parseInt(minutes));
                setFormData({
                  ...formData,
                  primeraConvocatoria: {
                    ...formData.primeraConvocatoria,
                    hora: date.toISOString(),
                    modo: formData.primeraConvocatoria?.modo || 'PRESENCIAL',
                    direccion: formData.primeraConvocatoria?.direccion || '',
                    fecha: formData.primeraConvocatoria?.fecha || '',
                  } as any,
                });
              }}
            />
          </label>
        </div>
      </fieldset>

      {/* Segunda Convocatoria (similar a primera) */}
      {/* ... */}

      {/* Instalada en Convocatoria */}
      <div>
        <label>
          Instalada en Convocatoria:
          <select
            value={formData.instaladaEnConvocatoria}
            onChange={(e) =>
              setFormData({
                ...formData,
                instaladaEnConvocatoria: e.target.value as OrdenConvocatoria,
              })
            }
          >
            <option value="PRIMERA">Primera</option>
            <option value="SEGUNDA">Segunda</option>
          </select>
        </label>
      </div>

      {/* Presidente y Secretario */}
      <div>
        <label>
          Presidente ID (UUID):
          <input
            type="text"
            value={formData.presidenteId || ''}
            onChange={(e) => setFormData({ ...formData, presidenteId: e.target.value })}
            placeholder="UUID del director"
          />
        </label>
      </div>

      <div>
        <label>
          Secretario ID (UUID):
          <input
            type="text"
            value={formData.secretarioId || ''}
            onChange={(e) => setFormData({ ...formData, secretarioId: e.target.value })}
            placeholder="UUID del director"
          />
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Detalles'}
      </button>
    </form>
  );
};
```

---

## 📝 Ejemplo de Request (PUT)

```json
{
  "tipoJunta": "JUNTA_UNIVERSAL",
  "esAnualObligatoria": false,
  "primeraConvocatoria": {
    "direccion": "Calle 123, Bogotá",
    "modo": "PRESENCIAL",
    "fecha": "2025-01-15T00:00:00.000Z",
    "hora": "2025-01-15T14:00:00.000Z"
  },
  "segundaConvocatoria": {
    "direccion": "https://meet.google.com/abc-defg-hij",
    "modo": "VIRTUAL",
    "fecha": "2025-01-16T00:00:00.000Z",
    "hora": "2025-01-16T14:00:00.000Z"
  },
  "instaladaEnConvocatoria": "PRIMERA",
  "presidenteId": "019ad1d1-f27c-7264-bc29-be2d70a33cbb",
  "secretarioId": "019ad1d1-f27c-7264-bc29-be2d70a33cbc",
  "presidenteAsistio": true,
  "secretarioAsistio": true
}
```

---

## 📝 Ejemplo de Response (GET)

```json
{
  "success": true,
  "message": "Detalles de la junta obtenidos correctamente",
  "code": 200,
  "data": {
    "id": "019ad1d1-f27c-7264-bc29-be2d70a33cba",
    "meetingType": "JUNTA_UNIVERSAL",
    "isAnnualMandatory": false,
    "firstCall": {
      "address": "Calle 123, Bogotá",
      "mode": "IN_PERSON",
      "date": "2025-01-15T00:00:00.000Z",
      "time": "2025-01-15T14:00:00.000Z"
    },
    "secondCall": {
      "address": "https://meet.google.com/abc-defg-hij",
      "mode": "VIRTUAL",
      "date": "2025-01-16T00:00:00.000Z",
      "time": "2025-01-16T14:00:00.000Z"
    },
    "heldAtCall": "FIRST",
    "presidentId": "019ad1d1-f27c-7264-bc29-be2d70a33cbb",
    "secretaryId": "019ad1d1-f27c-7264-bc29-be2d70a33cbc",
    "presidentAttended": true,
    "secretaryAttended": true,
    "otherPresidentName": null,
    "otherSecretaryName": null
  }
}
```

---

## 🔗 Relación con el Snapshot

### **¿Qué es el `meetingConfigId`?**

El `meetingConfigId` es un UUID que se crea cuando se inicializa un flujo de junta (cuando llamas a `POST /register-assembly`). Este ID está disponible en el **snapshot completo**:

```typescript
// Del snapshot completo
const snapshot = await getSnapshotComplete(societyId, flowId);

// El meetingConfigId está aquí:
const meetingConfigId = snapshot.meetingConfigId;
const meetingConfig = snapshot.meetingConfig; // Datos básicos

// Para obtener los detalles completos, usa:
const details = await getMeetingDetails(societyId, flowId);
```

### **Flujo de Trabajo Recomendado**

1. **Crear Junta** → Obtienes `flowId` y `meetingConfigId` en el snapshot
2. **Obtener Snapshot** → Ver `meetingConfigId` y datos básicos
3. **Configurar Detalles** → Usar `PUT /meeting-details` con el `flowId`
4. **Consultar Detalles** → Usar `GET /meeting-details` con el `flowId`

### **¿Hay endpoint para consultar por `meetingConfigId` directamente?**

**No.** El endpoint requiere `societyId` y `flowId` porque:
- Valida que el `meetingConfigId` pertenezca al flujo correcto
- Asegura que el usuario tenga permisos sobre la sociedad
- Mantiene la consistencia de datos

**Para obtener los detalles, siempre usa:**
```typescript
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
```

---

## ⚠️ Notas Importantes

### **1. Dirección vs Link**
- Si `modo === 'PRESENCIAL'` → `direccion` debe ser una dirección física
- Si `modo === 'VIRTUAL'` → `direccion` debe ser un link (URL)

### **2. Fechas y Horas**
- Enviar como **ISO Date strings**
- El backend convierte automáticamente con `z.coerce.date()`

### **3. Presidente y Secretario**
- Si son directores registrados → usar `presidenteId` y `secretarioId` (UUIDs)
- Si son personas externas → usar `nombreOtroPresidente` y `nombreOtroSecretario`
- **No se pueden usar ambos a la vez**

### **4. Convocatorias Opcionales**
- `primeraConvocatoria` y `segundaConvocatoria` son opcionales
- Al menos una debe estar presente para que la junta sea válida

---

## 🆘 Manejo de Errores

```typescript
try {
  await MeetingDetailsService.updateMeetingDetails(societyId, flowId, dto);
} catch (error: any) {
  if (error.response?.status === 404) {
    console.error('Junta o configuración no encontrada');
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
- [ ] Implementar formulario de detalles
- [ ] Manejar estados de carga y error
- [ ] Validar fechas y horas
- [ ] Validar modo (PRESENCIAL/VIRTUAL)
- [ ] Integrar con el snapshot para obtener `meetingConfigId`
- [ ] Probar con diferentes tipos de junta

---

**¡Listo para usar! 🎉**

