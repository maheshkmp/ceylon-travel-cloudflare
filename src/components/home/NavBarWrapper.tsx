"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/home/NavBar";

export function NavBarWrapper() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <NavBar scrolled={scrolled} />;
}
