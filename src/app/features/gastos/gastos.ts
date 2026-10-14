import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { EstadoGasto } from '../../core/models';
import { GastosService } from '../../core/services/gastos.service';
import { EstadoCarga } from '../../shared/estado-carga';
import { GastoItem } from '../../shared/gasto-item';

type Filtro = EstadoGasto | 'todos';

@Component({
  selector: 'app-gastos',
  imports: [CurrencyPipe, EstadoCarga, GastoItem],
  templateUrl: './gastos.html',
})
export class Gastos {
  protected readonly gastos = inject(GastosService).gastos;

  protected readonly filtros: { valor: Filtro; etiqueta: string }[] = [
    { valor: 'todos', etiqueta: 'Todos' },
    { valor: 'verificado', etiqueta: 'Verificados' },
    { valor: 'irregular', etiqueta: 'Irregulares' },
  ];
  protected readonly filtro = signal<Filtro>('todos');

  protected readonly gastosFiltrados = computed(() => {
    const filtro = this.filtro();
    const gastos = this.gastos.value();
    return filtro === 'todos' ? gastos : gastos.filter((gasto) => gasto.estado === filtro);
  });

  protected readonly total = computed(() =>
    this.gastos.value().reduce((suma, gasto) => suma + gasto.monto, 0),
  );
  protected readonly totalIrregular = computed(() =>
    this.gastos
      .value()
      .filter((gasto) => gasto.estado === 'irregular')
      .reduce((suma, gasto) => suma + gasto.monto, 0),
  );
  protected readonly cantidadIrregulares = computed(
    () => this.gastos.value().filter((gasto) => gasto.estado === 'irregular').length,
  );
}
