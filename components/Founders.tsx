// components/Founders.tsx
import Link from 'next/link'

export default function Founders() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-2xl bg-surface/40 p-6 border border-white/5">
        <div className="grid gap-8 md:grid-cols-[1fr,1.2fr] items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">The story</h2>
            <p className="opacity-90">
              Hey — we’re <span className="font-semibold">Jake</span> and <span className="font-semibold">Louie</span>.
              We built DormXchange after hauling sofas up three flights and hunting down rare
              textbooks in random group chats. We wanted a simple, campus-only marketplace that
              actually felt safe and moved fast.
            </p>
            <p className="opacity-90">
              Our goal is to save students time and money every semester — and keep good stuff out
              of the dumpster during move-out week.
            </p>
            <div className="flex gap-3">
              <Link href="/campus" className="rounded-xl bg-yellow-400 text-black px-4 py-2 font-semibold hover:brightness-95 transition">
                Join your campus
              </Link>
              <Link href="/profile" className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20 transition">
                Say hi to the founders
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <figure className="rounded-2xl overflow-hidden border border-white/10 bg-surface/20">
              <img src="/founders/louie.jpg" alt="Louie" className="h-75 w-full object-cover" />
              <figcaption className="p-5 text-sm opacity-90">
                <div className="font-semibold mb-2 text-base">Louie</div>
                <div>UAlbany • Cybersecurity → builder</div>
              </figcaption>
            </figure>
            <figure className="rounded-2xl overflow-hidden border border-white/10 bg-surface/20">
              <img src="/founders/jake.jpg" alt="Jake" className="h-75 w-full object-cover" />
              <figcaption className="p-5 text-sm opacity-90">
                <div className="font-semibold mb-2 text-base">Jake</div>
                <div>Babson • Ops & growth</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs opacity-70">
        (Drop your photos at <code className="opacity-90">/public/founders/louie.jpg</code> and <code className="opacity-90">/public/founders/jake.jpg</code>; or keep stock images for now.)
      </p>
    </section>
  )
}
