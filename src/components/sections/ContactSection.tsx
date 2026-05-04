import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export function ContactSection() {
  return (
    <section className="bg-background pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            تواصل معنا
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            لنبدأ <span className="text-primary">مشروعك القادم</span> سوياً
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <form className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h3 className="text-lg font-bold text-foreground">أرسل لنا رسالة</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="الاسم الكامل" placeholder="أدخل اسمك" />
              <Field label="البريد الإلكتروني" type="email" placeholder="email@example.com" />
              <Field label="رقم الهاتف" placeholder="+966 5x xxx xxxx" />
              <Select label="نوع الخدمة" options={["تصميم موقع", "تطبيق جوال", "متجر إلكتروني", "هوية بصرية", "أخرى"]} />
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold text-foreground">رسالتك</label>
                <textarea
                  rows={5}
                  placeholder="اكتب تفاصيل مشروعك..."
                  className="w-full resize-none rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-dark"
              >
                إرسال الطلب
              </button>
              <span className="text-xs text-muted-foreground">
                * بياناتك محمية ولن يتم مشاركتها
              </span>
            </div>
          </form>

          {/* Info card */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-primary to-primary-dark p-7 text-white shadow-md">
            <h3 className="text-lg font-bold">معلومات التواصل</h3>
            <ul className="mt-6 space-y-5 text-sm">
              <InfoRow icon={Phone} label="اتصل بنا" value="+966 50 000 0000" />
              <InfoRow icon={Mail} label="راسلنا" value="info@sabadesign.sa" />
              <InfoRow icon={MapPin} label="موقعنا" value="الرياض، المملكة العربية السعودية" />
              <InfoRow icon={Clock} label="ساعات العمل" value="الأحد - الخميس: 9ص - 6م" />
            </ul>

            <div className="mt-8 border-t border-white/15 pt-5">
              <p className="text-xs text-white/75">تابعنا على وسائل التواصل</p>
              <div className="mt-3 flex items-center gap-2">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
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

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-foreground">{label}</label>
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
      <div>
        <div className="text-[11px] text-white/65">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </li>
  );
}