'use client'

// Comment thread for a single listing.
import { useEffect, useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase/client'
import Input from './ui/Input'
import Button from './ui/Button'
import { Comment } from '@/types/db'

interface Props {
  listingId: string
}

export default function CommentSection({ listingId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true })
    setComments((data as Comment[]) ?? [])
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    await supabase.from('comments').insert({
      content: newComment,
      listing_id: listingId,
      user_id: user.id,
    })
    setNewComment('')
    fetchComments()
  }

  return (
    <div className="mt-8">
      <h4 className="mb-2 font-semibold">Comments</h4>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="rounded bg-gray-100 p-2">
            {c.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <Button type="submit">Post</Button>
      </form>
    </div>
  )
}
