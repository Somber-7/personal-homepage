import { NextRequest, NextResponse } from "next/server";
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
  const data = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await req.json();
  const item = await prisma.experience.create({
    data: {
      period: body.period,
      duration: body.duration,
      company: body.company,
      role: body.role,
      desc: body.desc,
      tags: JSON.stringify(body.tags ?? []),
      isCurrent: body.isCurrent ?? false,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
