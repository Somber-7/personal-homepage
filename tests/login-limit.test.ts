import { describe, expect, it, vi } from "vitest";

// login-limit.ts가 불러오는 DB 클라이언트는 이 테스트에서 쓰지 않는다
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

const { attemptKeys, lockedUntil, MAX_FAILURES, WINDOW_MS } = await import("@/lib/login-limit");

const now = new Date("2026-09-22T12:00:00Z");
const ago = (ms: number) => new Date(now.getTime() - ms);
const minutes = (m: number) => m * 60 * 1000;

describe("로그인 잠금 판정", () => {
  it("실패가 한도보다 적으면 잠그지 않는다", () => {
    const failures = Array.from({ length: MAX_FAILURES - 1 }, (_, i) => ago(minutes(i)));
    expect(lockedUntil(failures, now)).toBeNull();
  });

  it("창 안에서 한도만큼 실패하면 가장 오래된 실패로부터 창 길이만큼 잠근다", () => {
    const failures = [ago(minutes(10)), ago(minutes(8)), ago(minutes(6)), ago(minutes(4)), ago(minutes(2))];
    expect(lockedUntil(failures, now)).toEqual(new Date(ago(minutes(10)).getTime() + WINDOW_MS));
  });

  it("창 밖의 실패는 세지 않는다", () => {
    const failures = [ago(minutes(20)), ago(minutes(18)), ago(minutes(6)), ago(minutes(4)), ago(minutes(2))];
    expect(lockedUntil(failures, now)).toBeNull();
  });

  it("한도보다 많이 실패하면 최근 한도 개수 기준으로 잠금이 늘어난다", () => {
    const failures = [ago(minutes(12)), ago(minutes(10)), ago(minutes(8)), ago(minutes(6)), ago(minutes(4)), ago(minutes(2))];
    expect(lockedUntil(failures, now)).toEqual(new Date(ago(minutes(10)).getTime() + WINDOW_MS));
  });

  it("실패 순서가 섞여 들어와도 같은 결과", () => {
    const failures = [ago(minutes(2)), ago(minutes(10)), ago(minutes(6)), ago(minutes(8)), ago(minutes(4))];
    expect(lockedUntil(failures, now)).toEqual(new Date(ago(minutes(10)).getTime() + WINDOW_MS));
  });
});

describe("시도 기록 키", () => {
  it("아이디는 앞뒤 공백을 빼고 소문자로, IP가 있으면 함께", () => {
    expect(attemptKeys("  Admin ", "1.2.3.4")).toEqual(["user:admin", "ip:1.2.3.4"]);
  });
  it("IP를 모르면 아이디 키만", () => {
    expect(attemptKeys("admin", undefined)).toEqual(["user:admin"]);
  });
});
