# 📥 ENDPOINT: Download Data - Datos Completos de la Junta

**Fecha**: 7 de Diciembre 2025  
**Estado**: ✅ Implementado  
**Propósito**: Endpoint agregador que trae TODA la información de la junta para la vista de descargas

---

## 🎯 Endpoint

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/download-data
```

**Parámetros:**
- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo/junta

**Headers:**
```
Authorization: Bearer {token}
```

---

## 📋 Estructura de la Respuesta

El endpoint retorna **TODA** la información de la junta organizada por pasos:

### **Estructura Completa:**

```typescript
{
  // Paso 0: Puntos de agenda
  agendaItems: {
    aumentoCapital: {
      aportesDinerarios: boolean,
      aporteNoDinerario: boolean,
      capitalizacionDeCreditos: boolean
    },
    remocion: {
      remocionGerenteGeneral: boolean,
      remocionApoderados: boolean,
      remocionDirectores: boolean
    },
    nombramiento: {
      nombramientoGerenteGeneral: boolean,
      nombramientoApoderados: boolean,
      nombramientoDirectores: boolean,
      nombramientoNuevoDirectorio: boolean
    },
    gestionSocialYResultadosEconomicos: {
      pronunciamientoGestionSocialYResultados: boolean,
      aplicacionResultados: boolean,
      designacionAuditoresExternos: boolean
    }
  },

  // Paso 1: Detalles de la junta
  meetingDetails: {
    id: string (UUID),
    meetingType: "JUNTA_UNIVERSAL" | "JUNTA_GENERAL",
    meetingTypeFormatted: "Junta Universal" | "Junta General", // ✅ COMPUTADO
    isAnnualMandatory: boolean,
    firstCall: {
      date: string (ISO) | null,
      dateFormatted: string | null, // ✅ COMPUTADO: "15 de diciembre de 2025"
      time: string (ISO) | null,
      timeFormatted: string | null, // ✅ COMPUTADO: "10:00"
      dateTimeFormatted: string | null, // ✅ COMPUTADO: "15 de diciembre de 2025 a las 10:00"
      place: string | null,
      mode: "PRESENCIAL" | "VIRTUAL" | null,
      modeFormatted: "Presencial" | "Virtual" | null // ✅ COMPUTADO
    } | null,
    secondCall: {
      date: string (ISO) | null,
      dateFormatted: string | null, // ✅ COMPUTADO
      time: string (ISO) | null,
      timeFormatted: string | null, // ✅ COMPUTADO
      dateTimeFormatted: string | null, // ✅ COMPUTADO
      place: string | null,
      mode: "PRESENCIAL" | "VIRTUAL" | null,
      modeFormatted: "Presencial" | "Virtual" | null // ✅ COMPUTADO
    } | null,
    president: {
      personId: string (UUID),
      name: string
    } | null,
    secretary: {
      personId: string (UUID),
      name: string
    } | null
  },

  // Paso 2: Asistencia
  attendance: [
    {
      id: string (UUID),
      configJuntaId: string (UUID),
      accionista: ShareholderReadDto, // Estructura compleja del accionista
      accionesConDerechoVoto: number,
      porcentajeParticipacion: number,
      asistio: boolean,
      representante: {
        nombre: string,
        apellidoPaterno: string,
        apellidoMaterno: string,
        tipoDocumento: string,
        numeroDocumento: string,
        paisEmision: string | null
      } | null
    }
  ],

  // Paso 3: Datos de puntos de agenda
  agendaItemsData: {
    aporteDinerario: {
      aportanteData: [
        {
          id: string (UUID),
          person: PersonMapper, // Estructura compleja de la persona
          typeShareholder: string,
          isContributor: boolean
        }
      ],
      aportesData: [
        {
          id: string (UUID),
          shareholderId: string (UUID),
          shareClass: {
            id: string (UUID),
            type: string,
            className: string
          } | null,
          currency: string,
          contributionAmount: number,
          contributionAmountFormatted: string, // ✅ COMPUTADO: "S/ 1000.00" o "$ 1000.00"
          contributionDate: string,
          contributionDateFormatted: string | null, // ✅ COMPUTADO: "1 de diciembre de 2025"
          exchangeRate: number | null,
          exchangeRateFormatted: string | null, // ✅ COMPUTADO: "3.7500"
          contributionAmountInBaseCurrency: number,
          contributionAmountInBaseCurrencyFormatted: string, // ✅ COMPUTADO: "S/ 1000.00"
          sharesToReceive: number,
          sharesToReceiveFormatted: string, // ✅ COMPUTADO: "1,000"
          pricePerShare: number,
          pricePerShareFormatted: string, // ✅ COMPUTADO: "S/ 1.00"
          isFullyPaid: boolean,
          socialCapital: number,
          socialCapitalFormatted: string, // ✅ COMPUTADO: "S/ 800.00"
          premium: number,
          premiumFormatted: string, // ✅ COMPUTADO: "S/ 150.00"
          reserve: number,
          reserveFormatted: string, // ✅ COMPUTADO: "S/ 50.00"
          paidPercent: number,
          paidPercentFormatted: string, // ✅ COMPUTADO: "100.00%"
          totalLiability: number,
          totalLiabilityFormatted: string, // ✅ COMPUTADO: "S/ 1000.00"
          accountingEntryFileId: string (UUID) | null
        }
      ],
      votacionData: {
        id: string (UUID),
        modo: "SIMPLE" | "CUMULATIVO",
        items: [
          {
            id: string (UUID),
            orden: number,
            label: string,
            descripción: string | null,
            personaId: string (UUID) | null,
            tipoAprobacion: "APROBADO_POR_TODOS" | "SOMETIDO_A_VOTACION" | null,
            votos: [
              {
                id: string (UUID),
                accionistaId: string (UUID), // ID del accionista (ShareholderV2.id)
                valor: string | number // "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | number
              }
            ]
          }
        ]
      } | null
    } | null
    // Aquí se pueden agregar más puntos de agenda en el futuro
  }
}
```

---

## 📝 Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Datos de la junta obtenidos correctamente para descarga",
  "data": {
    "agendaItems": {
      "aumentoCapital": {
        "aportesDinerarios": true,
        "aporteNoDinerario": false,
        "capitalizacionDeCreditos": false
      },
      "remocion": {
        "remocionGerenteGeneral": false,
        "remocionApoderados": false,
        "remocionDirectores": false
      },
      "nombramiento": {
        "nombramientoGerenteGeneral": false,
        "nombramientoApoderados": false,
        "nombramientoDirectores": false,
        "nombramientoNuevoDirectorio": false
      },
      "gestionSocialYResultadosEconomicos": {
        "pronunciamientoGestionSocialYResultados": false,
        "aplicacionResultados": false,
        "designacionAuditoresExternos": false
      }
    },
    "meetingDetails": {
      "id": "019af8bf-4626-76a4-a8f2-4df22a11b47d",
      "meetingType": "JUNTA_UNIVERSAL",
      "isAnnualMandatory": false,
      "firstCall": {
        "date": "2025-12-15T10:00:00.000Z",
        "time": "2025-12-15T10:00:00.000Z",
        "place": "Av. Principal 123",
        "mode": "PRESENCIAL"
      },
      "secondCall": null,
      "president": {
        "personId": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",
        "name": ""
      },
      "secretary": {
        "personId": "019af8bf-460b-7077-9e0b-54867710026b",
        "name": ""
      }
    },
    "attendance": [
      {
        "id": "019af8bf-4626-76a4-a8f2-4df22a11b47d",
        "configJuntaId": "019af8bf-4626-76a4-a8f2-4df22a11b47d",
        "accionista": {
          "id": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",
          "person": {
            // Estructura compleja de PersonMapper
          }
        },
        "accionesConDerechoVoto": 100,
        "porcentajeParticipacion": 50.0,
        "asistio": true,
        "representante": null
      }
    ],
    "agendaItemsData": {
      "aporteDinerario": {
        "aportanteData": [
          {
            "id": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",
            "person": {
              // Estructura compleja de PersonMapper
            },
            "typeShareholder": "NATURAL",
            "isContributor": true
          }
        ],
        "aportesData": [
          {
            "id": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",
            "shareholderId": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",
            "shareClass": {
              "id": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",
              "type": "ORDINARIA",
              "className": "Clase A"
            },
            "currency": "PEN",
            "contributionAmount": 1000.0,
            "contributionDate": "2025-12-01",
            "exchangeRate": null,
            "contributionAmountInBaseCurrency": 1000.0,
            "sharesToReceive": 1000,
            "pricePerShare": 1.0,
            "isFullyPaid": true,
            "socialCapital": 800.0,
            "premium": 150.0,
            "reserve": 50.0,
            "paidPercent": 100.0,
            "totalLiability": 1000.0,
            "accountingEntryFileId": null
          }
        ],
        "votacionData": {
          "id": "019af8bf-4626-76a4-a8f2-4df22a11b47d",
          "modo": "SIMPLE",
          "items": [
            {
              "id": "019af8bf-4626-76a4-a8f2-4df22a11b47d",
              "orden": 0,
              "label": "Se aprueba el aumento de capital...",
              "descripción": "Votación sobre la aprobación de los aportes dinerarios",
              "personaId": null,
              "tipoAprobacion": "SOMETIDO_A_VOTACION",
              "votos": [
                {
                  "id": "019af8bf-4626-76a4-a8f2-4df22a11b47d",
                  "accionistaId": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",
                  "valor": "A_FAVOR"
                }
              ]
            }
          ]
        }
      }
    }
  },
  "code": 200
}
```

---

## 🔍 Detalles de Cada Sección

### **1. Paso 0: Puntos de Agenda (`agendaItems`)**

**Endpoint reutilizado:** `GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items`

**Descripción:** Indica qué puntos de agenda están activos en la junta.

**Campos:**
- `aumentoCapital`: Puntos relacionados con aumento de capital
- `remocion`: Puntos relacionados con remoción de cargos
- `nombramiento`: Puntos relacionados con nombramientos
- `gestionSocialYResultadosEconomicos`: Puntos relacionados con gestión social

---

### **2. Paso 1: Detalles de la Junta (`meetingDetails`)**

**Endpoint reutilizado:** `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details`

**Descripción:** Configuración completa de la junta (tipo, convocatorias, presidente, secretario).

**Campos importantes:**
- `meetingType`: Tipo de junta (Universal o General)
- `firstCall` / `secondCall`: Información de las convocatorias
- `president` / `secretary`: Información del presidente y secretario

**Nota:** Si `president.personId` existe pero `president.name` está vacío, significa que es un presidente interno (director/apoderado). Si `president.name` tiene valor, es un presidente externo.

---

### **3. Paso 2: Asistencia (`attendance`)**

**Endpoint reutilizado:** `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance`

**Descripción:** Lista completa de accionistas con su información de asistencia.

**Campos importantes:**
- `accionista`: Información completa del accionista (incluye datos de persona)
- `asistio`: Si el accionista asistió a la junta
- `representante`: Si el accionista tiene un representante asignado

---

### **4. Paso 3: Datos de Puntos de Agenda (`agendaItemsData`)**

**Descripción:** Datos específicos de cada punto de agenda activo.

#### **4.1. Aporte Dinerario (`aporteDinerario`)**

**Endpoints reutilizados:**
- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/participants` (aportanteData)
- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions` (aportesData)
- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=APORTES_DINERARIOS` (votacionData)

**Estructura:**

**`aportanteData`:** Lista de todos los accionistas que pueden ser aportantes (potenciales o marcados como contribuyentes).

**`aportesData`:** Lista de todos los aportes dinerarios registrados.

**`votacionData`:** Información completa de la votación sobre los aportes dinerarios.

**Nota importante:** `votacionData.votos[].accionistaId` es el ID del accionista (`ShareholderV2.id`), NO el ID de la persona (`PersonV2.id`).

---

## ✅ Ventajas de Este Endpoint

1. **Una sola llamada:** Obtiene toda la información necesaria para la vista de descargas
2. **Reutiliza endpoints existentes:** No duplica lógica, solo agrega datos
3. **Datos computados:** Incluye campos formateados listos para usar en templates (fechas, montos, porcentajes)
4. **Extensible:** Fácil agregar más puntos de agenda en el futuro
5. **Consistente:** Usa los mismos DTOs y mappers que los endpoints individuales
6. **Eficiente:** Ejecuta todas las consultas en paralelo
7. **Listo para templates:** Todos los datos están formateados y listos para usar con Docxtemplater/Mustache

---

## 🔄 Extensibilidad

Para agregar más puntos de agenda en el futuro:

1. **Agregar al DTO:**
```typescript
agendaItemsData: {
  aporteDinerario: AporteDinerarioDataSchema.nullable(),
  capitalizacionCreditos: CapitalizacionCreditosDataSchema.nullable(), // ← Nuevo
  remocionDirectores: RemocionDirectoresDataSchema.nullable(), // ← Nuevo
  // etc.
}
```

2. **Agregar al handler:**
```typescript
const capitalizacionCreditos = await Promise.all([
  // Obtener datos de capitalización de créditos
  this.queryBus.execute(new GetCreditorsQuery(...)),
  this.queryBus.execute(new GetCreditCapitalizationQuery(...)),
  this.queryBus.execute(new GetAllVotesQuery(..., 'CAPITALIZACION_DE_CREDITOS')),
]);

agendaItemsData: {
  aporteDinerario: ...,
  capitalizacionCreditos: capitalizacionCreditos ? { ... } : null, // ← Nuevo
}
```

---

## 📚 Endpoints Reutilizados

Este endpoint reutiliza los siguientes endpoints existentes:

| Paso | Endpoint Reutilizado | Propósito |
|-----|---------------------|-----------|
| **Paso 0** | `GET /agenda-items` | Puntos de agenda activos |
| **Paso 1** | `GET /meeting-details` | Detalles de la junta |
| **Paso 2** | `GET /attendance` | Asistencia de accionistas |
| **Paso 3** | `GET /participants` | Aportantes potenciales |
| **Paso 3** | `GET /contributions` | Aportes registrados |
| **Paso 3** | `GET /votes?contexto=APORTES_DINERARIOS` | Votación de aportes |

---

## 🎯 Uso en el Frontend

```typescript
/**
 * Obtiene todos los datos de la junta para la vista de descargas
 */
async function obtenerDatosCompletosJunta(
  societyId: number,
  flowId: number
): Promise<DownloadDataDto> {
  const response = await fetch(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/download-data`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const { data } = await response.json();
  return data;
}

// Uso
const datosCompletos = await obtenerDatosCompletosJunta(societyId, flowId);

// Acceder a los datos
console.log('Puntos de agenda:', datosCompletos.agendaItems);
console.log('Detalles de la junta:', datosCompletos.meetingDetails);
console.log('Asistencia:', datosCompletos.attendance);
console.log('Aportes dinerarios:', datosCompletos.agendaItemsData.aporteDinerario);
```

---

## ⚠️ Notas Importantes

1. **Manejo de errores:** Si algún endpoint falla, el handler usa valores por defecto (null, [], etc.) para no romper la respuesta completa.

2. **Campos opcionales:** Muchos campos pueden ser `null` si no están configurados aún.

3. **Estructuras complejas:** `accionista` y `person` tienen estructuras complejas mapeadas por `PersonMapper` y `ShareholderReadDto`.

4. **IDs de accionistas:** En votaciones, `accionistaId` se refiere a `ShareholderV2.id`, NO a `PersonV2.id`.

---

## 📝 Checklist de Implementación

- [x] Query `GetDownloadDataQuery`
- [x] Handler `GetDownloadDataHandler`
- [x] DTO `DownloadDataDto`
- [x] Controller `GetDownloadDataController`
- [x] Módulo `DownloadDataModule`
- [x] Integración con módulo principal
- [x] Documentación completa

---

## 🚀 Estado Actual

**✅ IMPLEMENTADO Y LISTO PARA USAR**

- Endpoint funcional
- Reutiliza todos los endpoints existentes
- Solo incluye aporte dinerario por ahora (extensible)
- Documentación completa

---

## 📄 TEMPLATES MUSTACHE

**Ver documentación completa:** `docs/register-assembly/GUIA-TEMPLATES-MUSTACHE.md`

El endpoint retorna datos **computados y formateados** listos para usar en templates Mustache/Docxtemplater:

- ✅ Fechas formateadas (`dateFormatted`, `timeFormatted`, `dateTimeFormatted`)
- ✅ Montos formateados (`contributionAmountFormatted`, `socialCapitalFormatted`, etc.)
- ✅ Porcentajes formateados (`paidPercentFormatted`)
- ✅ Números con separadores (`sharesToReceiveFormatted`)
- ✅ Textos legibles (`meetingTypeFormatted`, `modeFormatted`)

**Ejemplo de uso en template:**
```mustache
La junta se realizará el {{meetingDetails.firstCall.dateFormatted}} a las {{meetingDetails.firstCall.timeFormatted}}
```

---

**¿Necesitas agregar más puntos de agenda?** Solo avísame y los agrego siguiendo el mismo patrón. 🙏

