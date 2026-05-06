import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type Props = {
  children: ReactNode;
  /** When true, also require admin/owner/manager/support role. */
  requireAdmin?: boolean;
};

export function AuthGuard({ children, requireAdmin = false }: Props) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      const safe = path && !path.startsWith("/login") && !path.startsWith("/signup") ? path : "/";
      navigate({ to: "/login", search: { redirect: safe } as any });
      return;
    }
    if (requireAdmin && !isAdmin) {
      navigate({ to: "/account" });
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, navigate, path]);

  if (loading || !isAuthenticated || (requireAdmin && !isAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // user is guaranteed not null here
  void user;
  return <>{children}</>;
}