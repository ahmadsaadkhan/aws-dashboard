"use client";
import { useEffect, useState } from "react";
import { api, HealthData } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { Wifi, Clock, Tag, Server } from "lucide-react";

const ICONS = { Wifi, Clock, Tag, Server };

export default function HealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.health()
      .then(d => setData(d))
      .catch(e => setErr(String(e)));
  }, []);

  const checks = [
    { label: "API Status",  value: data?.status,    iconName: "Wifi",   badge: true  },
    { label: "Timestamp",   value: data?.timestamp ? new Date(data.timestamp).toLocaleString() : null, iconName: "Clock", badge: false },
    { label: "Version",     value: data?.version,   iconName: "Tag",    badge: false },
    { label: "Endpoint",    value: "localhost:8000", iconName: "Server", badge: false },
  ];

  return (
    <>
      <PageHeader title="API Health" subtitle="Backend service status" iconName="Activity" color="#06b6d4" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: 700 }}>
        {checks.map(({ label, value, iconName, badge }) => {
          const Icon = ICONS[iconName as keyof typeof ICONS];
          return (
            <div key={label} className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={15} color="#06b6d4" />
              </div>
              <div>
                <p style={{ fontSize: 11, color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</p>
                {badge
                  ? <Badge status={String(value ?? "unknown")} />
                  : <p style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: value ? "var(--text)" : "var(--text-subtle)" }}>{String(value ?? "—")}</p>
                }
              </div>
            </div>
          );
        })}
      </div>

      {err && (
        <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--danger)" }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Connection error</p>
          <p>{err}</p>
        </div>
      )}

      {data && (
        <div className="card" style={{ marginTop: "1rem", padding: "1.25rem", maxWidth: 700 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: "0.75rem" }}>Full response payload</p>
          <pre style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#06b6d4", overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}