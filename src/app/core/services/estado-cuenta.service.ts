import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { injectApiUrl } from '../api/api';
import { EstadoCuenta } from '../models';

@Injectable({ providedIn: 'root' })
export class EstadoCuentaService {
  private readonly url = injectApiUrl();

  readonly estadoCuenta = httpResource<EstadoCuenta>(() => this.url('estado-cuenta'));
}
