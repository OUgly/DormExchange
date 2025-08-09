"use client"
// app/page.tsx
"use client";
import raw from "@/data/listings.json";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import FilterPills from "@/components/ui/FilterPills";
import CampusSwitcher from "@/components/ui/CampusSwitcher";

const CATS = ["All", "Books", "Furniture", "Electronics", "Clothing"] as const;
// List your supported campuses here:
const CAMPUSES = ["All", "UAlbany", "Babson", "NYU"];

export default function Home() {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").toLowerCase();

  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [campus, setCampus] = useState<string>("All");

  const listings = raw as any[];

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const inCat = cat === "All" ? true : l.category === cat;
      const inCampus = campus === "All" ? true : (l.campus === campus);
      const haystack = [l.title, l.description, l.campus].join(" ").toLowerCase();
      const matches = q ? haystack.includes(q) : true;
      return inCat && inCampus && matches;
    });
  }, [q, cat, campus, listings]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6">
      {/* Hero */}
      <section className="text-center mt-10 md:mt-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Buy & Sell on Campus</h1>
        <p className="text-neutral-400 mt-3">Find great deals from fellow students</p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/listings/new")}
            className="bg-accent hover:bg-accent/90 text-white rounded-xl px-5 py-2"
          >
            Post a Listing
          </button>
        </div>
      </section>

      {/* Filters row: Category (left) + Campus (right) */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <FilterPills value={cat} onChange={setCat} />
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 text-sm">Campus:</span>
          <CampusSwitcher value={campus} onChange={setCampus} campuses={CAMPUSES} />
        </div>
      </div>

      {/* Grid / Empty state */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-panel p-8 text-center">
          <div className="text-lg font-semibold">No results</div>
          <p className="text-neutral-400 mt-2">
            Try another search, category, or campus.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((l) => (
            <ListingCard
              key={l.id}
              id={l.id}
              title={l.title}
              price={l.price}
              campus={l.campus}
              condition={l.condition}
              imageUrl={l.imageUrls?.[0]}
              featured={l.featured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
