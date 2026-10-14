import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Todo depende de la sesión (cookie), así que se renderiza por request y no se prerenderiza.
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
