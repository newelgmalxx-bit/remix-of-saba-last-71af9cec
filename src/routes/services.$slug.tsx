import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/services/$slug")({
  component: lazyRouteComponent(() => import("@/pages/routes/services.$slug"), "ServiceDetailPage"),
});
