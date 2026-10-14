import { Component, computed, input } from '@angular/core';
import { EstadoReclamo, Reclamo } from '../core/models';
import { TiempoRelativoPipe } from './tiempo-relativo.pipe';

const ETIQUETAS: Record<EstadoReclamo, string> = {
  abierto: 'Abierto',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
};

@Component({
  selector: 'app-reclamo-card',
  host: { class: 'block' },
  imports: [TiempoRelativoPipe],
  template: `
    <div
      class="relative border-2 bg-white p-3"
      [class]="resuelto() ? 'border-gray-300 opacity-80' : 'pixel-corner border-black'"
    >
      <div class="flex gap-3">
        <img
          class="h-12 w-12 border-2 bg-gray-200 object-cover"
          [class]="resuelto() ? 'border-gray-400 grayscale' : 'border-black'"
          [src]="reclamo().autor.avatarUrl"
          [alt]="'Avatar Unidad ' + reclamo().autor.unidad"
        />
        <div class="flex-1">
          <div class="flex items-start justify-between gap-2">
            <h4 class="font-bold" [class]="resuelto() ? 'text-gray-600 line-through' : ''">
              {{ reclamo().titulo }}
            </h4>
            <span
              class="shrink-0 px-2 py-1 text-xs font-bold uppercase"
              [class]="
                reclamo().estado === 'en_proceso' ? 'bg-black text-white' : 'border border-black'
              "
            >
              {{ etiquetas[reclamo().estado] }}
            </span>
          </div>
          <p class="mt-1 text-xs">
            Reportado por
            <span class="font-bold"
              >{{ reclamo().autor.nombre }} (Unidad {{ reclamo().autor.unidad }})</span
            >
            {{ reclamo().fecha | tiempoRelativo }}
          </p>

          @if (!resuelto()) {
            <div class="mt-3 border border-black bg-gray-100 p-2 text-sm">
              "{{ reclamo().descripcion }}"
            </div>
            @if (reclamo().respuestaAdmin; as respuesta) {
              <div class="mt-3 flex items-center gap-2 text-xs font-bold text-gray-600">
                <i class="fas fa-hard-hat text-black"></i> Admin: {{ respuesta }}
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class ReclamoCard {
  readonly reclamo = input.required<Reclamo>();

  protected readonly resuelto = computed(() => this.reclamo().estado === 'resuelto');
  protected readonly etiquetas = ETIQUETAS;
}
