// Archivo base para definir el api slice de RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const API_BASE_URL =
  import.meta.env.VITE_URL || "http://localhost:5088/api/";
const baseUrl = API_BASE_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder: any) => ({
    resumenGeneral: builder.query({
      query: (params: any) => ({
        url: "resumen-general/",
        params,
      }),
    }),
    asistenciaDetallada: builder.query({
      query: (params: any) => ({
        url: "detallada/",
        params,
      }),
    }),
  }),
});

export const { useResumenGeneralQuery, useAsistenciaDetalladaQuery } = api;
