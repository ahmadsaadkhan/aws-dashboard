import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AWS Control Tower",
  description: "AWS infrastructure dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main style={{
              flex: 1,
              padding: "2rem 2.5rem",
              overflowX: "hidden",
              minWidth: 0,
            }}>
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}