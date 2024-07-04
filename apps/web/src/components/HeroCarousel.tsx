import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import React from "react";
import Image from "next/image";

export default function HeroCarousel() {
  const heroImages = [
    { id: 1, image: require("/public/images/hero1.jpg") },
    { id: 2, image: require("/public/images/hero2.jpg") },
    { id: 3, image: require("/public/images/hero3.jpg") },
  ];
  return (
    <div>
      <Carousel
        className="hero-slider"
        autoPlay
        infiniteLoop
        interval={5000}
        showThumbs={false}
        showArrows={false}
      >
        {heroImages.map((img) => (
          <Image
            src={img.image}
            key={img.id}
            alt={`eventhub ${img.id}`}
            className="w-full h-screen object-cover"
          />
        ))}
      </Carousel>
    </div>
  );
}
