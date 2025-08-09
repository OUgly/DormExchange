'use client'
// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  return (
    <nav className="sticky top-0 z-40 bg-panel/95 backdrop-blur border-b border-line">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        <Link href="/" className="font-bold text-xl">DormExchange</Link>

        {/* Search */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-lg">
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.replace(q ? `/?q=${encodeURIComponent(q)}` : "/");
                }
              }}
              placeholder="Search…"
              aria-label="Search listings"
              className="w-full h-10 bg-muted text-white placeholder:text-neutral-200 placeholder:opacity-90
                         border border-line rounded-xl pl-9 pr-3
                         focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/60"
            />
          </div>
        </div>

        <Link href="/auth/login" className="bg-yellow-400 text-black px-4 py-2 rounded-xl hover:bg-yellow-300">
          Sign In
        </Link>
      </div>
    </nav>
  );
}
