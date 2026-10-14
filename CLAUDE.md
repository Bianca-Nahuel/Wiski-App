# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Wiski App ("Consorcios Transparentes"): plataforma para consorcios de edificios. Hoy es un **prototipo en Angular 22 con SSR** cuyos servicios consumen JSON mockeado; el objetivo es poder apuntarlos al backend real cambiando lo mínimo posible.

La referencia visual y funcional es [docs/prototipo/wiski-full.html](docs/prototipo/wiski-full.html) (HTML estático con Tailwind por CDN). Ese prototipo solo define el Tablero; el resto de las pantallas extrapolan su estilo.

**Ante cualquier duda de diseño (visual, UX, alcance de una pantalla, modelo de datos que el prototipo no define), preguntar al usuario antes de inventar.**

## Alcance actual

- Solo la **vista de propietario** (sin vista de administrador por ahora).
- Pantallas: Login, Tablero, Gastos, Documentos, Reclamos.
- El login es simulado: formulario mail/contraseña con el usuario demo precargado; alcanza con apretar "Ingresar". Aun así el acceso está protegido con guards reales.
- Botones sin destino todavía (no inventarles comportamiento): "Certificá Wiski", "Iniciar Certificación", "Ver Docs" / "Auditar" de cada gasto. Los documentos mock tienen `url: null`.

## Comandos

```bash
npm start                                  # ng serve (dev, con SSR) → http://localhost:4200
npm run build                              # build de producción (browser + server) en dist/wiski-app
npm run serve:ssr:wiski-app                # levanta el server Express ya buildeado (PORT, default 4000)
npm test                                   # Vitest vía @angular/build:unit-test (modo watch)
npx ng test --no-watch                     # una sola corrida
npx ng test --include src/app/app.spec.ts  # un archivo de test
npx ng test --filter "should create"       # tests por nombre
npx prettier --write .                     # formateo (no hay linter configurado)
```

Los specs usan globals de Vitest (`describe`, `it`, `expect`) con jsdom, no Jasmine/Karma.

## Estructura

```
public/mock/*.json     datos mockeados, uno por recurso
src/app/core/api       API_CONFIG + injectApiUrl (de dónde salen los datos)
src/app/core/auth      AuthService (sesión) + authGuard / guestGuard
src/app/core/models    interfaces del dominio (un solo index.ts)
src/app/core/services  un servicio por recurso, expone un httpResource
src/app/layout         Shell: navbar + banner + <router-outlet> de las rutas protegidas
src/app/features/*     una carpeta por pantalla (ruta lazy)
src/app/shared         componentes y pipes reutilizados entre pantallas
```

## Convenciones de Angular (obligatorias)

Usar la forma moderna de Angular 22; no introducir patrones legacy:

- Componentes standalone, sin NgModules. Archivos y clases de componentes sin sufijo (`tablero.ts` → `Tablero`); servicios, guards y pipes sí llevan sufijo (`gastos.service.ts`, `auth.guards.ts`, `monto-compacto.pipe.ts`).
- Estado con **signals** (`signal`, `computed`, `linkedSignal`, `input()`, `output()`); RxJS solo donde haya streams reales.
- Carga de datos con **`httpResource`**, no `subscribe` manual en componentes.
- Formularios con **Signal Forms** (`form`, `submit`, validadores y la directiva `[formField]` de `@angular/forms/signals`), no Reactive ni Template-driven Forms. Ver `features/login` y `features/reclamos`.
- Control flow nativo (`@if`, `@for`, `@let`), `inject()` en vez de inyección por constructor.
- **Todas las rutas lazy** con `loadComponent` en `app.routes.ts`. Los query params llegan como `input()` (`withComponentInputBinding`).

## Capa de datos: mock hoy, backend mañana

Los componentes nunca saben de dónde vienen los datos: solo leen los resources de los servicios de `core/services`.

- Toda URL se arma con `injectApiUrl()` (`core/api/api.ts`): `url('gastos')` → `/mock/gastos.json`. Para pasar al backend se sobreescribe el token `API_CONFIG` en `app.config.ts` (`baseUrl` de la API, `suffix: ''`); hay un ejemplo comentado ahí.
- Agregar un recurso nuevo = JSON en `public/mock/`, interfaz en `core/models`, servicio con `httpResource` en `core/services`.
- No importar los JSON con `import` ni hardcodear datos en componentes o servicios.
- Dos puntos siguen siendo mock aunque cambie la URL y están marcados con un comentario `// Mock:` en el código: `AuthService.login` (hace GET sin validar credenciales; debe ser un POST) y `ReclamosService.crear` (agrega el reclamo solo en memoria; debe ser un POST + `reload()`).
- Los resources viven en servicios `providedIn: 'root'`, así que Tablero y la pantalla de cada sección comparten los mismos datos sin volver a pedirlos.

## Autenticación y SSR

- `outputMode: "server"` con Express en `src/server.ts`. Todas las rutas son `RenderMode.Server` (`app.routes.server.ts`) porque dependen de la sesión; no prerenderizar rutas protegidas.
- La sesión es una **cookie** (`wiski_token`), no `localStorage`, para que los guards corran igual en el server y en el browser: `AuthService` la lee del `REQUEST` durante el SSR y de `document.cookie` en el cliente. Sin cookie el server responde 302 a `/login`; con cookie, `/login` redirige a `/tablero`.
- `authGuard` protege el `Shell` y todas sus rutas hijas; las pantallas nuevas del área logueada van como hijas de esa ruta.
- El código de componentes y servicios corre también en Node: nada de `window`, `document` o `localStorage` directo (usar `DOCUMENT`, `isPlatformBrowser`, `afterNextRender`).
- Durante el SSR los mocks se piden por HTTP al propio servidor y se transfieren al cliente por hidratación.
- `angular.json` tiene `security.allowedHosts: []`; hay que completarlo antes de desplegar el server SSR.

## Diseño

- Estética **neobrutalista / pixel**: fondo blanco con grilla de puntos, bordes negros de 2px, sombras duras sin blur, sin border-radius, paleta blanco/negro con acentos mínimos (verde para verificado, rojo para alertas).
- Clases propias en `src/styles.css`: `brutal-box`, `brutal-button`, `brutal-button-outline`, `brutal-button-raise` (plano, gana relieve en hover; para los "Ver todo" al pie de una tarjeta), `brutal-input`, `pixel-corner`. Reutilizarlas antes de crear variantes. Interacción (decisión del usuario, difiere del prototipo): las tarjetas (`brutal-box`) son estáticas, sin efecto en hover porque marea; los botones **se levantan en hover y se hunden solo al hacer click** (`:active`).
- **Tailwind v4** vía PostCSS. No hay `tailwind.config.js`: los tokens se definen con `@theme` en `styles.css` (`font-sans` = Space Grotesk, `font-pixel` = Press Start 2P; montos en `font-mono`).
- Fuentes (Google Fonts) e iconos (Font Awesome 6.0.0) se cargan por CDN desde `src/index.html`, igual que en el prototipo; no instalarlos como dependencias.
- Textos de UI en español rioplatense (voseo: "Certificá", "Ingresá"). Locale `es-AR` registrado en `app.config.ts`; montos con `currency: 'ARS' : '$' : '1.0-0'`.
