"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Client = {
  _id: string;
  business: string;
  userName: string;
  phone: string;
  email: string;
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null;

  useEffect(() => {
    fetch("http://localhost:5000/api/clients", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then(setClients);
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>

        {(role === "admin" || role === "manager") && (
          <Link
            href="/clients/add"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium"
          >
            + Add Client
          </Link>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="p-3 text-left">Business</th>
              <th>User</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {clients.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500"
                >
                  No clients found
                </td>
              </tr>
            )}

            {clients.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="p-3">{c.business}</td>
                <td>{c.userName}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
