import { useState, useEffect, useRef } from "react";
import { useResumenPorDepartamentoQuery } from "../api";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DepartamentoData {
  departamento: string;
  lat: number;
  lng: number;
  zoom: number;
  cantidad_registros: number;
  kit_sentencia: number;
  kit_evento: number;
  chapa_fibrocemento_cantidad: number;
  chapa_zinc_cantidad: number;
  colchones_cantidad: number;
  frazadas_cantidad: number;
  terciadas_cantidad: number;
  puntales_cantidad: number;
  carpas_plasticas_cantidad: number;
  evento_mas_frecuente: string;
  cantidad_familias_asistidas?: number;
  cantidad_mujeres?: number;
  cantidad_hombres?: number;
  cantidad_indigena?: number;
  cantidad_no_indigena?: number;
}

function normalizarDepto(valor?: string) {
  return (valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

interface MapaParaguayProps {
  className?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export function MapaParaguay({
  className,
  fecha_inicio,
  fecha_fin,
}: MapaParaguayProps) {
  const [selectedDepartamento, setSelectedDepartamento] =
    useState<DepartamentoData | null>(null);
  const [selectedDepartamentoData, setSelectedDepartamentoData] = useState<
    any | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Mock inicial con todos los campos en 0
  const departamentosMock: DepartamentoData[] = [
    {
      departamento: "CAPITAL",
      lat: -25.2967,
      lng: -57.6359,
      zoom: 12,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CENTRAL",
      lat: -25.3637,
      lng: -57.4259,
      zoom: 10,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "ALTO PARANÁ",
      lat: -25.5163,
      lng: -54.6436,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "ITAPÚA",
      lat: -26.8753,
      lng: -55.9178,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CAAGUAZÚ",
      lat: -25.4669,
      lng: -56.0175,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "SAN PEDRO",
      lat: -24.0669,
      lng: -57.0789,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CORDILLERA",
      lat: -25.3219,
      lng: -56.8467,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "GUAIRÁ",
      lat: -25.7833,
      lng: -56.45,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CAAZAPÁ",
      lat: -26.1978,
      lng: -56.3711,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "MISIONES",
      lat: -26.8833,
      lng: -57.0833,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "PARAGUARÍ",
      lat: -25.6319,
      lng: -57.1456,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "ALTO PARAGUAY",
      lat: -20.3167,
      lng: -58.1833,
      zoom: 8,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "PDTE. HAYES",
      lat: -23.35,
      lng: -59.05,
      zoom: 8,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "BOQUERON",
      lat: -22.6833,
      lng: -60.4167,
      zoom: 8,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "AMAMBAY",
      lat: -22.5667,
      lng: -56.0333,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CANINDEYÚ",
      lat: -24.1167,
      lng: -55.1667,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CONCEPCIÓN",
      lat: -23.4167,
      lng: -57.4333,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "ÑEEMBUCÚ",
      lat: -26.9167,
      lng: -58.2833,
      zoom: 9,
      cantidad_registros: 0,
      kit_sentencia: 0,
      kit_evento: 0,
      chapa_fibrocemento_cantidad: 0,
      chapa_zinc_cantidad: 0,
      colchones_cantidad: 0,
      frazadas_cantidad: 0,
      terciadas_cantidad: 0,
      puntales_cantidad: 0,
      carpas_plasticas_cantidad: 0,
      evento_mas_frecuente: "",
    },
  ];

  // Obtener datos reales
  const { data: resumenData } = useResumenPorDepartamentoQuery({
    fecha_desde: fecha_inicio,
    fecha_hasta: fecha_fin,
  });

  // Merge mock + data real
  const departamentosData: DepartamentoData[] = departamentosMock.map(
    (mock) => {
      const real = resumenData?.find(
        (d: any) =>
          normalizarDepto(d.departamento || d.nombre || d.name) ===
          normalizarDepto(mock.departamento)
      );

      return real
        ? {
            ...mock,
            cantidad_registros: real.cantidad_registros ?? 0,
            kit_sentencia: real.kit_sentencia ?? 0,
            kit_evento: real.kit_evento ?? 0,
            chapa_fibrocemento_cantidad: real.chapa_fibrocemento_cantidad ?? 0,
            chapa_zinc_cantidad: real.chapa_zinc_cantidad ?? 0,
            colchones_cantidad: real.colchones_cantidad ?? 0,
            frazadas_cantidad: real.frazadas_cantidad ?? 0,
            terciadas_cantidad: real.terciadas_cantidad ?? 0,
            puntales_cantidad: real.puntales_cantidad ?? 0,
            carpas_plasticas_cantidad: real.carpas_plasticas_cantidad ?? 0,
            evento_mas_frecuente: real.evento_mas_frecuente ?? "",
            cantidad_familias_asistidas: real.cantidad_familias_asistidas ?? 0,
            cantidad_mujeres: real.cantidad_mujeres ?? 0,
            cantidad_hombres: real.cantidad_hombres ?? 0,
            cantidad_indigena: real.cantidad_indigena ?? 0,
            cantidad_no_indigena: real.cantidad_no_indigena ?? 0,
          }
        : mock;
    }
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const loadLeaflet = async () => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!(window as any).L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.head.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const L = (window as any).L;
      const map = L.map(mapRef.current).setView([-23.442503, -58.443832], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      departamentosData.forEach((dept) => {
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: #FF8100;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([dept.lat, dept.lng], {
          icon: customIcon,
        }).addTo(map);

        marker.on("click", () => {
          setSelectedDepartamento(dept);
          const real = resumenData?.find(
            (d: any) =>
              normalizarDepto(d.departamento || d.nombre || d.name) ===
              normalizarDepto(dept.departamento)
          );
          setSelectedDepartamentoData(real || null);
          setIsDialogOpen(true);
          map.setView([dept.lat, dept.lng], dept.zoom);
        });
      });

      mapInstanceRef.current = map;
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [resumenData]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Mapa de Paraguay - Asistencia Humanitaria
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Haz clic en los marcadores para ver los datos de cada departamento
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[clamp(240px,42vh,380px)] w-full rounded-lg overflow-hidden border">
            <div
              ref={mapRef}
              style={{ height: "100%", width: "100%", zIndex: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md z-[100] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {selectedDepartamento?.departamento}
            </DialogTitle>
            <DialogDescription>
              Datos de asistencia humanitaria del departamento
            </DialogDescription>
          </DialogHeader>

          {selectedDepartamento && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-info/10 rounded-lg">
                  <p className="text-2xl font-bold text-info">
                    {selectedDepartamentoData?.cantidad_familias_asistidas ??
                      selectedDepartamentoData?.cantidad_registros ??
                      0}
                  </p>
                  <p className="text-xs text-muted-foreground">Familias</p>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-sm font-bold text-success">
                    {selectedDepartamentoData?.evento_mas_frecuente || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Evento más frecuente
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Mujeres:</span>
                  <span className="text-sm font-bold text-primary">
                    {selectedDepartamentoData?.cantidad_mujeres ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Hombres:</span>
                  <span className="text-sm font-bold text-primary">
                    {selectedDepartamentoData?.cantidad_hombres ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Indígena:</span>
                  <span className="text-sm font-bold text-primary">
                    {selectedDepartamentoData?.cantidad_indigena ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">No indígena:</span>
                  <span className="text-sm font-bold text-primary">
                    {selectedDepartamentoData?.cantidad_no_indigena ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Total Chapas:</span>
                  <span className="text-sm font-bold text-primary">
                    {(selectedDepartamentoData?.chapa_fibrocemento_cantidad ??
                      0) + (selectedDepartamentoData?.chapa_zinc_cantidad ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Total Kits:</span>
                  <span className="text-sm font-bold text-warning">
                    {(selectedDepartamentoData?.kit_sentencia ?? 0) +
                      (selectedDepartamentoData?.kit_evento ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Colchones:</span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamentoData?.colchones_cantidad ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Frazadas:</span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamentoData?.frazadas_cantidad ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Terciadas:</span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamentoData?.terciadas_cantidad ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Puntales:</span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamentoData?.puntales_cantidad ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Carpas Plásticas:</span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamentoData?.carpas_plasticas_cantidad ?? 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
