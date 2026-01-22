"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Megaphone,
  FileText,
  Users2,
  Menu,
  X,
} from "lucide-react";

/* ================= ROLES ================= */
type Role = "admin" | "manager" | "employee";

/* ================= MENU CONFIG ================= */
const MENU: Record<Role, { name: string; path: string; icon: any }[]> = {
  /* 🔴 ADMIN */
  admin: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", path: "/leads", icon: Users },
    { name: "Clients", path: "/clients", icon: UserCheck },
    { name: "Campaigns", path: "/campaigns", icon: Megaphone },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Team", path: "/team", icon: Users2 },
  ],

  /* 🟡 MANAGER */
  manager: [
    { name: "Leads", path: "/leads", icon: Users },
    { name: "Clients", path: "/clients", icon: UserCheck },
    { name: "Campaigns", path: "/campaigns", icon: Megaphone },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Team", path: "/team", icon: Users2 },
  ],

  /* 🟢 EMPLOYEE */
  employee: [
    { name: "Leads", path: "/leads", icon: Users },
    { name: "Clients", path: "/clients", icon: UserCheck }, // ✅ ADD CLIENT
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Team", path: "/team", icon: Users2 },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("employee");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ================= LOAD ROLE ================= */
  useEffect(() => {
    const storedRole =
      (localStorage.getItem("role") as Role) || "employee";
    setRole(storedRole);
  }, []);

  return (
    <>
      {/* ===== MOBILE MENU BUTTON ===== */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 p-2 rounded-xl text-white"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-[260px] z-40
          bg-gradient-to-b from-[#0B3C5D] to-[#041C2E]
          text-white flex flex-col shadow-2xl
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* CLOSE (MOBILE) */}
        <button
          className="lg:hidden absolute top-4 right-4"
          onClick={() => setMobileOpen(false)}
        >
          <X />
        </button>

        {/* ===== BRAND ===== */}
        <div className="m-4 glass p-6 flex flex-col items-center gap-3">
          <div className="bg-white rounded-2xl p-4">
            <Image
              src="/brand/logo.png"
              alt="3 Arrow Digital Services"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">3 Arrow</p>
            <p className="text-sm text-blue-200">
              Digital Services
            </p>
          </div>
        </div>

        {/* ===== MENU ===== */}
        <nav className="flex-1 px-3 space-y-2">
          {MENU[role].map((m) => {
            const Icon = m.icon;
            const active = pathname === m.path;

            return (
              <Link
                key={m.path}
                href={m.path}
                className={`
                  flex items-center gap-4 px-5 py-3 rounded-xl
                  transition
                  ${
                    active
                      ? "bg-blue-600 shadow-lg shadow-blue-500/30"
                      : "hover:bg-white/10"
                  }
                `}
              >
                <Icon size={22} />
                <span>{m.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ===== FOOTER ===== */}
        <div className="px-6 py-4 text-xs text-blue-200 border-t border-white/10">
          © {new Date().getFullYear()} <br />
          3 Arrow Digital Services
        </div>
      </aside>
    </>
  );
}
