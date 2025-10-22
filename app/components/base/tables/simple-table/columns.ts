// components/payments/columns.ts
import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";

export interface Payment {
  id: string;
  razon_social: string;
  ruc: string;
  nombre_comercial: string;
  tipo_sociedad: string;
  estado: string;
  amount: string;
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "razon_social",
    header: "Razón Social",
    cell: ({ row }) => h("div", {}, row.getValue("razon_social")),
  },
  {
    accessorKey: "ruc",
    header: "RUC",
    cell: ({ row }) => h("div", {}, row.getValue("ruc")),
  },
  {
    accessorKey: "nombre_comercial",
    header: "Nombre Comercial",
    cell: ({ row }) => h("div", {}, row.getValue("nombre_comercial")),
  },
  {
    accessorKey: "tipo_sociedad",
    header: "Tipo de Sociedad",
    cell: ({ row }) => h("div", {}, row.getValue("tipo_sociedad")),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => h("div", {}, row.getValue("estado")),
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, "Amount"),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
];
