# 🗺️ PLAN DE INTEGRACIÓN - ARQUITECTURA DE FLUJOS

## 📊 ANÁLISIS DE LA SITUACIÓN ACTUAL

### Archivos Existentes:
1. ✅ `/App.tsx` - Maneja navegación principal con estados `currentView` y `viewMode`
2. ✅ `/components/GenericHistorial.tsx` - Historial genérico con mock data
3. ✅ `/components/FlujoWizardView.tsx` - Wizard multi-paso
4. ✅ `/components/SociedadFinalizada.tsx` - Pantalla de éxito
5. ✅ `/data/flujoSteps.ts` - Configuración de pasos

### Archivos Nuevos Creados:
1. ✅ `/types/flujos.types.ts` - Tipos TypeScript
2. ✅ `/contexts/FlujoContext.tsx` - Context API para estado global
3. ✅ `/components/HistorialSociedades.tsx` - Historial específico con acciones
4. ✅ `/components/VisualizarSociedad.tsx` - Vista resumen sin progress bar
5. ✅ `/components/DocumentosGenerados.tsx` - Pantalla de documentos con selección

---

## 🎯 PLAN DE EJECUCIÓN (8 PASOS)

### ✅ PASO 1: Envolver App.tsx con FlujoProvider
**Archivo:** `/App.tsx`
**Acción:** Importar y usar FlujoProvider
**Impacto:** Permite acceso global al store de flujos

### ✅ PASO 2: Modificar FlujoWizardView para soportar modos
**Archivo:** `/components/FlujoWizardView.tsx`
**Acción:** 
- Aceptar props `modo` y `registroId`
- Cargar datos si es modo EDITAR
- Guardar en Context al completar
**Impacto:** Wizard puede crear Y editar

### ✅ PASO 3: Reemplazar GenericHistorial por HistorialSociedades
**Archivo:** `/App.tsx`
**Acción:** Usar `HistorialSociedades` en lugar de `GenericHistorial` para sociedades
**Impacto:** Historial conectado al Context con acciones funcionales

### ✅ PASO 4: Agregar vista de Visualización
**Archivo:** `/App.tsx`
**Acción:** Agregar estado para manejar vista `visualizar`
**Impacto:** Permite ver resumen sin progress bar

### ✅ PASO 5: Integrar DocumentosGenerados
**Archivo:** `/App.tsx`
**Acción:** Usar `DocumentosGenerados` en lugar de `SociedadFinalizada`
**Impacto:** Selección individual de documentos + envío a repositorio

### ✅ PASO 6: Conectar flujo de navegación completo
**Archivo:** `/App.tsx`
**Acción:** Manejar transiciones entre vistas (historial ↔ wizard ↔ visualizar)
**Impacto:** Navegación completa funcionando

### ✅ PASO 7: Agregar datos mock iniciales
**Archivo:** `/App.tsx`
**Acción:** Cargar sociedades de ejemplo al iniciar
**Impacto:** Historial muestra datos desde el inicio

### ✅ PASO 8: Testing y validación
**Archivo:** Todos
**Acción:** Probar flujos completos (crear, editar, visualizar, eliminar)
**Impacto:** Sistema funcionando end-to-end

---

## 📋 MAPA DE ARCHIVOS A MODIFICAR

### 1. `/App.tsx`
```typescript
CAMBIOS:
✅ Importar FlujoProvider
✅ Importar HistorialSociedades, VisualizarSociedad, DocumentosGenerados
✅ Agregar estados: sociedadEditando, vistaSociedad
✅ Modificar render de sociedades-historial
✅ Agregar render de sociedades-visualizar
✅ Modificar sociedades-crear wizard para pasar modo y registroId
✅ Modificar success screen para usar DocumentosGenerados
```

### 2. `/components/FlujoWizardView.tsx`
```typescript
CAMBIOS:
✅ Modificar interface de props para aceptar modo y registroId
✅ Usar useFlujoStore para cargar datos en modo EDITAR
✅ Guardar en Context al completar (crear o actualizar)
✅ Actualizar estado (BORRADOR → COMPLETO)
```

### 3. Archivos SIN CAMBIOS (funcionan como están):
✅ Todos los componentes de pasos (SociedadDatosPrincipales, etc.)
✅ /types/flujos.types.ts
✅ /contexts/FlujoContext.tsx
✅ /components/HistorialSociedades.tsx
✅ /components/VisualizarSociedad.tsx
✅ /components/DocumentosGenerados.tsx

---

## 🔄 FLUJO DE NAVEGACIÓN FINAL

### CREAR NUEVA SOCIEDAD:
```
Historial (clic "Nueva Sociedad")
  ↓
Landing (clic "Comenzar")
  ↓
Wizard (modo: CREAR, 10 pasos)
  ↓
DocumentosGenerados (selección + descarga)
  ↓
Historial (clic "Ir a mis Sociedades")
```

### EDITAR SOCIEDAD:
```
Historial (menú → "Editar")
  ↓
Wizard (modo: EDITAR, datos precargados)
  ↓
DocumentosGenerados (actualizar documentos)
  ↓
Historial
```

### VISUALIZAR SOCIEDAD:
```
Historial (menú → "Visualizar")
  ↓
VisualizarSociedad (resumen sin progress bar)
  ↓
[Opcional: clic "Editar" → Wizard]
```

---

## 🎨 CAMBIOS DETALLADOS POR ARCHIVO

### App.tsx - ANTES:
```tsx
const [currentView, setCurrentView] = useState<MainView>('repository');
const [viewMode, setViewMode] = useState<ViewMode>('landing');

// Sociedades usa GenericHistorial (sin acciones)
{currentView === 'sociedades-historial' && 
  <GenericHistorial config={sociedadesHistorialConfig} />
}
```

### App.tsx - DESPUÉS:
```tsx
const [currentView, setCurrentView] = useState<MainView>('repository');
const [viewMode, setViewMode] = useState<ViewMode>('landing');
const [vistaSociedad, setVistaSociedad] = useState<'historial' | 'wizard' | 'visualizar'>('historial');

// Sociedades usa HistorialSociedades (conectado a Context)
{currentView === 'sociedades-historial' && vistaSociedad === 'historial' &&
  <HistorialSociedades
    onCrearNueva={() => {
      setViewMode('landing');
      setCurrentView('sociedades-crear');
    }}
    onEditar={(id) => {
      setViewMode('wizard');
      setVistaSociedad('wizard');
    }}
    onVisualizar={(id) => setVistaSociedad('visualizar')}
  />
}

// Vista de visualización
{currentView === 'sociedades-historial' && vistaSociedad === 'visualizar' &&
  <VisualizarSociedad
    registroId={registroEnEdicion!}
    onVolver={() => setVistaSociedad('historial')}
    onEditar={() => {
      setViewMode('wizard');
      setVistaSociedad('wizard');
    }}
  />
}
```

---

## ⚠️ COMPATIBILIDAD CON ESTRUCTURA ACTUAL

### ✅ NO rompe nada existente:
- Juntas, Sucursales, Directorios siguen igual
- GenericHistorial sigue disponible
- Dashboards funcionan igual
- Sidebar sin cambios

### ✅ Solo afecta a Sociedades:
- Mejora el historial
- Agrega edición
- Agrega visualización
- Mejora documentos generados

### ✅ Fácil replicar a otros flujos:
- Copiar estructura para Juntas
- Copiar estructura para Sucursales
- Copiar estructura para Directorios

---

## 🚀 ORDEN DE EJECUCIÓN

1. **PRIMERO**: Envolver App.tsx con Provider (no rompe nada)
2. **SEGUNDO**: Modificar FlujoWizardView (compatible con uso actual)
3. **TERCERO**: Cambiar render de sociedades-historial
4. **CUARTO**: Agregar vista de visualización
5. **QUINTO**: Integrar DocumentosGenerados
6. **SEXTO**: Conectar navegación completa
7. **SÉPTIMO**: Agregar datos mock
8. **OCTAVO**: Testing

---

## ✅ CHECKLIST FINAL

Antes de ejecutar:
- [x] Tipos creados en /types/flujos.types.ts
- [x] Context creado en /contexts/FlujoContext.tsx
- [x] HistorialSociedades creado
- [x] VisualizarSociedad creado
- [x] DocumentosGenerados creado

Durante ejecución:
- [ ] Provider envuelve App
- [ ] FlujoWizardView acepta modo y registroId
- [ ] HistorialSociedades conectado
- [ ] VisualizarSociedad integrado
- [ ] DocumentosGenerados integrado
- [ ] Navegación completa funciona
- [ ] Datos mock cargados

Después de ejecutar:
- [ ] Crear sociedad funciona
- [ ] Editar sociedad funciona
- [ ] Visualizar sociedad funciona
- [ ] Eliminar sociedad funciona
- [ ] Documentos generados funciona

---

## 💡 PRÓXIMOS PASOS (POST-INTEGRACIÓN)

### Fase 1: Persistencia
- [ ] Guardar en localStorage
- [ ] Sincronizar con Supabase

### Fase 2: Replicar a otros flujos
- [ ] Juntas con arquitectura nueva
- [ ] Sucursales con arquitectura nueva
- [ ] Directorios con arquitectura nueva

### Fase 3: Mejoras
- [ ] Filtros avanzados en historial
- [ ] Exportar a PDF/Excel
- [ ] Duplicar registros
- [ ] Audit log (historial de cambios)

---

¿LISTO PARA EJECUTAR? 🚀
