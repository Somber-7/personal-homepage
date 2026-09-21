import { PROFILE } from "@/lib/profile";

// 모든 공개 페이지 하단에 붙는 연락처
export default function SiteFooter() {
  const links = [
    { href: `mailto:${PROFILE.email}`, label: "이메일", value: PROFILE.email },
    { href: `tel:${PROFILE.phone}`, label: "전화", value: PROFILE.phone },
    { href: PROFILE.github, label: "GitHub", value: PROFILE.github.replace("https://", "") },
    { href: PROFILE.pdf, label: "경력기술서", value: "PDF 받기" },
  ];
  return (
    <footer id="contact" className="px-6 pt-20 pb-10" style={{ background: "var(--foreground)", color: "var(--background)" }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">연락처</h2>
        <dl className="mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-6 sm:gap-x-14">
          {links.map((l) => (
            <div key={l.href}>
              <dt className="text-sm" style={{ color: "#a8a8a2" }}>{l.label}</dt>
              <dd className="mt-1">
                <a
                  href={l.href}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(l.href === PROFILE.pdf ? { download: PROFILE.pdfName } : {})}
                  className="text-xl underline decoration-1 underline-offset-4 transition-colors hover:text-[#f0a37a]" style={{ textDecorationColor: "#62625d" }}>
                  {l.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-16 text-xs" style={{ color: "#8a8a84" }}>
          © 2026 임준
        </p>
      </div>
    </footer>
  );
}
