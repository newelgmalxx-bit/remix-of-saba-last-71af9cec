import { useInjectTracking } from "@/hooks/useInjectTracking";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useTrackVisit } from "@/hooks/useTrackVisit";

export function TrackingEffects() {
  useTrackVisit();
  useInjectTracking();
  usePageTracking();
  return null;
}