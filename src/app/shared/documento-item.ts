import { Component, input } from '@angular/core';
import { CategoriaDocumento, Documento } from '../core/models';

const ICONOS: Record<CategoriaDocumento, string> = {
  legal: 'fa-file-pdf',
  seguros: 'fa-shield-alt',
  mantenimiento: 'fa-tools',
  actas: 'fa-file-signature',
  financiero: 'fa-file-invoice-dollar',
};

@Component({
  selector: 'app-documento-item',
  host: { class: 'block' },
  template: `
    <a
      class="flex items-center gap-3 border border-transparent p-2 transition-all hover:border-black hover:bg-gray-100"
      [attr.href]="documento().url"
      target="_blank"
      rel="noopener"
    >
      <i class="fas w-6 text-center text-xl" [class]="iconos[documento().categoria]"></i>
      <div>
        <p class="text-sm font-bold">{{ documento().titulo }}</p>
        <p class="text-xs text-gray-500">{{ documento().detalle }}</p>
      </div>
    </a>
  `,
})
export class DocumentoItem {
  readonly documento = input.required<Documento>();

  protected readonly iconos = ICONOS;
}
