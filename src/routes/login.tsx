import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: 'تسجيل الدخول | سابا ديزاين' },
      { name: "description", content: 'سجل دخولك للوصول إلى لوحة التحكم وإدارة مشاريعك بسهولة.' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/login"), "LoginPage"),
});
