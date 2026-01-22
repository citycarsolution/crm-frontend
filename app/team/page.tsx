"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TeamMember = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  status: "active" | "leave" | "blocked";
};

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null;

  const isAdmin = role === "admin";

  /* ================= LOAD TEAM ================= */
  const load = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/team", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setTeam(Array.isArray(data) ? data : data.data || []);
    } catch {
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= DELETE ================= */
  const del = async (id: string) => {
    if (!confirm("Delete this team member?")) return;

    await fetch(`http://localhost:5000/api/team/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    load();
  };

  /* ================= STATUS BADGE ================= */
  const statusBadge = (status: string) => {
    if (status === "active")
      return "bg-green-500/20 text-green-400";
    if (status === "leave")
      return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  if (loading) {
    return <div className="p-6 text-white">Loading team…</div>;
  }

  return (
    <div className="glass p-6 rounded-2xl">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team</h1>

        {isAdmin && (
          <Link
            href="/team/add"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl shadow"
          >
            + Add Member
          </Link>
        )}
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-white/70">
            <tr>
              <th className="py-3 text-left">Name</th>
              <th>Role</th>
              <th>Status</th>
              {isAdmin && <th className="text-right">Action</th>}
            </tr>
          </thead>

          <tbody>
            {team.map((u) => (
              <tr
                key={u._id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-3">
                  {u.firstName} {u.lastName}
                </td>

                <td className="capitalize">{u.role}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                      u.status
                    )}`}
                  >
                    {u.status}
                  </span>
                </td>

                {isAdmin && (
                  <td className="text-right">
                    <Link
                      href={`/team/edit/${u._id}`}
                      className="text-blue-400 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => del(u._id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {team.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 4 : 3}
                  className="py-8 text-center text-white/50"
                >
                  No team members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
