import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ShieldCheck, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | سابا ديزاين" },
      { name: "description", content: "سياسة الخصوصية الخاصة بسابا ديزاين — كيف نجمع بياناتك ونستخدمها ونحميها." },
      { property: "og:title", content: "سياسة الخصوصية | سابا ديزاين" },
      { property: "og:description", content: "كيف نتعامل مع بياناتك في سابا ديزاين." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-l from-primary-dark via-primary to-primary-dark text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" /> خصوصيتك مسؤوليتنا
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">سياسة الخصوصية</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">
              نوضّح لك كيف نجمع بياناتك ونستخدمها ونحميها عند استخدامك خدمات سابا ديزاين.
            </p>
            <p className="mt-2 text-[11px] text-white/70">آخر تحديث: مايو 2026</p>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 rounded-3xl border border-border/60 bg-white p-8 text-right shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-10">
              <Section title="1. المعلومات التي نجمعها">
                نجمع المعلومات التي تقدّمها لنا مباشرة عند إنشاء حساب أو طلب خدمة أو التواصل معنا، مثل: الاسم، البريد الإلكتروني، رقم الجوال، تفاصيل الطلب، ومعلومات الدفع.
                كما نجمع تلقائياً بعض البيانات التقنية كعنوان IP ونوع المتصفح والصفحات التي تمت زيارتها لتحسين تجربتك.
              </Section>
              <Section title="2. كيف نستخدم معلوماتك">
                نستخدم بياناتك لتقديم الخدمات وإتمام الطلبات، التواصل معك بشأن طلباتك، تحسين منصّتنا، إرسال إشعارات أو عروض ترويجية (يمكنك إيقافها في أي وقت)، والامتثال للالتزامات القانونية.
              </Section>
              <Section title="3. مشاركة المعلومات">
                لا نبيع بياناتك لأي طرف ثالث. قد نشارك بعض البيانات مع مزوّدي خدمات موثوقين (مثل بوابات الدفع وخدمات الاستضافة) فقط بالقدر اللازم لتشغيل الخدمة، أو عندما يلزمنا القانون بذلك.
              </Section>
              <Section title="4. ملفات تعريف الارتباط (Cookies)">
                نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل الاستخدام. يمكنك التحكم بها من إعدادات متصفحك.
              </Section>
              <Section title="5. حماية البيانات">
                نطبّق إجراءات تقنية وتنظيمية لحماية بياناتك من الوصول غير المصرّح به أو الفقد أو التعديل، بما في ذلك التشفير والمراقبة الدورية.
              </Section>
              <Section title="6. حقوقك">
                لك الحق في الوصول إلى بياناتك، تصحيحها، حذفها، أو الاعتراض على معالجتها. لممارسة أي من هذه الحقوق تواصل معنا عبر البريد:
                <a href="mailto:info@sabadesign.com" className="mx-1 font-bold text-primary hover:underline" dir="ltr">info@sabadesign.com</a>.
              </Section>
              <Section title="7. الاحتفاظ بالبيانات">
                نحتفظ ببياناتك للمدة اللازمة لتحقيق الأغراض الموضّحة في هذه السياسة أو وفقاً لما يقتضيه القانون.
              </Section>
              <Section title="8. تعديلات السياسة">
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر أي تحديثات على هذه الصفحة مع تاريخ التعديل.
              </Section>
              <Section title="9. تواصل معنا">
                لأي استفسار يخص الخصوصية، يرجى التواصل عبر صفحة <Link to={"/contact" as any} className="font-bold text-primary hover:underline">تواصل معنا</Link>.
              </Section>

              <div className="mt-2 flex justify-end">
                <Link to={"/terms" as any} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  الشروط والأحكام <ChevronLeft className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-lg font-extrabold text-foreground">{title}</h2>
      <p className="text-sm leading-8 text-foreground/75">{children}</p>
    </div>
  );
}
