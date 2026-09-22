import { RESOURCES, type Field, type ResourceKey } from "@/lib/admin-resources";

// 항목별로 검증을 통과하는 최소 입력값을 설정에서 만든다
export function validInput(key: ResourceKey): Record<string, unknown> {
  const input: Record<string, unknown> = {};
  for (const f of RESOURCES[key].fields as Field[]) {
    if (f.kind === "checkbox") input[f.name] = false;
    else if (f.kind === "number") input[f.name] = 1;
    else if (f.kind === "list") input[f.name] = ["PHP"];
    else if (f.required) input[f.name] = "이름";
    else input[f.name] = "";
  }
  return input;
}

export const RESOURCE_KEYS = Object.keys(RESOURCES) as ResourceKey[];
