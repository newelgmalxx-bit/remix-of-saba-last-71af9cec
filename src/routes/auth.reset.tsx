import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/reset")({
  head: () => ({
    meta: [
      { title: 'إعادة تعيين كلمة المرور | سابا ديزاين' },
      { name: "description", content: 'إعادة تعيين كلمة المرور لحسابك في سابا ديزاين.' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/auth.reset"), "AuthResetPage"),
});
