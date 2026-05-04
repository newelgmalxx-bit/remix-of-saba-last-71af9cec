import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Order } from "@/data/account";
import { paymentName, formatCurrency } from "@/data/account";

// Arabic-friendly invoice (uses default font; numbers and Latin render fine,
// Arabic text rendered via canvas would need embedded font — we keep labels short
// and use English/numbers for table cells, with Arabic header text.)

export function downloadInvoice(order: Order, clientName: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(30, 91, 148);
  doc.rect(0, 0, pageW, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("SABA DESIGN", 40, 45);
  doc.setFontSize(10);
  doc.text("Digital Experiences Agency", 40, 62);
  doc.setFontSize(11);
  doc.text("INVOICE / فاتورة", pageW - 40, 45, { align: "right" });
  doc.setFontSize(9);
  doc.text(`#${order.number}`, pageW - 40, 62, { align: "right" });

  // Meta block
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  let y = 120;
  doc.text(`Invoice No: ${order.number}`, 40, y);
  doc.text(`Date: ${order.createdAt}`, 40, y + 16);
  doc.text(`Status: ${order.status.toUpperCase()}`, 40, y + 32);
  doc.text(`Payment: ${paymentName(order.payment)} (${order.paid ? "PAID" : "UNPAID"})`, 40, y + 48);

  doc.text("Bill To:", pageW - 220, y);
  doc.setFont(undefined as any, "bold");
  doc.text(clientName, pageW - 220, y + 16);
  doc.setFont(undefined as any, "normal");

  // Items table
  autoTable(doc, {
    startY: y + 80,
    head: [["#", "Service", "Plan", "Qty", "Price", "Total"]],
    body: order.items.map((it, i) => [
      String(i + 1),
      it.serviceTitle,
      it.planName,
      String(it.qty),
      formatCurrency(it.price),
      formatCurrency(it.price * it.qty),
    ]),
    headStyles: { fillColor: [30, 91, 148], textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [245, 248, 252] },
    margin: { left: 40, right: 40 },
    styles: { fontSize: 10, cellPadding: 8 },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  const tx = pageW - 200;
  doc.setFontSize(10);
  doc.text("Subtotal:", tx, finalY);
  doc.text(formatCurrency(order.subtotal), pageW - 40, finalY, { align: "right" });
  doc.text("VAT (15%):", tx, finalY + 18);
  doc.text(formatCurrency(order.vat), pageW - 40, finalY + 18, { align: "right" });
  doc.setFontSize(13);
  doc.setFont(undefined as any, "bold");
  doc.setTextColor(30, 91, 148);
  doc.text("Total:", tx, finalY + 42);
  doc.text(formatCurrency(order.total), pageW - 40, finalY + 42, { align: "right" });

  // Footer
  doc.setFont(undefined as any, "normal");
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(9);
  doc.text(
    "Thank you for choosing SABA DESIGN.  •  www.sabadesign.com  •  hello@sabadesign.com",
    pageW / 2,
    doc.internal.pageSize.getHeight() - 30,
    { align: "center" },
  );

  doc.save(`invoice-${order.number}.pdf`);
}