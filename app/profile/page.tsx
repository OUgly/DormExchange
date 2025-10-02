import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/server/profile'
import { ProfileSkeleton } from '@/components/profile/loading'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { MyListings } from '@/components/profile/MyListings'
import { updateProfile } from './actions'

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser() // This handles auth redirect

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <Suspense fallback={<ProfileSkeleton />}>
        <div className="space-y-8">
          {/* Profile header with avatar, name, completion */}
          <ProfileHeader
            profile={profile}
            onUpdateProfile={updateProfile}
            userEmail={user.email}
          />
          
          {/* Stats grid */}
          {/* <ProfileStats userId={user.id} /> */}
          
          {/* My Listings Section */}
          <MyListings userId={user.id} />
          
          {/* Tabs: Saved, Settings, etc. */}
          {/* <ProfileTabs userId={user.id} profile={profile} /> */}
        </div>
      </Suspense>
    </main>
  )
}
