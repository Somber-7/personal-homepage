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
  // desc는 한 줄에 하나씩 bullet로 나온다. "라벨: 내용"이면 라벨이 굵게
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        period: "2025.02 ~ 2026.03",
        duration: "1년 2개월",
        company: "쓰리애니아이앤시",
        role: "프로그램파트 대리 · 웹 개발",
        desc: "웹에이전시 PHP 사이트 신규 개발과 유지보수, 재직 중 200개 이상 사이트 참여 (신규 : 유지보수 ≈ 5 : 5)\n신규 개발: PHP 동적 처리 · 관리자(CMS) 구성 · 오픈\n유지보수: 기능 수정 · 장애와 보안 이슈 대응 · 백업 · 서버 이전\n서버 운영: Linux(Apache/PHP/MySQL) 설정 · 배포 · 도메인·SSL · 로그 점검\n외부 연동: PG 결제 · 문자·알림톡 · 지도·주소 API · 소셜 로그인",
        tags: J(["PHP", "MySQL", "jQuery", "Linux", "PG 결제", "CMS"]),
        isCurrent: false,
        order: 2,
      },
      {
        period: "2020.01 ~ 2024.02",
        duration: "4년 2개월",
        company: "㈜그리드텍",
        role: "솔루션사업부 대리 · 웹 개발",
        desc: "한국전력공사 사내 그룹웨어·업무 시스템 6~9종 상시 유지보수\n한전·교육부 SI 프로젝트 5건 수행 (전자정부 표준프레임워크 기반 신규 개발, 타 시스템 연계)\nLinux 서버 구축·운영",
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
        desc: "팀 프로젝트 5회 모두 PM 겸 팀 리드\n기업참여 최종 프로젝트 최우수상",
        tags: J(["LangGraph", "RAG", "PyTorch", "Django", "AWS", "PM"]),
        order: 1,
      },
      {
        period: "2019.06 ~ 2019.08",
        duration: "3개월",
        name: "스마트미디어인재개발원",
        course: "PBL 기반 IoT 응용 모바일서비스 개발자과정 수료",
        desc: "",
        tags: J([]),
        order: 2,
      },
      {
        period: "2014.03 ~ 2020.02",
        duration: "졸업",
        name: "순천대학교",
        course: "전기전자공학부 전자전공 졸업 · 학점 3.29 / 4.5",
        desc: "",
        tags: J([]),
        order: 3,
      },
    ],
  });

  // ── 프로젝트 ───────────────────────────────────────────────
  // work(맡은 일)·solution(구현과 문제 해결)·result(결과)는 한 줄에 하나씩. 비우면 상세 페이지에 '준비 중'
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: "제8회 K-디지털 트레이닝 해커톤",
        image: "/projects/hackathon.jpg",
        client: "대외 활동 · 팀 참가",
        org: "개인 · 대외활동",
        period: "2026",
        desc: "위기청소년 상담 지원 서비스 아이디어로 참가했습니다. LangGraph 멀티 에이전트를 Care·감정·위험도·문서화·개입추천 역할로 나누고, 상담 지식 RAG와 MySQL·VectorDB 저장 구조로 상담 지표를 생성하도록 설계했습니다.",
        solution: "문제 정의: 상담과 상담 사이 공백 동안 위기청소년의 상태를 확인하기 어렵고 상담사의 행정 부담이 크다는 문제에서 출발\n설계: Care·감정 분석·위험도 분석·문서화·개입 추천 5개 에이전트가 차례로 결과를 넘기는 LangGraph 파이프라인 (참가신청서 기준)\n구조: Django 서비스 백엔드와 FastAPI AI 엔진을 나누고, MySQL(정형)과 VectorDB(상담 지식 RAG)를 함께 쓰는 저장 구조",
        role: "팀 참가",
        tags: J(["LangGraph", "Multi-Agent", "RAG", "VectorDB"]),
        order: 18,
      },
      {
        title: "개인 포트폴리오 홈페이지",
        image: "/projects/homepage.jpg",
        client: "개인 프로젝트",
        org: "개인 · 대외활동",
        period: "2026",
        desc: "경력·교육·프로젝트·기술 스택·자격증을 관리자 페이지에서 직접 추가·수정·삭제하고, 저장하면 미리 만들어 둔 공개 페이지가 바로 갱신됩니다. 관리자 영역은 NextAuth 세션으로 보호하며, Next.js 16 App Router와 Neon PostgreSQL, Vercel로 운영합니다.",
        work: "기획 · 디자인 · 개발 · 배포 단독",
        solution: "갱신: 공개 페이지는 빌드 때 정적으로 만들고, 관리자 API가 저장할 때 revalidatePath로 다시 만들어 방문할 때마다 DB를 조회하지 않음\nDB: MySQL에서 Neon PostgreSQL로 옮기고, 앱은 풀링 주소·스키마 반영은 직결 주소를 쓰도록 나눔\n인증: NextAuth Credentials + bcrypt, 모든 관리자 API에서 세션 확인\n공유: 페이지별 메타데이터와 링크 미리보기 이미지(OG) 생성",
        result: "경력·교육·프로젝트·기술·자격증을 관리자 화면에서 고치면 공개 페이지에 바로 반영\nVercel에 배포해 imjune.vercel.app으로 운영",
        role: "단독 개발",
        link: "https://imjune.vercel.app",
        tags: J(["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Tailwind CSS", "Vercel"]),
        order: 17,
      },
      {
        title: "Stock Analyze · 주식 분석 데스크톱 앱",
        client: "개인 프로젝트",
        org: "개인 · 대외활동",
        period: "2026",
        desc: "증권사 오픈 API를 연동한 국내주식 조회·분석 데스크톱 앱입니다. React + Vite 화면과 FastAPI 백엔드를 Electron으로 묶어 설치형과 무설치 실행형으로 배포했습니다. AI 분석 결과에 재무 문장 검증 단계를 두어 실제 비교값과 어긋나는 서술은 채택하지 않도록 했습니다.",
        work: "기획 · 화면 · 백엔드 · 배포 단독",
        solution: "React + Vite 화면과 FastAPI 백엔드를 Electron으로 묶음\nAI 분석 결과에 재무 문장 검증 단계를 두어 실제 비교값과 어긋나는 서술은 채택하지 않음",
        result: "설치형과 무설치 실행형으로 배포",
        role: "단독 개발",
        tags: J(["React", "Electron", "FastAPI", "TypeScript", "pytest"]),
        order: 16,
      },
      {
        title: "GQA 교육 신청·수료증 시스템",
        image: "/projects/site-gqa.jpg",
        client: "GQA",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "자동차 품질 교육기관(VDA QMC 파트너) 사이트의 공개·기업체 맞춤 교육 신청 시스템, 교육일정 캘린더, 회원 포털(수강 이력·수료증 발급), 도서 판매, 공지·FAQ·Q&A·불편신고를 구축하고 유지보수했습니다.",
        role: "개발 담당",
        link: "https://gqa.co.kr",
        tags: J(["PHP"]),
        order: 15,
      },
      {
        title: "현대웰딩 B2B 제품 카탈로그",
        image: "/projects/site-hw.jpg",
        client: "현대웰딩",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "대기업 B2B 제조사의 한·영 제품 카탈로그에서 7개 용접공정 × 재질별 다단계 분류, 카테고리 필터와 페이지네이션, 제품별 용접 규격(AWS/ISO)과 자료 제공 기능을 구축하고 유지보수했습니다.",
        role: "개발 담당",
        link: "https://products.hyundaiwelding.com",
        tags: J(["PHP"]),
        order: 14,
      },
      {
        title: "Astell&Kern 브랜드·제품 사이트",
        image: "/projects/site-ak.jpg",
        client: "Astell&Kern",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "글로벌 하이파이 오디오 브랜드의 한·영·중·일 4개 국어 사이트에서 제품 라인별 카탈로그와 상세, 리뷰·전시·갤러리, FAQ·다운로드, 판매처 찾기를 구축하고 유지보수했습니다.",
        role: "개발 담당",
        link: "https://www.astellnkern.com",
        tags: J(["PHP", "AWS"]),
        order: 13,
      },
      {
        title: "KT그룹희망나눔재단 웹사이트",
        image: "/projects/site-ktgf.jpg",
        client: "KT그룹희망나눔재단",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "대기업 계열 공익재단 사이트의 재단·사업 소개, 후원 및 기부 신청 폼, 후원 현황 조회, 공지·사업보고·나눔스토리 게시판, 사업 실적 통계 표시를 구축하고 유지보수했습니다.",
        role: "개발 담당",
        link: "https://ktgf.or.kr",
        tags: J(["PHP"]),
        order: 12,
      },
      {
        title: "웹에이전시 웹사이트 구축·유지보수 (200개 이상)",
        client: "",
        org: "쓰리애니아이앤시",
        period: "2025.02 ~ 2026.03",
        desc: "웹에이전시 프로그램파트에서 순수 PHP와 사내 자체 솔루션으로 신규 개발과 유지보수를 합쳐 200개 이상의 사이트에 참여했습니다. 사내 공통 모듈 커스터마이징과 관리자(CMS) 구성, PG 결제·문자·알림톡·지도 API·소셜 로그인 같은 외부 연동, Linux 웹 서버 운영과 장애 대응을 함께 담당했습니다.",
        work: "신규 개발: PHP 동적 처리 · 관리자(CMS) 구성 · 오픈\n유지보수: 기능 수정 · 장애와 보안 이슈 대응 · 백업 · 서버 이전\n서버 운영: Linux(Apache/PHP/MySQL) 설정 · 배포 · 도메인·SSL · 로그 점검\n외부 연동: PG 결제 · 문자·알림톡 · 지도·주소 API · 소셜 로그인",
        role: "개발 담당",
        tags: J(["PHP", "MySQL", "jQuery", "Linux"]),
        order: 11,
      },
      {
        title: "한전 AMI 2.0 스마트미터링 장치관리",
        client: "한국전력공사 (3인)",
        org: "㈜그리드텍",
        period: "2020.07 ~ 2020.11",
        desc: "전자정부 표준프레임워크로 AMI 장치의 자동 검침 데이터를 관리하고 통계로 보여 주는 페이지의 화면과 기능을 구현했습니다.",
        work: "AMI 검침 데이터 관리·통계 화면·기능 구현",
        role: "화면 · 기능 구현",
        tags: J(["Java", "eGovFramework", "통계"]),
        order: 10,
      },
      {
        title: "한전 모바일 스마트워크 플랫폼 구축",
        client: "한국전력공사 (6인)",
        org: "㈜그리드텍",
        period: "2020.09 ~ 2021.03",
        desc: "사내 신규 웹하드 시스템 도입에 따라 Linux 서버를 구축·관리하고 연계사 사이의 커뮤니케이션을 담당했습니다. 프로젝트 종료 후에는 해당 시스템의 전반적인 유지보수를 이어서 맡았습니다.",
        work: "Linux 서버 구축·관리\n연계사 조율\n프로젝트 종료 후 시스템 유지보수",
        role: "서버 구축 · 운영 · 연계사 커뮤니케이션",
        tags: J(["Linux", "Altibase", "서버 운영"]),
        order: 9,
      },
      {
        title: "한전 공사현장 모니터링 시스템 개선",
        client: "한국전력공사 (4인)",
        org: "㈜그리드텍",
        period: "2022.03 ~ 2022.09",
        desc: "PHP로 신규 웹페이지와 모바일용 WebApp 화면·기능을 구현했고, 다수의 REST API를 설계·연계해 사내 타 시스템 및 모바일 웹과 데이터를 주고받도록 했습니다.",
        work: "PHP 웹·모바일 WebApp 화면·기능 구현\nREST API 설계·연계",
        role: "화면 · 기능 구현 · API 연계",
        tags: J(["PHP", "REST API", "WebApp", "jQuery"]),
        order: 8,
      },
      {
        title: "한전 기록물철관리 SW 개발 용역",
        client: "한국전력공사 (6인)",
        org: "㈜그리드텍",
        period: "2023.04 ~ 2023.08",
        desc: "전자정부 표준프레임워크 기반으로 한전 사내 기록물 보관 웹페이지의 화면과 기능을 구현했습니다.",
        work: "기록물 보관 웹페이지 화면·기능 구현",
        role: "화면 · 기능 구현",
        tags: J(["Java", "eGovFramework", "JSP"]),
        order: 7,
      },
      {
        title: "교육부 정보시스템 기능강화 사업",
        client: "교육부 (3인)",
        org: "㈜그리드텍",
        period: "2023.07 ~ 2023.12",
        desc: "교직원 인사 정보를 담당자가 일일이 수작업으로 반영하던 방식을 Excel 업로드와 eGovFramework 배치 처리로 바꾸고, 반영 전 확인과 예약 적용이 가능하도록 리스트 페이지를 붙였습니다. 온나라 2.0 연계에서는 프로토콜 문서가 실제와 달라, Web Service 인터페이스로 API 규격을 다시 정하고 협력 부서와 문서를 수정해 연계를 맞췄습니다. 트랜잭션 관리와 실시간 모니터링을 적용해 데이터 무결성을 확보했습니다.",
        work: "인사 정보 일괄처리\n온나라 2.0 연계",
        solution: "문제: 인사 정보를 수작업으로 반영해 인사이동 시기마다 처리가 밀리고 시스템 간 데이터가 어긋남\n해결: Excel 업로드 → eGovFramework 배치 일괄 반영, 반영 전 확인·예약 적용 화면 추가\n해결: 실제와 다른 연계 문서를 협력 부서와 바로잡고 Web Service 규격을 다시 정해 온나라 2.0 연계",
        result: "수작업 반영을 업로드와 배치로 대체\n시스템 간 전송 오류와 불일치 감소",
        role: "설계 · 기능 구현 · 타 시스템 연계",
        tags: J(["Java", "eGovFramework", "MyBatis", "Web Service", "배치 처리"]),
        order: 6,
      },
      {
        title: "halil · 프로젝트 운영 Agent Platform",
        image: "/projects/halil.jpg",
        client: "기업참여 최종 프로젝트 (5인) · 최우수상",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.07 ~ 2026.09",
        desc: "코딩 없이 팀 운영 AI 에이전트를 만들어 쓰는 플랫폼입니다. Google Drive·Jira·인사 시스템을 연결해 두면 대화와 승인 한 번으로 업무 추출과 Jira 등록까지 처리합니다. 모든 답변에 원문 근거를 붙이고, 외부를 바꾸는 작업은 사람의 승인을 거치도록 설계했습니다. 도구 레지스트리와 승인 게이트 구조를 설계하고 도구 33종 중 16종을 구현했으며, 운영자 콘솔을 권한 관리와 파괴적 조치 통제까지 넓혔습니다. 문서 임베딩을 맡는 RunPod GPU 워커는 팀원이 만든 저장소를 halil에 맞게 옮겨 배포하고, OCR 처리와 txt·md 입력 지원을 보완했습니다.",
        work: "PM: 7주 일정 · 작업 분담 · Git 전략 · 산출물\n화면: 서비스 화면 전반\n에이전트 하네스: 도구 레지스트리 · 승인 게이트 구조 설계, 도구 33종 중 16종 구현 (승인 게이트 5종 포함)\n운영자 콘솔 확장: 팀·계정·모델·MCP·가드레일·사용량 화면, 권한 부여·회수와 파괴적 조치 통제\n임베딩 워커: 팀원이 만든 RunPod GPU 워커를 이관·배포, OCR과 txt·md 입력 보완",
        solution: "승인 게이트: LangGraph의 멈춤 신호가 tuple로 나와 승인 카드가 뜨지 않던 문제를 찾아, 승인 대기 이벤트와 체크포인트 재개(Command(resume)) 경로를 연결\n배포: gunicorn 30초 타임아웃이 문서 질문 스트리밍을 끊던 문제를 gthread 워커로 해결, 배포 후 옛 화면이 뜨던 캐시 문제와 배포 전 RDS 스키마를 확인하는 CI 단계 정리\n권한: 팀원의 프로젝트·스킬 삭제에 빠져 있던 역할 검사를 서버에서 막고, 운영자 권한 회수는 자기 회수·마지막 운영자 회수 금지와 감사 로그를 트랜잭션 안에서 처리\n테스트: 팀 삭제 때 빠지던 테이블과 옛 revision 근거가 검색되던 문제를 고치고, 스키마·SQL 대조 테스트로 재발 방지",
        result: "기업참여 최종 프로젝트 최우수상",
        role: "PM · 화면 전반 · 에이전트 하네스 · 운영자 콘솔",
        tags: J(["Django", "DRF", "deepagents", "LangGraph", "PostgreSQL", "pgvector", "React", "RunPod", "AWS"]),
        order: 5,
      },
      {
        title: "명가작명소 · AI 작명 웹 서비스",
        image: "/projects/myeongga.jpg",
        client: "4차 프로젝트 (4인)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.06 ~ 2026.07",
        desc: "3차 프로젝트에서 만든 작명 QA 엔진을 실제 사용자·관리자가 쓰는 웹 서비스로 제품화했습니다. LangGraph 엔진을 FastAPI로 감싸 재사용하고 React 사용자 화면과 Django 인증·회원·관리 기능을 붙여 AWS에 배포했으며, 실제 도메인으로 운영했습니다.",
        work: "PM · 통합 관리\n배포 흐름 · 운영 환경 · 서버 인프라",
        solution: "3차 프로젝트의 LangGraph 엔진을 FastAPI로 감싸 재사용\nNginx 프록시 · HTTPS, AWS 배포, GitHub Actions 자동 배포",
        result: "실제 도메인에서 사용자·관리자용 웹 서비스로 운영",
        role: "PM · 통합 관리 · 배포 흐름 · 서버 인프라",
        tags: J(["React", "TypeScript", "Django", "FastAPI", "ChromaDB", "Neo4j", "Docker", "AWS", "GitHub Actions"]),
        order: 4,
      },
      {
        title: "조건 기반 맞춤 작명 QA 시스템",
        image: "/projects/naming-qa.jpg",
        client: "3차 프로젝트 (4인)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.06",
        desc: "자연어로 입력한 조건에 맞는 이름을 추천하고 법령 근거를 출처와 함께 제시하는 대화형 QA 시스템입니다. LangGraph ReAct Router가 RAG·계산·법령 API·그래프 네 경로로 분기하고 FastMCP 도구 16개를 호출합니다. 운영 파이프라인과 QLoRA 파인튜닝 모델의 답변 품질을 비교해 4.09점 대 1.63점으로 RAG+Tool 구조의 우위를 수치로 확인했습니다.",
        work: "PM · 일정 조율\nGit 브랜치 · 서버 인프라 관리",
        solution: "구조: LangGraph ReAct Router → RAG · 계산 · 법령 API · 그래프 4경로 분기\n도구: FastMCP 도구 16개",
        result: "RAG+Tool 4.09점 vs 파인튜닝 1.63점 (11개 케이스) → 4차 프로젝트에 RAG+Tool 구조 채택",
        role: "PM · 일정 조율 · Git 브랜치 · 서버 인프라",
        tags: J(["LangGraph", "FastMCP", "ChromaDB", "Neo4j", "OpenAI API", "QLoRA"]),
        order: 3,
      },
      {
        title: "아파트 실거래 ML 인터랙티브 플랫폼",
        image: "/projects/apartment.jpg",
        client: "2차 프로젝트 (4인)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.04 ~ 2026.05",
        desc: "약 500만 건의 아파트 실거래 데이터로 가격 예측·브랜드 분류·지역 군집화·이상 거래 탐지를 웹에서 돌려 볼 수 있게 만들었습니다. 원본 ZIP에서 MySQL, Parquet 캐시, 사전계산 모델을 거쳐 Streamlit으로 이어지는 아키텍처를 설계했고, 행정구역 개편을 반영해 결측 37만 건을 보완하고 지오코딩을 수행했습니다. 트리 앙상블이 DNN보다 RMSE 8~12% 우수했습니다.",
        work: "PM\n행정구역 개편 반영으로 결측 37만 건 보완, 지오코딩\n회귀 모델",
        solution: "설계: 원본 ZIP → MySQL → Parquet 캐시 → 사전계산 모델 → Streamlit 구조로 약 500만 건을 웹에서 바로 실행",
        result: "모델 9종 구축\n트리 앙상블이 DNN보다 RMSE 8~12% 우수",
        role: "PM · 데이터 엔지니어링 · 아키텍처 설계 · 회귀 모델",
        tags: J(["Python", "scikit-learn", "LightGBM", "XGBoost", "PyTorch", "Streamlit", "MySQL", "지오코딩"]),
        order: 2,
      },
      {
        title: "에너지 가격 변동의 모빌리티 시장 영향 분석",
        image: "/projects/energy.jpg",
        client: "1차 프로젝트 (3인)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.03",
        desc: "국산차 월별 등록 데이터와 전국 유가 변동의 상관관계를 분석했습니다. 유가 변동이 신차 등록에 반영되기까지 평균 3개월의 리드타임을 확인했고, 친환경차 수요는 유가보다 보조금·인프라 같은 정책 요인에 좌우된다는 점을 데이터로 검증했습니다.",
        work: "PM\n현대·기아·제네시스·KGM FAQ 크롤러 4종 작성\nDB 설계 · 등록 통계·유가 데이터 적재\n산출물 취합",
        solution: "수집: Selenium + BeautifulSoup으로 현대·기아·제네시스·KGM FAQ 크롤러 4종 단독 구현. 버튼 class·display로 마지막 페이지 판정, 탭·페이지 그룹 순회, 아코디언 클릭 후 부분 파싱으로 브랜드마다 다른 화면 구조에 대응해 약 740건 적재\nDB: 공통코드 테이블과 FK로 연료·차종·용도·지역을 정규화한 스키마 설계, ERD와 테이블 명세서 작성\n적재: 62개월치 등록 통계·유가 엑셀의 병합 셀·소계 행·'-' 값을 정제하고, 1000건 단위 upsert로 다시 돌려도 안전하게 적재\n연동: 하드코딩돼 있던 Streamlit FAQ 페이지를 DB 조회로 바꾸고 브랜드별 카테고리 필터·키워드 검색·페이지네이션 구현",
        result: "팀 분석: 유가가 신차 등록에 반영되기까지 평균 3개월 리드타임 확인\n팀 분석: 친환경차 수요는 유가보다 보조금·인프라 같은 정책 요인에 좌우된다는 점을 데이터로 검증",
        role: "PM · 크롤러 개발 · 산출물 취합",
        tags: J(["Python", "MySQL", "Streamlit", "Plotly", "웹 크롤링"]),
        order: 1,
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
