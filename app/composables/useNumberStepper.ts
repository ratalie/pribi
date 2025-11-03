import { computed, ref, watch, type Ref } from "vue";

interface UseNumberStepperOptions {
  modelValue: Ref<string> | string;
  min: number;
  max: number;
  isDisabled?: boolean;
  onUpdate: (value: string) => void;
}

/**
 * Composable para manejar la lógica de un input numérico con botones de incremento/decremento
 *
 * @param options - Opciones del stepper
 * @returns Funciones y estados para manejar el input numérico
 */
export function useNumberStepper(options: UseNumberStepperOptions) {
  const { modelValue, min, max, isDisabled = false, onUpdate } = options;

  // Convertir a Ref si es necesario
  const modelValueRef = typeof modelValue === "string" ? ref(modelValue) : modelValue;
  const currentValue = computed(() => modelValueRef.value);

  // Valor interno del input (lo que el usuario ve)
  const inputValue = ref(currentValue.value || String(min));

  /**
   * Asegura que el valor esté entre min y max
   * Ejemplo: si min=3 y max=9, y escribes 15, te devuelve 9
   */
  const clampValue = (value: number): number => {
    return Math.max(min, Math.min(max, value));
  };

  /**
   * Convierte un string a número de forma segura
   * Ejemplo: "5" → 5, "abc" → min, "" → min
   */
  const getNumericValue = (value: string | undefined | null): number => {
    if (!value) return min;
    const num = parseInt(value, 10);
    return isNaN(num) ? min : num;
  };

  /**
   * Se ejecuta cuando escribes en el input
   * - Solo permite números
   * - Ajusta el valor al rango min-max automáticamente
   */
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const numericValue = target.value.replace(/[^0-9]/g, ""); // Solo números

    if (numericValue === "") {
      inputValue.value = "";
      onUpdate("");
      return;
    }

    const num = parseInt(numericValue, 10);
    if (!isNaN(num)) {
      const clamped = clampValue(num);
      const clampedStr = String(clamped);
      inputValue.value = clampedStr;
      onUpdate(clampedStr);
    } else {
      inputValue.value = currentValue.value || String(min);
    }
  };

  /**
   * Se ejecuta cuando sales del input (pierde el foco)
   * - Si está vacío o inválido, pone el valor mínimo
   * - Ajusta el valor al rango si es necesario
   */
  const handleBlur = () => {
    const num = parseInt(inputValue.value, 10);
    if (isNaN(num) || inputValue.value === "") {
      const defaultValue = currentValue.value || String(min);
      inputValue.value = defaultValue;
      onUpdate(defaultValue);
    } else {
      const clamped = clampValue(num);
      const clampedStr = String(clamped);
      inputValue.value = clampedStr;
      onUpdate(clampedStr);
    }
  };

  /**
   * Aumenta el valor en 1 (botón flecha arriba)
   */
  const increment = () => {
    if (isDisabled) return;
    const currentNum = getNumericValue(currentValue.value);
    const newValue = clampValue(currentNum + 1);
    const newValueStr = String(newValue);
    onUpdate(newValueStr);
    inputValue.value = newValueStr;
  };

  /**
   * Disminuye el valor en 1 (botón flecha abajo)
   */
  const decrement = () => {
    if (isDisabled) return;
    const currentNum = getNumericValue(currentValue.value);
    const newValue = clampValue(currentNum - 1);
    const newValueStr = String(newValue);
    onUpdate(newValueStr);
    inputValue.value = newValueStr;
  };

  /**
   * Verifica si puedes aumentar el valor
   * Ejemplo: si el valor actual es 9 y max=9, no puedes incrementar
   */
  const canIncrement = computed(() => {
    const currentNum = getNumericValue(currentValue.value);
    return !isDisabled && currentNum < max;
  });

  /**
   * Verifica si puedes disminuir el valor
   * Ejemplo: si el valor actual es 3 y min=3, no puedes decrementar
   */
  const canDecrement = computed(() => {
    const currentNum = getNumericValue(currentValue.value);
    return !isDisabled && currentNum > min;
  });

  // Sincroniza el valor interno cuando cambia el modelValue desde fuera
  watch(
    currentValue,
    (newValue) => {
      if (newValue !== undefined && newValue !== null && newValue !== "") {
        inputValue.value = newValue;
      } else if (!inputValue.value) {
        inputValue.value = String(min);
      }
    },
    { immediate: true }
  );

  return {
    inputValue,
    handleInput,
    handleBlur,
    increment,
    decrement,
    canIncrement,
    canDecrement,
  };
}
