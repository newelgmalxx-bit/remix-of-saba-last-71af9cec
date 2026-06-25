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
  price?: string;
  originalPrice?: string;
  discountPercent?: number;
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
  /** English overlay applied when the active language is "en" (unless a user override exists). */
  i18n?: {
    en?: {
      category?: string;
      breadcrumb?: string;
      title?: string;
      subtitle?: string;
      heroHighlights?: string[];
      overviewDescription?: string;
      overview?: { title?: string; desc?: string }[];
      benefits?: { title?: string; desc?: string }[];
      plans?: { feats?: string[] }[];
      steps?: { title?: string }[];
      stats?: { l?: string }[];
      testimonials?: { name?: string; role?: string; text?: string }[];
      faqs?: { q?: string; a?: string }[];
    };
  };
};

const defaultPlans = [
  { name: "Basic", price: "1,500", originalPrice: "1,800", featured: false, feats: ["باقة أساسية", "تسليم سريع", "جولة تعديل واحدة", "دعم لمدة أسبوع"] },
  { name: "Pro", price: "3,500", originalPrice: "4,500", featured: true, feats: ["مخرجات إضافية", "جولتان تعديل", "ربط مع قنواتك", "دعم لمدة شهر", "أولوية في التنفيذ"] },
  { name: "Premium", price: "6,500", originalPrice: "8,500", featured: false, feats: ["كل ما في باقة Pro", "تخصيص متقدم", "تقارير دورية", "دعم أولوية"] },
];

export const defaultPlansEn = [
  { feats: ["Basic package", "Fast delivery", "One revision round", "One week of support"] },
  { feats: ["Extra deliverables", "Two revision rounds", "Channel integration", "One month of support", "Priority execution"] },
  { feats: ["Everything in Pro", "Advanced customization", "Periodic reports", "Priority support"] },
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
    i18n: {
      en: {
        category: "Development",
        breadcrumb: "Web Design",
        title: "Website Design",
        subtitle: "Fast, responsive websites that reflect your brand and drive conversion.",
        heroHighlights: ["Responsive design", "On-brand visuals", "Development & launch support"],
        overview: [
          { title: "Who it's for", desc: "Startups and brands wanting a strong digital presence and a professional website." },
          { title: "Why it matters", desc: "A clear interface builds trust, reduces friction, and boosts conversion." },
          { title: "Core value", desc: "A fast, responsive, secure site that reflects your identity and delivers real business results." },
        ],
        benefits: [
          { title: "Full project design", desc: "Consistent interfaces across every key page." },
          { title: "Professional UX", desc: "Clear, easy-to-use flows for every customer." },
          { title: "Scalable files", desc: "Clean code that's easy to edit and extend." },
          { title: "Mobile & web versions", desc: "A perfect experience on every device." },
          { title: "Post-launch support", desc: "Technical follow-up for over a month after launch." },
        ],
        plans: [
          { feats: ["5-page design", "Responsive", "Simple identity", "Initial content copy"] },
          { feats: ["10-page design", "Complete identity", "Contact form integration", "Speed optimization", "Basic SEO"] },
          { feats: ["Everything in Pro", "E-commerce store", "Admin dashboard", "Priority support"] },
        ],
      },
    },
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
    i18n: {
      en: {
        category: "Design",
        breadcrumb: "UI/UX Design",
        title: "UI/UX Design",
        subtitle: "Easy, attractive interfaces focused on conversion and user experience.",
        heroHighlights: ["Modern UI/UX design", "Complete design system", "Interactive, dev-ready prototypes"],
        overview: [
          { title: "Who it's for", desc: "Owners of digital products and apps who want a standout user experience." },
          { title: "Why it matters", desc: "Thoughtful UX raises engagement and reduces bounce rate." },
          { title: "Core value", desc: "A cohesive design system that simplifies development and keeps visual identity consistent." },
        ],
        benefits: [
          { title: "Color & typography system", desc: "Consistent visual identity across every screen." },
          { title: "Clear user flows", desc: "User flows focused on the customer's goal." },
          { title: "Responsive design", desc: "Perfect interfaces on mobile and desktop." },
          { title: "Organized Figma files", desc: "Handover files ready for development and sharing." },
          { title: "Implementation support", desc: "Working alongside the dev team through launch." },
        ],
        plans: defaultPlansEn,
      },
    },
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
    i18n: {
      en: {
        category: "Design",
        breadcrumb: "Ad Banner Design",
        title: "Ad Banner Design",
        subtitle: "Eye-catching visual assets for your digital campaigns across every platform.",
        heroHighlights: ["Designs in multiple sizes", "Compatible with ad platforms", "Fast delivery"],
        overview: [
          { title: "Who it's for", desc: "Companies and marketers who need professional ad assets for their campaigns." },
          { title: "Why it matters", desc: "A strong banner raises CTR and improves campaign performance." },
          { title: "Core value", desc: "Designs that grab attention and convey the message precisely." },
        ],
        benefits: [
          { title: "High-resolution designs", desc: "Assets ready for print and digital publishing." },
          { title: "Clear message", desc: "A strong call-to-action that drives action." },
          { title: "On-brand visuals", desc: "Colors and fonts aligned with your brand." },
          { title: "Multiple sizes", desc: "Stories, Posts, and Display ads." },
          { title: "Flexible revisions", desc: "Revision rounds until you're fully satisfied." },
        ],
        plans: defaultPlansEn,
      },
    },
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
    i18n: {
      en: {
        category: "Social Media",
        breadcrumb: "Social Media Design",
        title: "Social Media Design",
        subtitle: "Professional posts consistent with your brand identity.",
        heroHighlights: ["Complete monthly designs", "Unified visual identity", "Engaging interactive content"],
        overview: [
          { title: "Who it's for", desc: "Brands that want a strong, consistent presence on social media." },
          { title: "Why it matters", desc: "Regular visual content builds audience trust and boosts engagement." },
          { title: "Core value", desc: "Content that reflects your brand personality and meets your marketing goals." },
        ],
        benefits: [
          { title: "Consistent visual identity", desc: "Every post speaks the same language." },
          { title: "Posts & Stories design", desc: "Content tailored to every platform." },
          { title: "Purpose-driven content", desc: "Designs with clear marketing objectives." },
          { title: "Ready to publish", desc: "Every required size and format." },
          { title: "Monthly plan", desc: "An organized, trackable content calendar." },
        ],
        plans: defaultPlansEn,
      },
    },
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
    i18n: {
      en: {
        category: "Social Media",
        breadcrumb: "Social Media Account Setup",
        title: "Social Media Account Setup & Management",
        subtitle: "Configure accounts and build a strong presence on every platform.",
        heroHighlights: ["Account creation & setup", "Bio & Highlights design", "Launch strategy"],
        overview: [
          { title: "Who it's for", desc: "Brands and companies starting their social media presence." },
          { title: "Why it matters", desc: "A proper start saves time and raises the quality of your digital presence." },
          { title: "Core value", desc: "Professional accounts ready to grow from day one." },
        ],
        benefits: [
          { title: "Complete account setup", desc: "Professional configuration on every platform." },
          { title: "Account identity design", desc: "Profile picture, cover, and highlights." },
          { title: "Content strategy", desc: "An initial plan for the first 30 days." },
          { title: "Initial audience growth", desc: "Tips to reach your target audience." },
          { title: "Team training", desc: "A session to explain how to manage accounts." },
        ],
        plans: defaultPlansEn,
      },
    },
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
    i18n: {
      en: {
        category: "Design",
        breadcrumb: "Ad Video Design",
        title: "Ad Video Design",
        subtitle: "Short, high-impact videos that tell your brand's story.",
        heroHighlights: ["Professional motion graphics", "Reels, TikTok & YouTube", "Scripting and copywriting"],
        overview: [
          { title: "Who it's for", desc: "Brands and products that want video content that attracts and converts." },
          { title: "Why it matters", desc: "Video drives the highest engagement and reach on every platform." },
          { title: "Core value", desc: "Visual content that stays with your customer and drives action." },
        ],
        benefits: [
          { title: "Motion graphics", desc: "Professional animation that grabs attention." },
          { title: "Script & storyboard", desc: "Every video serves a clear goal." },
          { title: "Visual identity", desc: "Colors and fonts aligned with the brand." },
          { title: "Multiple sizes", desc: "Reels, Stories, YouTube, TikTok." },
          { title: "Flexible revisions", desc: "Revision rounds to ensure your satisfaction." },
        ],
        plans: defaultPlansEn,
      },
    },
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
    i18n: {
      en: {
        category: "Marketing",
        breadcrumb: "Ad Campaign Launch",
        title: "Ad Campaign Launch & Management",
        subtitle: "Thoughtful, targeted paid campaigns engineered for maximum ROI.",
        heroHighlights: ["Meta, Google & TikTok Ads", "Precise audience targeting", "Weekly performance reports"],
        overview: [
          { title: "Who it's for", desc: "Companies that want measurable marketing results on a controlled budget." },
          { title: "Why it matters", desc: "A well-planned campaign delivers better results on the same budget." },
          { title: "Core value", desc: "Clear, measurable ROI on every riyal spent." },
        ],
        benefits: [
          { title: "Precise targeting", desc: "Reach an audience that's genuinely interested." },
          { title: "Full campaign management", desc: "From setup to daily optimization." },
          { title: "Transparent reporting", desc: "Detailed results delivered on a regular cadence." },
          { title: "Continuous optimization", desc: "A/B testing to lift performance." },
          { title: "Strategic consultation", desc: "A long-term growth plan." },
        ],
        plans: defaultPlansEn,
      },
    },
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
    i18n: {
      en: {
        category: "Marketing",
        breadcrumb: "Digital Marketing",
        title: "Digital Marketing",
        subtitle: "An integrated growth strategy combining content, conversion, and analytics.",
        heroHighlights: ["Content strategy", "Multi-channel campaigns", "Performance analysis"],
        overview: [
          { title: "Who it's for", desc: "Companies looking for comprehensive, sustainable digital growth." },
          { title: "Why it matters", desc: "Integrated digital marketing delivers results that compound over time." },
          { title: "Core value", desc: "Real growth in sales and brand awareness." },
        ],
        benefits: [
          { title: "Integrated growth plan", desc: "A documented, executable strategy." },
          { title: "Marketing channel management", desc: "Social, ads, and email marketing." },
          { title: "Audience definition", desc: "Precise personas for every channel." },
          { title: "Monthly reporting", desc: "Clear performance KPIs." },
          { title: "Regular meetings", desc: "Continuous follow-up to improve results." },
        ],
        plans: defaultPlansEn,
      },
    },
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
    i18n: {
      en: {
        category: "Development",
        breadcrumb: "Bug Fixing",
        title: "Software Bug Fixing",
        subtitle: "Resolve issues and improve the stability and performance of your apps and sites.",
        heroHighlights: ["Precise issue diagnosis", "Performance optimization", "Comprehensive testing"],
        overview: [
          { title: "Who it's for", desc: "Site and app owners facing bugs or slowness." },
          { title: "Why it matters", desc: "Bugs cost sales and customer trust." },
          { title: "Core value", desc: "A stable, fast system that runs reliably." },
        ],
        benefits: [
          { title: "Comprehensive diagnosis", desc: "Pinpoint the root cause precisely." },
          { title: "Professional fix", desc: "Permanent, not temporary, solutions." },
          { title: "Performance optimization", desc: "Speed up the site and reduce load time." },
          { title: "Thorough testing", desc: "Make sure the issue won't return." },
          { title: "Post-fix support", desc: "Follow-up to ensure stability." },
        ],
        plans: defaultPlansEn,
      },
    },
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
    i18n: {
      en: {
        category: "Marketing",
        breadcrumb: "SEO",
        title: "Search Engine Optimization (SEO)",
        subtitle: "Lift your search rankings and grow organic traffic.",
        heroHighlights: ["Full technical audit", "Keyword research", "Content & structure optimization"],
        overview: [
          { title: "Who it's for", desc: "Site owners who want free, sustainable traffic from Google." },
          { title: "Why it matters", desc: "Organic traffic carries more trust and is cheaper in the long run." },
          { title: "Core value", desc: "Better visibility in search means more customers." },
        ],
        benefits: [
          { title: "Keyword research", desc: "Pick the highest-impact keywords." },
          { title: "Technical optimization", desc: "Search-friendly site structure and performance." },
          { title: "Content optimization", desc: "Copy that serves both readers and search engines." },
          { title: "Periodic reports", desc: "Track rankings and traffic." },
          { title: "Ongoing consultation", desc: "Monthly follow-up to improve results." },
        ],
        plans: defaultPlansEn,
      },
    },
  },
];

export const serviceMap: Record<string, ServiceContent> = Object.fromEntries(
  services.map((s) => [s.slug, s]),
);
