import HallOfFame from "@/app/components/hall-of-fame";
import { GAMES } from "@/app/data/games";

export default function SalonPage() {
  return <HallOfFame games={GAMES} />;
}
