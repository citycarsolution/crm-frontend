"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTeamMember() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);

  const load = async () => {
    const res = await fetch("http://localhost:5000/api/team", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    const user = data.find((u: any) => u._id === id);
    setMember(user);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const update = async () => {
    await fetch(`http://localhost:5000/api/team/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(member),
    });

    router.push("/team");
  };

  const changeStatus = async (status: string) => {
    await fetch(`http://localhost:5000/api/team/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    load();
  };

  const remove = async () => {
    if (!confirm("Delete this member permanently?")) return;

    await fetch(`http://localhost:5000/api/team/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    router.push("/team");
  };

  if (loading || !member) {
    return <div className="text-white">Loading…</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        Edit Team Member
      </h1>

      <div className="glass p-6 space-y-4">
        <input
          className="input w-full"
          value={member.firstName}
          onChange={(e) =>
            setMember({ ...member, firstName: e.target.value })
          }
        />

        <input
          className="input w-full"
          value={member.lastName}
          onChange={(e) =>
            setMember({ ...member, lastName: e.target.value })
          }
        />

        <input
          className="input w-full"
          value={member.email}
          onChange={(e) =>
            setMember({ ...member, email: e.target.value })
          }
        />

        <input
          className="input w-full"
          value={member.phone}
          onChange={(e) =>
            setMember({ ...member, phone: e.target.value })
          }
        />

        <select
          className="input w-full"
          value={member.role}
          onChange={(e) =>
            setMember({ ...member, role: e.target.value })
          }
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <div className="flex gap-3 flex-wrap mt-4">
          <button
            onClick={update}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Update
          </button>

          {member.status !== "blocked" && (
            <button
              onClick={() => changeStatus("blocked")}
              className="bg-yellow-600 px-4 py-2 rounded text-white"
            >
              Block
            </button>
          )}

          {member.status === "blocked" && (
            <button
              onClick={() => changeStatus("active")}
              className="bg-green-600 px-4 py-2 rounded text-white"
            >
              Unblock
            </button>
          )}

          <button
            onClick={remove}
            className="bg-red-600 px-4 py-2 rounded text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
