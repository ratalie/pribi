# 📚 DOCUMENTACIÓN COMPLETA: PROCESO SOCIEDADES + PLAN JUNTAS

## 🎯 OBJETIVO DE ESTE DOCUMENTO
Documentar TODO el proceso realizado en **Registro de Sociedades** para replicarlo en **Juntas de Accionistas**.

---

# PARTE 1: PROCESO COMPLETO DE SOCIEDADES 🏢

## 📊 ARQUITECTURA DE SOCIEDADES (LO QUE FUNCIONA PERFECTAMENTE)

### **Sistema de 3 Niveles:**

```
┌─────────────────────────────────────────────────────────────┐
│  NIVEL 1: VISTA PRINCIPAL (Landing)                         │
│  ✅ Nueva Sociedad                                          │
│  ✅ Historial con Estados (Completo/En Proceso/Borrador)   │
├─────────────────────────────────────────────────────────────┤
│  NIVEL 2: WIZARD DE 10 PASOS (FlujoWizardView)             │
│  ✅ Sidebar Izquierdo: Navegación de pasos                 │
│  ✅ Área Central: Contenido del paso actual                │
│  ✅ Sin Sidebar Derecho (todo en área central)             │
├─────────────────────────────────────────────────────────────┤
│  NIVEL 3: VISUALIZACIÓN COMPLETA (VisualizarSociedad)      │
│  ✅ Vista de solo lectura                                  │
│  ✅ Botón Editar (regresa al wizard)                       │
│  ✅ Scroll funcional                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 LOS 10 PASOS DE SOCIEDADES

### **PASO 1: Datos Principales** ⭐ RECIENTEMENTE MEJORADO
```
┌─────────────────────────────────────────┐
│  📋 1. IDENTIFICACIÓN                   │
│  • Denominación / Razón Social          │
│  • Nombre de Fantasía                   │
│  • RUT                                  │
│  • Tipo de Sociedad                     │
├─────────────────────────────────────────┤
│  📍 2. UBICACIÓN                        │
│  • País, Departamento, Provincia        │
│  • Distrito, Dirección Completa         │
├─────────────────────────────────────────┤
│  📞 3. CONTACTO                         │
│  • Email, Teléfono                      │
├─────────────────────────────────────────┤
│  ⚖️ 4. DATOS LEGALES                    │
│  • Fecha Constitución, Notaría          │
│  • Duración, Giro                       │
└─────────────────────────────────────────┘
```

**Características:**
- ✅ Mock data prellenada automáticamente
- ✅ Sincronización bidireccional con formData
- ✅ 4 secciones agrupadas lógicamente
- ✅ Formulario único (no tabla, porque es 1 registro)

**Archivos:**
- `/components/flujo-steps/SociedadDatosPrincipalesNew.tsx`
- `/data/mockDatosPrincipales.ts`

---

### **PASO 2: Accionistas**
```
┌─────────────────────────────────────────┐
│  Accionistas                            │
│  [+ Agregar Accionista]                 │
├─────────────────────────────────────────┤
│  Tabla de Accionistas:                  │
│  ┌──────────────────────────────────┐   │
│  │ Juan Pérez | Natural | DNI [⋮] │   │
│  │ María López | Natural | RUC [⋮] │   │
│  └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Modal (al agregar/editar):             │
│  [Input: Nombre]                        │
│  [Select: Tipo]                         │
│  [Input: Documento]                     │
│  [Guardar] [Cancelar]                   │
└─────────────────────────────────────────┘
```

**Patrón Arquitectónico:**
1. ✅ **Tabla** con lista de registros
2. ✅ **Botón + Agregar** para crear nuevos
3. ✅ **Modal** para agregar/editar
4. ✅ **Dropdown Menu** (⋮) con Editar/Eliminar
5. ✅ **Mock data** prellenada automáticamente
6. ✅ **Sincronización** con formData en mount y cambios

**Archivo:** `/components/flujo-steps/SociedadAccionistasNew.tsx`

---

### **PASO 3: Capital Social y Acciones**
```
┌─────────────────────────────────────────┐
│  Capital Social y Acciones              │
│  [+ Agregar Tipo de Acción]             │
├─────────────────────────────────────────┤
│  Configuración General:                 │
│  [Select: Moneda] [Input: Valor Nom.]   │
├─────────────────────────────────────────┤
│  Tipos de Acciones:                     │
│  ┌──────────────────────────────────┐   │
│  │ Acciones Comunes | 80,000 | [⋮] │   │
│  │ Sin Voto | 20,000 | [⋮]          │   │
│  └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│  ┃ Capital Total: S/ 100,000.00   ┃   │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
└─────────────────────────────────────────┘
```

**Características:**
- ✅ Dos tipos de estructuras (tradicional vs clases)
- ✅ Tabla + Modal
- ✅ Cálculos automáticos de totales
- ✅ Mock data con 2 tipos de acciones

**Archivo:** `/components/flujo-steps/SociedadCapitalAccionesNew.tsx`

---

### **PASO 4-9:** Asignación, Directorio, Apoderados, etc.
Todos siguen el **MISMO PATRÓN**:
- ✅ Tabla con registros
- ✅ Botón + Agregar
- ✅ Modal para editar/crear
- ✅ Mock data prellenada
- ✅ Sincronización con formData

---

### **PASO 10: Resumen** ⭐ RECIENTEMENTE MEJORADO
```
┌─────────────────────────────────────────┐
│  Resumen Final                          │
│  Revisa toda la información...          │
├─────────────────────────────────────────┤
│  📋 1. Datos Principales (completo)     │
│  👥 2. Accionistas (lista completa)     │
│  💰 3. Capital y Acciones (con totales) │
│  📊 4. Asignación de Acciones           │
│  📁 5. Directorio                       │
│  ⚖️ 6. Apoderados                       │
│  🔐 7. Régimen de Facultades            │
│  🗳️ 8. Quórums y Mayorías               │
│  📝 9. Acuerdos Societarios             │
│                                         │
│  [Anterior] [Finalizar]                 │
└─────────────────────────────────────────┘
```

**Arquitectura Reutilizable:**
```
/components/SociedadContenidoCompleto.tsx (Componente Central)
  ↓
  ├─ Usado en: /components/flujo-steps/SociedadResumen.tsx (Paso 10)
  └─ Usado en: /components/VisualizarSociedad.tsx (Vista completa)
```

**Ventajas:**
- ✅ Sin duplicación de código
- ✅ Consistencia visual
- ✅ Muestra TODOS los 9 pasos anteriores
- ✅ Conditional rendering (solo muestra secciones con datos)

**Archivo:** `/components/SociedadContenidoCompleto.tsx`

---

## 🎯 PATRÓN ARQUITECTÓNICO CLAVE

### **Para Paso con 1 Registro (Datos Principales):**
```typescript
// PASO 1: Datos Principales
export function SociedadDatosPrincipalesNew({ formData, setFormData }) {
  // 1. Inicialización con mock
  const getInitialData = () => {
    if (formData.datosPrincipales && Object.keys(formData.datosPrincipales).length > 0) {
      return formData.datosPrincipales;
    }
    return MOCK_DATOS_PRINCIPALES;
  };

  const [localData, setLocalData] = useState(getInitialData);

  // 2. Sincronización EN MOUNT
  useEffect(() => {
    if (!formData.datosPrincipales || Object.keys(formData.datosPrincipales).length === 0) {
      setFormData({ ...formData, datosPrincipales: localData });
    }
  }, []);

  // 3. Actualización
  const updateField = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    setFormData({ ...formData, datosPrincipales: newData });
  };

  return (
    <div className="bg-white border rounded-xl p-8">
      {/* Formulario con secciones */}
      <div className="space-y-8">
        <div className="space-y-4 pb-8 border-b">
          <h4>Sección 1</h4>
          <Input ... />
        </div>
      </div>
    </div>
  );
}
```

---

### **Para Paso con Múltiples Registros (Accionistas, Directorio, etc.):**
```typescript
// PASO 2-9: Múltiples registros
export function SociedadAccionistasNew({ formData, setFormData }) {
  // 1. Inicialización con mock
  const getInitialAccionistas = () => {
    if (formData.accionistas && formData.accionistas.length > 0) {
      return formData.accionistas;
    }
    return MOCK_ACCIONISTAS; // Array con datos
  };

  const [accionistas, setAccionistas] = useState(getInitialAccionistas);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 2. Sincronización EN MOUNT
  useEffect(() => {
    if (accionistas.length > 0 && (!formData.accionistas || formData.accionistas.length === 0)) {
      setFormData({ ...formData, accionistas });
    }
  }, []);

  // 3. Funciones CRUD
  const handleAdd = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const newList = accionistas.filter(a => a.id !== id);
    setAccionistas(newList);
    setFormData({ ...formData, accionistas: newList });
  };

  return (
    <div className="bg-white border rounded-xl p-8">
      {/* Botón Agregar */}
      <Button onClick={handleAdd}>
        <Plus /> Agregar Accionista
      </Button>

      {/* Tabla */}
      <Table>
        {accionistas.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.nombre}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuItem onClick={() => handleEdit(item)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {/* Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {/* Formulario */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 📁 ESTRUCTURA DE ARCHIVOS DE SOCIEDADES

```
/components
  /flujo-steps/
    SociedadDatosPrincipalesNew.tsx    ✅ Paso 1 (formulario único)
    SociedadAccionistasNew.tsx         ✅ Paso 2 (tabla + modal)
    SociedadCapitalAccionesNew.tsx     ✅ Paso 3 (tabla + modal)
    SociedadAsignacionAccionesNew.tsx  ✅ Paso 4 (tabla + modal)
    SociedadDirectorio.tsx             ✅ Paso 5 (tabla + modal)
    SociedadApoderados.tsx             ✅ Paso 6 (tabla + modal)
    SociedadRegimenFacultades.tsx      ✅ Paso 7 (tabla + modal)
    SociedadQuorums.tsx                ✅ Paso 8 (formulario único)
    SociedadAcuerdosEspeciales.tsx     ✅ Paso 9 (tabla + modal)
    SociedadResumen.tsx                ✅ Paso 10 (usa componente reutilizable)

  SociedadContenidoCompleto.tsx        ✅ Componente reutilizable (Resumen completo)
  VisualizarSociedad.tsx               ✅ Vista de visualización completa
  FlujoWizardView.tsx                  ✅ Motor del wizard

/data
  mockDatosPrincipales.ts              ✅ Mock Paso 1
  mockData.ts                          ✅ Mock otros pasos
  flujoSteps.ts                        ✅ Definición de pasos del wizard
```

---

# PARTE 2: ARQUITECTURA DE JUNTAS (ACTUAL) 📋

## 🎭 DIFERENCIA CLAVE: SIDEBAR DOBLE

### **Juntas tiene 2 Niveles de Navegación:**

```
┌─────────────┬──────────────────────────┬─────────────┐
│  SIDEBAR    │   ÁREA CENTRAL           │  SIDEBAR    │
│  IZQUIERDO  │                          │  DERECHO    │
│  (PASOS)    │                          │  (SECCIONES)│
├─────────────┼──────────────────────────┼─────────────┤
│ 1. Puntos   │  [Contenido del paso     │             │
│    Agenda   │   o sub-paso actual]     │             │
│             │                          │             │
│ 2. Detalles │                          │             │
│             │                          │             │
│ 3. Instalac.│                          │             │
│             │                          │             │
│ 4. Puntos   │                          │  SOLO SE    │
│    Acuerdo  │                          │  MUESTRA    │
│    ▾        │                          │  CUANDO     │
│    ├ Aporte│                          │  ESTÁS EN   │
│    │ Diner.│◄─ Sub-paso seleccionado  │  UN SUB-PASO│
│    ├ Aporte│                          │             │
│    │ No Din│                          │  1.Selección│
│    └ Capital│                          │  2.Aportes ◄│
│      Crédit.│                          │  3.Votación │
│             │                          │  4.Resumen  │
│ 5. Resumen  │                          │             │
│             │                          │             │
│ 6. Docs.    │                          │             │
│    Generados│                          │             │
└─────────────┴──────────────────────────┴─────────────┘
```

---

## 📊 LOS 6 PASOS DE JUNTAS

### **PASO 1: Puntos de Agenda** ⭐ EL QUE DEFINE TODO

```
┌────────────────────────────────────────────────────────┐
│  Panel Izquierdo:              Panel Derecho:          │
│  Selección de Puntos           Preview de Agenda       │
├────────────────────────────────────────────────────────┤
│  ☑️ Aumento de Capital         ┌────────────────────┐ │
│    ☐ Aportes dinerarios        │ Agenda:            │ │
│    ☐ Aporte no dinerario       │                    │ │
│    ☐ Capitalización créditos   │ 1. Aportes diner...│ │
│                                 │ 2. Remoción de ... │ │
│  ☑️ Remoción                    │ 3. Nombramiento...│ │
│    ☐ Remoción gerente           └────────────────────┘ │
│    ☐ Remoción apoderados                             │
│    ☐ Remoción directores        [Toggle: Junta       │
│                                   Obligatoria Anual] │
│  ☑️ Nombramiento                                      │
│    ☐ Nombramiento gerente                            │
│    ☐ Nombramiento apoderados                         │
│    ☐ Nombramiento directores                         │
│    ☐ Nombramiento nuevo direct.                      │
│                                                       │
│  ☑️ Gestión Social                                    │
│    ☐ Pronunciamiento gestión                         │
│    ☐ Aplicación resultados                           │
│    ☐ Designación auditores                           │
└────────────────────────────────────────────────────────┘
```

**FUNCIÓN CRÍTICA:**
- ✅ Define qué puntos se incluirán en la junta
- ✅ Los puntos seleccionados = Sub-steps del Paso 4
- ✅ Si seleccionas "Aportes dinerarios", aparece como sub-paso en sidebar izquierdo

**Archivo Actual:** `/components/flujo-steps/JuntaPuntosAgenda.tsx`

---

### **PASO 2: Detalles de la Junta**
- Fecha, hora, lugar
- Tipo de junta (Ordinaria, Extraordinaria, Universal)
- Convocatoria

**Archivo:** `/components/flujo-steps/JuntaDetalles.tsx`

---

### **PASO 3: Instalación de la Junta**
- Representante legal
- Asistencia de accionistas
- Autoridades designadas
- Verificación de quórum

**Archivo:** `/components/flujo-steps/JuntaInstalacion.tsx`

---

### **PASO 4: Puntos de Acuerdo** ⭐ AQUÍ ESTÁ LA MAGIA DEL SIDEBAR DOBLE

Este paso tiene **SUB-STEPS DINÁMICOS** basados en lo seleccionado en Paso 1.

#### **Ejemplo: Aporte Dinerario (4 secciones)**

```
┌─────────────┬──────────────────────────┬─────────────────┐
│ SIDEBAR IZQ │   ÁREA CENTRAL           │  SIDEBAR DERECHO│
├─────────────┼──────────────────────────┼─────────────────┤
│ 4. Puntos   │                          │  Secciones:     │
│    Acuerdo  │                          │                 │
│    ▾        │                          │  ● 1. Selección │
│    ├ Aporte │  [Contenido Sección 1:   │    Aportantes   │
│    │ Diner. │   Selección Aportantes]  │                 │
│    │  ◄─────┼──────────────────────────┤  ○ 2. Aportes   │
│    │        │                          │    Dinerarios   │
│    ├ Remoción│                         │                 │
│    │ Gerente│                          │  ○ 3. Votación  │
│    │        │                          │                 │
│    └ Nombram│                          │  ○ 4. Resumen   │
│      Gerente│                          │                 │
└─────────────┴──────────────────────────┴─────────────────┘
```

**Archivo:** `/components/AporteDinerarioFlow.tsx`

**4 Secciones Internas:**
1. **Selección de Aportantes** - Checkbox de accionistas
2. **Aportes Dinerarios** - Monto por cada aportante
3. **Votación** - Registro de votos
4. **Resumen** - Vista previa de todo

---

#### **Otros Sub-Steps: Patrón Genérico (3 secciones)**

```
┌─────────────┬──────────────────────────┬─────────────────┐
│ SIDEBAR IZQ │   ÁREA CENTRAL           │  SIDEBAR DERECHO│
├─────────────┼──────────────────────────┼─────────────────┤
│ 4. Puntos   │                          │  Secciones:     │
│    Acuerdo  │                          │                 │
│    ▾        │                          │  ● 1. Config.   │
│    ├ Remoción│ [Contenido Sección 1:   │                 │
│    │ Gerente│  Configuración]          │  ○ 2. Votación  │
│    │  ◄─────┼──────────────────────────┤                 │
│    │        │                          │  ○ 3. Resumen   │
│    ├ Nombram│                          │                 │
│    │ Gerente│                          │                 │
└─────────────┴──────────────────────────┴─────────────────┘
```

**Archivo:** `/components/GenericSubStepFlow.tsx`

**3 Secciones Estándar:**
1. **Configuración** - Datos específicos del punto
2. **Votación** - Registro de votos
3. **Resumen** - Vista previa

---

### **PASO 5: Resumen Final**
- Muestra TODO lo configurado en los 4 pasos anteriores

**Archivo:** `/components/JuntaResumenFinal.tsx`

---

### **PASO 6: Documentos Generados**
- Lista de documentos generados
- Checkbox para enviar al repositorio
- Botón descargar

**Archivo:** `/components/DocumentosGenerados.tsx`

---

## 🔍 ANÁLISIS: ¿ES EL MISMO SIDEBAR O SON DOS DIFERENTES?

### **SON DOS SIDEBARS COMPLETAMENTE DIFERENTES:**

#### **1. SIDEBAR IZQUIERDO - SingleWizardSidebar**
```typescript
// Archivo: /components/SingleWizardSidebar.tsx
// Muestra: Pasos principales (1-6) + Sub-steps del Paso 4
<SingleWizardSidebar
  steps={stepsWithStatus}
  currentStepId={currentStep.id}
  currentSubStepId={currentSubStepId}
  onStepClick={handleStepClick}
  onSubStepClick={handleSubStepClick}
/>
```

**Función:**
- Navegación entre pasos principales (1-6)
- Navegación entre sub-steps del Paso 4
- Siempre visible
- Muestra progreso del wizard

---

#### **2. SIDEBAR DERECHO - WizardRightSidebar**
```typescript
// Archivo: /components/WizardRightSidebar.tsx
// Muestra: Secciones DENTRO de un sub-step
<WizardRightSidebar
  sections={sectionsWithStatus}
  currentSectionId={currentSectionId}
  onSectionClick={onSectionChange}
  title="Secciones"
/>
```

**Función:**
- Navegación entre secciones DENTRO de un sub-step
- Solo visible cuando estás en un sub-step
- Ejemplo: En "Aporte Dinerario", muestra 4 secciones

---

### **CUÁNDO SE MUESTRA CADA UNO:**

```typescript
// En FlujoWizardView.tsx

// Detectar si estamos en algún sub-step
const hasRightSidebar = !!currentSubStepId;

return (
  <div className="flex h-screen">
    {/* SIDEBAR IZQUIERDO - SIEMPRE VISIBLE */}
    <SingleWizardSidebar ... />

    {/* ÁREA CENTRAL */}
    <div className="flex-1">
      {hasRightSidebar ? (
        // CASO 1: Estás en un sub-step → Mostrar contenido + sidebar derecho
        <div className="flex">
          <div className="flex-1">{renderStepContent()}</div>
          <WizardRightSidebar ... /> {/* SIDEBAR DERECHO */}
        </div>
      ) : (
        // CASO 2: Paso normal → Solo contenido
        <div>{renderStepContent()}</div>
      )}
    </div>
  </div>
);
```

---

## 📊 RESUMEN DE NIVELES DE NAVEGACIÓN

### **SOCIEDADES (1 Nivel):**
```
PASO → CONTENIDO
```

### **JUNTAS (3 Niveles):**
```
PASO → SUB-STEP → SECCIÓN
  ↓       ↓          ↓
Sidebar  Sidebar   Sidebar
Izq.     Izq.      Derecho
```

**Ejemplo Completo:**
```
Paso 4: Puntos de Acuerdo (Paso principal)
  ↓
  Sub-step: Aporte Dinerario (Sub-paso seleccionado)
    ↓
    Sección 1: Selección de Aportantes (Sección activa)
    Sección 2: Aportes Dinerarios
    Sección 3: Votación
    Sección 4: Resumen
```

---

# PARTE 3: PLAN DE ACCIÓN PARA JUNTAS 🚀

## 🎯 OBJETIVO
Replicar el proceso de **Sociedades** en **Juntas**, respetando la arquitectura de 3 niveles (Paso → Sub-step → Sección).

---

## 📋 PLAN MAESTRO

### **FASE 1: REDISEÑAR PASO 1 (Puntos de Agenda)** ⭐ CRÍTICO

#### **Problema Actual:**
- ✅ UI funciona bien (checkboxes con categorías)
- ❌ NO tiene mock data
- ❌ NO sigue patrón de sincronización
- ❌ NO define dinámicamente los sub-steps

#### **Solución:**

**1.1. Crear Mock Data**
```typescript
// /data/mockPuntosAgenda.ts
export const MOCK_PUNTOS_AGENDA = {
  puntosSeleccionados: [
    'aportes-dinerarios',      // Aumento de Capital
    'remocion-gerente',        // Remoción
    'nombramiento-gerente',    // Nombramiento
    'pronunciamiento-gestion'  // Gestión Social
  ],
  isJuntaObligatoria: true
};
```

**1.2. Refactorizar Componente**
```typescript
// /components/flujo-steps/JuntaPuntosAgendaNew.tsx

export function JuntaPuntosAgendaNew({ formData, setFormData }) {
  // 1. Inicializar con mock
  const getInitialPuntos = () => {
    if (formData.puntosAgenda && formData.puntosAgenda.length > 0) {
      return formData.puntosAgenda;
    }
    return MOCK_PUNTOS_AGENDA.puntosSeleccionados;
  };

  const [puntosSeleccionados, setPuntosSeleccionados] = useState(getInitialPuntos);

  // 2. Sincronización en mount
  useEffect(() => {
    if (!formData.puntosAgenda || formData.puntosAgenda.length === 0) {
      setFormData({ ...formData, puntosAgenda: puntosSeleccionados });
    }
  }, []);

  // 3. ⭐ GENERAR SUB-STEPS DINÁMICAMENTE
  useEffect(() => {
    // Filtrar sub-steps según puntos seleccionados
    const activeSubSteps = ALL_SUBSTEPS.filter(sub => 
      puntosSeleccionados.includes(sub.id)
    );
    
    // Actualizar configuración del wizard
    updateWizardConfig(activeSubSteps);
  }, [puntosSeleccionados]);

  // ... resto del componente
}
```

**1.3. Integración con Wizard Config**
```typescript
// /data/flujoSteps.ts

// ANTES: Sub-steps estáticos
subSteps: [
  { id: 'aporte-dinerarios', ... },
  { id: 'remocion-gerente', ... },
  // ... todos los sub-steps
]

// DESPUÉS: Sub-steps dinámicos
subSteps: [] // Se llenan dinámicamente desde Paso 1
```

---

### **FASE 2: REDISEÑAR PASO 2 (Detalles de la Junta)**

#### **Aplicar Patrón de Sociedades Paso 1:**

**2.1. Crear Mock Data**
```typescript
// /data/mockDetallesJunta.ts
export const MOCK_DETALLES_JUNTA = {
  tipoJunta: 'Extraordinaria',
  fecha: '2024-12-15',
  hora: '10:00',
  lugar: 'Av. Larco 1234, Of. 501, Miraflores, Lima',
  modalidad: 'Presencial',
  convocatoria: {
    tipoConvocatoria: 'Primera',
    fechaConvocatoria: '2024-12-01',
    medioPublicacion: 'Diario El Comercio'
  }
};
```

**2.2. Componente con Secciones**
```typescript
// /components/flujo-steps/JuntaDetallesNew.tsx

export function JuntaDetallesNew({ formData, setFormData }) {
  // Mismo patrón que SociedadDatosPrincipalesNew
  const getInitialData = () => {
    if (formData.detallesJunta && Object.keys(formData.detallesJunta).length > 0) {
      return formData.detallesJunta;
    }
    return MOCK_DETALLES_JUNTA;
  };

  const [localData, setLocalData] = useState(getInitialData);

  // Sincronización
  useEffect(() => {
    if (!formData.detallesJunta || Object.keys(formData.detallesJunta).length === 0) {
      setFormData({ ...formData, detallesJunta: localData });
    }
  }, []);

  return (
    <div className="bg-white border rounded-xl p-8">
      <div className="space-y-8">
        {/* Sección 1: Información General */}
        <div className="space-y-4 pb-8 border-b">
          <h4>Información General de la Junta</h4>
          <Input label="Tipo de Junta" ... />
          <Input label="Fecha" type="date" ... />
          <Input label="Hora" type="time" ... />
        </div>

        {/* Sección 2: Lugar y Modalidad */}
        <div className="space-y-4 pb-8 border-b">
          <h4>Lugar y Modalidad</h4>
          <Textarea label="Dirección del Local" ... />
          <Select label="Modalidad" ... />
        </div>

        {/* Sección 3: Convocatoria */}
        <div className="space-y-4">
          <h4>Datos de Convocatoria</h4>
          <Select label="Tipo de Convocatoria" ... />
          <Input label="Fecha de Convocatoria" ... />
        </div>
      </div>
    </div>
  );
}
```

---

### **FASE 3: REDISEÑAR PASO 3 (Instalación)**

#### **Aplicar Patrón de Sociedades Paso 2 (Tabla + Modal):**

**3.1. Mock Data**
```typescript
// /data/mockInstalacion.ts
export const MOCK_INSTALACION = {
  representanteLegal: {
    nombre: 'Juan Pérez Rodríguez',
    cargo: 'Gerente General',
    documento: 'DNI 12345678'
  },
  asistentes: [
    { id: '1', nombre: 'Juan Pérez', acciones: 60000, porcentaje: 60, asiste: true },
    { id: '2', nombre: 'María López', acciones: 40000, porcentaje: 40, asiste: true }
  ],
  autoridades: [
    { id: '1', nombre: 'Carlos Gómez', cargo: 'Presidente de Junta', tipo: 'Presidente' },
    { id: '2', nombre: 'Ana Torres', cargo: 'Secretario', tipo: 'Secretario' }
  ],
  quorum: {
    porcentajePresente: 100,
    cumpleQuorum: true
  }
};
```

**3.2. Componente con 3 Sub-secciones**
```typescript
// /components/flujo-steps/JuntaInstalacionNew.tsx

export function JuntaInstalacionNew({ formData, setFormData }) {
  // Sincronización con mock
  const [asistentes, setAsistentes] = useState(MOCK_INSTALACION.asistentes);
  const [autoridades, setAutoridades] = useState(MOCK_INSTALACION.autoridades);

  return (
    <div className="space-y-8">
      {/* Sección 1: Representante Legal */}
      <div className="bg-white border rounded-xl p-8">
        <h3>Representante Legal</h3>
        <div className="grid grid-cols-2 gap-6">
          <Input label="Nombre Completo" ... />
          <Input label="Cargo" ... />
          <Input label="Documento" ... />
        </div>
      </div>

      {/* Sección 2: Asistencia */}
      <div className="bg-white border rounded-xl p-8">
        <h3>Control de Asistencia</h3>
        <Button onClick={handleAddAsistente}>+ Agregar Asistente</Button>
        <Table>
          {asistentes.map(asistente => (
            <TableRow key={asistente.id}>
              <TableCell>{asistente.nombre}</TableCell>
              <TableCell>{asistente.acciones} acciones</TableCell>
              <TableCell>{asistente.porcentaje}%</TableCell>
              <TableCell>
                <Checkbox checked={asistente.asiste} />
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>

      {/* Sección 3: Autoridades */}
      <div className="bg-white border rounded-xl p-8">
        <h3>Designación de Autoridades</h3>
        <Button onClick={handleAddAutoridad}>+ Agregar Autoridad</Button>
        <Table>
          {autoridades.map(autoridad => (
            <TableRow key={autoridad.id}>
              <TableCell>{autoridad.nombre}</TableCell>
              <TableCell>{autoridad.cargo}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuItem onClick={() => handleEdit(autoridad)}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(autoridad.id)}>
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    </div>
  );
}
```

---

### **FASE 4: MEJORAR SUB-STEPS (Paso 4)**

#### **Cada Sub-Step necesita Mock Data:**

**4.1. Aporte Dinerario**
```typescript
// /data/mockAporteDinerario.ts
export const MOCK_APORTE_DINERARIO = {
  aportantesSeleccionados: ['1', '2'], // IDs de accionistas
  aportes: [
    {
      accionistaId: '1',
      nombre: 'Juan Pérez',
      montoAporte: 50000,
      accionesNuevas: 50000,
      porcentajePost: 55
    },
    {
      accionistaId: '2',
      nombre: 'María López',
      montoAporte: 30000,
      accionesNuevas: 30000,
      porcentajePost: 45
    }
  ],
  votacion: [
    { accionistaId: '1', voto: 'A favor', acciones: 60000 },
    { accionistaId: '2', voto: 'A favor', acciones: 40000 }
  ]
};
```

**4.2. Aplicar a TODOS los Sub-Steps**
- Remoción de Gerente
- Nombramiento de Gerente
- etc.

---

### **FASE 5: CREAR RESUMEN COMPLETO (Paso 5)**

#### **Similar a Sociedades Paso 10:**

**5.1. Componente Reutilizable**
```typescript
// /components/JuntaContenidoCompleto.tsx

export function JuntaContenidoCompleto({ formData, showHeader }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      {showHeader && <h2>Resumen Completo de la Junta</h2>}

      {/* 1. Puntos de Agenda */}
      <div className="bg-white border rounded-xl p-8">
        <h3>1. Puntos de Agenda</h3>
        {formData.puntosAgenda.map((punto, idx) => (
          <div key={idx}>{idx + 1}. {punto}</div>
        ))}
      </div>

      {/* 2. Detalles de la Junta */}
      <div className="bg-white border rounded-xl p-8">
        <h3>2. Detalles de la Junta</h3>
        <p>Tipo: {formData.detallesJunta.tipoJunta}</p>
        <p>Fecha: {formData.detallesJunta.fecha}</p>
        <p>Hora: {formData.detallesJunta.hora}</p>
      </div>

      {/* 3. Instalación */}
      <div className="bg-white border rounded-xl p-8">
        <h3>3. Instalación de la Junta</h3>
        <p>Representante: {formData.instalacion.representanteLegal.nombre}</p>
        <p>Quórum: {formData.instalacion.quorum.porcentajePresente}%</p>
      </div>

      {/* 4. Puntos de Acuerdo (cada sub-step) */}
      {formData.puntosAcuerdo.map((punto, idx) => (
        <div key={idx} className="bg-white border rounded-xl p-8">
          <h3>4.{idx + 1}. {punto.titulo}</h3>
          {/* Mostrar detalles de cada punto */}
        </div>
      ))}
    </div>
  );
}
```

**5.2. Usar en Resumen**
```typescript
// /components/JuntaResumenFinal.tsx

export function JuntaResumenFinal({ formData }) {
  return (
    <div>
      <h2>Resumen Final</h2>
      <p>Revisa toda la información antes de generar documentos</p>
      <JuntaContenidoCompleto formData={formData} showHeader={false} />
    </div>
  );
}
```

---

### **FASE 6: CREAR VISTA DE VISUALIZACIÓN COMPLETA**

```typescript
// /components/VisualizarJunta.tsx

export function VisualizarJunta({ registroId }) {
  const { obtenerJunta } = useFlujoStore();
  const junta = obtenerJunta(registroId);

  return (
    <div className="h-screen overflow-y-auto bg-[#FAFAFA]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>Junta: {junta.detallesJunta.tipoJunta}</h1>
            <p>{junta.detallesJunta.fecha}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onVolver}>
              <ArrowLeft /> Volver
            </Button>
            <Button onClick={onEditar}>
              <Edit /> Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido Completo */}
      <div className="px-8 py-6">
        <JuntaContenidoCompleto formData={junta} showHeader={true} />
      </div>
    </div>
  );
}
```

---

## 📁 ESTRUCTURA DE ARCHIVOS FINAL (JUNTAS)

```
/components
  /flujo-steps/
    JuntaPuntosAgendaNew.tsx           ⭐ Paso 1 (con mock + generación dinámica)
    JuntaDetallesNew.tsx               ⭐ Paso 2 (formulario con secciones + mock)
    JuntaInstalacionNew.tsx            ⭐ Paso 3 (tabla + modal + mock)
    
    /puntos-acuerdo/
      AporteDinerarioNew.tsx           ⭐ Sub-step con mock
      RemovecionGerenteNew.tsx         ⭐ Sub-step con mock
      NombramientoGerenteNew.tsx       ⭐ Sub-step con mock
      ... (todos los sub-steps)
    
    JuntaResumenFinal.tsx              ⭐ Paso 5 (usa componente reutilizable)
    DocumentosGenerados.tsx            ✅ Paso 6 (ya existe)

  JuntaContenidoCompleto.tsx           ⭐ Componente reutilizable (Resumen completo)
  VisualizarJunta.tsx                  ⭐ Vista de visualización completa
  FlujoWizardView.tsx                  ✅ Motor del wizard (ya existe)

/data
  mockPuntosAgenda.ts                  ⭐ Mock Paso 1
  mockDetallesJunta.ts                 ⭐ Mock Paso 2
  mockInstalacion.ts                   ⭐ Mock Paso 3
  mockAporteDinerario.ts               ⭐ Mock Sub-steps
  mockRemociónGerente.ts               ⭐ Mock Sub-steps
  ... (todos los mocks de sub-steps)
  flujoSteps.ts                        ✅ Definición de pasos (ya existe)
```

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### PASO 1: Puntos de Agenda
- [ ] Crear `/data/mockPuntosAgenda.ts`
- [ ] Refactorizar a `/components/flujo-steps/JuntaPuntosAgendaNew.tsx`
- [ ] Implementar generación dinámica de sub-steps
- [ ] Integrar con FlujoStore

### PASO 2: Detalles de la Junta
- [ ] Crear `/data/mockDetallesJunta.ts`
- [ ] Crear `/components/flujo-steps/JuntaDetallesNew.tsx`
- [ ] Agrupar en 3 secciones lógicas
- [ ] Sincronización con formData

### PASO 3: Instalación
- [ ] Crear `/data/mockInstalacion.ts`
- [ ] Crear `/components/flujo-steps/JuntaInstalacionNew.tsx`
- [ ] Implementar tabla + modal para Asistentes
- [ ] Implementar tabla + modal para Autoridades
- [ ] Cálculo automático de quórum

### PASO 4: Sub-Steps
- [ ] Crear mock data para cada sub-step
- [ ] Refactorizar AporteDinerarioFlow con mock
- [ ] Refactorizar GenericSubStepFlow con mock
- [ ] Crear componentes específicos para cada sub-step

### PASO 5: Resumen
- [ ] Crear `/components/JuntaContenidoCompleto.tsx`
- [ ] Actualizar `/components/JuntaResumenFinal.tsx`
- [ ] Mostrar TODOS los pasos anteriores

### PASO 6: Visualización
- [ ] Crear `/components/VisualizarJunta.tsx`
- [ ] Usar JuntaContenidoCompleto
- [ ] Implementar scroll funcional
- [ ] Botones Volver y Editar

---

## 🚀 PRÓXIMOS PASOS

1. ✅ **Documentación completa** (este archivo)
2. 🔜 **Comenzar con Paso 1** - Es el más crítico
3. 🔜 **Validar arquitectura** con Paso 1 funcionando
4. 🔜 **Replicar patrón** en Pasos 2 y 3
5. 🔜 **Mejorar Sub-Steps** con mock data
6. 🔜 **Crear Resumen Completo**
7. 🔜 **Crear Vista de Visualización**

---

¡TODO DOCUMENTADO Y LISTO PARA IMPLEMENTAR! 🎉📚💜
