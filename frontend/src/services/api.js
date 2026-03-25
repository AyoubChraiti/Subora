const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function fetchSubscriptions() {
  const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions`);
  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }
  return response.json();
}
