import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { DataTable } from "../../data-table";
import { useGetPorEventoQuery, useEventosPorDepartamentoQuery } from "@/api";
import { useState, useEffect } from "react";
import { imprimirTablaPDF } from "@/lib/pdfUtils";
import GraficoPieEventos from "../../grafico-pie-eventos";
import GraficoAyudasPorEvento from "../../grafico-ayudas-por-evento";
import GraficoComposicionAyudasPorEvento from "../../grafico-composicion-ayudas-por-evento";
import GraficoComparacionEventosAnio from "../../grafico-comparacion-eventos-anio";
import GraficoTendenciaMensualEventos from "../../grafico-tendencia-mensual-eventos";
import {
  columnasTipoEventos,
  columnasEventosDepartamento,
  columnasTipoEventosPDF,
  columnasEventosDepartamentoPDF,
} from "./constants/constants";
import VisualizarDetallesGenericos from "@/components/VisualizarDetallesGenericos";
import { SectionShell } from "@/components/layout/section-shell";

export function AnalisisEventos() {
  // Filtro global de fechas
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });

  // Estado y lógica para filtros y paginación por tipo de evento
  const [filtersEvento, setFiltersEvento] = useState<Record<string, any>>({});
  const [pageUrlEvento, setPageUrlEvento] = useState<string | null>(null);
  const { page: pageEvento, ...filtersEventoWithoutPage } = filtersEvento;
  const pageParamEvento = pageUrlEvento
    ? {
        page: pageUrlEvento.includes("page=")
          ? pageUrlEvento.split("page=").pop()
          : "1",
      }
    : { page: "1" };
  const dateParams =
    dateRange.startDate && dateRange.endDate
      ? { fecha_desde: dateRange.startDate, fecha_hasta: dateRange.endDate }
      : {};
  const queryParamsEvento = {
    ...filtersEventoWithoutPage,
    ...pageParamEvento,
    ...dateParams,
  };

  // Estado y lógica para filtros y paginación por departamento
  const [filtersDepto, setFiltersDepto] = useState<Record<string, any>>({});
  const [pageUrlDepto, setPageUrlDepto] = useState<string | null>(null);
  const { page: pageDepto, ...filtersDeptoWithoutPage } = filtersDepto;
  const pageParamDepto = pageUrlDepto
    ? {
        page: pageUrlDepto.includes("page=")
          ? pageUrlDepto.split("page=").pop()
          : "1",
      }
    : { page: "1" };

  // PDF params y handlers para EVENTOS
  const [pdfParamEvento, setPdfParamEvento] = useState({});
  useEffect(() => {
    setPdfParamEvento({ ...filtersEventoWithoutPage, ...dateParams });
  }, [filtersEvento, dateRange]);

  const handleImprimirPDFEvento = () => {
    imprimirTablaPDF({
      controller: "por-evento",
      params: pdfParamEvento,
      perPage: dataEventos?.count || 10,
      columns: columnasTipoEventosPDF,
      title: "Eventos por Tipo",
    });
  };

  // PDF params y handlers para EVENTOS POR DEPARTAMENTO
  const [pdfParamDepto, setPdfParamDepto] = useState({});
  useEffect(() => {
    setPdfParamDepto({ ...filtersDeptoWithoutPage, ...dateParams });
  }, [filtersDepto, dateRange]);

  const handleImprimirPDFDepto = () => {
    imprimirTablaPDF({
      controller: "eventos-por-departamento",
      params: pdfParamDepto,
      perPage: dataPorDepartamento?.count || 10,
      columns: columnasEventosDepartamentoPDF,
      title: "Eventos por Departamento",
    });
  };
  const queryParamsDepto = {
    ...filtersDeptoWithoutPage,
    ...pageParamDepto,
    ...dateParams,
  };

  // Querys
  const { data: dataEventos } = useGetPorEventoQuery(queryParamsEvento) as {
    data: any | undefined;
  };
  const { data: dataPorDepartamento } = useEventosPorDepartamentoQuery(
    queryParamsDepto
  ) as { data: any | undefined };

  const [inundaciones, setInundaciones] = useState(0);
  const [sequias, setSequias] = useState(0);
  const [incendios, setIncendios] = useState(0);
  const [tormentas, setTormentas] = useState(0);
  const [vista, setVista] = useState("indicadores");

  return (
    <SectionShell
      title="Análisis por Eventos"
      description="Análisis categorizado por tipos de eventos de emergencia"
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
                <CardTitle className="text-info text-sm">Inundaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-info">{inundaciones}</p>
                <p className="text-xs text-muted-foreground">Familias asistidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-warning text-sm">Sequías</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-warning">{sequias}</p>
                <p className="text-xs text-muted-foreground">Familias asistidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-danger text-sm">Incendios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-danger">{incendios}</p>
                <p className="text-xs text-muted-foreground">Familias asistidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-success text-sm">
                  Tormentas severas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-success">{tormentas}</p>
                <p className="text-xs text-muted-foreground">Familias asistidas</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Distribución por tipo de evento
              </CardTitle>
              <CardDescription>
                Familias asistidas por tipo de evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoPieEventos
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
                setInundaciones={setInundaciones}
                setSequias={setSequias}
                setIncendios={setIncendios}
                setTormentas={setTormentas}
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
                  Asistencias según evento
                </CardTitle>
                <CardDescription>
                  Familias asistidas por tipo de evento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoAyudasPorEvento
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-info">
                  Composición de asistencias según evento
                </CardTitle>
                <CardDescription>
                  Productos distribuidos para cada evento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoComposicionAyudasPorEvento
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">
                  Comparación de eventos por año
                </CardTitle>
                <CardDescription>
                  Familias asistidas por tipo de evento y año
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoComparacionEventosAnio
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-info">
                  Tendencia mensual de eventos
                </CardTitle>
                <CardDescription>
                  Tendencia mensual del evento seleccionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoTendenciaMensualEventos
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
                dataEventos || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasTipoEventos}
              title="Resumen por Tipo de Eventos"
              subtitle="Datos consolidados de asistencia humanitaria por tipo de evento"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlEvento}
              filters={filtersEvento}
              setFilters={setFiltersEvento}
              handleImprimir={handleImprimirPDFEvento}
              maxHeight="calc(100dvh - 16rem)"
            />
          </div>
          <div className="overflow-x-auto w-full">
            <DataTable
              data={
                dataPorDepartamento || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasEventosDepartamento}
              title="Eventos por Departamento"
              subtitle="Distribución de eventos de emergencia por departamento"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlDepto}
              filters={filtersDepto}
              setFilters={setFiltersDepto}
              handleImprimir={handleImprimirPDFDepto}
              maxHeight="calc(100dvh - 16rem)"
            />
          </div>
        </div>
      )}
    </SectionShell>
  );
}


