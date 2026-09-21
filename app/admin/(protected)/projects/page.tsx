"use client";

import { useEffect, useState } from "react";

type Project = {
  id: number;
  title: string;
  client: string;
  org: string;
  period: string;
  desc: string;
  work: string;
  solution: string;
  result: string;
  role: string;
  image: string;
  link: string;
  tags: string;
  order: number;
};

const EMPTY: Omit<Project, "id"> = {
  title: "", client: "", org: "", period: "", desc: "", work: "", solution: "", result: "", role: "", image: "", link: "", tags: "", order: 0,
};

export default function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setItems(data.map((p: Project) => ({ ...p, image: p.image ?? "", link: p.link ?? "", tags: JSON.parse(p.tags).join(", ") })));
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setIsNew(true);
  }

  function openEdit(item: Project) {
    setEditing(item);
    setForm({ title: item.title, client: item.client, org: item.org, period: item.period, desc: item.desc, work: item.work ?? "", solution: item.solution ?? "", result: item.result ?? "", role: item.role, image: item.image, link: item.link, tags: item.tags, order: item.order });
    setIsNew(false);
  }

  function closeForm() { setEditing(null); setIsNew(false); }

  async function save() {
    setLoading(true);
    const body = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    if (isNew) {
      await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else if (editing) {
      await fetch(`/api/admin/projects/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    await load();
    closeForm();
    setLoading(false);
  }

  async function remove(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>프로젝트 관리</h1>
        <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
          + 추가
        </button>
      </div>

      {/* 폼 */}
      {(isNew || editing) && (
        <div className="p-6 rounded-xl mb-6" style={{ background: "var(--surface)", border: "1px solid var(--accent)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--accent)" }}>
            {isNew ? "새 프로젝트 추가" : "프로젝트 수정"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="프로젝트명" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Field label="클라이언트" value={form.client} onChange={(v) => setForm({ ...form, client: v })} />
            <Field label="소속 (같은 값끼리 홈페이지에서 묶임)" value={form.org} onChange={(v) => setForm({ ...form, org: v })} />
            <Field label="기간 (모르면 비워 두기)" value={form.period} onChange={(v) => setForm({ ...form, period: v })} />
            <Field label="역할" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
            <Field label="사이트 주소 (예: https://example.com · 비우면 버튼 없음)" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
            <Field label="태그 (쉼표 구분)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
            <Field label="순서" value={String(form.order)} onChange={(v) => setForm({ ...form, order: Number(v) })} type="number" />
            <div className="md:col-span-2">
              <Field label="대표 이미지 경로 (예: /projects/halil.jpg · 비우면 기본 헤더)" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
              {form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="미리보기" className="mt-2 rounded-lg w-full max-w-sm aspect-video object-cover object-top" style={{ border: "1px solid var(--border)" }} />
              )}
            </div>
            <div className="md:col-span-2">
              <Field label="개요" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} multiline />
            </div>
            <p className="md:col-span-2 text-xs" style={{ color: "var(--muted)" }}>
              아래 세 칸은 상세 페이지에 나옵니다. 한 줄에 하나씩 쓰고, &quot;라벨: 내용&quot;으로 쓰면 라벨이 굵게 나옵니다. 비우면 &apos;준비 중&apos;으로 표시됩니다.
            </p>
            <div className="md:col-span-2">
              <Field label="맡은 일" value={form.work} onChange={(v) => setForm({ ...form, work: v })} multiline />
            </div>
            <div className="md:col-span-2">
              <Field label="구현과 문제 해결" value={form.solution} onChange={(v) => setForm({ ...form, solution: v })} multiline />
            </div>
            <div className="md:col-span-2">
              <Field label="결과" value={form.result} onChange={(v) => setForm({ ...form, result: v })} multiline />
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

      {/* 목록 */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl flex items-start justify-between gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt="" className="w-24 aspect-video rounded object-cover object-top flex-shrink-0" style={{ border: "1px solid var(--border)" }} />
            ) : (
              <div className="w-24 aspect-video rounded flex-shrink-0" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>{item.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>{item.org ? `[${item.org}] ` : ""}{[item.client, item.period].filter(Boolean).join(" · ")}</p>
              <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>{item.desc}</p>
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
