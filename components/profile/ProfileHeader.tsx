"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Profile } from "@/types/db"
import Link from "next/link"
import { getNameInitials } from "@/lib/utils"
import { ProfileDialog } from "./ProfileDialog"

interface ProfileHeaderProps {
  profile: Profile
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>
}

export function ProfileHeader({ profile: initialProfile, onUpdateProfile }: ProfileHeaderProps) {
  const [profile, setProfile] = useState(initialProfile)

  // Calculate profile completion based on filled fields
  const calculateCompletion = () => {
    const fields = [
      { name: 'username', value: profile.username },
      { name: 'display_name', value: profile.display_name },
      { name: 'avatar_url', value: profile.avatar_url },
      { name: 'bio', value: profile.bio },
      { name: 'campus_id', value: profile.campus_id },
      { name: 'contact_email', value: profile.contact_email },
      { name: 'phone', value: profile.phone },
      { name: 'grade', value: profile.grade },
      { name: 'listings_count', value: profile.listings_count > 0 },
    ]

    const filledFields = fields.filter(field => {
      const isFilled = field.value !== null && field.value !== undefined && field.value !== ""
      return isFilled
    })

    return Math.round((filledFields.length / fields.length) * 100)
  }

  const handleUpdate = async (updates: Partial<Profile>) => {
    await onUpdateProfile(updates)
    // Update local state to reflect changes immediately
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const completion = calculateCompletion()

  return (
    <div className="flex flex-col gap-6 p-6 bg-white/5 rounded-lg backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>{getNameInitials(profile.username)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">
              {profile.display_name || profile.username}
            </h1>
            {profile.display_name && profile.username !== profile.display_name && (
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {profile.member_status === "founder"
                ? "DormXchange Founder"
                : profile.member_status === "cofounder"
                ? "DormXchange Co-founder"
                : "DormXchange Member"}
            </p>
            {profile.grade && (
              <p className="text-sm text-muted-foreground">
                Grade: {profile.grade}
              </p>
            )}
            <div className="flex gap-3 mt-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Listings: </span>
                <span className="font-medium">{profile.listings_count}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Messages: </span>
                <span className="font-medium">{profile.messages_sent}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Ratings: </span>
                <span className="font-medium">{profile.ratings_received}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/messages" className="rounded-lg border px-3 py-1 hover:bg-white/10">Messages</Link>
          <ProfileDialog profile={profile} onSave={handleUpdate} />
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
          <p className="text-sm">{profile.bio}</p>
        </div>
      )}

      {/* Contact Info */}
      {(profile.contact_email || profile.phone) && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
          <div className="space-y-1">
            {profile.contact_email && (
              <p className="text-sm">Email: {profile.contact_email}</p>
            )}
            {profile.phone && (
              <p className="text-sm">Phone: {profile.phone}</p>
            )}
          </div>
        </div>
      )}

      {/* Profile Completion - Hide when 100% */}
      {completion < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Profile Completion</span>
            <span>{completion}%</span>
          </div>
          <Progress value={completion} />
          <p className="text-xs text-muted-foreground">
            Complete your profile to help others connect with you better!
          </p>
        </div>
      )}
    </div>
  )
}
