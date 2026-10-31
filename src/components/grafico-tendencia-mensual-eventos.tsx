import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { useTendenciaMensualAsistenciasQuery } from "@/api";
import { CHART_H } from "@/lib/chartSize";

const eventos = [
  "EXTREMA VULNERABILIDAD",
  "TORMENTA SEVERA",
  "INUNDACION",
  "SEQUIA",
  "COVID",
  "OTROS",
  "C.I.D.H.",
  "INCENDIO",
  "OPERATIVO JAHO'I",
  "OLLA POPULAR",
];

export default function GraficoTendenciaMensualEventos({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const [evento, setEvento] = useState(eventos[0]);
  const { data, isLoading, isError } = useTendenciaMensualAsistenciasQuery({
    per_page: 100,
    evento,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  const results = Array.isArray(data) ? data : data?.results || [];
  const sorted = [...results].sort((a, b) => {
    if (a.anio !== b.anio) return a.anio - b.anio;
    return (a.mes || 0) - (b.mes || 0);
  });

  const labels = sorted.map((item) => `${item.nombre_mes} ${item.anio}`);
  const valores = sorted.map((item) => item.numero_asistencias || 0);

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
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
      show: false,
      bottom: 10,
      textStyle: { fontSize: 14 },
      icon: "rect",
      itemWidth: 18,
      itemHeight: 12,
    },
    grid: { left: "8%", right: "3%", bottom: 60, top: 30, containLabel: true },
    xAxis: {
      type: "category",
      data: labels,
      name: "Mes",
      nameLocation: "middle",
      nameGap: 109,
      axisLabel: { fontSize: 12, rotate: 45 },
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
    series: [
      {
        data: valores,
        type: "line",
        smooth: true,
        areaStyle: {},
        label: { show: false },
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Tendencia_mensual_eventos",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 0 }}>
      <div style={{ marginBottom: 0 }}>
        <label style={{ marginRight: 8 }}>Evento:</label>
        <select value={evento} onChange={(e) => setEvento(e.target.value)}>
          {eventos.map((ev) => (
            <option key={ev} value={ev}>
              {ev}
            </option>
          ))}
        </select>
      </div>
      <ReactECharts
        option={option}
        style={{ height: CHART_H }}
        opts={{ renderer: "canvas", devicePixelRatio: 2 }}
      />
    </div>
  );
}
