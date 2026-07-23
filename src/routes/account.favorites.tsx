import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/account/favorites")({
  component: lazyRouteComponent(() => import("@/pages/routes/account.favorites"), "FavoritesPage"),
});
