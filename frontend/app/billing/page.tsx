"use client";
import { useEffect, useState } from "react";
import { api, BillingData, BillingService } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import BillingChart from "@/components/BillingChart";

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null);

  useEffect(() => {
    api.billing().then(d => setData(d)).catch(() => {});
  }, []);

  const services: BillingService[] = data?.services ?? [];

  return (
    <>
      <PageHeader title="Billing" subtitle="Cost analysis & service breakdown" iconName="DollarSign" color="#10b981" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Cost" value={data?.total_cost ?? 0} prefix="$" decimals={2} iconName="DollarSign" color="#10b981" delay={0}    />
        <StatCard label="Services"   value={services.length}       iconName="BarChart2"                          color="#8b5cf6"  delay={0.07} />
        <StatCard label="Period"     value={0}                     iconName="Calendar"                           color="#f59e0b"  delay={0.14} />
        <StatCard label="Currency"   value={0}                     iconName="TrendingUp"                         color="#3b82f6"  delay={0.21} />
      </div>

      {services.length > 0
        ? <BillingChart services={services} />
        : <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-subtle)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
            No billing data available from API
          </div>
      }
    </>
  );
}