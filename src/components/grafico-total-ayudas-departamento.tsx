import React, { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { useGetPorDepartamentoQuery } from "../api/geografica/geograficaApi";
import { CHART_H } from "@/lib/chartSize";

export default function GraficoTotalAyudasPorDepartamento({
  fecha_inicio = "",
  fecha_fin = "",
  setTopDepartamento,
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
  setTopDepartamento?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data, isLoading, isError } = useGetPorDepartamentoQuery({
    per_page: 50,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  const results = Array.isArray(data) ? data : data?.results || [];

  useEffect(() => {
    if (setTopDepartamento && results.length > 0) {
      const top = results.reduce((max: any, d: any) =>
        (d.cantidad_familias_asistidas || 0) >
        (max.cantidad_familias_asistidas || 0)
          ? d
          : max
      );
      setTopDepartamento(top.departamento);
    }
  }, [results, setTopDepartamento]);

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  const departamentos = results.map((d: any) => d.departamento);
  const familias = results.map(
    (d: any) => d.cantidad_familias_asistidas || 0
  );
  const sumaTotal = familias.reduce((a: number, b: number) => a + b, 0);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = params[0];
        const porcentaje = sumaTotal
          ? ((p.data / sumaTotal) * 100).toFixed(1)
          : 0;
        return `${p.axisValue}<br/>Familias asistidas: <b>${p.data}</b><br/>Porcentaje: <b>${porcentaje}%</b>`;
      },
    },
    xAxis: {
      type: "category",
      data: departamentos,
      axisLabel: { rotate: 30, fontSize: 12 },
      nameLocation: "middle",
      name: "Departamentos",
      nameGap: 65,
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "value",
      name: "Familias asistidas",
      nameLocation: "middle",
      nameGap: 75,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    series: [
      {
        data: familias,
        type: "bar",
        color: "#6c71d5",
        barWidth: 24,
        label: {
          show: true,
          position: "top",
          fontWeight: "bold",
          formatter: function (params: any) {
            const porcentaje = sumaTotal
              ? ((params.data / sumaTotal) * 100).toFixed(1)
              : 0;
            return `${porcentaje}%`;
          },
        },
      },
    ],
    grid: { left: "5%", right: "4%", bottom: "10%", containLabel: true },
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Total_asistencias_por_departamento",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 0 }}>
      <ReactECharts option={option} style={{ height: CHART_H }} />
    </div>
  );
}
