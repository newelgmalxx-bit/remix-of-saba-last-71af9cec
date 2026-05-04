import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Sun, Moon, Monitor, PanelLeft, PanelTop, PanelRight } from "lucide-react";

export const Route = createFileRoute("/admin/settings/appearance")({
  head: () => ({ meta: [{ title: "المظهر | الإعدادات" }] }),
  component: AppearancePage,
});

function AppearancePage() {
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("#1E5B94");
  const [nav, setNav] = useState("right");
  const [dir, setDir] = useState("rtl");

  const accents = ["#1E5B94", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#eab308"];

  return (
    <AdminLayout title="الإعدادات" subtitle="إدارة حسابك وتفضيلاتك">
      <PanelCard title="المظهر" subtitle="تخصيص شكل وأسلوب لوحة التحكم">
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-bold mb-3">السمة</h4>
            <div className="grid grid-cols-3 gap-3">
              {[["light", "فاتح", Sun], ["dark", "داكن", Moon], ["system", "النظام", Monitor]].map(([k, l, I]: any) => (
                <button key={k} onClick={() => setTheme(k)} className={`rounded-2xl border-2 p-4 transition ${theme === k ? "border-primary bg-primary/5" : "border-border"}`}>
                  <I className="h-8 w-8 mx-auto mb-2 text-foreground/70" />
                  <div className="text-sm font-bold">{l}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">اللون المميز</h4>
            <div className="flex flex-wrap gap-3">
              {accents.map(c => (
                <button key={c} onClick={() => setAccent(c)} className={`h-12 w-12 rounded-full transition ${accent === c ? "ring-4 ring-offset-2 ring-primary/40" : ""}`} style={{ background: c }} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">موضع التنقل</h4>
            <div className="grid grid-cols-3 gap-3">
              {[["right", "شريط جانبي يمين", PanelRight], ["top", "شريط علوي", PanelTop], ["left", "شريط جانبي يسار", PanelLeft]].map(([k, l, I]: any) => (
                <button key={k} onClick={() => setNav(k)} className={`rounded-2xl border-2 p-4 transition ${nav === k ? "border-primary bg-primary/5" : "border-border"}`}>
                  <I className="h-8 w-8 mx-auto mb-2 text-foreground/70" />
                  <div className="text-sm font-bold">{l}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">اتجاه الموقع</h4>
            <div className="grid grid-cols-2 gap-3">
              {[["rtl", "عربي (RTL)"], ["ltr", "English (LTR)"]].map(([k, l]) => (
                <button key={k} onClick={() => setDir(k)} className={`rounded-2xl border-2 p-4 text-center transition ${dir === k ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="text-sm font-bold">{l}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}