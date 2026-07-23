import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { services as servicesApi } from "@/lib/api";
import {
  ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Check, Star, ShoppingCart, Zap, Truck, Clock, Award,
  MessageSquare, ScanSearch, Wrench, RefreshCw, ShieldCheck, Heart, Send, Smile, CreditCard, Wallet,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import servicesHero from "@/assets/services-hero.webp";
import tabbyLogo from "@/assets/tabby-logo.webp";
import tabbyHero from "@/assets/tabby-hero.webp";
import tamaraLogo from "@/assets/tamara-logo.webp";
import payApplePay from "@/assets/pay-applepay.png";
import payMastercard from "@/assets/pay-mastercard.webp";
import payMada from "@/assets/pay-mada.webp";
import payVisa from "@/assets/pay-visa-small.webp";
import { serviceMap } from "@/data/services";
import { useServiceContent } from "@/hooks/useServiceContent";
import { usePlans } from "@/hooks/usePlans";
import { useCart } from "@/hooks/useCart";
import { useFavorite } from "@/components/sections/ServicesGrid";
import { SarIcon } from "@/components/ui/SarIcon";
import { useServiceReviews } from "@/hooks/useServiceReviews";
import { useAllReviews } from "@/hooks/useAllReviews";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";
import { buildSeo, breadcrumbJsonLd, serviceJsonLd, SITE } from "@/lib/seo-lite";
import { serviceSeoMap } from "@/data/serviceSeo";

const workTabKeys: TKey[] = [
  "svcDetail.works.tab.all",
  "svcDetail.works.tab.design",
  "svcDetail.works.tab.dev",
  "svcDetail.works.tab.social",
  "svcDetail.works.tab.marketing",
];
const works: { tag: string; titleKey: TKey; img: string }[] = [
  { tag: "Web", titleKey: "svcDetail.work.1.t", img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&auto=format&fit=crop&q=80" },
  { tag: "Mobile", titleKey: "svcDetail.work.2.t", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80" },
  { tag: "UI/UX", titleKey: "svcDetail.work.3.t", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" },
  { tag: "Web", titleKey: "svcDetail.work.4.t", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80" },
  { tag: "Brand", titleKey: "svcDetail.work.5.t", img: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800&auto=format&fit=crop&q=80" },
  { tag: "Mobile", titleKey: "svcDetail.work.6.t", img: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=800&auto=format&fit=crop&q=80" },
];

function ServiceDetailPage() {
  const { t, dir, lang } = useLang();
  const { slug } = Route.useParams();
  const live = useServiceContent(slug);
  const [remoteDetail, setRemoteDetail] = useState<any>(null);
  const [tamaraOpen, setTamaraOpen] = useState(false);
  const [tabbyOpen, setTabbyOpen] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res: any = await servicesApi.detail(slug);
        const svc = res?.service ?? res?.data?.service ?? res;
        if (!cancelled && svc) setRemoteDetail(svc);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [slug]);
  const baseService = live ?? serviceMap[slug];
  const remoteOverview = lang === "en"
    ? (remoteDetail?.overviewDescriptionEn || remoteDetail?.overviewDescriptionAr)
    : (remoteDetail?.overviewDescriptionAr || remoteDetail?.overviewDescriptionEn);
  const service = baseService
    ? { ...baseService, overviewDescription: remoteOverview || baseService.overviewDescription }
    : baseService;
  const [tab, setTab] = useState<TKey>("svcDetail.works.tab.all");
  const [open, setOpen] = useState<number | null>(0);
  const filteredWorks = works;
  const { plans } = usePlans();
  const { add } = useCart();
  const navigate = useNavigate();
  const { fav, toggle: toggleFav } = useFavorite(slug);
  const { isAuthenticated } = useAuth();
  const { reviews, summary, addReview } = useServiceReviews(slug);
  const allReviews = useAllReviews();

  const startAlign = dir === "rtl" ? "text-right" : "text-left";
  const arrowFlip = dir === "ltr" ? "rotate-180" : "";

  const defaultSteps = [
    { n: 1, icon: MessageSquare, title: t("svcDetail.steps.s1") },
    { n: 2, icon: ScanSearch, title: t("svcDetail.steps.s2") },
    { n: 3, icon: Wrench, title: t("svcDetail.steps.s3") },
    { n: 4, icon: RefreshCw, title: t("svcDetail.steps.s4") },
    { n: 5, icon: ShieldCheck, title: t("svcDetail.steps.s5") },
  ];
  const defaultStats = [
    { v: t("svcDetail.stat.projects.v"), l: t("svcDetail.stat.projects.l") },
    { v: t("svcDetail.stat.satisfaction.v"), l: t("svcDetail.stat.satisfaction.l") },
    { v: t("svcDetail.stat.delivery.v"), l: t("svcDetail.stat.delivery.l") },
    { v: t("svcDetail.stat.clients.v"), l: t("svcDetail.stat.clients.l") },
  ];
  const defaultTestimonials = [
    { name: t("svcDetail.t1.name"), role: t("svcDetail.t1.role"), text: t("svcDetail.t1.text") },
    { name: t("svcDetail.t2.name"), role: t("svcDetail.t2.role"), text: t("svcDetail.t2.text") },
    { name: t("svcDetail.t3.name"), role: t("svcDetail.t3.role"), text: t("svcDetail.t3.text") },
    { name: t("svcDetail.t4.name"), role: t("svcDetail.t4.role"), text: t("svcDetail.t4.text") },
    { name: t("svcDetail.t5.name"), role: t("svcDetail.t5.role"), text: t("svcDetail.t5.text") },
    { name: t("svcDetail.t6.name"), role: t("svcDetail.t6.role"), text: t("svcDetail.t6.text") },
  ];
  const defaultFaqs = [
    { q: t("svcDetail.faq.1.q"), a: t("svcDetail.faq.1.a") },
    { q: t("svcDetail.faq.2.q"), a: t("svcDetail.faq.2.a") },
    { q: t("svcDetail.faq.3.q"), a: t("svcDetail.faq.3.a") },
    { q: t("svcDetail.faq.4.q"), a: t("svcDetail.faq.4.a") },
  ];

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-24 text-center">
            <h1 className="text-2xl font-extrabold text-foreground">{t("svcDetail.notFound.title")}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{t("svcDetail.notFound.desc")}</p>
            <Link to="/services" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white">
              {t("svcDetail.notFound.cta")} <ArrowLeft className={`h-4 w-4 ${arrowFlip}`} />
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { overview, benefits, title, subtitle, breadcrumb, heroHighlights } = service;
  const stepIcons = [MessageSquare, ScanSearch, Wrench, RefreshCw, ShieldCheck];
  const steps = (service.steps && service.steps.length
    ? service.steps.map((s, i) => ({ n: i + 1, icon: stepIcons[i % stepIcons.length], title: s.title }))
    : defaultSteps);
  const stats = service.stats && service.stats.length ? service.stats : defaultStats;
  const realTestimonials = allReviews.map((r) => ({ name: r.userName, role: "", text: r.comment }));
  const testimonials = realTestimonials.length
    ? realTestimonials
    : (service.testimonials && service.testimonials.length ? service.testimonials : defaultTestimonials);
  const faqs = service.faqs && service.faqs.length ? service.faqs : defaultFaqs;

  const startingPlan = plans[0];
  const svcPriceStr = service.price;
  const svcOriginalStr = service.originalPrice;
  const startingPrice = svcPriceStr
    ? parseInt(String(svcPriceStr).replace(/[^\d]/g, ""), 10) || 0
    : startingPlan ? parseInt(startingPlan.price.replace(/[^\d]/g, ""), 10) || 0 : 0;
  // Only consider an "original price" when the service itself defines one — do
  // not fall back to plan pricing, otherwise a strike-through old price shows
  // on every service even when the admin didn't set one.
  const startingOriginal = svcOriginalStr
    ? parseInt(String(svcOriginalStr).replace(/[^\d]/g, ""), 10) || 0
    : 0;
  const startingDiscount =
    service.discountPercent != null && service.discountPercent > 0
      ? service.discountPercent
      : startingOriginal > 0 && startingOriginal > startingPrice
        ? Math.round(((startingOriginal - startingPrice) / startingOriginal) * 100)
        : 0;
  const displayPrice = svcPriceStr ?? startingPlan?.price ?? "—";
  const displayOriginal = svcOriginalStr;
  const heroImg = service.bannerImage || servicesHero;
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info(lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please sign in first");
      navigate({ to: "/login", search: { redirect: `/services/${slug}` } as any });
      return;
    }
    add({ serviceSlug: slug, serviceTitle: title, planName: "—", price: startingPrice });
    toast.success(t("svcDetail.toast.added"), { description: title });
  };
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info(lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please sign in first");
      navigate({ to: "/login", search: { redirect: `/services/${slug}` } as any });
      return;
    }
    add({ serviceSlug: slug, serviceTitle: title, planName: "—", price: startingPrice });
    navigate({ to: "/checkout" as any });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Product-style header */}
        <section className="border-b border-border/60 bg-gradient-to-b from-secondary/40 to-background">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className={`flex flex-wrap items-center gap-1 text-[11px] font-bold text-muted-foreground ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
              <Link to="/" className="hover:text-primary">{t("svcDetail.crumb.home")}</Link>
              <ChevronLeft className={`h-3 w-3 ${arrowFlip}`} />
              <Link to="/services" className="hover:text-primary">{t("svcDetail.crumb.services")}</Link>
              <ChevronLeft className={`h-3 w-3 ${arrowFlip}`} />
              <span className="text-foreground">{breadcrumb}</span>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
                <img src={heroImg} alt={title} width={1200} height={900} fetchPriority="high" decoding="async" className="h-full w-full object-cover transition duration-500" />
                <span className={`absolute top-4 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow ${dir === "rtl" ? "right-4" : "left-4"}`}>{t("svcDetail.badge.available")}</span>
                <span className={`absolute top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-primary shadow ${dir === "rtl" ? "left-4" : "right-4"}`}>{breadcrumb}</span>
              </div>
            </div>

            <div className={`order-2 ${startAlign}`}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-[11px] font-bold text-primary">
                <Award className="h-3 w-3" /> {t("svcDetail.badge.pro")}
              </div>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">{title}</h1>
              <div className="mt-2 flex items-center justify-start gap-3 text-xs text-muted-foreground">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className={`h-3.5 w-3.5 ${k < Math.round(summary.average) ? "fill-current" : "fill-none"}`} />
                  ))}
                </div>
                {summary.count > 0 && <span className="font-bold text-foreground" data-ltr-number>{summary.average.toFixed(1)}</span>}
                <span>({summary.count})</span>
                <button
                  type="button"
                  onClick={toggleFav}
                  className={`ms-auto inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition ${fav ? "border-red-200 bg-red-50 text-red-600" : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"}`}
                >
                  <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : ""}`} />
                  {fav ? t("svcDetail.fav.added") : t("svcDetail.fav.add")}
                </button>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{subtitle}</p>

              <div className="mt-5 rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
                <div className="flex items-end justify-between gap-3">
                  <div className={startAlign}>
                    <div className="text-[11px] font-bold text-muted-foreground">{t("svcDetail.price.from")}</div>
                    <div className="mt-1 flex flex-wrap items-end gap-2" dir="ltr">
                      <div className="text-3xl font-extrabold text-primary">
                        {displayPrice} <SarIcon className="h-[0.7em]" />
                      </div>
                      {startingDiscount > 0 && (
                        <>
                          <div className="text-base font-bold text-muted-foreground line-through">
                            {displayOriginal}
                          </div>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                            -{startingDiscount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link to={"/plans" as any} className="inline-flex h-9 items-center rounded-full border border-border bg-secondary/60 px-3 text-[11px] font-bold text-foreground/80 hover:border-primary hover:text-primary">
                    {t("svcDetail.allPlans")}
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={handleBuyNow} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-[0_10px_30px_-12px_rgba(30,91,148,0.6)] transition hover:bg-primary-dark">
                    <Zap className="h-4 w-4" /> {t("svcDetail.orderNow")}
                  </button>
                  <button onClick={handleAddToCart} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white text-sm font-bold text-primary transition hover:bg-primary-light">
                    <ShoppingCart className="h-4 w-4" /> {t("svcDetail.addToCart")}
                  </button>
                </div>
              </div>

              {startingPrice > 0 && (
                <button
                  type="button"
                  onClick={() => setTabbyOpen(true)}
                  className="mt-4 w-full rounded-2xl border border-border/60 bg-white p-4 text-start shadow-sm transition hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3" dir={dir}>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-foreground">
                        {lang === "ar"
                          ? <>أو قسم فاتورتك على 4 دفعات بقيمة <span dir="ltr" className="inline-flex items-baseline gap-1">{Number((startingPrice / 4).toFixed(2))} <SarIcon className="h-[0.8em]" /></span></>
                          : <>Or split into 4 payments of <span dir="ltr" className="inline-flex items-baseline gap-1">{Number((startingPrice / 4).toFixed(2))} <SarIcon className="h-[0.8em]" /></span></>}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {lang === "ar" ? "بدون رسوم أو فوائد " : "No fees, no interest "}
                        <span className="font-bold text-primary underline">{lang === "ar" ? "اعرف أكثر" : "Learn more"}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center overflow-hidden rounded-md">
                      <img src={tabbyLogo} alt="tabby" width={100} height={40} decoding="async" className="h-7 w-auto object-contain" />
                    </span>
                  </div>
                </button>
              )}

              {startingPrice > 0 && (
                <button
                  type="button"
                  onClick={() => setTamaraOpen(true)}
                  className="mt-3 w-full rounded-2xl border border-border/60 bg-white p-4 text-start shadow-sm transition hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3" dir={dir}>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-foreground">
                        {lang === "ar"
                          ? <>أو قسم فاتورتك على 3 دفعات بقيمة <span dir="ltr" className="inline-flex items-baseline gap-1">{Number((startingPrice / 3).toFixed(2))} <SarIcon className="h-[0.8em]" /></span></>
                          : <>Or split into 3 payments of <span dir="ltr" className="inline-flex items-baseline gap-1">{Number((startingPrice / 3).toFixed(2))} <SarIcon className="h-[0.8em]" /></span></>}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {lang === "ar" ? "بدون رسوم تأخير، متوافقة مع الشريعة الإسلامية " : "No late fees, Shariah-compliant "}
                        <span className="font-bold text-primary underline">{lang === "ar" ? "اعرف أكثر" : "Learn more"}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center overflow-hidden rounded-md">
                      <img src={tamaraLogo} alt="tamara" width={100} height={32} decoding="async" className="h-7 w-auto object-contain" />
                    </span>
                  </div>
                </button>
              )}



              <div className="mt-5 rounded-2xl border border-border/60 bg-secondary/30 p-4">
                <div className="mb-3 text-xs font-bold text-foreground">{t("svcDetail.highlights")}</div>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {heroHighlights.map((f) => (
                    <li key={f} className={`flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-foreground/85 ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                      <span>{f}</span>
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-white p-3">
                  <Truck className="h-4 w-4 text-primary" /> {t("svcDetail.feat.fast")}
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-white p-3">
                  <ShieldCheck className="h-4 w-4 text-primary" /> {t("svcDetail.feat.quality")}
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-white p-3">
                  <Clock className="h-4 w-4 text-primary" /> {t("svcDetail.feat.support")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className={startAlign}>
                <h2 className="text-2xl font-extrabold text-foreground">{t("svcDetail.overview.title")}</h2>
                <p className="mt-2 text-xs text-muted-foreground">{t("svcDetail.overview.desc")}</p>
              </div>
              {service.overviewDescription && (
                <div className={`mt-5 rounded-2xl border border-border/60 bg-secondary/30 p-5 ${startAlign}`}>
                  <p className="text-sm leading-8 text-foreground/80 whitespace-pre-line">
                    {service.overviewDescription}
                  </p>
                </div>
              )}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {overview.map((o) => (
                  <div key={o.title} className="group rounded-2xl border border-border bg-secondary/30 p-6 text-center transition hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-md">
                    <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                      <o.icon className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-sm font-bold text-foreground">{o.title}</div>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{o.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="pb-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className={startAlign}>
                <h2 className="text-2xl font-extrabold text-foreground">{t("svcDetail.benefits.title")}</h2>
                <p className="mt-2 text-xs text-muted-foreground">{t("svcDetail.benefits.desc")}</p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((b) => (
                  <div key={b.title} className={`group flex items-start gap-4 rounded-2xl border border-border bg-secondary/30 p-5 ${startAlign} transition hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-md`}>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-foreground">{b.title}</div>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground">{b.desc}</p>
                    </div>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                      <b.icon className="h-5 w-5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="pb-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]">
              <div className={startAlign}>
                <h2 className="text-2xl font-extrabold text-foreground">{t("svcDetail.how.title")}</h2>
                <p className="mt-2 text-xs text-muted-foreground">{t("svcDetail.how.desc")}</p>
              </div>
              <div className="relative mt-12 grid grid-cols-2 gap-6 md:grid-cols-5">
                <div className="pointer-events-none absolute right-[10%] left-[10%] top-9 hidden h-0.5 bg-gradient-to-l from-primary/10 via-primary/40 to-primary/10 md:block" />
                {steps.map((s) => (
                  <div key={s.n} className="relative flex flex-col items-center text-center">
                    <div className="relative">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-[0_10px_25px_-10px_rgba(30,91,148,0.45)] ring-2 ring-primary">
                        <s.icon className="h-7 w-7" />
                      </span>
                      <span className={`absolute -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white shadow-md ring-2 ring-white ${dir === "rtl" ? "-right-2" : "-left-2"}`}>
                        {s.n}
                      </span>
                    </div>
                    <div className="mt-4 text-sm font-bold text-foreground">{s.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Previous works — same as home */}
        <PortfolioSection />

        {/* Stats */}
        <section className="pb-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className={startAlign}>
                <h2 className="text-2xl font-extrabold text-foreground">{t("svcDetail.stats.title")}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t("svcDetail.stats.desc")}</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.l} className="rounded-2xl border border-border bg-secondary/30 p-6 text-center">
                    <div className="text-2xl font-extrabold text-primary sm:text-3xl">{s.v}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pb-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className={startAlign}>
                <h2 className="text-2xl font-extrabold text-foreground">{t("svcDetail.test.title")}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t("svcDetail.test.desc")}</p>
              </div>
              <TestimonialsSlider testimonials={testimonials} />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className={startAlign}>
                <h2 className="text-2xl font-extrabold text-foreground">{t("svcDetail.faq.title")}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t("svcDetail.faq.desc")}</p>
              </div>
              <div className="mt-6 space-y-3">
                {faqs.map((f, i) => (
                  <div key={f.q} className="rounded-xl border border-border bg-secondary/30 transition hover:border-primary/30">
                    <button onClick={() => setOpen(open === i ? null : i)} className={`flex w-full items-center justify-between gap-4 px-5 py-4 ${startAlign}`}>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
                      <span className="text-sm font-bold text-foreground">{f.q}</span>
                    </button>
                    {open === i && (
                      <div className={`border-t border-border/60 bg-white px-5 py-4 text-xs leading-6 text-muted-foreground ${startAlign}`}>
                        {f.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="pb-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className={startAlign}>
                <h2 className="text-2xl font-extrabold text-foreground">{t("svcDetail.reviews.title")}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t("svcDetail.reviews.desc")}</p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Summary */}
                <div className="rounded-2xl border border-border bg-secondary/30 p-6 text-center">
                  <div className="text-4xl font-extrabold text-primary" data-ltr-number>{summary.average.toFixed(1)}</div>
                  <div className="mt-2 flex items-center justify-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className={`h-4 w-4 ${k < Math.round(summary.average) ? "fill-current" : "fill-none"}`} />
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{summary.count} {t("svcDetail.reviews.count")}</div>
                </div>

                {/* Review form */}
                <div className="lg:col-span-2">
                  <ReviewForm
                    isAuthenticated={isAuthenticated}
                    onSubmit={(rating, comment) => addReview(rating, comment)}
                  />
                </div>
              </div>

              {/* Reviews list */}
              <div className="mt-8 space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/60 bg-secondary/20 p-8 text-center text-xs text-muted-foreground">
                    {t("svcDetail.reviews.empty")}
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className={`rounded-2xl border border-border/60 bg-white p-5 shadow-sm ${startAlign}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                            {r.userName.slice(0, 1)}
                          </span>
                          <div>
                            <div className="text-sm font-bold text-foreground">{r.userName}</div>
                            <div className="text-[11px] text-muted-foreground" data-ltr-number>{r.createdAt.slice(0, 10)}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, k) => (
                            <Star key={k} className={`h-3.5 w-3.5 ${k < r.rating ? "fill-current" : "fill-none"}`} />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="mt-3 text-sm leading-7 text-foreground/80">{r.comment}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-primary-dark px-8 py-12 text-center shadow-lg">
              <div className="pointer-events-none absolute -top-20 -right-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{t("svcDetail.cta.title")}</h2>
              <p className="mt-3 text-sm text-white/80">{t("svcDetail.cta.desc")}</p>
              <Link to={"/contact" as any} className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl">
                {t("svcDetail.cta.btn")}
                <ArrowLeft className={`h-4 w-4 transition-transform ${arrowFlip}`} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      <Dialog open={tamaraOpen} onOpenChange={setTamaraOpen}>
        <DialogContent dir={dir} className="max-w-md overflow-hidden border-0 p-0">
          <div className="relative p-6 sm:p-7" style={{ background: "linear-gradient(135deg, #fde4cf 0%, #ffd1d9 40%, #e7d4f5 100%)" }}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">👋</span>
              <img src={tamaraLogo} alt="tamara" width={100} height={32} loading="lazy" decoding="async" className="h-7 w-auto object-contain" />
            </div>
            <h3 className="mt-4 text-center text-base font-extrabold text-foreground">
              {lang === "ar" ? "خطط دفع تناسب احتياجك" : "Payment plans for you"}
            </h3>

            <div className="mt-5 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-rose-500 text-white text-xs font-bold">3</span>
                <div className="text-sm font-extrabold text-foreground">
                  {lang === "ar" ? "قسّمها على 3 دفعات" : "Split into 3 payments"}
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-6 text-muted-foreground">
                {lang === "ar"
                  ? "ادفع جزء من المبلغ الحين والباقي على دفعتين خلال شهرين."
                  : "Pay part now and the rest in two installments over two months."}
              </p>
            </div>

            <div className="my-5 h-px bg-black/10" />

            <div className="text-center text-sm font-extrabold text-foreground">
              {lang === "ar" ? "ليش أدفع تمارا؟" : "Why pay with Tamara?"}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center gap-2">
                <Smile className="h-6 w-6 text-foreground/80" strokeWidth={1.5} />
                <span className="text-[11px] text-foreground/80">{lang === "ar" ? "مرنة" : "Flexible"}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6 text-foreground/80" strokeWidth={1.5} />
                <span className="text-[11px] leading-4 text-foreground/80">
                  {lang === "ar" ? "متوافقة مع الشريعة الإسلامية" : "Shariah-compliant"}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock className="h-6 w-6 text-foreground/80" strokeWidth={1.5} />
                <span className="text-[11px] text-foreground/80">{lang === "ar" ? "بدون رسوم تأخير" : "No late fees"}</span>
              </div>
            </div>

            <p className="mt-6 text-center text-[10px] leading-5 text-foreground/60">
              {lang === "ar"
                ? <>(1) قد يختلف توافر وتفاصيل خطط الدفع المقدمة حسب قيمة طلبك وسجلك لدى تمارا (2) تطبق <span className="underline">الشروط والأحكام</span> (3) تمارا موافقة لتعاليم <span className="underline">الشريعة الإسلامية</span> (4) متاح للعملاء في السعودية (5) خطط الدفع النهائية المقدمة لك قد تختلف حسب سجلك الائتماني</>
                : "Availability and details of payment plans may vary based on your order value and Tamara record. Terms apply."}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={tabbyOpen} onOpenChange={setTabbyOpen}>
        <DialogContent dir={dir} className="max-w-sm overflow-hidden border-0 bg-white p-0">
          <div className="px-5 pb-5 pt-5">
            <div className="flex items-center justify-end">
              <img src={tabbyLogo} alt="tabby" width={100} height={40} loading="lazy" decoding="async" className="h-7 w-auto object-contain" />
            </div>

            <div className="relative mt-4 overflow-hidden rounded-2xl">
              <img src={tabbyHero} alt="" width={520} height={381} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 text-center text-white">
                <div className="text-xl font-extrabold">{lang === "ar" ? "ادفع على راحتك" : "Pay at your pace"}</div>
                <div className="mt-1 text-xs text-white/90">{lang === "ar" ? "قسّم مشترياتك حق 4 دفعات" : "Split your purchase into 4 payments"}</div>
              </div>
            </div>


            <div className="mt-4 space-y-2">
              <div className="rounded-xl border border-border bg-white p-3">
                <div className="flex items-center justify-between" dir={dir}>
                  <div className="text-xs font-bold text-foreground">{lang === "ar" ? "3 دفعات" : "3 payments"}</div>
                  <div className="text-xs font-extrabold text-foreground" dir="ltr">
                    {Number((startingPrice / 3).toFixed(2))} <SarIcon className="h-[0.8em]" />/{lang === "ar" ? "شهر" : "mo"}
                  </div>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">{lang === "ar" ? "بلا رسوم أو فوائد." : "No fees, no interest."}</div>
              </div>
              <div className="rounded-xl border border-border bg-white p-3">
                <div className="flex items-center justify-between" dir={dir}>
                  <div className="text-xs font-bold text-foreground">{lang === "ar" ? "4 دفعات" : "4 payments"}</div>
                  <div className="text-xs font-extrabold text-foreground" dir="ltr">
                    {Number((startingPrice / 4).toFixed(2))} <SarIcon className="h-[0.8em]" />/{lang === "ar" ? "شهر" : "mo"}
                  </div>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">{lang === "ar" ? "بدون فوائد، يشمل 5.67% رسوم معالجة شهرية." : "No interest, includes monthly processing fee."}</div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-white p-3 ring-1 ring-border">
              <div className="text-center text-sm font-extrabold text-foreground">{lang === "ar" ? "آلية الاستخدام" : "How it works"}</div>
              <ol className="mt-3 space-y-2 text-[11px] text-foreground/80">
                <li className="flex items-start gap-2"><span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3bea93]/30 text-[10px] font-bold text-foreground">1</span> {lang === "ar" ? "اخترِ تابي عند الدفع لتعيين خطة دفع" : "Choose Tabby at checkout"}</li>
                <li className="flex items-start gap-2"><span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3bea93]/30 text-[10px] font-bold text-foreground">2</span> {lang === "ar" ? "أدخل بياناتك وأضف بطاقة الصراف أو الائتمان" : "Enter your details and add a card"}</li>
                <li className="flex items-start gap-2"><span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3bea93]/30 text-[10px] font-bold text-foreground">3</span> {lang === "ar" ? "حسب خطة الدفع التي اخترتها، قد تحتاج إلى سداد دفعة مقدمة أولاً" : "You may need to pay an upfront amount"}</li>
                <li className="flex items-start gap-2"><span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3bea93]/30 text-[10px] font-bold text-foreground">4</span> {lang === "ar" ? "سيرسل لك تذكير عند استحقاق دفعتك القادمة" : "We'll remind you of upcoming payments"}</li>
              </ol>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-border">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#3bea93]/20"><ShieldCheck className="h-4 w-4 text-emerald-700" /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-foreground">{lang === "ar" ? "مدفوعات متوافقة مع أحكام الشريعة" : "Shariah-compliant payments"}</div>
                  <div className="text-[10px] text-muted-foreground">{lang === "ar" ? "تتوافق خياراتنا للدفع مع معايير التمويل الإسلامي." : "Aligned with Islamic finance standards."}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-border">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100"><ShieldCheck className="h-4 w-4 text-purple-700" /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-foreground">{lang === "ar" ? "تسوّق بأمان مع تابي" : "Shop safely with Tabby"}</div>
                  <div className="text-[10px] text-muted-foreground">{lang === "ar" ? "يفعّل برنامج حماية المشتري للمشتريات." : "Buyer protection enabled."}</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTabbyOpen(false)}
              className="mt-4 h-11 w-full rounded-full bg-[#1d1f2b] text-sm font-bold text-white hover:bg-[#0f1018]"
            >
              {lang === "ar" ? "تابع التسوق" : "Continue shopping"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 opacity-80">
              <img src={payApplePay} alt="Apple Pay" width={24} height={24} loading="lazy" decoding="async" className="h-5 w-auto object-contain" />
              <img src={payMastercard} alt="Mastercard" width={33} height={20} loading="lazy" decoding="async" className="h-5 w-auto object-contain" />
              <img src={payMada} alt="Mada" width={60} height={20} loading="lazy" decoding="async" className="h-5 w-auto object-contain" />
              <img src={payVisa} alt="Visa" width={62} height={20} loading="lazy" decoding="async" className="h-5 w-auto object-contain" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReviewForm({ isAuthenticated, onSubmit }: { isAuthenticated: boolean; onSubmit: (rating: number, comment: string) => boolean | Promise<boolean> }) {
  const { t, dir } = useLang();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const startAlign = dir === "rtl" ? "text-right" : "text-left";

  if (!isAuthenticated) {
    return (
      <div className={`flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/20 p-6 text-center ${startAlign}`}>
        <p className="text-sm text-muted-foreground">{t("svcDetail.reviews.loginRequired")}</p>
        <Link to={"/login" as any} className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground">
          {t("nav.login")}
        </Link>
      </div>
    );
  }

  const submit = async () => {
    if (rating < 1) return;
    const ok = await onSubmit(rating, comment.trim());
    if (ok) {
      toast.success(t("svcDetail.reviews.thanks"));
      setComment("");
      setRating(0);
    } else {
      toast.error(dir === "rtl" ? "تعذر إرسال التقييم" : "Failed to submit review");
    }
  };

  return (
    <div className={`rounded-2xl border border-border/60 bg-secondary/20 p-5 ${startAlign}`}>
      <div className="text-sm font-bold text-foreground">{t("svcDetail.reviews.formTitle")}</div>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            aria-label={`${n}`}
            className="p-0.5"
          >
            <Star className={`h-6 w-6 ${(hover || rating) >= n ? "fill-amber-400 text-amber-400" : "fill-none text-amber-300"}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("svcDetail.reviews.placeholder")}
        maxLength={1000}
        rows={4}
        className="mt-3 w-full resize-none rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
      />
      <button
        onClick={submit}
        className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground transition hover:bg-primary-dark"
      >
        <Send className="h-4 w-4" /> {t("svcDetail.reviews.submit")}
      </button>
    </div>
  );
}

function TestimonialsSlider({ testimonials }: { testimonials: { name: string; role: string; text: string }[] }) {
  const { t, dir } = useLang();
  const [i, setI] = useState(0);
  const pages = Math.ceil(testimonials.length / 2);
  const prev = () => setI((v) => (v - 1 + pages) % pages);
  const next = () => setI((v) => (v + 1) % pages);

  return (
    <div className="mt-6">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${dir === "rtl" ? i * 100 : -i * 100}%)` }}
        >
          {Array.from({ length: pages }).map((_, p) => {
            const pair = testimonials.slice(p * 2, p * 2 + 2);
            return (
              <div key={p} className="w-full shrink-0">
                <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2">
                  {pair.map((tt) => (
                    <div key={tt.name} className={`rounded-2xl border border-border/60 bg-white p-6 ${dir === "rtl" ? "text-right" : "text-left"} shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]`}>
                      <div className={`flex gap-0.5 text-amber-400 ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star key={k} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-foreground/80">"{tt.text}"</p>
                      <div className="mt-4 text-xs">
                        <div className="font-bold text-foreground">{tt.name}</div>
                        <div className="text-muted-foreground">{tt.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={prev}
          aria-label={t("svcDetail.slider.prev")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: pages }).map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`${k + 1}`}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label={t("svcDetail.slider.next")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const s = serviceSeoMap[params.slug];
    const title = s?.title || "خدمة | سابا ديزاين";
    const description = s?.description || "حلول رقمية متكاملة لنمو أعمالك.";
    const keywords = s?.keywords;
    const seo = buildSeo({
      title,
      description,
      keywords,
      path: `/services/${params.slug}`,
      type: "product",
    });
    const scripts = [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "الخدمات", path: "/services" },
            { name: s?.title.replace(" | سابا ديزاين", "") || params.slug, path: `/services/${params.slug}` },
          ])
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          serviceJsonLd({
            name: s?.title.replace(" | سابا ديزاين", "") || params.slug,
            description,
            url: `${SITE.url}/services/${params.slug}`,
          })
        ),
      },
    ];
    return { meta: seo.meta, links: seo.links, scripts };
  },
  component: ServiceDetailPage,
});
