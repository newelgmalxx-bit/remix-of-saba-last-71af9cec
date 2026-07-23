import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: 'إنشاء حساب جديد | سابا ديزاين' },
      { name: "description", content: 'أنشئ حسابك في سابا ديزاين وابدأ بإدارة مشاريعك بسهولة.' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/signup"), "SignupPage"),
});
