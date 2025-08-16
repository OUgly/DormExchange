// app/about/page.tsx
import Link from 'next/link'
import FounderCard from '@/components/FounderCard'

export const metadata = {
  title: 'About • DormXchange',
  description:
    'DormXchange is the campus-only marketplace built by students, for students. Learn our mission and meet the founders.',
}

export default function AboutPage() {
  const founders = [
    {
      name: 'Louie',
      role: 'Builder • UAlbany',
      blurb:
        'Cybersecurity student turned product tinkerer. Handles app, infra, and making things fast.',
      img: '/founders/louie.jpg',
    },
    {
      name: 'Jake',
      role: 'Ops & Growth • Babson',
      blurb:
        'Keeps the flywheel spinning—student reps, partnerships, and making the market liquid.',
      img: '/founders/jake.jpg',
    },
  ]

  return (
    <main className="relative">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-14 pb-10">
        <p className="text-xs inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
          Student-only • .edu verified • No listing fees
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold">About DormXchange</h1>
        <p className="mt-3 text-lg opacity-90 max-w-3xl">
          We’re building the simplest, safest way for students to buy and sell on campus—without
          spam, strangers, or fees. DormXchange is built by students, for students.
        </p>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Keep it campus-only',
              body:
                'Every account is verified with a .edu email so your marketplace stays local and trusted.',
            },
            {
              title: 'Move fast, spend less',
              body:
                'Find the exact textbook or sofa on your campus today—no shipping, no wait.',
            },
            {
              title: 'Sustainable by default',
              body:
                'Give good stuff a second life and keep move-out week from filling the dumpster.',
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl bg-surface/40 p-5 border border-white/5"
            >
              <div className="text-lg font-semibold">{c.title}</div>
              <p className="mt-2 text-sm opacity-90">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl bg-surface/40 border border-white/5 p-6">
          <h2 className="text-2xl font-semibold">Our story</h2>
          <p className="mt-3 opacity-90">
            DormXchange started when two friends kept hauling furniture across campus and chasing
            textbook leads in random group chats. We wanted one place that felt safe, was only for
            students, and actually worked fast.
          </p>

          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            <li className="rounded-xl bg-black/20 p-4">
              <div className="text-sm opacity-70">Spring 2025</div>
              <div className="font-semibold">Idea & sketches</div>
              <p className="text-sm opacity-90 mt-1">
                Prototyped flows for campus-only access.
              </p>
            </li>
            <li className="rounded-xl bg-black/20 p-4">
              <div className="text-sm opacity-70">Summer 2025</div>
              <div className="font-semibold">First build</div>
              <p className="text-sm opacity-90 mt-1">
                Next.js + Supabase, private beta at Babson.
              </p>
            </li>
            <li className="rounded-xl bg-black/20 p-4">
              <div className="text-sm opacity-70">Fall 2025 →</div>
              <div className="font-semibold">Growing campuses</div>
              <p className="text-sm opacity-90 mt-1">
                Expanding to more schools with student reps.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Founders</h2>
        <div className="grid gap-6 sm:grid-cols-2 max-w-4xl">
          {founders.map((f) => (
            <FounderCard
              key={f.name}
              name={f.name}
              role={f.role}
              blurb={f.blurb}
              img={f.img}
            />
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="mx-auto max-w-5xl px-6 py-12 text-center">
        <div className="rounded-2xl bg-white/5 p-8">
          <h3 className="text-2xl font-semibold">Want DormXchange at your school?</h3>
          <p className="mt-2 opacity-90">
            We’re adding campuses and student reps this semester.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/campus"
              className="rounded-xl bg-yellow-400 text-black px-5 py-3 font-semibold hover:brightness-95 transition"
            >
              Choose your campus
            </Link>
            <a
              href="mailto:founders@dormxchange.com?subject=DormXchange%20campus%20request"
              className="rounded-xl bg-white/10 px-5 py-3 hover:bg-white/20 transition"
            >
              Contact us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
