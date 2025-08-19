import type { SupabaseClient } from '@supabase/supabase-js'

export const LISTING_BUCKET = 'listing-images'

// Ensure the bucket exists before attempting uploads
async function ensureBucket(client: SupabaseClient) {
  await client.storage.createBucket(LISTING_BUCKET, { public: true }).catch(() => {})
}

// Upload an array of files for a listing and return their public URLs in order
export async function uploadListingImages(
  client: SupabaseClient,
  listingId: string,
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  if (!files.length) return []
  await ensureBucket(client)
  const urls: string[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const path = `${listingId}/${fileName}`
    const { error } = await client.storage.from(LISTING_BUCKET).upload(path, file)
    if (error) throw error
    const { data } = client.storage.from(LISTING_BUCKET).getPublicUrl(path)
    urls.push(data.publicUrl)
    if (onProgress) onProgress(i + 1, files.length)
  }
  return urls
}

// Remove all images under a listing's folder
export async function deleteListingImages(client: SupabaseClient, listingId: string) {
  const { data: files } = await client.storage.from(LISTING_BUCKET).list(listingId)
  if (files && files.length) {
    const paths = files.map((f) => `${listingId}/${f.name}`)
    await client.storage.from(LISTING_BUCKET).remove(paths)
  }
}
