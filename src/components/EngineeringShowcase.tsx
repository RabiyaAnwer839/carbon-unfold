import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import orbitAsset from "@/assets/superbike-orbit.mp4.asset.json";

const HIGHLIGHTS = [
  {
    index: "01",
    title: "CARBON FIBER",
    body: "Lightweight construction engineered for strength without compromise.",
  },
  {
    index: "02",
    title: "AERODYNAMICS",
    body: "Every surface is shaped to control airflow and increase stability.",
  },
  {
    index: "03",
    title: "PRECISION ENGINE",
    body: "Performance engineered around balance, response and control.",
  },
  {
    index: "04",
    title: "RACING GEOMETRY",
    body: "Every angle is designed to connect rider and machine.",
  },
];

export function EngineeringShowcase() {
  const wrapper = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(-1);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const v = video.current!;

    const target = { t: 0 };
    const eased = { t: 0 };
    let seeking = false;
    let pending = 0;

    const commit = () => {
      if (seeking || !v.duration) return;
      const next = Math.min(v.duration - 0.033, Math.max(0, pending));
      if (Math.abs(next - v.currentTime) < 0.008) return;
      seeking = true;
      v.currentTime = next;
    };
    const onSeeked = () => {
      seeking = false;
      commit();
    };
    v.addEventListener("seeked", onSeeked);

    const raf = () => {
      eased.t += (target.t - eased.t) * 0.14;
      pending = eased.t;
      commit();
    };
    gsap.ticker.add(raf);

    const st = ScrollTrigger.create({
      trigger: wrapper.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        target.t = p * (v.duration || 0);
        setEntered(p > 0.02);
        // 0–0.14 intro copy, then four highlights, tail settles
        if (p < 0.18) setActive(-1);
        else if (p < 0.36) setActive(0);
        else if (p < 0.54) setActive(1);
        else if (p < 0.72) setActive(2);
        else if (p < 0.88) setActive(3);
        else setActive(-1);
        setSettling(p > 0.88);
      },
    });

    const onMeta = () => ScrollTrigger.refresh();
    if (v.readyState >= 1) onMeta();
    else v.addEventListener("loadedmetadata", onMeta, { once: true });

    return () => {
      st.kill();
      gsap.ticker.remove(raf);
      v.removeEventListener("seeked", onSeeked);
    };
  }, []);

  return (
    <section
      ref={wrapper}
      aria-label="Engineered to perfection"
      className="relative h-[320vh] w-full bg-background"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <video
          ref={video}
          src={orbitAsset.url}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* atmosphere */}
        <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-haze)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-vignette)]" />

        {/* intro copy */}
        <div
          className="pointer-events-none absolute left-6 top-24 z-20 max-w-xl transition-all duration-700 ease-out md:left-14 md:top-1/2 md:-translate-y-1/2"
          style={{
            opacity: entered && active === -1 && !settling ? 1 : 0,
            transform: `translateY(${entered && active === -1 && !settling ? 0 : 16}px)`,
            filter: entered && active === -1 && !settling ? "blur(0px)" : "blur(6px)",
          }}
        >
          <p className="text-[0.6rem] tracking-[0.42em] text-primary">ENGINEERING</p>
          <h2 className="font-display mt-4 text-3xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            ENGINEERED TO
            <br />
            PERFECTION
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Every component exists for a reason. Every surface is shaped by performance.
          </p>
        </div>

        {/* highlights */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-16 md:bottom-auto md:top-1/2 md:right-14 md:left-auto md:w-[26rem] md:-translate-y-1/2 md:px-0 md:pb-0 md:text-right">
          <div className="relative h-44 md:h-40">
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={h.title}
                className="absolute inset-0 transition-all duration-700 ease-out"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: `translateY(${active === i ? 0 : 18}px)`,
                  filter: active === i ? "blur(0px)" : "blur(6px)",
                }}
              >
                <p className="text-[0.6rem] tracking-[0.4em] text-primary">{h.index}</p>
                <h3 className="font-display mt-3 text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  {h.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:ml-auto md:max-w-xs">
                  {h.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* progress rail */}
        <div className="pointer-events-none absolute left-6 bottom-8 z-20 hidden gap-3 md:flex md:left-14">
          {HIGHLIGHTS.map((h, i) => (
            <span
              key={h.index}
              className="h-px w-10 transition-colors duration-500"
              style={{
                backgroundColor:
                  active === i ? "var(--color-primary)" : "var(--color-border)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
