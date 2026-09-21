import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
  const item = await prisma.education.update({
    where: { id: Number(id) },
    data: {
      period: body.period,
      duration: body.duration,
      name: body.name,
      course: body.course,
      desc: body.desc,
      tags: JSON.stringify(body.tags ?? []),
      order: body.order ?? 0,
    },
  });
  revalidatePath("/");
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { id } = await params;
  await prisma.education.delete({ where: { id: Number(id) } });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
