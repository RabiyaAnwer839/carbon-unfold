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
      <section className="relative z-10 border-t border-border bg-background px-6 py-28 md:px-14">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
          {[
            { k: "0—100 km/h", v: "2.4s" },
            { k: "Dry weight", v: "168 kg" },
            { k: "Peak output", v: "214 hp" },
          ].map((s) => (
            <div key={s.k}>
              <p className="text-[0.6rem] tracking-[0.34em] text-muted-foreground">{s.k}</p>
              <p className="font-display mt-3 text-4xl text-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
