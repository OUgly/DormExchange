"use server"

import nodemailer from "nodemailer"
import { z } from "zod"

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email required").max(320),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
  // Honeypot anti-spam field (should be empty)
  website: z.string().optional(),
})

export type ContactActionState =
  | { ok: true }
  | { ok: false; error: string; issues?: Record<string, string[]> }

export async function sendContact(_: ContactActionState | undefined, formData: FormData): Promise<ContactActionState> {
  const data = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    subject: String(formData.get("subject") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    website: String(formData.get("website") || "").trim(),
  }

  // Simple honeypot check
  if (data.website) {
    // Silently succeed to avoid leaking signal to bots
    return { ok: true }
  }

  const parsed = ContactSchema.safeParse(data)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = process.env.SMTP_SECURE === "true" || port === 465

  if (!host || !user || !pass) {
    return { ok: false, error: "Email is not configured on the server." }
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  const toAddress = process.env.CONTACT_TO || "dormxchangeteam@gmail.com"
  const fromAddress = process.env.CONTACT_FROM
  if (!fromAddress) {
    return { ok: false, error: "CONTACT_FROM not set. Configure a verified sender email." }
  }

  const subject = `[DormXchange Contact] ${parsed.data.subject}`
  const text = `New contact message from DormXchange\n\nName: ${parsed.data.name}\nEmail: ${parsed.data.email}\nSubject: ${parsed.data.subject}\n\nMessage:\n${parsed.data.message}`
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.5;">
      <h2 style="margin:0 0 12px;">New contact message</h2>
      <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(parsed.data.name)}</p>
      <p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(parsed.data.email)}</p>
      <p style="margin:0 0 12px;"><strong>Subject:</strong> ${escapeHtml(parsed.data.subject)}</p>
      <p style="white-space:pre-wrap;">${escapeHtml(parsed.data.message)}</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: { name: "DormXchange Website", address: fromAddress },
      to: toAddress,
      replyTo: parsed.data.email,
      subject,
      text,
      html,
    })
    return { ok: true }
  } catch (err: any) {
    console.error("Contact email failed:", err)
    return { ok: false, error: "Failed to send message. Please try again later." }
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;")
    .replaceAll(/\"/g, "&quot;")
    .replaceAll(/'/g, "&#039;")
}
