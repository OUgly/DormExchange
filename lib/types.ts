export interface Listing {
  id: string
  title: string
  price: number
  category: string
  condition: string
  description: string
  imageUrls: string[]
  campus: string
  createdAt: string
  userId?: string
  featured?: boolean
}

export interface Message {
  id: string
  listingId: string
  listingTitle: string
  body: string
  createdAt: string
  fromUserId?: string
  toUserId?: string
}
