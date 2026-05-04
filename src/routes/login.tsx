import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/login")({
  component: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold text-foreground">قيد الإنشاء</h1>
        <p className="mt-3 text-muted-foreground">سيتم بناء هذه الصفحة في المراحل التالية.</p>
      </main>
      <SiteFooter />
    </div>
  ),
});
