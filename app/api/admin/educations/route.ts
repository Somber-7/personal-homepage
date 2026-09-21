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
  const data = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await req.json();
  const item = await prisma.education.create({
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
  revalidatePath("/", "layout");
  return NextResponse.json(item, { status: 201 });
}
