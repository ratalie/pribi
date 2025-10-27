import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-secondary font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98] active:transition-transform active:duration-100",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-neutral-white-100 hover:bg-primary-600/80",
        primary_outline:
          "border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-neutral-white-100",
        secondary: "bg-gray-700 text-neutral-white-100 hover:bg-gray-700/80",
        secondary_outline:
          "border border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-neutral-white-100",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px px-4 py-2 has-[>svg]:px-3",
        sm: "h-[40px] w-[95px] t-t2 gap-1",
        md: "h-[44px] w-[152px] t-t1 gap-2",
        lg: "h-[44px] w-[180px] t-t1 gap-2",
        xl: "h-[52px] w-[232px] t-h6 gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
