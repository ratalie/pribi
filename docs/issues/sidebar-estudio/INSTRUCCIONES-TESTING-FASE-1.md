# 🧪 Instrucciones de Testing - Fase 1: Diagnóstico

**Fecha:** 4 de Noviembre, 2025  
**Propósito:** Capturar logs de debugging para diagnosticar problema del sidebar derecho  
**Tiempo estimado:** 15 minutos

---

## 🎯 Objetivo

Identificar exactamente POR QUÉ el sidebar derecho no aparece en nivel 3 de Juntas de Accionistas.

---

## 📋 Prerequisitos

- Servidor de desarrollo corriendo (`npm run dev`)
- Navegador con DevTools (Chrome/Firefox/Edge)
- Página de testing: `/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento`

---

## 🚀 Pasos de Testing

### Paso 1: Levantar Servidor

```bash
cd /home/yull23/nuxt/probo-v3
npm run dev
```

**Verificar:**
- ✅ Servidor inicia sin errores
- ✅ Puerto: `http://localhost:3000`

---

### Paso 2: Abrir Navegador y DevTools

1. Abrir navegador
2. Navegar a: `http://localhost:3000`
3. Presionar **F12** (o Ctrl+Shift+I) para abrir DevTools
4. Ir a la pestaña **Console**
5. **Limpiar consola** (botón 🚫 o Ctrl+L)

---

### Paso 3: Navegar a la Página de Prueba

En el navegador, navegar a:

```
http://localhost:3000/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento
```

**O seguir este flujo:**
1. Ir a: `/operaciones/junta-accionistas/seleccion-agenda`
2. Click en sidebar izquierdo: "Puntos de Acuerdo"
3. Expandir: "Nombramiento"
4. Click en: "Nombramiento de Apoderados"
5. Click en el submenu para llegar a `/nombramiento`

---

### Paso 4: Capturar Logs de Consola

La consola debería mostrar logs con prefijo `[DEBUG]`.

**Buscar específicamente:**

#### A) Logs de currentItem

```
[DEBUG] currentPath: /operaciones/junta-accionistas/nombramiento-apoderados/nombramiento
[DEBUG] flowConfig.items length: XX
[DEBUG] Checking item: XXXX route: XXXX level: X
[DEBUG] ✓ FOUND currentItem: XXXX level: X
```

**O si NO encuentra:**
```
[DEBUG] currentItem result: NOT FOUND
```

#### B) Logs de activeSidebars

```
[DEBUG] ====== Evaluating activeSidebars ======
[DEBUG] Total sidebars configured: 2
[DEBUG] Evaluating sidebar: juntas-main-sidebar position: left
[DEBUG] Evaluating sidebar: juntas-steps-sidebar position: right
```

#### C) Logs de visibilityRule

```
[DEBUG] Evaluating visibility rule: property
[DEBUG] currentItem for rule: XXXX
[DEBUG] Property value: hierarchy.level = X
[DEBUG] Custom function result: true/false
```

---

### Paso 5: Copiar Logs Completos

1. **Click derecho en la consola**
2. **"Save as..." o "Copy all messages"**
3. **Guardar en:** `/home/yull23/nuxt/probo-v3/docs/issues/sidebar-estudio/LOGS-FASE-1.txt`

**O copiar manualmente:**
- Seleccionar todo (Ctrl+A)
- Copiar (Ctrl+C)
- Pegar en archivo de texto

---

## 🔍 Qué Analizar en los Logs

### Escenario 1: currentItem NO se encuentra

**Síntoma:**
```
[DEBUG] currentItem result: NOT FOUND
```

**Causa probable:**
- Items de nivel 3 no están en el array `flowConfig.items`
- La ruta no coincide exactamente
- Los items no tienen la ruta correcta

**Fix:** Verificar que `buildFlowItemTree` está incluyendo items de nivel 3

---

### Escenario 2: currentItem se encuentra pero nivel es incorrecto

**Síntoma:**
```
[DEBUG] ✓ FOUND currentItem: nombramiento-apoderados-designacion level: 3
[DEBUG] Property value: hierarchy.level = 3
[DEBUG] Custom function result: false
```

**Causa probable:**
- El `currentItem` tiene level 3
- Pero la función de visibilityRule retorna `false`
- Verificar la lógica de la función custom

**Fix:** Revisar función en `juntas.layout.ts` línea 72

---

### Escenario 3: Sidebar derecho no está en activeSidebars

**Síntoma:**
```
[DEBUG] Active sidebars count: 1
[DEBUG] Active sidebars: ["juntas-main-sidebar"]
```

**Causa probable:**
- visibilityRule está fallando
- No hay `currentItem`
- La función custom está evaluando incorrectamente

**Fix:** Corregir visibilityRule o función custom

---

### Escenario 4: Items de nivel 3 no tienen children

**Síntoma:**
```
[DEBUG] Checking item: nombramiento-apoderados route: /operaciones/.../nombramiento-apoderados level: 2
[DEBUG] Item nombramiento-apoderados has 0 children
```

**Causa probable:**
- `buildFlowItemTree` no está anidando correctamente
- Los items de nivel 3 no tienen el `parentId` correcto
- Los items no se están agregando al array `children`

**Fix:** Verificar la estructura de FlowItems en `/app/types/flows/junta-accionistas/nivel-3/`

---

## 📊 Checklist de Validación

Después de capturar los logs, verificar:

- [ ] ¿`currentItem` se encuentra? (FOUND vs NOT FOUND)
- [ ] ¿`currentItem` tiene el nivel correcto? (debe ser 3)
- [ ] ¿Cuántos sidebars están configurados? (debe ser 2: main + steps)
- [ ] ¿Cuántos sidebars están activos? (debe ser 1 o 2 dependiendo del nivel)
- [ ] ¿La visibilityRule se evalúa? (logs de "Evaluating visibility rule")
- [ ] ¿Qué resultado da la visibilityRule? (true/false)
- [ ] ¿Los items tienen children anidados? (logs de "has X children")

---

## 🎯 Resultado Esperado vs. Real

### Esperado (cuando funciona bien)

```
[DEBUG] currentPath: /operaciones/junta-accionistas/nombramiento-apoderados/nombramiento
[DEBUG] ✓ FOUND currentItem: nombramiento-apoderados-designacion level: 3
[DEBUG] Evaluating sidebar: juntas-steps-sidebar position: right
[DEBUG] Evaluating visibility rule: property
[DEBUG] Property value: hierarchy.level = 3
[DEBUG] Custom function result: true
[DEBUG] ✓ Sidebar juntas-steps-sidebar visibility: true
[DEBUG] Active sidebars count: 2
[DEBUG] Active sidebars: ["juntas-main-sidebar", "juntas-steps-sidebar"]
```

**Resultado:** Sidebar derecho aparece ✅

---

### Real (lo que probablemente pasa ahora)

```
[DEBUG] currentPath: /operaciones/junta-accionistas/nombramiento-apoderados/nombramiento
[DEBUG] currentItem result: NOT FOUND
[DEBUG] Evaluating sidebar: juntas-steps-sidebar position: right
[DEBUG] Evaluating visibility rule: property
[DEBUG] ✗ No currentItem, returning false
[DEBUG] ✗ Sidebar juntas-steps-sidebar visibility: false
[DEBUG] Active sidebars count: 1
[DEBUG] Active sidebars: ["juntas-main-sidebar"]
```

**Resultado:** Sidebar derecho NO aparece ❌

---

## 📝 Próximos Pasos

Después de capturar los logs:

1. **Guardar logs en:** `LOGS-FASE-1.txt`
2. **Analizar cuál escenario aplica** (1, 2, 3, o 4)
3. **Aplicar el fix correspondiente** (Fase 2 del plan)
4. **Validar que funciona**
5. **Eliminar logs de debugging** (cuando todo funcione)

---

## 💡 Tips

- **Logs muy largos:** Filtrar en consola por `[DEBUG]`
- **Logs se repiten:** Es normal, los computed se ejecutan múltiples veces
- **Limpiar consola:** Recargar página (F5) después de limpiar consola (Ctrl+L)
- **Captura de pantalla:** Tomar screenshot de la consola si es más fácil

---

## 🚨 Si Algo Sale Mal

### Problema: No aparecen logs [DEBUG]

**Causa:** El código con logs no se aplicó correctamente

**Fix:**
```bash
# Reiniciar servidor
Ctrl+C (en terminal del servidor)
npm run dev
```

---

### Problema: Error en consola al cargar página

**Causa:** Hay un error de sintaxis en el código de debugging

**Fix:**
- Copiar el error completo
- Verificar que los logs se agregaron correctamente
- Revisar el archivo `universal-flow-layout.vue`

---

### Problema: Página no carga

**Causa:** Error en el servidor

**Fix:**
- Ver terminal del servidor
- Buscar errores de TypeScript
- Verificar que no hay errores de sintaxis

---

## ✅ Confirmación de Éxito

Testing completado cuando tienes:

- ✅ Logs capturados en archivo .txt
- ✅ Escenario identificado (1, 2, 3, o 4)
- ✅ Screenshot de la página con problema visible
- ✅ Screenshot de la consola con logs

---

**Tiempo estimado:** 15-20 minutos  
**Siguiente paso:** Análisis de logs y aplicación de fix (Fase 2)

