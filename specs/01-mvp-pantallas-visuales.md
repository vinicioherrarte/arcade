# SPEC 01: MVP de pantallas visuales de Arcade Vault

> **Estado:** aprobado
> **Depende de:** Ninguna spec. Parte de la base visual ya presente en `app/layout.tsx`, `app/globals.css` y `app/page.tsx` (rama `01-styles`).
> **Fecha:** 2026-11-12
> **Objetivo:** Implementar en Next.js las cinco pantallas de `app/references` en su versión visual, sin lógica de juego, sin autenticación real y sin base de datos.

---

## 1. Por qué existe esta spec

`app/references` es un prototipo de React cargado por CDN y compilado en el navegador con Babel. Los nombres de sus archivos no coinciden con su contenido, así que el mapeo real es el siguiente:

| Archivo en `app/references` | Contenido real |
| --- | --- |
| `Arcade Vault.html` | Componentes `Library` y `GameCard` (biblioteca) |
| `app.jsx` | Documento HTML de entrada |
| `nav.jsx` | Router `App` y pie de página |
| `auth.jsx` | Componente `Nav` |
| `detalle.jsx` | Componente `Auth` (acceso) |
| `biblioteca.jsx` | Datos de ejemplo: `GAMES`, `CATS`, `seededScores` |
| `data.jsx` | Tema CSS (variables, clases de portadas, animaciones) |
| `salon.jsx` | Componente `GamePlayer` (reproductor) |
| `styles.css` | Componente `HallOfFame` (salón de la fama) |

Dos piezas que el router usa no existen en la carpeta: la pantalla de detalle (`GameDetail`) y el archivo `reproductor.jsx` que carga el HTML. Esta spec define la pantalla de detalle desde cero con el lenguaje visual existente.

El nombre del producto es **Arcade Vault** (README, referencias y `app/layout.tsx`). Esta spec no usa otro nombre.

---

## 2. Alcance

**Dentro:**

- Shell global: barra de navegación con logo, enlaces a Biblioteca y Salón de la Fama, indicador "CRÉDITOS · 03" estático, botón "Iniciar Sesión", menú hamburguesa en móvil y pie de página.
- Pantalla Biblioteca en `/`, con buscador y filtro por categoría sobre los datos de ejemplo.
- Pantalla Detalle de juego en `/juego/[id]`.
- Pantalla Reproductor en `/juego/[id]/jugar`, solo visual.
- Pantalla Acceso en `/acceso`, solo visual.
- Pantalla Salón de la Fama en `/salon`, con pestañas por juego.
- Datos de ejemplo tipados en `app/data/`.
- Estilos con Tailwind 4 y los tokens de `app/globals.css`. No se usan colores ni tipografías fijos en los componentes.

**Fuera de alcance (para specs futuras):**

- Lógica de juego: puntuación que sube sola, enemigos, colisiones, niveles, vidas que bajan.
- Guardar puntuaciones y leerlas del navegador (`localStorage` con la clave `av_scores`).
- Sesión de usuario, autenticación real, registro, Google o GitHub.
- Persistencia de usuario (`av_user`).
- Base de datos o API. Los datos viven en `app/data/` y se migrarán cuando exista una base de datos.
- Fila "Tu mejor marca" del salón, porque depende de una sesión.
- Modo claro y lectura de `prefers-color-scheme`.
- Pruebas automatizadas. El proyecto no tiene test runner configurado.
- Página 404 personalizada. Se usa la de Next.js.

---

## 3. Modelo de datos

Se introducen dos archivos de tipos y datos. Las claves de `Game` conservan los nombres de la referencia para que la comparación y la migración sean directas.

```ts
// app/data/types.ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export interface Game {
  id: string;          // slug de la URL, p. ej. "caida"
  title: string;       // p. ej. "CAÍDA"
  short: string;       // descripción de la tarjeta
  long: string;        // descripción de la pantalla de detalle
  cat: Category;
  cover?: string;      // clase CSS de portada; si falta, se usa "cover-bricks"
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number;        // mejor puntuación de ejemplo
  plays: string;       // partidas ya formateadas, p. ej. "31.8K"
}

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string;        // DD/MM/AAAA
}
```

Archivos de datos:

- `app/data/games.ts` exporta `GAMES: Game[]` con los ocho juegos de la referencia (`bloque-buster`, `caida`, `serpentina`, `gloton`, `invasores`, `rocas`, `ranaria`, `duelo-pixel`) y `CATS` con `["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]`. `TODOS` es un filtro de interfaz, no una `Category`.
- `app/data/scores.ts` exporta `seededScores(seed: number, count: number): ScoreRow[]`, portado de la referencia. Es determinista: el mismo `seed` y `count` siempre devuelven las mismas filas.

Convenciones:

- `Game.best` y `ScoreRow.score` son números enteros. Se formatean con `toLocaleString("es-ES")` al mostrarlos.
- Las fechas son cadenas fijas de ejemplo. No se usa `Date.now()` ni `Math.random()` en ningún render.

Componentes nuevos (carpeta `app/components/`): `nav.tsx`, `footer.tsx`, `library-view.tsx`, `game-card.tsx`, `player-view.tsx`, `auth-form.tsx`, `hall-of-fame.tsx`. Los archivos que usan estado del navegador llevan `"use client"`.

---

## 4. Plan de implementación

1. Crear `app/data/types.ts` y `app/data/games.ts` con los ocho juegos y `CATS`, copiados de `app/references/biblioteca.jsx`. Verificación: `npx tsc --noEmit` termina sin errores.
2. Crear `app/data/scores.ts` con `seededScores` tipado y determinista. Verificación: `npx tsc --noEmit` termina sin errores.
3. Crear `app/components/nav.tsx` (cliente) con logo, enlaces Biblioteca y Salón de la Fama con estado activo según `usePathname`, "CRÉDITOS · 03", botón "Iniciar Sesión" y menú móvil con panel lateral. Crear `app/components/footer.tsx`. Integrar ambos en `app/layout.tsx` alrededor de `<main className="av-main">{children}</main>`. Verificación: la barra y el pie aparecen en `/` y el menú móvil abre y cierra.
4. Crear `app/components/game-card.tsx` (cliente, con efecto de inclinación solo bajo `(hover: hover)`) y `app/components/library-view.tsx` (cliente, con buscador y chips de categoría). Reemplazar el contenido de `app/page.tsx` para que renderice `LibraryView` con `GAMES` y `CATS`. Verificación: en `/` se ven las ocho tarjetas y el buscador y los chips filtran la lista.
5. Crear `app/juego/[id]/page.tsx` con la pantalla de detalle: portada, título, categoría, descripción larga, mejor puntuación, número de partidas, botón JUGAR (a `/juego/[id]/jugar`) y botón VOLVER (a `/`). Si el `id` no existe en `GAMES`, llamar a `notFound()`. Verificación: `/juego/caida` muestra sus datos y `/juego/no-existe` responde 404.
6. Crear `app/juego/[id]/jugar/page.tsx` y `app/components/player-view.tsx` (cliente) con HUD, marco CRT, arena estática, botones PAUSA, FIN y SALIR. PAUSA y FIN solo alternan overlays visuales. SALIR vuelve a `/juego/[id]`. Verificación: los botones cambian la vista y la puntuación mostrada no cambia con el tiempo.
7. Crear `app/acceso/page.tsx` y `app/components/auth-form.tsx` (cliente) con las pestañas INICIAR SESIÓN y CREAR CUENTA, los campos, el botón de invitado y los botones sociales. El envío del formulario no hace nada. Verificación: cambiar a CREAR CUENTA muestra el campo "Correo electrónico" y el envío no navega ni guarda datos.
8. Crear `app/salon/page.tsx` y `app/components/hall-of-fame.tsx` (cliente) con pestañas por juego, podio de tres puestos y tabla de 12 filas ordenadas por puntuación descendente. Verificación: cambiar de pestaña recalcula la tabla y el podio.

---

## 5. Criterios de aceptación

**Calidad y build**

- [ ] `npm run build` termina sin errores.
- [ ] `npm run lint` termina sin errores.
- [ ] `npx tsc --noEmit` termina sin errores.
- [ ] El texto "Create Next App" no aparece en ninguna página.
- [ ] `grep` de colores hexadecimales en `app/**/*.tsx` no devuelve resultados. Los colores vienen de los tokens de `app/globals.css`.
- [ ] `grep` de `setInterval`, `setTimeout` y `localStorage` en `app/**/*.tsx` no devuelve resultados.

**Shell global**

- [ ] En escritorio, la barra muestra logo, enlaces Biblioteca y Salón de la Fama, "CRÉDITOS · 03" y el botón "Iniciar Sesión".
- [ ] El enlace de la página actual aparece con la clase de estado activo.
- [ ] A 360px de ancho, el botón ≡ abre un panel lateral con Biblioteca, Salón de la Fama e Iniciar Sesión, y el botón de cierre lo oculta.
- [ ] A 360px de ancho, `document.documentElement.scrollWidth` es igual a `clientWidth` en todas las pantallas.

**Biblioteca (`/`)**

- [ ] La página muestra el hero "ARCADE VAULT" y el subtítulo "INSERTA UNA MONEDA PARA JUGAR".
- [ ] Hay chips TODOS, ARCADE, PUZZLE, SHOOTER y VERSUS. El chip activo tiene la clase `active`.
- [ ] Escribir "serpen" en el buscador deja solo la tarjeta SERPENTINA.
- [ ] Elegir SHOOTER muestra exactamente INVASORES y ROCAS.
- [ ] Escribir "zzz" en el buscador muestra "NO HAY RESULTADOS" y "Intenta otra búsqueda o categoría.".
- [ ] Las ocho tarjetas se renderizan con su portada `cover-*` y sin errores en consola.
- [ ] Al pasar el puntero sobre una tarjeta en un dispositivo con `(hover: hover)`, su `transform` cambia. Al salir, vuelve a su valor original.
- [ ] Al hacer clic en una tarjeta o en JUGAR, la URL cambia a `/juego/{id}`.

**Detalle (`/juego/[id]`)**

- [ ] `/juego/caida` muestra "CAÍDA", la categoría "PUZZLE", la descripción larga y la mejor puntuación "184.220".
- [ ] `/juego/no-existe` muestra la página de no encontrado (el cuerpo contiene "This page could not be found"). El código HTTP es 200 en la primera visita y 404 en las siguientes. Excepción aceptada, ver sección 6.
- [ ] El botón JUGAR navega a `/juego/caida/jugar`.

**Reproductor (`/juego/[id]/jugar`)**

- [ ] El HUD muestra Jugador "INVITADO", Puntuación "0", Vidas "♥ ♥ ♥" y Nivel "01".
- [ ] La puntuación mostrada sigue en 0 después de 10 segundos sin interacción.
- [ ] PAUSA muestra el overlay "EN PAUSA" y su texto cambia a REANUDAR. REANUDAR oculta el overlay.
- [ ] FIN abre el modal "FIN DEL JUEGO" con la puntuación final fija.
- [ ] GUARDAR PUNTUACIÓN no escribe en `localStorage` ni hace peticiones de red.
- [ ] SALIR navega a `/juego/[id]`.

**Acceso (`/acceso`)**

- [ ] Las pestañas INICIAR SESIÓN y CREAR CUENTA cambian el texto del botón principal.
- [ ] CREAR CUENTA muestra el campo "Correo electrónico". INICIAR SESIÓN lo oculta.
- [ ] Enviar el formulario no navega, no escribe en `localStorage` y no hace peticiones de red.
- [ ] JUGAR COMO INVITADO navega a `/`.
- [ ] Los botones GOOGLE y GITHUB se renderizan y no hacen nada.

**Salón de la Fama (`/salon`)**

- [ ] La página muestra el título "SALÓN DE LA FAMA" y un botón por cada juego de `GAMES`.
- [ ] El podio muestra los puestos 01 (CAMPEÓN), 02 y 03.
- [ ] La tabla muestra 12 filas ordenadas por puntuación de mayor a menor, con rango de dos dígitos.
- [ ] Cambiar de pestaña recalcula el podio y la tabla para el juego elegido.
- [ ] El botón VOLVER A LA BIBLIOTECA navega a `/`.

---

## 6. Decisiones tomadas y descartadas

- **Sí: Next.js App Router con componentes TSX.** No: copiar el prototipo tal cual con React por CDN y Babel en el navegador. No encaja con el stack del proyecto, con Tailwind 4 ni con `cacheComponents`.
- **Sí: rutas reales de Next.js.** No: navegación por hash (`#`) como en el prototipo. Las rutas reales tienen URL propia, se pueden compartir y funcionan con el enrutamiento de Next.js.
- **Sí: la biblioteca vive en `/`.** No: una ruta `/biblioteca` con el mismo contenido. Evita dos URLs para una misma pantalla.
- **Sí: datos en `app/data/` como módulos TypeScript tipados.** No: archivos JSON, que no tienen tipos en tiempo de compilación. No: una base de datos ahora, porque es un alcance futuro.
- **Sí: conservar las claves de la referencia (`title`, `short`, `cat`, `best`, etc.).** Facilita portar el código y comparar cada pantalla con su original.
- **Sí: reproductor solo visual, con PAUSA y FIN como overlays de estado local.** No: un contador de puntuación simulado ni animaciones de juego. El alcance pidió solo la parte visual, y la lógica de juego queda para una spec propia.
- **Sí: detalle diseñado con el lenguaje visual existente.** No: omitir la pantalla. El router la usa para llegar al reproductor, así que sin ella el flujo se rompe.
- **Sí: aceptar el 200 en la primera visita a un id desconocido de `/juego/[id]` y `/juego/[id]/jugar`.** No: agregar `proxy.ts` para devolver 404 real. Con `cacheComponents`, Next 16 sirve un App Shell para parámetros no generados, `dynamicParams` no está permitido, y el 404 solo se entrega en visitas posteriores. Se documenta como excepción; el cuerpo de la página sí es la de no encontrado.
- **Sí: acceso visual sin sesión.** No: `localStorage` con un usuario simulado. La autenticación se pospone por decisión del usuario.
- **Sí: salón sin la fila "Tu mejor marca".** No: mostrarla con datos falsos. Depende de una sesión que no existe en este MVP.
- **Sí: solo modo oscuro.** No: `prefers-color-scheme`. La referencia no define un tema claro y `globals.css` ya fija `color-scheme: dark`.
- **Sí: búsqueda y filtro de categoría en la biblioteca como estado de interfaz en el cliente.** No: consultas a un servidor. Los datos son estáticos y el filtro es instantáneo.
- **Sí: portada de respaldo para juegos sin `cover`.** No: dejar la clase `undefined`. Ninguno de los ocho juegos de la referencia carece de portada, así que la regla es defensiva.
- **Sí: portar los ocho juegos de la referencia.** No: solo los tres mencionados en una versión anterior de esta sección. La sección se corrigió en la rama `spec-01-mvp-pantallas-visuales` tras revisar `biblioteca.jsx`, y el tipo de color incluye `green`.
- **Sí: la carpeta `app/references` se queda donde está y no se importa.** No: moverla a la raíz del repo. Sin `page.tsx`, App Router no la trata como ruta.
- **Sí: idioma de la spec en español, estado "Borrador".** El proyecto, el README y la referencia están en español. Esta es la primera spec del repo, así que no hay convención previa que seguir.

---

## 7. Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| En Next.js 16 los `params` de las rutas dinámicas son asíncronos. Acceder a `params.id` sin `await` falla. | Usar `params: Promise<{ id: string }>` y `await params`, tal como indica la guía en `node_modules/next/dist/docs/`. Leer esa guía antes de escribir las páginas. |
| Con `cacheComponents` activo, un `Math.random()` o `Date.now()` en el render rompe el prerender. | `seededScores` es determinista y las fechas son cadenas fijas. El paso 2 y el criterio de `grep` lo controlan. |
| La fuente Press Start 2P es ancha. Los títulos largos pueden desbordar a 360px. | Revisar a 360px en el paso 4 y en el paso 8. Si hay desborde, reducir el tamaño con clases de Tailwind, no con valores fijos. |
| El efecto de inclinación no tiene sentido sin puntero. | Limitarlo con `(hover: hover)`. En táctil, la tarjeta solo responde a clic. |
| Los nombres de archivo de la referencia no coinciden con su contenido. Portar el archivo equivocado produce una pantalla incorrecta. | El mapeo de la sección 1 es la fuente de verdad. Portar siempre por contenido, no por nombre. |

---

## Lo que no está en esta spec

- Lógica de juego de ningún tipo.
- Guardado de puntuaciones y del usuario en el navegador.
- Autenticación real.
- Base de datos o API.
- Modo claro.
- Pruebas automatizadas.

Cada uno de estos puntos, si entra al proyecto, va en su propia spec.
