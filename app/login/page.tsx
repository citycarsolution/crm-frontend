"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Email & Password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ ONLY AUTH DATA (NO WIPE)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      router.push("/dashboard");
    } catch (error) {
      alert("Server error. Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B3C5D]">
      <div className="glass p-8 w-[420px] text-white rounded-xl shadow-xl">
        {/* ===== LOGO ===== */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/brand/logo.png"
            width={90}
            height={90}
            alt="3 Arrow CRM Logo"
            priority
          />
          <h1 className="text-2xl font-bold mt-3">3 Arrow CRM</h1>
        </div>

        {/* ===== EMAIL ===== */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded bg-white/10 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ===== PASSWORD ===== */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-white/10 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ===== LOGIN BUTTON ===== */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
