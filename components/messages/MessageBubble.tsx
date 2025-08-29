export default function MessageBubble({
  body,
  mine,
  createdAt,
}: {
  body: string
  mine: boolean
  createdAt: string
}) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-accent text-black' : 'bg-white/10 text-white'}`}>
        <div>{body}</div>
        <div className="mt-1 text-[10px] opacity-70">{new Date(createdAt).toLocaleString()}</div>
      </div>
    </div>
  )
}

