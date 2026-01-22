"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddLead() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    client: "",
    campaign: "",
  });

  const submit = () => {
    if (!form.name || !form.phone) {
      alert("Name & phone required");
      return;
    }

    const old = JSON.parse(localStorage.getItem("leads") || "[]");

    old.push({
      id: Date.now(),
      ...form,
      status: "New",
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("leads", JSON.stringify(old));
    router.push("/leads");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add Lead</h1>

      <input className="input" placeholder="Lead Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input className="input" placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input className="input" placeholder="Client"
        onChange={(e) => setForm({ ...form, client: e.target.value })}
      />
      <input className="input" placeholder="Campaign"
        onChange={(e) => setForm({ ...form, campaign: e.target.value })}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Save Lead
      </button>
    </div>
  );
}
