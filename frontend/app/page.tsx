import { api } from "@/lib/api";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";

export default async function OverviewPage() {
  let data = null;
  let health = null;
  try { [data, health] = await Promise.all([api.dashboard(), api.health()]); } catch {}

  return (
    <>
      <PageHeader
        title="Infrastructure Overview"
        subtitle="AWS Control Tower"
        iconName="LayoutDashboard"
        color="#3b82f6"
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem", borderRadius: 12, background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: health?.status?.toLowerCase() === "ok" || health?.status?.toLowerCase() === "healthy" ? "var(--success)" : "var(--warning)", animation: "pulse 1.8s ease infinite", display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          API {health ? health.status : "checking…"}
          {health?.timestamp && ` · ${new Date(health.timestamp).toLocaleTimeString()}`}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        <StatCard label="Running Instances" value={data?.running_instances ?? 0} sub={`of ${data?.total_instances ?? "?"} total`} iconName="Server" color="#3b82f6" delay={0} />
        <StatCard label="S3 Buckets" value={data?.total_buckets ?? 0} iconName="HardDrive" color="#f59e0b" delay={0.07} />
        <StatCard label="IAM Users" value={data?.total_users ?? 0} iconName="Users" color="#ec4899" delay={0.14} />
        <StatCard label="Monthly Cost" value={data?.monthly_cost ?? 0} prefix="$" decimals={2} iconName="DollarSign" color="#10b981" delay={0.21} />
      </div>
    </>
  );
}