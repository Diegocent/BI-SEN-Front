import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Database, Users, MapPin, UserRound, User, Landmark } from "lucide-react";
import { MapaParaguay } from "../../mapa-paraguay";
import { DataTable } from "../../data-table";
import {
  useResumenGeneralQuery,
  useAsistenciaDetalladaQuery,
} from "../../../api";
import { useEffect, useState } from "react";
import GraficoDistribucionAyudasPorDepartamento from "../../grafico-distribucion-ayudas-departamento";
import GraficoPieEventos from "../../grafico-pie-eventos";
import GraficoTendenciaMensual from "../../grafico-tendencia-mensual";
import { imprimirTablaPDF } from "@/lib/pdfUtils";
import { columnasRegistros, columnasReportes } from "./constants/constants";
import VisualizarDetallesGenericos from "@/components/VisualizarDetallesGenericos";
import GraficoAnualAyudas from "@/components/grafico-anual-ayudas";
import GraficoPieCaracterizacion from "@/components/grafico-pie-caracterizacion";
import { SectionShell } from "@/components/layout/section-shell";

type ResumenGeneralData = {
  cantidad_departamentos: number;
  cantidad_kit_evento: number;
  cantidad_registros_total: number;
  cantidad_familias_asistidas: number;
  cantidad_mujeres: number;
  cantidad_hombres: number;
  cantidad_otro: number;
  cantidad_indigena: number;
  cantidad_no_indigena: number;
};

export function ResumenGeneral() {
  // Estado para filtros, página y fechas globales
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });

  const [vista, setVista] = useState("indicadores");

  // Construir parámetros para la consulta, incluyendo el rango de fechas
  const { page, ...filtersWithoutPage } = filters;
  const pageParam = pageUrl
    ? { page: pageUrl.includes("page=") ? pageUrl.split("page=").pop() : "1" }
    : { page: "1" };
  const dateParams =
    dateRange.startDate && dateRange.endDate
      ? { fecha_desde: dateRange.startDate, fecha_hasta: dateRange.endDate }
      : {};
  const queryParams = { ...filtersWithoutPage, ...pageParam, ...dateParams };
  const [pdfParam, setPdfParam] = useState({});

  useEffect(() => {
    let dataParams = {};
    if (dateRange.startDate && dateRange.endDate) {
      dataParams = {
        fecha_desde: dateRange.startDate,
        fecha_hasta: dateRange.endDate,
      };
    }
    if (filtersWithoutPage) {
      dataParams = { ...filtersWithoutPage, ...dataParams };
    }
    setPdfParam(dataParams);
  }, [filters, dateRange]);

  // Consulta con filtros y página y fechas
  const {
    data: registrosRecientes,
    // error: errorAsistencia,
    // isLoading: isLoadingAsistencia,
  } = useAsistenciaDetalladaQuery(queryParams) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };
  // Hook de RTK Query para el endpoint resumen-general
  const {
    data,
    // error,
    // isLoading
  } = useResumenGeneralQuery(dateParams) as {
    data: ResumenGeneralData | undefined;
    error: any;
    isLoading: boolean;
  };
  const [cardsResumen, setCardsResumen] = useState<ResumenGeneralData>({
    cantidad_departamentos: 0,
    cantidad_kit_evento: 0,
    cantidad_registros_total: 0,
    cantidad_familias_asistidas: 0,
    cantidad_mujeres: 0,
    cantidad_hombres: 0,
    cantidad_otro: 0,
    cantidad_indigena: 0,
    cantidad_no_indigena: 0,
  });

  const handleImprimirPDF = () => {
    imprimirTablaPDF({
      controller: "detallada",
      params: pdfParam,
      perPage: registrosRecientes?.count || 10,
      columns: columnasReportes,
      title: "Resumen General",
    });
  };

  useEffect(() => {
    if (data) {
      setCardsResumen({
        cantidad_departamentos: data.cantidad_departamentos || 0,
        cantidad_kit_evento: data.cantidad_kit_evento || 0,
        cantidad_registros_total: data.cantidad_registros_total || 0,
        cantidad_familias_asistidas: data.cantidad_familias_asistidas || 0,
        cantidad_mujeres: data.cantidad_mujeres || 0,
        cantidad_hombres: data.cantidad_hombres || 0,
        cantidad_otro: data.cantidad_otro || 0,
        cantidad_indigena: data.cantidad_indigena || 0,
        cantidad_no_indigena: data.cantidad_no_indigena || 0,
      });
    }
  }, [data]);

  const kpis = [
    {
      icon: Database,
      title: "Datos registrados",
      value: cardsResumen.cantidad_registros_total || 0,
      hint: "Titulares compactados",
    },
    {
      icon: Users,
      title: "Familias asistidas",
      value: cardsResumen.cantidad_familias_asistidas || 0,
      hint: "Familias beneficiadas",
    },
    {
      icon: MapPin,
      title: "Departamentos",
      value: cardsResumen.cantidad_departamentos || 0,
      hint: "Departamentos únicos",
    },
    {
      icon: UserRound,
      title: "Mujeres",
      value: cardsResumen.cantidad_mujeres || 0,
      hint: "Titulares de sexo femenino",
    },
    {
      icon: User,
      title: "Hombres",
      value: cardsResumen.cantidad_hombres || 0,
      hint: "Titulares de sexo masculino",
    },
    {
      icon: Landmark,
      title: "Población indígena",
      value: cardsResumen.cantidad_indigena || 0,
      hint: `${cardsResumen.cantidad_no_indigena || 0} no indígena`,
    },
  ];

  return (
    <SectionShell
      title="Resumen General"
      description="Vista general de los datos de asistencia humanitaria"
      dateRange={dateRange}
      onDateChange={setDateRange}
      tabs={[
        { id: "indicadores", label: "Indicadores" },
        { id: "graficos", label: "Gráficos" },
        { id: "registros", label: "Registros" },
      ]}
      activeTab={vista}
      onTabChange={setVista}
    >
      {vista === "indicadores" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card
                  key={kpi.title}
                  className="bg-white border border-primary-dark/50 text-primary-dark py-3 gap-2"
                >
                  <CardHeader className="flex flex-row items-center gap-2 px-3 py-0">
                    <Icon className="h-4 w-4 shrink-0" />
                    <CardTitle className="text-xs font-semibold leading-tight">
                      {kpi.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3">
                    <p className="text-xl font-bold leading-none">{kpi.value}</p>
                    <p className="text-[11px] text-primary-dark/70 mt-1">
                      {kpi.hint}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Sexo del titular</CardTitle>
                <CardDescription>
                  Familias según sexo informado en los consolidados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoPieCaracterizacion
                  titulo="Sexo"
                  datos={[
                    { name: "Mujeres", value: cardsResumen.cantidad_mujeres },
                    { name: "Hombres", value: cardsResumen.cantidad_hombres },
                    { name: "Otro", value: cardsResumen.cantidad_otro },
                    {
                      name: "No informado",
                      value: Math.max(
                        0,
                        cardsResumen.cantidad_familias_asistidas -
                          cardsResumen.cantidad_mujeres -
                          cardsResumen.cantidad_hombres -
                          cardsResumen.cantidad_otro
                      ),
                    },
                  ]}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Tipo de población</CardTitle>
                <CardDescription>
                  Indígena / no indígena. La zona rural o urbana no viene en
                  estas planillas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoPieCaracterizacion
                  titulo="Población"
                  datos={[
                    {
                      name: "Indígena",
                      value: cardsResumen.cantidad_indigena,
                    },
                    {
                      name: "No indígena",
                      value: cardsResumen.cantidad_no_indigena,
                    },
                    {
                      name: "No informado",
                      value: Math.max(
                        0,
                        cardsResumen.cantidad_familias_asistidas -
                          cardsResumen.cantidad_indigena -
                          cardsResumen.cantidad_no_indigena
                      ),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
          <MapaParaguay
            fecha_inicio={dateRange.startDate}
            fecha_fin={dateRange.endDate}
          />
        </div>
      )}

      {vista === "graficos" && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Distribución por Tipo de Evento
              </CardTitle>
              <CardDescription>
                Familias asistidas por tipo de evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoPieEventos
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">
                  Distribución de asistencias por año
                </CardTitle>
                <CardDescription>
                  Unidades distribuidas por producto y por año
                </CardDescription>
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
                <CardTitle className="text-info">
                  Distribución de asistencias por departamento
                </CardTitle>
                <CardDescription>
                  Unidades distribuidas por producto y por departamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoDistribucionAyudasPorDepartamento
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-success">Tendencias temporales</CardTitle>
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
        </div>
      )}

      {vista === "registros" && (
        <div className="overflow-x-auto w-full">
          <DataTable
            title="Registros Recientes"
            subtitle="Lista de los registros de asistencia más recientes"
            data={
              registrosRecientes || {
                count: 0,
                next: null,
                previous: null,
                results: [],
              }
            }
            columns={columnasRegistros}
            onViewDetails={VisualizarDetallesGenericos}
            itemsPerPage={10}
            onPageChange={setPageUrl}
            filters={filters}
            setFilters={setFilters}
            handleImprimir={handleImprimirPDF}
            maxHeight="calc(100dvh - 14rem)"
          />
        </div>
      )}
    </SectionShell>
  );
}
