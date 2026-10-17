import { z } from "zod";
import type { InquiryFormData } from "./contact-schema";

export interface InquiryEmailConfig {
  apiKey: string;
  from: string;
  to: string;
}
export interface InquiryEmail {
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}

export function getInquiryEmailConfig(
  environment: Record<string, string | undefined>,
): InquiryEmailConfig | null {
  const apiKey = environment.RESEND_API_KEY?.trim();
  const from = environment.INQUIRY_FROM_EMAIL?.trim();
  const to = environment.INQUIRY_TO_EMAIL?.trim();
  if (
    !apiKey?.startsWith("re_") ||
    /your|placeholder|example/i.test(apiKey) ||
    !from ||
    !to
  )
    return null;
  if (!z.email().safeParse(from).success || !z.email().safeParse(to).success)
    return null;
  return { apiKey, from, to };
}

export function escapeHtml(value: string) {
  const replacements: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => replacements[character]);
}

export function buildInquiryEmail(
  data: InquiryFormData,
  configuration: InquiryEmailConfig,
): InquiryEmail {
  const direction = {
    import: "Visitor wants to import",
    export: "Visitor wants to export",
    both: "Import and export / discussion",
  }[data.tradeType];
  const fields = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone / WhatsApp", data.phone],
    ["Company", data.company || "Not provided"],
    ["Country", data.country],
    ["Product / Category", data.productInterest],
    ["Trade Direction", direction],
  ];
  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th style="padding:10px;text-align:left;vertical-align:top;border-bottom:1px solid #e5e7eb;font-size:14px">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-size:14px;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return {
    from: `A2 Meridian Website <${configuration.from}>`,
    to: [configuration.to],
    replyTo: data.email,
    subject: `Trade inquiry: ${data.name} - ${data.productInterest}`,
    text: `A2 Meridian Associates - New Trade Inquiry\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nMessage:\n${data.message}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111827"><div style="background:#0a1628;padding:24px"><h1 style="color:#e4bc66;font-size:24px;margin:0">A2 Meridian Associates</h1><p style="color:#c5ced9">New trade inquiry</p></div><table style="width:100%;border-collapse:collapse">${rows}</table><div style="padding:24px;background:#f5f5f0"><h2 style="font-size:18px">Message</h2><p style="white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7">${escapeHtml(data.message)}</p></div></div>`,
  };
}
