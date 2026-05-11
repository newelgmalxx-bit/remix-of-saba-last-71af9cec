import { createRoot } from "react-dom/client";
import { InvoiceDocument, type InvoiceData } from "@/components/invoice/InvoiceDocument";
import { downloadElementAsPdf, elementToPdfBlob } from "./invoice";

async function withInvoiceNode<T>(data: InvoiceData, fn: (node: HTMLElement) => Promise<T>): Promise<T | undefined> {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.top = "-10000px";
  host.style.left = "-10000px";
  host.style.zIndex = "-1";
  document.body.appendChild(host);

  const root = createRoot(host);
  await new Promise<void>((resolve) => {
    root.render(<InvoiceDocument data={data} />);
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  try { await (document as any).fonts?.ready; } catch {}

  const node = host.firstElementChild as HTMLElement | null;
  if (!node) { root.unmount(); host.remove(); return; }

  try {
    return await fn(node);
  } finally {
    root.unmount();
    host.remove();
  }
}

/** Render InvoiceDocument off-screen and trigger a PDF download. */
export async function renderInvoiceToPdf(data: InvoiceData) {
  await withInvoiceNode(data, (node) => downloadElementAsPdf(node, `invoice-${data.number}.pdf`));
}

/** Render InvoiceDocument off-screen and return the PDF as a Blob. */
export async function renderInvoiceToPdfBlob(data: InvoiceData): Promise<Blob | undefined> {
  return withInvoiceNode(data, (node) => elementToPdfBlob(node));
}
