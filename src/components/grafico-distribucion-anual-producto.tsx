import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { useDistribucionAnualProductoQuery } from "@/api";
import { CHART_H } from "@/lib/chartSize";

const productos = [
  { key: "kit_sentencia", label: "Kit sentencia" },
  { key: "kit_evento", label: "Kit evento" },
  { key: "chapa_fibrocemento", label: "Chapa fibrocemento" },
  { key: "chapa_zinc", label: "Chapa zinc" },
  { key: "colchones", label: "Colchones" },
  { key: "frazadas", label: "Frazadas" },
  { key: "terciadas", label: "Terciadas" },
  { key: "puntales", label: "Puntales" },
  { key: "carpas_plasticas", label: "Carpas plásticas" },
];

export default function GraficoDistribucionAnualProducto({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const [producto, setProducto] = useState(productos[0].key);
  const { data, isLoading, error } = useDistribucionAnualProductoQuery({
    producto,
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (error) return <div>Error al cargar datos</div>;

  // Si la API devuelve un array plano, no un objeto con results
  const results = Array.isArray(data) ? data : data?.results || [];
  const anios = results.map((item: any) => item.anio);
  const valores = results.map((item: any) => item.unidades_distribuidas || 0);

  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 40, right: 20, bottom: 50, top: 50, containLabel: true },
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
      name: "Unidades distribuidas",
      nameLocation: "middle",
      nameGap: 55,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    series: [
      {
        data: valores,
        type: "bar",
        color: "#6366f1",
        barWidth: 32,
        label: {
          show: true,
          position: "top",
          fontWeight: "bold",
          fontSize: 12,
        },
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: `Distribucion_anual_${producto}`,
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 8 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Producto:</label>
        <select value={producto} onChange={(e) => setProducto(e.target.value)}>
          {productos.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <h3 style={{ marginBottom: 8 }}>
        Distribución anual de {productos.find((p) => p.key === producto)?.label}
      </h3>
      <ReactECharts option={option} style={{ height: CHART_H }} />
    </div>
  );
}
