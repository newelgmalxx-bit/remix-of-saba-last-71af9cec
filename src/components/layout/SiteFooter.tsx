import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import logo from "@/assets/logo-white.png";

export function SiteFooter() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="lg:col-span-1">
          <img src={logo} alt="سابا ديزاين" width={220} height={88} className="h-20 w-auto object-contain" />
          <p className="mt-5 text-base leading-8 text-white/80">
            وكالة رقمية متخصصة في تصميم وتطوير الحلول الرقمية المبتكرة لتحويل أفكارك إلى واقع.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="روابط سريعة"
          links={[
            { label: "الرئيسية", to: "/" },
            { label: "من نحن", to: "/about" },
            { label: "خدماتنا", to: "/services" },
            { label: "أعمالنا", to: "/portfolio" },
            { label: "تواصل معنا", to: "/contact" },
          ]}
        />
        <FooterCol
          title="خدماتنا"
          links={[
            { label: "تصميم مواقع الكترونية", to: "/services" },
            { label: "تصميم واجهات مستخدم", to: "/services" },
            { label: "إطلاق حملات إعلانية", to: "/services" },
            { label: "تحسين محركات البحث SEO", to: "/services" },
            { label: "تصميم سوشيال ميديا", to: "/services" },
          ]}
        />

        <div>
          <h4 className="mb-5 text-lg font-bold">تواصل معنا</h4>
          <ul className="space-y-3 text-base text-white/85">
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Phone className="h-5 w-5" />
              </span>
              +966 50 000 0000
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Mail className="h-5 w-5" />
              </span>
              info@sabadesign.sa
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <MapPin className="h-5 w-5" />
              </span>
              الرياض، المملكة العربية السعودية
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-white/70 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} سابا ديزاين. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="mb-5 text-lg font-bold">{title}</h4>
      <ul className="space-y-3 text-base text-white/85">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to as any} className="transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}