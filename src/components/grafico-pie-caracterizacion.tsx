import ReactECharts from "echarts-for-react";
import { CHART_H } from "@/lib/chartSize";

interface Sector {
  name: string;
  value: number;
}

interface Props {
  titulo: string;
  datos: Sector[];
  height?: number | string;
}

export default function GraficoPieCaracterizacion({
  titulo,
  datos,
  height = CHART_H,
}: Props) {
  const pieData = datos.filter((item) => item.value > 0);

  if (pieData.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Sin datos informados en el rango seleccionado
      </p>
    );
  }

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: 10,
      textStyle: { fontSize: 13 },
      icon: "circle",
    },
    color: ["#5470C6", "#EE6666", "#73C0DE", "#FAC858", "#9A60B4"],
    series: [
      {
        name: titulo,
        type: "pie",
        radius: "58%",
        data: pieData,
        label: {
          show: true,
          formatter: "{b}: {d}%",
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height, width: "100%" }} />;
}
