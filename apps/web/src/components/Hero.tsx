"use client";

import React from "react";
import { TypeAnimation } from "react-type-animation";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";
import MainButton from "./MainButton";

const Hero = () => {
  return (
    <div>
      <HeroCarousel />
      <div className="w-full h-screen absolute top-0 left-0 bg-white/10">
        <div className=" max-w-[1450px] h-screen px-12 m-auto flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
          <div className="bg-[#d0d3d4] bg-opacity-50 py-2 px-8 rounded-xl lg:bg-opacity-0 lg:py-0 lg:px-0">
            <h2 className="text-lg font-semibold text-main-color">
              The Biggest Event Hub in Jabodetabek
            </h2>
            <h1 className="text-3xl lg:text-5xl font-bold mb-6 mt-2 text-black">
              Gather Around <br /> To Enjoy{" "}
              <TypeAnimation
                sequence={[
                  "Camping",
                  4500,
                  "Hiking",
                  4500,
                  "Art",
                  4500,
                ]}
                wrapper="span"
                cursor={true}
                style={{
                  fontSize: "1em",
                  paddingLeft: "5px",
                  display: "inline-block",
                }}
                repeat={Infinity}
              />
            </h1>
            <h2 className=" text-lg md:text-xl lg:text-2xl font-semibold">
              And many more of other events available
            </h2>
          </div>
          <Link href="/products/">
            <MainButton>Get Started</MainButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
