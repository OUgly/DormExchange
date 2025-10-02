"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Profile } from "@/types/db"
import Link from "next/link"
import { getNameInitials } from "@/lib/utils"
import { ProfileDialog } from "./ProfileDialog"
import { requestPasswordResetEmail } from "@/lib/auth/reset"

interface ProfileHeaderProps {
  profile: Profile
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>
  userEmail?: string | null
}

export function ProfileHeader({ profile: initialProfile, onUpdateProfile, userEmail }: ProfileHeaderProps) {
  const [profile, setProfile] = useState(initialProfile)
  const hasStripeAccount = !!profile.seller_stripe_account_id
  const [resettingPassword, setResettingPassword] = useState(false)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [resetIsError, setResetIsError] = useState(false)

  const accountEmail = userEmail ?? ""

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

  const handlePasswordReset = async () => {
    setResetMessage(null)
    if (!accountEmail) {
      setResetIsError(true)
      setResetMessage('No email found for your account.')
      return
    }

    setResettingPassword(true)
    try {
      const redirect = `${window.location.origin}/auth/reset?next=${encodeURIComponent('/profile')}`
      await requestPasswordResetEmail(accountEmail, redirect)
      setResetIsError(false)
      setResetMessage('Reset link sent! Check your inbox.')
    } catch (error: any) {
      setResetIsError(true)
      setResetMessage(error?.message ?? "Couldn't send reset email. Try again soon.")
    } finally {
      setResettingPassword(false)
    }
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
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Link href="/messages" className="rounded-lg border px-3 py-1 hover:bg-white/10">Messages</Link>
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resettingPassword}
              className="rounded-lg border px-3 py-1 hover:bg-white/10 disabled:opacity-60"
            >
              {resettingPassword ? 'Sending reset...' : 'Reset password'}
            </button>
            <ProfileDialog profile={profile} onSave={handleUpdate} />
          </div>
          {resetMessage && (
            <p className={`text-xs ${resetIsError ? 'text-red-300' : 'text-emerald-200'}`}>{resetMessage}</p>
          )}
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
          <p className="text-sm">{profile.bio}</p>
        </div>
      )}

      {/* Stripe payouts (Connect) setup */}
      {!profile.seller_charges_enabled && (
        <div className="space-y-3 rounded-lg border border-yellow-600/40 bg-yellow-500/10 p-4">
          <h3 className="text-sm font-medium text-yellow-300">Set up payouts</h3>
          <p className="text-sm text-yellow-200/90">
            To receive money from your sales, complete Stripe Express onboarding.
          </p>
          <div className="flex flex-wrap gap-2">
            <form method="post" action="/api/stripe/connect/onboard">
              <button
                className="mt-1 rounded-md bg-yellow-400 px-3 py-2 text-black font-semibold hover:bg-yellow-300"
                type="submit"
              >
                Set up payouts
              </button>
            </form>
            {hasStripeAccount && (
              <form method="post" action="/api/stripe/connect/dashboard">
                <button
                  className="mt-1 rounded-md border border-yellow-300 px-3 py-2 text-sm text-yellow-200 hover:bg-yellow-300/10"
                  type="submit"
                  formTarget="_blank"
                >
                  Manage payouts
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {profile.seller_charges_enabled && hasStripeAccount && (
        <div className="space-y-3 rounded-lg border border-emerald-600/30 bg-emerald-500/10 p-4">
          <h3 className="text-sm font-medium text-emerald-200">Manage payouts</h3>
          <p className="text-sm text-emerald-100/90">
            Update your bank info or view balances in Stripe Express.
          </p>
          <form method="post" action="/api/stripe/connect/dashboard">
            <button
              className="rounded-md bg-emerald-400 px-3 py-2 text-black font-semibold hover:bg-emerald-300"
              type="submit"
              formTarget="_blank"
            >
              Manage payouts
            </button>
          </form>
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
