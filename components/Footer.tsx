'use client'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-white/70">DormExchange — campus marketplace.</p>
        <form className="flex w-full max-w-sm gap-2 md:justify-end">
          <input
            type="email"
            placeholder="Email"
            className="flex-1 rounded-md border border-line bg-muted p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm text-white"
          >
            Subscribe
          </button>
        </form>
      </div>
    </footer>
  )
}
