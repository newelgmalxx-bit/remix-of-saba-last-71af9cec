import {
  Layout, MonitorSmartphone, Megaphone, Sparkles, Users2, Video, TrendingUp, Code2, Search,
  Target, Gem, FileCode2, LifeBuoy, Smartphone, Palette, Image as ImageIcon, Share2, BarChart3, Globe2, Bug, Rocket, Wrench, ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type ServiceContent = {
  slug: string;
  category: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  heroHighlights: string[];
  bannerImage?: string;
  overviewDescription?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  overview: { icon: LucideIcon; title: string; desc: string }[];
  benefits: { icon: LucideIcon; title: string; desc: string }[];
  plans: { name: string; price: string; originalPrice?: string; featured: boolean; feats: string[] }[];
  steps?: { title: string }[];
  stats?: { v: string; l: string }[];
  testimonials?: { name: string; role: string; text: string }[];
  faqs?: { q: string; a: string }[];
};

const defaultPlans = [
  { name: "Basic", price: "1,500", originalPrice: "1,800", featured: false, feats: ["باقة أساسية", "تسليم سريع", "جولة تعديل واحدة", "دعم لمدة أسبوع"] },
  { name: "Pro", price: "3,500", originalPrice: "4,500", featured: true, feats: ["مخرجات إضافية", "جولتان تعديل", "ربط مع قنواتك", "دعم لمدة شهر", "أولوية في التنفيذ"] },
  { name: "Premium", price: "6,500", originalPrice: "8,500", featured: false, feats: ["كل ما في باقة Pro", "تخصيص متقدم", "تقارير دورية", "دعم أولوية"] },
];

export const services: ServiceContent[] = [
  {
    slug: "web-design",
    category: "برمجة",
    breadcrumb: "تصميم مواقع",
    title: "تصميم مواقع الكترونية",
    subtitle: "مواقع سريعة ومتجاوبة تعكس هويتك التجارية وتُحقق التحويل.",
    heroHighlights: ["تصميم متجاوب", "تصميم متناسق مع البراند", "دعم التطوير وتجهيز الموقع"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "للشركات الناشئة والعلامات التي تريد حضورًا رقميًا قويًا وموقعًا احترافيًا." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "لأن الواجهة الواضحة ترفع الثقة، تقلّل التشتيت، وتزيد التحويل." },
      { icon: Gem, title: "القيمة الأساسية", desc: "موقع سريع ومتجاوب وآمن يعكس هويتك ويحقق نتائج تجارية حقيقية." },
    ],
    benefits: [
      { icon: Layout, title: "تصميم كامل للمشروع", desc: "واجهات متناسقة لجميع الصفحات الرئيسية." },
      { icon: Target, title: "تجربة مستخدم احترافية", desc: "تدفقات واضحة وسهلة الاستخدام لكل العملاء." },
      { icon: FileCode2, title: "ملفات قابلة للتطوير", desc: "كود نظيف وسهل التعديل والتوسعة لاحقًا." },
      { icon: Smartphone, title: "نسخة للموبايل والويب", desc: "تجربة مثالية على كل الأجهزة." },
      { icon: LifeBuoy, title: "دعم بعد التسليم", desc: "متابعة فنية لأكثر من شهر بعد الإطلاق." },
    ],
    plans: [
      { name: "Basic", price: "3,500", originalPrice: "4,200", featured: false, feats: ["تصميم 5 صفحات", "متجاوب", "هوية بسيطة", "صياغة محتوى مبدئي"] },
      { name: "Pro", price: "7,900", originalPrice: "9,900", featured: true, feats: ["تصميم 10 صفحات", "هوية متكاملة", "ربط نماذج تواصل", "تحسين سرعة", "SEO أساسي"] },
      { name: "Premium", price: "12,500", originalPrice: "15,900", featured: false, feats: ["كل ما في باقة Pro", "متجر إلكتروني", "لوحة تحكم", "دعم أولوية"] },
    ],
  },
  {
    slug: "ui-design",
    category: "تصميم",
    breadcrumb: "تصميم واجهات مستخدم",
    title: "تصميم واجهات مستخدم",
    subtitle: "واجهات سهلة وجذابة تركّز على التحويل وتجربة المستخدم.",
    heroHighlights: ["تصميم UI/UX حديث", "نظام تصميم متكامل", "نماذج تفاعلية جاهزة للتطوير"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "لأصحاب المنتجات الرقمية والتطبيقات الذين يريدون تجربة استخدام مميزة." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "تجربة مدروسة ترفع التفاعل وتقلّل معدل الارتداد." },
      { icon: Gem, title: "القيمة الأساسية", desc: "نظام تصميم متماسك يسهّل التطوير ويحافظ على هوية بصرية موحّدة." },
    ],
    benefits: [
      { icon: Palette, title: "نظام ألوان وخطوط", desc: "هوية بصرية متّسقة عبر كل الشاشات." },
      { icon: Target, title: "تدفقات استخدام واضحة", desc: "User flows تركّز على هدف العميل." },
      { icon: MonitorSmartphone, title: "تصميم متجاوب", desc: "واجهات مثالية على الموبايل والديسكتوب." },
      { icon: FileCode2, title: "ملفات Figma منظمة", desc: "تسليم ملفات قابلة للتطوير والمشاركة." },
      { icon: LifeBuoy, title: "دعم تنفيذ", desc: "متابعة مع فريق التطوير حتى الإطلاق." },
    ],
    plans: defaultPlans,
  },
  {
    slug: "ad-banners",
    category: "تصميم",
    breadcrumb: "تصميم بنرات إعلانية",
    title: "تصميم بنرات إعلانية",
    subtitle: "أصول بصرية جذابة لحملاتك الرقمية على كل المنصات.",
    heroHighlights: ["تصاميم بمختلف المقاسات", "متوافقة مع منصات الإعلانات", "تسليم سريع"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "للشركات والمسوّقين الذين يحتاجون أصول إعلانية احترافية لحملاتهم." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "البنر الجيد يرفع نسبة النقر ويُحسّن أداء الحملة." },
      { icon: Gem, title: "القيمة الأساسية", desc: "تصاميم تجذب الانتباه وتوصل الرسالة بدقة." },
    ],
    benefits: [
      { icon: ImageIcon, title: "تصاميم بدقة عالية", desc: "أصول جاهزة للطباعة والنشر الرقمي." },
      { icon: Target, title: "رسالة واضحة", desc: "Call-to-action قوي يدفع للفعل." },
      { icon: Palette, title: "متوافقة مع الهوية", desc: "ألوان وخطوط متناسقة مع براندك." },
      { icon: Smartphone, title: "مقاسات متعددة", desc: "Stories و Posts و Display ads." },
      { icon: LifeBuoy, title: "تعديلات مرنة", desc: "جولات مراجعة حتى الرضا التام." },
    ],
    plans: defaultPlans,
  },
  {
    slug: "social-media-design",
    category: "سوشيال ميديا",
    breadcrumb: "تصميم سوشيال ميديا",
    title: "تصميم سوشيال ميديا",
    subtitle: "منشورات احترافية متناسقة مع هوية علامتك التجارية.",
    heroHighlights: ["تصاميم شهرية متكاملة", "هوية بصرية موحّدة", "محتوى تفاعلي جذاب"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "للعلامات التجارية التي تريد حضورًا قويًا ومتسقًا على السوشيال ميديا." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "المحتوى البصري المنتظم يبني ثقة الجمهور ويزيد التفاعل." },
      { icon: Gem, title: "القيمة الأساسية", desc: "محتوى يعكس شخصية البراند ويحقق أهدافك التسويقية." },
    ],
    benefits: [
      { icon: Palette, title: "هوية بصرية متناسقة", desc: "كل المنشورات تتحدث نفس اللغة." },
      { icon: ImageIcon, title: "تصاميم Posts و Stories", desc: "محتوى مناسب لكل منصة." },
      { icon: Target, title: "محتوى موجّه", desc: "تصاميم بأهداف تسويقية واضحة." },
      { icon: Share2, title: "جاهزة للنشر", desc: "بكل المقاسات والصيغ المطلوبة." },
      { icon: LifeBuoy, title: "خطة شهرية", desc: "تقويم محتوى منظم وقابل للمتابعة." },
    ],
    plans: defaultPlans,
  },
  {
    slug: "social-media-setup",
    category: "سوشيال ميديا",
    breadcrumb: "إنشاء حسابات سوشيال ميديا",
    title: "إنشاء وإدارة حسابات السوشيال ميديا",
    subtitle: "تهيئة الحسابات وبناء حضور قوي على كل المنصات.",
    heroHighlights: ["إنشاء وتهيئة الحسابات", "تصميم Bio و Highlights", "استراتيجية بداية"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "للعلامات والشركات التي تبدأ حضورها على السوشيال ميديا." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "البداية الصحيحة تختصر الوقت وترفع جودة الحضور الرقمي." },
      { icon: Gem, title: "القيمة الأساسية", desc: "حسابات احترافية مهيأة للنمو من اليوم الأول." },
    ],
    benefits: [
      { icon: Share2, title: "تهيئة كاملة للحسابات", desc: "إعدادات احترافية على كل المنصات." },
      { icon: Palette, title: "تصميم هوية الحساب", desc: "صورة بروفايل، غلاف، وهايلايتس." },
      { icon: Target, title: "استراتيجية المحتوى", desc: "خطة مبدئية لأول 30 يوم." },
      { icon: TrendingUp, title: "بناء جمهور أولي", desc: "نصائح للوصول للجمهور المستهدف." },
      { icon: LifeBuoy, title: "تدريب لفريقك", desc: "جلسة لشرح كيفية الإدارة." },
    ],
    plans: defaultPlans,
  },
  {
    slug: "ad-videos",
    category: "تصميم",
    breadcrumb: "تصميم فيديوهات إعلانية",
    title: "تصميم فيديوهات إعلانية",
    subtitle: "فيديوهات قصيرة عالية التأثير تحكي قصة براندك.",
    heroHighlights: ["موشن جرافيك احترافي", "Reels و TikTok و YouTube", "سيناريو وصياغة محتوى"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "للعلامات التجارية والمنتجات التي تريد محتوى فيديو يجذب ويُحوّل." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "الفيديو يحقق أعلى معدلات تفاعل ووصول على كل المنصات." },
      { icon: Gem, title: "القيمة الأساسية", desc: "محتوى مرئي يبقى في ذاكرة العميل ويدفع للفعل." },
    ],
    benefits: [
      { icon: Video, title: "موشن جرافيك", desc: "أنيميشن احترافي يجذب الانتباه." },
      { icon: Target, title: "سيناريو وستوري بورد", desc: "كل فيديو يخدم هدف واضح." },
      { icon: Palette, title: "هوية بصرية", desc: "ألوان وخطوط متناسقة مع البراند." },
      { icon: Smartphone, title: "مقاسات متعددة", desc: "Reels، Stories، YouTube، TikTok." },
      { icon: LifeBuoy, title: "تعديلات مرنة", desc: "جولات مراجعة لضمان الرضا." },
    ],
    plans: defaultPlans,
  },
  {
    slug: "ad-campaigns",
    category: "تسويق",
    breadcrumb: "إطلاق حملات إعلانية",
    title: "إطلاق وإدارة حملات إعلانية",
    subtitle: "حملات ممولة مدروسة وموجهة لتحقيق أعلى عائد ممكن.",
    heroHighlights: ["Meta و Google و TikTok Ads", "استهداف دقيق للجمهور", "تقارير أداء أسبوعية"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "للشركات التي تريد نتائج تسويقية قابلة للقياس بميزانية محسوبة." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "الحملة المدروسة تحقق نتائج أفضل بنفس الميزانية." },
      { icon: Gem, title: "القيمة الأساسية", desc: "ROI واضح وقابل للقياس على كل ريال مصروف." },
    ],
    benefits: [
      { icon: Target, title: "استهداف دقيق", desc: "وصول للجمهور المهتم فعلًا." },
      { icon: Megaphone, title: "إدارة كاملة للحملة", desc: "من الإعداد حتى التحسين اليومي." },
      { icon: BarChart3, title: "تقارير شفافة", desc: "نتائج مفصلة بشكل دوري." },
      { icon: Rocket, title: "تحسين مستمر", desc: "A/B testing لرفع الأداء." },
      { icon: LifeBuoy, title: "استشارة استراتيجية", desc: "خطة نمو طويلة المدى." },
    ],
    plans: defaultPlans,
  },
  {
    slug: "digital-marketing",
    category: "تسويق",
    breadcrumb: "تسويق إلكتروني",
    title: "تسويق إلكتروني",
    subtitle: "استراتيجية نمو متكاملة تجمع المحتوى والتحويل والتحليل.",
    heroHighlights: ["استراتيجية محتوى", "حملات متعددة القنوات", "تحليل الأداء"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "للشركات الباحثة عن نمو رقمي شامل ومستدام." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "التسويق الرقمي المتكامل يحقق نتائج تتراكم مع الوقت." },
      { icon: Gem, title: "القيمة الأساسية", desc: "نمو حقيقي في المبيعات والوعي بالعلامة التجارية." },
    ],
    benefits: [
      { icon: TrendingUp, title: "خطة نمو متكاملة", desc: "استراتيجية موثقة وقابلة للتنفيذ." },
      { icon: Megaphone, title: "إدارة قنوات التسويق", desc: "سوشيال، إعلانات، إيميل ماركتنج." },
      { icon: Target, title: "تحديد الجمهور", desc: "Personas دقيقة لكل قناة." },
      { icon: BarChart3, title: "تقارير شهرية", desc: "مؤشرات أداء واضحة." },
      { icon: LifeBuoy, title: "اجتماعات دورية", desc: "متابعة مستمرة لتحسين النتائج." },
    ],
    plans: defaultPlans,
  },
  {
    slug: "debugging",
    category: "برمجة",
    breadcrumb: "تصحيح أخطاء برمجية",
    title: "تصحيح الأخطاء البرمجية",
    subtitle: "حل الأعطال وتحسين استقرار وأداء تطبيقاتك ومواقعك.",
    heroHighlights: ["تشخيص دقيق للأعطال", "تحسين الأداء", "اختبار شامل"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "لأصحاب المواقع والتطبيقات الذين يواجهون أعطال أو بطء." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "الأعطال تكلّف مبيعات وثقة العملاء." },
      { icon: Gem, title: "القيمة الأساسية", desc: "نظام مستقر وسريع يعمل بكفاءة دائمة." },
    ],
    benefits: [
      { icon: Bug, title: "تشخيص شامل", desc: "تحديد جذور المشكلة بدقة." },
      { icon: Wrench, title: "إصلاح احترافي", desc: "حلول دائمة وليست مؤقتة." },
      { icon: Rocket, title: "تحسين الأداء", desc: "تسريع الموقع وتقليل وقت التحميل." },
      { icon: ShieldCheck, title: "اختبار شامل", desc: "تأكد من عدم تكرار المشكلة." },
      { icon: LifeBuoy, title: "دعم بعد الإصلاح", desc: "متابعة لضمان الاستقرار." },
    ],
    plans: defaultPlans,
  },
  {
    slug: "seo",
    category: "تسويق",
    breadcrumb: "SEO",
    title: "تحسين محركات البحث (SEO)",
    subtitle: "رفع ظهور موقعك في نتائج البحث وزيادة الزيارات العضوية.",
    heroHighlights: ["تحليل تقني شامل", "بحث الكلمات المفتاحية", "تحسين المحتوى والبنية"],
    overview: [
      { icon: Users2, title: "لمن هذه الخدمة", desc: "لأصحاب المواقع الذين يريدون زيارات مجانية ومستدامة من جوجل." },
      { icon: Sparkles, title: "لماذا تهم؟", desc: "الزيارات العضوية أعلى ثقة وأقل تكلفة على المدى البعيد." },
      { icon: Gem, title: "القيمة الأساسية", desc: "ظهور أفضل في نتائج البحث يعني عملاء أكثر." },
    ],
    benefits: [
      { icon: Search, title: "بحث الكلمات المفتاحية", desc: "اختيار الكلمات الأعلى أثرًا." },
      { icon: FileCode2, title: "تحسين تقني", desc: "بنية موقع وأداء صديقة للبحث." },
      { icon: Globe2, title: "تحسين المحتوى", desc: "صياغة تخدم القارئ والمحرّكات." },
      { icon: BarChart3, title: "تقارير دورية", desc: "متابعة الترتيب والزيارات." },
      { icon: LifeBuoy, title: "استشارة مستمرة", desc: "متابعة شهرية لتحسين النتائج." },
    ],
    plans: defaultPlans,
  },
];

export const serviceMap: Record<string, ServiceContent> = Object.fromEntries(
  services.map((s) => [s.slug, s]),
);

export const categoryToSlug = (title: string): string | undefined =>
  services.find((s) => s.title === title || s.breadcrumb === title)?.slug;