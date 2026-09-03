"use client";
import { useEffect } from "react";
import { useAnimate, useInView, stagger } from "framer-motion";

export function useReveal(deps: any[] = []) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, margin: "0px 0px -100px 0px" });

  useEffect(() => {
    if (isInView && scope.current) {
      const runAnimation = async () => {
        try {
          await animate(
            ".reveal",
            { opacity: 1, y: 0, x: 0, scale: 1 },
            { 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1],
              delay: stagger(0.15, { startDelay: 0.1 })
            }
          );
        } catch (error) {
          // Ignore unmount errors
        }
      };
      runAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, animate, ...deps]);

  return scope;
}
