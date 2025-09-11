import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function PayoutsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let seller_charges_enabled: boolean | null = null
  let seller_stripe_account_id: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('seller_charges_enabled, seller_stripe_account_id')
      .eq('id', user.id)
      .maybeSingle()
    seller_charges_enabled = (profile?.seller_charges_enabled as boolean) ?? null
    seller_stripe_account_id = (profile?.seller_stripe_account_id as string) ?? null
  }

  const isReturn = typeof searchParams?.return !== 'undefined'
  const isRefresh = typeof searchParams?.refresh !== 'undefined'

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Payouts</h1>

      {(isReturn || isRefresh) && (
        <div className="mb-4 rounded-md bg-blue-100 p-3 text-blue-900">
          {isReturn
            ? 'You have returned from Stripe onboarding.'
            : 'Onboarding link refreshed.'}
        </div>
      )}

      {user ? (
        <div className="space-y-4 rounded-lg border border-gray-300 p-4 bg-white/5">
          <p className="text-sm text-gray-200">
            Account: <span className="font-mono">{user.email}</span>
          </p>
          <p className="text-sm">
            Status: {' '}
            {seller_charges_enabled
              ? 'Payouts enabled'
              : 'Payouts not set up'}
          </p>
          {seller_stripe_account_id && (
            <p className="text-xs text-gray-400">
              Stripe account: {seller_stripe_account_id}
            </p>
          )}
          {!seller_charges_enabled && (
            <form method="post" action="/api/stripe/connect/onboard">
              <button
                className="mt-2 rounded-md bg-yellow-400 px-3 py-2 text-black font-semibold hover:bg-yellow-300"
                type="submit"
              >
                Set up payouts
              </button>
            </form>
          )}
          <div>
            <a
              href="/profile"
              className="inline-block rounded-md border px-3 py-2 text-sm hover:bg-white/10"
            >
              Back to Profile
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-md bg-yellow-100 p-3 text-yellow-900">
          You are not signed in.
        </div>
      )}
    </main>
  )
}

