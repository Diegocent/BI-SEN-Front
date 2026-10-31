import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { descargarPdf } from "@/lib/pdfUtils";
import { mostrarNotificacion } from "@/components/ui/notificacion";
// Función para formatear números grandes
export const formatNumber = (value: any): string => {
  if (value === null || value === undefined) return "0";

  const numValue = typeof value === "string" ? Number.parseFloat(value) : value;

  if (typeof numValue === "number" && !isNaN(numValue)) {
    if (Math.abs(numValue) >= 1000) {
      return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return numValue.toString();
  }

  return value?.toString() || "0";
};

// Función para formatear fechas
export const formatDate = (value: any): string => {
  if (!value) return "";

  if (typeof value === "string") {
    // Formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    }

    // Intentar parsear como fecha
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("es-ES");
    }
  }

  return value?.toString() || "";
};

export function useGenerarReporteGenerico(
  registro: any,
  title = "Detalles del Registro"
) {
  const doc = new jsPDF({ orientation: "portrait", format: "a4" });

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

  let currentY = 20;

  // Título
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.setFont("", "bold");
  doc.text(title, 105, currentY, { align: "center" });
  doc.setFont("", "normal");

  currentY += 15;

  // Función auxiliar para agregar secciones
  const addSection = (
    sectionTitle: string,
    data: Array<[string, string]>,
    startY: number
  ): number => {
    if (data.length === 0) return startY;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.setFont("", "bold");
    doc.text(sectionTitle, 14, startY);
    doc.setFont("", "normal");

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    let y = startY + 7;
    data.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 20, y);
      y += 7;
    });

    return y + 5;
  };

  // Información Temporal
  const temporalData: Array<[string, string]> = [];
  if (registro.fecha) temporalData.push(["Fecha", formatDate(registro.fecha)]);
  if (registro.anio) temporalData.push(["Año", registro.anio.toString()]);
  if (registro.mes)
    temporalData.push(["Mes", registro.nombre_mes || registro.mes.toString()]);

  if (temporalData.length > 0) {
    currentY = addSection("INFORMACIÓN TEMPORAL", temporalData, currentY);
  }

  // Ubicación
  const ubicacionData: Array<[string, string]> = [];
  if (registro.departamento)
    ubicacionData.push(["Departamento", registro.departamento]);
  if (registro.distrito) ubicacionData.push(["Distrito", registro.distrito]);
  if (registro.localidad) ubicacionData.push(["Localidad", registro.localidad]);

  if (ubicacionData.length > 0) {
    currentY = addSection("UBICACIÓN", ubicacionData, currentY);
  }

  // Evento
  const eventoData: Array<[string, string]> = [];
  if (registro.evento) eventoData.push(["Tipo de Evento", registro.evento]);
  if (registro.numeroOcurrencias)
    eventoData.push([
      "Número de Ocurrencias",
      formatNumber(registro.numeroOcurrencias),
    ]);

  if (eventoData.length > 0) {
    currentY = addSection("EVENTO", eventoData, currentY);
  }

  const beneficiariosData: Array<[string, string]> = [];
  if (registro.cantidad_familias_asistidas != null)
    beneficiariosData.push([
      "Familias",
      formatNumber(registro.cantidad_familias_asistidas),
    ]);
  if (registro.cantidad_mujeres != null)
    beneficiariosData.push(["Mujeres", formatNumber(registro.cantidad_mujeres)]);
  if (registro.cantidad_hombres != null)
    beneficiariosData.push(["Hombres", formatNumber(registro.cantidad_hombres)]);
  if (registro.cantidad_indigena != null)
    beneficiariosData.push([
      "Indígena",
      formatNumber(registro.cantidad_indigena),
    ]);
  if (registro.cantidad_no_indigena != null)
    beneficiariosData.push([
      "No indígena",
      formatNumber(registro.cantidad_no_indigena),
    ]);
  if (beneficiariosData.length > 0) {
    currentY = addSection("BENEFICIARIOS", beneficiariosData, currentY);
  }

  // Estadísticas
  const estadisticasData: Array<[string, string]> = [];
  if (registro.unidades_distribuidas)
    estadisticasData.push([
      "Unidades Distribuidas",
      formatNumber(registro.unidades_distribuidas),
    ]);
  if (registro.orden)
    estadisticasData.push(["Orden", registro.orden.toString()]);

  if (estadisticasData.length > 0) {
    currentY = addSection("ESTADÍSTICAS", estadisticasData, currentY);
  }

  // Insumos Distribuidos - Tabla
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont("", "bold");
  doc.text("INSUMOS DISTRIBUIDOS", 14, currentY);
  doc.setFont("", "normal");

  currentY += 5;

  const insumosData = [
    ["Kits de Sentencia", formatNumber(registro.kit_sentencia || 0)],
    ["Kits de Evento", formatNumber(registro.kit_evento || 0)],
    [
      "Chapas Fibrocemento",
      formatNumber(registro.chapa_fibrocemento_cantidad || 0),
    ],
    ["Chapas Zinc", formatNumber(registro.chapa_zinc_cantidad || 0)],
    ["Colchones", formatNumber(registro.colchones_cantidad || 0)],
    ["Frazadas", formatNumber(registro.frazadas_cantidad || 0)],
    ["Terciadas", formatNumber(registro.terciadas_cantidad || 0)],
    ["Puntales", formatNumber(registro.puntales_cantidad || 0)],
    ["Carpas Plásticas", formatNumber(registro.carpas_plasticas_cantidad || 0)],
  ];

  // @ts-ignore
  autoTable(doc, {
    startY: currentY,
    head: [["Insumo", "Cantidad"]],
    body: insumosData,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: {
      fillColor: [255, 172, 88],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: "auto", fontStyle: "bold" },
      1: { cellWidth: "auto", halign: "center" },
    },
  });

  // Total de insumos
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFillColor(240, 248, 255);
  doc.rect(14, finalY, 182, 8, "F");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("", "bold");
  doc.text(
    `Total de insumos distribuidos: ${formatNumber(totalInsumos)}`,
    105,
    finalY + 6,
    { align: "center" }
  );

  // Resumen
  doc.setFont("", "normal");
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont("", "bold");
  doc.text("RESUMEN", 14, finalY + 20);
  doc.setFont("", "normal");

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  // Generar resumen dinámico
  const partes: string[] = ["Registro de asistencia humanitaria"];

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
      `con ${formatNumber(registro.numeroOcurrencias)} ocurrencias registradas`
    );
  }

  const resumenTexto = `${partes.join(
    " "
  )}. Se distribuyeron un total de ${formatNumber(
    totalInsumos
  )} unidades de ayuda.`;

  let summaryY = finalY + 30;
  const splitLines = doc.splitTextToSize(resumenTexto, 180);
  splitLines.forEach((line: string) => {
    doc.text(line, 14, summaryY);
    summaryY += 6;
  });

  // Pie de página
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generado el: ${new Date().toLocaleDateString("es-ES")}`,
    14,
    pageHeight - 10
  );

  try {
    mostrarNotificacion({
      paso: "Paso 1 de 1",
      mensaje: `Generando PDF de «${title}»…`,
      tipo: "info",
      persistente: true,
    });
    const filename = descargarPdf(doc, title);
    mostrarNotificacion({
      paso: "Descarga completa",
      mensaje: `El PDF se descargó correctamente: ${filename}`,
      tipo: "success",
    });
  } catch (error) {
    console.error("No se pudo descargar el PDF", error);
    mostrarNotificacion({
      paso: "Error",
      mensaje: "No se pudo descargar el PDF. Intente de nuevo.",
      tipo: "error",
    });
  }
}
