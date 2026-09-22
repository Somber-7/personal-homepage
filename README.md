# 임준 포트폴리오 홈페이지

웹 백엔드 개발자 임준의 포트폴리오 사이트. 경력·교육·프로젝트·기술·자격증을 관리자 화면에서 고치면 공개 페이지가 바로 갱신된다.

- 사이트: https://imjune.vercel.app
- 경력기술서 PDF: https://imjune.vercel.app/career-imjun.pdf

## 기술 스택

| 구분 | 사용 |
|---|---|
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript |
| 스타일 | Tailwind CSS v4, Pretendard |
| DB | PostgreSQL (Neon, Singapore) + Prisma 6 |
| 인증 | NextAuth v4 (Credentials, JWT), bcrypt |
| 배포 | Vercel (함수 지역 `sin1`, main에 push하면 자동 배포) |

## 설계에서 신경 쓴 점

- **정적 생성 + 저장 시 갱신**: 공개 페이지는 빌드 때 HTML로 만들어 두고, 관리자 API가 저장하면 `revalidatePath("/", "layout")`로 다시 만든다. 방문할 때마다 DB를 조회하지 않는다.
- **DB 연결 분리**: 서버리스 함수는 Neon 풀링 주소(`DATABASE_URL`), 스키마 반영은 직결 주소(`DIRECT_URL`)를 쓴다.
- **함수 지역**: DB와 같은 싱가포르(`sin1`)로 맞췄다. 기본값(미국 동부)일 때는 쿼리마다 태평양을 건너 관리자 페이지가 수 초씩 걸렸다(`vercel.json`).
- **관리자 화면은 설정 하나로**: 경력·교육·프로젝트·기술·자격증 다섯 화면을 따로 만들지 않고, 항목별 입력 칸 설정(`lib/admin-resources.ts`) 하나로 목록 표 · 추가 · 수정 페이지를 만든다.
- **줄 단위 내용 입력**: 경력 설명과 프로젝트의 맡은 일 · 구현과 문제 해결 · 결과는 한 줄에 하나씩 입력하면 bullet로 보이고, `라벨: 내용` 형식이면 라벨이 굵게 나온다(`app/components/Bullets.tsx`). 비운 칸은 상세 페이지에 나오지 않는다.
- **인증**: 모든 관리자 API가 세션을 확인하고, 비밀번호는 bcrypt 해시로만 저장한다. `/admin`과 `/api`는 `robots.txt`에서 검색을 막는다.
- **입력 검증**: 관리자 API는 입력 칸 설정에서 만든 zod 스키마(`lib/admin-schema.ts`)로 본문을 검사한다. 설정에 없는 칸, 빠진 칸, 자료형·길이가 맞지 않는 값, http(s)가 아닌 주소는 저장하지 않고 400과 문제 칸을 돌려준다. 칸을 추가하면 검증도 따라온다.
- **로그인 시도 제한**: 아이디별 · IP별로 15분 안에 5번 틀리면 15분 동안 로그인을 막는다(`lib/login-limit.ts`). 서버리스라 메모리 대신 DB(`LoginAttempt`)에 기록한다.
- **보안 헤더**: 모든 페이지에 `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`를 붙인다(`next.config.ts`).
- **테스트 · CI**: 입력 검증, 로그인 잠금 판정, 관리자 API 응답 코드(401 · 400 · 404 · 201)를 vitest로 확인하고, push마다 GitHub Actions에서 타입 검사 · lint · 테스트를 돌린다.

## 폴더 구조

```
app/
  (site)/                 공개 페이지
    page.tsx              홈 (한 페이지 이력서)
    projects/             프로젝트 목록 · 상세
  admin/
    login/                로그인
    (protected)/          로그인 후 화면 (세션 없으면 로그인으로)
      [resource]/         항목별 목록 표 · [id] 수정 · new 추가
  api/admin/[resource]/   관리자 API 하나로 다섯 항목 처리 (검증 → 저장 → revalidatePath)
  components/             공통 컴포넌트
  robots.ts, sitemap.ts
lib/
  portfolio.ts            공개 페이지용 조회
  admin-resources.ts      관리자 입력 칸 설정
  admin-schema.ts         입력 칸 설정 → zod 검증 스키마
  admin-api.ts            관리자 API 공통 (세션 확인 · 본문 검사)
  admin-data.ts           관리자용 조회 · 저장
  login-limit.ts          로그인 시도 제한
  profile.ts              인적 사항 · 핵심 숫자 · 수상 (DB가 아닌 상수)
prisma/
  schema.prisma
  seed.ts                 초기 데이터 (실행하면 기존 데이터를 지우고 다시 넣음)
tests/                    vitest 테스트 (DB 없이 실행)
.github/workflows/ci.yml  타입 검사 · lint · 테스트
```

## 로컬 실행

```bash
npm install
cp .env.example .env      # 값 채우기
npx prisma db push        # 스키마 반영
ADMIN_PASSWORD="10자 이상" npm run db:seed   # 초기 데이터 (기존 데이터 삭제 주의)
npm run dev               # http://localhost:3000
npm test                  # 테스트 (DB 연결 없이 돈다)
```

필요한 환경변수: `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (`.env.example` 참고).

## 작업 규칙

저장소에서 작업할 때의 순서와 주의점(스키마 변경은 `prisma db push` 먼저, seed 주의 등)은 `CLAUDE.md`에 정리돼 있다.
