import Career from "@/components/home/Career";
import FAQ from "@/components/home/FAQ";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import HowItworks from "@/components/home/HowItworks";
import Statics from "@/components/home/Statics";
import Testimonials from "@/components/home/Testimonials";
import * as React from "react";

function ModeToggle() {
  return (
    <div>
      <div className="grid-background"></div>
      <Hero />
      <Features />
      <Statics />
      <HowItworks />
      <Testimonials />
      <FAQ />
      <Career />
    </div>
  );
}

export default ModeToggle;
