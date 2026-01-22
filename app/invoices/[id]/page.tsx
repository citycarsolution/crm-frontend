"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/invoices/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then(setInvoice);
  }, [id]);

  if (!invoice) {
    return <div className="text-white p-6">Loading invoice…</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="glass w-full max-w-3xl p-8">
        <h1 className="text-2xl font-bold mb-6">
          Invoice #{invoice.invoiceNo}
        </h1>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-white/60">Client</p>
            <p className="font-semibold">{invoice.client}</p>
          </div>

          <div>
            <p className="text-white/60">Campaign</p>
            <p className="font-semibold">{invoice.campaign}</p>
          </div>

          <div>
            <p className="text-white/60">Date</p>
            <p>{new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="text-white/60">Amount</p>
            <p className="text-green-400 font-bold text-lg">
              ₹{invoice.total}
            </p>
          </div>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg"
          onClick={() =>
            window.open(
              `http://localhost:5000/api/invoices/${id}/pdf`,
              "_blank"
            )
          }
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
