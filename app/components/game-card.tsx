"use client";

import { useRouter } from "next/navigation";
import { useRef, type MouseEvent } from "react";
import type { Game } from "@/app/data/types";

export default function GameCard({ game }: { game: Game }) {
  const router = useRouter();
  const tiltRef = useRef<HTMLDivElement>(null);
  const go = () => router.push(`/juego/${game.id}`);

  // La inclinación solo aplica con puntero fino; en táctil no tiene sentido.
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
  };

  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  const buttonTone =
    game.color === "magenta" ? "magenta" : game.color === "yellow" ? "yellow" : "";

  return (
    <div
      ref={tiltRef}
      className="card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={go}
    >
      <div className="cover">
        <div className={"cover-bg " + (game.cover ?? "cover-bricks")}></div>
        <div className="label">{game.cat}</div>
      </div>
      <div className="meta">
        <div className="title">{game.title}</div>
        <div className="desc">{game.short}</div>
        <div className="row">
          <div className="score-badge">
            <span>MEJOR PUNTUACIÓN</span>
            <b>{game.best.toLocaleString("es-ES")}</b>
          </div>
          <button
            type="button"
            className={("btn " + buttonTone).trim()}
            onClick={(e) => {
              e.stopPropagation();
              go();
            }}
          >
            JUGAR
          </button>
        </div>
      </div>
    </div>
  );
}
