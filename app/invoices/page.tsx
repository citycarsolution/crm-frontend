"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Invoice = {
  _id: string;
  invoiceNo: string;
  client: string;
  total: number;
};

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/api/invoices", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setInvoices);
  }, [router]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <div className="glass p-4">
        <table className="w-full text-sm">
          <thead className="border-b border-white/20">
            <tr>
              <th className="p-3 text-left">Invoice</th>
              <th>Client</th>
              <th className="text-right">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i._id} className="border-b border-white/10">
                <td className="p-3">{i.invoiceNo}</td>
                <td>{i.client}</td>
                <td className="text-right text-green-400">
                  ₹{i.total}
                </td>
                <td className="text-right">
                  <a
                    href={`/invoices/${i._id}`}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-white/50">
                  No invoices
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
