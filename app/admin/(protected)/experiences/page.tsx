"use client";

import { useEffect, useState } from "react";

type Experience = {
  id: number;
  period: string;
  duration: string;
  company: string;
  role: string;
  desc: string;
  tags: string;
  isCurrent: boolean;
  order: number;
};

const EMPTY: Omit<Experience, "id"> = {
  period: "", duration: "", company: "", role: "", desc: "", tags: "", isCurrent: false, order: 0,
};

export default function ExperiencesAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/experiences");
    const data = await res.json();
    setItems(data.map((e: Experience) => ({ ...e, tags: JSON.parse(e.tags).join(", ") })));
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(EMPTY); setIsNew(true); }
  function openEdit(item: Experience) {
    setEditing(item);
    setForm({ period: item.period, duration: item.duration, company: item.company, role: item.role, desc: item.desc, tags: item.tags, isCurrent: item.isCurrent, order: item.order });
    setIsNew(false);
  }
  function closeForm() { setEditing(null); setIsNew(false); }

  async function save() {
    setLoading(true);
    const body = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    if (isNew) {
      await fetch("/api/admin/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else if (editing) {
      await fetch(`/api/admin/experiences/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    await load();
    closeForm();
    setLoading(false);
  }

  async function remove(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>경력 관리</h1>
        <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#0d1117" }}>
          + 추가
        </button>
      </div>

      {(isNew || editing) && (
        <div className="p-6 rounded-xl mb-6" style={{ background: "var(--surface)", border: "1px solid var(--accent)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--accent)" }}>
            {isNew ? "새 경력 추가" : "경력 수정"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="회사명" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
            <Field label="직책/역할" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
            <Field label="기간 (예: 2020.01 ~ 2024.02)" value={form.period} onChange={(v) => setForm({ ...form, period: v })} />
            <Field label="근무기간 (예: 4년 2개월)" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
            <Field label="태그 (쉼표 구분)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
            <Field label="순서" value={String(form.order)} onChange={(v) => setForm({ ...form, order: Number(v) })} type="number" />
            <div className="md:col-span-2">
              <Field label="업무 설명" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} multiline />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrent"
                checked={form.isCurrent}
                onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isCurrent" className="text-sm" style={{ color: "var(--muted)" }}>
                현재 재직 중
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={loading} className="px-5 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "var(--accent)", color: "#0d1117" }}>
              {loading ? "저장 중..." : "저장"}
            </button>
            <button onClick={closeForm} className="px-5 py-2 rounded-lg text-sm" style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
              취소
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl flex items-start justify-between gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{item.company}</p>
                {item.isCurrent && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(63,185,80,0.15)", color: "var(--accent-green)" }}>현재</span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>{item.role} · {item.period}</p>
              <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>{item.desc}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded text-xs" style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>수정</button>
              <button onClick={() => remove(item.id)} className="px-3 py-1.5 rounded text-xs" style={{ border: "1px solid #f85149", color: "#f85149" }}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline, type }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string;
}) {
  const base = {
    background: "var(--background)", border: "1px solid var(--border)",
    color: "var(--foreground)", outline: "none", width: "100%",
    padding: "10px 14px", borderRadius: "8px", fontSize: "14px",
  };
  return (
    <div>
      <label className="block text-xs mb-1.5 font-mono" style={{ color: "var(--muted)" }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...base, resize: "vertical" }} />
      ) : (
        <input type={type ?? "text"} value={value} onChange={(e) => onChange(e.target.value)} style={base} />
      )}
    </div>
  );
}
