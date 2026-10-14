import { Component, computed, inject, signal } from '@angular/core';
import { DocumentosService } from '../../core/services/documentos.service';
import { DocumentoItem } from '../../shared/documento-item';
import { EstadoCarga } from '../../shared/estado-carga';

/** Minúsculas y sin acentos, para que "poliza" encuentre "Póliza". */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

@Component({
  selector: 'app-documentos',
  imports: [DocumentoItem, EstadoCarga],
  templateUrl: './documentos.html',
})
export class Documentos {
  protected readonly documentos = inject(DocumentosService).documentos;

  protected readonly busqueda = signal('');

  protected readonly documentosFiltrados = computed(() => {
    const busqueda = normalizar(this.busqueda().trim());
    const documentos = this.documentos.value();
    return busqueda
      ? documentos.filter((documento) => normalizar(documento.titulo).includes(busqueda))
      : documentos;
  });
}
