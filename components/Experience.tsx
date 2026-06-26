"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { scrollState, pointerState } from "@/lib/store";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import { waLink } from "@/lib/data";
import { Preloader } from "./ui/Preloader";
import { Navbar } from "./ui/Navbar";
import { WhatsAppFloat } from "./ui/SectionHeading";
import { Hero } from "./sections/Hero";
import { StoryChapters } from "./sections/Story";
import { Stats } from "./sections/Stats";
import { About } from "./sections/About";
import { Products } from "./sections/Products";
import { Services } from "./sections/Services";
import { Testimonials } from "./sections/Testimonials";
import { Contact } from "./sections/Contact";

gsap.registerPlugin(ScrollTrigger);

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

export default function Experience() {
  const [ready, setReady] = useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const canvasWrap = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* Lenis smooth scroll — desktop only. On phones it fights native touch
     scrolling and, combined with the 3D repaint, causes the hang. */
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1.05 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reducedMotion, isMobile]);

  /* master trigger that feeds the cinematic 3D scene — desktop only */
  useEffect(() => {
    if (isMobile) return;
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });
    /* fade the showroom out as the editorial half of the site takes over */
    const fade = gsap.to(canvasWrap.current, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: trackRef.current,
        start: "bottom 85%",
        end: "bottom 35%",
        scrub: true,
      },
    });
    return () => {
      st.kill();
      fade.scrollTrigger?.kill();
      fade.kill();
    };
  }, [isMobile]);

  /* normalised cursor for the parallax rig — desktop only */
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: PointerEvent) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isMobile]);

  return (
    <>
      <Preloader onComplete={() => setReady(true)} reducedMotion={reducedMotion} />
      <Navbar ready={ready} />

      {/* the fixed showroom — desktop only; never mounted on phones */}
      {!isMobile && (
        <div
          ref={canvasWrap}
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden
        >
          {ready && <Scene isMobile={isMobile} reducedMotion={reducedMotion} />}
        </div>
      )}

      <main className="relative z-10">
        <div ref={trackRef}>
          <Hero ready={ready} isMobile={isMobile} />
          <StoryChapters isMobile={isMobile} />
        </div>

        <Stats />
        <About />
        <Products />
        <Services />
        <Testimonials />
        <Contact />
      </main>

      <WhatsAppFloat href={waLink("Hello KENDYN, I found you on your website.")} />
    </>
  );
}
