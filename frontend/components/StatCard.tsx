"use client";
import { motion } from "framer-motion";
import { Server, HardDrive, Users, DollarSign, TrendingUp, Activity, Box, Database, Globe, Cpu, StopCircle, MapPin, BarChart2, Calendar, ShieldCheck, ShieldOff, LayoutDashboard } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Server, HardDrive, Users, DollarSign, TrendingUp, Activity,
  Box, Database, Globe, Cpu, StopCircle, MapPin, BarChart2,
  Calendar, ShieldCheck, ShieldOff, LayoutDashboard,
};

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const ctrl = animate(0, value, {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate(v) { if (ref.current) ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`; },
    });
    return ctrl.stop;
  }, [inView, value, prefix, suffix, decimals]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

interface Props {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  sub?: string;
  iconName: string;
  color?: string;
  delay?: number;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ label, value, prefix = "", suffix = "", decimals = 0, sub, iconName, color = "#3b82f6", delay = 0, trend }: Props) {
  const Icon = ICONS[iconName] ?? Server;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="card" style={{ padding: "1.25rem", position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: color, filter: "blur(40px)", opacity: 0.07, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-subtle)" }}>{label}</span>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={13} color={color} />
        </div>
      </div>
      <div style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      {sub && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
          {trend === "up" && <span style={{ color: "var(--success)", fontWeight: 600 }}>↑</span>}
          {trend === "down" && <span style={{ color: "var(--danger)", fontWeight: 600 }}>↓</span>}
          {sub}
        </p>
      )}
    </motion.div>
  );
}