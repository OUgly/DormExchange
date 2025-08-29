export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="h-24 w-24 rounded-full bg-white/10" />
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-2 w-full rounded bg-white/10" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white/5 p-4 text-center">
            <div className="mx-auto mb-2 h-8 w-8 rounded bg-white/10" />
            <div className="mb-1 h-6 w-16 rounded bg-white/10" />
            <div className="mx-auto h-4 w-24 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-6">
        <div className="flex gap-4 border-b border-white/10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-24 rounded bg-white/10" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  )
}
