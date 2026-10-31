import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { DataTable } from "../../data-table";
import {
  useGetPorDepartamentoQuery,
  useGetPorUbicacionQuery,
  useGetCantidadDistritosQuery,
} from "@/api";
import GraficoTotalAyudasPorDepartamento from "../../grafico-total-ayudas-departamento";
import GraficoTopLocalidades from "../../grafico-top-localidades";
import GraficoEvolucionAyudasTopDepartamentos from "../../grafico-evolucion-ayudas-top-departamentos";
import HeatmapDepartamentoAnio from "../../heatmap-departamento-anio";
import { useState, useEffect } from "react";
import { imprimirTablaPDF } from "@/lib/pdfUtils";
import {
  columnasDepartamentos,
  columnasDistritos,
  columnasDepartamentosPDF,
  columnasDistritosPDF,
} from "./constants/constants";
import VisualizarDetallesGenericos from "@/components/VisualizarDetallesGenericos";
import { SectionShell } from "@/components/layout/section-shell";
export function AnalisisGeografico() {
  // Filtro global de fechas
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });

  // Estado para filtros y página para departamentos
  const [filtersDepto, setFiltersDepto] = useState<Record<string, any>>({});
  const [pageUrlDepto, setPageUrlDepto] = useState<string | null>(null);
  const { page: pageDepto, ...filtersDeptoWithoutPage } = filtersDepto;
  const parsePageFromUrl = (u: string | null) => {
    if (!u) return { page: "1" };
    try {
      // Use URL parsing to safely extract the 'page' param
      const urlObj = new URL(u, window.location.origin);
      const p = urlObj.searchParams.get("page") || "1";
      return { page: p };
    } catch (e) {
      // Fallback: keep previous simple parse but strip other params
      if (u.includes("page=")) {
        const after = u.split("page=").pop() || "1";
        return { page: after.split("&")[0] };
      }
      return { page: "1" };
    }
  };
  const pageParamDepto = parsePageFromUrl(pageUrlDepto);
  const dateParams =
    dateRange.startDate && dateRange.endDate
      ? { fecha_desde: dateRange.startDate, fecha_hasta: dateRange.endDate }
      : {};
  const queryParamsDepto = {
    ...filtersDeptoWithoutPage,
    ...pageParamDepto,
    ...dateParams,
  };

  // Estado para filtros y página para distritos
  const [filtersDistrito, setFiltersDistrito] = useState<Record<string, any>>(
    {}
  );
  const [pageUrlDistrito, setPageUrlDistrito] = useState<string | null>(null);
  const { page: pageDistrito, ...filtersDistritoWithoutPage } = filtersDistrito;
  const pageParamDistrito = parsePageFromUrl(pageUrlDistrito);
  const queryParamsDistrito = {
    ...filtersDistritoWithoutPage,
    ...pageParamDistrito,
    ...dateParams,
  };
  // PDF params y handlers para DEPARTAMENTOS
  const [pdfParamDepto, setPdfParamDepto] = useState({});
  useEffect(() => {
    setPdfParamDepto({ ...filtersDeptoWithoutPage, ...dateParams });
  }, [filtersDepto, dateRange]);

  const handleImprimirPDFDepto = () => {
    imprimirTablaPDF({
      controller: "por-departamento",
      params: pdfParamDepto,
      perPage: dataDepartamento?.count || 10,
      columns: columnasDepartamentosPDF,
      title: "Resumen por Departamento",
    });
  };

  // PDF params y handlers para DISTRITOS
  const [pdfParamDistrito, setPdfParamDistrito] = useState({});
  useEffect(() => {
    setPdfParamDistrito({ ...filtersDistritoWithoutPage, ...dateParams });
  }, [filtersDistrito, dateRange]);

  const handleImprimirPDFDistrito = () => {
    imprimirTablaPDF({
      controller: "por-ubicacion",
      params: pdfParamDistrito,
      perPage: dataDistrito?.count || 10,
      columns: columnasDistritosPDF,
      title: "Resumen por Distrito",
    });
  };

  // Paginación para distritos
  const {
    data: dataDistrito,
    // error: errorDistrito,
    // isLoading: isLoadingDistrito,
  } = useGetPorUbicacionQuery(queryParamsDistrito) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Paginación para departamentos
  const {
    data: dataDepartamento,
    // error: errorDepartamento,
    // isLoading: isLoadingDepartamento,
  } = useGetPorDepartamentoQuery(queryParamsDepto) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };
  const [vista, setVista] = useState("indicadores");
  const [topDepartamentoChart, setTopDepartamento] = useState("");
  const topDepartamento =
    topDepartamentoChart ||
    [...(dataDepartamento?.results ?? [])].sort(
      (a: any, b: any) =>
        (b.cantidad_familias_asistidas || 0) -
        (a.cantidad_familias_asistidas || 0)
    )[0]?.departamento ||
    "";
  const { data: cantidadDistritosData } = useGetCantidadDistritosQuery(
    dateParams
  );

  return (
    <SectionShell
      title="Análisis Geográfico"
      description="Distribución geográfica de la asistencia humanitaria"
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
          <div className="grid md:grid-cols-3 gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-dark text-sm">
                  Departamentos atendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary-dark">
                  {dataDepartamento?.count || 0}
                </p>
                <p className="text-xs text-muted-foreground">De 18 departamentos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-dark text-sm">
                  Distritos cubiertos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary-dark">
                  {cantidadDistritosData?.distritos_asistidos ??
                    dataDistrito?.count ??
                    0}
                </p>
                <p className="text-xs text-muted-foreground">
                  Distritos con asistencia
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-dark text-sm">
                  Departamento más asistido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-primary-dark truncate">
                  {topDepartamento || "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Más familias asistidas
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Total de asistencias por departamento
              </CardTitle>
              <CardDescription>
                Familias asistidas por departamento en el rango seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoTotalAyudasPorDepartamento
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
                setTopDepartamento={setTopDepartamento}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {vista === "graficos" && (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">
                  Localidades con más familias asistidas
                </CardTitle>
                <CardDescription>
                  Localidades con más familias asistidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoTopLocalidades
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-info">
                  Evolución de asistencias por año
                </CardTitle>
                <CardDescription>
                  Los 5 departamentos con más familias asistidas, por año
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoEvolucionAyudasTopDepartamentos
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-success">
                Mapa de calor de departamentos por año
              </CardTitle>
              <CardDescription>
                Familias asistidas según año y departamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeatmapDepartamentoAnio
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {vista === "tablas" && (
        <div className="space-y-4">
          <div className="overflow-x-auto w-full">
            <DataTable
              data={
                dataDepartamento || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasDepartamentos}
              title="Resumen por Departamento"
              subtitle="Datos consolidados de asistencia humanitaria por departamento"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlDepto}
              filters={filtersDepto}
              setFilters={setFiltersDepto}
              handleImprimir={handleImprimirPDFDepto}
              maxHeight="calc(100dvh - 16rem)"
            />
          </div>
          <div className="overflow-x-auto w-full">
            <DataTable
              data={
                dataDistrito || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasDistritos}
              title="Resumen por Distrito"
              subtitle="Datos detallados de asistencia humanitaria por distrito"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlDistrito}
              filters={filtersDistrito}
              setFilters={setFiltersDistrito}
              handleImprimir={handleImprimirPDFDistrito}
              maxHeight="calc(100dvh - 16rem)"
            />
          </div>
        </div>
      )}
    </SectionShell>
  );
}
