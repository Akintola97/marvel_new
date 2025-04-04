"use client";
import Image from "next/image";

const Hero = () => {
  const images = [
    { src: "/marvel-home.jpg", alt: "marvel-heroes" }, 
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden pt-[7vh]"
    >
      {images.map((image, index) => (
        <div
          key={index}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={1920}
            height={700}
            style={{ objectFit: "cover" }}
            priority={true}
          />
        </div>
      ))}
    </div>
  );
};

export default Hero;
