import ReactECharts from "echarts-for-react";
import { useAsistenciasPorAnioDepartamentoQuery } from "../api";
import { CHART_H_HEAT } from "@/lib/chartSize";

export default function HeatmapDepartamentoAnio({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, isError } = useAsistenciasPorAnioDepartamentoQuery({
    per_page: 500,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando heatmap...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  const departamentos = Array.from(
    new Set(results.map((item: any) => item.departamento))
  ).sort();
  const anios = Array.from(
    new Set(results.map((item: any) => item.anio))
  ).sort();

  const dataMatrix: [number, number, number][] = [];
  results.forEach((item: any) => {
    const deptoIdx = departamentos.indexOf(item.departamento);
    const anioIdx = anios.indexOf(item.anio);
    const total = item.cantidad_familias_asistidas || 0;
    if (deptoIdx !== -1 && anioIdx !== -1) {
      dataMatrix.push([anioIdx, deptoIdx, total]);
    }
  });

  const option = {
    tooltip: {
      position: "top",
      formatter: (params: any) => {
        const anio = anios[params.data[0]];
        const depto = departamentos[params.data[1]];
        const value = params.data[2];
        return `${depto} - ${anio}: <b>${value}</b>`;
      },
    },
    grid: {
      height: "80%", // Más área para las celdas
      top: 20,
      left: "11%",
      right: 40,
      bottom: 40,
    },
    xAxis: {
      type: "category",
      data: anios,
      name: "Año",
      splitArea: { show: true },
      axisLabel: { rotate: 0, fontSize: 12, interval: 0 },
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "category",
      data: departamentos,
      name: "Departamento",
      splitArea: { show: true },
      nameLocation: "middle",
      nameGap: 90,
      axisLabel: { fontSize: 12, interval: 0 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    visualMap: {
      min: 0,
      max: Math.max(...dataMatrix.map((d) => d[2]), 10),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 25,
      inRange: {
        color: ["#fee2e2", "#fca5a5", "#ef4444", "#991b1b"],
      },
    },
    series: [
      {
        name: "Familias",
        type: "heatmap",
        data: dataMatrix,
        label: {
          show: true,
          color: "#222",
          fontWeight: "bold",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.5)",
          },
        },
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Heatmap_Departamento_Anio",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 0 }}>
      <ReactECharts
        option={option}
        style={{ height: CHART_H_HEAT }}
        opts={{ devicePixelRatio: 2 }}
      />
    </div>
  );
}
