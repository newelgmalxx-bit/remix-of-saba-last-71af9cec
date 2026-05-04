import { Phone, Mail, MessageCircle, MapPin, Clock, Instagram, Twitter, Linkedin, Facebook, Clock3 } from "lucide-react";

export function ContactSection() {
  return (
    <section className="bg-background pb-24 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            ✦ تواصل معنا
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">
            لنبدأ <span className="text-primary">مشروعك القادم</span> سوياً
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            أخبرنا عن فكرتك وسنعود إليك بخطة عمل واضحة وعرض سعر مفصّل خلال 24 ساعة.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <form className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">أرسل لنا رسالة</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                <Clock3 className="h-3 w-3" /> رد خلال 24 ساعة
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="الاسم الكامل" placeholder="مثال: محمد العتيبي" required />
              <Field label="رقم الجوال" placeholder="+966 5x xxx xxxx" required />
              <div className="sm:col-span-2">
                <Field label="البريد الإلكتروني" type="email" placeholder="name@example.com" required />
              </div>
              <Select label="نوع الخدمة" options={["اختر الخدمة", "تصميم موقع", "تطبيق جوال", "متجر إلكتروني", "هوية بصرية"]} required />
              <Select label="الميزانية المتوقعة" options={["اختر النطاق", "أقل من 10,000 ر.س", "10,000 - 30,000 ر.س", "30,000 - 80,000 ر.س", "أكثر من 80,000 ر.س"]} required />
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold text-foreground">
                  تفاصيل المشروع <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="أخبرنا عن مشروعك، أهدافه، والميزات التي تحتاجها..."
                  className="w-full resize-none rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-dark"
              >
                إرسال الطلب
              </button>
              <span className="text-xs text-muted-foreground">
                بإرسال النموذج أنت توافق على{" "}
                <a href="#" className="text-primary underline-offset-2 hover:underline">سياسة الخصوصية</a>
              </span>
            </div>
          </form>

          {/* Info card */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-primary to-primary-dark p-7 text-white shadow-md lg:col-span-2">
            <h3 className="text-xl font-bold">معلومات التواصل</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              نحن هنا للإجابة على جميع استفساراتك. تواصل معنا عبر أي من القنوات التالية.
            </p>

            <ul className="mt-6 space-y-4">
              <InfoRow icon={Phone} label="اتصل بنا" value="+966 50 123 4567" />
              <InfoRow icon={Mail} label="راسلنا" value="info@sabadesign.com" />
              <InfoRow icon={MessageCircle} label="واتساب" value="+966 50 123 4567" />
              <InfoRow icon={MapPin} label="موقعنا" value="الرياض، المملكة العربية السعودية" />
            </ul>

            <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[11px] text-white/70">ساعات العمل</div>
                  <div className="text-sm font-semibold">السبت - الخميس: 9:00 ص - 6:00 م</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[11px] text-white/70">تابعنا على</p>
              <div className="mt-3 flex items-center gap-2">
                {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", placeholder, required }: { label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function Select({ label, options, required }: { label: string; options: string[]; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <select className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] text-white/65">{label}</div>
        <div className="truncate text-sm font-semibold">{value}</div>
      </div>
    </li>
  );
}
