# 📚 DOCUMENTACIÓN V2.5 ↔ V3: ÍNDICE MAESTRO

**Propósito**: Coordinar el trabajo entre IA V2.5, IA V3 y Backend V3  
**Fecha**: 2 de Diciembre 2025

---

## 🎯 LECTURA RECOMENDADA POR ROL

### Para IA Frontend V2.5

**Leer en este orden**:

1. **⚡ RESUMEN-EJECUTIVO-PARA-IAS.md** (2 min)

   - Orientación rápida
   - Qué cambió de V2.5 a V3
   - Tu rol específico

2. **🎯 DOCUMENTO-MAESTRO-COORDINACION-V25-V3-BACKEND.md** (15 min)

   - Patrón lógico descubierto
   - Cómo V3 transformó tus 11 pasos
   - Reglas de coordinación

3. **📊 GUIA-MIGRACION-V25-A-V3.md** (30 min)

   - Inventario completo del core de negocio V3
   - Análisis bidireccional (qué tienes, qué tiene V3)
   - Guía de migración con código lado a lado

4. **📋 INFORME-EJECUTIVO-PROBO-V25.md** (20 min - REFERENCIA)
   - Tu estado actual completo
   - Para consultar cuando V3 pregunte sobre algo específico

### Para IA Frontend V3

**Leer en este orden**:

1. **⚡ RESUMEN-EJECUTIVO-PARA-IAS.md** (2 min)

   - Orientación rápida
   - Estado actual del proyecto
   - Tu rol específico

2. **🔍 ESTADO-ACTUAL-V3-IMPLEMENTACION.md** (20 min)

   - QUÉ ESTÁ implementado exactamente
   - QUÉ FALTA por hacer
   - Plan de ejecución paso a paso

3. **🎯 DOCUMENTO-MAESTRO-COORDINACION-V25-V3-BACKEND.md** (15 min)

   - Estrategia completa
   - Cómo usar MSW para adelantarte
   - Reglas de coordinación

4. **📊 GUIA-MIGRACION-V25-A-V3.md** (30 min - REFERENCIA)
   - Patrones de migración
   - Ejemplos de código
   - Reglas de arquitectura hexagonal

### Para IA Backend V3

**Leer en este orden**:

1. **⚡ RESUMEN-EJECUTIVO-PARA-IAS.md** (2 min)

   - Orientación rápida
   - El patrón universal que debes seguir
   - Tu rol específico

2. **🎯 DOCUMENTO-MAESTRO-COORDINACION-V25-V3-BACKEND.md** (15 min)

   - Patrón universal de endpoints
   - DTOs esperados por frontend
   - Reglas de coordinación

3. **📊 INFORME-BACKEND-V3-ESTADO-ACTUAL.md** (20 min - REFERENCIA)
   - Tu estado actual
   - Lo que ya tienes implementado
   - Lo que falta por hacer

---

## 📋 LISTA DE DOCUMENTOS

### Documentos Maestros (LEER PRIMERO)

| Documento                                            | Líneas | Propósito                  | Audiencia         |
| ---------------------------------------------------- | ------ | -------------------------- | ----------------- |
| **RESUMEN-EJECUTIVO-PARA-IAS.md**                    | ~400   | Orientación rápida (2 min) | Todas las IAs     |
| **DOCUMENTO-MAESTRO-COORDINACION-V25-V3-BACKEND.md** | ~1,000 | Coordinación y estrategia  | Todas las IAs     |
| **ESTADO-ACTUAL-V3-IMPLEMENTACION.md**               | ~1,000 | Estado real del código V3  | IA V3, IA Backend |
| **GUIA-MIGRACION-V25-A-V3.md**                       | ~2,600 | Guía técnica completa      | IA V2.5, IA V3    |

### Documentos de Referencia

| Documento                               | Líneas | Propósito                               | Audiencia         |
| --------------------------------------- | ------ | --------------------------------------- | ----------------- |
| **INFORME-EJECUTIVO-PROBO-V25.md**      | ~2,000 | Estado completo de V2.5                 | IA V2.5, IA V3    |
| **INFORME-BACKEND-V3-ESTADO-ACTUAL.md** | ~1,800 | Estado completo del backend V3          | IA V3, IA Backend |
| **readme-temporal.md**                  | ~640   | Análisis sistema descarga documentos V2 | IA V2.5           |

**Total**: ~10,000 líneas de documentación

---

## 🚀 QUICK START POR TAREA

### Quiero implementar un Punto de Acuerdo en V3

1. Lee: **ESTADO-ACTUAL-V3-IMPLEMENTACION.md** → Sección "Juntas: Plan de Acción"
2. Consulta: **INFORME-EJECUTIVO-PROBO-V25.md** → Busca el flujo correspondiente
3. Replica: Patrón de Aporte Dinerario
4. Adapta: Lógica específica de V2.5

### Quiero implementar Repositorio en V3

1. Lee: **ESTADO-ACTUAL-V3-IMPLEMENTACION.md** → Sección "Repositorio: Plan"
2. Consulta: **GUIA-MIGRACION-V25-A-V3.md** → Sección "Módulo 2: Repositorio"
3. Usa: Use cases ya implementados (NO reescribir)
4. Crea: Solo presentación (stores, controllers, componentes)

### Quiero implementar Panel Administrativo en V3

1. Lee: **ESTADO-ACTUAL-V3-IMPLEMENTACION.md** → Sección "Panel: Plan"
2. Consulta: **INFORME-BACKEND-V3-ESTADO-ACTUAL.md** → Sección "Panel Administrativo"
3. Usa: Backend V1 API (100% funcional)
4. Crea: UI simple (tabla + detalle + matrix)

### Quiero entender el patrón de migración

1. Lee: **GUIA-MIGRACION-V25-A-V3.md** → Parte 3: "Guía de Migración"
2. Ve ejemplos: Wizard → FlowConfig, Store → Hexagonal, Composable → Controller
3. Replica: El patrón en tu implementación

---

## 🎨 DIAGRAMAS CLAVE

### Transformación de Juntas

```
V2.5 (Fragmentado):
/juntas/aporte-dinerario/paso-1       ─┐
/juntas/aporte-dinerario/paso-2        │
... (11 pasos)                         │ Junta 1
/juntas/aporte-dinerario/paso-11      ─┘

/juntas/capitalizacion/paso-1         ─┐
/juntas/capitalizacion/paso-2          │
... (11 pasos)                         │ Junta 2
/juntas/capitalizacion/paso-11        ─┘

V3 (Unificado):
/junta-accionistas/:id/seleccion-agenda       Paso 1
/junta-accionistas/:id/detalles               Paso 2
/junta-accionistas/:id/instalacion            Paso 3
/junta-accionistas/:id/puntos-acuerdo         Paso 4
  /aporte-dinerario                           ├─ Punto 1
    /aportantes                               │  ├─ Sección 1
    /aportes                                  │  ├─ Sección 2
    /votacion                                 │  ├─ Sección 3
    /resumen                                  │  └─ Sección 4
  /capitalizacion-creditos                    └─ Punto 2
    /acreedores                                  ├─ Sección 1
    /capitalizacion                              ├─ Sección 2
    /votacion                                    ├─ Sección 3
    /resumen                                     └─ Sección 4
/junta-accionistas/:id/resumen                Paso 5 (TODOS los puntos)
/junta-accionistas/:id/descargar              Paso 6 (UNA vez)
```

### Arquitectura Hexagonal

```
V2.5 (Sin arquitectura):
Component.vue
  └─> Store
      ├─> API call directo
      ├─> Validaciones inline
      ├─> Transformaciones inline
      └─> Lógica de negocio mezclada

V3 (Hexagonal):
Component.vue
  └─> Controller
      └─> Store (Option API)
          └─> Use Case
              ├─> Domain (validaciones)
              └─> Repository (abstracción)
                  ├─> HTTP Repository (producción)
                  └─> MSW Repository (desarrollo)
```

---

## ⚡ REGLAS DE ORO

### Para TODAS las IAs

1. **Arquitectura hexagonal SIEMPRE**: Domain → Application → Infrastructure → Presentation
2. **Stores con Option API OBLIGATORIO**: No Composition API
3. **Use Cases para lógica de negocio**: No en stores
4. **MSW para desarrollo**: No esperar backend
5. **DTOs bidireccionales**: Request y Response
6. **Mappers en Infrastructure**: No en Application
7. **Consultar antes de cambiar**: DTOs, endpoints, arquitectura

### Palabras Prohibidas

- ❌ "Composition API" (solo Option API)
- ❌ "API call directo en store" (usar Use Case)
- ❌ "Lógica de negocio en componente" (usar Use Case)
- ❌ "Una junta por tipo" (una junta, múltiples puntos)
- ❌ "11 pasos por flujo" (patrón universal)

### Palabras Mágicas

- ✅ "Arquitectura hexagonal"
- ✅ "MSW repository"
- ✅ "Use Case"
- ✅ "Patrón universal"
- ✅ "Una junta, múltiples puntos"
- ✅ "Replicar patrón"

---

**🎉 DOCUMENTACIÓN COMPLETA LISTA PARA USAR**

Las 3 IAs tienen toda la información para trabajar coordinadamente y avanzar rápido.

---

**Última actualización**: 2 de Diciembre 2025  
**Total documentación**: ~10,000 líneas  
**Estado**: Lista para usar 🚀






