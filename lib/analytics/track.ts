/**
 * Empuje de eventos al dataLayer de GTM. Centraliza el boilerplate y la
 * declaración global para no repetirla en cada componente.
 *
 * Llamar SIEMPRE después de confirmar el éxito de la acción (nunca antes de
 * saber que funcionó). Los nombres de evento y parámetros van en snake_case y
 * deben coincidir EXACTO con los triggers/variables de GTM.
 */
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
