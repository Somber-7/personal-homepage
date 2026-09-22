// 자주 바뀌지 않는 인적 사항. 관리자 화면에서 고치지 않고 여기서 고친다.
export const PROFILE = {
  name: "임준",
  title: "웹 백엔드 개발자",
  summary: "공공 SI · 웹에이전시 백엔드 실무, LLM · 에이전트 서비스 개발",
  email: "true_j@naver.com",
  github: "https://github.com/Somber-7",
  // 경력기술서 PDF. D:\SKN_AI_Bootcamp\포트폴리오\경력기술서_임준.pdf를 다시 만들면 public/에도 복사한다
  pdf: "/career-imjun.pdf",
  pdfName: "경력기술서_임준.pdf",
};

export const STATS = [
  { value: "5년 4개월", label: "웹 개발 경력", sub: "공공 SI · 웹에이전시" },
  { value: "7종", label: "한전 시스템 상시 유지보수", sub: "그룹웨어 · VPN, 4년" },
  { value: "200개 이상", label: "구축 · 유지보수 사이트", sub: "웹에이전시 프로그램파트" },
  { value: "최우수상", label: "AI 캠프 최종 프로젝트", sub: "halil · 7주 · 5명" },
];

export const STRENGTHS = [
  { title: "백엔드 · 운영", desc: "화면과 API부터 Linux 서버, DB, 외부 연동, 장애 대응까지" },
  { title: "적응력", desc: "한전 그룹웨어 등 7종 상시 유지보수, 에이전시 200개 이상 사이트" },
  { title: "AI 확장 · 리드", desc: "LLM · RAG · 에이전트 서비스 구현, 팀 프로젝트 5회 PM" },
];

export const AWARDS = [
  { year: "2026", name: "최우수상", org: "SK네트웍스 Family AI 캠프 기업참여 프로젝트" },
];

export const ACTIVITIES = [
  { year: "2026", name: "제8회 K-디지털 트레이닝 해커톤", org: "6인 팀원으로 참가 · 예선" },
];
