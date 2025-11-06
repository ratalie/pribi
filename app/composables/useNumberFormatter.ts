export interface NumberFormatterOptions {
  decimals?: number;
  decimalFactor?: number;
  format?: "decimal" | "integer" | "thousands" | "default";
}

export const useNumberFormatter = (options: NumberFormatterOptions = {}) => {
  const { decimals = 0, decimalFactor = 100, format = "default" } = options;

  /**
   * Formatea un valor numérico según las opciones
   * @param value - Valor a formatear (puede ser string o number)
   * @returns String formateado con comas y/o decimales
   */
  const formatNumber = (value: string | number): string => {
    const stringValue = String(value);

    const cleaned =
      format === "decimal"
        ? stringValue.replace(/[^0-9]/g, "") // Solo dígitos para decimal
        : stringValue.replace(/(?!^)-|[^0-9-]/g, ""); // sin punto ni guión

    if (!cleaned) return "";

    if (format === "decimal") {
      const numberFormat = (Number(cleaned) / decimalFactor).toFixed(decimals);
      return numberFormat.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (format === "integer") {
      const parsedInt = parseInt(cleaned, 10);
      return isNaN(parsedInt) ? "" : parsedInt.toString();
    }

    if (format === "thousands") {
      return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return cleaned;
  };

  /**
   * Remueve formato para obtener el valor numérico puro
   * @param value - String formateado
   * @returns Number sin formato
   */
  const unformatNumber = (value: string): number => {
    if (!value) return 0;
    const cleaned = value.replace(/,/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  /**
   * Completa decimales faltantes en un string
   * @param value - String con número
   * @returns String con decimales completos
   */
  const padDecimals = (value: string): string => {
    if (format !== "decimal" || decimals === 0) return value;

    if (value.includes(".")) {
      const [intPart, decPart] = value.split(".");
      const paddedDec = (decPart || "").padEnd(decimals, "0");
      return `${intPart}.${paddedDec}`;
    }

    return value + "." + "0".repeat(decimals);
  };

  return {
    formatNumber,
    unformatNumber,
    padDecimals,
  };
};
