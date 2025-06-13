const BASE_URL = "http://localhost:3000/";

export const createHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: createHeaders(
      endpoint !== "auth/login" && endpoint !== "auth/register",
    ),
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    let errorDetail = "Unknown error";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || JSON.stringify(errorJson);
    } catch (e) {
      errorDetail = await response.text();
    }
    throw new Error(`API error: ${response.status} - ${errorDetail}`);
  }

  return response.json();
}

