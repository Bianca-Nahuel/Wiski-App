import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly usuario = this.auth.usuario;

  protected readonly secciones = [
    { ruta: '/tablero', etiqueta: 'Tablero' },
    { ruta: '/gastos', etiqueta: 'Gastos' },
    { ruta: '/documentos', etiqueta: 'Documentos' },
    { ruta: '/reclamos', etiqueta: 'Reclamos' },
  ];

  protected salir(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
