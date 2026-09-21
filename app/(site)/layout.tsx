import ScrollProgress from "../components/ScrollProgress";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import FullPage from "../components/FullPage";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FullPage />
    </>
  );
}
