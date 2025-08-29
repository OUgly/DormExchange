// components/ListingSkeleton.tsx
export default function ListingSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 p-4 animate-pulse">
      <div className="h-40 w-full rounded-xl bg-white/10 mb-3" />
      <div className="h-4 w-2/3 bg-white/10 rounded mb-2" />
      <div className="h-3 w-1/3 bg-white/10 rounded mb-2" />
      <div className="h-6 w-14 bg-white/10 rounded" />
    </div>
  )
}

