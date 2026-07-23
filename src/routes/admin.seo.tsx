import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({
    meta: [
      { title: 'إعدادات SEO | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.seo"), "SeoPage"),
});
