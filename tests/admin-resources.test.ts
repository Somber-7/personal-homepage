import { describe, expect, it } from "vitest";
import { isResourceKey, toFormValues } from "@/lib/admin-resources";

describe("수정 화면 값 변환", () => {
  it("DB 행을 입력 칸 값으로 바꾼다 (목록은 쉼표 문자열, null은 빈 문자열)", () => {
    const values = toFormValues("projects", { title: "halil", tags: '["Django","React"]', link: null, order: 5, work: "A\nB" });
    expect(values.title).toBe("halil");
    expect(values.tags).toBe("Django, React");
    expect(values.link).toBe("");
    expect(values.order).toBe("5");
    expect(values.work).toBe("A\nB");
  });

  it("새로 추가할 때는 모든 칸이 비어 있다", () => {
    const values = toFormValues("experiences", null);
    expect(values.company).toBe("");
    expect(values.tags).toBe("");
    expect(values.isCurrent).toBe(false);
  });

  it("항목 이름 확인", () => {
    expect(isResourceKey("projects")).toBe(true);
    expect(isResourceKey("admin")).toBe(false);
    expect(isResourceKey("__proto__")).toBe(false);
    expect(isResourceKey("constructor")).toBe(false);
  });
});
