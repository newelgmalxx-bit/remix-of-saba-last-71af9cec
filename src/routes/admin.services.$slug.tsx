import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/services/$slug")({
  head: () => ({
    meta: [
      { title: 'تعديل الخدمة | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.services.$slug"), "ServiceEditorPage"),
});
