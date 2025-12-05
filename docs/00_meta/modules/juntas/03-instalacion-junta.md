# 🚧 Juntas - Instalación de Junta (Pendiente)

> Detalle del paso "Instalación de Junta" donde quedamos.

---

## 📍 Ruta

```
/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion-junta/index
```

---

## 🎯 Objetivo

Registrar la instalación formal de la junta de accionistas:
- Fecha y hora de instalación
- Accionistas presentes (quorum)
- Validar porcentaje de asistencia
- Registrar presidente y secretario de la junta

---

## 📋 Funcionalidad Requerida

### 1. Configuración Inicial:
- [ ] Seleccionar fecha y hora de instalación
- [ ] Seleccionar tipo de convocatoria (Primera/Segunda)
- [ ] Seleccionar tipo de junta (Ordinaria/Extraordinaria)

### 2. Registro de Asistencia:
- [ ] Listar todos los accionistas de la sociedad
- [ ] Marcar accionistas presentes
- [ ] Calcular porcentaje automáticamente
- [ ] Validar quorum según configuración (Paso 8 de registro)

### 3. Designaciones:
- [ ] Designar presidente de la junta
- [ ] Designar secretario de la junta

### 4. Validaciones:
- [ ] Quorum mínimo cumplido (según configuración)
- [ ] Presidente y secretario designados
- [ ] Fecha/hora válida

---

## 🔧 Implementación Sugerida

### Domain (entities):
```typescript
export interface InstalacionJuntaEntity {
  id: string;
  juntaId: string;
  fechaInstalacion: Date;
  tipoConvocatoria: "PRIMERA" | "SEGUNDA";
  tipoJunta: "ORDINARIA" | "EXTRAORDINARIA";
  presidenteId: string;
  secretarioId: string;
  quorumPresente: number; // Porcentaje
  accionistasPresentes: string[]; // IDs
  instalada: boolean;
}
```

### Application (DTOs):
```typescript
export interface CreateInstalacionJuntaDTO {
  fechaInstalacion: string;
  tipoConvocatoria: "PRIMERA" | "SEGUNDA";
  tipoJunta: "ORDINARIA" | "EXTRAORDINARIA";
  presidenteId: string;
  secretarioId: string;
  accionistasPresentes: string[];
}
```

### Infrastructure (endpoint sugerido):
```
POST /api/v2/juntas/[juntaId]/instalacion
GET /api/v2/juntas/[juntaId]/instalacion
```

---

## 📚 Ver También

- [01-estado-actual.md](./01-estado-actual.md) - Estado general
- [04-pendientes.md](./04-pendientes.md) - Lista completa de pendientes

---

**Última actualización:** Diciembre 3, 2025



