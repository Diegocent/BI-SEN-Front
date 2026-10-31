import ReactECharts from "echarts-for-react";
import { useGetPorDepartamentoQuery } from "../api";
import { CHART_H } from "@/lib/chartSize";

const tiposAyuda = [
  "kit_sentencia",
  "kit_evento",
  "chapa_fibrocemento_cantidad",
  "chapa_zinc_cantidad",
  "colchones_cantidad",
  "frazadas_cantidad",
  "terciadas_cantidad",
  "puntales_cantidad",
  "carpas_plasticas_cantidad",
];

const ayudaLabels: Record<string, string> = {
  kit_sentencia: "Kit Sentencia",
  kit_evento: "Kit Evento",
  chapa_fibrocemento_cantidad: "Chapa Fibrocemento",
  chapa_zinc_cantidad: "Chapa Zinc",
  colchones_cantidad: "Colchones",
  frazadas_cantidad: "Frazadas",
  terciadas_cantidad: "Terciadas",
  puntales_cantidad: "Puntales",
  carpas_plasticas_cantidad: "Carpas Plásticas",
};

interface Props {
  fecha_inicio?: string;
  fecha_fin?: string;
}

export default function GraficoDistribucionAyudasPorDepartamento({
  fecha_inicio,
  fecha_fin,
}: Props) {
  const { data, isLoading, isError } = useGetPorDepartamentoQuery({
    per_page: 18,
    fecha_desde: fecha_inicio,
    fecha_hasta: fecha_fin,
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];
  const departamentos = results.map((d: any) => d.departamento);

  const series = tiposAyuda.map((tipo) => ({
    name: ayudaLabels[tipo] || tipo,
    type: "bar",
    stack: "total",
    emphasis: { focus: "series" },
    data: results.map((d: any) => d[tipo] || 0),
  }));

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { bottom: 0, textStyle: { fontSize: 10 } },
    grid: { left: "6%", right: "4%", top: 20, bottom: 60, containLabel: true },
    xAxis: {
      type: "category",
      data: departamentos,
      axisLabel: {
        rotate: 30,
        margin: 16,
        fontSize: 12,
      },
      name: "Total ayudas",
      nameLocation: "middle",
      nameGap: 65,
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "value",
      name: "Unidades Distribuidas",
      nameLocation: "middle",
      nameGap: 75,
      axisLabel: { fontSize: 14 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    series,
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Distribucion_asistencias_por_departamento",
        },
      },
      right: 10,
      top: -10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 0 }}>
      <ReactECharts option={option} style={{ height: CHART_H, marginTop: 0 }} />
    </div>
  );
}
