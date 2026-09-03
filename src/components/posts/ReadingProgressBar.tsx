"use client";

import { useEffect } from "react";

export function ReadingProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;

    function update() {
      const scrolled = window.scrollY;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      bar!.style.width =
        (total > 0 ? Math.min(100, (scrolled / total) * 100) : 0) + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      id="reading-progress"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        background:
          "linear-gradient(90deg, #064e3b, #10b981, #34d399)",
        zIndex: 9999,
        width: "0%",
        transition: "width 0.1s linear",
        pointerEvents: "none",
      }}
    />
  );
}
