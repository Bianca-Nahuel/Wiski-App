import { InjectionToken, inject } from '@angular/core';

export interface ApiConfig {
  /** Prefijo de todos los recursos. Mock: '/mock'. Backend: 'https://api.wiski.app/v1'. */
  baseUrl: string;
  /** Sufijo de los recursos. Mock: '.json'. Backend: ''. */
  suffix: string;
}

/**
 * Único punto a tocar para pasar de los JSON mockeados (public/mock) al backend real:
 * sobreescribir este token en app.config.ts con la URL de la API y suffix ''.
 */
export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  factory: () => ({ baseUrl: '/mock', suffix: '.json' }),
});

/** Devuelve una función que arma la URL de un recurso: `url('gastos')` → `/mock/gastos.json`. */
export function injectApiUrl(): (recurso: string) => string {
  const { baseUrl, suffix } = inject(API_CONFIG);
  return (recurso) => `${baseUrl}/${recurso}${suffix}`;
}
