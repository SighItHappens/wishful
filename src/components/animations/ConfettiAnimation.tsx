import { useRef, useEffect } from 'react';
import { animate, stagger, utils } from 'animejs';

export default function ConfettiAnimation() {
  const confettiContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = confettiContainerRef.current;
    const confettiPieces = 50;
    const colors = ['#f0c929', '#f44336', '#3f51b5', '#4caf50', '#ff9800'];
    
    if (!container) return;
    
    // Create confetti pieces
    for (let i = 0; i < confettiPieces; i++) {
      const piece = document.createElement('div');
      piece.className = 'absolute w-3 h-3 rounded-sm';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.zIndex = '10';
      container.appendChild(piece);
    }
    
    // Animate confetti
    animate(container.children, {
      translateX: () => utils.random(-window.innerWidth/3, window.innerWidth/3),
      translateY: () => utils.random(-100, -300),
      rotate: () => utils.random(0, 360),
      opacity: [1, 0],
      scale: [1, 0],
      duration: () => utils.random(1000, 2000),
      ease: 'outExpo',
      delay: stagger(10),
      onComplete: () => {
        // Clean up
        if (container) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
      }
    });
  }, []);
  
  return (
    <div ref={confettiContainerRef} className="fixed top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ width: 0, height: 0 }}></div>
  );
}
