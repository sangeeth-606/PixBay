/**
 * Utility to get the appropriate API URL based on environment
 */
export const getApiUrl = (): string => {
  const isProduction = import.meta.env.VITE_PRODUCTION === "true";
  return isProduction
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;
};

/**
 * Construct a full API endpoint path
 */
export const getApiEndpoint = (path: string): string => {
  return `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
};

// Add a default export that includes both functions
const api = {
  getApiUrl,
  getApiEndpoint,
};

export default api;
