import { Component, inject, input, linkedSignal, signal } from '@angular/core';
import { FormField, form, minLength, required, submit } from '@angular/forms/signals';
import { NuevoReclamo } from '../../core/models';
import { ReclamosService } from '../../core/services/reclamos.service';
import { EstadoCarga } from '../../shared/estado-carga';
import { ReclamoCard } from '../../shared/reclamo-card';

const RECLAMO_VACIO: NuevoReclamo = { titulo: '', descripcion: '' };

@Component({
  selector: 'app-reclamos',
  imports: [FormField, EstadoCarga, ReclamoCard],
  templateUrl: './reclamos.html',
})
export class Reclamos {
  private readonly reclamosService = inject(ReclamosService);

  /** Query param `?nuevo=true`: llega desde el botón "+ Nuevo" del tablero. */
  readonly nuevo = input<string>();

  protected readonly reclamos = this.reclamosService.reclamos;
  protected readonly reclamosOrdenados = this.reclamosService.ordenados;
  protected readonly formularioAbierto = linkedSignal(() => this.nuevo() !== undefined);

  protected readonly nuevoReclamo = signal<NuevoReclamo>(RECLAMO_VACIO);
  protected readonly reclamoForm = form(this.nuevoReclamo, (campos) => {
    required(campos.titulo, { message: 'Contanos en pocas palabras qué pasa.' });
    minLength(campos.titulo, 5, { message: 'El título es demasiado corto.' });
    required(campos.descripcion, { message: 'Describí el problema.' });
  });

  protected enviar(event: Event): void {
    event.preventDefault();
    submit(this.reclamoForm, async () => {
      await this.reclamosService.crear(this.nuevoReclamo());
      this.nuevoReclamo.set(RECLAMO_VACIO);
      this.reclamoForm().reset();
      this.formularioAbierto.set(false);
    });
  }
}
