import { createRoot } from "react-dom/client";
import { InvoiceDocument, type InvoiceData } from "@/components/invoice/InvoiceDocument";
import { downloadElementAsPdf } from "./invoice";

/**
 * Render an InvoiceDocument off-screen, snapshot it to PDF, then clean up.
 */
export async function renderInvoiceToPdf(data: InvoiceData) {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.top = "-10000px";
  host.style.left = "-10000px";
  host.style.zIndex = "-1";
  document.body.appendChild(host);

  const root = createRoot(host);
  await new Promise<void>((resolve) => {
    root.render(<InvoiceDocument data={data} />);
    // Wait for fonts + images to be ready
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  try {
    await (document as any).fonts?.ready;
  } catch {}

  const node = host.firstElementChild as HTMLElement | null;
  if (!node) {
    root.unmount();
    host.remove();
    return;
  }

  try {
    await downloadElementAsPdf(node, `invoice-${data.number}.pdf`);
  } finally {
    root.unmount();
    host.remove();
  }
}