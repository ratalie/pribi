import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { ItemStateEnum } from "~/types/enums/ItemStateEnum";

export interface BaseTableRow {
  id: number | string;
  estado?: ItemStateEnum | string;
}

export interface TableColumn<T extends BaseTableRow> {
  key: keyof T;
  label: string;
  type: "text" | "status" | "icons";
  icons?: string[];
}

export const getColumns = <T extends BaseTableRow>(
  headersList: TableColumn<T>[]
): ColumnDef<T>[] => {
  return headersList.map((header) => {
    if (header.type === "status") {
      return {
        accessorKey: header.key,
        header: () => h("div", { class: "pl-4" }, header.label),
        cell: ({ row }) => {
          const value = row.getValue(header.key as string);
          const status = row.original.estado || "";

          const getStatusClass = (status: ItemStateEnum | string) => {
            switch (status) {
              case ItemStateEnum.COMPLETADO:
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
              case ItemStateEnum.PENDIENTE:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
              default:
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            }
          };

          return h(
            "div",
            {
              class: `px-2 py-2 w-[100px] flex justify-center rounded-lg font-medium t-body-sm ${getStatusClass(
                status
              )}`,
            },
            String(value)
          );
        },
      };
    }

    if (header.type === "icons") {
      return {
        accessorKey: header.key,
        header: () => header.label,
        cell: ({ row }) => {
          const value = row.getValue(String(header.key));
          const icons = header.icons || [];
          const iconName = value && icons[0] ? icons[0] : icons[1] ? icons[1] : "";

          return h("span", {}, [
            h(getIcon(iconName), { class: "size-5 text-primary font-medium" }),
          ]);
        },
      };
    }

    return {
      accessorKey: header.key,
      header: () => header.label,
      cell: ({ row }) => h("div", {}, row.getValue(String(header.key))),
    };
  });
};
