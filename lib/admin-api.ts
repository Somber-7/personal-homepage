import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { isResourceKey, type ResourceKey } from "@/lib/admin-resources";
import { schemaFor, toDbData } from "@/lib/admin-schema";

// 관리자 API 공통 처리: 세션 확인, 항목 확인, 본문 검증, 저장 후 공개 페이지 갱신

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

export async function requireAdmin() {
  const session = await getServerSession();
  return session ? null : json({ error: "로그인이 필요합니다" }, 401);
}

export function resourceOr404(raw: string): ResourceKey | NextResponse {
  return isResourceKey(raw) ? raw : json({ error: "없는 항목입니다" }, 404);
}

// 요청 본문을 읽어 검증한다. 실패하면 400 응답을 돌려준다
export async function readBody(req: Request, key: ResourceKey): Promise<Record<string, unknown> | NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON 형식이 아닙니다" }, 400);
  }
  const parsed = schemaFor(key).safeParse(body);
  if (!parsed.success) {
    return json({ error: "입력값이 올바르지 않습니다", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, 400);
  }
  return toDbData(key, parsed.data);
}

// Prisma: 대상 행이 없을 때
export const isNotFound = (e: unknown) => typeof e === "object" && e !== null && (e as { code?: string }).code === "P2025";

export const refreshSite = () => revalidatePath("/", "layout");
