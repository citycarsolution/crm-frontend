"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/login");

  return (
    <html lang="en">
      <body className="overflow-hidden">
        {hideLayout ? (
          children
        ) : (
          <>
            {/* ===== FIXED SIDEBAR ===== */}
            <aside className="fixed left-0 top-0 h-screen w-[260px] z-50">
              <Sidebar />
            </aside>

            {/* ===== MAIN AREA ===== */}
            <div className="ml-[260px] h-screen flex flex-col overflow-hidden">
              <Topbar />

              {/* ONLY PAGE CONTENT SCROLLS */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
                {children}
              </main>
            </div>
          </>
        )}
      </body>
    </html>
  );
}
