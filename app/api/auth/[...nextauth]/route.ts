import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { attemptKeys, beginAttempt, finishAttempt } from "@/lib/login-limit";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;
        // (아이디 + IP)·IP별 시도 제한. 잠겨 있으면 LOCKED 오류로 로그인 화면에 알린다
        const forwarded = req?.headers?.["x-forwarded-for"];
        const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
        const keys = attemptKeys(credentials.username, ip);
        const attemptIds = await beginAttempt(keys);
        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });
        const ok = admin ? await verifyPassword(credentials.password, admin.password) : false;
        await finishAttempt(attemptIds, keys, ok);
        if (!admin || !ok) return null;
        return { id: String(admin.id), name: admin.username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
