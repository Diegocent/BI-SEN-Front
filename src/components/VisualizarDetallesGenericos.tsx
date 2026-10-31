import { Download } from "lucide-react";
import {
  useGenerarReporteGenerico,
  formatDate,
  formatNumber,
} from "@/hooks/useGenerarReporteGenerico";

const VisualizarDetallesGenericos = (registro: any) => {
  console.log("Registro recibido:", registro);
  if (!registro) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          No hay datos disponibles para mostrar
        </p>
      </div>
    );
  }

  // Calcular total de insumos
  const totalInsumos =
    (registro.kit_sentencia || 0) +
    (registro.kit_evento || 0) +
    (registro.chapa_fibrocemento_cantidad || 0) +
    (registro.chapa_zinc_cantidad || 0) +
    (registro.colchones_cantidad || 0) +
    (registro.frazadas_cantidad || 0) +
    (registro.terciadas_cantidad || 0) +
    (registro.puntales_cantidad || 0) +
    (registro.carpas_plasticas_cantidad || 0);

  // Detectar qué secciones mostrar basado en los campos disponibles
  const tieneUbicacion =
    registro.departamento || registro.distrito || registro.localidad;
  const tieneTemporal = registro.fecha || registro.anio || registro.mes;
  const tieneEvento = registro.evento;
  const tieneEstadisticas =
    registro.numeroOcurrencias || registro.unidades_distribuidas;
  const tieneBeneficiarios =
    registro.cantidad_familias_asistidas != null ||
    registro.cantidad_mujeres != null ||
    registro.cantidad_hombres != null ||
    registro.cantidad_indigena != null ||
    registro.cantidad_no_indigena != null;

  const handleGeneratePDF = () => {
    useGenerarReporteGenerico(registro, "Detalles del Registro");
  };

  // Renderizar sección de información temporal
  const renderSeccionTemporal = () => {
    if (!tieneTemporal) return null;

    return (
      <div>
        <h4 className="font-semibold text-primary">Información Temporal</h4>
        <div className="mt-2 space-y-2">
          {registro.fecha && (
            <p>
              <span className="font-medium">Fecha:</span>{" "}
              {formatDate(registro.fecha)}
            </p>
          )}
          {registro.anio && (
            <p>
              <span className="font-medium">Año:</span> {registro.anio}
            </p>
          )}
          {registro.mes && (
            <p>
              <span className="font-medium">Mes:</span>{" "}
              {registro.nombre_mes || registro.mes}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Renderizar sección de ubicación
  const renderSeccionUbicacion = () => {
    if (!tieneUbicacion) return null;

    return (
      <div>
        <h4 className="font-semibold text-primary">Ubicación</h4>
        <div className="mt-2 space-y-2">
          {registro.departamento && (
            <p>
              <span className="font-medium">Departamento:</span>{" "}
              {registro.departamento}
            </p>
          )}
          {registro.distrito && (
            <p>
              <span className="font-medium">Distrito:</span> {registro.distrito}
            </p>
          )}
          {registro.localidad && (
            <p>
              <span className="font-medium">Localidad:</span>{" "}
              {registro.localidad}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Renderizar sección de evento
  const renderSeccionEvento = () => {
    if (!tieneEvento) return null;

    return (
      <div>
        <h4 className="font-semibold text-primary">Evento</h4>
        <div className="mt-2 space-y-2">
          <p>
            <span className="font-medium">Tipo:</span> {registro.evento}
          </p>
          {registro.numeroOcurrencias && (
            <p>
              <span className="font-medium">Número de Ocurrencias:</span>{" "}
              {formatNumber(registro.numeroOcurrencias)}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderSeccionBeneficiarios = () => {
    if (!tieneBeneficiarios) return null;

    return (
      <div>
        <h4 className="font-semibold text-primary">Beneficiarios</h4>
        <div className="mt-2 space-y-2">
          {registro.cantidad_familias_asistidas != null && (
            <p>
              <span className="font-medium">Familias:</span>{" "}
              {formatNumber(registro.cantidad_familias_asistidas)}
            </p>
          )}
          {registro.cantidad_mujeres != null && (
            <p>
              <span className="font-medium">Mujeres:</span>{" "}
              {formatNumber(registro.cantidad_mujeres)}
            </p>
          )}
          {registro.cantidad_hombres != null && (
            <p>
              <span className="font-medium">Hombres:</span>{" "}
              {formatNumber(registro.cantidad_hombres)}
            </p>
          )}
          {registro.cantidad_indigena != null && (
            <p>
              <span className="font-medium">Indígena:</span>{" "}
              {formatNumber(registro.cantidad_indigena)}
            </p>
          )}
          {registro.cantidad_no_indigena != null && (
            <p>
              <span className="font-medium">No indígena:</span>{" "}
              {formatNumber(registro.cantidad_no_indigena)}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Renderizar sección de estadísticas adicionales
  const renderSeccionEstadisticas = () => {
    if (!tieneEstadisticas) return null;

    return (
      <div>
        <h4 className="font-semibold text-primary">Estadísticas</h4>
        <div className="mt-2 space-y-2">
          {registro.unidades_distribuidas && (
            <p>
              <span className="font-medium">Unidades Distribuidas:</span>{" "}
              {formatNumber(registro.unidades_distribuidas)}
            </p>
          )}
          {registro.orden && (
            <p>
              <span className="font-medium">Orden:</span> {registro.orden}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Renderizar sección de insumos
  const renderSeccionInsumos = () => {
    return (
      <div>
        <h4 className="font-semibold text-primary">Insumos Distribuidos</h4>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p>
              <span className="font-medium">Kits de Sentencia:</span>{" "}
              {formatNumber(registro.kit_sentencia)}
            </p>
            <p>
              <span className="font-medium">Kits de Evento:</span>{" "}
              {formatNumber(registro.kit_evento)}
            </p>
            <p>
              <span className="font-medium">Chapas Fibrocemento:</span>{" "}
              {formatNumber(registro.chapa_fibrocemento_cantidad)}
            </p>
            <p>
              <span className="font-medium">Chapas Zinc:</span>{" "}
              {formatNumber(registro.chapa_zinc_cantidad)}
            </p>
            <p>
              <span className="font-medium">Colchones:</span>{" "}
              {formatNumber(registro.colchones_cantidad)}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Frazadas:</span>{" "}
              {formatNumber(registro.frazadas_cantidad)}
            </p>
            <p>
              <span className="font-medium">Terciadas:</span>{" "}
              {formatNumber(registro.terciadas_cantidad)}
            </p>
            <p>
              <span className="font-medium">Puntales:</span>{" "}
              {formatNumber(registro.puntales_cantidad)}
            </p>
            <p>
              <span className="font-medium">Carpas Plásticas:</span>{" "}
              {formatNumber(registro.carpas_plasticas_cantidad)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-primary-light rounded-lg">
          <p className="text-sm font-bold text-black">
            Total de insumos distribuidos:{" "}
            <span className="text-lg">{formatNumber(totalInsumos)}</span>
          </p>
        </div>
      </div>
    );
  };

  // Generar resumen dinámico
  const generarResumen = () => {
    const partes: string[] = [];

    if (registro.fecha) {
      partes.push(`realizado el ${formatDate(registro.fecha)}`);
    } else if (registro.anio && registro.mes) {
      partes.push(
        `correspondiente a ${registro.nombre_mes || registro.mes} de ${
          registro.anio
        }`
      );
    } else if (registro.anio) {
      partes.push(`correspondiente al año ${registro.anio}`);
    }

    if (registro.distrito && registro.departamento) {
      partes.push(`en ${registro.distrito}, ${registro.departamento}`);
    } else if (registro.departamento) {
      partes.push(`en el departamento de ${registro.departamento}`);
    }

    if (registro.localidad) {
      partes.push(`localidad de ${registro.localidad}`);
    }

    if (registro.evento) {
      partes.push(`para el evento ${registro.evento}`);
    }

    if (registro.numeroOcurrencias) {
      partes.push(
        `con ${formatNumber(
          registro.numeroOcurrencias
        )} ocurrencias registradas`
      );
    }

    const resumenBase = `Registro de asistencia humanitaria ${partes.join(
      " "
    )}.`;
    const totalUnidades = registro.unidades_distribuidas || totalInsumos;
    const resumenInsumos = ` Se distribuyeron un total de ${formatNumber(
      totalUnidades
    )} unidades de insumos.`;

    return `${resumenBase}${resumenInsumos}`;
  };

  return (
    <div className="space-y-4">
      {/* Grid adaptativo para las secciones de contexto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSeccionTemporal()}
        {renderSeccionUbicacion()}
        {renderSeccionEvento()}
        {renderSeccionBeneficiarios()}
        {renderSeccionEstadisticas()}
      </div>

      {/* Sección de insumos */}
      {renderSeccionInsumos()}

      {/* Resumen */}
      <div>
        <h4 className="font-semibold text-primary">Resumen</h4>
        <div className="mt-2 p-4 bg-muted rounded-lg">
          <p className="text-sm">{generarResumen()}</p>
        </div>
      </div>

      {/* Botón para generar PDF */}
      <div className="flex justify-end">
        <button
          onClick={handleGeneratePDF}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default VisualizarDetallesGenericos;
