import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { StatsBanner } from "@/components/sections/StatsBanner";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { buildSeo, organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from "@/lib/seo";

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
        <ServicesGrid />
        <PortfolioSection />
        <StatsBanner />
        <WhyUsSection />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}

