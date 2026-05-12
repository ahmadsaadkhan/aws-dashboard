"use client";
import { motion } from "framer-motion";
import {
  Server, HardDrive, Users, DollarSign, TrendingUp,
  Activity, LayoutDashboard, MapPin, ShieldCheck, BarChart2,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Server, HardDrive, Users, DollarSign, TrendingUp,
  Activity, LayoutDashboard, MapPin, ShieldCheck, BarChart2,
};

interface Props {
  title: string;
  subtitle?: string;
  iconName: string;
  color?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, iconName, color = "#3b82f6", actions }: Props) {
  const Icon = ICONS[iconName] ?? LayoutDashboard;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
          style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Icon size={18} color={color} />
        </motion.div>
        <div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
      {actions && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{actions}</motion.div>}
    </motion.div>
  );
}