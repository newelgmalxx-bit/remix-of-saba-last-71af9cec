import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: 'إعادة تعيين كلمة المرور | سابا ديزاين' },
      { name: "description", content: 'إعادة تعيين كلمة المرور لحسابك في سابا ديزاين.' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/reset-password"), "ResetPasswordPage"),
});
