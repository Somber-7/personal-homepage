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
  const item = await prisma.skill.update({
    where: { id: Number(id) },
    data: {
      category: body.category,
      items: JSON.stringify(body.items ?? []),
      isLearning: body.isLearning ?? false,
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
  await prisma.skill.delete({ where: { id: Number(id) } });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
