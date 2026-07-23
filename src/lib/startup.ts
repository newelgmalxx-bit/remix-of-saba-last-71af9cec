export function runAfterCriticalPaint(callback: () => void, delay = 7000) {
  if (typeof window === "undefined") return;

  let timeoutId: number | undefined;
  const start = () => {
    timeoutId = window.setTimeout(() => {
      const w = window as Window &
        typeof globalThis & {
          requestIdleCallback?: (cb: () => void, options?: { timeout?: number }) => number;
        };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(callback, { timeout: 2500 });
      } else {
        callback();
      }
    }, delay);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  return () => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  };
}