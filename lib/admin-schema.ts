import { z } from "zod";
import { RESOURCES, type Field, type ResourceKey } from "@/lib/admin-resources";

z.config(z.locales.ko()); // 기본 오류 문구를 한국어로

// 관리자 API 입력 검증. 입력 칸 설정(admin-resources.ts)에서 스키마를 만들어, 칸을 추가해도 검증이 따라온다.
const URL_FIELDS = new Set(["link", "repo"]);
const httpUrl = z.string().trim().max(500).refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "http(s) 주소가 아닙니다");
const imagePath = z.string().trim().max(500).refine((v) => v === "" || /^(\/|https?:\/\/)\S+$/.test(v), "/ 로 시작하는 경로나 http(s) 주소가 아닙니다");

function fieldSchema(f: Field) {
  if (f.kind === "checkbox") return z.boolean();
  if (f.kind === "number") return z.number().int().min(0).max(100_000);
  if (f.kind === "list") return z.array(z.string().trim().min(1).max(100)).max(50);
  if (f.name === "image") return imagePath;
  if (URL_FIELDS.has(f.name)) return httpUrl;
  const text = z.string().trim().max(f.kind === "textarea" ? 10_000 : 300);
  return f.required ? text.min(1, `${f.label}을(를) 입력하세요`) : text;
}

export function schemaFor(key: ResourceKey) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of RESOURCES[key].fields as Field[]) shape[f.name] = fieldSchema(f);
  return z.object(shape).strict(); // 설정에 없는 칸이 오면 거부
}

// 검증을 통과한 값 → DB에 넣을 값 (목록은 JSON 문자열, 빈 주소는 null)
export function toDbData(key: ResourceKey, input: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const f of RESOURCES[key].fields as Field[]) {
    const v = input[f.name];
    if (f.kind === "list") data[f.name] = JSON.stringify(v);
    else if (f.name === "image" || URL_FIELDS.has(f.name)) data[f.name] = v === "" ? null : v;
    else data[f.name] = v;
  }
  return data;
}

// 경로의 id: 양의 정수만 받는다
export function parseId(raw: string): number | null {
  return /^[1-9]\d{0,9}$/.test(raw) ? Number(raw) : null;
}
