import logoWhite from "@/assets/logo-white.png";
import authIllustration from "@/assets/auth-illustration.jpg";
import { ShieldCheck, Headphones, BarChart3, CloudCog } from "lucide-react";

const features = [
  { icon: CloudCog, title: "مزامنة فورية", desc: "في جميع أجهزتك" },
  { icon: BarChart3, title: "إدارة سهلة", desc: "لوحة متكاملة" },
  { icon: Headphones, title: "دعم مستمر", desc: "على مدار الساعة" },
  { icon: ShieldCheck, title: "أمان عالي", desc: "حماية بياناتك" },
];

export function AuthHero() {
  return (
    <div dir="rtl" className="relative flex flex-col justify-between overflow-hidden p-6 text-white sm:p-10" style={{ background: "linear-gradient(135deg, #5482AE 0%, #1E5B94 100%)" }}>
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex justify-start">
        <img src={logoWhite} alt="سابا ديزاين" className="h-20 w-auto opacity-95" />
      </div>

      <div className="relative mt-6 text-right">
        <h2 className="text-3xl font-extrabold leading-tight">
          مرحباً بك في <span className="whitespace-nowrap">SABA DESIGN</span>
        </h2>
        <div className="my-3 h-0.5 w-16 rounded-full bg-white/60 ms-auto" />
        <p className="text-sm leading-7 text-white/80">
          سجّل دخولك للوصول إلى لوحة التحكم وإدارة مشاريعك بسهولة
        </p>
      </div>

      <div className="relative my-6 flex justify-center">
        <div className="overflow-hidden rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
          <img src={authIllustration} alt="" className="h-96 w-96 object-cover" />
        </div>
      </div>

      <div className="relative grid grid-cols-4 gap-3">
        {features.map((f) => (
          <div key={f.title} className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <f.icon className="h-4 w-4" />
            </div>
            <div className="text-[11px] font-bold">{f.title}</div>
            <div className="text-[10px] text-white/70">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}