# CLAUDE.md — personal-homepage

임준의 포트폴리오 사이트. 일반 작업 지침은 상위 폴더 `../CLAUDE.md`를 따른다. 이 파일은 이 저장소 고유 사정만 적는다.

## 운영 정보

- 주소: https://imjune.vercel.app (예전 `personal-homepage-tau-plum.vercel.app`은 307로 넘어감)
- 배포: Vercel Hobby, 팀 `portfolio-516c`, 프로젝트 `personal-homepage`. `main`에 push하면 자동 배포
- 서버 함수 지역: 싱가포르 `sin1` (`vercel.json`). DB와 같은 지역이어야 관리자 페이지·API가 빠르다. 기본값(미국 iad1)으로 두면 쿼리마다 태평양을 건너 관리자 페이지가 수 초씩 걸린다
- DB: Neon PostgreSQL (무료 플랜, Singapore). 놀고 있으면 절전되어 첫 요청이 1초쯤 느린 건 정상
- 저장소: github.com/Somber-7/personal-homepage (공개)

## 스택

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma 6 · PostgreSQL · NextAuth v4 (Credentials, JWT, bcrypt)

- 공개 페이지: `app/(site)/` 아래 `/`(홈 = 한 페이지 이력서: 머리·핵심 역량·경력·교육·대표 프로젝트·기술·자격증·수상), `/projects`, `/projects/[id]`. 예전 `/about`·`/career`는 `next.config.ts`에서 홈 위치로 넘긴다. DB 조회는 `lib/portfolio.ts`, 공통 컴포넌트는 `app/components/`
- 인적 사항·핵심 숫자·핵심 역량·수상·활동·경력 공백 설명은 DB가 아니라 `lib/profile.ts`에 있다
- 기술 스택의 `isLearning`은 뜻이 바뀌었다: `false` = 실무에서 운영한 기술, `true` = AI 캠프·개인 프로젝트에서 쓴 기술. 홈에서 두 묶음으로 나뉘어 나온다
- 프로젝트 `repo`(공개 저장소 주소)가 있으면 상세 페이지에 '코드 보기' 버튼이 나온다. 커밋 수는 적지 않는다(외부 평가에서 "커밋을 쪼갰나" 의심을 산다). 이미지가 없는 프로젝트는 카드·상세에 이미지 칸 자체를 두지 않는다
- `robots.ts`는 /admin·/api를 막고, `sitemap.ts`는 홈·프로젝트 목록·상세를 DB에서 만든다
- 경력·교육의 `desc`와 프로젝트의 `work`·`solution`·`result`는 한 줄에 하나씩 bullet로 나온다(`app/components/Bullets.tsx`, "라벨: 내용"이면 라벨이 굵게). 프로젝트 세 칸 중 비운 칸은 상세 페이지에 나오지 않는다
- 경력기술서 PDF는 `public/career-imjun.pdf`로 내려받는다. `D:\SKN_AI_Bootcamp\포트폴리오\경력기술서_임준.pdf`를 다시 만들면 이 파일도 덮어쓴다
- 공개 페이지는 빌드 때 정적으로 만들어진다. 관리자 API는 저장 후 `revalidatePath("/", "layout")`으로 전체를 갱신하므로, 새 관리자 API를 만들면 이 호출을 꼭 넣는다
- 디자인: 밝은 바탕 + 먹색 글자(`globals.css` `:root`, 포인트 색은 `--accent` 하나), 글꼴은 Pretendard 하나(`app/layout.tsx`의 CDN, 제목은 굵게 + 좁은 자간), 모노는 날짜·태그에만. 움직임은 페이지 첫 화면의 `hero-in`만 쓴다. 스크롤 등장 효과·격자 배경·빛·모노 라벨은 일부러 뺐다
- 관리자: `/admin/login`, `app/admin/(protected)/*`, API는 `app/api/admin/[resource]`·`[resource]/[id]` 두 파일이 다섯 항목을 모두 처리한다(세션 필수). 입력 칸은 `lib/admin-resources.ts`에만 추가하면 화면과 zod 검증(`lib/admin-schema.ts`)이 따라온다. 비우면 안 되는 칸은 `required: true`
  - 항목(경력·교육·프로젝트·기술 스택·자격증)마다 목록 표 `/admin/[항목]`, 추가 `/admin/[항목]/new`, 수정 `/admin/[항목]/[id]`. 입력 칸은 `lib/admin-resources.ts`, 표 열은 `app/admin/(protected)/[resource]/page.tsx`의 `COLUMNS`, 조회는 `lib/admin-data.ts`. 칸을 추가하면 이 세 곳을 고친다(API 검증은 설정을 따라온다)
- 로그인 시도 제한: `lib/login-limit.ts`, 기록은 DB `LoginAttempt`. (아이디+IP)·IP별 15분에 5회 실패면 잠금(아이디 단독 키는 IP를 모를 때만). 시도를 먼저 실패로 기록하고 판단한 뒤 성공하면 성공으로 바꾼다. 로컬에서 비밀번호를 여러 번 틀리면 `ip:::1`도 잠기니 15분 기다린다
- `tags`, `items`는 DB에 JSON 문자열로 저장하고 읽을 때 `JSON.parse`
- 프로젝트 대표 이미지: `public/projects/*.jpg`(1200×675), DB `Project.image`에 `/projects/파일명.jpg`로 저장. 없으면 카드에 기본 헤더가 나온다

## 환경변수

`.env`는 커밋하지 않는다(`.env.example`만 커밋). 값은 절대 출력하거나 커밋하지 말 것.

- `DATABASE_URL`: Neon **풀링** 주소(호스트에 `-pooler`)
- `DIRECT_URL`: Neon 직결 주소 (`prisma db push`용)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`: 로컬은 `http://localhost:3000`, Vercel은 `https://imjune.vercel.app`. 주소가 바뀌면 Vercel 쪽 값도 바꾸고 재배포해야 관리자 로그인이 된다

## 반드시 지킬 순서와 주의점

- **스키마 변경 시**: `npx prisma db push`로 Neon에 먼저 반영하고 나서 `git push`. 반대로 하면 새 코드가 없는 컬럼을 조회해서 배포된 사이트가 에러 난다
- 마이그레이션 폴더는 쓰지 않는다(`prisma/migrations.mysql.bak`은 예전 MySQL 시절 백업). 스키마 반영은 `db push`
- **`npm run db:seed`는 경력·교육·프로젝트·기술·자격증을 전부 지우고 다시 넣는다.** 관리자 화면에서 고친 내용이 날아가므로 초기화할 때만 쓴다. 실행에는 `ADMIN_PASSWORD`(10자 이상) 환경변수가 필요하다
- 이미지 경로만 바꿀 때는 `npm run db:images`(`prisma/set-images.ts`) — 제목 기준으로 image만 갱신, 다른 데이터와 관리자 계정은 건드리지 않음
- 내용(경력·프로젝트 문구) 수정은 가능하면 코드 대신 관리자 화면에서 한다
- `build` 스크립트에 `prisma generate`가 들어 있어야 Vercel 빌드가 된다. 빼지 말 것

## Windows 관련

- seed/스크립트는 `ts-node --project prisma/tsconfig.seed.json ...`으로 실행한다. `--compiler-options {"module":"CommonJS"}` 방식은 PowerShell이 따옴표를 벗겨서 깨진다. 새 스크립트를 추가하면 `prisma/tsconfig.seed.json`의 `include`에도 넣는다
- PowerShell에서 비밀번호를 받을 땐 `Read-Host -AsSecureString`을 써서 화면에 안 보이게 한다

## 확인 방법

- `npx tsc --noEmit` 로 타입 확인, `npm test` 로 테스트(vitest, DB 없이 돈다), `npm run build` 로 빌드 확인, `npm run dev` 로 localhost:3000 확인 후 push
- GitHub Actions(`.github/workflows/ci.yml`)가 push마다 타입 검사·lint·테스트를 돌린다. 빌드는 DB가 필요해서 CI에 넣지 않았다
- `<img>` 사용 부분은 `@next/next/no-img-element` 경고를 주석으로 끈 상태다(외부 최적화 없이 정적 파일을 그대로 쓰기 위함)
