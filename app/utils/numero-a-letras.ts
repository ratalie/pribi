/**
 * Utilidad para convertir números a letras en español
 * Usado para documentos legales (actas, minutas, etc.)
 * 
 * Basado en la conversión estándar de números a palabras en español
 */

/**
 * Convierte un número a letras en español
 * @param numero - Número a convertir
 * @returns String con el número en letras
 * 
 * Ejemplos:
 * - numeroALetras(1000) => "mil"
 * - numeroALetras(1234) => "mil doscientos treinta y cuatro"
 * - numeroALetras(1000000) => "un millón"
 */
export function numeroALetras(numero: number): string {
  if (numero === 0) return "cero";
  if (numero < 0) return "menos " + numeroALetras(Math.abs(numero));

  // Separar parte entera y decimal
  const partes = numero.toString().split(".");
  const parteEntera = parseInt(partes[0], 10);
  const parteDecimal = partes[1] ? parseInt(partes[1], 10) : 0;

  let resultado = convertirEntero(parteEntera);

  // Agregar decimales si existen
  if (parteDecimal > 0) {
    resultado += " con " + convertirEntero(parteDecimal);
  }

  return resultado;
}

/**
 * Convierte la parte entera de un número a letras
 */
function convertirEntero(numero: number): string {
  if (numero === 0) return "cero";
  if (numero < 0) return "menos " + convertirEntero(Math.abs(numero));

  // Números del 1 al 15
  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
  ];

  // Números del 16 al 19
  const decenasEspeciales = [
    "",
    "",
    "",
    "",
    "",
    "",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];

  // Decenas
  const decenas = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];

  // Centenas
  const centenas = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  if (numero <= 15) {
    return unidades[numero];
  }

  if (numero < 20) {
    return decenasEspeciales[numero - 10];
  }

  if (numero < 100) {
    const decena = Math.floor(numero / 10);
    const unidad = numero % 10;

    if (unidad === 0) {
      return decenas[decena];
    }

    if (decena === 2) {
      return "veinti" + unidades[unidad];
    }

    return decenas[decena] + " y " + unidades[unidad];
  }

  if (numero < 1000) {
    const centena = Math.floor(numero / 100);
    const resto = numero % 100;

    if (centena === 1 && resto === 0) {
      return "cien";
    }

    if (resto === 0) {
      return centenas[centena];
    }

    return centenas[centena] + " " + convertirEntero(resto);
  }

  if (numero < 1000000) {
    const miles = Math.floor(numero / 1000);
    const resto = numero % 1000;

    let resultado = "";

    if (miles === 1) {
      resultado = "mil";
    } else {
      resultado = convertirEntero(miles) + " mil";
    }

    if (resto === 0) {
      return resultado;
    }

    if (resto < 100) {
      return resultado + " " + convertirEntero(resto);
    }

    return resultado + " " + convertirEntero(resto);
  }

  if (numero < 1000000000) {
    const millones = Math.floor(numero / 1000000);
    const resto = numero % 1000000;

    let resultado = "";

    if (millones === 1) {
      resultado = "un millón";
    } else {
      resultado = convertirEntero(millones) + " millones";
    }

    if (resto === 0) {
      return resultado;
    }

    return resultado + " " + convertirEntero(resto);
  }

  // Para números muy grandes, retornar en formato simplificado
  return numero.toLocaleString("es-PE");
}

/**
 * Convierte un monto monetario a letras
 * @param monto - Monto a convertir
 * @param moneda - Moneda (PEN o USD)
 * @returns String con el monto en letras
 * 
 * Ejemplo:
 * - montoALetras(1000, "PEN") => "mil soles"
 * - montoALetras(1000, "USD") => "mil dólares"
 */
export function montoALetras(monto: number, moneda: "PEN" | "USD" = "PEN"): string {
  const numeroEnLetras = numeroALetras(monto);
  const monedaTexto = moneda === "PEN" ? "soles" : "dólares";
  return numeroEnLetras + " " + monedaTexto;
}


