'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Different geometric shapes
const shapes = [
  {
    type: 'circle',
    render: (size: number) => (
      <circle cx={size/2} cy={size/2} r={size/3} />
    )
  },
  {
    type: 'square',
    render: (size: number) => (
      <rect width={size * 0.6} height={size * 0.6} x={size * 0.2} y={size * 0.2} />
    )
  },
  {
    type: 'triangle',
    render: (size: number) => {
      const center = size / 2;
      const third = size / 3;
      return (
        <polygon points={`${center},${third} ${center + third},${center + third} ${center - third},${center + third}`} />
    )}
  },
  {
    type: 'diamond',
    render: (size: number) => {
      const center = size / 2;
      const third = size / 3;
      return (
        <polygon points={`${center},${third} ${center + third},${center} ${center},${center + third} ${center - third},${center}`} />
    )}
  }
];

export function ChessBackground() {
  const [elements, setElements] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    shape: typeof shapes[number];
    rotation: number;
  }>>([]);

  useEffect(() => {
    // Divide the screen into a grid for better distribution
    const count = 30; // Increased count for better coverage
    const gridSize = Math.ceil(Math.sqrt(count));

    const newElements = Array.from({ length: count }, (_, i) => {
      // Calculate grid position
      const gridRow = Math.floor(i / gridSize);
      const gridCol = i % gridSize;

      // Calculate base position with some randomness
      const baseX = (gridCol / gridSize) * 100;
      const baseY = (gridRow / gridSize) * 100;

      // Add randomness within the grid cell
      const randomX = (Math.random() - 0.5) * (100 / gridSize);
      const randomY = (Math.random() - 0.5) * (100 / gridSize);

      return {
        id: i,
        x: Math.max(0, Math.min(100, baseX + randomX)),
        y: Math.max(0, Math.min(100, baseY + randomY)),
        size: Math.random() * 40 + 20,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360
      };
    });

    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      <AnimatePresence>
        {elements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute"
            initial={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{
              opacity: 0.08,
              scale: [1, 1.2, 1],
              left: [`${element.x}%`, `${element.x + 2}%`, `${element.x}%`],
              top: [`${element.y}%`, `${element.y - 2}%`, `${element.y}%`],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeatType: "reverse",
              delay: element.id * 0.3
            }}
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
            }}
          >
            <motion.svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              initial={{ rotate: element.rotation }}
              animate={{
                rotate: [element.rotation, element.rotation + 180, element.rotation],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            >
              <motion.g
                className="fill-blue-200/30 stroke-blue-300/30"
                strokeWidth="1"
              >
                {element.shape.render(100)}
              </motion.g>
            </motion.svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}