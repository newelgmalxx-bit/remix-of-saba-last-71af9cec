import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: 'نسيت كلمة المرور | سابا ديزاين' },
      { name: "description", content: 'استعادة كلمة المرور لحسابك في سابا ديزاين.' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/forgot-password"), "ForgotPasswordPage"),
});
