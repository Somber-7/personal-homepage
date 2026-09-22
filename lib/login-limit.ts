import { prisma } from "@/lib/prisma";

// 관리자 로그인 시도 제한: 같은 아이디 또는 같은 IP에서 WINDOW 안에 MAX번 실패하면 WINDOW 동안 막는다.
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

export function attemptKeys(username: string, ip: string | undefined) {
  const keys = [`user:${username.trim().toLowerCase()}`];
  if (ip) keys.push(`ip:${ip}`);
  return keys;
}

/** 잠겨 있으면 LoginLockedError를 던진다 */
export async function assertNotLocked(keys: string[], now = new Date()) {
  const rows = await prisma.loginAttempt.findMany({
    where: { key: { in: keys }, success: false, createdAt: { gt: new Date(now.getTime() - WINDOW_MS) } },
    select: { key: true, createdAt: true },
  });
  for (const key of keys) {
    const until = lockedUntil(rows.filter((r) => r.key === key).map((r) => r.createdAt), now);
    if (until && until > now) throw new LoginLockedError();
  }
}

/** 시도를 기록한다. 성공하면 그 아이디의 실패 기록을 지우고, 하루 지난 기록은 정리한다 */
export async function recordAttempt(keys: string[], success: boolean, now = new Date()) {
  await prisma.loginAttempt.createMany({ data: keys.map((key) => ({ key, success })) });
  if (success) await prisma.loginAttempt.deleteMany({ where: { key: { in: keys.filter((k) => k.startsWith("user:")) }, success: false } });
  await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } });
}
