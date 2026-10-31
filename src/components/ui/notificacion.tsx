import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

export type TipoNotificacion = "info" | "success" | "error";

export type DetalleNotificacion = {
  mensaje: string;
  tipo?: TipoNotificacion;
  paso?: string;
  persistente?: boolean;
};

const EVENTO = "bi-notificacion";

export function mostrarNotificacion(
  detalle: DetalleNotificacion | string
) {
  const payload: DetalleNotificacion =
    typeof detalle === "string" ? { mensaje: detalle } : detalle;
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: payload }));
}

export function NotificacionHost() {
  const [abierta, setAbierta] = useState(false);
  const [detalle, setDetalle] = useState<DetalleNotificacion>({
    mensaje: "",
  });

  useEffect(() => {
    const escuchar = (evento: Event) => {
      const data = (evento as CustomEvent<DetalleNotificacion>).detail;
      setDetalle(data);
      setAbierta(true);
    };
    window.addEventListener(EVENTO, escuchar);
    return () => window.removeEventListener(EVENTO, escuchar);
  }, []);

  const tipo = detalle.tipo || "info";

  return (
    <Snackbar
      open={abierta}
      autoHideDuration={detalle.persistente ? null : tipo === "success" ? 6000 : 5000}
      onClose={() => setAbierta(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={() => setAbierta(false)}
        severity={tipo}
        variant="filled"
        sx={{ width: "100%", alignItems: "flex-start" }}
      >
        {detalle.paso && (
          <div className="text-[11px] uppercase tracking-wide opacity-90 mb-0.5">
            {detalle.paso}
          </div>
        )}
        <div className="text-sm font-medium">{detalle.mensaje}</div>
      </Alert>
    </Snackbar>
  );
}
