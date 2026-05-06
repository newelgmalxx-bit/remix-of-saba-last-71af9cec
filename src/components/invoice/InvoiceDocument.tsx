import React from "react";
import sarLogo from "@/assets/sar.png";

export type InvoiceLine = {
  title: string;
  qty: number;
  price: number;
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
};

const SAR = ({ n }: { n: number }) => (
  <span className="inline-flex items-center gap-1" dir="ltr">
    <span>{new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 2 }).format(n)}</span>
    <img src={sarLogo} alt="SAR" style={{ height: "0.85em", width: "auto", opacity: 0.9 }} />
  </span>
);

/**
 * Print/PDF-friendly invoice. Renders an A4-sized RTL document.
 * Wrap with InvoicePreview for in-app preview, or pass to downloadInvoicePdf.
 */
export const InvoiceDocument = React.forwardRef<HTMLDivElement, { data: InvoiceData }>(({ data }, ref) => {
  const paid = data.paymentStatus === "paid";
  return (
    <div
      ref={ref}
      dir="rtl"
      style={{
        width: "794px", // A4 @ 96dpi
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
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>سابا ديزاين — Saba Design</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>فاتورة ضريبية</div>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 11, opacity: 0.85 }}>رقم الفاتورة</div>
          <div dir="ltr" style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>#{data.number}</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 8 }}>التاريخ</div>
          <div dir="ltr" style={{ fontWeight: 700 }}>{data.date}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "32px 40px" }}>
        {/* Parties */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, fontSize: 13 }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>فاتورة إلى</div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{data.clientName || "—"}</div>
            {data.clientEmail && <div style={{ color: "#4b5563", marginTop: 2 }}>{data.clientEmail}</div>}
            {data.clientPhone && <div dir="ltr" style={{ color: "#4b5563", marginTop: 2 }}>{data.clientPhone}</div>}
            {data.clientCity && <div style={{ color: "#4b5563", marginTop: 2 }}>{data.clientCity}</div>}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>طريقة الدفع</div>
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
                {paid ? "مدفوعة" : data.paymentStatus === "refunded" ? "مستردة" : "بانتظار الدفع"}
              </span>
            </div>
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 28, fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f3f6fa", color: "#374151" }}>
              <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>الخدمة</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12, width: 80 }}>الكمية</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700, fontSize: 12, width: 140 }}>السعر</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700, fontSize: 12, width: 140 }}>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((it, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>{it.title}</td>
                <td style={{ padding: "12px", textAlign: "center" }} dir="ltr">{it.qty}</td>
                <td style={{ padding: "12px", textAlign: "left" }}><SAR n={it.price} /></td>
                <td style={{ padding: "12px", textAlign: "left", fontWeight: 700 }}><SAR n={it.price * it.qty} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 24 }}>
          <div style={{ width: 320, fontSize: 13 }}>
            <Row label="المجموع الفرعي" value={<SAR n={data.subtotal} />} />
            <Row label="ضريبة القيمة المضافة (15%)" value={<SAR n={data.vat} />} />
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
              <span>الإجمالي</span>
              <SAR n={data.total} />
            </div>
          </div>
        </div>

        {data.notes && (
          <div style={{ marginTop: 28, padding: 14, background: "#f9fafb", borderRadius: 10, fontSize: 12, color: "#4b5563" }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>ملاحظات</div>
            {data.notes}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 16, borderTop: "1px solid #e5e7eb", textAlign: "center", color: "#9ca3af", fontSize: 11 }}>
          شكراً لاختياركم سابا ديزاين • www.sabadesign.com • hello@sabadesign.com
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