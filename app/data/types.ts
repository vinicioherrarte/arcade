export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export interface Game {
  id: string; // slug de la URL, p. ej. "caida"
  title: string; // p. ej. "CAÍDA"
  short: string; // descripción de la tarjeta
  long: string; // descripción de la pantalla de detalle
  cat: Category;
  cover?: string; // clase CSS de portada; si falta, se usa "cover-bricks"
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number; // mejor puntuación de ejemplo
  plays: string; // partidas ya formateadas, p. ej. "31.8K"
}

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string; // DD/MM/AAAA
}
