const STATUS_MAP: Record<string, { bg: string; color: string; dot: string }> = {
  running: { bg: "rgba(16,217,160,0.1)",  color: "#10d9a0", dot: "#10d9a0" },
  healthy: { bg: "rgba(16,217,160,0.1)",  color: "#10d9a0", dot: "#10d9a0" },
  ok:      { bg: "rgba(16,217,160,0.1)",  color: "#10d9a0", dot: "#10d9a0" },
  stopped: { bg: "rgba(248,113,113,0.1)", color: "#f87171", dot: "#f87171" },
  error:   { bg: "rgba(248,113,113,0.1)", color: "#f87171", dot: "#f87171" },
  pending: { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24", dot: "#fbbf24" },
  warning: { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24", dot: "#fbbf24" },
};

export default function Badge({ status }: { status: string }) {
  const s = (status ?? "").toLowerCase();
  const style = STATUS_MAP[s] ?? { bg: "rgba(120,120,120,0.1)", color: "var(--text-muted)", dot: "var(--text-subtle)" };
  const pulse = ["running", "healthy", "ok"].includes(s);

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 6,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
      background: style.bg, color: style.color,
      fontFamily: "var(--font-mono)",
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: style.dot,
        display: "inline-block",
        animation: pulse ? "pulse 1.8s ease infinite" : "none",
        flexShrink: 0,
      }} />
      {status}
    </span>
  );
}