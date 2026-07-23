import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: 'سياسة الخصوصية | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/privacy"), "PrivacyPage"),
});
