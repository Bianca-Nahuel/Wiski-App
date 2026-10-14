import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Gasto, TipoRespaldo } from '../core/models';

const ICONOS: Record<TipoRespaldo, string> = {
  presupuestos: 'fa-check-square',
  factura: 'fa-file-invoice',
  comprobante: 'fa-receipt',
};

@Component({
  selector: 'app-gasto-item',
  host: { class: 'block' },
  imports: [CurrencyPipe],
  template: `
    <div class="border-2 border-black bg-white p-4">
      <div class="mb-3 flex items-start justify-between gap-4">
        <div>
          <h4 class="text-lg font-bold">{{ gasto().concepto }}</h4>
          <p class="mt-1 text-xs font-bold text-gray-500 uppercase">
            Proveedor: {{ gasto().proveedor }}
          </p>
        </div>
        <span class="font-mono text-xl font-bold">
          {{ gasto().monto | currency: 'ARS' : '$' : '1.0-0' }}
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        @for (respaldo of gasto().respaldos; track respaldo.tipo) {
          @if (respaldo.ok) {
            <span
              class="flex items-center gap-1 border border-black bg-green-100 px-2 py-1 text-xs font-bold"
            >
              <i class="fas" [class]="iconos[respaldo.tipo]"></i> {{ respaldo.etiqueta }}
            </span>
          } @else {
            <span
              class="flex items-center gap-1 border-2 border-dashed border-black bg-white px-2 py-1 text-xs font-bold"
            >
              <i class="fas fa-times text-red-600"></i> {{ respaldo.etiqueta }}
            </span>
          }
        }
        <button type="button" class="ml-auto text-xs font-bold uppercase underline">
          {{ irregular() ? 'Auditar' : 'Ver Docs' }}
        </button>
      </div>
    </div>
  `,
})
export class GastoItem {
  readonly gasto = input.required<Gasto>();

  protected readonly irregular = computed(() => this.gasto().estado === 'irregular');
  protected readonly iconos = ICONOS;
}
