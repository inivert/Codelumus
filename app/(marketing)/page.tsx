import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import PreviewLanding from "@/components/sections/preview-landing";
import { RoadmapPreview } from "@/components/sections/roadmap-preview";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <RoadmapPreview />
      <PreviewLanding />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      {/* <InfoLanding data={infos[1]} /> */}
      <Features />
    </>
  );
}
