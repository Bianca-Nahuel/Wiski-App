import { Component, inject, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Credenciales } from '../../core/models';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Prototipo: las credenciales del usuario demo vienen precargadas.
  protected readonly credenciales = signal<Credenciales>({
    email: 'propietario@wiski.app',
    password: 'wiski1234',
  });

  protected readonly loginForm = form(this.credenciales, (campos) => {
    required(campos.email, { message: 'Ingresá tu mail.' });
    email(campos.email, { message: 'El mail no es válido.' });
    required(campos.password, { message: 'Ingresá tu contraseña.' });
  });

  protected readonly errorLogin = signal(false);

  protected ingresar(event: Event): void {
    event.preventDefault();
    this.errorLogin.set(false);
    submit(this.loginForm, async () => {
      try {
        await this.auth.login(this.credenciales());
        await this.router.navigateByUrl('/tablero');
      } catch {
        this.errorLogin.set(true);
      }
    });
  }
}
