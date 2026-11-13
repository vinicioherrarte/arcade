import ActivityPanels from "@/app/components/home/activity-panels";
import FeatureGrid from "@/app/components/home/feature-grid";
import FinalCta from "@/app/components/home/final-cta";
import GameRail from "@/app/components/home/game-rail";
import Hero from "@/app/components/home/hero";
import PricingSection from "@/app/components/home/pricing-section";
import Reveal from "@/app/components/home/reveal";
import StatsBlock from "@/app/components/home/stats-block";

// Landing de inicio (app/references/home-about/home-about/home.jsx).
// El hero queda sin animación de entrada porque está arriba del pliegue.
export default function Home() {
  return (
    <div className="home fade-in">
      <Hero />
      <Reveal>
        <FeatureGrid />
      </Reveal>
      <Reveal>
        <GameRail />
      </Reveal>
      <Reveal>
        <StatsBlock />
      </Reveal>
      <Reveal>
        <ActivityPanels />
      </Reveal>
      <Reveal>
        <PricingSection />
      </Reveal>
      <Reveal>
        <FinalCta />
      </Reveal>
    </div>
  );
}
