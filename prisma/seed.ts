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
  // isLearning: false = 실무, true = AI 캠프·개인 프로젝트
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      { category: "언어", items: J(["PHP", "Java", "JavaScript", "SQL"]), isLearning: false, order: 1 },
      { category: "웹 · 프레임워크", items: J(["eGovFramework", "MyBatis", "JSP", "jQuery"]), isLearning: false, order: 2 },
      { category: "데이터베이스", items: J(["Oracle", "MySQL", "Altibase", "Tibero"]), isLearning: false, order: 3 },
      { category: "서버", items: J(["Linux", "Apache", "Tomcat"]), isLearning: false, order: 4 },
      { category: "언어", items: J(["Python", "TypeScript"]), isLearning: true, order: 5 },
      { category: "웹 · 프레임워크", items: J(["Django", "DRF", "FastAPI", "React", "Next.js"]), isLearning: true, order: 6 },
      { category: "AI · 에이전트", items: J(["LangGraph", "LangChain", "deepagents", "RAG", "MCP"]), isLearning: true, order: 7 },
      { category: "데이터베이스", items: J(["PostgreSQL · pgvector"]), isLearning: true, order: 8 },
      { category: "인프라", items: J(["Docker", "Nginx", "AWS", "GitHub Actions", "Vercel"]), isLearning: true, order: 9 },
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
        desc: "웹에이전시 브랜드 WebSite.co.kr에서 PHP 사이트 신규 개발과 유지보수, 재직 중 200개 이상 사이트 참여 (신규 : 유지보수 ≈ 5 : 5)\n신규 개발: PHP 동적 처리 · 관리자(CMS) 구성 · 오픈\n유지보수: 기능 수정 · 장애와 보안 이슈 대응 · 백업 · 서버 이전\n서버 운영: Linux(Apache/PHP/MySQL) 설정 · 배포 · 도메인·SSL · 로그 점검\n외부 연동: PG 결제 · 문자·알림톡 · 지도·주소 API · 소셜 로그인",
        tags: J(["PHP", "MySQL", "jQuery", "Linux"]),
        isCurrent: false,
        order: 2,
      },
      {
        period: "2020.01 ~ 2024.02",
        duration: "4년 2개월",
        company: "㈜그리드텍",
        role: "솔루션사업부 대리 · 웹 개발",
        desc: "상시 유지보수: 한전 그룹웨어(웹결재 · 메일서비스 연동 · WEB2.0 확장모듈 · 웹하드 엔진 · 웹하드 모바일 앱 · 웹문서 관리)와 VPN 신청 페이지 등 7종\nSI 프로젝트: 한전 · 한전KDN · 한전 전력연구원 · 교육부 발주 5건 (전자정부 표준프레임워크 기반 신규 개발, 타 시스템 연계)\n서버: Linux 서버 구축 · 운영 (Apache · Tomcat)\n직급: 그룹웨어개발1팀 사원(2020.01~) → 솔루션사업부 대리(2022.04~)",
        tags: J(["Java", "PHP", "eGovFramework", "Oracle", "Altibase", "Linux"]),
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
        tags: J(["LangGraph", "RAG", "PyTorch", "Django", "AWS"]),
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
        course: "전기전자공학부 전자전공 졸업",
        desc: "",
        tags: J([]),
        order: 3,
      },
    ],
  });

  // ── 프로젝트 ───────────────────────────────────────────────
  // work(맡은 일)·solution(구현과 문제 해결)·result(결과)는 한 줄에 하나씩. 비운 칸은 상세 페이지에 나오지 않는다
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: "개인 포트폴리오 홈페이지",
        image: "/projects/homepage.jpg",
        client: "개인 프로젝트",
        org: "개인 프로젝트",
        period: "2026",
        desc: "경력·교육·프로젝트·기술 스택·자격증을 관리자 페이지에서 직접 추가·수정·삭제하고, 저장하면 미리 만들어 둔 공개 페이지가 바로 갱신됩니다. 관리자 영역은 NextAuth 세션으로 보호하며, Next.js 16 App Router와 Neon PostgreSQL, Vercel로 운영합니다.",
        work: "기획 · 디자인 · 개발 · 배포 단독",
        solution: "갱신: 공개 페이지는 빌드 때 정적으로 만들고, 관리자 API가 저장할 때 revalidatePath로 다시 만들어 방문할 때마다 DB를 조회하지 않음\nDB: MySQL에서 Neon PostgreSQL로 옮기고, 앱은 풀링 주소·스키마 반영은 직결 주소를 쓰도록 나눔\n인증: NextAuth Credentials + bcrypt, 모든 관리자 API에서 세션 확인. 아이디·IP별로 15분 안에 5번 틀리면 잠그고, 서버리스라 시도 기록은 메모리 대신 DB에 남김\n검증: 입력 칸 설정에서 zod 스키마를 만들어 항목별로 나뉘어 있던 관리자 API 10개 파일을 2개로 합치고, 설정에 없는 칸·잘못된 값·http(s)가 아닌 주소는 저장 전에 400으로 거절\n공유: 페이지별 메타데이터와 링크 미리보기 이미지(OG) 생성",
        result: "경력·교육·프로젝트·기술·자격증을 관리자 화면에서 고치면 공개 페이지에 바로 반영\n입력 검증·로그인 잠금·관리자 API 응답 코드를 vitest로 확인하고, push마다 GitHub Actions에서 타입 검사·lint·테스트 실행\nVercel에 배포해 imjune.vercel.app으로 운영",
        role: "단독 개발",
        link: "https://imjune.vercel.app",
        repo: "https://github.com/Somber-7/personal-homepage",
        tags: J(["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Tailwind CSS", "Vercel"]),
        order: 18,
      },
      {
        title: "Stock Analyze · 주식 분석 데스크톱 앱",
        client: "개인 프로젝트",
        org: "개인 프로젝트",
        period: "2026",
        desc: "증권사 오픈 API를 연동한 국내주식 조회·분석 데스크톱 앱입니다. React + Vite 화면과 FastAPI 백엔드를 Electron으로 묶어 설치형과 무설치 실행형으로 배포했습니다. AI 분석 결과에 재무 문장 검증 단계를 두어 실제 비교값과 어긋나는 서술은 채택하지 않도록 했습니다.",
        work: "기획 · 화면 · 백엔드 · 배포 단독",
        solution: "재무 문장 검증: DART 재무값으로 계정·기간별 비교값을 계산해 모델 입력과 검증에 같이 쓰고, 모델이 비교값과 반대 방향이나 근거 없는 개선·악화를 단정하면 분석 결과를 채택하지 않음\n오탐 줄이기: \"현금 유출 증가\"를 개선으로 잘못 읽고 다른 주어의 증감을 붙이던 과잉 거부를 부호 반전·주어 분리 규칙으로 고침\n자료 부족 시 유보: 일봉 검증에 실패하거나 근거가 부족하면 모델 답과 관계없이 판단 유보로 강제\n주문 안전장치: 분석 후 5분 · 가격 변동 3% 제한, 중복 주문 방지 ID, 결과가 불확실하면 재전송하지 않음\n키 보관: AI 키는 Windows DPAPI로 암호화, 응답에 키가 섞여 나오면 거부",
        result: "Python 테스트 308개, 버전 1.21까지 배포\n설치형과 무설치 실행형으로 배포",
        role: "단독 개발",
        repo: "https://github.com/Somber-7/stock-analyze",
        tags: J(["Python", "FastAPI", "React", "Electron", "TypeScript", "pytest"]),
        order: 17,
      },
      {
        title: "GQA 교육 신청·수료증 시스템",
        image: "/projects/site-gqa.jpg",
        client: "GQA",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "자동차 품질 교육기관(VDA QMC 파트너) 사이트의 공개·기업체 맞춤 교육 신청 시스템, 교육일정 캘린더, 회원 포털(수강 이력·수료증 발급), 도서 판매, 공지·FAQ·Q&A·불편신고를 구축하고 유지보수했습니다.",
        work: "교육 신청: 공개교육 과정 · 월별 일정 캘린더 · 일정 상세 · 신청 · 결제 흐름\n회원·마이페이지: 개인/교육담당자 회원(소속회사 검색·등록), 수강 조회, 수료증 출력\n부가 기능: 도서 판매, 공지 · FAQ · Q&A · 불만사항 게시판",
        solution: "과정과 일정 분리: 한 과정에 지역·날짜가 다른 여러 일정을 달고, 일정마다 정원·잔여석·상태 관리\n정원 초과 시 대기: 정원이 차면 같은 신청 화면이 대기 접수로 바뀌고, 신청 순서대로 임시 번호를 붙여 대기 순번 관리\n대기자 승격은 수동으로: 취소자가 생겼을 때 자동으로 다음 대기자를 올리면 결제·연락이 꼬일 수 있어, 관리자 페이지에서 직접 올리도록 설계\n결제 흐름 분리: 교육이 확정됐는지 모집 중인지에 따라 결제 흐름을 나누고, 결제하지 않은 신청은 취소",
        result: "2025년 10월 오픈, VDA QMC 공식 교육 신청을 GQA 홈페이지로만 받는 창구로 운영",
        role: "개발 담당",
        link: "https://gqa.co.kr",
        tags: J(["PHP"]),
        order: 16,
      },
      {
        title: "현대웰딩 B2B 제품 카탈로그",
        image: "/projects/site-hw.jpg",
        client: "현대웰딩",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "대기업 B2B 제조사의 한·영 제품 카탈로그에서 7개 용접공정 × 재질별 다단계 분류, 카테고리 필터와 페이지네이션, 제품별 용접 규격(AWS/ISO)과 자료 제공 기능을 구축하고 유지보수했습니다.",
        work: "제품 DB: 고객사가 엑셀로 보낸 용접재료 제품 데이터를 DB로 구축\n분류·목록·상세: 7개 용접공정 × 재질별 2단계 분류와 한·영 목록·상세 페이지\nPDF 카탈로그: 제품 데이터로 제품별 PDF 카탈로그를 만드는 기능",
        solution: "엑셀 → DB: 고객사가 편한 대로 만든 엑셀을 DB 구조로 정리. 제품군마다 표 구성이 달라(보호가스 열, 선급 승인 수, SAW 플럭스의 와이어 조합별 행) 제품군별로 나눠 설계\nPDF 자동 생성: 파일을 미리 올리지 않고 요청할 때 PHP(TCPDF)로 제품 데이터에서 PDF를 만들어 제품명 파일로 내려줌\n국·영: 같은 제품 번호로 한·영 페이지와 PDF를 따로 제공",
        result: "7개 공정 제품의 한·영 상세와 제품별 PDF 카탈로그 제공\nDB 값을 고치면 PDF도 바로 새 값으로 만들어짐",
        role: "개발 담당",
        link: "https://products.hyundaiwelding.com",
        tags: J(["PHP"]),
        order: 15,
      },
      {
        title: "Astell&Kern 브랜드·제품 사이트",
        image: "/projects/site-ak.jpg",
        client: "Astell&Kern",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "글로벌 하이파이 오디오 브랜드의 한·영·중·일 4개 국어 사이트에서 제품 라인별 카탈로그와 상세, 리뷰·전시·갤러리, FAQ·다운로드, 판매처 찾기를 구축하고 유지보수했습니다.",
        work: "재구축: AWS 위 Spring 기반 기존 사이트를 사내 PHP 솔루션으로 다시 구축\n데이터 이전: 기존 MSSQL 데이터를 MySQL로 이전 (제품·자료실·게시판)\n다국어: 한·영·중·일 4개 언어 페이지와 데이터 구조",
        solution: "기존 기능 그대로: 기존 사이트와 같은 기능을 요구받아 제품 목록·상세, 자료실, FAQ, 리뷰·전시·공지 등 거의 모든 페이지를 DB 기반 동적 페이지로 다시 구현\n다국어 구조: 제품은 번호 하나를 4개 언어가 함께 쓰며 본문만 언어별로 두고, 게시판은 언어별로 나눠 따로 운영\n판매처 찾기: 대륙 → 국가 선택에 따라 판매처 목록을 불러오는 기존 동작을 다시 구현\n데이터 이전: 기존 사이트와 사내 솔루션은 테이블 구조가 처음부터 달라, 기능마다 기존 테이블·서브 테이블을 솔루션 테이블에 대응시키고 칼럼을 하나씩 맞춘 뒤 이전 스크립트로 옮기고, 테스트 페이지로 기존 사이트와 계속 비교하며 검증",
        result: "4개 언어 브랜드 사이트를 AWS(로드밸런서 · S3 · CloudFront) 위에서 운영",
        role: "개발 담당",
        link: "https://www.astellnkern.com",
        tags: J(["PHP", "AWS"]),
        order: 14,
      },
      {
        title: "KT그룹희망나눔재단 웹사이트",
        image: "/projects/site-ktgf.jpg",
        client: "KT그룹희망나눔재단",
        org: "쓰리애니아이앤시",
        period: "",
        desc: "대기업 계열 공익재단 사이트의 재단·사업 소개, 후원 및 기부 신청 폼, 후원 현황 조회, 공지·사업보고·나눔스토리 게시판, 사업 실적 통계 표시를 구축하고 유지보수했습니다.",
        work: "신청: 스마트ICT스쿨 교육신청 · 희망나눔인상 추천 · 디지털인재장학생 지원 등 온라인 신청·조회 페이지\n게시판: 공지사항 · 사업보고(연차보고서·재무제표·사용명세서 분류) · 나눔소식 · 수상자 목록",
        solution: "신청서: 기관 정보·희망일시·학년별 인원(합계 자동 계산) 입력에 우편번호 검색·캡차·개인정보 동의를 연결\n신청 조회: 신청 내역을 공개 목록으로 보여 주되 담당자 이름을 가리고 대기/승인 상태 표시\n추천 접수: 개인/단체 구분, 첨부파일 업로드, 추천인·후보자 동의를 따로 받는 추천서",
        result: "재단 사업 신청·조회를 홈페이지에서 온라인으로 운영",
        role: "개발 담당",
        link: "https://ktgf.or.kr",
        tags: J(["PHP"]),
        order: 13,
      },
      {
        title: "웹에이전시 웹사이트 구축·유지보수 (200개 이상)",
        client: "",
        org: "쓰리애니아이앤시",
        period: "2025.02 ~ 2026.03",
        desc: "웹에이전시 프로그램파트에서 순수 PHP와 사내 자체 솔루션으로 신규 개발과 유지보수를 합쳐 200개 이상의 사이트에 참여했습니다. 사내 공통 모듈 커스터마이징과 관리자(CMS) 구성, PG 결제·문자·알림톡·지도 API·소셜 로그인 같은 외부 연동, Linux 웹 서버 운영과 장애 대응을 함께 담당했습니다.",
        work: "신규 개발: PHP 동적 처리 · 관리자(CMS) 구성 · 오픈\n유지보수: 기능 수정 · 장애와 보안 이슈 대응 · 백업 · 서버 이전\n서버 운영: Linux(Apache/PHP/MySQL) 설정 · 배포 · 도메인·SSL · 로그 점검\n외부 연동: PG 결제 · 문자·알림톡 · 지도·주소 API · 소셜 로그인",
        solution: "결제 연동: 나이스페이 결제에서 결제 후 '결제 대기' 잔류, 중복 결제, 실제 상점 전환 실패, 관리자 환불 문제가 여러 사이트에서 나와 결제 흐름을 단계별로 디버깅하고, 원인이 있던 사내 공통 결제 모듈을 직접 수정해 반영\n레거시 유지보수: 오래된 사이트와 다른 사람이 만든 사이트가 대부분이라, 요청이 오면 해당 코드를 직접 읽어 원인을 찾고 수정·기능 추가, 필요하면 옛 방식의 코드를 요즘 방식으로 교체",
        result: "같은 결제 모듈을 쓰는 사이트들에 수정 반영\n접속 불가·성능 저하·스팸과 해킹 흔적·서버 이전 후 호환성 문제 대응",
        role: "개발 담당",
        tags: J(["PHP", "MySQL", "jQuery", "Linux"]),
        order: 12,
      },
      {
        title: "한전 AMI 2.0 스마트미터링 장치관리",
        client: "한전 전력연구원 (3인)",
        org: "㈜그리드텍",
        period: "2020.07 ~ 2020.11",
        desc: "AMI 2.0 스마트미터링 장치관리 모델을 세우고 유효성을 검증하는 과제에서, 전자정부 표준프레임워크로 AMI 장치의 자동 검침 데이터를 관리하고 통계로 보여 주는 페이지의 화면과 기능을 구현했습니다.",
        work: "AMI 검침 데이터 관리·통계 화면·기능 구현",
        role: "화면 · 기능 구현",
        tags: J(["Java", "eGovFramework", "JSP", "jQuery", "Oracle"]),
        order: 11,
      },
      {
        title: "한전 모바일 스마트워크 플랫폼 구축",
        client: "한국전력공사 (6인)",
        org: "㈜그리드텍",
        period: "2020.09 ~ 2021.03",
        desc: "한전 사내 그룹웨어 웹하드 시스템을 도입하는 사업으로, Linux 서버를 구축·관리하고 협력사(엑스소프트)와의 커뮤니케이션을 맡았습니다. 이후 웹하드 엔진·모바일 앱·웹문서 관리 유지보수로 이어졌습니다.",
        work: "그룹웨어 웹하드 도입: Linux 서버 구축·관리\n기존 웹하드 데이터 이전\n협력사(엑스소프트) 간 조율\n프로젝트 종료 후 시스템 유지보수",
        solution: "데이터 이전: 기존 웹하드에서 신규 웹하드로 수백 TB 규모 데이터를 옮기는 데 이틀이 걸려 금요일부터 일요일까지 이어서 작업",
        result: "웹하드 엔진 · 웹하드 모바일 앱 · 웹문서 관리 상시 유지보수로 이어짐 (2022.04~2024.02)",
        role: "서버 구축 · 운영 · 연계사 커뮤니케이션",
        tags: J(["Linux", "Java", "JSP", "Altibase"]),
        order: 10,
      },
      {
        title: "한전 공사현장 모니터링 시스템 개선",
        client: "한국전력공사 (4인)",
        org: "㈜그리드텍",
        period: "2022.03 ~ 2022.09",
        desc: "PHP로 신규 웹페이지와 모바일용 WebApp 화면·기능을 구현했고, 다수의 REST API를 설계·연계해 사내 타 시스템 및 모바일 웹과 데이터를 주고받도록 했습니다.",
        work: "PHP 웹·모바일 WebApp 화면·기능 구현\nREST API 설계·연계",
        role: "화면 · 기능 구현 · API 연계",
        tags: J(["PHP", "jQuery", "Linux"]),
        order: 9,
      },
      {
        title: "한전 기록물철관리 SW 개발 용역",
        client: "한전KDN (6인)",
        org: "㈜그리드텍",
        period: "2023.04 ~ 2023.08",
        desc: "전자정부 표준프레임워크 기반으로 한전 사내 기록물 보관 웹페이지의 화면과 기능을 구현했습니다.",
        work: "기록물 보관 웹페이지 화면·기능 구현",
        role: "화면 · 기능 구현",
        tags: J(["Java", "eGovFramework", "JSP", "jQuery", "Oracle"]),
        order: 8,
      },
      {
        title: "교육부 정보시스템 기능강화 사업",
        client: "교육부 (3인)",
        org: "㈜그리드텍",
        period: "2023.07 ~ 2023.12",
        desc: "교직원 인사 정보를 담당자가 일일이 수작업으로 반영하던 방식을 Excel 업로드와 eGovFramework 배치 처리로 바꾸고, 반영 전 확인과 예약 적용이 가능하도록 리스트 페이지를 붙였습니다. 온나라 2.0 연계에서는 프로토콜 문서가 실제와 달라, Web Service 인터페이스로 API 규격을 다시 정하고 협력 부서와 문서를 수정해 연계를 맞췄습니다.",
        work: "인사 정보 일괄처리\n온나라 2.0 연계",
        solution: "문제: 인사 정보를 수작업으로 반영해 인사이동 시기마다 처리가 밀리고 시스템 간 데이터가 어긋남\n해결: Excel 업로드 → eGovFramework 배치 일괄 반영, 반영 전 확인·예약 적용 화면 추가\n해결: 실제와 다른 연계 문서를 협력 부서와 바로잡고 Web Service 규격을 다시 정해 온나라 2.0 연계",
        result: "수작업 반영을 업로드와 배치로 대체\n시스템 간 전송 오류와 불일치 감소",
        role: "설계 · 기능 구현 · 타 시스템 연계",
        tags: J(["Java", "eGovFramework", "MyBatis", "Tibero", "jQuery", "Web Service"]),
        order: 7,
      },
      {
        title: "한전 그룹웨어 상시 유지보수 (7종)",
        client: "한전KDN · 한국전력공사",
        org: "㈜그리드텍",
        period: "2020.01 ~ 2024.02",
        desc: "재직 기간 내내 한전 사내 그룹웨어 패키지와 VPN 신청 페이지를 상시 유지보수했습니다.",
        work: "웹결재: PHP · Apache · Oracle (2020.01~)\n웹기반 메일서비스 연동: PHP · Oracle · Linux (2020.01~)\nWEB2.0 확장모듈: PHP · Oracle (2020.01~)\nVPN 신청 페이지 연계 경로 개선: PHP · MySQL · Linux, 한국전력공사 발주 (2020.01~)\n웹하드 엔진: Java · Tomcat · Altibase · Linux (2022.04~)\n웹하드 모바일 앱: Java · Tomcat · Altibase · Android (2022.04~)\n웹문서 관리: Java · Tomcat · Altibase · Linux (2022.04~)",
        solution: "트래픽 급증 대응: 한전 직원 약 2만 명 중 수백 명이 쓰던 VPN을 코로나로 1만 명 이상이 쓰게 되면서, VPN만 늘리고 신청 페이지 서버는 고려하지 않아 서버가 다운됨 → 급한 상황이라 남는 서버 장비로 교체해 사양을 올리고 새벽까지 복구",
        result: "2020년 코로나 시기 VPN 신청 페이지 복구 (구조 개선까지는 하지 못함)",
        role: "유지보수 · 개선",
        tags: J(["PHP", "Java", "Oracle", "Altibase", "Tomcat", "Android", "Linux"]),
        order: 6,
      },
      {
        title: "halil · 프로젝트 운영 Agent Platform",
        image: "/projects/halil.jpg",
        client: "기업참여 최종 프로젝트 (5인) · 최우수상",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.07 ~ 2026.09",
        desc: "코딩 없이 팀 운영 AI 에이전트를 만들어 쓰는 플랫폼입니다. Google Drive·Jira·인사 시스템을 연결해 두면 대화와 승인 한 번으로 업무 추출과 Jira 등록까지 처리합니다. 모든 답변에 원문 근거를 붙이고, 외부를 바꾸는 작업은 사람의 승인을 거치도록 설계했습니다. 도구 레지스트리와 승인 게이트 구조를 설계하고 도구 33종 중 16종을 구현했으며, 운영자 콘솔을 권한 관리와 파괴적 조치 통제까지 넓혔습니다. 문서 임베딩을 맡는 RunPod GPU 워커는 팀원이 만든 저장소를 halil에 맞게 옮겨 배포하고, OCR 처리와 txt·md 입력 지원을 보완했습니다.",
        work: "PM: 7주 일정 · 작업 분담 · Git 전략 · 산출물\n화면: 서비스 화면 전반\n에이전트 하네스: 도구 레지스트리 · 승인 게이트 구조 설계, 도구 33종 중 16종 구현 (승인 게이트 5종 포함)\n운영자 콘솔 확장: 팀·계정·모델·MCP·가드레일·사용량 화면, 권한 부여·회수와 파괴적 조치 통제\n임베딩 워커: 팀원이 만든 RunPod GPU 워커를 이관·배포, OCR과 txt·md 입력 보완\n테스트: 팀 전체 1,836개 중 약 700개 작성",
        solution: "DB 연결: 저장소 코드 209곳이 호출마다 DB 연결을 새로 열던 것을 연결 풀(psycopg_pool, 최대 8)로 교체\n데이터 정합성: 팀 삭제 중 서브쿼리가 없는 칼럼을 골라 조건이 항상 참이 되면서 다른 팀 도구까지 지워지던 문제를 원인까지 찾아 고치고, 스키마 파일과 대조하는 회귀 테스트 3종 추가\n승인 게이트: LangGraph의 멈춤 신호가 tuple로 나와 승인 카드가 뜨지 않던 문제를 찾아, 승인 대기 이벤트와 체크포인트 재개(Command(resume)) 경로를 연결\n스트리밍 타임아웃: 문서 질문이 30초에 끊기던 원인(gunicorn 기본 타임아웃)을 찾아 600초로 늘리고, 응답 대기가 대부분인 요청이라 sync 워커를 gthread(2 워커 × 8 스레드)로 전환\n가드레일: OpenAI Guardrails·Azure·Bedrock 3개 공급자를 연동해 실측하고, 외부 가드레일이 응답하지 않으면 채팅이 최장 30분 멈출 수 있던 경로에 10초·12초 상한을 두고 준비 작업과 병렬로 실행\n관측성: 토큰 사용량이 0이나 빈 값으로 기록되던 원인(스트리밍 사용량 미수집, Gemini 추론 토큰 누락)을 고치고 운영자 사용량 화면 추가\n배포·권한: 새 컬럼을 읽는 코드가 스키마 미적용 DB에 배포돼도 성공으로 끝나던 문제를 배포 전 스키마 확인 단계로 막고, 화면에만 있던 팀장 전용 제한 8개 경로를 서버에서 검사",
        result: "DB 연결 풀: 화면 하나 81.4ms → 9.5ms, 문서 목록 34.3ms → 9.3ms (로컬 실측)\n검색 품질 기준선: 문서 8종·질의 37개에서 Recall@5 94.6%, MRR 0.743 (평가 하네스 직접 작성)\n가드레일 실측: \"이전 지시 무시\" 발화를 2.6초 만에 차단, 문서 속에 숨긴 지시문(간접 인젝션)은 막지 못한다는 한계 확인\n배포 전 스키마 확인 항목 57개, 운영 DB 누락 0건\n기업참여 최종 프로젝트 최우수상",
        role: "PM · 화면 전반 · 에이전트 하네스 · 운영자 콘솔",
        repo: "https://github.com/SKNETWORKS-FAMILY-AICAMP/SKN29-FINAL-2TEAM",
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
        work: "PM · 통합 관리 · 브랜치 병합\n작명 엔진: 조건을 먼저 검증하는 구조로 재설계\n서빙: FastAPI 구조화 API, 타임아웃·오류 코드 구분\n배포: Nginx · HTTPS · Docker · GitHub Actions 자동 배포",
        solution: "엔진 재설계: LLM이 자유롭게 만들고 뒤에서 고치던 구조를, 코드가 음절 × 한자 조합을 모두 만들고 검증한 뒤 LLM은 선택과 이유만 쓰는 구조로 전환. 결과를 다시 변환하던 두 번째 LLM 제거\n성씨 처리: 성씨 163개 중 65개가 동음이의라 요청이 전부 반문으로 빠지던 문제를 대표 한자 자동 보완으로 해결\n자동 배포: GitHub Actions가 SSH 타임아웃으로 실패하던 원인(러너 IP가 매번 바뀌어 보안그룹 제한에 걸림)을 찾아 복구, 프론트만 바뀐 커밋이 배포되지 않던 트리거 경로 수정\n서버: GPU 없는 EC2가 배포마다 CUDA용 torch(1.5GB 이상)를 받던 문제를 CPU 전용 설치로, 기본 8GB 디스크 부족을 30GiB로 해결\n병합 전 점검: 팀원 브랜치에서 이미 적용된 마이그레이션이 재작성되고 벡터 DB 파일이 삭제된 것을 병합 전에 찾아 복원하고, 증분 마이그레이션을 새로 작성",
        result: "LLM 호출 7~8회 → 4~5회, 응답 14~17초 (스모크 테스트)\n자동 배포 10회 이상 연속 성공 (테스트 결과 보고서)\n캠프 기간에 실제 도메인(myeongga.site)에서 운영 (현재 접속 불가)",
        role: "PM · 작명 엔진 재설계 · 배포 · 서버 인프라",
        repo: "https://github.com/Somber-7/SKN29-4th-4Team",
        tags: J(["React", "TypeScript", "Django", "FastAPI", "ChromaDB", "Neo4j", "Docker", "AWS", "GitHub Actions"]),
        order: 4,
      },
      {
        title: "조건 기반 맞춤 작명 QA 시스템",
        image: "/projects/naming-qa.jpg",
        client: "3차 프로젝트 (4인)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.06",
        desc: "자연어로 입력한 조건에 맞는 이름을 추천하고 법령 근거를 출처와 함께 제시하는 대화형 QA 시스템입니다. LangGraph ReAct Router가 RAG·계산·법령 API·그래프 네 경로로 분기하고 FastMCP 도구 16개를 호출합니다. 운영 파이프라인과 QLoRA 파인튜닝 모델을 11개 케이스로 예비 비교해(LLM 채점) 4.09점 대 1.63점이 나왔고, 4차 프로젝트에 RAG+Tool 구조를 채택했습니다.",
        work: "PM · 일정 조율 · 브랜치 병합\n라우터: LangGraph ReAct 라우터(뼈대 · 도구 선택 루프 · 반복 호출 차단) 작성\n평가: 평가 스크립트 2종과 비교 평가 보고서 작성\n모델 교체: 운영 모델 교체 결정과 보고서 작성",
        solution: "라우터: 같은 도구 반복 호출·JSON 파싱 실패·컨텍스트 누적을 막으려고 도구 사용 이력으로 중복 차단, 도구 이름 검증, 컨텍스트 8,000자·반복 5회 상한\n모델 교체: Qwen3.5 4B가 같은 문장 반복·형식 불이행·획수 환각을 보이고 파라미터 조정으로도 해결되지 않아, 라우터와 생성 모델을 나누고 OpenAI 모델로 교체\n검색: \"3개 추천\"의 3을 3획으로 찾던 의미 검색 오탐을 오행 필터 + 무작위 샘플링 방식으로 전환\n평가로 버그 수정: LLM 채점 평가에서 드러난 버그 7건(수리 질문 반문 오발동, 숫자 추출 정규식, 오행 한자를 성씨로 오인 등) 수정",
        result: "평가 평균 3.73 → 4.09, 수리 계산 케이스 2.33 → 5.00\n예비 비교(11개 케이스, gpt-5.4 채점, 사람 검수 없음): RAG+Tool 4.09점 vs QLoRA 파인튜닝 1.63점 → 4차에 RAG+Tool 구조 채택\n한계: 버그 수정에 쓴 케이스로 다시 채점해 평가셋 과적합 가능성, 두 방식의 지표 구성이 달라 공통 지표로는 근거성 3.82 vs 1.50",
        role: "PM · LangGraph 라우터 · 평가 · 서버 인프라",
        repo: "https://github.com/Somber-7/SKN29-3rd-4Team",
        tags: J(["LangGraph", "FastMCP", "ChromaDB", "Neo4j", "OpenAI API", "QLoRA"]),
        order: 3,
      },
      {
        title: "아파트 실거래 ML 인터랙티브 플랫폼",
        image: "/projects/apartment.jpg",
        client: "2차 프로젝트 (4인 · 5일)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.04 ~ 2026.05",
        desc: "약 500만 건의 아파트 실거래 데이터로 가격 예측·브랜드 분류·지역 군집화·이상 거래 탐지를 웹에서 돌려 볼 수 있게 만든 팀 프로젝트입니다. 행정구역 개편으로 비어 있던 지역 정보 37만 건을 복구하고, 좌표가 없던 거래 데이터에 지오코딩을 붙여 지도·군집화·반경 인프라 분석의 기반을 만들었습니다.",
        work: "PM\n데이터: 지역 결측 복구, 지오코딩\n모델: DNN(PyTorch) 회귀 모델 학습, 모델 학습 결과 보고서 작성\n속도: 페이지 집계를 사전계산 구조로 전환",
        solution: "결측 복구: 거래 데이터는 옛 지역코드(강원 42xxx·전북 45xxx), 매핑 자료는 특별자치도 전환 뒤의 새 코드(51xxx·52xxx)만 있어 시군구 377,521건이 비어 있음 → 옛 코드와 새 코드를 함께 담은 306행 매핑표를 직접 만들어 다시 병합\n지오코딩: 500만 행을 그대로 호출하지 않고 유니크 주소 42,950개로 줄여 호출, 100건마다 체크포인트 저장·이어하기·호출 한도 준수\n속도: 페이지를 열 때마다 500만 행을 불러와 집계하던 것을 사전계산 결과 로드와 Parquet 캐시(원본 742MB → 60.9MB)로 전환",
        result: "지역 결측 377,261건 복구(99.93%), 남은 260건은 군위군 대구 편입 때문임을 확인\n지오코딩 호출 500만 → 4.3만 회, 좌표 확보율 98.46%\n한계: 학습·평가를 행 단위 무작위로 나눠 같은 단지의 다른 거래가 양쪽에 섞임. 처음 보는 단지·미래 시점 성능은 검증하지 못함",
        role: "PM · 데이터 전처리 · 지오코딩 · DNN 회귀 모델 · 페이지 속도 개선",
        repo: "https://github.com/Somber-7/SKN29-2nd-3Team",
        tags: J(["Python", "PyTorch", "MySQL", "Streamlit", "Parquet"]),
        order: 2,
      },
      {
        title: "에너지 가격 변동의 모빌리티 시장 영향 분석",
        image: "/projects/energy.jpg",
        client: "1차 프로젝트 (3인 · 2일)",
        org: "SK네트웍스 Family AI 캠프",
        period: "2026.03",
        desc: "국산차 월별 등록 데이터와 전국 유가 변동의 상관관계를 분석했습니다. 유가 변동이 신차 등록에 반영되기까지 평균 3개월의 리드타임을 확인했고, 친환경차 수요는 유가보다 보조금·인프라 같은 정책 요인과 더 관련이 있다는 점을 확인했습니다.",
        work: "PM\n현대·기아·제네시스·KGM FAQ 크롤러 4종 작성\nDB 설계 · 등록 통계·유가 데이터 적재\n산출물 취합",
        solution: "수집: Selenium + BeautifulSoup으로 현대·기아·제네시스·KGM FAQ 크롤러 4종 단독 구현. 버튼 class·display로 마지막 페이지 판정, 탭·페이지 그룹 순회, 아코디언 클릭 후 부분 파싱으로 브랜드마다 다른 화면 구조에 대응해 약 740건 적재\nDB: 공통코드 테이블과 FK로 연료·차종·용도·지역을 정규화한 스키마 설계, ERD와 테이블 명세서 작성\n적재: 62개월치 등록 통계·유가 엑셀의 병합 셀·소계 행·'-' 값을 정제하고, 1000건 단위 upsert로 다시 돌려도 안전하게 적재\n연동: 하드코딩돼 있던 Streamlit FAQ 페이지를 DB 조회로 바꾸고 브랜드별 카테고리 필터·키워드 검색·페이지네이션 구현",
        result: "팀 분석: 유가가 신차 등록에 반영되기까지 평균 3개월 리드타임 확인\n팀 분석: 친환경차 수요는 유가보다 보조금·인프라 같은 정책 요인과 더 관련이 있음을 확인",
        role: "PM · 크롤러 개발 · 산출물 취합",
        repo: "https://github.com/SKNETWORKS-FAMILY-AICAMP/SKN29-1st-6team",
        tags: J(["Python", "MySQL", "Streamlit", "Plotly"]),
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
