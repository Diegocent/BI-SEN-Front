import ReactECharts from "echarts-for-react";
import { useAsistenciasPorEventoQuery } from "@/api";
import { CHART_H } from "@/lib/chartSize";

export default function GraficoAyudasPorEvento({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, isError } = useAsistenciasPorEventoQuery({
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Ordenar por familias asistidas
  const sorted = [...results].sort(
    (a, b) =>
      (b.cantidad_familias_asistidas || 0) -
      (a.cantidad_familias_asistidas || 0)
  );

  const eventos = sorted.map((item) => item.evento);
  const ayudas = sorted.map((item) => item.cantidad_familias_asistidas || 0);

  // Calcular el total de ayudas para porcentaje
  const sumaTotal = ayudas.reduce((acc: number, curr: number) => acc + curr, 0);

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        // params es un array de series
        if (!params || !params.length) return "";
        const p = params[0];
        const value = p.value;
        const percent =
          sumaTotal > 0 ? ((value / sumaTotal) * 100).toFixed(1) : "0.0";
        return `${p.axisValueLabel}<br/>Familias: <b>${value}</b><br/>Porcentaje: <b>${percent}%</b>`;
      },
    },
    grid: { left: 30, right: 10, bottom: 10, top: 35, containLabel: true },
    xAxis: {
      type: "category",
      data: eventos,
      name: "Evento",
      nameLocation: "middle",
      nameGap: 90,
      axisLabel: { rotate: 90, fontSize: 11 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "value",
      name: "Familias asistidas",
      nameLocation: "middle",
      nameGap: 70,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    series: [
      {
        data: ayudas,
        type: "bar",
        color: "#ff8100",
        barWidth: 16,
        label: {
          show: true,
          position: "top",
          fontWeight: "bold",
          fontSize: 8,
          formatter: (params: any) => {
            const percent =
              sumaTotal > 0
                ? ((params.value / sumaTotal) * 100).toFixed(1)
                : "0.0";
            return `${percent}%`;
          },
        },
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Asistencias_por_evento",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 2 }}>
      <ReactECharts
        option={option}
        style={{ height: CHART_H, width: "100%" }}
        opts={{ renderer: "canvas", devicePixelRatio: 2 }}
      />
    </div>
  );
}
