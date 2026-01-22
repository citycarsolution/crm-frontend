"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ================= DATA ================= */

const CATEGORY_SERVICES: Record<string, string[]> = {
  "Advertising Agency": [
    "Brand Strategy",
    "Lead Generation",
    "Performance Marketing",
    "Creative Ads",
  ],
  "Real Estate Agents": [
    "Property Leads",
    "Project Promotion",
    "Location Based Ads",
  ],
  Hospitals: [
    "Doctor Branding",
    "Appointment Leads",
    "Hospital SEO",
  ],
  Restaurants: [
    "Food Promotion",
    "Local SEO",
    "Zomato Ads",
  ],
  "Car Rentals": [
    "Cab Booking Leads",
    "Airport Ads",
  ],
};

const DIGITAL_PLANS = [
  "Google Ads",
  "Google Maps",
  "Facebook Ads",
  "Instagram Ads",
  "YouTube Ads",
  "SEO",
  "Local SEO",
  "Website Development",
  "Landing Page",
];

type Service = {
  name: string;
  baseAmount: number;
  amount: number;
  maintenance: "Monthly" | "One-Time" | "AMC";
  gst: boolean;
  paymentMode: "Cash" | "UPI";
};

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    business: "",
    userName: "",
    phone: "",
    email: "",
    website: "",
    city: "",
    state: "",
    country: "",
    category: "",
    services: [] as Service[],
  });

  const update = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleService = (name: string) => {
    const exists = form.services.find((s) => s.name === name);

    setForm({
      ...form,
      services: exists
        ? form.services.filter((s) => s.name !== name)
        : [
            ...form.services,
            {
              name,
              baseAmount: 0,
              amount: 0,
              maintenance: "Monthly",
              gst: false,
              paymentMode: "UPI",
            },
          ],
    });
  };

  const updateService = (
    name: string,
    key: keyof Service,
    value: any
  ) => {
    setForm({
      ...form,
      services: form.services.map((s) => {
        if (s.name !== name) return s;

        const base =
          key === "baseAmount" ? value : s.baseAmount;

        return {
          ...s,
          [key]: value,
          amount: s.gst
            ? Math.round(base + base * 0.18)
            : base,
        };
      }),
    });
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    await fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    setLoading(false);
    router.push("/leads");
  };

  const servicesToShow = [
    ...(CATEGORY_SERVICES[form.category] || []),
    ...DIGITAL_PLANS,
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">
        Add New Client
      </h1>
      <p className="text-white/60 mb-8">
        Create client profile & assign services
      </p>

      <form onSubmit={submit} className="space-y-10">
        {/* CLIENT DETAILS */}
        <Card title="Client Details">
          <Input label="Business Name" name="business" onChange={update} />
          <Input label="Contact Person" name="userName" onChange={update} />
          <Input label="Phone" name="phone" onChange={update} />
          <Input label="Email" name="email" onChange={update} />
          <Input label="Website" name="website" onChange={update} />
        </Card>

        {/* LOCATION */}
        <Card title="Location">
          <Input label="City" name="city" onChange={update} />
          <Input label="State" name="state" onChange={update} />
          <Input label="Country" name="country" onChange={update} />
        </Card>

        {/* CATEGORY */}
        <Card title="Business Category">
          <select
            name="category"
            onChange={update}
            className="input"
          >
            <option value="">Select Category</option>
            {Object.keys(CATEGORY_SERVICES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Card>

        {/* SERVICES */}
        {form.category && (
          <Card title="Services & Pricing">
            <div className="space-y-4">
              {servicesToShow.map((s) => {
                const selected = form.services.find(
                  (x) => x.name === s
                );

                return (
                  <div
                    key={s}
                    className={`p-5 rounded-xl border transition ${
                      selected
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div
                      className="flex justify-between cursor-pointer"
                      onClick={() => toggleService(s)}
                    >
                      <span>{s}</span>
                      {selected && <span>✔</span>}
                    </div>

                    {selected && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <input
                          type="number"
                          className="input"
                          placeholder="Amount ₹"
                          onChange={(e) =>
                            updateService(
                              s,
                              "baseAmount",
                              Number(e.target.value)
                            )
                          }
                        />

                        <select
                          className="input"
                          onChange={(e) =>
                            updateService(
                              s,
                              "maintenance",
                              e.target.value
                            )
                          }
                        >
                          <option>Monthly</option>
                          <option>One-Time</option>
                          <option>AMC</option>
                        </select>

                        <select
                          className="input"
                          onChange={(e) =>
                            updateService(
                              s,
                              "paymentMode",
                              e.target.value
                            )
                          }
                        >
                          <option>UPI</option>
                          <option>Cash</option>
                        </select>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              updateService(
                                s,
                                "gst",
                                e.target.checked
                              )
                            }
                          />
                          GST (18%)
                        </label>

                        <div className="col-span-2 text-right text-green-400 font-semibold">
                          Final: ₹{selected.amount}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Create Client"}
        </button>
      </form>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm mb-2 text-white/70">
        {label}
      </label>
      <input {...props} className="input" />
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="glass p-8 rounded-2xl">
      <h3 className="text-lg font-semibold mb-6">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>
    </div>
  );
}
