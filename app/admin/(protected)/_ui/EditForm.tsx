"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RESOURCES, type Field, type FormValues, type ResourceKey } from "@/lib/admin-resources";

const inputStyle = {
  background: "var(--background)",
  border: "1px solid var(--border)",
  color: "var(--foreground)",
};

// 추가·수정 페이지의 입력 폼. 저장하면 목록으로 돌아간다
export default function EditForm({ resource, id, initial }: { resource: ResourceKey; id: number | null; initial: FormValues }) {
  const router = useRouter();
  const config = RESOURCES[resource];
  const fields = config.fields as Field[];
  const [values, setValues] = useState<FormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const listHref = `/admin/${resource}`;

  const set = (name: string, v: string | boolean) => setValues((prev) => ({ ...prev, [name]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.name];
      if (f.kind === "list") body[f.name] = String(v).split(",").map((t) => t.trim()).filter(Boolean);
      else if (f.kind === "number") body[f.name] = Number(v) || 0;
      else body[f.name] = v;
    }
    const res = await fetch(id ? `${config.api}/${id}` : config.api, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setSaving(false);
      if (res.status === 401) {
        setError("로그인이 풀렸습니다. 다시 로그인한 뒤 저장하세요.");
        return;
      }
      // 검증 실패면 어느 칸이 문제인지 칸 이름으로 보여 준다
      const body = (await res.json().catch(() => null)) as { error?: string; issues?: { path: string; message: string }[] } | null;
      const label = (name: string) => fields.find((f) => f.name === name)?.label ?? name;
      const detail = body?.issues?.map((i) => `${label(i.path)}: ${i.message}`).join(" / ");
      setError(detail ? `저장하지 못했습니다 — ${detail}` : `저장하지 못했습니다 (${body?.error ?? res.status})`);
      return;
    }
    router.push(listHref);
    router.refresh();
  }

  return (
    <form onSubmit={save}>
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
        {fields.map((f) => (
          <div key={f.name} className={f.wide || f.kind === "textarea" ? "md:col-span-2" : ""}>
            {f.kind === "checkbox" ? (
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--foreground)" }}>
                <input type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => set(f.name, e.target.checked)} className="w-4 h-4" />
                {f.label}
              </label>
            ) : (
              <>
                <label htmlFor={f.name} className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                  {f.label}
                </label>
                {f.kind === "textarea" ? (
                  <textarea
                    id={f.name}
                    value={String(values[f.name])}
                    onChange={(e) => set(f.name, e.target.value)}
                    rows={f.rows ?? 4}
                    className="w-full px-3 py-2.5 rounded-md text-sm leading-relaxed outline-none focus:border-[var(--foreground)]"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                ) : (
                  <input
                    id={f.name}
                    type={f.kind === "number" ? "number" : "text"}
                    value={String(values[f.name])}
                    onChange={(e) => set(f.name, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md text-sm outline-none focus:border-[var(--foreground)]"
                    style={inputStyle}
                  />
                )}
                {f.hint && <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{f.hint}</p>}
                {f.name === "image" && values.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(values.image)} alt="" className="mt-2 w-full max-w-sm aspect-video rounded object-cover object-top" style={{ border: "1px solid var(--border)" }} />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-6 text-sm" style={{ color: "#b42318" }}>{error}</p>}

      <div className="mt-8 pt-6 flex gap-3" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-md text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          {saving ? "저장 중…" : "저장"}
        </button>
        <Link href={listHref} className="px-5 py-2.5 rounded-md text-sm" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}>
          취소
        </Link>
      </div>
    </form>
  );
}
