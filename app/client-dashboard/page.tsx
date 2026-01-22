"use client";

import { useEffect, useState } from "react";

type Campaign = {
  id: number;
  client: string;
  status: "Active" | "Paused";
};

type Invoice = {
  id: number;
  client: string;
  total: number;
  createdAt: string;
};

export default function ClientDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    // 👤 Logged-in client name (demo)
    const name = localStorage.getItem("clientName");
    if (!name) return;

    setClientName(name);

    const allCampaigns: Campaign[] = JSON.parse(
      localStorage.getItem("campaigns") || "[]"
    );

    const allInvoices: Invoice[] = JSON.parse(
      localStorage.getItem("invoices") || "[]"
    );

    setCampaigns(
      allCampaigns.filter((c) => c.client === name)
    );

    setInvoices(
      allInvoices.filter((i) => i.client === name)
    );
  }, []);

  const totalSpend = invoices.reduce(
    (s, i) => s + Number(i.total || 0),
    0
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {clientName}
      </h1>

      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Active Campaigns" value={campaigns.length} />
        <Card title="Invoices" value={invoices.length} />
        <Card title="Total Spend" value={`₹${totalSpend}`} />
      </div>

      {/* ===== INVOICES ===== */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4">
          Your Invoices
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i.id} className="border-b">
                <td className="py-2">
                  {new Date(i.createdAt).toLocaleDateString()}
                </td>
                <td>₹{i.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== CARD ===== */
function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
