"use client";

import { useEffect, useState } from "react";

type Campaign = {
  id: number;
  name: string;
  client: string;
};

type Invoice = {
  client: string;
  total: number;
};

export default function CampaignSpend() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const campaigns: Campaign[] = JSON.parse(
      localStorage.getItem("campaigns") || "[]"
    );
    const invoices: Invoice[] = JSON.parse(
      localStorage.getItem("invoices") || "[]"
    );

    const data = campaigns.map((c) => {
      const spend = invoices
        .filter((i) => i.client === c.client)
        .reduce((s, i) => s + Number(i.total || 0), 0);

      return {
        name: c.name,
        client: c.client,
        spend,
      };
    });

    setRows(data);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Campaign-wise Spend
      </h1>

      <table className="w-full bg-white shadow text-sm">
        <thead className="border-b">
          <tr>
            <th className="p-3 text-left">Campaign</th>
            <th>Client</th>
            <th>Spend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="p-3">{r.name}</td>
              <td>{r.client}</td>
              <td>₹{r.spend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
