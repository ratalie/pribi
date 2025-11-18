# 🐛 Guía de Debugging - Sistema de Sidebar Spacing

## 📊 Logs de Consola Habilitados

Ahora tienes **debugging automático** en la consola del navegador. Abre las DevTools (F12) y verás:

### 1. **Árbol de Pasos** (al cargar la página)

```
================================================================================
🔍 [StepWizardPanel] Árbol de Pasos:
================================================================================
📄 0. Selección de Agenda [empty] (nivel: 0)
📄 1. Detalles de la Junta [empty] (nivel: 0)
📄 2. Instalación [current] (nivel: 0)
📄 3. Puntos de Acuerdo [empty] (nivel: 0)
  📁 4. Aumento de Capital [empty] (nivel: 1)
    📄 5. Aporte Dinerario [empty] (nivel: 2)
    📄 6. Capitalización de Créditos [empty] (nivel: 2)
  📁 7. Nombramiento [empty] (nivel: 1)
    📄 8. Nombramiento de Apoderados [empty] (nivel: 2)
================================================================================
```

**¿Qué revisar?**

- ✅ Los **niveles** estén correctos (0, 1, 2, etc.)
- ✅ Las **categorías** (`📁`) vs items normales (`📄`)
- ✅ El **orden** de los elementos

---

### 2. **Info de cada StepItem** (cuando se renderiza)

```
[StepItem] Instalación: {
  level: 0,
  spacing: 28,              ← Gap asignado (28px para nivel 0)
  connectorGap: 36,         ← Extensión de línea (28 + 8 = 36px)
  isFinalItem: false,
  isCategory: false,
  showConnector: true
}

[StepItem] Aporte Dinerario: {
  level: 2,
  spacing: 12,              ← Gap asignado (12px para nivel 2)
  connectorGap: 20,         ← Extensión de línea (12 + 8 = 20px)
  isFinalItem: false,
  isCategory: false,
  showConnector: false      ← ❗ Nivel 2 NO muestra conector
}
```

**¿Qué revisar?**

- ✅ `spacing` según nivel:
  - Nivel 0 = **28px**
  - Nivel 1 = **18px**
  - Nivel 2+ = **12px**
- ✅ `connectorGap = spacing + 8`
- ✅ `showConnector`:
  - `true` para niveles 0-1
  - `false` para niveles 2+

---

### 3. **Info del StatusIcon** (línea conectora)

```
[StatusIcon] Connector: {
  level: 0,
  connectorGap: 36,
  connectorGapValue: 36,
  isFinalItem: false,
  showLine: true,
  calculatedHeight: "calc(100% + 36px)"
}
```

**¿Qué revisar?**

- ✅ `calculatedHeight` debe incluir el `connectorGap`
- ✅ `showLine` debe ser `true` para mostrar la línea

---

## 🎨 Debug Visual (Opcional)

Para ver **bordes y etiquetas visuales**, edita:

**`app/components/dual-panel-sidebar/shared/StepItem.vue`**

Descomenta el bloque de CSS:

```css
/* 🐛 DEBUG MODE: Descomentar para ver bordes de debug */
.step-item-container {
  border: 2px dashed rgba(255, 0, 0, 0.3);
}

.step-item-container[data-level="0"] {
  background: rgba(255, 0, 0, 0.05); /* Rojo suave */
}

.step-item-container[data-level="1"] {
  background: rgba(0, 255, 0, 0.05); /* Verde suave */
}

.step-item-container[data-level="2"] {
  background: rgba(0, 0, 255, 0.05); /* Azul suave */
}

.step-item-container::after {
  content: "Nivel: " attr(data-level) " | Spacing: " attr(data-spacing) "px";
  position: absolute;
  top: 0;
  right: 0;
  font-size: 10px;
  background: yellow;
  padding: 2px 4px;
  z-index: 999;
}
```

**Resultado Visual**:

- Bordes rojos punteados en cada contenedor
- Fondo de color según nivel (rojo, verde, azul)
- Etiqueta amarilla mostrando: `Nivel: X | Spacing: Xpx`

---

## 🔍 Inspeccionar con DevTools

### **Atributos data-\* en el DOM**

Abre las DevTools → Elements y busca:

```html
<div
  class="step-item-container"
  data-level="0"
  data-spacing="28"
  data-is-category="false"
  style="--step-spacing: 28px;"
>
  <!-- StatusIcon -->
  <div
    class="connector-line"
    data-connector-gap="36"
    data-level="0"
    style="height: calc(100% + 36px);"
  ></div>
</div>
```

**¿Qué revisar?**

- ✅ `data-level` correcto
- ✅ `data-spacing` correcto
- ✅ `data-connector-gap` en la línea
- ✅ `style="height: calc(100% + Xpx)"` presente

---

## 📐 Medidas Esperadas

| Elemento            | Nivel         | Spacing | ConnectorGap | ShowConnector |
| ------------------- | ------------- | ------- | ------------ | ------------- |
| Selección de Agenda | 0             | 28px    | 36px         | ✅ true       |
| Instalación         | 0             | 28px    | 36px         | ✅ true       |
| Puntos de Acuerdo   | 0             | 28px    | 36px         | ✅ true       |
| Aumento de Capital  | 1 (categoría) | 22px    | 0px          | ❌ false      |
| Aporte Dinerario    | 2             | 12px    | 0px          | ❌ false      |
| Capitalización      | 2             | 12px    | 0px          | ❌ false      |

---

## 🚨 Problemas Comunes

### **Problema 1: Línea no llega entre círculos**

**Síntomas en consola**:

```
connectorGap: 0  ← ❌ Debería ser > 0
showLine: false  ← ❌ Debería ser true para nivel 0-1
```

**Solución**: Verificar que `showConnector` sea `true`

---

### **Problema 2: Gap igual en todos los niveles**

**Síntomas en consola**:

```
[StepItem] Instalación: { level: 0, spacing: 28 }  ← ✅ OK
[StepItem] Aporte Dinerario: { level: 2, spacing: 28 }  ← ❌ Debería ser 12
```

**Solución**: Verificar que los `level` estén correctos en los datos

---

### **Problema 3: Línea muy corta**

**Síntomas en consola**:

```
calculatedHeight: "calc(100% + 0px)"  ← ❌ connectorGap es 0
```

**Solución**: Verificar lógica de `connectorGap` en `StepItem.vue`

---

## 🎯 Checklist de Verificación

1. [ ] Abre la consola (F12)
2. [ ] Busca el log `[StepWizardPanel] Árbol de Pasos`
3. [ ] Verifica que los **niveles** sean correctos
4. [ ] Busca logs `[StepItem]` para cada elemento
5. [ ] Verifica `spacing` según nivel:
   - Nivel 0 = 28px
   - Nivel 1 = 18px
   - Nivel 2+ = 12px
6. [ ] Verifica `connectorGap = spacing + 8`
7. [ ] Verifica `showConnector = true` solo para nivel 0-1
8. [ ] Busca logs `[StatusIcon] Connector`
9. [ ] Verifica `calculatedHeight: "calc(100% + Xpx)"`
10. [ ] Inspecciona el DOM (Elements tab)
11. [ ] Verifica atributos `data-*`
12. [ ] (Opcional) Habilita debug visual CSS

---

## 📸 Screenshot de Consola Esperado

```
🔍 [StepWizardPanel] Árbol de Pasos:
📄 0. Selección de Agenda [empty] (nivel: 0)
📄 1. Detalles de la Junta [empty] (nivel: 0)
📄 2. Instalación [current] (nivel: 0)
📄 3. Puntos de Acuerdo [empty] (nivel: 0)

[StepItem] Selección de Agenda: { level: 0, spacing: 28, connectorGap: 36 }
[StatusIcon] Connector: { level: 0, calculatedHeight: "calc(100% + 36px)" }

[StepItem] Instalación: { level: 0, spacing: 28, connectorGap: 36 }
[StatusIcon] Connector: { level: 0, calculatedHeight: "calc(100% + 36px)" }

[StepItem] Puntos de Acuerdo: { level: 0, spacing: 28, connectorGap: 36 }
[StatusIcon] Connector: { level: 0, calculatedHeight: "calc(100% + 36px)" }
```

---

## 🔄 Desactivar Debugging

Cuando ya no necesites los logs:

### **StepItem.vue**

Comenta el console.log:

```typescript
// console.log(`[StepItem] ${props.step.title}:`, { ... });
```

### **StatusIcon.vue**

Comenta el watchEffect:

```typescript
// watchEffect(() => { ... });
```

### **StepWizardPanel.vue**

Comenta el onMounted:

```typescript
// onMounted(() => { ... });
```

---

¡Feliz debugging mi rey! 🔥👑
