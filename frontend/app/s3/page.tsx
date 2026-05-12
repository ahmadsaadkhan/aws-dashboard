"use client";
import { useEffect, useState } from "react";
import { api, S3Bucket } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Search } from "lucide-react";

function fmtBytes(b?: number) {
  if (b == null) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

export default function S3Page() {
  const [buckets, setBuckets] = useState<S3Bucket[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.s3().then(d => setBuckets(d.buckets ?? [])).catch(() => {});
  }, []);

  const regions = new Set(buckets.map(b => b.region).filter(Boolean)).size;
  const totalObjects = buckets.reduce((s, b) => s + (b.object_count ?? 0), 0);
  const filtered = buckets.filter(b =>
    [b.name, b.region].some(v => String(v ?? "").toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      <PageHeader title="S3 Buckets" subtitle="Object storage across all regions" iconName="HardDrive" color="#f59e0b" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Buckets" value={buckets.length} iconName="Box"      color="#f59e0b" delay={0}    />
        <StatCard label="Regions"       value={regions}        iconName="Globe"    color="#3b82f6" delay={0.07} />
        <StatCard label="Total Objects" value={totalObjects}   iconName="Database" color="#10b981" delay={0.14} />
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
                {["Bucket Name", "Region", "Size", "Objects", "Created"].map((h, i, arr) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--text-subtle)", fontSize: 12 }}>No S3 buckets found</td></tr>
              ) : filtered.map((b, i) => (
                <tr key={b.name ?? i} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-raised)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><code style={{ fontSize: 11, color: "#f59e0b", fontFamily: "var(--font-mono)" }}>{b.name}</code></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><span style={{ fontSize: 12, color: "var(--text-muted)" }}>{String(b.region ?? "—")}</span></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmtBytes(b.size)}</span></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{b.object_count?.toLocaleString() ?? "—"}</span></td>
                  <td style={{ padding: "11px 14px" }}>{b.creation_date ? <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(String(b.creation_date)).toLocaleDateString()}</span> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 8, textAlign: "right", fontFamily: "var(--font-mono)" }}>{filtered.length} of {buckets.length} buckets</p>}
      </div>
    </>
  );
}