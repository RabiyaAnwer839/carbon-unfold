import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PANELS = [
  {
    index: "01",
    label: "Acceleration",
    value: 2.4,
    suffix: "s",
    decimals: 1,
    caption: "0—100 km/h",
    body: "Instant torque delivery, traction-managed from the first millisecond.",
  },
  {
    index: "02",
    label: "Dry weight",
    value: 168,
    suffix: " kg",
    decimals: 0,
    caption: "Carbon monocoque",
    body: "A structural shell that removes mass without removing rigidity.",
  },
  {
    index: "03",
    label: "Peak output",
    value: 214,
    suffix: " hp",
    decimals: 0,
    caption: "Axial-flux drive",
    body: "Power shaped for control — linear, repeatable, endlessly composed.",
  },
  {
    index: "04",
    label: "Top speed",
    value: 299,
    suffix: " km/h",
    decimals: 0,
    caption: "Electronically limited",
    body: "Aerodynamically stable at every point of the envelope.",
  },
];

export function PerformanceSection() {
  const wrapper = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = track.current!;

    const st = ScrollTrigger.create({
      trigger: wrapper.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => setProgress(self.progress),
    });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -100 * ((PANELS.length - 1) / PANELS.length),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      st.kill();
      ctx.revert();
    };
  }, []);

  const span = 1 / PANELS.length;

  return (
    <section
      ref={wrapper}
      aria-label="Performance"
      className="relative h-[400vh] w-full bg-background"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-haze)]" />
        <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-vignette)]" />

        <header className="relative z-10 flex items-end justify-between px-6 pt-20 md:px-14">
          <div>
            <p className="text-[0.6rem] tracking-[0.42em] text-primary">PERFORMANCE</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              THE NUMBERS
              <br />
              BEHIND THE SILENCE
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground md:block">
            Measured, not claimed. Every figure recorded on a closed circuit with a production
            VANTA 001.
          </p>
        </header>

        <div className="relative z-10 flex flex-1 items-center overflow-hidden">
          <div
            ref={track}
            className="flex w-[400%] will-change-transform"
            style={{ width: `${PANELS.length * 100}%` }}
          >
            {PANELS.map((p, i) => {
              const local = Math.min(
                1,
                Math.max(0, (progress - (i - 0.35) * span) / (span * 1.1)),
              );
              const shown = (p.value * local).toFixed(p.decimals);
              return (
                <article
                  key={p.index}
                  className="flex w-full shrink-0 flex-col justify-center px-6 md:px-14"
                  style={{ width: `${100 / PANELS.length}%` }}
                >
                  <div className="border-t border-border pt-8">
                    <p className="text-[0.6rem] tracking-[0.4em] text-primary">{p.index}</p>
                    <p className="mt-6 text-[0.65rem] tracking-[0.34em] text-muted-foreground">
                      {p.caption}
                    </p>
                    <p className="font-display mt-3 text-6xl leading-none tracking-tight text-foreground tabular-nums sm:text-8xl">
                      {shown}
                      <span className="text-2xl text-muted-foreground sm:text-3xl">{p.suffix}</span>
                    </p>
                    <h3 className="font-display mt-6 text-xl tracking-tight text-foreground">
                      {p.label}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 px-6 pb-10 md:px-14">
          {PANELS.map((p, i) => (
            <span
              key={p.index}
              className="h-px w-10 transition-colors duration-500"
              style={{
                backgroundColor:
                  progress >= i * span - 0.02 && progress < (i + 1) * span
                    ? "var(--color-primary)"
                    : "var(--color-border)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
