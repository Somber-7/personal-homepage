import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { emptyDetailCount, listRows } from "@/lib/admin-data";
import { RESOURCES, isResourceKey, type ResourceKey } from "@/lib/admin-resources";
import DeleteButton from "../_ui/DeleteButton";

type Row = Awaited<ReturnType<typeof listRows>>[number];
type Column = { label: string; cell: (r: Row) => ReactNode; width?: string };

const text = (v: unknown) => (v == null || v === "" ? <Dash /> : String(v));
const count = (v: unknown) => (typeof v === "string" && v ? (JSON.parse(v) as string[]).length : 0);

// 항목별 표 열. 이름 열은 수정 페이지로 가는 링크가 된다
const COLUMNS: Record<ResourceKey, { name: string; nameLabel: string; columns: Column[] }> = {
  experiences: {
    name: "company",
    nameLabel: "회사",
    columns: [
      { label: "직책 · 역할", cell: (r) => text(r.role) },
      { label: "기간", cell: (r) => text(r.period), width: "170px" },
      { label: "현재", cell: (r) => (r.isCurrent ? "재직 중" : <Dash />), width: "72px" },
    ],
  },
  educations: {
    name: "name",
    nameLabel: "기관",
    columns: [
      { label: "과정", cell: (r) => text(r.course) },
      { label: "기간", cell: (r) => text(r.period), width: "170px" },
    ],
  },
  projects: {
    name: "title",
    nameLabel: "프로젝트명",
    columns: [
      { label: "소속", cell: (r) => text(r.org), width: "150px" },
      { label: "기간", cell: (r) => text(r.period), width: "150px" },
      {
        label: "상세 칸",
        width: "90px",
        cell: (r) => {
          const empty = emptyDetailCount(r);
          return empty ? <span style={{ color: "var(--accent)" }}>{empty}칸 빔</span> : "채움";
        },
      },
      { label: "이미지", cell: (r) => (r.image ? "있음" : <Dash />), width: "64px" },
    ],
  },
  skills: {
    name: "category",
    nameLabel: "분야",
    columns: [
      { label: "항목 수", cell: (r) => `${count(r.items)}개`, width: "80px" },
      { label: "학습 중", cell: (r) => (r.isLearning ? "예" : <Dash />), width: "72px" },
    ],
  },
  certifications: {
    name: "name",
    nameLabel: "자격증",
    columns: [
      { label: "발급 기관", cell: (r) => text(r.org) },
      { label: "취득", cell: (r) => text(r.year), width: "100px" },
    ],
  },
};

export default async function AdminListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceKey(resource)) notFound();
  const config = RESOURCES[resource];
  const { name, nameLabel, columns } = COLUMNS[resource];
  const rows = await listRows(resource);

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{config.label}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{rows.length}건 · 순서 오름차순</p>
        </div>
        <Link
          href={`/admin/${resource}/new`}
          className="px-4 py-2 rounded-md text-sm font-semibold"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          추가
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
              <Th width="56px">순서</Th>
              <Th>{nameLabel}</Th>
              {columns.map((c) => <Th key={c.label} width={c.width}>{c.label}</Th>)}
              <Th width="120px">관리</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--surface)]" style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="px-3 py-2.5 font-mono text-xs" style={{ color: "var(--muted)" }}>{String(r.order)}</td>
                <td className="px-3 py-2.5">
                  <Link href={`/admin/${resource}/${r.id}`} className="font-medium hover:underline" style={{ color: "var(--foreground)" }}>
                    {String(r[name] || "(이름 없음)")}
                  </Link>
                </td>
                {columns.map((c) => (
                  <td key={c.label} className="px-3 py-2.5 whitespace-nowrap" style={{ color: "var(--muted)" }}>{c.cell(r)}</td>
                ))}
                <td className="px-3 py-2.5">
                  <div className="flex gap-1.5">
                    <Link
                      href={`/admin/${resource}/${r.id}`}
                      className="px-2.5 py-1 rounded text-xs"
                      style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                    >
                      수정
                    </Link>
                    <DeleteButton api={config.api} id={r.id} name={String(r[name] ?? "")} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 3} className="px-3 py-10 text-center" style={{ color: "var(--muted)" }}>
                  아직 없음
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, width }: { children: ReactNode; width?: string }) {
  return (
    <th className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap" style={{ color: "var(--muted)", width }}>
      {children}
    </th>
  );
}

function Dash() {
  return <span style={{ color: "var(--border)" }}>—</span>;
}
