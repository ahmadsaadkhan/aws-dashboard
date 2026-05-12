"use client";
import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export default function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0, duration = 1.2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate(v) {
        if (ref.current) ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return controls.stop;
  }, [inView, value, prefix, suffix, decimals, duration]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}