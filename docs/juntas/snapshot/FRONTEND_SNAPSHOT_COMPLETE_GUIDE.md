# 📘 Guía Frontend: Snapshot Completo de Junta

## 🎯 Endpoint Principal

### **Obtener Snapshot Completo**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
```

**Autenticación:** Requiere JWT Bearer Token  
**Parámetros:**
- `societyId` (number): ID de la sociedad
- `flowId` (number): ID del flujo de junta

**Ejemplo:**
```http
GET http://localhost:3000/api/v2/society-profile/3/register-assembly/1/snapshot/complete
Authorization: Bearer <tu-token-jwt>
```

---

## 📋 Tipado TypeScript Completo

### **1. Tipos Base**

```typescript
// ============================================
// TIPOS DE PERSONA
// ============================================

type PersonType = 
  | 'NATURAL' 
  | 'JURIDICA' 
  | 'SUCURSAL' 
  | 'FONDO_INVERSION' 
  | 'FIDEICOMISO' 
  | 'SUCESION_INDIVISA';

interface PersonaNatural {
  id: string;
  tipo: 'NATURAL';
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  paisEmision?: string;
}

interface PersonaJuridica {
  id: string;
  tipo: 'JURIDICA';
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion: string;
  constituida: boolean;
  nombreComercial?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  pais?: string;
}

interface PersonaSucursal {
  id: string;
  tipo: 'SUCURSAL';
  ruc: string;
  nombreSucursal: string;
  partidaRegistral: string;
  oficinaRegistrada: string;
  direccionFiscal: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

interface PersonaFondoInversion {
  id: string;
  tipo: 'FONDO_INVERSION';
  nombreFondo: string;
  numeroRegistro: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

interface PersonaFideicomiso {
  id: string;
  tipo: 'FIDEICOMISO';
  nombreFideicomiso: string;
  numeroRegistro: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

interface PersonaSucesionIndivisa {
  id: string;
  tipo: 'SUCESION_INDIVISA';
  nombreSucesion: string;
  numeroRegistro: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

type Persona = 
  | PersonaNatural 
  | PersonaJuridica 
  | PersonaSucursal 
  | PersonaFondoInversion 
  | PersonaFideicomiso 
  | PersonaSucesionIndivisa;

// ============================================
// ACCIONISTAS
// ============================================

interface Shareholder {
  id: string;
  person: Persona;
}

// ============================================
// CLASES DE ACCIONES
// ============================================

type AccionType = 'COMUN' | 'CLASE' | 'PREFERENTE_NO_VOTO';

interface ArchivoAccion {
  archivoId: string;
  version: string;
  tipoMino: string;
  nombreOriginal: string;
  tamaño: number;
}

interface Accion {
  id: string;
  tipo: AccionType;
  nombre?: string;
  cantidadSuscrita: number;
  redimible: boolean;
  conDerechoVoto: boolean;
  archivoOtrosDerechos?: ArchivoAccion[];
  archivoObligaciones?: ArchivoAccion[];
  comentariosAdicionales?: string;
}

// ============================================
// ASIGNACIONES DE ACCIONES
// ============================================

interface AsignacionAccion {
  id: string;
  accionId: string;
  accionistaId: string;
  cantidadSuscrita: number;
  precioPorAccion: number;
  porcentajePagadoPorAccion: number;
  totalDividendosPendientes: number;
  pagadoCompletamente: boolean;
  fechaCreacion: string; // ISO Date string
  fechaActualizacion: string; // ISO Date string
}

// ============================================
// DIRECTORIO
// ============================================

interface Directorio {
  cantidadDirectores?: number;
  conteoPersonalizado: boolean;
  minimoDirectores?: number;
  maximoDirectores?: number;
  inicioMandato?: string | null; // ISO Date string
  finMandato?: string | null; // ISO Date string
  quorumMinimo?: number;
  mayoria?: number;
  presidenteDesignado: boolean;
  secretarioAsignado: boolean;
  reeleccionPermitida: boolean;
  presidentePreside: boolean;
  presidenteDesempata: boolean;
  periodo?: string;
  presidenteId?: string;
}

interface Director {
  id: string;
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
  rolDirector: string;
  reemplazaId?: string;
}

// ============================================
// APODERADOS
// ============================================

interface Apoderado {
  id: string;
  claseApoderadoId: string;
  persona: PersonaNatural | PersonaJuridica; // Solo NATURAL o JURIDICA
  poderId: string | null;
}

// ============================================
// PODERES
// ============================================

interface Poder {
  id: string;
  name: string;
  fileId?: string;
}

interface FirmantePoder {
  id: string;
  attorneyClassId: string;
  membersQuantity: number;
}

interface ReglaMonetaria {
  id: string;
  currencyType: string;
  fromAmount: number;
  limitType: string;
  toAmount?: number;
  signatureType: string;
  signers?: FirmantePoder[];
}

interface OtorgamientoPoder {
  id: string;
  powerId: string;
  signatureRulesEnabled: boolean;
  monetaryRules?: ReglaMonetaria[];
}

interface RegimenPoderes {
  id: string;
  powers: Poder[];
  powerGrants: OtorgamientoPoder[];
}

// ============================================
// QUORUMS
// ============================================

interface Quorum {
  primeraConvocatoriaSimple: number;
  primeraConvocatoriaCalificada: number;
  segundaConvocatoriaSimple: number;
  segundaConvocatoriaCalificada: number;
  quorumMinimoSimple: number;
  quorumMinimoCalificado: number;
}

// ============================================
// ACUERDOS SOCIETARIOS
// ============================================

interface ArchivoAcuerdo {
  versions: Array<{
    fileId: string;
    mimeType: string;
    originalName: string;
    size: number;
  }>;
}

interface AcuerdoEspecial {
  derechoPreferencia: boolean;
  archivoEstatutos: ArchivoAcuerdo | null;
  archivoAccionistas: ArchivoAcuerdo | null;
  archivoTerceros: ArchivoAcuerdo | null;
}

// ============================================
// CONFIGURACIÓN DE JUNTA
// ============================================

interface MeetingConfig {
  id: string;
  meetingType: string;
  isAnnualMandatory: boolean;
}

// ============================================
// INFORMACIÓN DEL FLUJO
// ============================================

interface FlowInfo {
  flowStructureId: number;
  currentStep: string;
  statusProgression: string;
}

// ============================================
// SNAPSHOT COMPLETO (RESPUESTA PRINCIPAL)
// ============================================

interface SnapshotComplete {
  // IDs del snapshot
  shareholderId: string;
  nominalValueId: string;
  shareAllocationId: string;
  meetingConfigId: string;
  directoryId?: string;
  attorneyRegistryId?: string;
  powerRegimenId?: string;
  quorumId?: string;
  specialAgreementsId?: string;

  // Valor nominal
  nominalValue: number;

  // Clases de acciones
  shareClasses: Accion[];

  // Accionistas
  shareholders: Shareholder[];

  // Asignaciones de acciones
  shareAllocations: AsignacionAccion[];

  // Directorio
  directory?: Directorio | null;
  directors?: Director[];

  // Apoderados
  attorneys?: Apoderado[];

  // Poderes
  powers?: RegimenPoderes | null;

  // Quorums
  quorums?: Quorum | null;

  // Acuerdos Societarios
  specialAgreements?: AcuerdoEspecial | null;

  // Configuración de junta
  meetingConfig: MeetingConfig;

  // Información del flujo
  flowInfo: FlowInfo;
}

// ============================================
// RESPUESTA DE LA API
// ============================================

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}

type SnapshotCompleteResponse = ApiResponse<SnapshotComplete>;
```

---

## 💻 Ejemplo de Uso (React/TypeScript)

### **1. Servicio API**

```typescript
// services/assembly.service.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export class AssemblyService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Obtiene el snapshot completo de una junta
   * @param societyId ID de la sociedad
   * @param flowId ID del flujo de junta
   * @returns Snapshot completo con todos los datos clonados
   */
  static async getSnapshotComplete(
    societyId: number,
    flowId: number
  ): Promise<SnapshotComplete> {
    const response = await axios.get<SnapshotCompleteResponse>(
      `${API_BASE_URL}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/snapshot/complete`,
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
// hooks/useSnapshotComplete.ts
import { useState, useEffect } from 'react';
import { AssemblyService } from '../services/assembly.service';
import { SnapshotComplete } from '../types/snapshot.types';

interface UseSnapshotCompleteResult {
  snapshot: SnapshotComplete | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSnapshotComplete(
  societyId: number | null,
  flowId: number | null
): UseSnapshotCompleteResult {
  const [snapshot, setSnapshot] = useState<SnapshotComplete | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshot = async () => {
    if (!societyId || !flowId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await AssemblyService.getSnapshotComplete(societyId, flowId);
      setSnapshot(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el snapshot');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, [societyId, flowId]);

  return {
    snapshot,
    loading,
    error,
    refetch: fetchSnapshot,
  };
}
```

### **3. Componente de Ejemplo**

```typescript
// components/SnapshotView.tsx
import React from 'react';
import { useSnapshotComplete } from '../hooks/useSnapshotComplete';

interface Props {
  societyId: number;
  flowId: number;
}

export const SnapshotView: React.FC<Props> = ({ societyId, flowId }) => {
  const { snapshot, loading, error, refetch } = useSnapshotComplete(
    societyId,
    flowId
  );

  if (loading) return <div>Cargando snapshot...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!snapshot) return <div>No hay datos disponibles</div>;

  return (
    <div className="snapshot-container">
      <h1>Snapshot Completo de Junta</h1>
      
      {/* Información del Flujo */}
      <section>
        <h2>Información del Flujo</h2>
        <p>ID: {snapshot.flowInfo.flowStructureId}</p>
        <p>Paso Actual: {snapshot.flowInfo.currentStep}</p>
        <p>Estado: {snapshot.flowInfo.statusProgression}</p>
      </section>

      {/* Valor Nominal */}
      <section>
        <h2>Capital Social</h2>
        <p>Valor Nominal: ${snapshot.nominalValue.toLocaleString()}</p>
        <p>Clases de Acciones: {snapshot.shareClasses.length}</p>
      </section>

      {/* Accionistas */}
      <section>
        <h2>Accionistas ({snapshot.shareholders.length})</h2>
        {snapshot.shareholders.map((shareholder) => (
          <div key={shareholder.id}>
            <p>
              {shareholder.person.tipo === 'NATURAL'
                ? `${shareholder.person.nombre} ${shareholder.person.apellidoPaterno}`
                : shareholder.person.razonSocial}
            </p>
          </div>
        ))}
      </section>

      {/* Directorio */}
      {snapshot.directory && (
        <section>
          <h2>Directorio</h2>
          <p>Cantidad de Directores: {snapshot.directory.cantidadDirectores}</p>
          {snapshot.directors && snapshot.directors.length > 0 && (
            <ul>
              {snapshot.directors.map((director) => (
                <li key={director.id}>
                  {director.persona.nombre} {director.persona.apellidoPaterno} - {director.rolDirector}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Apoderados */}
      {snapshot.attorneys && snapshot.attorneys.length > 0 && (
        <section>
          <h2>Apoderados ({snapshot.attorneys.length})</h2>
          {snapshot.attorneys.map((attorney) => (
            <div key={attorney.id}>
              <p>
                {attorney.persona.tipo === 'NATURAL'
                  ? `${attorney.persona.nombre} ${attorney.persona.apellidoPaterno}`
                  : attorney.persona.razonSocial}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Poderes */}
      {snapshot.powers && (
        <section>
          <h2>Régimen de Poderes</h2>
          <p>Poderes: {snapshot.powers.powers.length}</p>
          <p>Otorgamientos: {snapshot.powers.powerGrants.length}</p>
        </section>
      )}

      {/* Quorums */}
      {snapshot.quorums && (
        <section>
          <h2>Quorums</h2>
          <p>Primera Convocatoria Simple: {snapshot.quorums.primeraConvocatoriaSimple}%</p>
          <p>Primera Convocatoria Calificada: {snapshot.quorums.primeraConvocatoriaCalificada}%</p>
        </section>
      )}

      {/* Acuerdos Societarios */}
      {snapshot.specialAgreements && (
        <section>
          <h2>Acuerdos Societarios</h2>
          <p>Derecho de Preferencia: {snapshot.specialAgreements.derechoPreferencia ? 'Sí' : 'No'}</p>
        </section>
      )}

      <button onClick={refetch}>Actualizar</button>
    </div>
  );
};
```

---

## 📝 Ejemplo de Respuesta JSON

```json
{
  "success": true,
  "message": "Snapshot completo obtenido correctamente",
  "code": 200,
  "data": {
    "shareholderId": "019ad1d1-f27c-7264-bc29-be2d70a33cb7",
    "nominalValueId": "019ad1d1-f27c-7264-bc29-be2d70a33cb8",
    "shareAllocationId": "019ad1d1-f27c-7264-bc29-be2d70a33cb9",
    "meetingConfigId": "019ad1d1-f27c-7264-bc29-be2d70a33cba",
    "directoryId": "019ad1d1-f27c-7264-bc29-be2d70a33cbb",
    "attorneyRegistryId": "019ad1d1-f27c-7264-bc29-be2d70a33cbc",
    "powerRegimenId": "019ad1d1-f27c-7264-bc29-be2d70a33cbd",
    "quorumId": "019ad1d1-f27c-7264-bc29-be2d70a33cbe",
    "specialAgreementsId": "019ad1d1-f27c-7264-bc29-be2d70a33cbf",
    
    "nominalValue": 1000000,
    
    "shareClasses": [
      {
        "id": "uuid-accion-1",
        "tipo": "COMUN",
        "nombre": "Acción Común",
        "cantidadSuscrita": 1000,
        "redimible": false,
        "conDerechoVoto": true,
        "comentariosAdicionales": null
      }
    ],
    
    "shareholders": [
      {
        "id": "uuid-shareholder-1",
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
      }
    ],
    
    "shareAllocations": [
      {
        "id": "uuid-allocation-1",
        "accionId": "uuid-accion-1",
        "accionistaId": "uuid-shareholder-1",
        "cantidadSuscrita": 500,
        "precioPorAccion": 1000,
        "porcentajePagadoPorAccion": 100,
        "totalDividendosPendientes": 0,
        "pagadoCompletamente": true,
        "fechaCreacion": "2025-01-01T00:00:00.000Z",
        "fechaActualizacion": "2025-01-01T00:00:00.000Z"
      }
    ],
    
    "directory": {
      "cantidadDirectores": 3,
      "conteoPersonalizado": false,
      "minimoDirectores": 3,
      "maximoDirectores": 5,
      "inicioMandato": "2025-01-01T00:00:00.000Z",
      "finMandato": "2026-01-01T00:00:00.000Z",
      "quorumMinimo": 50,
      "mayoria": 51,
      "presidenteDesignado": true,
      "secretarioAsignado": true,
      "reeleccionPermitida": true,
      "presidentePreside": true,
      "presidenteDesempata": true,
      "periodo": "ANUAL",
      "presidenteId": "uuid-director-1"
    },
    
    "directors": [
      {
        "id": "uuid-director-1",
        "persona": {
          "id": "uuid-person-2",
          "nombre": "María",
          "apellidoPaterno": "López",
          "apellidoMaterno": "Martínez",
          "tipoDocumento": "CEDULA",
          "numeroDocumento": "0987654321",
          "paisEmision": "COLOMBIA"
        },
        "rolDirector": "PRESIDENTE",
        "reemplazaId": null
      }
    ],
    
    "attorneys": [
      {
        "id": "uuid-attorney-1",
        "claseApoderadoId": "uuid-class-1",
        "persona": {
          "id": "uuid-person-3",
          "tipo": "NATURAL",
          "nombre": "Carlos",
          "apellidoPaterno": "Rodríguez",
          "apellidoMaterno": "Sánchez",
          "tipoDocumento": "CEDULA",
          "numeroDocumento": "1122334455",
          "paisEmision": "COLOMBIA"
        },
        "poderId": "uuid-power-1"
      }
    ],
    
    "powers": {
      "id": "uuid-power-regimen-1",
      "powers": [
        {
          "id": "uuid-power-1",
          "name": "Poder General",
          "fileId": "uuid-file-1"
        }
      ],
      "powerGrants": [
        {
          "id": "uuid-grant-1",
          "powerId": "uuid-power-1",
          "signatureRulesEnabled": true,
          "monetaryRules": [
            {
              "id": "uuid-rule-1",
              "currencyType": "COP",
              "fromAmount": 0,
              "limitType": "SIN_LIMITE",
              "toAmount": null,
              "signatureType": "CONJUNTA",
              "signers": [
                {
                  "id": "uuid-signer-1",
                  "attorneyClassId": "uuid-class-1",
                  "membersQuantity": 2
                }
              ]
            }
          ]
        }
      ]
    },
    
    "quorums": {
      "primeraConvocatoriaSimple": 50.0,
      "primeraConvocatoriaCalificada": 66.67,
      "segundaConvocatoriaSimple": 25.0,
      "segundaConvocatoriaCalificada": 33.33,
      "quorumMinimoSimple": 50.0,
      "quorumMinimoCalificado": 66.67
    },
    
    "specialAgreements": {
      "derechoPreferencia": true,
      "archivoEstatutos": {
        "versions": [
          {
            "fileId": "uuid-file-2",
            "mimeType": "application/pdf",
            "originalName": "estatutos.pdf",
            "size": 1024000
          }
        ]
      },
      "archivoAccionistas": null,
      "archivoTerceros": null
    },
    
    "meetingConfig": {
      "id": "uuid-meeting-config-1",
      "meetingType": "JUNTA_UNIVERSAL",
      "isAnnualMandatory": false
    },
    
    "flowInfo": {
      "flowStructureId": 1,
      "currentStep": "INIT",
      "statusProgression": "CREATED"
    }
  }
}
```

---

## 🔄 Flujo de Trabajo Recomendado

### **1. Crear una Junta**
```typescript
// POST /api/v2/society-profile/:societyId/register-assembly
const response = await axios.post(
  `${API_BASE_URL}/api/v2/society-profile/${societyId}/register-assembly`,
  {},
  { headers: AssemblyService.getAuthHeaders() }
);

const { flowStructureId } = response.data.data;
```

### **2. Obtener el Snapshot Completo**
```typescript
const snapshot = await AssemblyService.getSnapshotComplete(
  societyId,
  flowStructureId
);
```

### **3. Usar los Datos**
```typescript
// Todos los datos están disponibles en un solo objeto
console.log('Accionistas:', snapshot.shareholders);
console.log('Directores:', snapshot.directors);
console.log('Apoderados:', snapshot.attorneys);
console.log('Poderes:', snapshot.powers);
// ... etc
```

---

## ⚠️ Notas Importantes

### **Campos Opcionales**
Los siguientes campos pueden ser `null` o `undefined` si la sociedad no tiene esos datos configurados:
- `directoryId`, `directory`, `directors`
- `attorneyRegistryId`, `attorneys`
- `powerRegimenId`, `powers`
- `quorumId`, `quorums`
- `specialAgreementsId`, `specialAgreements`

**Siempre verifica antes de usar:**
```typescript
if (snapshot.directory && snapshot.directors) {
  // Usar datos del directorio
}
```

### **Tipos de Persona**
Las personas pueden ser de diferentes tipos. Usa type guards:

```typescript
function isPersonaNatural(person: Persona): person is PersonaNatural {
  return person.tipo === 'NATURAL';
}

function isPersonaJuridica(person: Persona): person is PersonaJuridica {
  return person.tipo === 'JURIDICA';
}

// Uso
if (isPersonaNatural(shareholder.person)) {
  console.log(shareholder.person.nombre); // ✅ TypeScript sabe que tiene 'nombre'
}
```

### **Fechas**
Las fechas vienen como strings ISO. Convierte si necesitas objetos Date:

```typescript
const fechaInicio = snapshot.directory?.inicioMandato 
  ? new Date(snapshot.directory.inicioMandato) 
  : null;
```

---

## 🚀 Endpoints Relacionados

### **Listar Juntas de una Sociedad**
```http
GET /api/v2/society-profile/:societyId/register-assembly/list
```

**Respuesta:**
```typescript
interface SocietyFlowSummary {
  id: number;
  estado: string;
  actual: string;
}
```

### **Obtener Detalles de una Junta**
```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId
```

---

## 📦 Archivo de Tipos Completo

Crea un archivo `types/snapshot.types.ts` con todos los tipos anteriores para importarlos fácilmente:

```typescript
// types/snapshot.types.ts
export type { SnapshotComplete, Shareholder, Accion, ... } from './snapshot.types';
```

---

## ✅ Checklist de Implementación

- [ ] Crear archivo de tipos TypeScript
- [ ] Implementar servicio API
- [ ] Crear hook personalizado (si usas React)
- [ ] Implementar componente de visualización
- [ ] Manejar estados de carga y error
- [ ] Validar campos opcionales
- [ ] Implementar type guards para personas
- [ ] Probar con diferentes tipos de sociedad

---

## 🆘 Manejo de Errores

```typescript
try {
  const snapshot = await AssemblyService.getSnapshotComplete(societyId, flowId);
  // Usar snapshot
} catch (error: any) {
  if (error.response?.status === 404) {
    console.error('Junta no encontrada');
  } else if (error.response?.status === 401) {
    console.error('No autorizado - token inválido');
  } else {
    console.error('Error desconocido:', error.message);
  }
}
```

---

## 📞 Soporte

Si tienes dudas sobre la estructura de datos o necesitas más información, consulta:
- Swagger UI: `http://localhost:3000/api/docs`
- Endpoint específico: `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete`

---

**¡Listo para usar! 🎉**

