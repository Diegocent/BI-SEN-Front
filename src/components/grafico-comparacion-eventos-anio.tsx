import ReactECharts from "echarts-for-react";
import { useOcurrenciasEventoAnualQuery } from "@/api";
import { CHART_H } from "@/lib/chartSize";

export default function GraficoComparacionEventosAnio({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, isError } = useOcurrenciasEventoAnualQuery({
    per_page: 500,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Obtener años y eventos únicos
  const anios = Array.from(
    new Set(results.map((item: any) => item.anio))
  ).sort();
  const eventos = Array.from(new Set(results.map((item: any) => item.evento)));

  // Construir series agrupadas por evento
  const series = eventos.map((evento) => ({
    name: evento,
    type: "bar",
    stack: undefined, // barras agrupadas
    data: anios.map((anio) => {
      const found = results.find(
        (item: any) => item.anio === anio && item.evento === evento
      );
      return found ? found.cantidad_familias_asistidas || 0 : 0;
    }),
    label: { show: false },
  }));

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
      bottom: 0,
      textStyle: { fontSize: 10 },
      icon: "roundRect",
      itemWidth: 18,
      itemHeight: 12,
    },
    grid: { left: 25, right: 20, bottom: 80, top: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: anios,
      name: "Año",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "value",
      name: "Familias asistidas",
      nameLocation: "middle",
      nameGap: 45,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    series,
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Comparacion_eventos_anio",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 0 }}>
      <ReactECharts
        option={option}
        style={{ height: CHART_H }}
        opts={{ renderer: "canvas", devicePixelRatio: 2 }}
      />
    </div>
  );
}
