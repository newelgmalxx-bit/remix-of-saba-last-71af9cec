import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroSection } from "@/components/sections/HeroSection";
import { buildSeo, organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from "@/lib/seo-lite";

const ServicesGrid = lazy(() => import("@/components/sections/ServicesGrid").then((m) => ({ default: m.ServicesGrid })));
const PortfolioSection = lazy(() => import("@/components/sections/PortfolioSection").then((m) => ({ default: m.PortfolioSection })));
const StatsBanner = lazy(() => import("@/components/sections/StatsBanner").then((m) => ({ default: m.StatsBanner })));
const WhyUsSection = lazy(() => import("@/components/sections/WhyUsSection").then((m) => ({ default: m.WhyUsSection })));
const CtaBanner = lazy(() => import("@/components/sections/CtaBanner").then((m) => ({ default: m.CtaBanner })));
const SiteFooter = lazy(() => import("@/components/layout/SiteFooter").then((m) => ({ default: m.SiteFooter })));

export const Route = createFileRoute("/")({
  head: () => {
    const seo = buildSeo({
      title: "سابا ديزاين | تصميم وتطوير المواقع والتطبيقات في السعودية",
      description:
        "وكالة رقمية سعودية لتصميم المواقع، تطبيقات الجوال، الهوية البصرية، السيو والتسويق الرقمي — نصنع تجارب رقمية تترك أثراً.",
      keywords:
        "تصميم مواقع، تطوير مواقع، تصميم تطبيقات، متجر إلكتروني، هوية بصرية، تسويق رقمي، سيو، السعودية، الرياض، سابا ديزاين، web design Saudi Arabia",
      path: "/",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(organizationJsonLd()) },
        { type: "application/ld+json", children: JSON.stringify(websiteJsonLd()) },
        { type: "application/ld+json", children: JSON.stringify(localBusinessJsonLd()) },
      ],
    };
  },
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <DeferredHomeContent>
          <Suspense fallback={<div className="min-h-[420px] bg-background" />}>
            <ServicesGrid />
            <PortfolioSection />
            <StatsBanner />
            <WhyUsSection />
            <CtaBanner />
          </Suspense>
        </DeferredHomeContent>
      </main>
      <DeferredHomeContent minHeight="min-h-[360px]">
        <Suspense fallback={<div className="min-h-[360px] bg-primary-dark" />}>
          <SiteFooter />
        </Suspense>
      </DeferredHomeContent>
    </div>
  );
}

function DeferredHomeContent({ children, minHeight = "min-h-[520px]" }: { children: ReactNode; minHeight?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const reveal = () => setShow(true);
    window.addEventListener("scroll", reveal, { once: true, passive: true });
    window.addEventListener("pointerdown", reveal, { once: true, passive: true });
    window.addEventListener("keydown", reveal, { once: true });
    return () => {
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, [show]);

  return <div ref={ref} className={show ? undefined : minHeight}>{show ? children : null}</div>;
}

