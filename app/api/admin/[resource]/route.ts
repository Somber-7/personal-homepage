import { NextResponse } from "next/server";
import { createRow, listRows } from "@/lib/admin-data";
import { json, readBody, refreshSite, requireAdmin, resourceOr404 } from "@/lib/admin-api";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const key = resourceOr404((await params).resource);
  if (key instanceof NextResponse) return key;
  return json(await listRows(key));
}

export async function POST(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const key = resourceOr404((await params).resource);
  if (key instanceof NextResponse) return key;
  const data = await readBody(req, key);
  if (data instanceof NextResponse) return data;
  const item = await createRow(key, data);
  refreshSite();
  return json(item, 201);
}
