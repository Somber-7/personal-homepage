import { describe, expect, it } from "vitest";
import { parseId, schemaFor, toDbData } from "@/lib/admin-schema";
import { RESOURCE_KEYS, validInput } from "./helpers";

describe("관리자 입력 검증", () => {
  it.each(RESOURCE_KEYS)("%s: 설정대로 채운 입력은 통과한다", (key) => {
    expect(schemaFor(key).safeParse(validInput(key)).success).toBe(true);
  });

  it("필수 칸이 비면 거부한다", () => {
    const input = { ...validInput("projects"), title: "   " };
    const r = schemaFor("projects").safeParse(input);
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(["title"]);
  });

  it("설정에 없는 칸이 섞이면 거부한다", () => {
    expect(schemaFor("skills").safeParse({ ...validInput("skills"), isAdmin: true }).success).toBe(false);
  });

  it("칸이 빠지면 거부한다", () => {
    const rest = validInput("certifications");
    delete rest.order;
    expect(schemaFor("certifications").safeParse(rest).success).toBe(false);
  });

  it("자료형이 다르면 거부한다", () => {
    expect(schemaFor("experiences").safeParse({ ...validInput("experiences"), isCurrent: "true" }).success).toBe(false);
    expect(schemaFor("experiences").safeParse({ ...validInput("experiences"), order: -1 }).success).toBe(false);
    expect(schemaFor("experiences").safeParse({ ...validInput("experiences"), order: 1.5 }).success).toBe(false);
  });

  it("사이트·저장소 주소는 비우거나 http(s)만 받는다", () => {
    const ok = { ...validInput("projects"), link: "https://imjune.vercel.app", repo: "" };
    expect(schemaFor("projects").safeParse(ok).success).toBe(true);
    expect(schemaFor("projects").safeParse({ ...ok, link: "javascript:alert(1)" }).success).toBe(false);
  });

  it("이미지는 / 로 시작하는 경로나 http(s) 주소만 받는다", () => {
    expect(schemaFor("projects").safeParse({ ...validInput("projects"), image: "/projects/halil.jpg" }).success).toBe(true);
    expect(schemaFor("projects").safeParse({ ...validInput("projects"), image: "halil.jpg" }).success).toBe(false);
  });

  it("글자 수 상한을 넘으면 거부한다", () => {
    expect(schemaFor("projects").safeParse({ ...validInput("projects"), title: "가".repeat(301) }).success).toBe(false);
    expect(schemaFor("projects").safeParse({ ...validInput("projects"), desc: "가".repeat(10_001) }).success).toBe(false);
  });

  it("목록은 빈 항목과 51개 이상을 거부한다", () => {
    expect(schemaFor("skills").safeParse({ ...validInput("skills"), items: [" "] }).success).toBe(false);
    expect(schemaFor("skills").safeParse({ ...validInput("skills"), items: Array.from({ length: 51 }, (_, i) => `t${i}`) }).success).toBe(false);
  });

  it("DB에 넣을 때 목록은 JSON 문자열로, 빈 주소는 null로 바꾼다", () => {
    const parsed = schemaFor("projects").parse({ ...validInput("projects"), tags: ["PHP", "Java"], link: "" });
    const data = toDbData("projects", parsed);
    expect(data.tags).toBe('["PHP","Java"]');
    expect(data.link).toBeNull();
    expect(data.image).toBeNull();
  });
});

describe("경로 번호 검사", () => {
  it.each([["1", 1], ["42", 42]])("%s → %d", (raw, id) => expect(parseId(raw)).toBe(id));
  it.each(["0", "-1", "abc", "1.5", "01", "", "99999999999"])("%s는 거부", (raw) => expect(parseId(raw)).toBeNull());
});
