// app/page.tsx
import Link from 'next/link'
import { Suspense } from 'react'
import Founders from '@/components/Founders'
import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'

export const metadata = { title: 'DormExchange — Campus marketplace' }

export default async function HomePage() {
  return (
    <main className="relative">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_60%)]" />

      {/* HERO */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 pb-14 text-center">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs tracking-wide">
          As seen at <span className="opacity-80">UAlbany • Babson • NYU</span>
        </p>

        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold leading-tight">
          Buy & sell on your campus — fast, safe, student-only.
        </h1>

        <p className="mt-4 text-lg opacity-90">
          DormExchange connects students to trade textbooks, furniture, and everything in between —
          verified by your <span className="font-semibold">.edu</span> email.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/campus"
            className="rounded-xl bg-yellow-400 text-black px-5 py-3 font-semibold hover:brightness-95 transition"
          >
            Choose your campus
          </Link>
          <Link
            href="/market"
            className="rounded-xl bg-white/10 px-5 py-3 hover:bg-white/20 transition"
          >
            Browse listings
          </Link>
        </div>

        <div className="mt-4 text-xs opacity-80">EDU-only • No public spam • Zero listing fees</div>

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <img
            src="/hero-market-preview.jpg"
            alt="DormExchange market preview"
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* LIVE STATS (safe fallback inside) */}
      <Suspense fallback={<div className="mx-auto max-w-5xl px-6 pb-8"></div>}>
        <Stats />
      </Suspense>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* FOUNDERS STORY */}
      <Founders />

      {/* FINAL CTA */}
      <section className="mx-auto max-w-5xl px-6 py-14 text-center">
        <div className="rounded-2xl bg-white/5 p-8">
          <h3 className="text-2xl font-semibold">Ready to clean out your dorm (or furnish it)?</h3>
          <p className="mt-2 opacity-90">Pick your campus and post your first item in minutes.</p>
          <Link
            href="/campus"
            className="mt-6 inline-block rounded-xl bg-yellow-400 text-black px-5 py-3 font-semibold hover:brightness-95 transition"
          >
            Get started
          </Link>
        </div>
      </section>
    </main>
  )
}
