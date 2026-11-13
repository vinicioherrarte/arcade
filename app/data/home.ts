// Datos de ejemplo de la landing (app/references/home-about/home-about/home.jsx).
// Son fijos: no se usa Date.now() ni Math.random(). El copy está ajustado a lo que
// existe hoy (ver SPEC 02, sección 6).

export type FeatureColor = "cyan" | "yellow" | "magenta" | "green";

export interface Feature {
  icon: "gamepad" | "free" | "trophy" | "rocket";
  title: string;
  text: string;
  color: FeatureColor;
}

export interface Stat {
  value: string;   // "8", "GRATIS", "HTML"
  unit: string;    // "JUEGOS"
  caption: string; // "EN LA BIBLIOTECA"
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

export const FEATURES: Feature[] = [
  {
    icon: "gamepad",
    title: "JUEGOS CLÁSICOS",
    text: "Bloque Buster, Caída, Serpentina y más arcades de siempre, en un solo lugar.",
    color: "cyan",
  },
  {
    icon: "free",
    title: "100% GRATIS",
    text: "Sin suscripciones, sin pagos ocultos. Todos los juegos disponibles de forma gratuita.",
    color: "yellow",
  },
  {
    icon: "trophy",
    title: "SALÓN DE LA FAMA",
    text: "Cada juego tiene su salón. Intenta llegar al primer puesto.",
    color: "magenta",
  },
  {
    icon: "rocket",
    title: "SIEMPRE CRECIENDO",
    text: "Vendrán más juegos a la biblioteca. Vuelve seguido y siempre habrá algo nuevo.",
    color: "green",
  },
];

export const STATS: Stat[] = [
  { value: "8", unit: "JUEGOS", caption: "EN LA BIBLIOTECA" },
  { value: "GRATIS", unit: "PARA SIEMPRE", caption: "SIN COSTO OCULTO" },
  { value: "HTML", unit: "EN EL NAVEGADOR", caption: "SIN DESCARGAS" },
];

export const LIVE_SCORES: LiveScore[] = [
  { player: "NEONFOX", game: "CAÍDA", score: 184220, ago: "hace 2 min", color: "magenta" },
  { player: "PX_KAI", game: "GLOTÓN", score: 96400, ago: "hace 5 min", color: "yellow" },
  { player: "Z3R0COOL", game: "INVASORES", score: 54190, ago: "hace 8 min", color: "green" },
  { player: "VAULT_07", game: "ROCAS", score: 41200, ago: "hace 12 min", color: "cyan" },
  { player: "GLITCHA", game: "BLOQUE BUSTER", score: 28450, ago: "hace 18 min", color: "cyan" },
  { player: "ARKADYA", game: "SERPENTINA", score: 7820, ago: "hace 24 min", color: "green" },
  { player: "CYBER_LU", game: "RANARIA", score: 18900, ago: "hace 31 min", color: "yellow" },
];

export const TOP_PLAYERS: TopPlayer[] = [
  { rank: 1, player: "NEONFOX", score: 312840 },
  { rank: 2, player: "PX_KAI", score: 248110 },
  { rank: 3, player: "M00NRYU", score: 196720 },
  { rank: 4, player: "VAULT_07", score: 154300 },
  { rank: 5, player: "GLITCHA", score: 138900 },
];

export const FAQS: Faq[] = [
  {
    question: "¿REALMENTE ES GRATIS?",
    answer: "Sí. Arcade Vault es un proyecto sin fines de lucro hecho por amor a los clásicos. No hay versión \"premium\" escondida.",
  },
  {
    question: "¿NECESITO CREAR CUENTA?",
    answer: "No. Puedes explorar y jugar sin cuenta. El registro se activará cuando existan las puntuaciones guardadas.",
  },
  {
    question: "¿CÓMO SOBREVIVEN SIN COBRAR?",
    answer: "Es un proyecto comunitario. Si te gusta, compártelo. Esa es toda la moneda que aceptamos.",
  },
];
