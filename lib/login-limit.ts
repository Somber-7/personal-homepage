import { prisma } from "@/lib/prisma";

// 관리자 로그인 시도 제한: 같은 (아이디 + IP) 또는 같은 IP에서 WINDOW 안에 MAX번 실패하면 WINDOW 동안 막는다.
// 아이디만으로 잠그면 남이 일부러 틀려서 관리자를 잠글 수 있어서, 아이디는 IP와 묶어서 센다.
// 서버리스라 메모리가 아니라 DB(LoginAttempt)에 기록한다.
export const MAX_FAILURES = 5;
export const WINDOW_MS = 15 * 60 * 1000;

export class LoginLockedError extends Error {
  constructor() {
    super("LOCKED"); // 로그인 화면이 이 값으로 안내 문구를 고른다
  }
}

/** 최근 실패 시각 목록으로 잠금이 풀리는 시각을 구한다. 잠기지 않았으면 null. */
export function lockedUntil(failures: Date[], now: Date): Date | null {
  const recent = failures
    .filter((t) => now.getTime() - t.getTime() < WINDOW_MS)
    .sort((a, b) => a.getTime() - b.getTime());
  if (recent.length < MAX_FAILURES) return null;
  // 가장 최근 MAX번의 실패 중 첫 번째가 창 밖으로 나가면 풀린다
  return new Date(recent[recent.length - MAX_FAILURES].getTime() + WINDOW_MS);
}

/** IP를 모를 때만 아이디 단독 키를 쓴다 */
export function attemptKeys(username: string, ip: string | undefined) {
  const user = username.trim().toLowerCase();
  return ip ? [`pair:${user}|${ip}`, `ip:${ip}`] : [`user:${user}`];
}

/**
 * 시도를 먼저 실패로 기록한 뒤, 이번 기록을 뺀 최근 실패로 잠금을 판단한다.
 * 먼저 기록하므로 동시에 들어온 요청끼리도 서로의 기록을 보게 되어 한도를 넘겨 통과하지 못한다.
 * 잠겨 있으면 LoginLockedError를 던지고, 아니면 이번 기록의 id를 돌려준다.
 */
export async function beginAttempt(keys: string[], now = new Date()): Promise<number[]> {
  const created = await prisma.$transaction(
    keys.map((key) => prisma.loginAttempt.create({ data: { key, success: false }, select: { id: true } })),
  );
  const ids = created.map((r) => r.id);
  const rows = await prisma.loginAttempt.findMany({
    where: { key: { in: keys }, success: false, id: { notIn: ids }, createdAt: { gt: new Date(now.getTime() - WINDOW_MS) } },
    select: { key: true, createdAt: true },
  });
  for (const key of keys) {
    const until = lockedUntil(rows.filter((r) => r.key === key).map((r) => r.createdAt), now);
    if (until && until > now) throw new LoginLockedError();
  }
  return ids;
}

/** 성공하면 이번 기록을 성공으로 바꾸고 그 아이디(+IP)의 실패 기록을 지운다. 하루 지난 기록은 정리한다 */
export async function finishAttempt(ids: number[], keys: string[], success: boolean, now = new Date()) {
  if (success) {
    await prisma.loginAttempt.updateMany({ where: { id: { in: ids } }, data: { success: true } });
    await prisma.loginAttempt.deleteMany({ where: { key: { in: keys.filter((k) => !k.startsWith("ip:")) }, success: false } });
  }
  await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } });
}
