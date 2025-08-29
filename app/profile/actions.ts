"use server"

import { createServerClient } from "@/lib/supabase/server"
import { Profile } from "@/types/db"

export async function updateProfile(updates: Partial<Profile>) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}
