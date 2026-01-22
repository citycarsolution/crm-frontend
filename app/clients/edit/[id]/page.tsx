"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ==== AVAILABLE SERVICES ==== */
const SERVICES = [
  "Google Ads",
  "Facebook Ads",
  "Instagram Ads",
  "YouTube Ads",
  "SEO",
  "Local SEO",
  "Website Development",
];

type Role = "owner" | "manager" | "sales";

type Service = {
  name: string;
  amount?: number;
};

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();

  const [role, setRole] = useState<Role>("sales");
  const [business, setBusiness] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = role === "owner";

  /* ==== LOAD ROLE ==== */
  useEffect(() => {
    const r = localStorage.getItem("role") as Role;
    if (r) setRole(r);
  }, []);

  /* ==== LOAD CLIENT ==== */
  useEffect(() => {
    if (!id) return;

    try {
      const stored = localStorage.getItem("clients");
      const clients = stored ? JSON.parse(stored) : [];

      const client = clients.find(
        (c: any) => String(c.id) === String(id)
      );
      if (!client) return;

      setBusiness(client.business || "");
      setServices(client.services || []);
    } catch (err) {
      console.error("Failed to load client", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading client...</div>;
  }

  /* ==== ADMIN ONLY ==== */
  const toggleService = (name: string) => {
    if (!isAdmin) return;

    setServices((prev) => {
      const exists = prev.find((s) => s.name === name);
      if (exists) {
        return prev.filter((s) => s.name !== name);
      }
      return [...prev, { name, amount: 0 }];
    });
  };

  const updateAmount = (name: string, amount: number) => {
    if (!isAdmin) return;

    setServices((prev) =>
      prev.map((s) =>
        s.name === name ? { ...s, amount } : s
      )
    );
  };

  const saveClient = () => {
    if (!isAdmin) return;

    try {
      const stored = localStorage.getItem("clients");
      const clients = stored ? JSON.parse(stored) : [];

      const updated = clients.map((c: any) =>
        String(c.id) === String(id)
          ? { ...c, business, services }
          : c
      );

      localStorage.setItem("clients", JSON.stringify(updated));
      router.push("/clients");
    } catch (err) {
      alert("Failed to save client");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        Edit Client
      </h1>

      {/* BUSINESS NAME */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Business Name
        </label>
        <input
          value={business}
          disabled={!isAdmin}
          onChange={(e) => setBusiness(e.target.value)}
          className="w-full p-3 border rounded disabled:bg-gray-100"
          placeholder="Business Name"
        />
      </div>

      {/* SERVICES */}
      <div className="mb-6">
        <p className="font-semibold mb-3">
          Services {isAdmin ? "& Amount" : ""}
        </p>

        <div className="space-y-3">
          {SERVICES.map((service) => {
            const selected = services.find(
              (s) => s.name === service
            );

            return (
              <div
                key={service}
                className="flex items-center gap-4 p-3 border rounded"
              >
                <input
                  type="checkbox"
                  checked={!!selected}
                  disabled={!isAdmin}
                  onChange={() => toggleService(service)}
                />

                <span className="w-40">{service}</span>

                {selected && isAdmin && (
                  <input
                    type="number"
                    value={selected.amount}
                    onChange={(e) =>
                      updateAmount(
                        service,
                        Number(e.target.value)
                      )
                    }
                    className="p-2 border rounded w-32"
                    placeholder="Amount ₹"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SAVE BUTTON */}
      {isAdmin && (
        <button
          onClick={saveClient}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save Changes
        </button>
      )}
    </div>
  );
}
