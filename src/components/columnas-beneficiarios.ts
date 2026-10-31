import { Column } from "@/components/data-table";

/** Columnas de caracterización de beneficiarios, compartidas por todas las tablas. */
export const columnasBeneficiarios: Column[] = [
  {
    key: "cantidad_familias_asistidas",
    label: "Familias",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "cantidad_mujeres",
    label: "Mujeres",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "cantidad_hombres",
    label: "Hombres",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "cantidad_indigena",
    label: "Indígena",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "cantidad_no_indigena",
    label: "No indígena",
    dataType: "number",
    filterType: "text",
  },
];
