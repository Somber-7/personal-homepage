import Link from "next/link";
import { emptyDetailCount, listRows } from "@/lib/admin-data";
import { RESOURCES, type ResourceKey } from "@/lib/admin-resources";

export default async function AdminDashboard() {
  const keys = Object.keys(RESOURCES) as ResourceKey[];
  const lists = await Promise.all(keys.map((k) => listRows(k)));
  const projects = lists[keys.indexOf("projects")];
  const unfinished = projects.filter((p) => emptyDetailCount(p) > 0).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>대시보드</h1>
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
              {["항목", "건수", "비고", "관리"].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((k, i) => (
              <tr key={k} style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="px-3 py-2.5 font-medium" style={{ color: "var(--foreground)" }}>{RESOURCES[k].label}</td>
                <td className="px-3 py-2.5" style={{ color: "var(--foreground)" }}>{lists[i].length}건</td>
                <td className="px-3 py-2.5" style={{ color: unfinished && k === "projects" ? "var(--accent)" : "var(--muted)" }}>
                  {k === "projects" && unfinished > 0 ? `상세 칸이 빈 프로젝트 ${unfinished}건` : ""}
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/admin/${k}`} className="px-2.5 py-1 rounded text-xs" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}>
                    관리
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
