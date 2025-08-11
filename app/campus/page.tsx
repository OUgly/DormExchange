import { createServerSupabase } from '@/lib/supabase/server'
import CampusList from './CampusList'

export default async function CampusPage() {
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('campuses')
    .select('slug, name, hero_image_url')
    .order('name')
  return <CampusList campuses={data ?? []} />
}
