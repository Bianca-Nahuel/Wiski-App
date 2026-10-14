import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { injectApiUrl } from '../api/api';
import { Gasto } from '../models';

@Injectable({ providedIn: 'root' })
export class GastosService {
  private readonly url = injectApiUrl();

  readonly gastos = httpResource<Gasto[]>(() => this.url('gastos'), { defaultValue: [] });
}
