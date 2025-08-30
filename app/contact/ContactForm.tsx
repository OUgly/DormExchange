"use client"

import { useFormState, useFormStatus } from "react-dom"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { sendContact, type ContactActionState } from "./actions"
import { useEffect } from "react"

const initialState: ContactActionState = { ok: false, error: "" }

export default function ContactForm() {
  const [state, formAction] = useFormState(sendContact, initialState)

  // Reset form on success
  useEffect(() => {
    if (state?.ok) {
      const form = document.getElementById("contact-form") as HTMLFormElement | null
      form?.reset()
    }
  }, [state?.ok])

  return (
    <form id="contact-form" action={formAction} className="max-w-xl space-y-4">
      {/* Honeypot: hidden field bots may fill */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label className="block mb-1 text-sm text-white/80">Name</label>
        <Input name="name" placeholder="Your name" required aria-invalid={!!(state as any)?.issues?.name} />
        {hasIssue(state, "name") && (
          <p className="mt-1 text-sm text-red-400">{firstIssue(state, "name")}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm text-white/80">Email</label>
        <Input name="email" type="email" placeholder="you@example.com" required aria-invalid={!!(state as any)?.issues?.email} />
        {hasIssue(state, "email") && (
          <p className="mt-1 text-sm text-red-400">{firstIssue(state, "email")}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm text-white/80">Subject</label>
        <Input name="subject" placeholder="What’s this about?" required aria-invalid={!!(state as any)?.issues?.subject} />
        {hasIssue(state, "subject") && (
          <p className="mt-1 text-sm text-red-400">{firstIssue(state, "subject")}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm text-white/80">Message</label>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Type your message..."
          className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-2 focus:border-yellow-400 focus:ring-yellow-400/20 outline-none"
          aria-invalid={!!(state as any)?.issues?.message}
        />
        {hasIssue(state, "message") && (
          <p className="mt-1 text-sm text-red-400">{firstIssue(state, "message")}</p>
        )}
      </div>

      <div className="pt-2 flex items-center gap-3">
        <SubmitButton />
        {state?.ok && <p className="text-green-400 text-sm">Message sent. Thanks for reaching out!</p>}
        {state?.ok === false && state.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Send Message"}
    </Button>
  )
}

function hasIssue(state: ContactActionState | undefined, key: string) {
  return Boolean((state as any)?.issues?.[key]?.length)
}

function firstIssue(state: ContactActionState | undefined, key: string) {
  const list = (state as any)?.issues?.[key] as string[] | undefined
  return list?.[0] || ""
}

