"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddTeamMember() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "employee",
  });

  const submit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      alert("First name, last name & email required");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to add member");
      return;
    }

    router.push("/team");
  };

  return (
    <div className="max-w-3xl">
      {/* ===== TITLE ===== */}
      <h1 className="text-3xl font-bold mb-2">
        Add Team Member
      </h1>
      <p className="text-white/60 mb-8">
        Create a new employee or manager account
      </p>

      {/* ===== FORM CARD ===== */}
      <div className="glass p-8 rounded-2xl space-y-6">
        {/* NAME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="First Name"
            placeholder="Enter first name"
            value={form.firstName}
            onChange={(v) =>
              setForm({ ...form, firstName: v })
            }
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            value={form.lastName}
            onChange={(v) =>
              setForm({ ...form, lastName: v })
            }
          />
        </div>

        {/* CONTACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Email Address"
            placeholder="employee@company.com"
            value={form.email}
            onChange={(v) =>
              setForm({ ...form, email: v })
            }
          />

          <Input
            label="Phone Number"
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={(v) =>
              setForm({ ...form, phone: v })
            }
          />
        </div>

        {/* ROLE */}
        <div>
          <label className="block text-sm mb-2 text-white/70">
            Role
          </label>
          <select
            className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="employee" className="text-black">
              Employee
            </option>
            <option value="manager" className="text-black">
              Manager
            </option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl text-white font-medium transition shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save Member"}
          </button>

          <button
            onClick={() => router.push("/team")}
            className="px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/10 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE INPUT ================= */

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm mb-2 text-white/70">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
