import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard } from "@/components/admin/AdminLayout";
import { CreditCard, Calendar, BarChart3, Facebook, Tag, Music, Link2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings/integrations")({
  head: () => ({ meta: [{ title: "التكاملات | الإعدادات" }] }),
  component: IntegrationsPage,
});

const items = [
  { icon: CreditCard, name: "Moyasar (ميسر)", desc: "بوابة الدفع الإلكتروني", connected: true },
  { icon: Calendar, name: "Tabby (تابي)", desc: "الدفع بالتقسيط", connected: true },
  { icon: Calendar, name: "Tamara (تمارا)", desc: "الدفع بالتقسيط", connected: false },
  { icon: BarChart3, name: "Google Analytics", desc: "تتبع الزيارات والتحليلات", connected: true },
  { icon: Facebook, name: "Facebook Pixel", desc: "تتبع الإعلانات والتحويلات", connected: false },
  { icon: Tag, name: "Google Tag Manager", desc: "إدارة أكواد التتبع", connected: false },
  { icon: Music, name: "TikTok Pixel", desc: "تتبع إعلانات تيك توك", connected: false },
  { icon: Link2, name: "Partner API", desc: "ربط مع شركة الشريك لتبادل الطلبات", connected: false },
];

function IntegrationsPage() {
  return (
    <AdminLayout title="الإعدادات" subtitle="إدارة التكاملات والربط الخارجي">
      <PanelCard title="التكاملات" subtitle="اربط أدواتك وخدماتك المفضلة">
        <div className="space-y-3">
          {items.map(it => {
            const I = it.icon;
            return (
              <div key={it.name} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><I className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">{it.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{it.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs">
                    <span className={`h-2 w-2 rounded-full ${it.connected ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                    {it.connected ? "متصل" : "غير متصل"}
                  </span>
                  <button className={`rounded-xl px-4 py-2 text-xs font-bold ${it.connected ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>إعداد</button>
                </div>
              </div>
            );
          })}
        </div>
      </PanelCard>
    </AdminLayout>
  );
}