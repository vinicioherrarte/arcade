# SPEC 02: Landing de inicio en `/` y biblioteca en `/games`

> **Estado:** aprobado
> **Depende de:** SPEC 01 (pantallas visuales, componentes de biblioteca, nav, datos de ejemplo y tokens de `app/globals.css`).
> **Fecha:** 2026-11-13
> **Objetivo:** Reemplazar la home actual por la landing de `app/references/home-about` y mover la biblioteca a `/games`.

---

## 1. Por qué existe esta spec

La spec 01 dejó la biblioteca en `/` y decidió no crear una ruta aparte para ella. La referencia `app/references/home-about` trae una landing (Inicio) distinta de la biblioteca, con su propio recorrido: la landing lleva a la biblioteca y a la cuenta. Con dos pantallas distintas, la biblioteca necesita su propia URL. Esta spec revierte esa decisión de la spec 01.

La referencia tiene además dos fuentes de problemas que esta spec resuelve:

- Usa colores hexadecimales directos (`#0a0a0f`, `#ff3060`, `#aa00ff`, `#ffcf3a`, `#00d4ff`) que no existen como tokens en `app/globals.css`. La spec 01 prohíbe colores fijos en componentes.
- Su copy afirma funciones que todavía no existen en el proyecto: guardar puntuaciones, ranking global, "12+ juegos" (el catálogo tiene 8) y nuevos juegos cada mes.

---

## 2. Alcance

**Dentro:**

- Landing en `/` con la estructura y el diseño visual de `app/references/home-about/home-about/home.jsx`:
  1. Hero con siluetas pixel decorativas, eyebrow "INSERTA UNA MONEDA", título "EL ARCADE CLÁSICO ESTÁ DE VUELTA", subtítulo y dos botones.
  2. Sección "¿POR QUÉ ARCADE VAULT?" con cuatro tarjetas e iconos pixel.
  3. Sección "JUEGOS DISPONIBLES AHORA" con riel de los primeros 6 juegos de `GAMES` y botón VER TODOS LOS JUEGOS.
  4. Bloque de estadísticas con tres cifras.
  5. Sección "ACTIVIDAD EN VIVO" con dos paneles: últimas puntuaciones y top jugadores, con datos de ejemplo fijos.
  6. Sección "PRECIOS" con la tarjeta de plan único y tres preguntas frecuentes.
  7. CTA final "¿LISTO PARA JUGAR?" con botón INSERTAR MONEDA.
- Biblioteca movida a `/games` con el contenido actual de la spec 01 (hero, buscador, chips y tarjetas), sin cambios funcionales.
- Nav global con los enlaces Inicio, Biblioteca y Salón de la Fama. Inicio apunta a `/`, Biblioteca a `/games`.
- Animaciones de entrada por scroll (`.reveal`) con `IntersectionObserver`, desactivadas bajo `prefers-reduced-motion: reduce`.
- Colores de la landing expresados como tokens en `app/globals.css`.
- Textos de la landing ajustados a lo que existe hoy (ver decisiones).

**Fuera de alcance (para specs futuras):**

- Página "Acerca de" (`about.jsx`), su ruta `/acerca` y su formulario de contacto. No se muestra el enlace en el nav.
- Guardado de puntuaciones, ranking global y datos reales de actividad. Los paneles usan datos de ejemplo fijos.
- Funciones de cuenta reales. Los botones "CREAR CUENTA" y "Iniciar Sesión" solo navegan a `/acceso`.
- Cualquier cambio a `GAMES`, a `seededScores` o a las pantallas de detalle, reproductor y salón.
- Modo claro y lectura de `prefers-color-scheme`.
- Pruebas automatizadas. El proyecto no tiene test runner.
- Página 404 personalizada.

---

## 3. Modelo de datos

Se agrega un archivo de datos de ejemplo para la landing. Los datos no cambian en ningún render.

```ts
// app/data/home.ts
import type { ScoreRow } from "@/app/data/types";

export type FeatureColor = "cyan" | "yellow" | "magenta" | "green";

export interface Feature {
  icon: "gamepad" | "free" | "trophy" | "rocket";
  title: string;
  text: string;
  color: FeatureColor;
}

export interface Stat {
  value: string;   // "8", "GRATIS", "2026"
  unit: string;    // "JUEGOS"
  caption: string; // "Y CONTANDO"
}

export interface LiveScore {
  player: string;
  game: string;    // título del juego, p. ej. "CAÍDA"
  score: number;
  ago: string;     // "hace 2 min"
  color: FeatureColor;
}

export interface TopPlayer {
  rank: number;
  player: string;
  score: number;
}

export interface Faq {
  question: string;
  answer: string;
}
```

Archivo de datos: `app/data/home.ts` exporta `FEATURES: Feature[]`, `STATS: Stat[]`, `LIVE_SCORES: LiveScore[]`, `TOP_PLAYERS: TopPlayer[]` y `FAQS: Faq[]`.

Convenciones:

- `LIVE_SCORES` y `TOP_PLAYERS` son datos fijos. No se usa `Date.now()` ni `Math.random()`.
- Los valores numéricos se formatean con `toLocaleString("es-ES")` al mostrarlos.
- `ScoreRow` de `app/data/types.ts` no se usa aquí. Los paneles de la landing usan `LiveScore` y `TopPlayer`.

Componentes nuevos en `app/components/home/`:

- `hero.tsx`: hero con siluetas pixel (SVG decorativos de la referencia, `aria-hidden`).
- `feature-grid.tsx`, `game-rail.tsx`, `stats-block.tsx`, `activity-panels.tsx`, `pricing-section.tsx`, `final-cta.tsx`.
- `reveal.tsx` (cliente): envuelve secciones con `.reveal` y `IntersectionObserver`.

Los componentes que usan `IntersectionObserver` o `useRouter` llevan `"use client"`. El resto es de servidor.

---

## 4. Plan de implementación

1. Agregar tokens en `app/globals.css` dentro de `:root` y `@theme inline`: `--void` (`#0a0a0f`), `--red-hot` (`#ff3060`), `--violet` (`#aa00ff`), `--amber` (`#ffcf3a`), `--sky` (`#00d4ff`). Verificación: `grep` de hex en `app/references` no se usa en ningún archivo de `app/**/*.tsx` tras los pasos siguientes.
2. Mover la biblioteca: crear `app/games/page.tsx` con el contenido actual de `app/page.tsx` (hero y `LibraryView`). Verificación: `/games` muestra las ocho tarjetas y los filtros funcionan igual que en la spec 01.
3. Crear `app/data/home.ts` con los datos de la sección 3. Verificación: `npx tsc --noEmit` termina sin errores.
4. Crear `app/components/home/reveal.tsx` (cliente). Si `prefers-reduced-motion: reduce` está activo, las secciones se muestran sin animación. Verificación: con el modo reducido activo, las secciones son visibles sin scroll.
5. Crear los componentes de `app/components/home/` y las clases de la landing en `app/globals.css`, portadas de `app/references/home-about/home-about/styles.css`, con los colores ya convertidos a tokens. Verificación: `/` renderiza las siete secciones sin errores en consola.
6. Reemplazar `app/page.tsx` por la landing que compone los componentes de `app/components/home/`. Verificación: `/` muestra el hero y los botones EXPLORAR JUEGOS (a `/games`) y CREAR CUENTA (a `/acceso`).
7. Actualizar `app/components/nav.tsx`: enlaces Inicio (`/`), Biblioteca (`/games`) y Salón de la Fama (`/salon`). El estado activo se calcula con `usePathname`: Biblioteca queda activo también en `/juego/*`. Actualizar el menú móvil igual. Verificación: el enlace de la página actual tiene la clase de estado activo.
8. Actualizar las referencias internas de la spec 01: las tarjetas de la biblioteca siguen llevando a `/juego/{id}`, y el botón VOLVER del detalle lleva a `/games`. Verificación: VOLVER en `/juego/caida` navega a `/games`.
9. Revisar el texto "Create Next App" y los hex en `app/**/*.tsx`. Verificación: `grep` sin resultados.

---

## 5. Criterios de aceptación

**Calidad y build**

- [ ] `npm run build` termina sin errores.
- [ ] `npm run lint` termina sin errores.
- [ ] `npx tsc --noEmit` termina sin errores.
- [ ] `grep` de colores hexadecimales en `app/**/*.tsx` no devuelve resultados.
- [ ] `grep` de `setInterval`, `setTimeout` y `localStorage` en `app/**/*.tsx` no devuelve resultados. Excepción: ninguna.
- [ ] No hay errores en la consola del navegador en `/` ni en `/games`.

**Rutas**

- [ ] `/` muestra la landing con el hero "EL ARCADE CLÁSICO ESTÁ DE VUELTA".
- [ ] `/games` muestra el hero "ARCADE VAULT" y las ocho tarjetas.
- [ ] `/acerca` responde 404 o página de no encontrado. No existe en esta spec.

**Landing (`/`)**

- [ ] Aparecen en orden las siete secciones: hero, "¿POR QUÉ ARCADE VAULT?", "JUEGOS DISPONIBLES AHORA", estadísticas, "ACTIVIDAD EN VIVO", "PRECIOS" y "¿LISTO PARA JUGAR?".
- [ ] La sección "¿POR QUÉ ARCADE VAULT?" muestra cuatro tarjetas con sus iconos.
- [ ] El riel de juegos muestra exactamente 6 tarjetas: las primeras 6 de `GAMES`. Clic en una tarjeta navega a `/juego/{id}`.
- [ ] El botón VER TODOS LOS JUEGOS navega a `/games`.
- [ ] El bloque de estadísticas muestra la cifra "8" con la unidad "JUEGOS".
- [ ] El panel de últimas puntuaciones muestra 7 filas con datos fijos. El panel de top jugadores muestra 5 filas numeradas `#01` a `#05`.
- [ ] El botón VER SALÓN del panel de top jugadores navega a `/salon`.
- [ ] La tarjeta de precios muestra "$0" y el texto "SIN TRUCOS · SIN LETRA PEQUEÑA".
- [ ] La sección de preguntas frecuentes muestra tres preguntas.
- [ ] El botón INSERTAR MONEDA del CTA final navega a `/games`.
- [ ] Con `prefers-reduced-motion: reduce` activo, ninguna sección tiene la clase `.reveal` sin la clase `in` después de cargar.

**Nav**

- [ ] En escritorio, la barra muestra logo, enlaces Inicio, Biblioteca y Salón de la Fama, "CRÉDITOS · 03" y el botón "Iniciar Sesión".
- [ ] No aparece ningún enlace a "Acerca de".
- [ ] En `/`, el enlace Inicio tiene la clase de estado activo. En `/juego/caida`, el enlace Biblioteca la tiene.
- [ ] A 360px de ancho, el botón ≡ abre el panel lateral con Inicio, Biblioteca, Salón de la Fama e Iniciar Sesión, y el botón de cierre lo oculta.
- [ ] A 360px de ancho, `document.documentElement.scrollWidth` es igual a `clientWidth` en `/`, `/games`, `/juego/caida`, `/salon` y `/acceso`.

---

## 6. Decisiones tomadas y descartadas

- **Sí: landing en `/` y biblioteca en `/games`.** No: landing en `/inicio` con la biblioteca en `/`. Dos pantallas de entrada con roles poco claros. Esto revierte la decisión de la spec 01 de no crear una ruta aparte para la biblioteca.
- **Sí: Acerca de fuera de esta spec.** No: portar `about.jsx` ahora. Trae un formulario de contacto y su propia ruta, y no hay backend para enviarlo. Se agrega en una spec propia.
- **Sí: copy ajustado a lo que existe.** "8 juegos" en lugar de "12+", y sin prometer guardado ni ranking global. No: copiar el texto de la referencia sin cambios, porque prometería funciones que no existen. Si se prefiere el texto literal, se revierte solo la cadena en `app/data/home.ts` y en el componente de hero.
- **Sí: estructura y diseño visual de la referencia.** Se conservan las siete secciones, las siluetas pixel y las animaciones.
- **Sí: colores como tokens.** No: hex directos en componentes, aunque la referencia los use. La spec 01 lo prohíbe.
- **Sí: datos de actividad fijos en `app/data/home.ts`.** No: un servicio ni `Math.random()`. Así el render es determinista y coincide con la regla de la spec 01.
- **Sí: animación de entrada con `IntersectionObserver` y `prefers-reduced-motion`.** No: animaciones sin control de movimiento reducido.
- **Sí: el botón CREAR CUENTA lleva a `/acceso`.** No: un flujo de registro. La autenticación sigue fuera del MVP.

---

## 7. Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Mover la biblioteca a `/games` rompe enlaces existentes a `/`. | Revisar todos los `href` y `navigate` del proyecto en el paso 8. Los criterios de la spec 01 para la biblioteca en `/` pasan a `/games`. |
| Las siluetas SVG y las animaciones pueden degradar el rendimiento en móvil. | Las siluetas son SVG de pocos rectángulos. Las animaciones solo usan `transform` y `opacity`. |
| El texto de la referencia puede ser ancho en Press Start 2P a 360px. | Revisar a 360px en el paso 5. Si hay desborde, reducir tamaño con clases de Tailwind. |
| La copia ajustada puede no coincidir con lo que el equipo quiere publicar. | La decisión está registrada en la sección 6 y es reversible en `app/data/home.ts`. |

---

## Lo que no está en esta spec

- Página Acerca de y formulario de contacto.
- Guardado de puntuaciones y ranking global.
- Datos reales de actividad.
- Autenticación real.
- Modo claro.
- Pruebas automatizadas.

Cada uno de estos puntos, si entra al proyecto, va en su propia spec.
