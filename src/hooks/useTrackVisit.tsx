import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("saba:visit:sid");
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("saba:visit:sid", id);
  }
  return id;
}

function classifySource(referrer: string): string {
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("google")) return "google";
    if (host.includes("bing") || host.includes("yahoo") || host.includes("duckduckgo")) return "search";
    if (host.match(/(facebook|instagram|twitter|x\.com|tiktok|linkedin|youtube|snapchat|t\.co)/)) return "social";
    if (typeof window !== "undefined" && host === window.location.hostname) return "internal";
    return "referral";
  } catch {
    return "direct";
  }
}

export function useTrackVisit() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (path.startsWith("/admin")) return;
    const referrer = document.referrer || "";
    supabase.from("page_visits").insert({
      path,
      referrer: referrer || null,
      source: classifySource(referrer),
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
    }).then(({ error }) => {
      if (error) console.warn("[track] failed", error.message);
    });
  }, [path]);
}
