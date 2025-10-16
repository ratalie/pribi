## 🎨 1. El concepto general: **Sistema de color (Color System)**

Toda app moderna (como las de Google, Apple, o frameworks como Tailwind o Material Design) usa un **sistema de color**.
Este sistema **no define solo colores sueltos**, sino **roles o funciones** que los colores cumplen en la interfaz.

Por eso no se dice “azul o verde”, sino cosas como:

- `background`
- `foreground`
- `card`
- `card-foreground`
- `primary`
- `secondary`
- `accent`
- `muted`
- `border`
- `destructive` (para errores o alertas)

Cada uno cumple una **función semántica**, no solo estética.

---

## 🧩 2. El concepto clave: **Tokens de color**

A esto se le llama **Color Tokens** o **Design Tokens**.

Ejemplo:

```css
:root {
  --background: #f9f9f9;
  --foreground: #1a1a1a;

  --card: #ffffff;
  --card-foreground: #222222;

  --primary: #2563eb;
  --primary-foreground: #ffffff;

  --secondary: #e2e8f0;
  --secondary-foreground: #1e293b;

  --muted: #f1f5f9;
  --muted-foreground: #64748b;

  --border: #e2e8f0;
}
```

👉 Esto te permite cambiar toda la **personalidad visual** de tu app cambiando solo los valores.

---

## 🌗 3. Paleta base vs. roles semánticos

Tu app puede tener **una paleta base de 2 o 3 colores** (por identidad), pero el **sistema completo** traduce esos tonos a diferentes usos.

Por ejemplo, supón que tu app tiene estos 3 colores base:

- Azul oscuro (`#1E3A8A`)
- Azul claro (`#3B82F6`)
- Gris claro (`#F1F5F9`)

Desde ahí defines los roles:

| Rol          | Color base          | Ejemplo              |
| ------------ | ------------------- | -------------------- |
| `primary`    | azul claro          | botones principales  |
| `secondary`  | gris claro          | botones secundarios  |
| `background` | gris muy claro      | fondo de toda la app |
| `card`       | blanco              | fondos de tarjetas   |
| `foreground` | azul oscuro o negro | texto principal      |
| `border`     | gris                | bordes o divisores   |

---

## 🧠 4. La lógica detrás: **contraste, jerarquía y consistencia**

Cada color cumple una **función perceptiva**:

- **Contraste:** el texto debe destacar sobre el fondo.
- **Jerarquía:** los elementos más importantes usan el `primary`.
- **Consistencia:** el mismo color siempre significa lo mismo (por ejemplo, rojo = peligro).

Por eso frameworks como **shadcn/ui**, **Tailwind**, **Material 3** o **Radix** tienen ya definidos estos tokens semánticos.

---

## 🧱 5. Cómo hacerlo reutilizable (como dev)

Tu objetivo como desarrollador no es definir colores, sino **roles**.

Por ejemplo, podrías tener un archivo de tema:

```ts
// theme.ts
export const theme = {
  light: {
    background: "#ffffff",
    foreground: "#1a1a1a",
    primary: "#2563eb",
    secondary: "#e2e8f0",
    border: "#e5e7eb",
  },
  dark: {
    background: "#0f172a",
    foreground: "#f8fafc",
    primary: "#3b82f6",
    secondary: "#1e293b",
    border: "#334155",
  },
};
```

Y en tu app, cuando cambies de tema o esquema de color, **todo se actualiza automáticamente**.

---

## 🔍 6. En resumen

| Concepto                    | Qué significa                        | Ejemplo                                 |
| --------------------------- | ------------------------------------ | --------------------------------------- |
| **Color principal (brand)** | Color de identidad de la marca       | Azul de Facebook                        |
| **Color secundario/acento** | Complementa el principal             | Verde, naranja                          |
| **Color system (tokens)**   | Sistema que define funciones (roles) | `--primary`, `--background`, `--border` |
| **Modo (light/dark)**       | Variante del esquema                 | `theme.light` / `theme.dark`            |
| **Paleta**                  | Conjunto de tonos usados             | `#1E3A8A`, `#3B82F6`, `#F1F5F9`         |

## 🧭 INTRODUCCIÓN: “Los colores no son colores, son roles”

Cuando el diseñador pone colores en Figma, no está diciendo “este botón es azul y este texto es negro”.
Está diciendo algo mucho más estructurado:

> “Este color cumple la función de fondo.”
> “Este color representa una acción principal.”
> “Este color indica error o peligro.”

👉 Por eso en un sistema de diseño no se dice `azul` o `gris`, sino **`--primary`, `--background`, `--destructive`, `--card`**, etc.
Cada uno tiene una **intención funcional**.

---

## 🧩 1. `--background` → **Fondo principal**

**Qué significa:**
Es el color base que “sostiene” toda la interfaz.
Todo lo demás se dibuja encima de él.

**Usos típicos:**

- Fondo general de la app o página (`body`, `main`, etc.)
- Fondos de áreas grandes
- Contenedores sin borde

**Ejemplo:**

```css
body {
  background-color: var(--background);
}
```

💡 En modo oscuro, este suele pasar de blanco → gris oscuro o negro.

---

## 🎨 2. `--foreground` → **Texto o contenido principal**

**Qué significa:**
Es el color del texto, íconos o elementos que deben **ser legibles sobre el background**.

**Usos típicos:**

- Texto normal (`p`, `span`)
- Íconos, labels
- Contenido principal sobre el `background`

**Ejemplo:**

```css
p {
  color: var(--foreground);
}
```

💡 Si el fondo es claro → foreground oscuro
💡 Si el fondo es oscuro → foreground claro

---

## 🪟 3. `--card` → **Fondo de componentes contenidos**

**Qué significa:**
Representa el fondo de elementos “flotantes” o contenidos, como **tarjetas, modales, dropdowns, etc.**

**Usos típicos:**

- Tarjetas (`Card`, `Modal`, `Dialog`)
- Listas con fondo distinto
- Formularios agrupados

**Ejemplo:**

```css
.card {
  background-color: var(--card);
  border: 1px solid var(--border);
}
```

💡 Normalmente es un poco diferente al `--background` para crear **profundidad visual**.

---

## ✍️ 4. `--card-foreground` → **Texto dentro de tarjetas**

**Qué significa:**
El color de los textos, íconos o botones **que están dentro** de una tarjeta.

**Usos típicos:**

- Texto dentro de `Card`
- Íconos o labels dentro de `Modal`
- Descripciones en zonas secundarias

**Ejemplo:**

```css
.card p {
  color: var(--card-foreground);
}
```

💡 Suele ser **un poco menos contrastado** que `--foreground`.

---

## 🔵 5. `--primary` → **Acción principal o color de marca**

**Qué significa:**
Es **el color más importante** de tu sistema.
Representa la identidad visual de la app y las acciones primarias.

**Usos típicos:**

- Botones principales (`Button primary`)
- Links destacados
- Elementos activos o seleccionados
- Barras de progreso, acentos visuales

**Ejemplo:**

```css
.button-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

💡 Debe tener **fuerte contraste** con `--primary-foreground`.

---

## ⚪ 6. `--primary-foreground` → **Texto o íconos sobre `--primary`**

**Qué significa:**
El color del texto o íconos que aparecen **encima del color primario**.

**Usos típicos:**

- Texto de los botones primarios
- Íconos dentro de `primary` components

**Ejemplo:**

```css
.button-primary span {
  color: var(--primary-foreground);
}
```

💡 Si el `primary` es azul fuerte → `primary-foreground` suele ser blanco.

---

## 🟣 7. `--secondary` → **Acción secundaria o soporte visual**

**Qué significa:**
Complementa el `primary`.
Se usa para acciones o áreas menos destacadas.

**Usos típicos:**

- Botones secundarios
- Tabs inactivos
- Bordes suaves o badges

**Ejemplo:**

```css
.button-secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}
```

---

## ⚪ 8. `--secondary-foreground` → **Texto dentro de botones secundarios**

**Usos típicos:**

- Texto en botones secundarios
- Etiquetas dentro de áreas secundarias

💡 Normalmente más oscuro que `--secondary`.

---

## 🧱 9. `--border` → **Líneas y separadores**

**Qué significa:**
Color usado para **bordes, divisores o contornos**.

**Usos típicos:**

- Líneas de separación entre secciones
- Bordes de inputs, cards, tablas

**Ejemplo:**

```css
.divider {
  border-color: var(--border);
}
```

💡 En modo oscuro, el border debe ser más claro para seguir visible.

---

## ⚠️ 10. `--destructive` / `--danger` → **Error o advertencia**

**Qué significa:**
Indica acciones destructivas o errores graves.

**Usos típicos:**

- Botones “Eliminar”
- Alertas de error
- Texto de validación en formularios

**Ejemplo:**

```css
.button-danger {
  background-color: var(--destructive);
  color: var(--destructive-foreground);
}
```

---

## 🌫 11. `--muted` y `--muted-foreground` → **Elementos secundarios, deshabilitados o suaves**

**Qué significa:**
Colores apagados, para **texto secundario, hints, placeholders, tooltips** o estados inactivos.

**Usos típicos:**

- Placeholder de inputs
- Texto de descripción
- Etiquetas o detalles no activos

**Ejemplo:**

```css
input::placeholder {
  color: var(--muted-foreground);
}
```

---

## ⚙️ 12. `--accent` → **Detalles visuales o decorativos**

**Qué significa:**
Un color que **rompe la monotonía** visual. No es el principal, pero se usa para pequeños acentos o gráficos.

**Usos típicos:**

- Hover states
- Ilustraciones, íconos decorativos
- Notificaciones o badges suaves

---

## 🪶 13. `--input` → **Fondo de los campos de texto**

**Qué significa:**
Específico para campos de entrada (`input`, `textarea`).

**Usos típicos:**

```css
input {
  background-color: var(--input);
  border-color: var(--border);
  color: var(--foreground);
}
```

---

## 🧠 14. Cómo pensar como diseñador _dev-friendly_

Imagina que **cada color tiene una “tarea”**, no una tonalidad fija.
Entonces, si cambias el tema (modo oscuro, otro cliente, marca distinta), **solo cambias las variables**, no el CSS ni los componentes.

Por ejemplo:

```ts
// light
--background: #ffffff
--foreground: #111111
--primary: #3b82f6
--primary-foreground: #ffffff

// dark
--background: #0f172a
--foreground: #f8fafc
--primary: #60a5fa
--primary-foreground: #0f172a
```

Y automáticamente **toda tu app cambia de tema sin tocar el HTML.**

---

## 🎯 CONCLUSIÓN

| Token                            | Significado                       | Usos principales             |
| -------------------------------- | --------------------------------- | ---------------------------- |
| `--background`                   | Fondo general                     | Body, main                   |
| `--foreground`                   | Texto principal                   | Tipografía, íconos           |
| `--card`                         | Fondo de tarjetas                 | Cards, modals                |
| `--card-foreground`              | Texto en tarjetas                 | Texto en cards               |
| `--primary`                      | Acción principal / color de marca | Botones, links               |
| `--primary-foreground`           | Texto sobre color primario        | Texto de botón principal     |
| `--secondary`                    | Acción secundaria                 | Botones secundarios, tabs    |
| `--secondary-foreground`         | Texto en secundario               | Texto de botón secundario    |
| `--border`                       | Contornos y divisores             | Bordes, líneas               |
| `--muted` / `--muted-foreground` | Elementos inactivos               | Placeholders, texto apagado  |
| `--destructive`                  | Peligro o error                   | Alertas, botones de eliminar |
| `--accent`                       | Decorativo o hover                | Íconos, detalles             |
| `--input`                        | Fondo de inputs                   | Campos de formulario         |

---
