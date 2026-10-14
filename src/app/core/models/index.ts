export interface Credenciales {
  email: string;
  password: string;
}

export interface Sesion {
  token: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  avatarUrl: string;
  edificio: string;
  unidad: string;
}

export interface EstadoCuenta {
  /** Primer día del período liquidado (ISO). */
  periodo: string;
  expensa: number;
  pagada: boolean;
  fechaPago: string | null;
  fondoReserva: number;
  /** Porcentaje de morosidad del consorcio. */
  morosidad: number;
}

export type CategoriaDocumento = 'legal' | 'seguros' | 'mantenimiento' | 'actas' | 'financiero';

export interface Documento {
  id: number;
  titulo: string;
  detalle: string;
  categoria: CategoriaDocumento;
  url: string | null;
}

export type TipoRespaldo = 'presupuestos' | 'factura' | 'comprobante';

export interface Respaldo {
  tipo: TipoRespaldo;
  etiqueta: string;
  ok: boolean;
}

export type EstadoGasto = 'verificado' | 'irregular';

export interface Gasto {
  id: number;
  concepto: string;
  proveedor: string;
  monto: number;
  fecha: string;
  estado: EstadoGasto;
  respaldos: Respaldo[];
}

export type EstadoReclamo = 'abierto' | 'en_proceso' | 'resuelto';

export interface AutorReclamo {
  nombre: string;
  unidad: string;
  avatarUrl: string;
}

export interface Reclamo {
  id: number;
  titulo: string;
  estado: EstadoReclamo;
  fecha: string;
  autor: AutorReclamo;
  descripcion: string;
  respuestaAdmin: string | null;
}

export type NuevoReclamo = Pick<Reclamo, 'titulo' | 'descripcion'>;
