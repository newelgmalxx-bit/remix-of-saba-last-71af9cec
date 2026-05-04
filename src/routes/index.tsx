import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { StatsBanner } from "@/components/sections/StatsBanner";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ContactSection } from "@/components/sections/ContactSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سابا ديزاين | تجارب رقمية تترك أثراً يدوم" },
      {
        name: "description",
        content:
          "وكالة سابا ديزاين الرقمية - تصميم وتطوير المواقع، تطبيقات الجوال، المتاجر الإلكترونية، الهوية البصرية والتسويق الرقمي.",
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
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
