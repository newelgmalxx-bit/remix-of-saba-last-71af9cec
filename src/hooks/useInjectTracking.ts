import { useEffect } from "react";
import { BASE } from "@/lib/api/client";

type Pixel = { key: string; value: string; enabled: boolean };
type TrackingSettings = { pixels?: Pixel[]; head?: string; body?: string };

const MARK = "data-saba-tracking";

function injectRawHTML(html: string, target: HTMLElement, slot: string) {
  if (!html) return;
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  Array.from(tpl.content.childNodes).forEach((node) => {
    if (node.nodeType === 1) {
      const el = node as HTMLElement;
      // Re-create <script> so the browser executes it
      if (el.tagName === "SCRIPT") {
        const s = document.createElement("script");
        for (const a of Array.from(el.attributes)) s.setAttribute(a.name, a.value);
        s.text = el.textContent || "";
        s.setAttribute(MARK, slot);
        target.appendChild(s);
      } else {
        el.setAttribute(MARK, slot);
        target.appendChild(el);
      }
    } else if (node.nodeType === 3 && node.textContent?.trim()) {
      target.appendChild(node.cloneNode(true));
    }
  });
}

function addScriptSrc(src: string, slot: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  s.setAttribute(MARK, slot);
  document.head.appendChild(s);
}

function addInline(code: string, slot: string) {
  const s = document.createElement("script");
  s.text = code;
  s.setAttribute(MARK, slot);
  document.head.appendChild(s);
}

function injectPixel(p: Pixel) {
  const v = p.value.trim();
  if (!v) return;
  const slot = `pixel:${p.key}`;
  switch (p.key) {
    case "ga4": {
      addScriptSrc(`https://www.googletagmanager.com/gtag/js?id=${v}`, slot);
      addInline(
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${v}');`,
        slot,
      );
      break;
    }
    case "gtm": {
      addInline(
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${v}');`,
        slot,
      );
      const ns = document.createElement("noscript");
      ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${v}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      ns.setAttribute(MARK, slot);
      document.body.insertBefore(ns, document.body.firstChild);
      break;
    }
    case "google_ads": {
      addScriptSrc(`https://www.googletagmanager.com/gtag/js?id=${v}`, slot);
      addInline(
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${v}');`,
        slot,
      );
      break;
    }
    case "meta": {
      addInline(
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${v}');fbq('track','PageView');`,
        slot,
      );
      const ns = document.createElement("noscript");
      ns.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${v}&ev=PageView&noscript=1"/>`;
      ns.setAttribute(MARK, slot);
      document.body.appendChild(ns);
      break;
    }
    case "tiktok": {
      addInline(
        `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${v}');ttq.page();}(window,document,'ttq');`,
        slot,
      );
      break;
    }
    case "snapchat": {
      addInline(
        `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','${v}');snaptr('track','PAGE_VIEW');`,
        slot,
      );
      break;
    }
    case "linkedin": {
      addInline(
        `_linkedin_partner_id='${v}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s);})(window.lintrk);`,
        slot,
      );
      break;
    }
    case "hotjar": {
      addInline(
        `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${Number(v) || 0},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
        slot,
      );
      break;
    }
    case "clarity": {
      addInline(
        `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${v}");`,
        slot,
      );
      break;
    }
  }
}

let injected = false;

export function useInjectTracking() {
  useEffect(() => {
    if (injected || typeof window === "undefined") return;
    injected = true;
    (async () => {
      try {
        const res = await fetch(`${BASE}/site/tracking`, { headers: { Accept: "application/json" } });
        if (!res.ok) return;
        const json = await res.json();
        const s: TrackingSettings = (json?.data ?? json) || {};
        (s.pixels || []).filter((p) => p.enabled && p.value).forEach(injectPixel);
        if (s.head) injectRawHTML(s.head, document.head, "custom:head");
        if (s.body) injectRawHTML(s.body, document.body, "custom:body");
      } catch {
        /* tracking endpoint unavailable — silently skip */
      }
    })();
  }, []);
}