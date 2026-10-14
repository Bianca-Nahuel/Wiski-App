import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentosService } from '../../core/services/documentos.service';
import { EstadoCuentaService } from '../../core/services/estado-cuenta.service';
import { GastosService } from '../../core/services/gastos.service';
import { ReclamosService } from '../../core/services/reclamos.service';
import { DocumentoItem } from '../../shared/documento-item';
import { EstadoCarga } from '../../shared/estado-carga';
import { GastoItem } from '../../shared/gasto-item';
import { MontoCompactoPipe } from '../../shared/monto-compacto.pipe';
import { ReclamoCard } from '../../shared/reclamo-card';

@Component({
  selector: 'app-tablero',
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
    RouterLink,
    DocumentoItem,
    EstadoCarga,
    GastoItem,
    MontoCompactoPipe,
    ReclamoCard,
  ],
  templateUrl: './tablero.html',
})
export class Tablero {
  protected readonly estadoCuenta = inject(EstadoCuentaService).estadoCuenta;
  protected readonly documentos = inject(DocumentosService).documentos;
  protected readonly gastos = inject(GastosService).gastos;
  private readonly reclamosService = inject(ReclamosService);
  protected readonly reclamos = this.reclamosService.reclamos;

  // El tablero solo muestra un resumen; el listado completo vive en cada sección.
  protected readonly documentosDestacados = computed(() => this.documentos.value().slice(0, 3));
  protected readonly gastosRecientes = computed(() => this.gastos.value().slice(0, 2));
  protected readonly reclamosRecientes = computed(() =>
    this.reclamosService.ordenados().slice(0, 2),
  );
}
