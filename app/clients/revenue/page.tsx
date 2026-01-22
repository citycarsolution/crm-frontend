"use client";

import { useEffect, useState } from "react";

type Invoice = {
  client: string;
  total: number;
};

export default function ClientRevenue() {
  const [map, setMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const invoices: Invoice[] = JSON.parse(
      localStorage.getItem("invoices") || "[]"
    );

    const revenue: Record<string, number> = {};

    invoices.forEach((i) => {
      revenue[i.client] =
        (revenue[i.client] || 0) + Number(i.total || 0);
    });

    setMap(revenue);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Client-wise Revenue
      </h1>

      <table className="w-full bg-white shadow text-sm">
        <thead className="border-b">
          <tr>
            <th className="p-3 text-left">Client</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(map).map((c) => (
            <tr key={c} className="border-b">
              <td className="p-3">{c}</td>
              <td>₹{map[c]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
