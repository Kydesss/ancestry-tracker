import { useUser } from '@clerk/clerk-react'
import { startCheckout } from '../../lib/stripeClient'
import useStore from '../../store/useStore'

const premiumFeatures = [
  'Unlimited family members',
  'Invite family collaborators',
  'Real-time collaborative editing',
  'View &amp; manage shared trees',
  'Priority support',
]

export default function UpgradeModal() {
  const showUpgradeModal = useStore((s) => s.showUpgradeModal)
  const setShowUpgradeModal = useStore((s) => s.setShowUpgradeModal)
  const { user } = useUser()

  if (!showUpgradeModal) return null

  async function handleUpgrade() {
    if (!user) return
    await startCheckout(user.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowUpgradeModal(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-modal max-w-md w-full p-8 z-10">
        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
            ✨ Premium Feature
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Unlock Premium</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Upgrade your plan to access all collaboration and unlimited tree features.
        </p>

        <ul className="space-y-2.5 mb-8">
          {premiumFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
              <svg className="w-4 h-4 text-primary-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-gray-900">$4.99</span>
          <span className="text-gray-400 text-sm"> / month</span>
        </div>

        <button onClick={handleUpgrade} className="btn-primary w-full justify-center text-base py-3 mb-3">
          Upgrade for $4.99/mo
        </button>
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          Maybe Later
        </button>
      </div>
    </div>
  )
}
