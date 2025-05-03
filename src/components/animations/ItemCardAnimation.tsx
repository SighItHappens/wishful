import { useRef, useEffect } from 'react';
import { animate, createSpring } from 'animejs';

interface ItemCardAnimationProps {
  children: React.ReactNode;
  index: number;
}

export default function ItemCardAnimation({ children, index }: ItemCardAnimationProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        translateY: [50, 0],
        opacity: [0, 1],
        ease: createSpring(),
        duration: 500,
        delay: index * 100
      });
    }
  }, [index]);
  
  return (
    <div ref={cardRef} className="opacity-0">
      {children}
    </div>
  );
}