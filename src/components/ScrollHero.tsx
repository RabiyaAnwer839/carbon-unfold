import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CALLOUTS } from "./bike/parts";
import videoAsset from "@/assets/motorcycle-assembly.mp4.asset.json";

const STAGES = [
  {
    kicker: "01 — Components",
    title: "Every part, suspended.",
    body: "Two hundred and eleven components, machined and held in perfect alignment before a single bolt is turned.",
  },
  {
    kicker: "02 — Assembly",
    title: "Precision, in motion.",
    body: "Monocoque spine, axial-flux drive, titanium swingarm. Each element finds its place with mechanical certainty.",
  },
  {
    kicker: "03 — Complete",
    title: "VANTA — 001",
    body: "214 hp. 168 kg. Zero compromise. A superbike built in matte carbon and brushed titanium.",
  },
];

export function ScrollHero() {
  const wrapper = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.25, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const v = video.current!;
    v.pause();

    // scrub state: eased toward scroll target, then committed to a real frame
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

    const raf = (time: number) => {
      lenis.raf(time * 1000);
      // critically-damped-ish smoothing → mechanical, no rubber band
      eased.t += (target.t - eased.t) * 0.16;
      pending = eased.t;
      commit();
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: wrapper.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        target.t = p * (v.duration || 0);
        setScrolled(p > 0.02);
        setStage(p < 0.34 ? 0 : p < 0.76 ? 1 : 2);
      },
    });

    const onMeta = () => {
      target.t = st.progress * v.duration;
      eased.t = target.t;
      pending = target.t;
      commit();
      ScrollTrigger.refresh();
    };
    if (v.readyState >= 1) onMeta();
    else v.addEventListener("loadedmetadata", onMeta, { once: true });

    return () => {
      st.kill();
      gsap.ticker.remove(raf);
      v.removeEventListener("seeked", onSeeked);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={wrapper} className="relative h-[500vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <video
          ref={video}
          src={videoAsset.url}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />



        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/70 to-transparent" />

        {/* top bar */}
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-14">
          <span className="font-display text-sm tracking-[0.42em] text-foreground">VANTA</span>
          <nav className="hidden gap-10 text-xs tracking-[0.28em] text-muted-foreground md:flex">
            <span>MACHINE</span>
            <span>TECHNOLOGY</span>
            <span>RESERVE</span>
          </nav>
        </header>

        {/* stage copy */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-14 md:px-14 md:pb-20">
          <div className="relative h-52 md:h-44">
            {STAGES.map((s, i) => (
              <div
                key={s.kicker}
                className="absolute inset-0 max-w-xl transition-all duration-700 ease-out"
                style={{
                  opacity: stage === i ? 1 : 0,
                  transform: `translateY(${stage === i ? 0 : 18}px)`,
                  filter: stage === i ? "blur(0px)" : "blur(6px)",
                }}
              >
                <p className="text-[0.65rem] tracking-[0.4em] text-primary">{s.kicker}</p>
                <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
                  {s.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* spec rail */}
        <aside className="pointer-events-none absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-6 text-right md:flex md:right-14">
          {CALLOUTS.map((c, i) => (
            <div
              key={c.label}
              className="transition-all duration-700"
              style={{
                opacity: stage === 0 ? 1 : 0.28,
                transform: `translateX(${stage === 0 ? 0 : 10}px)`,
                transitionDelay: `${i * 70}ms`,
              }}
            >
              <p className="text-[0.6rem] tracking-[0.3em] text-muted-foreground">{c.label}</p>
              <p className="font-display text-lg text-foreground">{c.value}</p>
            </div>
          ))}
        </aside>

        {/* scroll hint */}
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500"
          style={{ opacity: scrolled ? 0 : 1 }}
        >
          <p className="text-[0.6rem] tracking-[0.42em] text-muted-foreground">SCROLL TO ASSEMBLE</p>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 bg-[image:var(--gradient-vignette)]" />
      </div>
    </div>
  );
}
