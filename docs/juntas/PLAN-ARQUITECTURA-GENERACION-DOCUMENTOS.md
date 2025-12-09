# 🏗️ PLAN DE ARQUITECTURA: GENERACIÓN DE DOCUMENTOS

**Fecha**: 2 de Diciembre 2025  
**Estado**: Plan Completo ✅  
**Objetivo**: Arquitectura para generar documentos desde `DownloadDataDTO`

---

## 📋 FLUJO COMPLETO

```
1. Usuario navega a /descargar
   │
   ├─ 2. useDownloadData() → GET /download-data
   │     │
   │     └─ 3. downloadDataStore.downloadData (DownloadDataDTO)
   │
   ├─ 4. Mappers transforman DownloadDataDTO → Formato Template
   │     │
   │     ├─ ActaDataMapper.map() → { encabezado, instalacion, puntos_acuerdo, firmas }
   │     ├─ ConvocatoriaDataMapper.map() → { tipoJunta, razonSocial, fecha, hora, lugar, orden_dia }
   │     ├─ MinutaDataMapper.map() → { total_aumento, aportantes, capital_antes, capital_despues }
   │     └─ CertificadoDataMapper.map() → { aportante, aporte, razonSocial, fecha }
   │
   ├─ 5. Use Cases generan documentos
   │     │
   │     ├─ GenerateActaUseCase.execute()
   │     │   ├─ ActaDataMapper.map(downloadData)
   │     │   ├─ TemplateHttpRepository.getTemplate("acta/acta.docx")
   │     │   └─ DocxtemplaterProcessor.process(template, data) → Blob
   │     │
   │     ├─ GenerateConvocatoriaUseCase.execute()
   │     ├─ GenerateMinutaUseCase.execute()
   │     └─ GenerateCertificadoUseCase.execute()
   │
   ├─ 6. GenerateAllDocumentosUseCase.execute()
   │     └─ Retorna Documento[] (con blobs)
   │
   └─ 7. Vista muestra documentos generados
         └─ DocumentoCategorizerService.agruparPorCategoria()
```

---

## 🎯 ARQUITECTURA PROPUESTA

### 1. Mappers (Infrastructure Layer)

**Ubicación**: `app/core/hexag/documentos/infrastructure/mappers/`

**Responsabilidad**: Transformar `DownloadDataDTO` a formato de templates

**Mappers necesarios**:
- `acta-data.mapper.ts` - Mapea a formato de acta
- `convocatoria-data.mapper.ts` - Mapea a formato de convocatoria
- `minuta-data.mapper.ts` - Mapea a formato de minuta
- `certificado-data.mapper.ts` - Mapea a formato de certificado

### 2. Use Cases (Application Layer)

**Ubicación**: `app/core/hexag/documentos/application/use-cases/`

**Responsabilidad**: Generar documentos usando mappers + templates

**Use Cases necesarios**:
- `generate-acta.use-case.ts`
- `generate-convocatoria.use-case.ts`
- `generate-minuta.use-case.ts`
- `generate-certificado.use-case.ts`
- `generate-all-documentos.use-case.ts` (orquestador)

### 3. Store (Presentation Layer)

**Ubicación**: `app/core/presentation/juntas/documentos/stores/`

**Responsabilidad**: Guardar documentos generados y exponer getters

**Store**: `documentos-generados.store.ts`

---

## 📊 TRANSFORMACIÓN DE DATOS

### Ejemplo: Acta

**Input** (DownloadDataDTO):
```typescript
{
  meetingDetails: {
    meetingTypeFormatted: "Junta Universal",
    firstCall: {
      dateFormatted: "8 de diciembre de 2025",
      timeFormatted: "04:30 p. m.",
      place: "manza 125"
    },
    president: { name: "" },
    secretary: { name: "" }
  },
  attendance: [
    {
      accionista: {
        person: {
          nombre: "Juan",
          apellidoPaterno: "Pérez",
          numeroDocumento: "00000009"
        }
      },
      accionesConDerechoVoto: 500,
      asistio: true
    }
  ],
  agendaItemsData: {
    aporteDinerario: {
      aportesData: [...],
      votacionData: {...}
    }
  }
}
```

**Output** (Formato Template):
```typescript
{
  encabezado: {
    tipoJunta: "UNIVERSAL",
    ciudad: "Lima",
    hora: "04:30 p. m.",
    fecha: "8 de diciembre de 2025",
    razonSocial: "Mi Empresa SAC",
    ruc: "20123456789"
  },
  instalacion: {
    asistencia: [
      {
        nombre: "Juan Pérez García",
        documento: "00000009",
        acciones: 500
      }
    ],
    presidente: "Juan Pérez",
    secretario: "María González",
    quorum: {
      porcentaje: 80,
      cumple: "cumple"
    }
  },
  puntos_acuerdo: [
    {
      numero: 1,
      titulo: "APORTE DINERARIO",
      datos: {
        aportantes: [
          {
            nombre: "Juan Pérez",
            aporte_soles: 500
          }
        ]
      },
      votacion: {
        porcentaje_aprobacion: 100,
        accionistas_afavor: [
          { nombre: "Juan Pérez", acciones: 500 }
        ],
        accionistas_contra: []
      }
    }
  ],
  firmas: {
    presidente: "Juan Pérez",
    secretario: "María González"
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Mappers (4-6 horas)
- [ ] `ActaDataMapper` - Mapea DownloadDataDTO → Formato Acta
- [ ] `ConvocatoriaDataMapper` - Mapea DownloadDataDTO → Formato Convocatoria
- [ ] `MinutaDataMapper` - Mapea DownloadDataDTO → Formato Minuta
- [ ] `CertificadoDataMapper` - Mapea DownloadDataDTO → Formato Certificado

### Fase 2: Use Cases (6-8 horas)
- [ ] `GenerateActaUseCase` - Genera acta usando mapper + template
- [ ] `GenerateConvocatoriaUseCase` - Genera convocatoria
- [ ] `GenerateMinutaUseCase` - Genera minuta
- [ ] `GenerateCertificadoUseCase` - Genera certificado
- [ ] `GenerateAllDocumentosUseCase` - Orquestador principal

### Fase 3: Store de Documentos (2-3 horas)
- [ ] `documentos-generados.store.ts` - Guarda documentos generados
- [ ] Getters para acceder a documentos por categoría

### Fase 4: Conectar Vista (2-4 horas)
- [ ] Usar `useDownloadData` en `JuntaDocumentosGenerados.vue`
- [ ] Llamar a `GenerateAllDocumentosUseCase` cuando hay datos
- [ ] Mostrar documentos generados en la vista
- [ ] Implementar descarga individual

### Fase 5: ZIP (2-3 horas)
- [ ] `GenerateZipUseCase` - Genera ZIP con todos los documentos
- [ ] Conectar con botón "Descargar Todo (ZIP)"

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Crear mappers** - Transformar DownloadDataDTO a formato de templates
2. **Crear use cases** - Generar documentos usando mappers
3. **Conectar con vista** - Mostrar documentos generados
4. **Implementar descarga** - Individual y ZIP

---

**¿Listo para implementar, mi rey?** 🚀💪



