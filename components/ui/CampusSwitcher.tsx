// components/ui/CampusSwitcher.tsx
"use client";

type Props = {
  value: string;                 // current campus (e.g., "All", "UAlbany")
  onChange: (campus: string) => void;
  campuses: string[];            // e.g., ["All","UAlbany","Babson","NYU"]
};

export default function CampusSwitcher({ value, onChange, campuses }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto -mx-2 px-2">
      {campuses.map((c) => {
        const active = c === value;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={[
              "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition",
              active
                ? "bg-accent/20 border-accent text-white"
                : "bg-muted border-line text-neutral-300 hover:bg-muted/80"
            ].join(" ")}
            aria-pressed={active}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
