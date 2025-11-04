# 👣 Paso a Paso: Qué Hacer AHORA

**Para:** Usuario que nunca ha usado Cursor  
**Tiempo:** 15-20 minutos  
**Objetivo:** Validar que el sistema funciona

---

## 🎯 Tu Misión

Probar el sistema en el navegador y verificar si el **sidebar derecho aparece** en páginas de nivel 3.

---

## 📋 Paso a Paso (EXACTO)

### PASO 1: Abrir Terminal en Cursor

1. En Cursor, presiona **Ctrl+`** (backtick) o **Ctrl+Shift+`**
2. Debe abrirse un panel en la parte inferior con una terminal
3. Verifica que estás en la carpeta del proyecto:
   ```bash
   pwd
   # Debe mostrar: /home/yull23/nuxt/probo-v3
   ```

---

### PASO 2: Levantar el Servidor

1. En la terminal, escribe:
   ```bash
   npm run dev
   ```

2. Presiona **Enter**

3. Espera a que aparezca algo como:
   ```
   ✓ Nuxt dev server running
   ➜ Local:   http://localhost:3000/
   ```

4. **NO CIERRES LA TERMINAL.** Déjala corriendo.

---

### PASO 3: Abrir el Navegador

1. Abre tu navegador favorito (Chrome, Firefox, Edge)

2. En la barra de direcciones, escribe:
   ```
   http://localhost:3000/test/sidebar-test
   ```

3. Presiona **Enter**

4. Deberías ver una página con título: **"🧪 Test de Sidebars - Sistema Universal"**

---

### PASO 4: Explorar la Página de Testing

1. En la página, verás botones:
   - **📋 Junta de Accionistas** (ya seleccionado)
   - **🏢 Sucursales**

2. Scroll hacia abajo para ver:
   - **Información del Flujo**: Total de items, etc.
   - **Árbol de Navegación**: Estructura completa de items
   - **Configuración de Layout**: Sidebars configurados
   - **Links Rápidos**: Links para testing

3. Verifica que el **Árbol de Navegación** muestra items con niveles (L0, L1, L2, L3)

---

### PASO 5: Abrir DevTools del Navegador

1. Con la página abierta, presiona **F12** (o **Ctrl+Shift+I** en Windows/Linux, **Cmd+Option+I** en Mac)

2. Debe abrirse un panel en el navegador (abajo o a la derecha)

3. Click en la pestaña **"Console"** (Consola)

4. Deberías ver MUCHOS mensajes con `[DEBUG]` al principio

5. Si hay muchos mensajes, puedes filtrar:
   - En la casilla de filtro (arriba de la consola)
   - Escribe: `[DEBUG]`
   - Presiona Enter

---

### PASO 6: Navegar a Página de Nivel 3

1. En la sección **"Links Rápidos de Testing"**, busca:
   - **"Juntas - Nivel 3 (CON sidebar derecho ✨)"**

2. Click en el link verde:
   - **"→ Nombramiento Apoderados - Designación (Nivel 3) ⭐"**

3. Deberías navegar a una página nueva con título:
   - **"Nombramiento de Apoderados"**

---

### PASO 7: Verificar Sidebars

**En la página que acabas de abrir, mira la pantalla:**

1. **Sidebar IZQUIERDO:**
   - ✅ Debería estar visible
   - ✅ Título: "Juntas de Accionistas"
   - ✅ Muestra items como "Selección de Agenda", "Detalles", etc.

2. **Sidebar DERECHO:**
   - 🎯 **AQUÍ ESTÁ LA PRUEBA CRÍTICA**
   - ✅ ¿Ves un segundo sidebar a la DERECHA?
   - ✅ ¿Título: "Pasos"?
   - ✅ ¿Muestra items numerados (1. Designación, 2. Otorgamiento, 3. Votación)?

---

### PASO 8: Revisar Consola de DevTools

Con la página de nivel 3 abierta y DevTools en Console:

1. Busca este tipo de mensajes:
   ```
   [DEBUG] ✓ FOUND currentItem: nombramiento-apoderados-designacion
   [DEBUG] - Level: 3
   [DEBUG] RightSidebar visibility check - current level: 3
   [DEBUG] RightSidebar should be visible: true
   [DEBUG] Active sidebars count: 2
   ```

2. **Si ves esos mensajes:** ✅ Sistema funciona correctamente

3. **Si ves mensajes diferentes:** Continúa al PASO 9

---

### PASO 9: Capturar Resultado

#### Si el Sidebar Derecho APARECE ✅

**¡ÉXITO! 🎉**

1. Toma screenshot de la página (muestra ambos sidebars)
2. Toma screenshot de la consola (muestra logs [DEBUG])
3. Avísame: "✅ Funciona - sidebar derecho visible"

**Siguiente paso:** Eliminar logs de debugging y testing completo

---

#### Si el Sidebar Derecho NO APARECE ❌

**Necesitamos más diagnóstico:**

1. En la consola, busca:
   ```
   [DEBUG] currentItem result: ???
   [DEBUG] Active sidebars count: ???
   ```

2. Copia TODO el contenido de la consola:
   - Click derecho en consola
   - "Save as..." o "Copy all"
   - Guarda en un archivo

3. Toma screenshot de la página (muestra problema)

4. Avísame:
   - ❌ No funciona
   - Comparte logs
   - Comparte screenshot

**Siguiente paso:** Análisis adicional con los logs

---

## 🧪 Testing Alternativo (Si el anterior no funciona)

### Opción B: Navegación Manual

1. Navega a: `http://localhost:3000/operaciones/junta-accionistas/seleccion-agenda`

2. En el sidebar izquierdo, haz click en:
   - "Puntos de Acuerdo" (expandir)
   - "Nombramiento" (expandir)
   - "Nombramiento de Apoderados" (click)

3. ¿Puedes navegar? ¿Qué pasa?

4. Intenta llegar a una sub-página haciendo click en el sidebar

---

## 📸 Screenshots que Necesito

### Screenshot 1: Página de Testing

**URL:** `/test/sidebar-test`

**Captura:**
- Toda la página
- Árbol de navegación visible
- Configuración de sidebars

---

### Screenshot 2: Página de Nivel 3

**URL:** `/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento`

**Captura:**
- Sidebar izquierdo (debe estar)
- Sidebar derecho (debe estar si funciona)
- Contenido central
- Toda la pantalla

---

### Screenshot 3: Consola de DevTools

**Qué capturar:**
- Logs con `[DEBUG]`
- Especialmente:
  - currentItem result
  - Active sidebars count
  - visibilityRule evaluation

---

## 🔧 Si Algo Sale Mal

### Problema: "El servidor no inicia"

**Error típico:**
```
Error: Cannot find module 'X'
```

**Fix:**
```bash
# Instalar dependencias
npm install

# Reintentar
npm run dev
```

---

### Problema: "La página no carga (404)"

**Fix:**
```bash
# Limpiar cache de Nuxt
rm -rf .nuxt
npm run dev
```

---

### Problema: "No veo logs [DEBUG] en consola"

**Fix:**
```bash
# Reiniciar servidor
Ctrl+C (en terminal)
npm run dev

# Recargar página en navegador
F5
```

---

### Problema: "Todo está en blanco"

**Fix:**
1. Revisa la terminal del servidor (¿hay errores?)
2. Revisa la consola del navegador (¿hay errores rojos?)
3. Copia el error y búscalo en TROUBLESHOOTING.md

---

## ✅ Checklist de Testing

Marca cada uno cuando lo completes:

- [ ] Servidor levantado (npm run dev)
- [ ] Página de testing abierta (/test/sidebar-test)
- [ ] Árbol de FlowItems visible en testing
- [ ] DevTools abierto (F12)
- [ ] Consola visible con logs [DEBUG]
- [ ] Navegado a página de nivel 3
- [ ] Verificado si sidebar derecho aparece
- [ ] Screenshot de página tomado
- [ ] Screenshot de consola tomado
- [ ] Resultado documentado (funciona o no)

---

## 🎯 Resultado Esperado

### Si Todo Funciona Bien:

```
Página: /operaciones/junta-accionistas/nombramiento-apoderados/nombramiento

Vista:
┌────────────────┬────────────────────────┬─────────────────┐
│ Sidebar IZQ    │  Contenido Principal   │ Sidebar DER     │
│                │                        │                 │
│ Juntas de      │  Nombramiento de       │ Pasos           │
│ Accionistas    │  Apoderados            │                 │
│                │                        │ 1. Designación  │
│ ○ Selección    │  En esta sub-página    │ 2. Otorgamiento │
│ ○ Detalles     │  se registran...       │ 3. Votación     │
│ ▼ Puntos       │                        │                 │
│   ▼ Aumento    │  Nivel 3: Sub-página   │ ← ESTE SIDEBAR  │
│   ▼ Nombram.   │  visible en rightSide  │   DEBE APARECER │
│     • Apoder.  │                        │                 │
└────────────────┴────────────────────────┴─────────────────┘
```

**Consola:**
```
[DEBUG] ✓ FOUND currentItem: nombramiento-apoderados-designacion
[DEBUG] - Level: 3
[DEBUG] RightSidebar should be visible: true
[DEBUG] Active sidebars count: 2
```

---

## 💡 Tips Finales

1. **No tengas miedo:** Si algo sale mal, tenemos herramientas para diagnosticar
2. **Lee los logs:** Los [DEBUG] te dicen exactamente qué pasa
3. **Usa /test/sidebar-test:** Es tu mejor amigo para debugging
4. **Pide ayuda:** Si te atascas, comparte logs y screenshots

---

## 📞 ¿Dudas?

**Antes de preguntar, revisa:**

1. ¿Leíste `INSTRUCCIONES-TESTING-FASE-1.md`?
2. ¿Revisaste `TROUBLESHOOTING.md`?
3. ¿Capturaste logs y screenshots?

**Si después de eso tienes dudas:** Pregunta con:
- Lo que intentaste
- Lo que esperabas
- Lo que obtuviste
- Logs y screenshots

---

**¡Éxito con el testing!** 🚀  
**Estoy aquí para ayudarte.** 💪

---

**Guía creada:** 4 de Noviembre, 2025  
**Dificultad:** ⭐ (Muy fácil)  
**Tiempo:** 15 minutos  
**Resultado:** Sabrás si el sistema funciona

