"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";

type Role = "admin" | "manager" | "team";

export default function Topbar() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("team");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    setRole((localStorage.getItem("role") as Role) || "team");
    setEmail(localStorage.getItem("email") || "");
  }, []);

  const logout = () => {
    if (typeof window === "undefined") return;

    localStorage.clear();
    router.push("/login");
  };

  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "manager"
      ? "Manager"
      : "Team";

  const initial = email
    ? email.charAt(0).toUpperCase()
    : roleLabel.charAt(0);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">CRM Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{roleLabel}</span>

        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {initial}
        </div>

        <Button text="Logout" onClick={logout} variant="secondary" />
      </div>
    </header>
  );
}
