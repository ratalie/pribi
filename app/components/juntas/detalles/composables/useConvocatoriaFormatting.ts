/**
 * Composable para formatear y parsear fechas y horas de convocatorias
 *
 * Responsabilidades:
 * - Formatear fecha (Date → string "YYYY-MM-DD")
 * - Formatear hora (Date → string "HH:mm")
 * - Parsear fecha (string → Date)
 * - Parsear hora (string → Date)
 */

export function useConvocatoriaFormatting() {
  /**
   * Formatea una fecha a string "YYYY-MM-DD"
   */
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "";

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "";
      const isoString = dateObj.toISOString();
      const datePart = isoString.split("T")[0];
      return datePart || "";
    } catch {
      return "";
    }
  };

  /**
   * Formatea una hora a string "HH:mm"
   */
  const formatTime = (date: Date | string | undefined): string => {
    if (!date) return "";

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "";
      const hours = dateObj.getHours().toString().padStart(2, "0");
      const minutes = dateObj.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  /**
   * Parsea un string de fecha a Date
   */
  const parseDate = (value: string | undefined): Date => {
    if (!value) {
      return new Date();
    }
    return new Date(value);
  };

  /**
   * Parsea un string de hora (HH:mm) a Date
   */
  const parseTime = (value: string | undefined): Date => {
    if (!value) {
      return new Date();
    }

    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0);
    return date;
  };

  return {
    formatDate,
    formatTime,
    parseDate,
    parseTime,
  };
}
