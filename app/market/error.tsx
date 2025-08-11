'use client'

export default function MarketError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="opacity-90 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
