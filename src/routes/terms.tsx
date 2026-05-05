import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FileText, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام | سابا ديزاين" },
      { name: "description", content: "الشروط والأحكام التي تحكم استخدامك خدمات سابا ديزاين." },
      { property: "og:title", content: "الشروط والأحكام | سابا ديزاين" },
      { property: "og:description", content: "اطلع على شروط وأحكام استخدام خدمات سابا ديزاين." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-l from-primary-dark via-primary to-primary-dark text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
              <FileText className="h-3.5 w-3.5" /> شروط الاستخدام
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">الشروط والأحكام</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">
              الشروط والأحكام التي تحكم استخدامك للموقع وخدماتنا الرقمية.
            </p>
            <p className="mt-2 text-[11px] text-white/70">آخر تحديث: مايو 2026</p>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 rounded-3xl border border-border/60 bg-white p-8 text-right shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-10">
              <Section title="1. قبول الشروط">
                باستخدامك لموقع سابا ديزاين أو طلب أي من خدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق عليها، يُرجى عدم استخدام الموقع.
              </Section>
              <Section title="2. الخدمات">
                نقدّم خدمات تصميم وتطوير رقمية تشمل تصميم المواقع والتطبيقات والهوية البصرية والحملات الإعلانية. تفاصيل كل خدمة موضّحة في صفحاتها على الموقع.
              </Section>
              <Section title="3. الطلبات والدفع">
                يبدأ تنفيذ الخدمة بعد تأكيد الطلب وسداد المبلغ المطلوب وفقاً للباقة المختارة. الأسعار شاملة ضريبة القيمة المضافة ما لم يُذكر خلاف ذلك.
              </Section>
              <Section title="4. التسليم والتعديلات">
                يتم التسليم خلال المدة المحددة في كل باقة. تشمل كل باقة عدداً محدداً من جولات التعديل، وأي تعديل إضافي قد يخضع لرسوم.
              </Section>
              <Section title="5. سياسة الاسترجاع">
                يحق للعميل طلب استرجاع المبلغ خلال 7 أيام من تأكيد الطلب وقبل بدء التنفيذ الفعلي. بعد البدء يتم احتساب نسبة من المبلغ تتناسب مع ما تم تنفيذه.
              </Section>
              <Section title="6. حقوق الملكية الفكرية">
                جميع المحتويات والشعارات والتصاميم المعروضة على الموقع مملوكة لسابا ديزاين. تنتقل حقوق الاستخدام للمنتجات المسلَّمة للعميل بعد سداد كامل المستحقات.
              </Section>
              <Section title="7. التزامات العميل">
                يلتزم العميل بتقديم المعلومات والملفات المطلوبة لتنفيذ الخدمة في الوقت المناسب، وعدم استخدام المخرجات بشكل يخالف القوانين أو الأخلاقيات.
              </Section>
              <Section title="8. حدود المسؤولية">
                لا نتحمل أي مسؤولية عن أضرار غير مباشرة أو خسائر ناتجة عن سوء استخدام الخدمات أو عوامل خارجة عن إرادتنا.
              </Section>
              <Section title="9. تعديل الشروط">
                نحتفظ بحق تعديل هذه الشروط في أي وقت، ويسري التعديل فور نشره على هذه الصفحة.
              </Section>
              <Section title="10. القانون المعمول به">
                تخضع هذه الشروط وتفسَّر وفقاً لأنظمة المملكة العربية السعودية، وتختص محاكمها بالنظر في أي نزاع ينشأ عنها.
              </Section>

              <div className="mt-2 flex justify-end">
                <Link to={"/privacy" as any} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  سياسة الخصوصية <ChevronLeft className="h-3 w-3" />
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
