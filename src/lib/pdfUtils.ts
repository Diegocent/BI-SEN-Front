import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCell } from "./formatCell";
import { ObtenerTotalData } from "@/hooks/obtenerTotalData";
import { mostrarNotificacion } from "@/components/ui/notificacion";

function marcarFechaHora(fecha = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(
    fecha.getDate()
  )}_${pad(fecha.getHours())}-${pad(fecha.getMinutes())}-${pad(
    fecha.getSeconds()
  )}`;
}

export function nombreArchivoPdf(title: string, fecha = new Date()) {
  const tipo = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
  return `${tipo || "Reporte"}_${marcarFechaHora(fecha)}.pdf`;
}

export function descargarPdf(doc: jsPDF, title: string) {
  const filename = nombreArchivoPdf(title);
  doc.save(filename);
  return filename;
}

export function generateTablePDF({
  columns,
  data,
  title = "Reporte",
}: {
  columns: any[];
  data: any[];
  title?: string;
}) {
  const doc = new jsPDF({ orientation: "landscape", format: "legal" });
  doc.setFontSize(16);
  doc.text(title, 14, 18);

  const tableColumns = columns.map((col) => col.label);
  const tableRows = data.map((row) =>
    columns.map((col) => {
      const formatted = formatCell(row[col.key], col.dataType);
      return formatted == null ? "" : String(formatted);
    })
  );

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: 24,
    styles: {
      fontSize: columns.length > 12 ? 7 : 9,
      overflow: "linebreak",
      cellPadding: 1.5,
    },
    headStyles: {
      fillColor: [255, 172, 88],
      textColor: 20,
      fontStyle: "bold",
    },
  });

  return descargarPdf(doc, title);
}

export function imprimirTablaPDF({
  controller,
  params = {},
  perPage = 10,
  columns,
  title,
}: {
  controller: string;
  params?: Record<string, unknown>;
  perPage?: number;
  columns: any[];
  title: string;
}) {
  mostrarNotificacion({
    paso: "Paso 1 de 2",
    mensaje: `Obteniendo datos de «${title}»…`,
    tipo: "info",
    persistente: true,
  });

  void (async () => {
    try {
      const registros = await ObtenerTotalData(
        "",
        controller,
        params,
        perPage
      );

      mostrarNotificacion({
        paso: "Paso 2 de 2",
        mensaje: "Generando y descargando el PDF…",
        tipo: "info",
        persistente: true,
      });

      const filename = generateTablePDF({
        columns,
        data: registros?.results || [],
        title,
      });

      mostrarNotificacion({
        paso: "Descarga completa",
        mensaje: `El PDF se descargó correctamente: ${filename}`,
        tipo: "success",
      });
    } catch (error) {
      console.error("No se pudo generar el PDF", error);
      mostrarNotificacion({
        paso: "Error",
        mensaje:
          "No se pudo descargar el PDF. Verifique la API e intente de nuevo.",
        tipo: "error",
      });
    }
  })();
}
