import { NextResponse } from "next/server";
import { deleteRow, updateRow } from "@/lib/admin-data";
import { isNotFound, json, readBody, refreshSite, requireAdmin, resourceOr404 } from "@/lib/admin-api";
import { parseId } from "@/lib/admin-schema";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function target(params: Ctx["params"]) {
  const p = await params;
  const key = resourceOr404(p.resource);
  if (key instanceof NextResponse) return key;
  const id = parseId(p.id);
  if (id === null) return json({ error: "잘못된 번호입니다" }, 400);
  return { key, id };
}

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const t = await target(params);
  if (t instanceof NextResponse) return t;
  const data = await readBody(req, t.key);
  if (data instanceof NextResponse) return data;
  try {
    const item = await updateRow(t.key, t.id, data);
    refreshSite();
    return json(item);
  } catch (e) {
    if (isNotFound(e)) return json({ error: "없는 항목입니다" }, 404);
    throw e;
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const t = await target(params);
  if (t instanceof NextResponse) return t;
  try {
    await deleteRow(t.key, t.id);
    refreshSite();
    return json({ ok: true });
  } catch (e) {
    if (isNotFound(e)) return json({ error: "없는 항목입니다" }, 404);
    throw e;
  }
}
