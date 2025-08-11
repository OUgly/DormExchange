import ListingSkeleton from '@/components/ListingSkeleton'

export default function Loading() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => <ListingSkeleton key={i} />)}
      </div>
    </main>
  )
}
