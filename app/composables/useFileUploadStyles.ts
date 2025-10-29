import { computed, type ComputedRef } from "vue";

export interface FileUploadStyleOptions {
  variant?: "default" | "compact" | "inline" | "custom";
  customHeight?: string;
  customWidth?: string;
  customBgColor?: string;
  customBorderColor?: string;
  customIconBg?: string;
  iconSize?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
}

export interface FileUploadStyles {
  containerClasses: ComputedRef<string[]>;
  containerStyles: ComputedRef<Record<string, string>>;
  iconContainerClasses: ComputedRef<string>;
  iconSizeClass: ComputedRef<string>;
  layoutClass: ComputedRef<string>;
  textSizeClass: ComputedRef<string>;
}

export function useFileUploadStyles(
  options: FileUploadStyleOptions,
  isDragging: ComputedRef<boolean> | Ref<boolean>,
  hasFile: ComputedRef<boolean>,
  hasError: ComputedRef<boolean>
): FileUploadStyles {
  const {
    variant = "default",
    customHeight,
    customWidth,
    customBgColor,
    customBorderColor,
    customIconBg,
    iconSize,
    borderRadius = "lg",
  } = options;

  // Clases de altura según variante
  const heightClass = computed(() => {
    if (customHeight) return "";

    switch (variant) {
      case "compact":
        return "h-24";
      case "inline":
        return "h-16";
      case "default":
      default:
        return "h-48";
    }
  });

  // Clases de ancho según variante
  const widthClass = computed(() => {
    if (customWidth) return "";
    return "w-full"; // Por defecto ocupa todo el ancho
  });

  // Clases de border radius
  const radiusClass = computed(() => {
    switch (borderRadius) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "md":
        return "rounded-md";
      case "lg":
        return "rounded-lg";
      case "full":
        return "rounded-full";
      default:
        return "rounded-lg";
    }
  });

  // Clases de fondo y borde dinámicas
  const backgroundClasses = computed(() => {
    if (customBgColor && customBorderColor) return "";

    if (hasError.value) {
      return "border-red-500 bg-red-50";
    }

    if (isDragging.value) {
      return "border-primary-600 bg-primary-50";
    }

    if (hasFile.value) {
      return "border-primary-200 bg-white";
    }

    return "border-primary-200 bg-primary-50 hover:border-primary-400 hover:bg-primary-100";
  });

  // Container classes combinadas
  const containerClasses = computed(() => {
    const classes = [
      "relative border-2 border-dashed transition-all",
      "flex items-center justify-center cursor-pointer",
      heightClass.value,
      widthClass.value,
      radiusClass.value,
      backgroundClasses.value,
    ];

    return classes.filter(Boolean);
  });

  // Container styles inline (para custom values)
  const containerStyles = computed(() => {
    const styles: Record<string, string> = {};

    if (customHeight) styles.height = customHeight;
    if (customWidth) styles.width = customWidth;
    if (customBgColor) styles.backgroundColor = customBgColor;
    if (customBorderColor) styles.borderColor = customBorderColor;

    return styles;
  });

  // Icono container classes
  const iconContainerClasses = computed(() => {
    const bg = customIconBg || "bg-white";
    const padding = iconPaddingClass.value;
    return `${bg} rounded-full shadow-sm ${padding}`;
  });

  // Padding del círculo del icono
  const iconPaddingClass = computed(() => {
    switch (variant) {
      case "compact":
        return "p-2";
      case "inline":
        return "p-1.5";
      case "custom":
        return "p-2";
      case "default":
      default:
        return "p-3";
    }
  });

  // Tamaño del icono
  const iconSizeClass = computed(() => {
    if (iconSize) return iconSize;

    switch (variant) {
      case "compact":
        return "h-5 w-5";
      case "inline":
        return "h-4 w-4";
      case "custom":
        return "h-5 w-5";
      case "default":
      default:
        return "h-6 w-6";
    }
  });

  // Layout (vertical u horizontal)
  const layoutClass = computed(() => {
    switch (variant) {
      case "inline":
        return "flex-row gap-3 px-4";
      case "compact":
        return "flex-col gap-2 px-4 py-4";
      case "default":
      default:
        return "flex-col gap-4 px-6 py-8";
    }
  });

  // Tamaño de texto
  const textSizeClass = computed(() => {
    switch (variant) {
      case "inline":
        return "text-xs";
      case "compact":
        return "text-xs";
      case "default":
      default:
        return "text-sm";
    }
  });

  return {
    containerClasses,
    containerStyles,
    iconContainerClasses,
    iconSizeClass,
    layoutClass,
    textSizeClass,
  };
}
