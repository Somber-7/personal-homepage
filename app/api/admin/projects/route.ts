import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  const data = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await req.json();
  const item = await prisma.project.create({
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
  revalidatePath("/");
  return NextResponse.json(item, { status: 201 });
}
