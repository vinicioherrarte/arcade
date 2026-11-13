import { STATS } from "@/app/data/home";

// Bloque de estadísticas (home.jsx, STATS). Usa el tono amarillo de la referencia.
export default function StatsBlock() {
  return (
    <section className="home-stats">
      <div className="stats-inner">
        {STATS.map((st, i) => (
          <div key={st.unit} className="stat-block" style={{ transitionDelay: `${i * 90}ms` }}>
            <div className="stat-n neon-yellow">{st.value}</div>
            <div className="stat-u pixel">{st.unit}</div>
            <div className="stat-s">{st.caption}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
