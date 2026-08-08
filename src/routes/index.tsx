import { createFileRoute } from "@tanstack/react-router";
import { ScrollHero } from "@/components/ScrollHero";
import { EngineeringShowcase } from "@/components/EngineeringShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VANTA 001 — Futuristic Carbon Superbike" },
      {
        name: "description",
        content:
          "Scroll to assemble VANTA 001: a 214 hp carbon and titanium superbike revealed component by component in a cinematic black studio.",
      },
      { property: "og:title", content: "VANTA 001 — Futuristic Carbon Superbike" },
      {
        property: "og:description",
        content:
          "A cinematic exploded-view reveal of VANTA 001 — matte carbon, brushed titanium, 214 hp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-background">
      <h1 className="sr-only">VANTA 001 — futuristic carbon fiber superbike</h1>
      <ScrollHero />
      <EngineeringShowcase />
      <PerformanceSection />
    </main>
  );
}
