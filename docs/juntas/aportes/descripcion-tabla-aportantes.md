Perfecto, vamos por partes, como si esto fuera solo una lista de “items” sin saber nada de leyes ni negocios 👇

---

### 1. Estructura general de la tabla

Cada **fila** representa un `Item` (una entidad cualquiera).
Cada **columna** representa una propiedad de ese `Item`.

Podrías verlo así en código:

```ts
interface ContributorRow {
  id: string;
  isSelected: boolean;         // checkbox
  displayName: string;         // "Nombre Apellido / Razón Social"
  contributorType: 'ACCIONISTA' | 'NUEVO_APORTANTE'; // badge
  sharesCount: number;         // "N.º de acciones"
  participationPercent: number; // "% Participación"
}
```

---

### 2. Columnas una por una

De izquierda a derecha:

1. **Columna 0 – Checkbox de selección**

   * Tipo: `boolean` (`isSelected`).
   * UI: un `<input type="checkbox">`.
   * Comportamiento:

     * Cuando está marcado, la fila se resalta con un fondo lila.
     * Sirve para indicar que ese item está “incluido/seleccionado” para el flujo actual.
   * En tu flujo de selección, los items creados desde “Agregar Aportante” vendrían con `isSelected = true` por defecto.

2. **Columna 1 – Nombre Apellido / Razón Social**

   * Tipo: `string` (`displayName`).
   * Ejemplos de valor:

     * `"Ana María Gómez Torres"`
     * `"Inversiones del Sur S.A.C."`
   * Solo texto, es el identificador visible del item.

3. **Columna 2 – Tipo de Aportante**

   * Tipo: `enum` / `string` (`contributorType`).
   * Se muestra como un *badge* con borde y texto (chip).
   * Valores que se ven:

     * `"ACCIONISTA"`
     * `"NUEVO APORTANTE"` (para filas nuevas creadas desde el botón).
   * A nivel de diseño, podrías mapearlo así:

   ```ts
   type ContributorType = 'ACCIONISTA' | 'NUEVO_APORTANTE';
   ```

4. **Columna 3 – N.º de acciones**

   * Tipo: `number` (`sharesCount`).
   * Ejemplo: `100`, `200`, `60`, `0`.
   * Es un valor numérico que eventualmente puedes usar para cálculos.

5. **Columna 4 – % Participación**

   * Tipo: `number` (`participationPercent`).
   * Ejemplo: `23.8`, `47.62`, `14.28`, `0`.
   * En UI se formatea como porcentaje con símbolo `%`.

6. **Columna 5 – Menú de tres puntos (kebab menu)**

   * No tiene encabezado visible.
   * Es un botón de tipo “acciones de fila”.
   * En términos de programación:

   ```ts
   interface RowActions {
     onEdit: (rowId: string) => void;
     onDelete: (rowId: string) => void;
   }
   ```

   * El ícono `⋮` abre un menú contextual con opciones tipo:

     * **Editar** → abre modal / cambia la fila a modo edición.
     * **Eliminar** → borra la fila o la marca como eliminada.

---

### 3. Comportamiento del botón “Agregar Aportante”

Arriba a la derecha aparece el botón `+ Agregar Aportante`.

En términos de programación podrías pensarlo así:

```ts
function handleAddContributor() {
  const newRow: ContributorRow = {
    id: crypto.randomUUID(),
    isSelected: true,                 // viene chequeado por defecto
    displayName: '',                  // o el nombre que ingreses en el formulario
    contributorType: 'NUEVO_APORTANTE',
    sharesCount: 0,
    participationPercent: 0,
  };

  rows.push(newRow);
}
```

* Acción:

  * Crea un nuevo `ContributorRow`.
  * Marca el `checkbox` como **true** (seleccionado).
  * El tipo viene como `"NUEVO APORTANTE"`.
  * Cantidad de acciones y porcentaje pueden iniciar en `0` hasta que el usuario los edite.

---

### 4. Vista “modo selección”

En la segunda imagen se ve el título **“Selección de aportantes”** arriba:

* Es la misma tabla, pero en contexto de selección.
* Regla principal:

  * Solo los items con `isSelected = true` se consideran “incluidos” en el flujo actual.
* Visualmente:

  * Fila seleccionada → fondo lila suave.
  * Fila no seleccionada → fondo oscuro normal.

---

Si quieres, en el siguiente paso te puedo ayudar a modelar esto en un componente tipo Vue/React (props, emits para `onSelectRow`, `onAddContributor`, `onEdit`, `onDelete`, etc.) para que quede listo para codear.
