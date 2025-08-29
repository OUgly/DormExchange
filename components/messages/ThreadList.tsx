import Link from 'next/link'

export default function ThreadList({ threads, currentThreadId }: { threads: any[]; currentThreadId: string }) {
  if (!threads.length) return <div className="p-4 text-sm text-gray-400">No conversations</div>
  return (
    <ul className="divide-y divide-white/10">
      {threads.map((row) => {
        const t = row.thread
        const other = row.other
        const latest = row.latest
        const active = t.id === currentThreadId
        return (
          <li key={t.id} className={active ? 'bg-white/10' : ''}>
            <Link href={`/messages/${t.id}`} className="flex items-center gap-3 p-3 hover:bg-white/10">
              {other?.avatar_url ? (
                <img src={other.avatar_url} alt={other.display_name || other.username || 'User'} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                  {(other?.display_name || other?.username || 'U').slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{other?.display_name || other?.username || 'User'}</p>
                  {row.listing && (
                    <span className="truncate rounded bg-white/10 px-1.5 py-0.5 text-xs">{row.listing.title}</span>
                  )}
                </div>
                <p className="truncate text-sm text-gray-400">{latest?.body ?? 'No messages yet'}</p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

