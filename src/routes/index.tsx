import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { StatsBanner } from "@/components/sections/StatsBanner";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سابا ديزاين | وكالة تصميم وتطوير مواقع وتطبيقات في السعودية" },
      {
        name: "description",
        content:
          "سابا ديزاين وكالة رقمية سعودية متخصصة في تصميم وتطوير المواقع، تطبيقات الجوال، المتاجر الإلكترونية، الهوية البصرية، والتسويق الرقمي. نصنع تجارب رقمية تترك أثراً يدوم.",
      },
      { name: "keywords", content: "تصميم مواقع، تطوير مواقع، تصميم تطبيقات، متجر إلكتروني، هوية بصرية، تسويق رقمي، سيو، السعودية، الرياض، سابا ديزاين" },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "Arabic" },
      { name: "geo.region", content: "SA" },
      { name: "geo.placename", content: "Riyadh" },
      { property: "og:title", content: "سابا ديزاين | وكالة تصميم وتطوير مواقع وتطبيقات في السعودية" },
      { property: "og:description", content: "تجارب رقمية تترك أثراً يدوم — تصميم مواقع، تطبيقات، متاجر إلكترونية، هوية بصرية، وتسويق رقمي." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_SA" },
      { property: "og:url", content: "https://saba-desigin.lovable.app/" },
      { property: "og:site_name", content: "سابا ديزاين" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "سابا ديزاين | وكالة تصميم وتطوير مواقع وتطبيقات" },
      { name: "twitter:description", content: "تجارب رقمية تترك أثراً يدوم — تصميم، تطوير، تسويق رقمي." },
    ],
    links: [
      { rel: "canonical", href: "https://saba-desigin.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "سابا ديزاين",
          alternateName: "SABA DESIGN",
          url: "https://saba-desigin.lovable.app/",
          description: "وكالة رقمية سعودية لتصميم وتطوير المواقع والتطبيقات والهوية البصرية والتسويق الرقمي.",
          areaServed: "SA",
          sameAs: [],
        }),
      },
    ],
  }),
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
