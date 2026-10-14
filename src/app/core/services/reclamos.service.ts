import { httpResource } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { injectApiUrl } from '../api/api';
import { AuthService } from '../auth/auth.service';
import { NuevoReclamo, Reclamo } from '../models';

@Injectable({ providedIn: 'root' })
export class ReclamosService {
  private readonly auth = inject(AuthService);
  private readonly url = injectApiUrl();

  readonly reclamos = httpResource<Reclamo[]>(() => this.url('reclamos'), { defaultValue: [] });

  /** Reclamos del más reciente al más antiguo; es el orden en que se muestran siempre. */
  readonly ordenados = computed(() =>
    [...this.reclamos.value()].sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha)),
  );

  async crear(nuevo: NuevoReclamo): Promise<void> {
    // Mock: el reclamo solo se agrega en memoria. Con el backend real pasa a ser un
    // POST a this.url('reclamos') seguido de this.reclamos.reload().
    const usuario = this.auth.usuario.value();
    if (!usuario) return;
    const reclamo: Reclamo = {
      ...nuevo,
      id: Date.now(),
      estado: 'abierto',
      fecha: new Date().toISOString(),
      autor: { nombre: usuario.nombre, unidad: usuario.unidad, avatarUrl: usuario.avatarUrl },
      respuestaAdmin: null,
    };
    this.reclamos.update((reclamos) => [reclamo, ...reclamos]);
  }
}
