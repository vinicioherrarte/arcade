import Link from "next/link";
import { notFound } from "next/navigation";
import { GAMES } from "@/app/data/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  return (
    <div className="av-detail fade-in">
      <div className="detail-cover">
        <div className={"cover-bg " + (game.cover ?? "cover-bricks")}></div>
      </div>
      <div className="detail-info">
        <div className="detail-tags">
          <span>{game.cat}</span>
        </div>
        <h2>{game.title}</h2>
        <p>{game.long}</p>
        <div className="stat-strip">
          <div>
            <div className="l">Mejor puntuación</div>
            <div className="v">{game.best.toLocaleString("es-ES")}</div>
          </div>
          <div>
            <div className="l">Partidas</div>
            <div className="v">{game.plays}</div>
          </div>
        </div>
        <div className="detail-actions">
          <Link href={`/juego/${game.id}/jugar`} className="btn yellow">
            JUGAR
          </Link>
          <Link href="/" className="btn ghost">
            VOLVER
          </Link>
        </div>
      </div>
    </div>
  );
}
