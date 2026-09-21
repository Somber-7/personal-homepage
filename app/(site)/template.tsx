// 페이지를 옮길 때마다 새로 마운트되어 페이드 인 된다
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
