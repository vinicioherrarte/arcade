import LibraryView from "@/app/components/library-view";
import { CATS, GAMES } from "@/app/data/games";

// Biblioteca (app/references/biblioteca.jsx): hero, buscador, chips y grid de tarjetas.
export default function Games() {
  return (
    <div className="fade-in">
      <section className="av-hero">
        <h1 className="flicker">ARCADE VAULT</h1>
        <div className="sub">
          INSERTA UNA MONEDA PARA JUGAR <span className="blink">_</span>
        </div>
      </section>
      <LibraryView games={GAMES} cats={CATS} />
    </div>
  );
}
