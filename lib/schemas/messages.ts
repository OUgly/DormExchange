import { z } from 'zod'

export const UUID = z.string().uuid()

export const NewThreadInput = z.object({
  buyerId: UUID,
  sellerId: UUID,
  listingId: UUID.optional(),
  initialBody: z.string().min(1).max(2000).optional(),
})

export const NewMessageInput = z.object({
  threadId: UUID,
  body: z.string().min(1).max(2000),
})

export type NewThreadInput = z.infer<typeof NewThreadInput>
export type NewMessageInput = z.infer<typeof NewMessageInput>

