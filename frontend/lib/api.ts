const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  health:    () => get<HealthData>("/health"),
  dashboard: () => get<DashboardData>("/aws/dashboard"),
  ec2:       () => get<EC2Data>("/aws/ec2/instances"),
  s3:        () => get<S3Data>("/aws/s3/buckets"),
  billing:   () => get<BillingData>("/aws/billing"),
  iam:       () => get<IAMData>("/aws/iam/users"),
};

export interface HealthData { status: string; timestamp?: string; version?: string }
export interface DashboardData {
  total_instances?: number; running_instances?: number; total_buckets?: number;
  total_users?: number; monthly_cost?: number; cost_change?: number;
  [k: string]: unknown;
}
export interface EC2Instance {
  id: string; name?: string; state: string; type?: string;
  region?: string; public_ip?: string; launch_time?: string; [k: string]: unknown;
}
export interface EC2Data { instances: EC2Instance[]; total?: number }
export interface S3Bucket {
  name: string; region?: string; creation_date?: string;
  size?: number; object_count?: number; [k: string]: unknown;
}
export interface S3Data { buckets: S3Bucket[]; total?: number }
export interface BillingService { service: string; amount: number; currency?: string }
export interface BillingData {
  total_cost?: number; currency?: string; period?: string;
  services?: BillingService[]; [k: string]: unknown;
}
export interface IAMUser {
  username: string; user_id?: string; created?: string;
  last_activity?: string; mfa_enabled?: boolean; [k: string]: unknown;
}
export interface IAMData { users: IAMUser[]; total?: number }