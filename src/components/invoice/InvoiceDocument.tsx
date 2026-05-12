import React from "react";
import sarLogo from "@/assets/sar.png";
import { publicApi } from "@/lib/api";

const SETTINGS_KEY = "saba_invoice_settings_v1";

function readCachedCompany(): { company?: InvoiceCompany; logo?: string; invoiceLogo?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    const s = JSON.parse(raw);
    return { company: s?.company, logo: s?.logo, invoiceLogo: s?.invoiceLogo };
  } catch { return {}; }
}

function useAutoCompany(data: InvoiceData): InvoiceData {
  const [extra, setExtra] = React.useState(() => readCachedCompany());
  React.useEffect(() => {
    if (data.company && (data.invoiceLogo || data.logo || data.company.logo || data.company.invoiceLogo)) return;
    let alive = true;
    (async () => {
      try {
        const res: any = await publicApi.getSiteSettings();
        const d = res?.data ?? res;
        if (!alive || !d) return;
        try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(d)); } catch {}
        setExtra({ company: d.company, logo: d.logo, invoiceLogo: d.invoiceLogo });
      } catch {}
    })();
    return () => { alive = false; };
  }, [data]);
  return {
    ...data,
    logo: data.logo ?? extra.logo,
    invoiceLogo: data.invoiceLogo ?? extra.invoiceLogo,
    company: { ...(extra.company || {}), ...(data.company || {}) },
  };
}

export type InvoiceLine = {
  title: string;
  qty: number;
  price: number;
};

export type InvoiceCompany = {
  logo?: string;
  invoiceLogo?: string;
  nameAr?: string;
  nameEn?: string;
  commercialRegister?: string;
  taxNumber?: string;
  addressAr?: string;
  addressEn?: string;
  phone?: string;
  email?: string;
  website?: string;
  iban?: string;
  bankName?: string;
  invoiceFooterNoteAr?: string;
  invoiceFooterNoteEn?: string;
};

export type InvoiceData = {
  number: string;
  date: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCity?: string;
  paymentMethod?: string;
  paymentStatus?: "paid" | "unpaid" | "refunded" | string;
  items: InvoiceLine[];
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
  /** Optional language for company labels (defaults to 'ar') */
  lang?: "ar" | "en";
  /** Site-wide logo (used as fallback for invoice logo) */
  logo?: string;
  /** Preferred invoice logo (white version for dark header) */
  invoiceLogo?: string;
  /** Company info from site settings */
  company?: InvoiceCompany;
};

const SAR = ({ n }: { n: number }) => (
  <span className="inline-flex items-center gap-1" dir="ltr">
    <span>{new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 2 }).format(n)}</span>
    <img src={sarLogo} alt="SAR" style={{ height: "0.85em", width: "auto", opacity: 0.9 }} />
  </span>
);

export const InvoiceDocument = React.forwardRef<HTMLDivElement, { data: InvoiceData }>(({ data: input }, ref) => {
  const data = useAutoCompany(input);
  const paid = data.paymentStatus === "paid";
  const lang = data.lang === "en" ? "en" : "ar";
  const isAr = lang === "ar";
  const c: InvoiceCompany = data.company || {};
  const logoUrl = data.invoiceLogo || c.invoiceLogo || data.logo || c.logo;
  const companyName = (isAr ? (c.nameAr || c.nameEn) : (c.nameEn || c.nameAr)) || "سابا ديزاين";
  const companySub = isAr ? "Saba Design" : "سابا ديزاين";
  const address = (isAr ? (c.addressAr || c.addressEn) : (c.addressEn || c.addressAr)) || "";
  const footerNote = (isAr ? (c.invoiceFooterNoteAr || c.invoiceFooterNoteEn) : (c.invoiceFooterNoteEn || c.invoiceFooterNoteAr)) || "";

  const L = (a: string, e: string) => (isAr ? a : e);

  return (
    <div
      ref={ref}
      dir={isAr ? "rtl" : "ltr"}
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "#ffffff",
        color: "#1a1a1a",
        fontFamily: "'Tajawal','Segoe UI',Tahoma,Arial,sans-serif",
        padding: "0",
        boxSizing: "border-box",
      }}
    >
      {/* Header band */}
      <div
        style={{
          background: "linear-gradient(135deg,#1E5B94,#143f68)",
          color: "#fff",
          padding: "28px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt={companyName}
              crossOrigin="anonymous"
              style={{ height: 56, width: "auto", maxWidth: 180, objectFit: "contain" }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{companyName}</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{companySub}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{L("فاتورة ضريبية", "Tax Invoice")}</div>
          </div>
        </div>
        <div style={{ textAlign: isAr ? "left" : "right" }}>
          <div style={{ fontSize: 11, opacity: 0.85 }}>{L("رقم الفاتورة", "Invoice #")}</div>
          <div dir="ltr" style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>#{data.number}</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 8 }}>{L("التاريخ", "Date")}</div>
          <div dir="ltr" style={{ fontWeight: 700 }}>{data.date}</div>
        </div>
      </div>

      {/* Company meta strip */}
      {(c.commercialRegister || c.taxNumber || address || c.phone || c.email || c.website) && (
        <div
          style={{
            background: "#f3f6fa",
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            fontSize: 11,
            color: "#374151",
          }}
        >
          {c.taxNumber && (
            <div><strong>{L("الرقم الضريبي:", "Tax #:")}</strong> <span dir="ltr">{c.taxNumber}</span></div>
          )}
          {c.commercialRegister && (
            <div><strong>{L("السجل التجاري:", "CR #:")}</strong> <span dir="ltr">{c.commercialRegister}</span></div>
          )}
          {address && (
            <div style={{ gridColumn: "1 / -1" }}><strong>{L("العنوان:", "Address:")}</strong> {address}</div>
          )}
          {c.phone && (
            <div><strong>{L("الجوال:", "Phone:")}</strong> <span dir="ltr">{c.phone}</span></div>
          )}
          {c.email && (
            <div><strong>{L("البريد:", "Email:")}</strong> <span dir="ltr">{c.email}</span></div>
          )}
          {c.website && (
            <div style={{ gridColumn: "1 / -1" }}><strong>{L("الموقع:", "Website:")}</strong> <span dir="ltr">{c.website}</span></div>
          )}
        </div>
      )}

      {/* Body */}
      <div style={{ padding: "28px 40px" }}>
        {/* Parties */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, fontSize: 13 }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>{L("فاتورة إلى", "Bill to")}</div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{data.clientName || "—"}</div>
            {data.clientEmail && <div style={{ color: "#4b5563", marginTop: 2 }}>{data.clientEmail}</div>}
            {data.clientPhone && <div dir="ltr" style={{ color: "#4b5563", marginTop: 2 }}>{data.clientPhone}</div>}
            {data.clientCity && <div style={{ color: "#4b5563", marginTop: 2 }}>{data.clientCity}</div>}
          </div>
          <div style={{ textAlign: isAr ? "left" : "right" }}>
            <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>{L("طريقة الدفع", "Payment method")}</div>
            <div style={{ fontWeight: 700 }}>{data.paymentMethod || "—"}</div>
            <div style={{ marginTop: 10 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  background: paid ? "#d1fae5" : "#fef3c7",
                  color: paid ? "#065f46" : "#92400e",
                }}
              >
                {paid ? L("مدفوعة", "Paid") : data.paymentStatus === "refunded" ? L("مستردة", "Refunded") : L("بانتظار الدفع", "Awaiting payment")}
              </span>
            </div>
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f3f6fa", color: "#374151" }}>
              <th style={{ textAlign: isAr ? "right" : "left", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>{L("الخدمة", "Service")}</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12, width: 80 }}>{L("الكمية", "Qty")}</th>
              <th style={{ textAlign: isAr ? "left" : "right", padding: "10px 12px", fontWeight: 700, fontSize: 12, width: 140 }}>{L("السعر", "Price")}</th>
              <th style={{ textAlign: isAr ? "left" : "right", padding: "10px 12px", fontWeight: 700, fontSize: 12, width: 140 }}>{L("الإجمالي", "Total")}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((it, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>{it.title}</td>
                <td style={{ padding: "12px", textAlign: "center" }} dir="ltr">{it.qty}</td>
                <td style={{ padding: "12px", textAlign: isAr ? "left" : "right" }}><SAR n={it.price} /></td>
                <td style={{ padding: "12px", textAlign: isAr ? "left" : "right", fontWeight: 700 }}><SAR n={it.price * it.qty} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: isAr ? "flex-start" : "flex-end", marginTop: 24 }}>
          <div style={{ width: 320, fontSize: 13 }}>
            <Row label={L("المجموع الفرعي", "Subtotal")} value={<SAR n={data.subtotal} />} />
            <Row label={L("ضريبة القيمة المضافة (15%)", "VAT (15%)")} value={<SAR n={data.vat} />} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
                paddingTop: 12,
                borderTop: "2px solid #1E5B94",
                color: "#1E5B94",
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              <span>{L("الإجمالي", "Total")}</span>
              <SAR n={data.total} />
            </div>
          </div>
        </div>

        {/* Bank details */}
        {(c.iban || c.bankName) && (
          <div style={{ marginTop: 24, padding: 14, background: "#f9fafb", borderRadius: 10, fontSize: 12, color: "#374151" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{L("بيانات التحويل البنكي", "Bank transfer details")}</div>
            {c.bankName && <div>{L("البنك:", "Bank:")} <strong>{c.bankName}</strong></div>}
            {c.iban && <div>IBAN: <strong dir="ltr">{c.iban}</strong></div>}
          </div>
        )}

        {data.notes && (
          <div style={{ marginTop: 16, padding: 14, background: "#f9fafb", borderRadius: 10, fontSize: 12, color: "#4b5563" }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{L("ملاحظات", "Notes")}</div>
            {data.notes}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 16, borderTop: "1px solid #e5e7eb", textAlign: "center", color: "#6b7280", fontSize: 11 }}>
          {footerNote ? (
            <div style={{ marginBottom: 6 }}>{footerNote}</div>
          ) : (
            <div style={{ marginBottom: 6 }}>{L("شكراً لاختياركم", "Thank you for your business")} {companyName}</div>
          )}
          <div style={{ color: "#9ca3af" }}>
            {[c.website, c.email, c.phone].filter(Boolean).join(" • ")}
          </div>
        </div>
      </div>
    </div>
  );
});
InvoiceDocument.displayName = "InvoiceDocument";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#4b5563" }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, color: "#1f2937" }}>{value}</span>
    </div>
  );
}
