import React from "react";
import ReactECharts from "echarts-for-react";
import { CHART_H } from "@/lib/chartSize";
import { useGetMensualQuery } from "@/api";

const monthLabels = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

interface GraficoMensualProps {
  fecha_inicio?: string;
  fecha_fin?: string;
  setPicoMaximo?: (value: { mes: string; anio: number; valor: number }) => void;
  setTendencia?: (value: {
    crecimiento: number;
    direccion: "ascendente" | "descendente" | "estable";
  }) => void;
  setPromedio?: (value: number) => void;
  setVariabilidad?: (value: number) => void;
}

export default function GraficoMensual({
  fecha_inicio = "",
  fecha_fin = "",
  setPicoMaximo,
  setTendencia,
  setPromedio,
  setVariabilidad,
}: GraficoMensualProps) {
  const { data, isLoading, isError } = useGetMensualQuery({
    per_page: 200,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  // Efecto para calcular y enviar las métricas cuando los datos cambian
  React.useEffect(() => {
    if (data?.results && data.results.length > 0) {
      const results = data.results;

      // 1. Pico Máximo - Mes con mayor unidades distribuidas
        const picoMaximo = results.reduce((max: any, item: any) => {
        return (item.cantidad_familias_asistidas || 0) >
          (max.cantidad_familias_asistidas || 0)
          ? item
          : max;
      }, results[0]);

      setPicoMaximo?.({
        mes: picoMaximo.nombre_mes,
        anio: picoMaximo.anio,
        valor: picoMaximo.cantidad_familias_asistidas || 0,
      });

      // 3. Tendencia - Crecimiento anual (versión mejorada con regresión lineal)
      const datosPorAnio: Record<number, number> = {};
      results.forEach((item: any) => {
        if (!datosPorAnio[item.anio]) {
          datosPorAnio[item.anio] = 0;
        }
        datosPorAnio[item.anio] += item.cantidad_familias_asistidas || 0;
      });

      const anos = Object.keys(datosPorAnio).map(Number).sort();
      let crecimiento = 0;
      let direccion: "ascendente" | "descendente" | "estable" = "estable";

      if (anos.length >= 2) {
        // Calcular tendencia usando regresión lineal simple
        let sumX = 0,
          sumY = 0,
          sumXY = 0,
          sumX2 = 0;
        const n = anos.length;

        anos.forEach((ano, index) => {
          const x = index; // Posición temporal (0, 1, 2, ...)
          const y = datosPorAnio[ano]; // Valor del año
          sumX += x;
          sumY += y;
          sumXY += x * y;
          sumX2 += x * x;
        });

        // Fórmula de la pendiente en regresión lineal: m = (n*ΣXY - ΣX*ΣY) / (n*ΣX² - (ΣX)²)
        const pendiente = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

        // Calcular el promedio de Y para obtener crecimiento porcentual
        const promedioY = sumY / n;
        const crecimientoPorcentual =
          promedioY !== 0 ? (pendiente / promedioY) * 100 : 0;

        direccion =
          pendiente > 0
            ? "ascendente"
            : pendiente < 0
            ? "descendente"
            : "estable";
        crecimiento = Math.round(crecimientoPorcentual * 100) / 100;
      }

      setTendencia?.({
        crecimiento: crecimiento,
        direccion,
      });

      // 4. Promedio - Eventos por mes (usando unidades_distribuidas como proxy de "eventos")
      const promedio =
        results.reduce(
          (sum: number, item: any) =>
            sum + (item.cantidad_familias_asistidas || 0),
          0
        ) / results.length;
      setPromedio?.(Math.round(promedio * 100) / 100);

      const media = promedio;
      const sumaCuadrados = results.reduce((sum: number, item: any) => {
        return (
          sum +
          Math.pow((item.cantidad_familias_asistidas || 0) - media, 2)
        );
      }, 0);
      const desviacionEstandar = Math.sqrt(sumaCuadrados / results.length);
      setVariabilidad?.(Math.round(desviacionEstandar * 100) / 100);
    }
  }, [data]); // <-- Solo depende de data

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError) return <div>Error al cargar datos</div>;

  const results = data?.results || [];

  if (results.length === 0) {
    return <div>No hay datos para el período seleccionado</div>;
  }

  // Agrupar por año y mes usando SOLO los datos recibidos del query
  const grouped: Record<string, number[]> = {};

  results.forEach((item: any) => {
    const year = item.anio;
    const monthIdx = item.mes - 1;

    if (!grouped[year]) {
      grouped[year] = Array(12).fill(0);
    }

    grouped[year][monthIdx] = item.cantidad_familias_asistidas || 0;
  });

  const availableYears = Object.keys(grouped);

  const series = availableYears.map((year) => ({
    name: year,
    type: "bar",
    stack: "total",
    data: grouped[year],
    label: {
      show: false,
      position: "top",
      fontSize: 10,
    },
  }));

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
      bottom: 0,
      textStyle: { fontSize: 10 },
      icon: "roundRect",
      itemWidth: 18,
      itemHeight: 12,
      data: availableYears,
    },
    grid: { left: 40, right: 20, bottom: 50, top: 30, containLabel: true },
    xAxis: {
      type: "category",
      data: monthLabels,
      name: "Mes",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: { fontSize: 12, rotate: 0 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "value",
      name: "Familias asistidas",
      nameLocation: "middle",
      nameGap: 65,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    series,
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Asistencias_mensuales",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 8 }}>
      <ReactECharts
        option={option}
        style={{ height: CHART_H }}
        opts={{ devicePixelRatio: 2 }}
      />
    </div>
  );
}
