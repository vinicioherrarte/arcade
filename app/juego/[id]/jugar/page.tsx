import { notFound } from "next/navigation";
import PlayerView from "@/app/components/player-view";
import { GAMES } from "@/app/data/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export default async function GamePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  return <PlayerView game={game} />;
}
