import Link from "next/link";
import { notFound } from "next/navigation";
import { getRow } from "@/lib/admin-data";
import { RESOURCES, isResourceKey, toFormValues } from "@/lib/admin-resources";
import EditForm from "../../_ui/EditForm";

// /admin/[항목]/new 는 추가, /admin/[항목]/[번호] 는 수정
export default async function AdminEditPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!isResourceKey(resource)) notFound();
  const isNew = id === "new";
  const numId = Number(id);
  if (!isNew && !Number.isInteger(numId)) notFound();
  const row = isNew ? null : await getRow(resource, numId);
  if (!isNew && !row) notFound();
  const config = RESOURCES[resource];

  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${resource}`} className="text-sm hover:underline" style={{ color: "var(--muted)" }}>
        ← {config.label} 목록
      </Link>
      <h1 className="mt-3 mb-8 text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        {isNew ? `${config.label} 추가` : `${config.label} 수정`}
      </h1>
      <EditForm resource={resource} id={isNew ? null : numId} initial={toFormValues(resource, row)} />
    </div>
  );
}
