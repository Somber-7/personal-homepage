"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// 한 번 스크롤하면 한 화면([data-screen])씩 넘어간다.
// - 화면 하나가 창보다 길면 그 화면 안에서는 보통처럼 스크롤하고, 끝에 닿은 뒤 다음 화면으로 넘어간다
// - 좁은 창·낮은 창·움직임 줄이기 설정에서는 꺼지고 보통 스크롤이 된다
// - 켜져 있을 때만 html에 fp 클래스를 달아, 화면 높이 레이아웃(globals.css의 .fp .screen)을 적용한다
const ENABLE_QUERY = "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";
const EDGE = 2; // 경계 판정 여유(px)
const QUIET = 200; // 도착 후 이만큼 입력이 없으면 잠금 해제(ms)

type Screen = { el: HTMLElement; label: string };

export default function FullPage() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [active, setActive] = useState(0);
  // 이동 중 잠금: 목표에 도착하고, 휠 입력이 잠시(QUIET) 멈춰야 풀린다. 트랙패드 관성은 계속 입력이 들어와 잠긴 채로 흘려보낸다
  const lock = useRef<{ target: number; until: number; lastInput: number } | null>(null);

  // 켜고 끄기
  useEffect(() => {
    const mq = window.matchMedia(ENABLE_QUERY);
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // 화면이 2개 이상인 페이지(지금은 홈)에서만 켠다
  const on = enabled && screens.length >= 2;
  useEffect(() => {
    document.documentElement.classList.toggle("fp", on);
    return () => document.documentElement.classList.remove("fp");
  }, [on]);

  // 페이지가 바뀌면 화면 목록과 연락처 높이를 다시 읽는다
  useEffect(() => {
    const read = () => {
      const els = [...document.querySelectorAll<HTMLElement>("[data-screen]")];
      setScreens(els.map((el) => ({ el, label: el.dataset.screen || "" })));
      const footer = document.getElementById("contact");
      if (footer) document.documentElement.style.setProperty("--footer-h", `${footer.offsetHeight}px`);
    };
    // effect 시점에는 DOM이 이미 그려져 있어 바로 읽는다(rAF는 탭이 그려지지 않을 때 멈출 수 있음)
    read();
    const t = window.setTimeout(read, 300); // 폰트 로딩 등으로 높이가 바뀐 뒤 한 번 더
    window.addEventListener("resize", read);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", read);
    };
  }, [pathname, enabled]);

  // 화면 i가 차지하는 구간: 자기 top ~ 다음 화면 top (마지막은 문서 끝, 연락처 포함)
  const range = (i: number) => {
    const top = screens[i].el.getBoundingClientRect().top + window.scrollY;
    const bottom = i + 1 < screens.length
      ? screens[i + 1].el.getBoundingClientRect().top + window.scrollY
      : document.documentElement.scrollHeight;
    return { top, bottom };
  };

  const currentIndex = () => {
    const y = window.scrollY + EDGE;
    let idx = 0;
    for (let i = 0; i < screens.length; i++) if (range(i).top <= y) idx = i;
    return idx;
  };

  // 현재 위치 점 갱신
  useEffect(() => {
    if (!screens.length) return;
    const onScroll = () => setActive(currentIndex());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screens]);

  const jumpTo = (i: number, alignBottom = false) => {
    if (i < 0 || i >= screens.length) return;
    const { top, bottom } = range(i);
    const tall = bottom - top > window.innerHeight;
    const target = Math.round(alignBottom && tall ? bottom - window.innerHeight : top);
    const now = performance.now();
    lock.current = { target, until: now + 1200, lastInput: now };
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  // 한 칸 이동: 긴 화면이면 그 안에서 먼저 스크롤, 끝에 닿으면 다음 화면
  const step = (dir: 1 | -1, amount: number) => {
    const i = currentIndex();
    const { top, bottom } = range(i);
    const viewTop = window.scrollY;
    const viewBottom = viewTop + window.innerHeight;
    if (dir > 0 && bottom - viewBottom > EDGE) {
      window.scrollTo({ top: Math.min(viewTop + amount, bottom - window.innerHeight), behavior: "instant" as ScrollBehavior });
      return;
    }
    if (dir < 0 && viewTop - top > EDGE) {
      window.scrollTo({ top: Math.max(viewTop - amount, top), behavior: "instant" as ScrollBehavior });
      return;
    }
    jumpTo(i + dir, dir < 0);
  };

  // 휠 · 키보드
  useEffect(() => {
    if (!on) return;

    const locked = (now: number) => {
      const l = lock.current;
      if (!l) return false;
      const arrived = Math.abs(window.scrollY - l.target) < 2 || now > l.until;
      if (arrived && now - l.lastInput > QUIET) lock.current = null;
      return lock.current !== null;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // 확대·가로 스크롤은 그대로
      e.preventDefault();
      const now = performance.now();
      if (locked(now)) {
        if (lock.current) lock.current.lastInput = now;
        return;
      }
      const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (Math.abs(px) < 4) return;
      step(px > 0 ? 1 : -1, Math.min(Math.abs(px), window.innerHeight * 0.8));
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const down = e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      e.preventDefault();
      if (locked(performance.now())) return;
      step(down ? 1 : -1, window.innerHeight * 0.85);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, screens]);

  if (!on) return null;

  return (
    <nav aria-label="화면 이동" className="fp-dots">
      {screens.map((s, i) => (
        <button
          key={i}
          type="button"
          aria-label={s.label}
          aria-current={i === active ? "true" : undefined}
          className="fp-dot"
          data-active={i === active || undefined}
          onClick={() => jumpTo(i)}
        >
          <span className="fp-dot-label">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
