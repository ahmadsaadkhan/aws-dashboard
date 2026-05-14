"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { BillingService } from "@/lib/api";
import { useTheme } from "@/lib/theme";

interface Props { services: BillingService[] }

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#ef4444"];

export default function BillingChart({ services }: Props) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const textColor = dark ? "#888" : "#6b6b6b";
  const gridColor = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const sorted = [...services].sort((a, b) => b.amount - a.amount);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
      <div className="card" style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: "1rem" }}>
          Cost by Service
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sorted} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="service" tick={{ fontSize: 10, fill: textColor }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: textColor }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: dark ? "#18181f" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, borderRadius: 8, fontSize: 12 }}
              // formatter={(v: number) => [`$${v.toFixed(2)}`, "Cost"]}
              formatter={(v) => [`$${typeof v === 'number' ? v.toFixed(2) : '0.00'}`, "Cost"]}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0] as [number, number, number, number]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: "1rem" }}>
          Breakdown
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.map((s, i) => {
            const max = sorted[0]?.amount ?? 1;
            const pct = (s.amount / max) * 100;
            const color = COLORS[i % COLORS.length];
            return (
              <div key={s.service}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.service}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "var(--font-mono)", color }}>${s.amount.toFixed(2)}</span>
                </div>
                <div style={{ height: 3, background: "var(--bg-raised)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.8s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
