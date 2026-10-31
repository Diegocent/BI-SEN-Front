import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { DataTable } from "../../data-table";
import { useGetAnualQuery, useGetMensualQuery } from "@/api";
import GraficoMensual from "../../grafico-mensual-ayudas";
import GraficoAnualAyudas from "../../grafico-anual-ayudas";
import GraficoDistribucionAnualProducto from "../../grafico-distribucion-anual-producto";
import GraficoTendenciaMensual from "../../grafico-tendencia-mensual";
import { useState, useEffect } from "react";
import { imprimirTablaPDF } from "@/lib/pdfUtils";
import {
  columnasAnual,
  columnasMensual,
  columnasAnualPDF,
  columnasMensualPDF,
} from "./constants/constants";
import VisualizarDetallesGenericos from "@/components/VisualizarDetallesGenericos";
import { SectionShell } from "@/components/layout/section-shell";

interface MetricasTemporales {
  picoMaximo: { mes: string; anio: number; valor: number } | null;
  tendencia: {
    crecimiento: number;
    direccion: "ascendente" | "descendente" | "estable";
  } | null;
  promedio: number | null;
  variabilidad: number | null;
}

export function AnalisisTemporal() {
  // Filtro global de fechas
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });

  // Estado para las métricas
  const [metricas, setMetricas] = useState<MetricasTemporales>({
    picoMaximo: null,
    tendencia: null,
    promedio: null,
    variabilidad: null,
  });

  // Estado para filtros y página para anual
  const [filtersAnual, setFiltersAnual] = useState<Record<string, any>>({});
  const [pageUrlAnual, setPageUrlAnual] = useState<string | null>(null);
  const { page: pageAnual, ...filtersAnualWithoutPage } = filtersAnual;
  const pageParamAnual = pageUrlAnual
    ? {
        page: pageUrlAnual.includes("page=")
          ? pageUrlAnual.split("page=").pop()
          : "1",
      }
    : { page: "1" };
  const dateParams =
    dateRange.startDate && dateRange.endDate
      ? { fecha_desde: dateRange.startDate, fecha_hasta: dateRange.endDate }
      : {};
  const queryParamsAnual = {
    ...filtersAnualWithoutPage,
    ...pageParamAnual,
    ...dateParams,
  };

  // Estado para filtros y página para mensual
  const [filtersMensual, setFiltersMensual] = useState<Record<string, any>>({});
  const [pageUrlMensual, setPageUrlMensual] = useState<string | null>(null);
  const { page: pageMensual, ...filtersMensualWithoutPage } = filtersMensual;
  const pageParamMensual = pageUrlMensual
    ? {
        page: pageUrlMensual.includes("page=")
          ? pageUrlMensual.split("page=").pop()
          : "1",
      }
    : { page: "1" };
  const queryParamsMensual = {
    ...filtersMensualWithoutPage,
    ...pageParamMensual,
    ...dateParams,
  };

  // PDF params y handlers para ANUAL
  const [pdfParamAnual, setPdfParamAnual] = useState({});
  useEffect(() => {
    setPdfParamAnual({ ...filtersAnualWithoutPage, ...dateParams });
  }, [filtersAnual, dateRange]);

  const handleImprimirPDFAnual = () => {
    imprimirTablaPDF({
      controller: "anual",
      params: pdfParamAnual,
      perPage: dataAnual?.count || 10,
      columns: columnasAnualPDF,
      title: "Resumen Anual",
    });
  };

  // PDF params y handlers para MENSUAL
  const [pdfParamMensual, setPdfParamMensual] = useState({});
  useEffect(() => {
    setPdfParamMensual({ ...filtersMensualWithoutPage, ...dateParams });
  }, [filtersMensual, dateRange]);

  const handleImprimirPDFMensual = () => {
    imprimirTablaPDF({
      controller: "mensual",
      params: pdfParamMensual,
      perPage: dataMensual?.count || 10,
      columns: columnasMensualPDF,
      title: "Detalle Mensual",
    });
  };

  // Paginación para anual
  const {
    data: dataAnual,
    // error: errorAnual,
    // isLoading: isLoadingAnual,
  } = useGetAnualQuery(queryParamsAnual) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Paginación para mensual
  const {
    data: dataMensual,
    // error: errorMensual,
    // isLoading: isLoadingMensual,
  } = useGetMensualQuery(queryParamsMensual) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Función para formatear números grandes
  const formatNumber = (num: number | null): string => {
    if (num === null) return "-";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  // Función para obtener el color según la dirección de la tendencia
  const getTendenciaColor = (direccion: string) => {
    switch (direccion) {
      case "ascendente":
        return "text-success";
      case "descendente":
        return "text-danger";
      default:
        return "text-warning";
    }
  };

  // Función para obtener el ícono de tendencia
  const getTendenciaIcono = (direccion: string) => {
    switch (direccion) {
      case "ascendente":
        return "â†—";
      case "descendente":
        return "â†˜";
      default:
        return "â†’";
    }
  };

  const [vista, setVista] = useState("indicadores");

  return (
    <SectionShell
      title="Análisis Temporal"
      description="Evolución temporal de los datos de asistencia humanitaria"
      dateRange={dateRange}
      onDateChange={setDateRange}
      tabs={[
        { id: "indicadores", label: "Indicadores" },
        { id: "graficos", label: "Gráficos" },
        { id: "tablas", label: "Tablas" },
      ]}
      activeTab={vista}
      onTabChange={setVista}
    >
      {vista === "indicadores" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-warning text-sm">Pico máximo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-warning">
                  {metricas.picoMaximo
                    ? formatNumber(metricas.picoMaximo.valor)
                    : "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metricas.picoMaximo
                    ? `${metricas.picoMaximo.mes} ${metricas.picoMaximo.anio}`
                    : "Mes con más familias"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-success text-sm">Tendencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-xl font-bold ${
                    metricas.tendencia
                      ? getTendenciaColor(metricas.tendencia.direccion)
                      : "text-success"
                  }`}
                >
                  {metricas.tendencia
                    ? `${getTendenciaIcono(metricas.tendencia.direccion)} ${
                        metricas.tendencia.crecimiento
                      }%`
                    : "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metricas.tendencia
                    ? `Crecimiento ${metricas.tendencia.direccion}`
                    : "Crecimiento anual"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-info text-sm">Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-info">
                  {metricas.promedio ? formatNumber(metricas.promedio) : "-"}
                </p>
                <p className="text-xs text-muted-foreground">Familias por mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-danger text-sm">Variabilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-danger">
                  {metricas.variabilidad
                    ? formatNumber(metricas.variabilidad)
                    : "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Desviación estándar
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-info">Análisis por mes</CardTitle>
              <CardDescription>Patrones estacionales</CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoMensual
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
                setPicoMaximo={(value) =>
                  setMetricas((prev) => ({ ...prev, picoMaximo: value }))
                }
                setTendencia={(value) =>
                  setMetricas((prev) => ({ ...prev, tendencia: value }))
                }
                setPromedio={(value) =>
                  setMetricas((prev) => ({ ...prev, promedio: value }))
                }
                setVariabilidad={(value) =>
                  setMetricas((prev) => ({ ...prev, variabilidad: value }))
                }
              />
            </CardContent>
          </Card>
        </div>
      )}

      {vista === "graficos" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Tendencias temporales</CardTitle>
              <CardDescription>
                Evolución de la asistencia humanitaria a lo largo del tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoTendenciaMensual
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Análisis por año</CardTitle>
                <CardDescription>Distribución anual de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoAnualAyudas
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-success">
                  Distribución anual de asistencia principal
                </CardTitle>
                <CardDescription>
                  Selecciona el producto para ver su evolución anual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoDistribucionAnualProducto
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {vista === "tablas" && (
        <div className="space-y-4">
          <div className="overflow-x-auto w-full">
            <DataTable
              data={
                dataAnual || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasAnual}
              title="Resumen Anual"
              subtitle="Datos consolidados de asistencia humanitaria por año"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlAnual}
              filters={filtersAnual}
              setFilters={setFiltersAnual}
              handleImprimir={handleImprimirPDFAnual}
              maxHeight="calc(100dvh - 16rem)"
            />
          </div>
          <div className="overflow-x-auto w-full">
            <DataTable
              data={
                dataMensual || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasMensual}
              title="Detalle Mensual"
              subtitle="Datos detallados de asistencia humanitaria por mes"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlMensual}
              filters={filtersMensual}
              setFilters={setFiltersMensual}
              handleImprimir={handleImprimirPDFMensual}
              maxHeight="calc(100dvh - 16rem)"
            />
          </div>
        </div>
      )}
    </SectionShell>
  );
}
