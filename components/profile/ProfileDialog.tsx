"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from "@/components/ui/Button"
import { Profile } from "@/types/db"
import { getNameInitials } from "@/lib/utils"

interface ProfileDialogProps {
  profile: Profile
  onSave: (updates: Partial<Profile>) => Promise<void>
}

export function ProfileDialog({ profile, onSave }: ProfileDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: profile.username || "",
    display_name: profile.display_name || "",
    bio: profile.bio || "",
    contact_email: profile.contact_email || "",
    phone: profile.phone || "",
    grade: profile.grade || "",
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadAvatar = async (file: File): Promise<string | null> => {
    // For now, we'll use a simple data URL approach
    // In production, you'd upload to Supabase Storage or another service
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let updates: Partial<Profile> = { ...formData }
      
      // Upload avatar if a new one was selected
      if (avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile)
        updates.avatar_url = avatarUrl
      }
      
      await onSave(updates)
      setOpen(false)
      setAvatarFile(null)
      setAvatarPreview(null)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Edit Profile
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4 p-4 border border-white/10 rounded-lg">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || profile.avatar_url || undefined} />
                <AvatarFallback>{getNameInitials(profile.username)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-2">
                <label htmlFor="avatar" className="text-sm font-medium cursor-pointer">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
                <p className="text-xs text-gray-400">Upload a profile picture (JPG, PNG)</p>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="bg-white/5 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="display_name" className="text-sm font-medium">
                Display Name
              </label>
              <input
                type="text"
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                className="bg-white/5 rounded-md px-3 py-2 text-sm"
                placeholder="How you want to be displayed"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="grade" className="text-sm font-medium">
                Grade Level
              </label>
              <select
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="bg-white/5 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Grade</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="bg-white/5 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Contact Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                className="bg-white/5 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white/5 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
