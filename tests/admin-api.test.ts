import { beforeEach, describe, expect, it, vi } from "vitest";
import { validInput } from "./helpers";

// 세션·DB·페이지 갱신을 가짜로 바꿔 API의 응답 코드만 확인한다
const session = vi.hoisted(() => ({ current: null as null | { user: { name: string } } }));
vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => session.current) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
const db = vi.hoisted(() => ({
  listRows: vi.fn(async () => [{ id: 1 }]),
  createRow: vi.fn(async (_k: string, data: Record<string, unknown>) => ({ id: 1, ...data })),
  updateRow: vi.fn(async (_k: string, id: number, data: Record<string, unknown>) => ({ id, ...data })),
  deleteRow: vi.fn(async () => ({ id: 1 })),
}));
vi.mock("@/lib/admin-data", () => db);

const list = await import("@/app/api/admin/[resource]/route");
const item = await import("@/app/api/admin/[resource]/[id]/route");
const { revalidatePath } = await import("next/cache");

const ctx = (resource: string) => ({ params: Promise.resolve({ resource }) });
const itemCtx = (resource: string, id: string) => ({ params: Promise.resolve({ resource, id }) });
const req = (body: unknown, method = "POST") =>
  new Request("http://localhost/api/admin/x", {
    method,
    body: method === "GET" ? undefined : typeof body === "string" ? body : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  vi.clearAllMocks();
  session.current = { user: { name: "admin" } };
});

describe("로그인하지 않으면", () => {
  beforeEach(() => { session.current = null; });

  it("목록·추가·수정·삭제 모두 401이고 DB를 건드리지 않는다", async () => {
    expect((await list.GET(req(null, "GET"), ctx("projects"))).status).toBe(401);
    expect((await list.POST(req(validInput("projects")), ctx("projects"))).status).toBe(401);
    expect((await item.PUT(req(validInput("projects"), "PUT"), itemCtx("projects", "1"))).status).toBe(401);
    expect((await item.DELETE(req(null, "DELETE"), itemCtx("projects", "1"))).status).toBe(401);
    expect(db.createRow).not.toHaveBeenCalled();
    expect(db.updateRow).not.toHaveBeenCalled();
    expect(db.deleteRow).not.toHaveBeenCalled();
  });
});

describe("로그인한 관리자", () => {
  it("없는 항목은 404", async () => {
    expect((await list.GET(req(null, "GET"), ctx("admins"))).status).toBe(404);
    expect((await list.GET(req(null, "GET"), ctx("constructor"))).status).toBe(404);
    expect((await item.DELETE(req(null, "DELETE"), itemCtx("admins", "1"))).status).toBe(404);
  });

  it("번호가 숫자가 아니면 500이 아니라 400", async () => {
    const res = await item.PUT(req(validInput("projects"), "PUT"), itemCtx("projects", "abc"));
    expect(res.status).toBe(400);
    expect(db.updateRow).not.toHaveBeenCalled();
  });

  it("JSON이 아닌 본문은 400", async () => {
    expect((await list.POST(req("{not json"), ctx("projects"))).status).toBe(400);
  });

  it("검증에 실패하면 400과 문제 칸을 돌려주고 저장하지 않는다", async () => {
    const res = await list.POST(req({ ...validInput("projects"), title: "" }), ctx("projects"));
    expect(res.status).toBe(400);
    expect((await res.json()).issues[0].path).toBe("title");
    expect(db.createRow).not.toHaveBeenCalled();
  });

  it("올바른 입력은 201로 저장하고 공개 페이지를 갱신한다", async () => {
    const res = await list.POST(req({ ...validInput("skills"), items: ["PHP", "Java"] }), ctx("skills"));
    expect(res.status).toBe(201);
    expect(db.createRow).toHaveBeenCalledWith("skills", expect.objectContaining({ items: '["PHP","Java"]' }));
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("수정할 행이 없으면 404", async () => {
    db.updateRow.mockRejectedValueOnce(Object.assign(new Error("not found"), { code: "P2025" }));
    expect((await item.PUT(req(validInput("certifications"), "PUT"), itemCtx("certifications", "999"))).status).toBe(404);
  });

  it("삭제하면 공개 페이지를 갱신한다", async () => {
    expect((await item.DELETE(req(null, "DELETE"), itemCtx("educations", "3"))).status).toBe(200);
    expect(db.deleteRow).toHaveBeenCalledWith("educations", 3);
    expect(revalidatePath).toHaveBeenCalledOnce();
  });
});
