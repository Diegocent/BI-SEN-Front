import ReactECharts from "echarts-for-react";
import { useTendenciaMensualAsistenciasQuery } from "../api/temporal/temporalApi";
import { CHART_H } from "@/lib/chartSize";

interface Props {
  fecha_inicio?: string;
  fecha_fin?: string;
}

export default function GraficoTendenciaMensual({
  fecha_inicio,
  fecha_fin,
}: Props) {
  const { data, isLoading, isError } = useTendenciaMensualAsistenciasQuery({
    per_page: 100,
    fecha_desde: fecha_inicio,
    fecha_hasta: fecha_fin,
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Eje X: año-mes, Eje Y: numero_asistencias
  const xData = results.map(
    (item: any) => `${item.anio || ""}-${item.nombre_mes || item.mes || ""}`
  );
  const yData = results.map(
    (item: any) => item.numero_asistencias || item.numeroAsistencias || 0
  );

  const option = {
    backgroundColor: "#fff",
    color: [
      "#5470C6",
      "#91CC75",
      "#EE6666",
      "#FAC858",
      "#73C0DE",
      "#3BA272",
      "#FC8452",
      "#9A60B4",
      "#EA7CCC",
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = params[0];
        return `${p.axisValue}<br/>Familias: <b>${p.data}</b>`;
      },
    },
    legend: {
      show: false,
      bottom: 10,
      textStyle: { fontSize: 14 },
      icon: "rect",
      itemWidth: 18,
      itemHeight: 12,
    },
    grid: { left: 60, right: 20, bottom: 60, top: 30, containLabel: true },
    xAxis: {
      type: "category",
      data: xData,
      name: "Mes",
      nameLocation: "middle",
      nameGap: 55,
      axisLabel: { fontSize: 12, rotate: 30 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "value",
      name: "Familias asistidas",
      nameLocation: "middle",
      nameGap: 40,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    series: [
      {
        data: yData,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        areaStyle: {},
        lineStyle: { width: 2 },
        label: { show: false },
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Tendencia_mensual",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 2 }}>
      <ReactECharts
        option={option}
        style={{ height: CHART_H }}
        opts={{ devicePixelRatio: 2 }}
      />
    </div>
  );
}
