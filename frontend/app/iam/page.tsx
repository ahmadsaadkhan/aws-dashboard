"use client";
import { useEffect, useState } from "react";
import { api, IAMUser } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { Search } from "lucide-react";

export default function IAMPage() {
  const [users, setUsers] = useState<IAMUser[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.iam().then(d => setUsers(d.users ?? [])).catch(() => {});
  }, []);

  const mfaOn = users.filter(u => u.mfa_enabled).length;
  const filtered = users.filter(u =>
    [u.username, u.user_id].some(v => String(v ?? "").toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      <PageHeader title="IAM Users" subtitle="Identity & access management" iconName="Users" color="#ec4899" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Users"  value={users.length}          iconName="Users"       color="#ec4899" delay={0}    />
        <StatCard label="MFA Enabled"  value={mfaOn}                 iconName="ShieldCheck" color="#10b981" delay={0.07} />
        <StatCard label="MFA Disabled" value={users.length - mfaOn} iconName="ShieldOff"   color="#ef4444" delay={0.14} />
        <StatCard label="Active"       value={users.length}          iconName="UserCheck"   color="#f59e0b" delay={0.21} />
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
                {["Username", "User ID", "MFA", "Created", "Last Active"].map((h, i, arr) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--text-subtle)", fontSize: 12 }}>No IAM users found</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.username ?? i} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-raised)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><code style={{ fontSize: 12, color: "#ec4899", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{u.username}</code></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><code style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{String(u.user_id ?? "—")}</code></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}><Badge status={u.mfa_enabled ? "healthy" : "stopped"} /></td>
                  <td style={{ padding: "11px 14px", borderRight: "1px solid var(--border)" }}>{u.created ? <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(String(u.created)).toLocaleDateString()}</span> : "—"}</td>
                  <td style={{ padding: "11px 14px" }}>{u.last_activity ? <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(String(u.last_activity)).toLocaleDateString()}</span> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 8, textAlign: "right", fontFamily: "var(--font-mono)" }}>{filtered.length} of {users.length} users</p>}
      </div>
    </>
  );
}