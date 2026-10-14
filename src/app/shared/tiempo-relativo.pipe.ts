import { Pipe, PipeTransform } from '@angular/core';

const FORMATO = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Fecha ISO → "hoy", "ayer", "hace 2 días", "hace 3 meses". */
@Pipe({ name: 'tiempoRelativo' })
export class TiempoRelativoPipe implements PipeTransform {
  transform(fecha: string): string {
    const dias = Math.max(0, Math.floor((Date.now() - new Date(fecha).getTime()) / MS_POR_DIA));
    return dias < 30
      ? FORMATO.format(-dias, 'day')
      : FORMATO.format(-Math.floor(dias / 30), 'month');
  }
}
