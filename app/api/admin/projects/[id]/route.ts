import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      client: body.client,
      period: body.period,
      desc: body.desc,
      role: body.role,
      image: body.image ? String(body.image).trim() : null,
      tags: JSON.stringify(body.tags ?? []),
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { id } = await params;
  await prisma.project.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
