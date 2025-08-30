import { useEffect, useState } from "react";

interface CustomCursorProps {
  isListening?: boolean;
}

export default function CustomCursor({ isListening = false }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsPointer(true);
    const handleMouseLeave = () => setIsPointer(false);

    // Track mouse movement
    document.addEventListener('mousemove', updatePosition);

    // Track interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, [data-interactive="true"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const cursorClasses = [
    'custom-cursor',
    isPointer && 'pointer',
    isListening && 'listening',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cursorClasses}
      style={{
        left: position.x,
        top: position.y,
      }}
      data-testid="custom-cursor"
    />
  );
}
