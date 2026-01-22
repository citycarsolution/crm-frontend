"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= TYPES ================= */
type Invoice = {
  _id: string;
  invoiceNo: string;
  client: string;
  campaign: string;
  total: number;
  createdAt: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== DATE FILTER ===== */
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= AUTH + ROLE GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login");
      return;
    }

    // 🔒 ONLY ADMIN ALLOWED
    if (role !== "admin") {
      router.replace("/leads");
      return;
    }

    fetch("http://localhost:5000/api/invoices", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // 🔥 SAFETY FIX
        if (Array.isArray(data)) {
          setInvoices(data);
        } else if (Array.isArray(data?.data)) {
          setInvoices(data.data);
        } else {
          setInvoices([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setInvoices([]);
        setLoading(false);
      });
  }, [router]);

  /* ================= FILTERED DATA ================= */
  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const d = new Date(i.createdAt).getTime();
      const from = fromDate ? new Date(fromDate).getTime() : null;
      const to = toDate ? new Date(toDate).getTime() : null;

      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [invoices, fromDate, toDate]);

  /* ================= SUMMARY ================= */
  const totalRevenue = filteredInvoices.reduce(
    (s, i) => s + Number(i.total || 0),
    0
  );

  /* ================= MONTH WISE ================= */
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const currentYear = new Date().getFullYear();

  const chartData = months.map((m, index) => {
    const monthInvoices = filteredInvoices.filter((i) => {
      const d = new Date(i.createdAt);
      return d.getMonth() === index && d.getFullYear() === currentYear;
    });

    return {
      month: m,
      revenue: monthInvoices.reduce(
        (s, i) => s + Number(i.total || 0),
        0
      ),
      orders: monthInvoices.length,
    };
  });

  /* ================= CAMPAIGNS ================= */
  const campaignMap: Record<string, number> = {};
  filteredInvoices.forEach((i) => {
    if (!i.campaign) return;
    campaignMap[i.campaign] =
      (campaignMap[i.campaign] || 0) + Number(i.total || 0);
  });

  if (loading) {
    return <div className="p-6 text-white">Loading dashboard…</div>;
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* ===== DATE FILTER ===== */}
      <div className="glass p-4 rounded-xl mb-6 flex flex-wrap gap-4">
        <div>
          <label className="text-xs text-white/60">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-transparent border border-white/20 rounded px-3 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-white/60">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-transparent border border-white/20 rounded px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard title="Total Revenue" value={`₹${totalRevenue}`} />
        <GlassCard title="Total Orders" value={filteredInvoices.length} />
        <GlassCard
          title="Active Campaigns"
          value={Object.keys(campaignMap).length}
        />
        <GlassCard
          title="Months Active"
          value={chartData.filter((d) => d.revenue > 0).length}
        />
      </div>

      {/* ===== CHART ===== */}
      <div className="glass p-6 rounded-xl mb-8">
        <h2 className="text-lg font-semibold mb-4 text-blue-300">
          Month-wise Orders & Revenue
        </h2>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} />
              <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== RECENT ===== */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4 text-blue-300">
          Recent Revenue Activity
        </h2>

        {filteredInvoices.slice(0, 5).map((i) => (
          <div
            key={i._id}
            className="flex justify-between items-center border-b border-white/10 pb-2 mb-2"
          >
            <div>
              <p className="font-medium">{i.client}</p>
              <p className="text-xs text-white/60">
                {new Date(i.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="font-semibold text-green-400">₹{i.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= GLASS CARD ================= */
function GlassCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="glass rounded-xl p-5">
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
