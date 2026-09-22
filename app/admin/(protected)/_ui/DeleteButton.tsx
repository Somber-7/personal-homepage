"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// 목록 표의 삭제 버튼. 확인 후 지우고 표를 다시 읽는다
export default function DeleteButton({ api, id, name }: { api: string; id: number; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`'${name}'을(를) 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusy(true);
    const res = await fetch(`${api}/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      alert(`삭제하지 못했습니다 (${res.status})`);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      className="px-2.5 py-1 rounded text-xs disabled:opacity-60"
      style={{ border: "1px solid #e8c4c0", color: "#b42318" }}
    >
      삭제
    </button>
  );
}
