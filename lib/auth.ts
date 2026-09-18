import bcrypt from "bcryptjs";

/** 비밀번호를 bcrypt 해시로 만든다. seed·비밀번호 변경에서 사용. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

/** 입력한 비밀번호가 저장된 bcrypt 해시와 일치하는지 확인한다. */
export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
