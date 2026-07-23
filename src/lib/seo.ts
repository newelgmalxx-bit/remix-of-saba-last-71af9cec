// Shared SEO helpers — strong, consistent metadata across all pages.
export * from "./seo-lite";

import { abs, SITE } from "./seo-lite";

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string | number;
  rating?: { value: number; count: number };
}) {
  const node: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: abs(opts.image),
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
  };
  if (opts.price) {
    node.offers = {
      "@type": "Offer",
      price: String(opts.price).replace(/[^\d.]/g, ""),
      priceCurrency: "SAR",
      availability: "https://schema.org/InStock",
      url: opts.url,
    };
  }
  if (opts.rating) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: opts.rating.value,
      reviewCount: opts.rating.count,
    };
  }
  return node;
}
