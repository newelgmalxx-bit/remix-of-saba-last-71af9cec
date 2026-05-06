import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import type { Order } from "@/data/account";
import { paymentName } from "@/data/account";
import type { InvoiceData } from "@/components/invoice/InvoiceDocument";

/**
 * Render any DOM node into a single-page A4 PDF and trigger a download.
 * The node should be sized at A4 (~794x1123 @ 96dpi) for best results.
 */
export async function downloadElementAsPdf(node: HTMLElement, fileName: string) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / canvas.height;
  let w = pageW;
  let h = pageW / ratio;
  if (h > pageH) {
    h = pageH;
    w = pageH * ratio;
  }
  const x = (pageW - w) / 2;
  pdf.addImage(imgData, "PNG", x, 0, w, h);
  pdf.save(fileName);
}

/** Build invoice data from a customer Order. */
export function orderToInvoiceData(order: Order, clientName: string): InvoiceData {
  return {
    number: order.number,
    date: order.createdAt,
    clientName,
    paymentMethod: paymentName(order.payment),
    paymentStatus: order.paid ? "paid" : (order.paymentStatus ?? "unpaid"),
    items: order.items.map((it) => ({
      title: `${it.serviceTitle}${it.planName ? " — " + it.planName : ""}`,
      qty: it.qty,
      price: it.price,
    })),
    subtotal: order.subtotal,
    vat: order.vat,
    total: order.total,
  };
}

/**
 * Convenience helper used by older call sites: render an off-screen
 * InvoiceDocument with the given data, snapshot to PDF, then clean up.
 */
export async function downloadInvoice(order: Order, clientName: string) {
  const { renderInvoiceToPdf } = await import("./renderInvoice");
  await renderInvoiceToPdf(orderToInvoiceData(order, clientName));
}