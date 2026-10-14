import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Ingresar | Wiski',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tablero' },
      {
        path: 'tablero',
        title: 'Tablero | Wiski',
        loadComponent: () => import('./features/tablero/tablero').then((m) => m.Tablero),
      },
      {
        path: 'gastos',
        title: 'Gastos | Wiski',
        loadComponent: () => import('./features/gastos/gastos').then((m) => m.Gastos),
      },
      {
        path: 'documentos',
        title: 'Documentos | Wiski',
        loadComponent: () => import('./features/documentos/documentos').then((m) => m.Documentos),
      },
      {
        path: 'reclamos',
        title: 'Reclamos | Wiski',
        loadComponent: () => import('./features/reclamos/reclamos').then((m) => m.Reclamos),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
