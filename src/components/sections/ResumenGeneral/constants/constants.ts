import { Column } from "@/components/data-table";
import { columnasBeneficiarios } from "@/components/columnas-beneficiarios";

const columnasRegistros: Column[] = [
  { key: "fecha", label: "Fecha", dataType: "date", filterType: "date" },
  {
    key: "localidad",
    label: "Localidad",
    dataType: "text",
    filterType: "text",
  },
  { key: "distrito", label: "Distrito", dataType: "text", filterType: "text" },
  {
    key: "departamento",
    label: "Departamento",
    dataType: "text",
    filterType: "text",
  },
  { key: "evento", label: "Evento", dataType: "text", filterType: "text" },
  ...columnasBeneficiarios,
  {
    key: "kit_sentencia",
    label: "Kit de sentencia de la Corte",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kit de asistencia por evento adverso",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "chapa_fibrocemento_cantidad",
    label: "Chapas Fibrocemento",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "chapa_zinc_cantidad",
    label: "Chapas Zinc",
    dataType: "number",
    filterType: "text",
  },
];

const columnasReportes: Column[] = [
  { key: "fecha", label: "Fecha", dataType: "date", filterType: "date" },
  {
    key: "localidad",
    label: "Localidad",
    dataType: "text",
    filterType: "text",
  },
  { key: "distrito", label: "Distrito", dataType: "text", filterType: "text" },
  {
    key: "departamento",
    label: "Departamento",
    dataType: "text",
    filterType: "text",
  },
  { key: "evento", label: "Evento", dataType: "text", filterType: "text" },
  ...columnasBeneficiarios,
  {
    key: "kit_sentencia",
    label: "Kit de sentencia de la Corte",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kit de asistencia por evento adverso",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "chapa_fibrocemento_cantidad",
    label: "Chapas Fibrocemento",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "chapa_zinc_cantidad",
    label: "Chapas Zinc",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "colchones_cantidad",
    label: "Colchones",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "frazadas_cantidad",
    label: "Frazadas",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "terciadas_cantidad",
    label: "Terciadas",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "puntales_cantidad",
    label: "Puntales",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "carpas_plasticas_cantidad",
    label: "Carpas Plásticas",
    dataType: "number",
    filterType: "text",
  },
];

export { columnasRegistros, columnasReportes };
