export const metadata = {
  title: "Contact | DormXchange",
}

import ContactForm from "./ContactForm"

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-3">Contact Us</h1>
      <p className="text-white/80 mb-8">
        Have a question, feedback, or need help? Send us a message and we’ll get back to you at the email you provide.
      </p>
      <ContactForm />
    </div>
  )
}

