import { useState, useEffect } from "react";

interface PointerStatus {
  x: number;
  y: number;
  xp: number;
  yp: number;
}

export default function usePointerGlow() {
  const [status, setStatus] = useState<PointerStatus>({ x: 0, y: 0, xp: 0, yp: 0 });

  useEffect(() => {
    const syncPointer = ({ clientX: pointerX, clientY: pointerY }: MouseEvent) => {
      const x = pointerX.toFixed(2);
      const y = pointerY.toFixed(2);
      const xp = (pointerX / window.innerWidth).toFixed(2);
      const yp = (pointerY / window.innerHeight).toFixed(2);
      
      setStatus({ 
        x: parseFloat(x), 
        y: parseFloat(y), 
        xp: parseFloat(xp), 
        yp: parseFloat(yp) 
      });
    };

    window.addEventListener("pointermove", syncPointer);
    return () => window.removeEventListener("pointermove", syncPointer);
  }, []);

  return status;
}
