"use client";
import { useEffect, useState } from "react";
import { api, EC2Instance } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import StatCard from "@/components/StatCard";
import { Search } from "lucide-react";

export default function EC2Page() {
  const [instances, setInstances] = useState<EC2Instance[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.ec2().then(d => setInstances(d.instances ?? [])).catch(() => {});
  }, []);

  const running = instances.filter(i => (i.state ?? "").toLowerCase() === "running").length;
  const regions = new Set(instances.map(i => i.region).filter(Boolean)).size;

  const filtered = instances.filter(r =>
    [r.id, r.name, r.state, r.type, r.region].some(v =>
      String(v ?? "").toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <>
      <PageHeader title="EC2 Instances" subtitle="Compute resources across regions" iconName="Server" color="#8b5cf6" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total"   value={instances.length}           iconName="Server"     color="#8b5cf6" delay={0}    />
        <StatCard label="Running" value={running}                    iconName="Activity"   color="#10b981" delay={0.07} />
        <StatCard label="Stopped" value={instances.length - running} iconName="StopCircle" color="#ef4444" delay={0.14} />
        <StatCard label="Regions" value={regions}                    iconName="MapPin"     color="#f59e0b" delay={0.21} />
      </div>

      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
            style={{ width: "100%", padding: "8px 12px 8px 30px", background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--text)", outline: "none" }}
            onFocus={e => (e.target.style.borderColor = "var(--accent)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-raised)" }}>
                {["Instance ID","Name","State","Type","Region","Public IP","Launched"].map((h, i, arr) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", borderRight: i < arr.length-1 ? "1px solid var(--border)" : "none", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-subtle)", fontSize: 12 }}>No EC2 instances</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id ?? i} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-raised)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><code style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{r.id}</code></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}>{r.name ?? <span style={{ color: "var(--text-subtle)" }}>—</span>}</td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><Badge status={String(r.state ?? "unknown")} /></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><code style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>{String(r.type ?? "—")}</code></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}>{String(r.region ?? "—")}</td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><code style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>{String(r.public_ip ?? "—")}</code></td>
                  <td style={{ padding: "11px 14px" }}>{r.launch_time ? new Date(String(r.launch_time)).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}