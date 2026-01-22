"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Role = "admin" | "manager" | "team";

type Service = {
  name: string;
  amount: number;
};

type Lead = {
  _id: string;
  business: string;
  userName: string;
  phone: string;
  email: string;
  services: Service[];
  gst: boolean;
  paymentMode: "Cash" | "UPI";
  status: "Pending Payment" | "Approved" | "Rejected";
};

/* ================= PAGE ================= */

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [role, setRole] = useState<Role>("team");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ===== LOAD LEADS ===== */
  const loadLeads = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/leads", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
  };

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const r = localStorage.getItem("role") as Role;

    if (!token) {
      router.push("/login");
      return;
    }

    setRole(r || "team");
    loadLeads().finally(() => setLoading(false));
  }, [router]);

  const isAdmin = role === "admin";

  /* ===== APPROVE ===== */
  const approvePayment = async (id: string) => {
    const token = localStorage.getItem("token");
    setActionLoading(id);

    await fetch(`http://localhost:5000/api/leads/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    await loadLeads();
    setActionLoading(null);
  };

  /* ===== REJECT ===== */
  const rejectPayment = async (id: string) => {
    const token = localStorage.getItem("token");
    setActionLoading(id);

    await fetch(`http://localhost:5000/api/leads/${id}/reject`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    await loadLeads();
    setActionLoading(null);
  };

  if (loading) {
    return <div className="p-6 text-white">Loading leads…</div>;
  }

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Lead Payment Approval</h1>

      <div className="glass rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr className="text-left">
              <th className="p-4">Business</th>
              <th>User</th>
              <th>Phone</th>
              <th>Status</th>
              {isAdmin && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {leads.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 5 : 4}
                  className="p-6 text-center text-white/60"
                >
                  No leads found
                </td>
              </tr>
            )}

            {leads.map((l) => (
              <tr
                key={l._id}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4">{l.business}</td>
                <td>{l.userName}</td>
                <td>{l.phone}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      l.status === "Approved"
                        ? "bg-green-500/20 text-green-400"
                        : l.status === "Rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {l.status}
                  </span>
                </td>

                {isAdmin && (
                  <td className="py-3">
                    {l.status === "Pending Payment" ? (
                      <div className="flex gap-2">
                        <button
                          disabled={actionLoading === l._id}
                          onClick={() => approvePayment(l._id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs disabled:opacity-50"
                        >
                          {actionLoading === l._id
                            ? "Processing…"
                            : "Approve"}
                        </button>

                        <button
                          disabled={actionLoading === l._id}
                          onClick={() => rejectPayment(l._id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-white/40 text-xs">
                        —
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
