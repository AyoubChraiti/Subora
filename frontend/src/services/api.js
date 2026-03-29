const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const TOKEN_STORAGE_KEY = "subora_access_token";

let accessToken = "";
let onUnauthorized = null;

try {
  accessToken = window.sessionStorage.getItem(TOKEN_STORAGE_KEY) || "";
} catch {
  accessToken = "";
}

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || "";
  try {
    if (accessToken) {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      return;
    }
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage failures; in-memory token still works for the active tab.
  }
}

export function clearAccessToken() {
  setAccessToken("");
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

async function apiRequest(path, options = {}) {
  const { auth = false, body, headers, ...rest } = options;
  const requestHeaders = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  if (auth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const hasJson = response.headers.get("content-type")?.includes("application/json");
  const payload = hasJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken();
      if (typeof onUnauthorized === "function") {
        onUnauthorized();
      }
    }
    const message = payload?.detail || "Request failed";
    throw new Error(message);
  }

  return payload;
}

export async function registerUser(input) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: input,
  });
}

export async function loginUser(input) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function fetchCurrentUser() {
  return apiRequest("/auth/me", {
    method: "GET",
    auth: true,
  });
}

export async function updateCurrentUser(input) {
  return apiRequest("/auth/me", {
    method: "PATCH",
    auth: true,
    body: input,
  });
}

export async function fetchSubscriptions() {
  return apiRequest("/api/v1/subscriptions", {
    method: "GET",
    auth: true,
  });
}

export async function createSubscription(input) {
  return apiRequest("/api/v1/subscriptions", {
    method: "POST",
    auth: true,
    body: input,
  });
}

export async function deleteSubscription(subscriptionId) {
  return apiRequest(`/api/v1/subscriptions/${subscriptionId}`, {
    method: "DELETE",
    auth: true,
  });
}
