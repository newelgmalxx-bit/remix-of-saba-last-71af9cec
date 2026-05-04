import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks: { to: any; label: string }[] = [
  { to: "/", label: "الرئيسية" },
  { to: "/services", label: "خدماتنا" },
  { to: "/portfolio", label: "أعمالنا" },
  { to: "/about", label: "من نحن" },
  { to: "/blog", label: "المدونة" },
  { to: "/contact", label: "تواصل" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="سابا ديزاين"
            width={120}
            height={48}
            className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-bold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:border-primary hover:text-primary">
            <Globe className="h-3.5 w-3.5" /> EN
          </button>
          <Link
            to={"/login" as any}
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-dark"
          >
            تسجيل الدخول
          </Link>
        </div>

        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
                activeProps={{ className: "text-primary font-bold bg-primary-light" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={"/login" as any}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
            >
              تسجيل الدخول
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}