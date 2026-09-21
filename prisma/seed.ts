import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const J = (v: string[]) => JSON.stringify(v);

async function main() {
  // ── 관리자 계정 ────────────────────────────────────────────
  // 비밀번호는 코드에 넣지 않는다. 실행 전에 환경변수로 넘긴다.
  //   ADMIN_PASSWORD="직접정한비밀번호" npm run db:seed
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const rawPassword = process.env.ADMIN_PASSWORD;
  if (!rawPassword || rawPassword.length < 10) {
    throw new Error(
      "ADMIN_PASSWORD 환경변수를 10자 이상으로 설정한 뒤 실행하세요. 예: ADMIN_PASSWORD=\"...\" npm run db:seed"
    );
  }
  const password = await bcrypt.hash(rawPassword, 12);
  await prisma.admin.upsert({
    where: { username },
    update: { password },
    create: { username, password },
  });

  // ── 기술 스택 ──────────────────────────────────────────────
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      { category: "언어", items: J(["PHP", "Java", "JavaScript", "TypeScript", "Python", "SQL"]), isLearning: false, order: 1 },
      { category: "웹 · 프레임워크", items: J(["eGovFramework", "Spring", "MyBatis", "JSP", "jQuery", "Django", "DRF", "FastAPI", "React", "Next.js"]), isLearning: false, order: 2 },
      { category: "데이터베이스", items: J(["Oracle", "MySQL", "MariaDB", "PostgreSQL", "Altibase", "Tibero"]), isLearning: false, order: 3 },
      { category: "AI · 데이터", items: J(["LangChain", "LangGraph", "deepagents", "MCP", "RAG", "ChromaDB", "pgvector", "Neo4j", "scikit-learn", "LightGBM", "XGBoost", "PyTorch", "pandas", "LoRA / QLoRA"]), isLearning: false, order: 4 },
      { category: "인프라 · 배포", items: J(["Linux", "Apache", "Nginx", "Docker", "Docker Compose", "AWS EC2 / RDS / S3", "GitHub Actions", "Gunicorn"]), isLearning: false, order: 5 },
    ],
  });

  // ── 경력 ───────────────────────────────────────────────────
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        period: "2025.02 ~ 2026.03",
        duration: "1년 2개월",
        company: "쓰리애니아이앤시",
        role: "프로그램파트 대리 · 웹 개발",
        desc: "웹에이전시 프로그램파트에서 순수 PHP와 사내 자체 솔루션으로 웹사이트를 구축하고 운영했습니다. 회사의 제작 흐름은 디자인 → 퍼블리싱 → 프로그램 순이었고, 저는 프로그램 단계에서 백엔드와 일부 프론트 기능을 맡았습니다. 재직 중 신규 개발과 유지보수를 합쳐 200개 이상의 사이트에 참여했습니다.",
        tags: J(["PHP", "MySQL", "jQuery", "Linux", "PG 결제", "CMS"]),
        isCurrent: false,
        order: 2,
      },
      {
        period: "2020.01 ~ 2024.02",
        duration: "4년 2개월",
        company: "㈜그리드텍",
        role: "솔루션사업부 대리 · 웹 개발",
        desc: "한국전력공사 사내 그룹웨어와 업무 시스템 6~9종의 유지보수를 상시로 맡으면서 한전·교육부 SI 프로젝트 5건을 수행했습니다. 전자정부 표준프레임워크 기반 신규 개발과 타 시스템 연계, Linux 서버 구축·운영을 담당했습니다.",
        tags: J(["Java", "eGovFramework", "Spring", "PHP", "Oracle", "REST API"]),
        isCurrent: false,
        order: 3,
      },
    ],
  });

  // ── 교육 ───────────────────────────────────────────────────
  await prisma.education.deleteMany();
  await prisma.education.createMany({
    data: [
      {
        period: "2026.03 ~ 2026.09",
        duration: "6개월",
        name: "SK네트웍스 Family AI 캠프 29기",
        course: "AI 엔지니어링 과정 수료 · 팀 프로젝트 5회 PM",
        desc: "데이터 분석부터 머신러닝, NLP·LLM, 웹·배포까지 이어지는 커리큘럼을 마치고 팀 프로젝트 다섯 건을 모두 PM 겸 팀 리드로 수행했습니다. 기업참여 최종 프로젝트에서 최우수상을 받았습니다.",
        tags: J(["LangGraph", "RAG", "PyTorch", "Django", "AWS", "PM"]),
        order: 1,
      },
    ],
  });

  // ── 프로젝트 ───────────────────────────────────────────────
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: "halil · 프로젝트 운영 Agent Platform",
        image: "/projects/halil.jpg",
        client: "SK네트웍스 Family AI 캠프 기업참여 최종 프로젝트 (5인) · 최우수상",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.07 ~ 2026.09",
        desc: "코딩 없이 팀 운영 AI 에이전트를 만들어 쓰는 플랫폼입니다. Google Drive·Jira·인사 시스템을 연결해 두면 대화와 승인 한 번으로 업무 추출과 Jira 등록까지 처리합니다. 모든 답변에 원문 근거를 붙이고, 외부를 바꾸는 작업은 사람의 승인을 거치도록 설계했습니다. 도구 레지스트리 33종과 승인 게이트 15종, 문서 파싱·청킹·임베딩 파이프라인, 운영자 콘솔을 구현했습니다. 문서 임베딩을 맡는 RunPod GPU 워커는 팀원이 만든 저장소를 halil에 맞게 옮겨 배포하고, OCR 처리와 txt·md 입력 지원을 보완했습니다.",
        role: "PM · 화면 전반 · 에이전트 하네스 · 운영자 콘솔",
        tags: J(["Django", "DRF", "deepagents", "LangGraph", "PostgreSQL", "pgvector", "React", "RunPod", "AWS"]),
        order: 5,
      },
      {
        title: "명가작명소 · AI 작명 웹 서비스",
        image: "/projects/myeongga.jpg",
        client: "SK네트웍스 Family AI 캠프 4차 프로젝트 (4인) · myeongga.site",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.06 ~ 2026.07",
        desc: "3차 프로젝트에서 만든 작명 QA 엔진을 실제 사용자·관리자가 쓰는 웹 서비스로 제품화했습니다. LangGraph 엔진을 FastAPI로 감싸 재사용하고 React 사용자 화면과 Django 인증·회원·관리 기능을 붙여 AWS에 배포했으며, 실제 도메인으로 운영했습니다.",
        role: "PM · 통합 관리 · 배포 흐름 · 서버 인프라",
        tags: J(["React", "TypeScript", "Django", "FastAPI", "ChromaDB", "Neo4j", "Docker", "AWS", "GitHub Actions"]),
        order: 4,
      },
      {
        title: "조건 기반 맞춤 작명 QA 시스템",
        image: "/projects/naming-qa.jpg",
        client: "SK네트웍스 Family AI 캠프 3차 프로젝트 (4인)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.06",
        desc: "자연어로 입력한 조건에 맞는 이름을 추천하고 법령 근거를 출처와 함께 제시하는 대화형 QA 시스템입니다. LangGraph ReAct Router가 RAG·계산·법령 API·그래프 네 경로로 분기하고 FastMCP 도구 16개를 호출합니다. 운영 파이프라인과 QLoRA 파인튜닝 모델의 답변 품질을 비교해 4.09점 대 1.63점으로 RAG+Tool 구조의 우위를 수치로 확인했습니다.",
        role: "PM · 일정 조율 · Git 브랜치 · 서버 인프라",
        tags: J(["LangGraph", "FastMCP", "ChromaDB", "Neo4j", "OpenAI API", "QLoRA"]),
        order: 3,
      },
      {
        title: "아파트 실거래 ML 인터랙티브 플랫폼",
        image: "/projects/apartment.jpg",
        client: "SK네트웍스 Family AI 캠프 2차 프로젝트 (4인)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.04 ~ 2026.05",
        desc: "약 500만 건의 아파트 실거래 데이터로 가격 예측·브랜드 분류·지역 군집화·이상 거래 탐지를 웹에서 돌려 볼 수 있게 만들었습니다. 원본 ZIP에서 MySQL, Parquet 캐시, 사전계산 모델을 거쳐 Streamlit으로 이어지는 아키텍처를 설계했고, 행정구역 개편을 반영해 결측 37만 건을 보완하고 지오코딩을 수행했습니다. 트리 앙상블이 DNN보다 RMSE 8~12% 우수했습니다.",
        role: "PM · 데이터 엔지니어링 · 아키텍처 설계 · 회귀 모델",
        tags: J(["Python", "scikit-learn", "LightGBM", "XGBoost", "PyTorch", "Streamlit", "MySQL", "지오코딩"]),
        order: 2,
      },
      {
        title: "에너지 가격 변동의 모빌리티 시장 영향 분석",
        image: "/projects/energy.jpg",
        client: "SK네트웍스 Family AI 캠프 1차 프로젝트 (3인)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.03",
        desc: "국산차 월별 등록 데이터와 전국 유가 변동의 상관관계를 분석했습니다. 유가 변동이 신차 등록에 반영되기까지 평균 3개월의 리드타임을 확인했고, 친환경차 수요는 유가보다 보조금·인프라 같은 정책 요인에 좌우된다는 점을 데이터로 검증했습니다.",
        role: "PM · 크롤러 개발 · 산출물 취합",
        tags: J(["Python", "MySQL", "Streamlit", "Plotly", "웹 크롤링"]),
        order: 1,
      },
      {
        title: "교육부 정보시스템 기능강화 사업",
        client: "교육부 · ㈜그리드텍 (3인)",
        org: "㈜그리드텍",
        period: "2023.07 ~ 2023.12",
        desc: "교직원 인사 정보를 담당자가 일일이 수작업으로 반영하던 방식을 Excel 업로드와 eGovFramework 배치 처리로 바꾸고, 반영 전 확인과 예약 적용이 가능하도록 리스트 페이지를 붙였습니다. 온나라 2.0 연계에서는 프로토콜 문서가 실제와 달라, Web Service 인터페이스로 API 규격을 다시 정하고 협력 부서와 문서를 수정해 연계를 맞췄습니다. 트랜잭션 관리와 실시간 모니터링을 적용해 데이터 무결성을 확보했습니다.",
        role: "설계 · 기능 구현 · 타 시스템 연계",
        tags: J(["Java", "eGovFramework", "MyBatis", "Web Service", "배치 처리"]),
        order: 6,
      },
      {
        title: "한전 기록물철관리 SW 개발 용역",
        client: "한국전력공사 · ㈜그리드텍 (6인)",
        org: "㈜그리드텍",
        period: "2023.04 ~ 2023.08",
        desc: "전자정부 표준프레임워크 기반으로 한전 사내 기록물 보관 웹페이지의 화면과 기능을 구현했습니다.",
        role: "화면 · 기능 구현",
        tags: J(["Java", "eGovFramework", "JSP"]),
        order: 7,
      },
      {
        title: "한전 공사현장 모니터링 시스템 개선",
        client: "한국전력공사 · ㈜그리드텍 (4인)",
        org: "㈜그리드텍",
        period: "2022.03 ~ 2022.09",
        desc: "PHP로 신규 웹페이지와 모바일용 WebApp 화면·기능을 구현했고, 다수의 REST API를 설계·연계해 사내 타 시스템 및 모바일 웹과 데이터를 주고받도록 했습니다.",
        role: "화면 · 기능 구현 · API 연계",
        tags: J(["PHP", "REST API", "WebApp", "jQuery"]),
        order: 8,
      },
      {
        title: "한전 모바일 스마트워크 플랫폼 구축",
        client: "한국전력공사 · ㈜그리드텍 (6인)",
        org: "㈜그리드텍",
        period: "2020.09 ~ 2021.03",
        desc: "사내 신규 웹하드 시스템 도입에 따라 Linux 서버를 구축·관리하고 연계사 사이의 커뮤니케이션을 담당했습니다. 프로젝트 종료 후에는 해당 시스템의 전반적인 유지보수를 이어서 맡았습니다.",
        role: "서버 구축 · 운영 · 연계사 커뮤니케이션",
        tags: J(["Linux", "Altibase", "서버 운영"]),
        order: 9,
      },
      {
        title: "한전 AMI 2.0 스마트미터링 장치관리",
        client: "한국전력공사 · ㈜그리드텍 (3인)",
        org: "㈜그리드텍",
        period: "2020.07 ~ 2020.11",
        desc: "전자정부 표준프레임워크로 AMI 장치의 자동 검침 데이터를 관리하고 통계로 보여 주는 페이지의 화면과 기능을 구현했습니다.",
        role: "화면 · 기능 구현",
        tags: J(["Java", "eGovFramework", "통계"]),
        order: 10,
      },
      {
        title: "웹에이전시 웹사이트 구축·유지보수 (200개 이상)",
        client: "쓰리애니아이앤시",
        org: "쓰리애니아이앤시",
        period: "2025.02 ~ 2026.03",
        desc: "웹에이전시 프로그램파트에서 순수 PHP와 사내 자체 솔루션으로 웹사이트를 구축하고 운영했습니다. 디자인 → 퍼블리싱 → 프로그램으로 이어지는 제작 흐름에서 프로그램 단계를 맡아, 신규 개발과 유지보수를 합쳐 200개 이상의 사이트에 참여했습니다. 사내 공통 모듈 커스터마이징과 관리자(CMS) 구성, PG 결제·문자·알림톡·지도 API·소셜 로그인 같은 외부 연동, Linux 웹 서버 운영과 장애 대응을 함께 담당했습니다. 공개된 대표 사이트는 KT그룹희망나눔재단, Astell&Kern, 현대웰딩, GQA입니다.",
        role: "개발 담당",
        tags: J(["PHP", "MySQL", "jQuery", "Linux"]),
        order: 11,
      },
      {
        title: "KT그룹희망나눔재단 웹사이트",
        image: "/projects/site-ktgf.jpg",
        link: "https://ktgf.or.kr",
        client: "KT그룹희망나눔재단",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "대기업 계열 공익재단인 KT그룹희망나눔재단의 사이트입니다. 재단·사업 소개, 후원 및 기부 신청 폼, 후원 현황 조회, 공지·사업보고·나눔스토리 게시판, 사업 실적 통계 표시를 갖췄고, 프로그램파트로서 백엔드와 일부 프론트 기능을 맡아 구축하고 유지보수했습니다.",
        role: "개발 담당",
        tags: J(["PHP"]),
        order: 12,
      },
      {
        title: "Astell&Kern 브랜드·제품 사이트",
        image: "/projects/site-ak.jpg",
        link: "https://www.astellnkern.com",
        client: "Astell&Kern",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "글로벌 하이파이 오디오 브랜드 Astell&Kern의 한·영·중·일 4개 국어 브랜드 사이트입니다. 제품 라인별 카탈로그와 상세, 리뷰·전시·갤러리, FAQ·다운로드, 판매처 찾기를 갖췄고, 프로그램파트로서 백엔드와 일부 프론트 기능을 맡아 구축하고 유지보수했습니다.",
        role: "개발 담당",
        tags: J(["PHP", "AWS"]),
        order: 13,
      },
      {
        title: "현대웰딩 B2B 제품 카탈로그",
        image: "/projects/site-hw.jpg",
        link: "https://products.hyundaiwelding.com",
        client: "현대웰딩",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "대기업 B2B 제조사 현대웰딩의 제품 카탈로그 사이트입니다. 7개 용접공정 × 재질별 다단계 분류, 카테고리 필터와 페이지네이션, 제품별 용접 규격(AWS/ISO)과 자료 제공, 한·영 2개 국어를 갖췄고, 프로그램파트로서 백엔드와 일부 프론트 기능을 맡아 구축하고 유지보수했습니다.",
        role: "개발 담당",
        tags: J(["PHP"]),
        order: 14,
      },
      {
        title: "GQA 교육 신청·수료증 시스템",
        image: "/projects/site-gqa.jpg",
        link: "https://gqa.co.kr",
        client: "GQA",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "자동차 품질 교육기관(VDA QMC 파트너) GQA의 사이트입니다. 공개·기업체 맞춤 교육 신청 시스템, 교육일정 캘린더, 회원 포털(수강 이력·수료증 발급), 도서 판매, 공지·FAQ·Q&A·불편신고를 갖췄고, 프로그램파트로서 백엔드와 일부 프론트 기능을 맡아 구축하고 유지보수했습니다.",
        role: "개발 담당",
        tags: J(["PHP"]),
        order: 15,
      },
      {
        title: "Stock Analyze · 주식 분석 데스크톱 앱",
        client: "개인 프로젝트",
        org: "개인 · 대외활동",
        period: "2026",
        desc: "증권사 오픈 API를 연동한 국내주식 조회·분석 데스크톱 앱입니다. React + Vite 화면과 FastAPI 백엔드를 Electron으로 묶어 설치형과 무설치 실행형으로 배포했습니다. AI 분석 결과에 재무 문장 검증 단계를 두어 실제 비교값과 어긋나는 서술은 채택하지 않도록 했습니다.",
        role: "단독 개발",
        tags: J(["React", "Electron", "FastAPI", "TypeScript", "pytest"]),
        order: 16,
      },
      {
        title: "개인 포트폴리오 홈페이지",
        image: "/projects/homepage.jpg",
        client: "개인 프로젝트",
        org: "개인 · 대외활동",
        period: "2026",
        desc: "지금 보고 계신 사이트입니다. Next.js 16 App Router로 만들었고 홈·소개·경력·프로젝트·프로젝트 상세 페이지로 구성했습니다. 경력·교육·프로젝트·기술 스택·자격증은 관리자 페이지에서 직접 추가·수정·삭제하고, 저장하면 미리 만들어 둔 공개 페이지가 바로 갱신됩니다. 관리자 영역은 NextAuth 세션으로 보호하며, Neon PostgreSQL과 Vercel로 운영합니다.",
        role: "단독 개발",
        tags: J(["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Tailwind CSS", "Vercel"]),
        order: 17,
      },
      {
        title: "제8회 K-디지털 트레이닝 해커톤",
        image: "/projects/hackathon.jpg",
        client: "대외 활동 · 팀 참가",
        org: "개인 · 대외활동",
        period: "2026",
        desc: "AI 기반 상담 지원 플랫폼으로 참가했습니다. LangGraph 멀티 에이전트를 Care·감정·위험도·문서화·개입추천 역할로 나누고, 상담 지식 RAG와 MySQL + VectorDB 하이브리드 검색을 붙여 상담 지표를 자동 생성하도록 만들었습니다.",
        role: "팀 참가",
        tags: J(["LangGraph", "Multi-Agent", "RAG", "VectorDB"]),
        order: 18,
      },
    ],
  });

  // ── 자격증 ─────────────────────────────────────────────────
  await prisma.certification.deleteMany();
  await prisma.certification.createMany({
    data: [
      { name: "PCCP · 파이썬 코딩 전문 역량 인증", org: "프로그래머스", year: "2026", order: 1 },
      { name: "PCSQL · SQL 전문 역량 인증", org: "프로그래머스", year: "2026", order: 2 },
      { name: "정보처리기사", org: "한국산업인력공단", year: "2019.11", order: 3 },
      { name: "전기기능사", org: "한국산업인력공단", year: "2013.07", order: 4 },
      { name: "전자기능사", org: "한국산업인력공단", year: "2013.04", order: 5 },
      { name: "프로그래밍기능사", org: "한국산업인력공단", year: "2011.07", order: 6 },
      { name: "컴퓨터그래픽기능사", org: "한국산업인력공단", year: "2011.04", order: 7 },
      { name: "컴퓨터활용능력 1급", org: "대한상공회의소", year: "2011.03", order: 8 },
    ],
  });

  console.log("seed 완료 — 관리자 계정:", username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
