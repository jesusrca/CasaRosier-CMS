import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import svgPaths from "../imports/svg-gvi2gibf3l";

export function LoadingScreen() {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Marcar como completo después de la animación
    const timer = setTimeout(() => {
      setIsComplete(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  const fillColor = "#1E130F";
  
  // Todas las keys de los paths del logo
  const pathKeys = [
    'p3835a700', 'p2e53c080', 'p399b4780', 'p360f0800', 'p2fa1cd80',
    'p11066000', 'pa87e500', 'p10df8ff0', 'p21f88f00', 'p15904f80',
    'p2950b000', 'p2aade300', 'p2262f520', 'p34816d70', 'p2819b780',
    'p24e0b00', 'p1a431800', 'p26589500', 'p2283e800', 'p3d5a480',
    'p3e6753f2', 'pf2ba280', 'p9bd9180', 'p3c351400', 'p13407400',
    'p29d24c80', 'p36607700', 'p25e49e00'
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.5, delay: isComplete ? 0 : 0 }}
    >
      <div className="relative w-[300px] md:w-[400px]" style={{ aspectRatio: '595/290' }}>
        <svg 
          className="w-full h-full" 
          viewBox="0 0 595 290" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Definir el gradiente de opacidad para el efecto de "revelación" */}
            <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={fillColor} stopOpacity="0.2">
                <animate 
                  attributeName="stop-opacity" 
                  values="0.2;1;1" 
                  dur="2s" 
                  fill="freeze"
                />
              </stop>
              <stop offset="100%" stopColor={fillColor} stopOpacity="1" />
            </linearGradient>
          </defs>
          
          <g>
            {/* Paths con fill animado - empiezan claros y se oscurecen */}
            {pathKeys.map((key, index) => (
              <motion.path
                key={`fill-${key}`}
                clipRule="evenodd"
                d={svgPaths[key as keyof typeof svgPaths]}
                fillRule="evenodd"
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 1.5, 
                  delay: index * 0.02,
                  ease: "easeInOut"
                }}
                fill={fillColor}
              />
            ))}
            
            {/* Paths con stroke animado - efecto de "dibujado" */}
            {pathKeys.map((key, index) => (
              <motion.path
                key={`stroke-${key}`}
                clipRule="evenodd"
                d={svgPaths[key as keyof typeof svgPaths]}
                fillRule="evenodd"
                stroke={fillColor}
                strokeMiterlimit="10"
                strokeWidth="1"
                fill="none"
                initial={{ 
                  pathLength: 0,
                  opacity: 0.3
                }}
                animate={{ 
                  pathLength: 1,
                  opacity: 1
                }}
                transition={{ 
                  pathLength: {
                    duration: 2,
                    delay: index * 0.015,
                    ease: "easeInOut"
                  },
                  opacity: {
                    duration: 1,
                    delay: index * 0.015,
                    ease: "easeInOut"
                  }
                }}
              />
            ))}
          </g>
        </svg>
      </div>
    </motion.div>
  );
}