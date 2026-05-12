"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Server, HardDrive,
  DollarSign, Users, Activity, Zap,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/",        label: "Overview",  icon: LayoutDashboard, color: "#3b82f6" },
  { href: "/ec2",     label: "EC2",       icon: Server,          color: "#8b5cf6" },
  { href: "/s3",      label: "S3",        icon: HardDrive,       color: "#f59e0b" },
  { href: "/billing", label: "Billing",   icon: DollarSign,      color: "#10b981" },
  { href: "/iam",     label: "IAM",       icon: Users,           color: "#ec4899" },
  { href: "/health",  label: "Health",    icon: Activity,        color: "#06b6d4" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        width: 228,
        minHeight: "100vh",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "1.25rem 0",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 1.25rem 1.75rem" }}>
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          whileHover={{ x: 2 }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, var(--accent), #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={15} color="white" fill="white" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", lineHeight: 1 }}>
              AWS Tower
            </p>
            <p style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
              Control Panel
            </p>
          </div>
        </motion.div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 10px" }}>
        <p style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
          color: "var(--text-subtle)", textTransform: "uppercase",
          padding: "0 10px", marginBottom: 6,
        }}>
          Services
        </p>

        {NAV.map(({ href, label, icon: Icon, color }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 9,
                  background: active ? `${color}18` : "transparent",
                  border: active ? `1px solid ${color}30` : "1px solid transparent",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: active ? `${color}20` : "var(--bg-raised)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}>
                  <Icon size={13} style={{ color: active ? color : "var(--text-muted)" }} />
                </div>
                <span style={{
                  fontSize: 13.5, fontWeight: active ? 600 : 400,
                  color: active ? "var(--text)" : "var(--text-muted)",
                }}>
                  {label}
                </span>

                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    style={{
                      position: "absolute", right: 10, width: 5, height: 5,
                      borderRadius: "50%", background: color,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: "1rem 1.25rem 0",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 11, color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
            localhost:8000
          </p>
          <p style={{ fontSize: 10, color: "var(--text-subtle)", marginTop: 2 }}>
            v1.0.0
          </p>
        </div>
        <ThemeToggle />
      </div>
    </motion.aside>
  );
}