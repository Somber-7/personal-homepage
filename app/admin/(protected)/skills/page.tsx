"use client";

import { useEffect, useState } from "react";

type Skill = {
  id: number;
  category: string;
  items: string;
  isLearning: boolean;
  order: number;
};

const EMPTY: Omit<Skill, "id"> = { category: "", items: "", isLearning: false, order: 0 };

export default function SkillsAdmin() {
  const [items, setItems] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/skills");
    const data = await res.json();
    setItems(data.map((s: Skill) => ({ ...s, items: JSON.parse(s.items).join(", ") })));
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(EMPTY); setIsNew(true); }
  function openEdit(item: Skill) {
    setEditing(item);
    setForm({ category: item.category, items: item.items, isLearning: item.isLearning, order: item.order });
    setIsNew(false);
  }
  function closeForm() { setEditing(null); setIsNew(false); }

  async function save() {
    setLoading(true);
    const body = { ...form, items: form.items.split(",").map((t) => t.trim()).filter(Boolean) };
    if (isNew) {
      await fetch("/api/admin/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else if (editing) {
      await fetch(`/api/admin/skills/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    await load();
    closeForm();
    setLoading(false);
  }

  async function remove(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>기술 스택 관리</h1>
        <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
          + 추가
        </button>
      </div>

      {(isNew || editing) && (
        <div className="p-6 rounded-xl mb-6" style={{ background: "var(--surface)", border: "1px solid var(--accent)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--accent)" }}>
            {isNew ? "새 카테고리 추가" : "카테고리 수정"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="카테고리명" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            <Field label="순서" value={String(form.order)} onChange={(v) => setForm({ ...form, order: Number(v) })} type="number" />
            <div className="md:col-span-2">
              <Field label="기술 목록 (쉼표 구분)" value={form.items} onChange={(v) => setForm({ ...form, items: v })} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isLearning"
                checked={form.isLearning}
                onChange={(e) => setForm({ ...form, isLearning: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isLearning" className="text-sm" style={{ color: "var(--muted)" }}>
                학습 중 카테고리
              </label>
            </div>
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

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl flex items-start justify-between gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{item.category}</p>
                {item.isLearning && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(47,107,79,0.12)", color: "var(--accent-green)" }}>학습 중</span>
                )}
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{item.items}</p>
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

function Field({ label, value, onChange, type }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5 font-mono" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "var(--background)", border: "1px solid var(--border)",
          color: "var(--foreground)", outline: "none", width: "100%",
          padding: "10px 14px", borderRadius: "8px", fontSize: "14px",
        }}
      />
    </div>
  );
}
