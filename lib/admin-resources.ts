// 관리자 화면에서 다루는 항목별 설정. 목록(표)·수정 페이지가 함께 쓴다. 저장은 기존 /api/admin/* API로 한다.
export type FieldKind = "text" | "textarea" | "list" | "number" | "checkbox";

export type Field = {
  name: string;
  label: string;
  kind?: FieldKind; // 기본 text. list는 쉼표로 나눠 배열로 저장
  hint?: string;
  wide?: boolean; // 두 칸 너비
  rows?: number;
};

export type Resource = { label: string; api: string; fields: Field[] };

const BULLET_HINT = "한 줄에 하나씩. \"라벨: 내용\"으로 쓰면 라벨이 굵게 나온다";

export const RESOURCES = {
  experiences: {
    label: "경력",
    api: "/api/admin/experiences",
    fields: [
      { name: "company", label: "회사명" },
      { name: "role", label: "직책 · 역할" },
      { name: "period", label: "기간", hint: "예: 2020.01 ~ 2024.02" },
      { name: "duration", label: "근무 기간", hint: "예: 4년 2개월" },
      { name: "tags", label: "기술 태그", kind: "list", hint: "쉼표로 구분" },
      { name: "order", label: "순서", kind: "number" },
      { name: "desc", label: "업무 내용", kind: "textarea", wide: true, rows: 6, hint: BULLET_HINT },
      { name: "isCurrent", label: "현재 재직 중", kind: "checkbox" },
    ],
  },
  educations: {
    label: "교육",
    api: "/api/admin/educations",
    fields: [
      { name: "name", label: "기관명" },
      { name: "course", label: "과정" },
      { name: "period", label: "기간", hint: "예: 2026.03 ~ 2026.09" },
      { name: "duration", label: "기간 요약", hint: "예: 6개월, 졸업" },
      { name: "tags", label: "기술 태그", kind: "list", hint: "쉼표로 구분 · 비워도 됨" },
      { name: "order", label: "순서", kind: "number" },
      { name: "desc", label: "내용", kind: "textarea", wide: true, rows: 4, hint: `${BULLET_HINT} · 비워도 됨` },
    ],
  },
  projects: {
    label: "프로젝트",
    api: "/api/admin/projects",
    fields: [
      { name: "title", label: "프로젝트명", wide: true },
      { name: "org", label: "소속", hint: "같은 값끼리 프로젝트 페이지에서 묶인다" },
      { name: "client", label: "구분", hint: "예: 한국전력공사 (6인)" },
      { name: "period", label: "기간", hint: "모르면 비워 둔다" },
      { name: "role", label: "역할" },
      { name: "link", label: "사이트 주소", hint: "비우면 '사이트 방문' 버튼 없음" },
      { name: "order", label: "순서", kind: "number" },
      { name: "image", label: "대표 이미지 경로", wide: true, hint: "예: /projects/halil.jpg · 비우면 기본 헤더" },
      { name: "tags", label: "기술 태그", kind: "list", wide: true, hint: "쉼표로 구분" },
      { name: "desc", label: "개요", kind: "textarea", wide: true, rows: 4 },
      { name: "work", label: "맡은 일", kind: "textarea", wide: true, rows: 5, hint: `${BULLET_HINT} · 비운 칸은 상세 페이지에 나오지 않는다` },
      { name: "solution", label: "구현과 문제 해결", kind: "textarea", wide: true, rows: 6, hint: BULLET_HINT },
      { name: "result", label: "결과", kind: "textarea", wide: true, rows: 4, hint: BULLET_HINT },
    ],
  },
  skills: {
    label: "기술 스택",
    api: "/api/admin/skills",
    fields: [
      { name: "category", label: "분야" },
      { name: "order", label: "순서", kind: "number" },
      { name: "items", label: "항목", kind: "list", wide: true, hint: "쉼표로 구분" },
      { name: "isLearning", label: "학습 중", kind: "checkbox" },
    ],
  },
  certifications: {
    label: "자격증",
    api: "/api/admin/certifications",
    fields: [
      { name: "name", label: "자격증명" },
      { name: "org", label: "발급 기관" },
      { name: "year", label: "취득 시기", hint: "예: 2019.11" },
      { name: "order", label: "순서", kind: "number" },
    ],
  },
} satisfies Record<string, Resource>;

export type ResourceKey = keyof typeof RESOURCES;

export function isResourceKey(key: string): key is ResourceKey {
  return key in RESOURCES;
}

// DB 한 행 → 입력 칸 값 (list는 JSON 문자열을 쉼표 문자열로)
export type FormValues = Record<string, string | boolean>;

export function toFormValues(key: ResourceKey, row: Record<string, unknown> | null): FormValues {
  const values: FormValues = {};
  for (const f of RESOURCES[key].fields as Field[]) {
    const v = row?.[f.name];
    if (f.kind === "checkbox") values[f.name] = Boolean(v);
    else if (f.kind === "list") values[f.name] = typeof v === "string" && v ? (JSON.parse(v) as string[]).join(", ") : "";
    else values[f.name] = v == null ? "" : String(v);
  }
  return values;
}
