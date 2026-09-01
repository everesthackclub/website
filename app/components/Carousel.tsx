'use client';

import Image from 'next/image';

interface CarouselProps {
  images: string[];
  reverse?: boolean;
}

export default function Carousel({ images, reverse = false }: CarouselProps) {
  const LOOPS = 2;
  const DURATION = images.length * 5;

  return (
    <div
      className={`group pointer-events-none flex w-full -rotate-2 ${reverse ? 'justify-end' : ''}`}
    >
      {Array.from({ length: LOOPS }).map((_, loopIdx) => (
        <div
          key={loopIdx}
          className="track flex w-max flex-none"
          style={{
            animation: `scroll ${DURATION}s linear infinite`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        >
          {images.map((image, idx) => (
            <Image
              key={`${loopIdx}-${idx}`}
              src={image}
              alt=""
              width={400}
              height={400}
              className={`pointer-events-auto h-80 w-auto object-cover shadow-lg transition group-has-[:hover]:not-hover:opacity-75 hover:scale-105 aspect-square ${
                reverse ? 'ml-4' : 'mr-4'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
