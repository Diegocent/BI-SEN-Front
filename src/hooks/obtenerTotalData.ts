import { API_BASE_URL } from "@/api/api";

function normalizarBaseUrl(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

export async function ObtenerTotalData(
  api: string,
  controller: string,
  params: Record<string, unknown> = {},
  per_page: number = 10
) {
  try {
    const baseUrl = normalizarBaseUrl(API_BASE_URL);
    const apiPath = api.replace(/^\/+|\/+$/g, "");
    const controllerPath = controller.replace(/^\/+|\/+$/g, "");
    const path = apiPath
      ? `${baseUrl}${apiPath}/${controllerPath}/`
      : `${baseUrl}${controllerPath}/`;
    const url = new URL(path);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "" && key !== "page") {
        url.searchParams.set(key, String(value));
      }
    });

    url.searchParams.set("per_page", per_page.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener datos para el PDF:", error);
    throw error;
  }
}
