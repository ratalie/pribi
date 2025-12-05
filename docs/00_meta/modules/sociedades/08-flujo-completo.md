# 🔄 Sociedades - Flujo Completo End-to-End

> Diagrama y explicación del flujo completo de registro de sociedades.

---

## 🗺️ Diagrama de Flujo

```
INICIO
  │
  ▼
┌─────────────────────────────────────────┐
│ PASO 1: DATOS PRINCIPALES              │
│ - Razón Social                          │
│ - Tipo Sociedad (SA, SRL, EIRL, SAC)   │
│ - Capital Social                        │
│ - Duración                              │
│ → Crea society_profile_id               │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────┐
│ PASO 2: ACCIONISTAS                     │
│ - Personas Naturales / Jurídicas        │
│ - Datos completos (nombre, documento)  │
│ → Asociados a society_profile_id        │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────┐
│ PASO 3: ACCIONES                        │
│ - Tipos (Ordinaria, Preferencial)      │
│ - Cantidad y Valor Nominal              │
│ → Asociados a society_profile_id        │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────┐
│ PASO 4: ASIGNACIÓN DE ACCIONES          │
│ - Distribuir acciones a accionistas     │
│ - Calcular porcentajes automáticamente │
│ → Crea relación accionista-acción       │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────┐
│ PASO 5: DIRECTORIO                      │
│ - Configurar directorio                 │
│ - Asignar directores (de accionistas)  │
│ - Designar presidente                   │
│ → Estructura de gobierno                │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────┐
│ PASO 6: APODERADOS                      │
│ - Crear clases de apoderados            │
│ - Asignar facultades                    │
│ - Designar apoderados                   │
│ → Representantes legales                │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────┐
│ PASO 7: ESTATUTOS                       │
│ - Configurar estatutos                  │
│ - Generar documento                     │
│ → Base legal de la sociedad             │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────┐
│ PASO 8: QUORUM                          │
│ - Configurar porcentajes                │
│ - Simple vs Calificado                  │
│ - Primera vs Segunda convocatoria      │
│ → Reglas de votación                    │
└─────────────────────────────────────────┘
  │
  ▼
FIN - SOCIEDAD COMPLETA ✅
```

---

## 📊 Flujo de Datos Técnico

### Ejemplo: Crear Sociedad Completa

```typescript
// 1. Crear datos principales
const repository1 = new DatosPrincipalesHttpRepository();
const useCase1 = new CreateDatosPrincipalesUseCase(repository1);
const society = await useCase1.execute({
  razonSocial: "Tech Solutions SA",
  tipoSociedad: "SA",
  capitalSocial: 100000,
  duracion: 50,
});
const societyId = society.id;

// 2. Crear accionistas
const repository2 = new AccionistasHttpRepository();
const useCase2 = new CreateAccionistaUseCase(repository2);

const accionista1 = await useCase2.execute(societyId, {
  tipoPersona: "NATURAL",
  tipoDocumento: "DNI",
  numeroDocumento: "12345678",
  nombres: "Juan",
  apellidoPaterno: "Pérez",
  nacionalidad: "Peruana",
  domicilio: "Lima",
});

const accionista2 = await useCase2.execute(societyId, {
  tipoPersona: "NATURAL",
  tipoDocumento: "DNI",
  numeroDocumento: "87654321",
  nombres: "María",
  apellidoPaterno: "García",
  nacionalidad: "Peruana",
  domicilio: "Lima",
});

// 3. Crear acciones
const repository3 = new AccionesHttpRepository();
const useCase3 = new CreateAccionUseCase(repository3);

const accion = await useCase3.execute(societyId, {
  tipoAccion: "ORDINARIA",
  numeroAcciones: 1000,
  valorNominal: 100,
});

// 4. Asignar acciones
const repository4 = new AsignacionAccionesHttpRepository();
const useCase4 = new CreateAsignacionUseCase(repository4);

await useCase4.execute(societyId, {
  asignaciones: [
    { accionistaId: accionista1.id, accionId: accion.id, numeroAcciones: 600 },
    { accionistaId: accionista2.id, accionId: accion.id, numeroAcciones: 400 },
  ],
});

// 5. Configurar directorio
const repository5 = new DirectorioHttpRepository();
const useCase5 = new UpdateDirectorioConfigUseCase(repository5);

await useCase5.execute(societyId, {
  tieneDirectorio: true,
  cantidadDirectores: 2,
  tienePresidente: true,
});

const useCase5b = new CreateDirectorUseCase(repository5);
await useCase5b.execute(societyId, {
  accionistaId: accionista1.id,
  cargo: "PRESIDENTE",
});
await useCase5b.execute(societyId, {
  accionistaId: accionista2.id,
  cargo: "DIRECTOR",
});

// 6. Crear apoderados
const repository6a = new ClasesApoderadosHttpRepository();
const useCase6a = new CreateClaseApoderadoUseCase(repository6a);

const clase = await useCase6a.execute(societyId, {
  nombre: "Apoderados Generales",
  facultades: ["Representar", "Firmar contratos", "Gestionar cuentas"],
});

const repository6b = new ApoderadosHttpRepository();
const useCase6b = new CreateApoderadoUseCase(repository6b);

await useCase6b.execute(societyId, {
  claseApoderadoId: clase.id,
  tipoDocumento: "DNI",
  numeroDocumento: "11111111",
  nombres: "Carlos",
  apellidoPaterno: "López",
  apellidoMaterno: "Torres",
});

// 7. Configurar estatutos (pendiente)

// 8. Configurar quorum
const repository8 = new QuorumHttpRepository();
const useCase8 = new UpdateQuorumUseCase(repository8);

await useCase8.execute(societyId, {
  quorumMinimoSimple: 25,
  quorumMinimoCalificado: 75,
  primeraConvocatoriaSimple: 50,
  primeraConvocatoriaCalificada: 75,
  segundaConvocatoriaSimple: 25,
  segundaConvocatoriaCalificada: 50,
});

console.log("✅ Sociedad completa creada:", societyId);
```

---

## ⏱️ Tiempos Estimados

| Paso | Tiempo Usuario | Tiempo Backend |
|------|---------------|----------------|
| 1. Datos Principales | 2-3 min | < 1s |
| 2. Accionistas | 3-5 min | < 1s por accionista |
| 3. Acciones | 2-3 min | < 1s |
| 4. Asignación | 2-3 min | < 1s |
| 5. Directorio | 2-3 min | < 1s |
| 6. Apoderados | 3-5 min | < 1s por apoderado |
| 7. Estatutos | 2-3 min | < 1s |
| 8. Quorum | 2-3 min | < 1s |
| **TOTAL** | **18-28 min** | **< 10s** |

---

## 🎯 Estados de la Sociedad

```typescript
enum SociedadEstado {
  BORRADOR = "borrador",           // Paso 1 iniciado
  ACCIONISTAS_OK = "accionistas",  // Paso 2 completado
  ACCIONES_OK = "acciones",        // Paso 3 completado
  ASIGNACION_OK = "asignacion",    // Paso 4 completado
  DIRECTORIO_OK = "directorio",    // Paso 5 completado
  APODERADOS_OK = "apoderados",    // Paso 6 completado
  ESTATUTOS_OK = "estatutos",      // Paso 7 completado
  COMPLETA = "completa",           // Paso 8 completado ✅
}
```

---

## 📚 Ver También

- [01-vision-general.md](./01-vision-general.md) - Visión general del módulo
- [02-domain.md](./02-domain.md) - Entidades usadas en el flujo
- [03-application.md](./03-application.md) - Use Cases orquestados

---

**Última actualización:** Diciembre 3, 2025



