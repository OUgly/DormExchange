// components/HowItWorks.tsx
export default function HowItWorks() {
  const steps = [
    { title: 'Pick your campus', body: 'Verify with your .edu email so buyers & sellers are real students.' },
    { title: 'List or browse', body: 'Snap a pic, set a price, or search by category, condition, or price.' },
    { title: 'Meet up safely', body: 'On-campus, cash or app — your community, your rules.' },
  ]
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="text-2xl font-semibold mb-6">How it works</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.title} className="rounded-2xl bg-surface/40 p-5 border border-white/5">
            <div className="text-lg font-semibold">{s.title}</div>
            <p className="mt-2 text-sm opacity-90">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
