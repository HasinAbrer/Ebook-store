// src/utils/getBaseUrl.js
export function getBaseUrl() {
  return import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";
}
