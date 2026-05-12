"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: string;
  empty?: string;
  searchable?: boolean;
  searchKeys?: string[];
}

export default function DataTable<T extends Record<string, unknown>>({
  columns, rows, keyField, empty = "No data", searchable = true, searchKeys = [],
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = rows.filter(row => {
    if (!query) return true;
    const keys = searchKeys.length ? searchKeys : columns.map(c => c.key);
    return keys.some(k => String(row[k] ?? "").toLowerCase().includes(query.toLowerCase()));
  });

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div>
      {searchable && (
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            style={{
              width: "100%", padding: "8px 12px 8px 30px",
              background: "var(--bg-raised)", border: "1px solid var(--border)",
              borderRadius: 8, fontSize: 13, color: "var(--text)",
              outline: "none", fontFamily: "var(--font-sans)",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--accent)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      )}

      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-raised)" }}>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    borderRight: i < columns.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span style={{ marginLeft: 4, opacity: 0.6 }}>
                      {sortDir === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ padding: "3rem", textAlign: "center", color: "var(--text-subtle)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {empty}
                  </td>
                </tr>
              ) : (
                sorted.map((row, i) => (
                  <motion.tr
                    key={String(row[keyField] ?? i)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-raised)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {columns.map((col, ci) => (
                      <td
                        key={col.key}
                        style={{
                          padding: "11px 14px",
                          color: "var(--text)",
                          borderRight: ci < columns.length - 1 ? "1px solid var(--border)" : "none",
                        }}
                      >
                        {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {sorted.length > 0 && (
        <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 8, textAlign: "right", fontFamily: "var(--font-mono)" }}>
          {sorted.length} of {rows.length} records
        </p>
      )}
    </div>
  );
}