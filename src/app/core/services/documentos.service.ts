import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { injectApiUrl } from '../api/api';
import { Documento } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentosService {
  private readonly url = injectApiUrl();

  readonly documentos = httpResource<Documento[]>(() => this.url('documentos'), {
    defaultValue: [],
  });
}
