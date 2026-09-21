"use client";

import { useEffect, useState } from "react";

type Certification = {
  id: number;
  name: string;
  org: string;
  year: string;
  order: number;
};

const EMPTY: Omit<Certification, "id"> = { name: "", org: "", year: "", order: 0 };

export default function CertificationsAdmin() {
  const [items, setItems] = useState<Certification[]>([]);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/certifications");
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(EMPTY); setIsNew(true); }
  function openEdit(item: Certification) {
    setEditing(item);
    setForm({ name: item.name, org: item.org, year: item.year, order: item.order });
    setIsNew(false);
  }
  function closeForm() { setEditing(null); setIsNew(false); }

  async function save() {
    setLoading(true);
    if (isNew) {
      await fetch("/api/admin/certifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else if (editing) {
      await fetch(`/api/admin/certifications/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    await load();
    closeForm();
    setLoading(false);
  }

  async function remove(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/certifications/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>자격증 관리</h1>
        <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
          + 추가
        </button>
      </div>

      {(isNew || editing) && (
        <div className="p-6 rounded-xl mb-6" style={{ background: "var(--surface)", border: "1px solid var(--accent)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--accent)" }}>
            {isNew ? "새 자격증 추가" : "자격증 수정"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="자격증명" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="발급기관" value={form.org} onChange={(v) => setForm({ ...form, org: v })} />
            <Field label="취득연도" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="예: 2019" />
            <Field label="순서" value={String(form.order)} onChange={(v) => setForm({ ...form, order: Number(v) })} type="number" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={loading} className="px-5 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "var(--accent)", color: "#fff" }}>
              {loading ? "저장 중..." : "저장"}
            </button>
            <button onClick={closeForm} className="px-5 py-2 rounded-lg text-sm" style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
              취소
            </button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl flex items-center justify-between gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div>
              <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{item.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{item.org} · {item.year}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded text-xs" style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>수정</button>
              <button onClick={() => remove(item.id)} className="px-3 py-1.5 rounded text-xs" style={{ border: "1px solid #b42318", color: "#b42318" }}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5 font-mono" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "var(--background)", border: "1px solid var(--border)",
          color: "var(--foreground)", outline: "none", width: "100%",
          padding: "10px 14px", borderRadius: "8px", fontSize: "14px",
        }}
      />
    </div>
  );
}
