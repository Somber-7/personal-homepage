import { beforeEach, describe, expect, it, vi } from "vitest";

// LoginAttempt 테이블을 메모리 배열로 흉내 낸다 (beginAttempt·finishAttempt가 쓰는 조건만)
type Row = { id: number; key: string; success: boolean; createdAt: Date };
const store = vi.hoisted(() => ({ rows: [] as Row[], nextId: 1, clock: new Date(0) }));
type Where = { id?: { in?: number[]; notIn?: number[] }; key?: { in: string[] }; success?: boolean; createdAt?: { gt?: Date; lt?: Date } };
const matches = (r: Row, w: Where) =>
  (!w.id?.in || w.id.in.includes(r.id)) && (!w.id?.notIn || !w.id.notIn.includes(r.id)) &&
  (!w.key || w.key.in.includes(r.key)) && (w.success === undefined || r.success === w.success) &&
  (!w.createdAt?.gt || r.createdAt > w.createdAt.gt) && (!w.createdAt?.lt || r.createdAt < w.createdAt.lt);
vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: (ops: Promise<unknown>[]) => Promise.all(ops),
    loginAttempt: {
      create: async ({ data }: { data: { key: string; success: boolean } }) => {
        const row = { id: store.nextId++, createdAt: new Date(store.clock), ...data };
        store.rows.push(row);
        return { id: row.id };
      },
      findMany: async ({ where }: { where: Where }) => store.rows.filter((r) => matches(r, where)),
      updateMany: async ({ where, data }: { where: Where; data: Partial<Row> }) => {
        store.rows.filter((r) => matches(r, where)).forEach((r) => Object.assign(r, data));
      },
      deleteMany: async ({ where }: { where: Where }) => {
        store.rows = store.rows.filter((r) => !matches(r, where));
      },
    },
  },
}));

const { attemptKeys, beginAttempt, finishAttempt, lockedUntil, LoginLockedError, MAX_FAILURES, WINDOW_MS } = await import("@/lib/login-limit");

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
  it("아이디는 IP와 묶어서 세고 IP도 따로 센다 (아이디 단독 잠금 없음)", () => {
    expect(attemptKeys("  Admin ", "1.2.3.4")).toEqual(["pair:admin|1.2.3.4", "ip:1.2.3.4"]);
  });
  it("IP를 모를 때만 아이디 단독 키", () => {
    expect(attemptKeys("admin", undefined)).toEqual(["user:admin"]);
  });
});

describe("시도 기록과 잠금 (DB 흐름)", () => {
  beforeEach(() => {
    store.rows = [];
    store.nextId = 1;
    store.clock = new Date(now);
  });

  const fail = async (ip: string, user = "admin") => {
    const keys = attemptKeys(user, ip);
    try {
      await finishAttempt(await beginAttempt(keys, now), keys, false, now);
    } catch (e) {
      if (!(e instanceof LoginLockedError)) throw e; // 잠긴 뒤 시도도 실패로 남는다
    }
  };

  it("다섯 번 틀리면 여섯 번째는 잠긴다", async () => {
    for (let i = 0; i < MAX_FAILURES; i++) await fail("1.1.1.1");
    await expect(beginAttempt(attemptKeys("admin", "1.1.1.1"), now)).rejects.toBeInstanceOf(LoginLockedError);
  });

  it("다른 IP에서 관리자 아이디로 틀려도 내 IP의 관리자 로그인은 잠기지 않는다", async () => {
    for (let i = 0; i < MAX_FAILURES + 3; i++) await fail("6.6.6.6");
    await expect(beginAttempt(attemptKeys("admin", "1.1.1.1"), now)).resolves.toHaveLength(2);
  });

  it("같은 IP에서 아이디를 바꿔 가며 틀려도 IP 기준으로 잠긴다", async () => {
    for (let i = 0; i < MAX_FAILURES; i++) await fail("6.6.6.6", `guess${i}`);
    await expect(beginAttempt(attemptKeys("admin", "6.6.6.6"), now)).rejects.toBeInstanceOf(LoginLockedError);
  });

  it("동시에 들어온 요청은 서로의 기록을 봐서 한도를 넘겨 통과하지 못한다", async () => {
    for (let i = 0; i < MAX_FAILURES - 1; i++) await fail("1.1.1.1");
    const keys = attemptKeys("admin", "1.1.1.1");
    const results = await Promise.allSettled([beginAttempt(keys, now), beginAttempt(keys, now), beginAttempt(keys, now)]);
    expect(results.filter((r) => r.status === "fulfilled").length).toBeLessThanOrEqual(1);
  });

  it("성공하면 그 아이디+IP의 실패 기록을 지우고 이번 시도는 성공으로 남는다", async () => {
    for (let i = 0; i < MAX_FAILURES - 1; i++) await fail("1.1.1.1");
    const keys = attemptKeys("admin", "1.1.1.1");
    const ids = await beginAttempt(keys, now);
    await finishAttempt(ids, keys, true, now);
    expect(store.rows.filter((r) => r.key === keys[0] && !r.success)).toHaveLength(0);
    expect(store.rows.filter((r) => ids.includes(r.id)).every((r) => r.success)).toBe(true);
  });
});
