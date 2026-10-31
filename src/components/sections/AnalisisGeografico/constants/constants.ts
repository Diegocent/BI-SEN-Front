import { Column } from "@/components/data-table";
import { columnasBeneficiarios } from "@/components/columnas-beneficiarios";

export const columnasDepartamentos: Column[] = [
  {
    key: "departamento",
    label: "Departamento",
    dataType: "text",
    filterType: "text",
  },
  ...columnasBeneficiarios,
  {
    key: "kit_sentencia",
    label: "Kits Sentencia",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kits de asistencia por eventos adversos",
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

export const columnasDistritos: Column[] = [
  {
    key: "departamento",
    label: "Departamento",
    dataType: "text",
    filterType: "text",
  },
  { key: "distrito", label: "Distrito", dataType: "text", filterType: "text" },
  ...columnasBeneficiarios,
  {
    key: "kit_sentencia",
    label: "Kits Sentencia",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kits de asistencia por eventos adversos",
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

export const columnasDepartamentosPDF: Column[] = [
  {
    key: "departamento",
    label: "Departamento",
    dataType: "text",
    filterType: "text",
  },
  ...columnasBeneficiarios,
  {
    key: "kit_sentencia",
    label: "Kits Sentencia",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kits de asistencia por eventos adversos",
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

export const columnasDistritosPDF: Column[] = [
  {
    key: "departamento",
    label: "Departamento",
    dataType: "text",
    filterType: "text",
  },
  { key: "distrito", label: "Distrito", dataType: "text", filterType: "text" },
  ...columnasBeneficiarios,
  {
    key: "kit_sentencia",
    label: "Kits Sentencia",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kits de asistencia por eventos adversos",
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
