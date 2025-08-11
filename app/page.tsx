import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/campus')
  }

  // If user is authenticated, check if they have selected a campus
  const { data: profile } = await supabase
    .from('profiles')
    .select('campus_id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.campus_id) {
    redirect('/campus')
  }

  // User is authenticated and has selected a campus
  redirect('/market')
}
