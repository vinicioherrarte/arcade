import Link from "next/link";
import { LIVE_SCORES, TOP_PLAYERS } from "@/app/data/home";

// Sección "ACTIVIDAD EN VIVO" (home.jsx, RECENT ACTIVITY). Datos de ejemplo fijos.
export default function ActivityPanels() {
  return (
    <section className="home-section">
      <div className="section-head">
        <div className="kicker pixel neon-yellow">{"// 03"}</div>
        <h2 className="section-title">ACTIVIDAD EN VIVO</h2>
        <div className="section-rule"></div>
      </div>
      <div className="activity-grid">
        <div className="activity-card">
          <div className="ac-head">
            <div className="ac-title pixel">▸ ÚLTIMAS PUNTUACIONES</div>
          </div>
          <div className="ticker">
            {LIVE_SCORES.map((r, i) => (
              <div key={`${r.player}-${i}`} className="tick-row" style={{ animationDelay: `${i * 60}ms` }}>
                <span className={`tk-p neon-${r.color}`}>{r.player}</span>
                <span className="tk-mid">▸ {r.game}</span>
                <span className="tk-s">+{r.score.toLocaleString("es-ES")}</span>
                <span className="tk-t">{r.ago}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-card">
          <div className="ac-head">
            <div className="ac-title pixel neon-magenta">▸ TOP JUGADORES · HOY</div>
            <Link className="lb-link" href="/salon">VER SALÓN →</Link>
          </div>
          <div className="top-list">
            {TOP_PLAYERS.map((r, i) => (
              <div key={r.rank} className={`top-row${i < 3 ? ` top${i + 1}` : ""}`}>
                <span className="tp-rk">#{String(r.rank).padStart(2, "0")}</span>
                <span className="tp-bar">
                  <span className="tp-fill" style={{ width: `${100 - i * 16}%` }}></span>
                </span>
                <span className="tp-p">{r.player}</span>
                <span className="tp-s">{r.score.toLocaleString("es-ES")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
