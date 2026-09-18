# 임준 포트폴리오 홈페이지

백엔드 개발자 임준의 개인 포트폴리오 웹사이트입니다.  
Next.js 기반으로 제작되었으며, MySQL DB와 연동하여 관리자 페이지에서 포트폴리오 데이터를 직접 관리할 수 있습니다.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS v4 |
| 데이터베이스 | MySQL 8.0 |
| ORM | Prisma 6 |
| 인증 | NextAuth.js v4 (JWT 세션) |

---

## 프로젝트 구조

```
personal-homepage/
├── app/                          # Next.js App Router 루트
│   ├── layout.tsx                # 전체 레이아웃 (폰트, 메타데이터 설정)
│   ├── globals.css               # 전역 CSS (다크 테마 색상 변수 정의)
│   ├── page.tsx                  # 홈페이지 (Server Component, DB에서 데이터 조회)
│   ├── HomeClient.tsx            # 홈페이지 UI (Client Component, 실제 렌더링 담당)
│   │
│   ├── admin/                    # 관리자 영역
│   │   ├── login/
│   │   │   └── page.tsx          # 로그인 페이지 (아이디/비밀번호 입력)
│   │   └── (protected)/          # 로그인 필요 영역 (route group, URL에 영향 없음)
│   │       ├── layout.tsx        # 관리자 레이아웃 (세션 확인 후 미로그인 시 /admin/login으로 이동)
│   │       ├── AdminNav.tsx      # 관리자 상단 네비게이션 바
│   │       ├── page.tsx          # 관리자 대시보드 (각 항목 개수 표시)
│   │       ├── experiences/
│   │       │   └── page.tsx      # 경력 관리 페이지 (추가/수정/삭제)
│   │       ├── projects/
│   │       │   └── page.tsx      # 프로젝트 관리 페이지 (추가/수정/삭제)
│   │       ├── skills/
│   │       │   └── page.tsx      # 기술 스택 관리 페이지 (추가/수정/삭제)
│   │       └── certifications/
│   │           └── page.tsx      # 자격증 관리 페이지 (추가/수정/삭제)
│   │
│   └── api/                      # API 라우트 (Next.js 내장 백엔드, Java의 Controller 역할)
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts      # NextAuth 인증 처리 (로그인/로그아웃/세션)
│       ├── portfolio/
│       │   └── route.ts          # 홈페이지용 공개 API (GET: 전체 데이터 조회)
│       └── admin/                # 관리자 전용 API (로그인 세션 검증 후 처리)
│           ├── experiences/
│           │   ├── route.ts      # 경력 목록 조회(GET), 추가(POST)
│           │   └── [id]/
│           │       └── route.ts  # 경력 수정(PUT), 삭제(DELETE)
│           ├── projects/
│           │   ├── route.ts      # 프로젝트 목록 조회(GET), 추가(POST)
│           │   └── [id]/
│           │       └── route.ts  # 프로젝트 수정(PUT), 삭제(DELETE)
│           ├── skills/
│           │   ├── route.ts      # 기술 스택 목록 조회(GET), 추가(POST)
│           │   └── [id]/
│           │       └── route.ts  # 기술 스택 수정(PUT), 삭제(DELETE)
│           └── certifications/
│               ├── route.ts      # 자격증 목록 조회(GET), 추가(POST)
│               └── [id]/
│                   └── route.ts  # 자격증 수정(PUT), 삭제(DELETE)
│
├── lib/                          # 공통 유틸리티
│   ├── prisma.ts                 # Prisma 클라이언트 싱글톤 (개발 환경에서 중복 인스턴스 방지)
│   └── auth.ts                   # SHA-256 비밀번호 해시 함수
│
├── prisma/                       # Prisma ORM 관련 파일
│   ├── schema.prisma             # DB 테이블 스키마 정의 (Java의 Entity 역할)
│   ├── seed.ts                   # 초기 데이터 삽입 스크립트 (관리자 계정, 포트폴리오 데이터)
│   └── migrations/               # DB 마이그레이션 이력 (schema 변경사항 자동 기록)
│
├── .env                          # 환경변수 (DB 접속 정보, NextAuth 시크릿 키)
└── package.json                  # 의존성 및 스크립트 관리 (Java의 pom.xml 역할)
```

---

## DB 테이블 구조

| 테이블 | 설명 |
|--------|------|
| `Admin` | 관리자 계정 (username, 비밀번호 SHA-256 해시) |
| `Experience` | 경력 사항 (회사명, 기간, 역할, 설명, 태그) |
| `Project` | 프로젝트 목록 (프로젝트명, 클라이언트, 기간, 설명, 태그) |
| `Skill` | 기술 스택 (카테고리명, 기술 목록, 학습중 여부) |
| `Certification` | 자격증 목록 (자격증명, 발급기관, 취득연도) |

> 태그/기술 목록은 JSON 배열 형태로 Text 컬럼에 저장됩니다. (예: `["Java","Spring","Oracle"]`)

---

## 페이지 URL

| URL | 설명 |
|-----|------|
| `http://localhost:3000` | 포트폴리오 홈페이지 |
| `http://localhost:3000/admin/login` | 관리자 로그인 |
| `http://localhost:3000/admin` | 관리자 대시보드 |
| `http://localhost:3000/admin/experiences` | 경력 관리 |
| `http://localhost:3000/admin/projects` | 프로젝트 관리 |
| `http://localhost:3000/admin/skills` | 기술 스택 관리 |
| `http://localhost:3000/admin/certifications` | 자격증 관리 |

---

## 관리자 계정

| 항목 | 값 |
|------|----|
| 아이디 | `admin` |
| 초기 비밀번호 | `1234` |
| 암호화 방식 | SHA-256 단방향 해시 |

---

## 환경 설정 (.env)

```env
DATABASE_URL="mysql://root:비밀번호@localhost:3306/portfolio"
NEXTAUTH_SECRET="시크릿키"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 개발 서버 실행

```bash
# 1. 패키지 설치
npm install

# 2. DB 마이그레이션 (테이블 생성)
npx prisma migrate dev

# 3. 초기 데이터 삽입
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# 4. Prisma 클라이언트 생성
npx prisma generate

# 5. 개발 서버 실행
npm run dev
```

---

## 주요 개념 (PHP/Java 개발자를 위한 비교)

| Next.js | PHP / Java |
|---------|------------|
| `app/page.tsx` | PHP의 `index.php`, Java의 Controller + View |
| `app/api/.../route.ts` | PHP의 `api.php`, Java의 `@RestController` |
| `app/layout.tsx` | PHP의 `header.php` + `footer.php` include 구조 |
| `lib/prisma.ts` | Java의 Repository / PHP의 PDO 연결 |
| `prisma/schema.prisma` | Java의 `@Entity` 클래스 |
| `prisma/migrations/` | DB 형상관리 (Java의 Flyway/Liquibase와 유사) |
| `.env` | Java의 `application.properties` |
| `"use client"` 선언 | 브라우저에서 실행되는 코드 (이벤트, state 사용 시 필요) |
| `async` Server Component | 서버에서만 실행 (DB 직접 조회 가능, `"use client"` 없음) |
