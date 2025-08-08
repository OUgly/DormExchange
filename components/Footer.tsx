'use client'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel py-6">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <p className="text-sm text-neutral-300">DormExchange — campus marketplace.</p>
        <form className="flex w-full max-w-sm gap-2 md:justify-end">
          <input
            type="email"
            placeholder="Email"
            className="flex-1 rounded-xl border border-line bg-muted px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/50"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
          >
            Subscribe
          </button>
        </form>
      </div>
    </footer>
  )
}
