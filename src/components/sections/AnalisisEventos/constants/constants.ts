import { Column } from "@/components/data-table";
import { columnasBeneficiarios } from "@/components/columnas-beneficiarios";

export const columnasTipoEventos: Column[] = [
  {
    key: "evento",
    label: "Tipo de evento",
    dataType: "text",
    filterType: "text",
  },
  {
    key: "numeroOcurrencias",
    label: "Número de Ocurrencias",
    dataType: "number",
    filterType: "text",
  },
  ...columnasBeneficiarios,
  {
    key: "kit_sentencia",
    label: "Kit sentencia",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kit por eventos adversos",
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

export const columnasEventosDepartamento: Column[] = [
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
    label: "Kits sentencia",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kits por eventos adversos",
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

export const columnasTipoEventosPDF: Column[] = [
  {
    key: "evento",
    label: "Tipo de evento",
    dataType: "text",
    filterType: "text",
  },
  {
    key: "numeroOcurrencias",
    label: "Número de Ocurrencias",
    dataType: "number",
    filterType: "text",
  },
  ...columnasBeneficiarios,
  {
    key: "kit_sentencia",
    label: "Kit sentencia",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kit por eventos adversos",
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

export const columnasEventosDepartamentoPDF: Column[] = [
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
    label: "Kits sentencia",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kits por eventos adversos",
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
