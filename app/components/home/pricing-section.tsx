import Link from "next/link";
import { FAQS } from "@/app/data/home";

// Sección "PRECIOS" (home.jsx, PRICING). Los puntos del plan están ajustados a lo que
// existe hoy: sin ranking global, sin guardado de puntuaciones y sin promesa de juegos nuevos.
const PLAN_POINTS = [
  "Acceso a todos los juegos",
  "Puedes jugar como invitado",
  "Sin descargas ni instalación",
  "Funciona en cualquier navegador",
];

export default function PricingSection() {
  return (
    <section className="home-section">
      <div className="section-head">
        <div className="kicker pixel neon-green">{"// 04"}</div>
        <h2 className="section-title">PRECIOS</h2>
        <div className="section-rule"></div>
      </div>
      <div className="pricing-grid">
        <div className="price-card">
          <div className="pc-label pixel">PLAN ÚNICO</div>
          <div className="pc-name pixel">JUGADOR VAULT</div>
          <div className="pc-amount">
            <span className="pc-amount-n">$0</span>
            <span className="pc-amount-u">/ SIEMPRE</span>
          </div>
          <div className="pc-tag">SIN TRUCOS · SIN LETRA PEQUEÑA</div>
          <ul className="pc-list">
            {PLAN_POINTS.map((p) => (
              <li key={p}>✔ {p}</li>
            ))}
          </ul>
          <Link className="btn xl pulse" href="/acceso" style={{ width: "100%" }}>EMPEZAR GRATIS →</Link>
          <div className="pc-foot">No pedimos tarjeta. Nunca lo haremos.</div>
          <div className="pc-stamp pixel">FREE<br />PLAY</div>
        </div>

        <div className="pricing-faq">
          {FAQS.map((f) => (
            <div key={f.question} className="faq-item">
              <div className="faq-q pixel">{f.question}</div>
              <div className="faq-a">{f.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
