'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface DraggableStickerProps {
  src: string;
  alt: string;
  width: number;
  className?: string;
  shadow?: boolean;
}

export default function DraggableSticker({
  src,
  alt,
  width,
  className = '',
  shadow = true,
}: DraggableStickerProps) {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stickerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging) {
      setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY,
      });
    }
  };

  return (
    <div
      ref={stickerRef}
      className={`pointer-events-auto touch-none cursor-grab active:cursor-grabbing group ${className}`}
      data-dragging={dragging}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width * 2}
        height={width * 2}
        className={`transition-[scale,opacity] group-hover:scale-110 ${
          dragging ? 'scale-100 opacity-75' : ''
        } ${shadow ? 'drop-shadow-sticker' : ''}`}
        style={{ width: `${width}px`, height: 'auto' }}
        draggable={false}
      />
    </div>
  );
}
