import { Component, input } from '@angular/core';

/** Mensaje de carga / error para una sección alimentada por un resource. */
@Component({
  selector: 'app-estado-carga',
  host: { class: 'block' },
  template: `
    @if (error()) {
      <p class="p-4 text-sm font-bold text-red-600">
        <i class="fas fa-triangle-exclamation"></i> No pudimos cargar los datos.
      </p>
    } @else if (cargando()) {
      <p class="p-4 text-sm font-bold text-gray-500 uppercase">Cargando…</p>
    }
  `,
})
export class EstadoCarga {
  readonly cargando = input(false);
  readonly error = input(false);
}
