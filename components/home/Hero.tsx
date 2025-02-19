"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const Hero = () => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const imageElement = imageRef.current;

      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        if (imageElement) {
          imageElement.classList.add("scrolled");
        }
      } else {
        if (imageElement) {
          imageElement.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1
            className=" gradient-title 
          text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl 
          "
          >
            Your AI Coach for <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview
            preparation,and AI-powered tools for job seccess.
          </p>
        </div>

        <div className="flex justify-center space-x-3">
          <Link href="/dashboard">
            <Button className="px-4" size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="px-4 " variant="outline" size="lg">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="https://plus.unsplash.com/premium_photo-1676637656166-cb7b3a43b81a?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={1280}
              height={720}
              alt="Hero image"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
