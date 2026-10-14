import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, PLATFORM_ID, REQUEST, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { injectApiUrl } from '../api/api';
import { Credenciales, Sesion, Usuario } from '../models';

const COOKIE_SESION = 'wiski_token';
const DURACION_SESION_SEG = 60 * 60 * 8;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly url = injectApiUrl();

  // La sesión vive en una cookie para que los guards también funcionen durante el SSR.
  private readonly token = signal<string | null>(this.leerToken());

  readonly isAuthenticated = computed(() => this.token() !== null);

  readonly usuario = httpResource<Usuario>(() =>
    this.isAuthenticated() ? this.url('usuario') : undefined,
  );

  async login(credenciales: Credenciales): Promise<void> {
    // Mock: el JSON estático no valida credenciales. Con el backend real pasa a ser
    // this.http.post<Sesion>(this.url('login'), credenciales).
    void credenciales;
    const sesion = await firstValueFrom(this.http.get<Sesion>(this.url('login')));
    this.escribirCookie(sesion.token, DURACION_SESION_SEG);
    this.token.set(sesion.token);
  }

  logout(): void {
    this.escribirCookie('', 0);
    this.token.set(null);
  }

  private leerToken(): string | null {
    const cookies = this.isBrowser
      ? this.document.cookie
      : (this.request?.headers.get('cookie') ?? '');
    const cookie = cookies.split('; ').find((c) => c.startsWith(`${COOKIE_SESION}=`));
    return cookie ? decodeURIComponent(cookie.slice(COOKIE_SESION.length + 1)) || null : null;
  }

  private escribirCookie(valor: string, maxAge: number): void {
    if (!this.isBrowser) return;
    this.document.cookie = `${COOKIE_SESION}=${encodeURIComponent(valor)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}
