import Reveal from "./Reveal";

// 모든 공개 페이지 하단에 붙는 연락처
export default function SiteFooter() {
  return (
    <footer id="contact" className="px-6 pt-20 pb-8" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <span className="text-xs font-mono tracking-widest" style={{ color: "var(--accent)" }}>CONTACT ──</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: "var(--foreground)" }}>연락처</h2>
          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>새로운 기회나 협업 제안을 환영합니다.</p>
        </Reveal>
        <Reveal delay={120} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:true_j@naver.com"
            className="card-lift flex items-center justify-center gap-3 px-6 py-4 rounded-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ color: "var(--accent)" }}>
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-mono" style={{ color: "var(--foreground)" }}>true_j@naver.com</span>
          </a>
          <a
            href="tel:010-5024-7939"
            className="card-lift flex items-center justify-center gap-3 px-6 py-4 rounded-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ color: "var(--accent)" }}>
              <path d="M3 4a1 1 0 011-1h2.5a1 1 0 01.97.757l.7 2.8a1 1 0 01-.274 1.002L6.6 8.6a11.04 11.04 0 004.8 4.8l1.04-1.296a1 1 0 011.003-.274l2.8.7A1 1 0 0117 13.5V16a1 1 0 01-1 1h-1C7.163 17 3 12.837 3 8V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-mono" style={{ color: "var(--foreground)" }}>010-5024-7939</span>
          </a>
        </Reveal>
        <p className="mt-16 text-xs font-mono" style={{ color: "var(--muted)" }}>
          © 2026 임준 · Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
