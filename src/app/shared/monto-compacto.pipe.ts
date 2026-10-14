import { Pipe, PipeTransform } from '@angular/core';

const FORMATO = new Intl.NumberFormat('es-AR', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

/** 1250000 → "$1,25 M" */
@Pipe({ name: 'montoCompacto' })
export class MontoCompactoPipe implements PipeTransform {
  transform(monto: number): string {
    return `$${FORMATO.format(monto)}`;
  }
}
