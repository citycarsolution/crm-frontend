"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Campaign = {
  _id: string;
  name: string;
  client: string;
  status: string;
  spend: number;
};

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/api/campaigns", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setCampaigns(data || []);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="p-6 text-white">Loading…</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>

      <div className="glass p-4">
        <table className="w-full text-sm">
          <thead className="border-b border-white/20">
            <tr>
              <th className="p-3 text-left">Campaign</th>
              <th>Client</th>
              <th>Status</th>
              <th className="text-right">Spend</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-b border-white/10">
                <td className="p-3">{c.name}</td>
                <td>{c.client}</td>
                <td>{c.status}</td>
                <td className="text-right text-green-400">
                  ₹{c.spend || 0}
                </td>
              </tr>
            ))}

            {campaigns.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-white/50">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
