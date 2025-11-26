# 📋 PLAN DE ESTANDARIZACIÓN - PASO 1 DATOS PRINCIPALES

## 🎯 OBJETIVO
Convertir el Paso 1 "Datos Principales" al mismo patrón que los demás pasos:
- Tabla de registros con acciones (editar/eliminar)
- Modal para agregar/editar
- Botón "+ Agregar"
- Data mock prellenada
- Sincronización con formData

---

## ❌ PROBLEMA ACTUAL

### Paso 1 (Datos Principales) - DIFERENTE:
```tsx
<div className="bg-white border rounded-xl p-8">
  <h3>Datos Principales de la Sociedad</h3>
  <div className="grid grid-cols-2 gap-6">
    <Input ... />
    <Input ... />
    <Input ... />
  </div>
</div>
```
- ❌ Formulario simple con inputs directos
- ❌ No tiene tabla
- ❌ No tiene modal
- ❌ No tiene data mock
- ❌ No permite múltiples registros

### Otros Pasos - CORRECTO:
```tsx
// Tabla con registros
<Table>
  <TableBody>
    {accionistas.map(item => (
      <TableRow>
        <TableCell>{item.nombre}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Botón agregar
<Button onClick={() => openDialog()}>
  <Plus /> Agregar Accionista
</Button>

// Modal para editar/crear
<Dialog open={isDialogOpen}>
  <DialogContent>
    <Input ... />
    <Button>Guardar</Button>
  </DialogContent>
</Dialog>
```
- ✅ Tabla con registros
- ✅ Modal para agregar/editar
- ✅ Menú de acciones (editar/eliminar)
- ✅ Data mock prellenada
- ✅ Permite múltiples registros

---

## 🤔 ANÁLISIS: ¿Datos Principales debe tener múltiples registros?

### ❌ NO - Solo debe haber 1 registro por sociedad

**Razón:** Los datos principales son **únicos** para cada sociedad:
- Una sociedad solo tiene 1 RUT
- Una sociedad solo tiene 1 razón social
- Una sociedad solo tiene 1 domicilio social
- Una sociedad solo tiene 1 fecha de constitución

### ✅ SOLUCIÓN: Formulario con data mock prellenada

El Paso 1 debe seguir siendo un **formulario**, pero:
1. ✅ Con data mock prellenada (para testing)
2. ✅ Sincronización automática con formData
3. ✅ Estructura más limpia y modular
4. ✅ Validaciones consistentes
5. ✅ Mismo estilo visual que otros pasos

---

## 📊 COMPARACIÓN DE ARQUITECTURAS

### PASO 1 (Formulario Único):
```
┌─────────────────────────────────────┐
│  Datos Principales de la Sociedad   │
├─────────────────────────────────────┤
│                                     │
│  [Input: Razón Social]              │
│  [Input: RUT]                       │
│  [Select: Tipo Sociedad]            │
│  [Input: Fecha Constitución]        │
│  ...                                │
│                                     │
└─────────────────────────────────────┘
```

### PASO 2 (Tabla + Modal):
```
┌─────────────────────────────────────┐
│  Accionistas                        │
│  [+ Agregar Accionista]             │
├─────────────────────────────────────┤
│  Tabla:                             │
│  Juan Pérez    DNI: 123    [⋮]      │
│  María López   RUC: 456    [⋮]      │
├─────────────────────────────────────┤
│  Modal (al agregar/editar):         │
│  [Input: Nombre]                    │
│  [Select: Tipo]                     │
│  [Input: Documento]                 │
│  [Guardar] [Cancelar]               │
└─────────────────────────────────────┘
```

---

## ✅ PLAN DE REFACTORIZACIÓN

### 🎯 Mantener estructura de formulario único
### ✅ Agregar mejoras arquitectónicas

### CAMBIOS A REALIZAR:

#### 1. ✅ Crear Mock Data para Paso 1
```typescript
// /data/mockDatosPrincipales.ts
export const MOCK_DATOS_PRINCIPALES = {
  denominacion: 'Tech Solutions S.A.C.',
  tipoSociedad: 'Sociedad Anónima Cerrada',
  ruc: '20601234567',
  pais: 'Perú',
  departamento: 'Lima',
  provincia: 'Lima',
  distrito: 'Miraflores',
  direccion: 'Av. José Larco 1234, Of. 501',
  telefono: '+51 987 654 321',
  email: 'contacto@techsolutions.pe',
  fechaConstitucion: '2024-10-15',
  giro: 'Desarrollo de software empresarial...',
  duracion: 'indefinida',
  notaria: 'Notaría Juan Pérez'
};
```

#### 2. ✅ Refactorizar componente con mejores prácticas
```typescript
// SociedadDatosPrincipalesNew.tsx

export function SociedadDatosPrincipalesNew({ formData, setFormData }) {
  // 1. Inicializar con mock data SI formData está vacío
  const getInitialData = () => {
    if (formData.datosPrincipales && Object.keys(formData.datosPrincipales).length > 0) {
      return formData.datosPrincipales;
    }
    return MOCK_DATOS_PRINCIPALES;
  };

  const [localData, setLocalData] = useState(getInitialData);

  // 2. Sincronizar con formData DESPUÉS del render inicial
  useEffect(() => {
    if (!formData.datosPrincipales || Object.keys(formData.datosPrincipales).length === 0) {
      setFormData({ ...formData, datosPrincipales: localData });
    }
  }, []); // Solo en mount

  // 3. Función de actualización
  const updateField = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    setFormData({ ...formData, datosPrincipales: newData });
  };

  return (
    <div className="bg-white border rounded-xl p-8">
      {/* Formulario con inputs */}
    </div>
  );
}
```

#### 3. ✅ Agrupar campos en secciones
```typescript
// Mejor estructura visual
<div className="space-y-8">
  {/* Sección 1: Identificación */}
  <div className="space-y-4">
    <h4>Identificación de la Sociedad</h4>
    <div className="grid grid-cols-2 gap-4">
      <Input label="Razón Social" />
      <Input label="RUT" />
    </div>
  </div>

  {/* Sección 2: Datos Legales */}
  <div className="space-y-4">
    <h4>Datos Legales</h4>
    <div className="grid grid-cols-2 gap-4">
      <Select label="Tipo Sociedad" />
      <Input label="Fecha Constitución" />
    </div>
  </div>

  {/* Sección 3: Contacto */}
  <div className="space-y-4">
    <h4>Información de Contacto</h4>
    <div className="grid grid-cols-2 gap-4">
      <Input label="Email" />
      <Input label="Teléfono" />
    </div>
  </div>
</div>
```

#### 4. ✅ Consistencia visual con otros pasos
- Mismo padding y border radius
- Mismas variables CSS
- Misma tipografía
- Mismo estilo de labels

---

## 🔧 PROBLEMA DEL SCROLL EN VISUALIZAR

### Problema:
```tsx
// VisualizarSociedad.tsx
<div className="min-h-screen bg-[#FAFAFA]">
  {/* Sin overflow-y-auto */}
</div>
```

### Solución:
```tsx
<div className="h-screen overflow-y-auto bg-[#FAFAFA]">
  {/* Con scroll habilitado */}
</div>
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### PARTE 1: Mock Data
- [ ] Crear `/data/mockDatosPrincipales.ts`
- [ ] Exportar MOCK_DATOS_PRINCIPALES

### PARTE 2: Refactorización
- [ ] Crear `SociedadDatosPrincipalesNew.tsx`
- [ ] Implementar inicialización con mock
- [ ] Implementar sincronización con formData
- [ ] Agrupar campos en secciones lógicas
- [ ] Aplicar estilos consistentes

### PARTE 3: Integración
- [ ] Actualizar import en `FlujoWizardView.tsx`
- [ ] Testing con modo CREAR (debe mostrar mock)
- [ ] Testing con modo EDITAR (debe mostrar datos reales)

### PARTE 4: Fix Scroll
- [ ] Corregir `VisualizarSociedad.tsx`
- [ ] Cambiar `min-h-screen` a `h-screen overflow-y-auto`
- [ ] Verificar scroll funciona

---

## 📊 ESTRUCTURA DE DATOS MOCK

```typescript
interface DatosPrincipales {
  // Identificación
  denominacion: string;
  nombreFantasia?: string;
  tipoSociedad: string;
  ruc: string;

  // Ubicación
  pais: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;

  // Contacto
  telefono: string;
  email: string;

  // Legal
  fechaConstitucion: string;
  notaria?: string;
  giro: string;
  duracion?: string;
}
```

---

## 🎨 MEJORAS VISUALES

### Antes:
```tsx
<div className="grid grid-cols-2 gap-6">
  <Input label="Razón Social" />
  <Input label="RUT" />
  <Input label="Email" />
  <Input label="Teléfono" />
</div>
```
- Todo plano
- Sin agrupación lógica
- Difícil de escanear

### Después:
```tsx
<div className="space-y-8">
  {/* Sección 1 */}
  <div className="border-b pb-6">
    <h4 className="mb-4">Identificación</h4>
    <div className="grid grid-cols-2 gap-4">
      <Input label="Razón Social" />
      <Input label="RUT" />
    </div>
  </div>

  {/* Sección 2 */}
  <div className="border-b pb-6">
    <h4 className="mb-4">Contacto</h4>
    <div className="grid grid-cols-2 gap-4">
      <Input label="Email" />
      <Input label="Teléfono" />
    </div>
  </div>
</div>
```
- Agrupado por categorías
- Separadores visuales
- Más fácil de entender

---

## ⚡ VENTAJAS DEL NUEVO ENFOQUE

### 1. ✅ Testing más fácil
- Mock data prellenada
- No necesitas escribir todo manualmente

### 2. ✅ Modo EDITAR funciona mejor
- Datos se precargan automáticamente
- Sin bugs de sincronización

### 3. ✅ Consistencia arquitectónica
- Mismo patrón de inicialización que otros pasos
- Misma estructura de hooks
- Mismo flujo de datos

### 4. ✅ Mejor UX
- Secciones agrupadas lógicamente
- Separadores visuales
- Más fácil de navegar

### 5. ✅ Mantenibilidad
- Código más limpio
- Más fácil de modificar
- Más fácil de testear

---

## 📋 RESUMEN EJECUTIVO

### PASO 1 - ÚNICO, NO MÚLTIPLE
- ✅ Mantener como formulario único
- ✅ Agregar mock data prellenada
- ✅ Mejorar estructura visual (secciones)
- ✅ Sincronización automática con formData

### SCROLL EN VISUALIZAR
- ✅ Cambiar `min-h-screen` a `h-screen overflow-y-auto`

### RESULTADO FINAL
- ✅ Paso 1 con mock data funcionando
- ✅ Arquitectura consistente con hooks y sincronización
- ✅ Visualización con scroll funcional
- ✅ Sistema completo listo para producción

---

¡TODO LISTO PARA IMPLEMENTAR! 🚀💜
